var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var lcd = require('./lcd');
var display = new lcd.LCD(0);

auth({ host : "10.10.107.39" }).then(function(ddp){
  flex(3, function(){
    console.log("Flex motion!");
  })  
}).done();