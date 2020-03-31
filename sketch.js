/*
	Microphone Visualization First Iteration
*/

var mic, fft;
var sensibility;

var LocalData;

var bgcolor;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  Id = socket.Id;

  socket.on('mic',
    // When we receive data
    function (data) {
      LocalData = data;
      // console.log(data);
      // Draw a blue circle
      // fill(0,0,255);
      // noStroke();
      // ellipse(data.x,data.y,80,80);
    }
  );
}

function draw() {

  background(246, 246, 246);

  TileSize = 70;
  var FrameMargin = 20;
  var columnsNo = Math.floor((windowWidth - 250 - 1.5 * FrameMargin) / TileSize);
  var rowsNo = Math.floor((windowHeight - 2 * FrameMargin) / TileSize);

  var margin = 0.9;

  if (margin < 10) {
    columnsNo = columnsNo + 1
  }

  push();



  for (var x = 0; x < columnsNo; x++) {
    for (var y = 0; y < rowsNo; y++) {

      noStroke();
      fill(210, 210, 210);

      square(FrameMargin + x * TileSize, FrameMargin + y * TileSize, TileSize * margin);

    }
  }
  pop();
  push();
  noStroke();
  fill(240,240,240);
  var RightMargin = windowWidth - 250;
  rect(RightMargin, 0, windowWidth, windowHeight);
  pop();

  push();
 
  noStroke();
  fill(bgcolor);
  var PersonalTileSize = 180;
  square(RightMargin+(250-PersonalTileSize)/2, FrameMargin, PersonalTileSize);
  pop();


  if (LocalData != null && LocalData[socket.id] != null) {








    bgcolor = LocalData[socket.id].color.hex;
  }



  noStroke();
  fill(255);
  textSize(20);



  var volume = mic.getLevel();
  if (volume > 0.01) {
    sendmouse(volume);
  }




  var heightAux1 = map(volume * sensibility, 0, 1, 50, 400);

  noFill();
  strokeWeight(heightAux1 / 8);
  stroke('#A37B73');
  ellipse(windowWidth - 250 +PersonalTileSize/2+1.5*FrameMargin,PersonalTileSize/2+FrameMargin, 100 + heightAux1 / 8, 100 + heightAux1 / 8);

}

function mouseMoved() {
  userStartAudio();
}

// // Function for sending to the socket
function sendmouse(volume) {
  // We are sending!
  // console.log("Send MicVolume: " + volume);


  var data = {
    Id: socket.id,
    Volume: volume
  };


  socket.emit('mic', data);
}