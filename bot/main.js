var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var accel = require('./accel');
var touch = require('./touch');
var bluetooth = require('./bluetooth');
var q = require('q');
var exec = require("child_process").exec;

auth({ host : "10.10.107.39" }).then(function(ddp){
  console.log("Connected", ddp.user.id);

  // Store bluetooth address
  // var bt = exec("rfkill unblock bluetooth && bluetoothctl discoverable on");
  // bt.once('data', function(result){
  //   var mac = /.{2}:.{2}:.{2}:.{2}:.{2}:.{2}/img.exec(result);
  //   ddp.call("setBluetoothMac", [mac]);
  // })

  function self() {
    var user = ddp.collections.users[ddp.user.id];
    user.voice = user.profile.name == "thomas" ? "Alex" : "Veena";
    return user;
  }

  var selfPromise = q.ninvoke(ddp, 'subscribe', 'userStatus', []).then(self);

  function runDemo(me, ddp){
    ddp.call('speak', ['Are you ready to play?', me.voice]);
    // turn head to dance mode
    changeFace(ddp,3);
    myUln200xa_obj.goForward();

    q.delay(2000)
      .then(function(){ 
        ddp.call('speak', ['Lets dance together!', me.voice]);
        return q.nfcall(touch,6);
      })
      .then(function(){
        ddp.call('speak', ["A fancy, dancy!", me.voice]);
        return q.delay(1000).then(function(){
          ddp.call('speak', ["Yay, we are dancing!", me.voice]);
        });
        myUln200xa_obj.goForward();
        return 1;
      })
      .then(function(){
        ddp.call('addMessage', 'seconddemo', 'lisa');
      });
  }

  var anticipate = false;
  function runSecondDemo(me, ddp) {
    anticipate = false;
    q.delay(3000)
      .then(function(){ 
        ddp.call('speak', ['Would you like to play? Can you make me fly?', me.voice]);
        myUln200xa_obj.goForward();
        return q.nfcall(accel);
      })
      .then(function(){ return q.delay(1000); })
      .then(function(){ 
        ddp.call('speak', ['That! was! fun! Can we play with Thomas?', me.voice]);
        anticipate = true;
        return q.nfcall(bluetooth(me, ddp.collections.users));
      })
  }

  // Onze todo's
  ddp.subscribe('userInbox', []);
  var taskObserver = ddp.observe("inbox");
  taskObserver.added = function(id) {
    var message = ddp.collections.inbox[id];
    console.log("received message:", message);

    selfPromise.then(function(me){
      if(message.content == "demo") {
        runDemo(me, ddp);
      } else if(message.content == "seconddemo") {
        runSecondDemo(me, ddp);
      } else if(message.content == 'party') {
        myUln200xa_obj.go(1024);
        if(anticipate) {
          ddp.call('speak', ["Hi Lisa!", me.voice]);
        }
      } else if(typeof message.content == 'string') {
        ddp.call('speak', [message.content, me.voice]);
      }
    });
    
    ddp.call('markTaskDone', [id]);
  };

  // Keep DDP connection active
  setInterval(function() { ddp.call('ping', []); }, 3000);

  // start program

  // vraag om te spelen

  // vraag om te dansen of optillen

  // uitvoeren dansen/optillen

  // als klaar -> server bericht

  // andere bot activeren

  // vraag om te dansen of optillen

  // uitvoeren dansen/optillen

  // vragen naar andere bot brengen.

}).done();

function tickle(ddp){
  // Tickling
  var i = 0;
  var m = ["Don't tickle me!", "That tickles!"];
  flex(3, function(){
    console.log("Flex motion!");
     ddp.call('speak', [m[i++ % m.length], "Alex"]);
  });
}

// TODO: add motor function calls
function changeFace(ddp, number) {
  switch(number) {
    case 1: 
      // rotateMotorToFacePosition(1);
      setTimeout(function() { ddp.call('setFace', "faces-01.jpg", "thomas") }, 1000);
      break;
    case 2: 
      // rotateMotorToFacePosition(2);
      setTimeout(function() { ddp.call('setFace', "faces-02.jpg", "thomas") }, 1000);
      break;
    case 3:
    default:
      // rotateMotorToFacePosition(3);
      setTimeout(function() { ddp.call('setFace', "faces-03.jpg", "thomas") }, 1000);   
  }
}

// motor function
var Uln200xa_lib = require('jsupm_uln200xa');
// Instantiate a Stepper motor on a ULN200XA Darlington Motor Driver
// This was tested with the Grove Geared Step Motor with Driver
// Instantiate a ULN2003XA stepper object
var myUln200xa_obj = new Uln200xa_lib.ULN200XA(4096, 8, 9, 10, 11);
var facing = 3;

myUln200xa_obj.goForward = function()
{
    myUln200xa_obj.setSpeed(7); // 5 RPMs
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
    console.log("Rotating 1 revolution clockwise.");
    myUln200xa_obj.stepperSteps(4096);
};
myUln200xa_obj.go = function(c)
{
    myUln200xa_obj.setSpeed(7); // 5 RPMs
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
    console.log("Rotating 1 revolution clockwise.");
    myUln200xa_obj.stepperSteps(c);
};

myUln200xa_obj.stop = function()
{
  myUln200xa_obj.release();
};

myUln200xa_obj.quit = function()
{
  myUln200xa_obj = null;
  Uln200xa_lib.cleanUp();
  Uln200xa_lib = null;
  console.log("Exiting");
  process.exit(0);
};

myUln200xa_obj.setSpeed(7); // 7 RPMs

function rotateMotorToFacePosition(newface){
var steps = 0;
    console.log("facing"+newface);
    if (newface < facing) {
        steps = (facing - newface) * 1024;
        //console.log(steps);
        myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CCW);
        myUln200xa_obj.stepperSteps(steps);
    } else {
        steps = (newface - facing) * 1024;
        //console.log(steps);
        myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
        myUln200xa_obj.stepperSteps(steps);
    }
    facing = newface;
}