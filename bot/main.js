var mraa = require('mraa');
var flex = require('./flex');
var lcd = require('./lcd');
var display = new lcd.LCD(0);

flex(3, function(){
  console.log("Flex motion!");
})