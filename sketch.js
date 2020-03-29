/*
	Check it out:
	https://p5js.org/examples/sound-mic-input.html
*/

var mic;
var sensibility;

function setup() {
  createCanvas(320, 450);

	sensibility=4;
	
  // Crea el Audio input
  mic = new p5.AudioIn();
	//Inicia el Audio Input
  mic.start();
}

function draw() {
  background('#F7D488');
	
	noStroke();
	fill(255);
	textSize(20);
	text('USE THE MICROPHONE', 52, 30);

  // Obtiene el volumen (entre 0 y 1.0)
  var volume = mic.getLevel();
  
	//redefine el rango de vol (entre 0 y 1.0) en el rango entre -> 50 y 400

  var heightAux1 = map(volume*sensibility, 0, 1, 50,400);
	// restringe el valor de h entre -> 25 y height -25
	//var heightAux2 = constrain(heightAux1, 50 , height-25);
	
	noFill();
	strokeWeight(heightAux1/8);
	stroke('#A37B73');
	ellipse(width/2, height/2 , 100+heightAux1/8, 100+heightAux1/8);
}