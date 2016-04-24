var mraa = require('mraa');

function detect(pin, callback) //
{
	// setup digital read on pin
	var pin = new mraa.Gpio(pin);
	// set the gpio direction to input
	pin.dir(mraa.DIR_IN);
	// upon stop of touch, call callback
	pin.isr(mraa.EDGE_FALLING, function(){
		pin.isrExit();
		setTimeout(callback, 0);
	});
}

module.exports = detect;
