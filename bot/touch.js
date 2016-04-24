var mraa = require('mraa'); //require mraa
// console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

function detect(pin, callback) //
{
	var digitalPin = new mraa.Gpio(pin); //setup digital read on pin
	digitalPin.dir(mraa.DIR_IN); //set the gpio direction to input
	digitalPin.isr(mraa.EDGE_FALLING, function(){
		setTimeout(callback, 0);
	});
}

module.exports = detect;
