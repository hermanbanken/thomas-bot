var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var lcd = require('./lcd');
var display = new lcd.LCD(0);

auth({ host : "10.10.107.39" }).then(function(ddp){
  flex(3, function(){
    console.log("Flex motion!");
  })

  ddp.call(
      'speak',
      ["Ik ben opgestart! Getekend, Thomas.", "Xander"],
      function (err, result) {   // callback which returns the method call results 
        console.log('called function, result: ' + result);
      },
      function () {              // callback which fires when server has finished 
        console.log('updated');  // sending any updated documents as a result of 
        console.log(ddp.collections.users);  // calling this method 
      }
    );
}).done();