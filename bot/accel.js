var five = require("johnny-five");
var Edison = require("edison-io");

module.exports = function(callback) {
  var board = new five.Board({ io: new Edison() });

  var i = 0;
  board.on("ready", function() {
    console.log("Board ready");
    // Plug the MMA7660 Accelerometer module into an I2C jack
    var accelerometer = new five.Accelerometer({ controller: "MMA7660" });
    // this.samplingInterval(20);
    accelerometer.on("data", function() {
      console.log("accelerometer "+(i++));
      console.log("  x            : ", this.x);
      console.log("  y            : ", this.y);
      console.log("  z            : ", this.z);
      console.log("  pitch        : ", this.pitch);
      console.log("  roll         : ", this.roll);
      console.log("  acceleration : ", this.acceleration);
      console.log("  inclination  : ", this.inclination);
      console.log("  orientation  : ", this.orientation);
      console.log("--------------------------------------");
    });
    accelerometer.enable();
  });

}


