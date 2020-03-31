/*
	Microphone Visualization First Iteration
*/

var mic, fft;
var sensibility;

var LocalData;

var bgcolor;

var heightAux2 = 0;
var PixelEntry;

var columnsNo = 0;
var rowsNo = 0;

var GridInit = true;

var Id;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // sendGrid(columnsNo, rowsNo);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgcolor = color(255);

  socket = io.connect('http://localhost:8080');

  sensibility = 4;



  getAudioContext().suspend();
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  Id = socket.id;

  socket.on('PublicData',
    // When we receive data
    function (data) {
      LocalData = data;
    }
  );



}

function draw() {


  background(246, 246, 246);

  var RightMargin = 250;
  TileSize = 70;
  var FrameMargin = 20;
  columnsNo = Math.floor((windowWidth - RightMargin) / TileSize);
  rowsNo = Math.floor((windowHeight - 2 * FrameMargin) / TileSize);

  if (LocalData != null) {


    var Microphones = [];
    var Positions = [];

    for (var i = 0; i < LocalData.length; i++) {
      Microphones.push(Object.values(LocalData[i])[0].Volume);
      Positions.push(Object.values(LocalData[i])[0].position);
      if (Object.keys(LocalData[i])[0] === socket.id) {
        bgcolor = (Object.values(LocalData[i])[0].color.hex);
      }
    }
    console.log(Positions[0].x,Positions[0].y);


    if (GridInit && socket.id) {

      sendGrid(columnsNo, rowsNo);
      GridInit = false;
    }
    var margin = 0.9;


    push();


    for (var x = 0; x < columnsNo; x++) {
      for (var y = 0; y < rowsNo; y++) {

        noStroke();
        fill(210, 210, 210);

        square(FrameMargin + x * TileSize, FrameMargin + y * TileSize, TileSize * margin);
        push();
        fill(214, 218, 255, Aux(Microphones[0]));
        square(FrameMargin + Positions[0].x * TileSize, FrameMargin + Positions[0].y * TileSize, TileSize * margin);
        pop();
      }
    }
  }
  pop();
  push();
  noStroke();
  fill(246, 246, 246);

  rect(windowWidth - RightMargin, 0, windowWidth, windowHeight);
  pop();

  push();

  noStroke();
  fill(bgcolor);
  var PersonalTileSize = 180;
  square(windowWidth - RightMargin + (RightMargin - PersonalTileSize) / 2, FrameMargin, PersonalTileSize);
  pop();






  noStroke();
  fill(255);
  textSize(20);



  var volume = mic.getLevel();
  if (volume > 0.01) {
    sendmouse(volume);

  }




  var heightAux1 = map(volume * sensibility, 0, 1, 50, 400);
  function Aux(volume) {
    var heightAux = map(volume * sensibility, 0, 1, 0, 100);
    return heightAux;
  }

  noFill();
  strokeWeight(heightAux1 / 8);
  stroke('#A37B73');
  ellipseMode(CENTER);
  ellipse(windowWidth - RightMargin + (RightMargin - PersonalTileSize) / 2 + PersonalTileSize / 2, PersonalTileSize / 2 + FrameMargin, 100 + heightAux1 / 8, 100 + heightAux1 / 8);

}

function mouseMoved() {
  userStartAudio();
}

// // Function for sending to the socket
function sendmouse(volume) {
  // We are sending!
  // console.log("Send MicVolume: " + volume);


  var data = {
    [socket.id]: { Volume: volume, Grid: { x: columnsNo, y: rowsNo } }
  };


  socket.emit('mic', data);
}
function sendGrid(columnsNo, rowsNo) {


  var data = {
    [socket.id]: { x: columnsNo, y: rowsNo }
  };

  socket.emit('grid', data);
}
