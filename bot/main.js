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
  var m = ["Kietel niet zo!", "Houd op!"];
  
  flex(3, function(){
    console.log("Flex motion!");
     ddp.call('speak', [m[i++ % m.length], "Xander"]);
  })

  q.nfcall(accel)
    .then(function() { ddp.call('speak', ["Opgetild", "Xander"]); })
    .then(function() { return q.delay(5000) });

  // Weten welke gebruikers er zijn
  ddp.subscribe('userStatus', [], function(){
    console.log(ddp.collections.users);
  });

  function runDemo(){
    
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
      //rotateMotorToFacePosition(1);
      ddp.call('setFace', "faces-01.jpg", "thomas");
      break;
    case 2: 
      //rotateMotorToFacePosition(2);
      ddp.call('setFace', "faces-02.jpg", "thomas");
      break;
    case 3:
    default:
      //rotateMotorToFacePosition(3);
      ddp.call('setFace', "faces-03.jpg", "thomas");   
  }
}