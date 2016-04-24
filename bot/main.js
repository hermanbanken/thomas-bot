var auth = require('./auth');
var mraa = require('mraa');
var flex = require('./flex');
var touch = require('./touch');
var lcd = require('./lcd');
var display = new lcd.LCD(0);
var q = require('q');

auth({ host : "10.10.107.39" }).then(function(ddp){
  // flex(3, function(){
  //   console.log("Flex motion!");
  // })

  q.nfcall(touch, 6)
    .then(touch, 2)
  	.then(function(v){
  		console.log("Both sensors were touched!");
	})

// exercise().then(exercise);

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

function exercise(){

	return q(1);

}