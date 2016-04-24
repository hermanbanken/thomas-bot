var mraa = require('mraa');
var lib = require('jsupm_mma7660');

module.exports = function(callback) {

  // connect interrupt of Accelerometer to GPIO pin 4
  var pin = new mraa.Gpio(4);                      
  pin.dir(mraa.DIR_IN);                            
  pin.isr(mraa.EDGE_RISING, function(){
    setTimeout(callback, 0);
    stop();
  });

  function stop(){
    pin.isrExit();
    //read dummy to reset interrupt
    accel.readByte(0x00);    
    accel.setModeStandby();
  }

  var accel = new lib.MMA7660(
    lib.MMA7660_I2C_BUS,
    lib.MMA7660_DEFAULT_I2C_ADDR);
  
  // place device in standby mode for configuration
  accel.setModeStandby();
  //Configure Int controll to activate on shake/tap
  accel.writeByte(0x06, 0xE4);
  //Blank samples register
  accel.writeByte(0x08, 0x00);
  //Write the interrupt register: 111+counts
  accel.writeByte(0x09, 0xE1);
  //set into Active mode,without sleep and enabled interrupts
  accel.writeByte(0x07, 0xC9);

}