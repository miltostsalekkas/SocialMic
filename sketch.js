let mic;
let meter;

// Create a new canvas to the browser size
function setup () {
  createCanvas(windowWidth, windowHeight);

  // The audio meter
  meter = new Tone.Meter();
}

// On window resize, update the canvas size
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  // For consistent sizing regardless of portrait/landscape
  const dim = Math.min(width, height);
  
  // Black background
  background(0);
    
  // Draw a 'play' button
  noStroke();
  if (mic && mic.state === 'started') {
    const diameter = dim * 0.2;
    fill('tomato');
    circle(width / 2, height / 2, diameter);
    
    noFill();
    stroke('tomato');
    const levelDiameter = map(meter.getLevel(), -100, -30, diameter, diameter * 3, true);
    circle(width / 2, height / 2, levelDiameter);
  } else {
    fill(255);
    polygon(width / 2, height / 2, dim * 0.1, 3);
  }
}

async function mousePressed () {
  if (mic) {
    // stop recording
    mic.dispose();
    // Clear mic so we can create another on next click
    mic = null;
  } else {
    // Create a new mic
    mic = new Tone.UserMedia();
    
    // open it asks for user permission
    await mic.open();
    
    console.log('Opened Microphone:', mic.label);
    
    // NOTE: Don't connect to Master unless you have headphones in!
    // mic.connect(Tone.Master);
    
    // But you will want to connect it to analysers or meters
    mic.connect(meter);
  }
}

// Draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
