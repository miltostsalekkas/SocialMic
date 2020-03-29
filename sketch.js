/*
	Microphone Visualization First Iteration
*/

var mic;
var sensibility;


function setup() {
  createCanvas(windowWidth, windowHeight);

  sensibility = 4;

  getAudioContext().suspend();
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


  var volume = mic.getLevel();


  var heightAux1 = map(volume * sensibility, 0, 1, 50, 400);
 
  noFill();
  strokeWeight(heightAux1 / 8);
  stroke('#A37B73');
  ellipse(width / 2, height / 2, 100 + heightAux1 / 8, 100 + heightAux1 / 8);

}

function mouseMoved() {
  userStartAudio();
}
