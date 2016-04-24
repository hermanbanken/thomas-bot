var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var accel = require('./accel');
// var touch = require('./touch');
// var lcd = require('./lcd');
// var display = new lcd.LCD(0);
var q = require('q');


auth({ host : "10.10.107.39" }).then(function(ddp){
  console.log("Connected");

  // Even belangrijk doen
  //ddp.call('speak', ["Ik ben opgestart! Getekend, Thomas.", "Xander"]);

  // Kietelen
  var i = 0;
  var m = ["Don't tickle me!", "That tickles!"];
  
  flex(3, function(){
    console.log("Flex motion!");
     ddp.call('speak', [m[i++ % m.length], "Alex"]);
  })

  q.nfcall(accel)
    .then(function() { ddp.call('speak', ["Opgetild", "Alex"]); })
    .then(function() { return q.delay(5000) });

  // Weten welke gebruikers er zijn
  ddp.subscribe('userStatus', [], function(){
    console.log(ddp.collections.users);
  });

  function runDemo(){
    ddp.call('speak', 'Are you ready to play?', 'Alex');
    // turn head to dance mode

    setInterval(function() {

      ddp.call('speak', 'Lets dance together!', 'Alex');      
    }, 2000);
  }
  // To change face:
  changeFace(ddp, 1);

  // Onze todo's
  ddp.subscribe('userInbox', []);
  var taskObserver = ddp.observe("inbox");
  taskObserver.added = function(id) {
    var message = ddp.collections.inbox[id];
    console.log("received message:", message);

    if(message.content == "demo") {
      runDemo();
    } else if(typeof message.content == 'string') {
      ddp.call('speak', [message.content, "Xander"]);
    }

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

// TODO: add motor function calls
function changeFace(ddp, number) {
  switch(number) {
    case 1: 
      rotateMotorToFacePosition(1);
      setInterval(function() { ddp.call('setFace', "faces-01.jpg", "thomas") }, 1000);
      break;
    case 2: 
      rotateMotorToFacePosition(2);
      setInterval(function() { ddp.call('setFace', "faces-02.jpg", "thomas") }, 1000);
      break;
    case 3:
    default:
      rotateMotorToFacePosition(3);
      setInterval(function() { ddp.call('setFace', "faces-03.jpg", "thomas") }, 1000);   
  }
}



// motor function
var Uln200xa_lib = require('jsupm_uln200xa');
// Instantiate a Stepper motor on a ULN200XA Darlington Motor Driver
// This was tested with the Grove Geared Step Motor with Driver
// Instantiate a ULN2003XA stepper object
var myUln200xa_obj = new Uln200xa_lib.ULN200XA(4096, 8, 9, 10, 11);
var facing = 3;
​
myUln200xa_obj.stop = function()
{
  myUln200xa_obj.release();
};
​
myUln200xa_obj.quit = function()
{
  myUln200xa_obj = null;
  Uln200xa_lib.cleanUp();
  Uln200xa_lib = null;
  console.log("Exiting");
  process.exit(0);
};
​
myUln200xa_obj.setSpeed(7); // 7 RPMs
​
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