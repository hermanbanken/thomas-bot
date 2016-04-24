var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var lcd = require('./lcd');
var display = new lcd.LCD(0);

auth({ host : "10.10.107.39" }).then(function(ddp){

  // Even belangrijk doen
  ddp.call('speak', ["Ik ben opgestart! Getekend, Thomas.", "Xander"]);

  // Kietelen
  var i = 0;
  var m = ["Kietel niet zo!", "Houd op!"];
  flex(3, function(){
    console.log("Flex motion!");
    ddp.call('speak', [m[i++ % m.length], "Xander"]);
  })

  // Weten welke gebruikers er zijn
  ddp.subscribe('userStatus', [], function(){
    console.log(ddp.collections.users);
  });

  // Onze todo's
  ddp.subscribe('userInbox', []);
  var taskObserver = ddp.observe("inbox");
  taskObserver.added = function(id) {
    console.log("[ADDED] to " + taskObserver.name + ":  " + id);
  };

}).done();