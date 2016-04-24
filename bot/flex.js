var sensorModule = require('jsupm_ldt0028');

var SAMPLES_PER_SECOND = 100;
var THRESHOLD = 100;

function detect(pin, callback) {
	// Create the LDT0-028 Piezo Vibration Sensor object using AIO pin 0
	var sensor = new sensorModule.LDT0028(pin);
	var buffer = [];
	var i = setInterval(function(){
		buffer.push(sensor.getSample());
		
		if(buffer.length > SAMPLES_PER_SECOND / 4) {
			var bigger = buffer.filter(function(v) { return v > THRESHOLD; }).length;
			// At least two values must be bigger than the threshold
			if(bigger > 2) {
				callback();
			}
			buffer = buffer.slice(-1);
		}
	}, 10);
	// disposable
	return function(){
		clearInterval(i);
	};
}

module.exports = detect;
