// Physical Computing Explorer
// CANVAS_HEIGHT: 420
// Sense -> Decide -> Act: three layers of a physical computing system.
// Click any input/processor/output to read what it does. Press "Play Loop"
// to animate information flowing left to right through the system.

let canvasWidth = 700;
let drawHeight = 370;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let playButton;
let playing = false;
let particles = [];
let particlePhase = 0;

// Selected element info shown in the info bar
let selected = null;

// Layout objects recomputed each frame so click detection matches drawing
let inputNodes = [];
let outputNodes = [];
let processorBox = null;

// Static definitions (geometry computed in computeLayout)
const inputDefs = [
  { name: 'Distance Sensor (ToF)', info: 'Time-of-flight sensor: measures reflected infrared light to find the distance to the nearest obstacle. Example reading: 24 cm.' },
  { name: 'Line Sensors (IR)', info: 'Infrared line sensors look down at the floor and report dark vs. light. Example reading: left = dark, right = light (drifting off the line).' },
  { name: 'Bump Sensor', info: 'A bump (touch) switch closes when the robot hits something. Example reading: pressed = True (collision detected).' }
];
const outputDefs = [
  { name: 'DC Motors', info: 'DC motors spin the wheels to move the robot. Example value: speed = 75 means 75% of full power forward.' },
  { name: 'NeoPixel LEDs', info: 'Addressable color LEDs show status. Example value: (255, 0, 0) lights the pixel bright red.' },
  { name: 'OLED Display', info: 'A small screen prints text and graphics. Example value: show "Dist: 24 cm" on row 0.' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => {});
  textSize(defaultTextSize);

  playButton = createButton('Play Loop');
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(togglePlay);
  positionControls();

  describe('Diagram of a physical computing system with three columns: input sensors on the left, a processor in the center, and output actuators on the right. Click any element for an explanation; press Play Loop to animate the sense, decide, act cycle.', LABEL);
}

function positionControls() {
  playButton.position(canvasWidth / 2 - 45, drawHeight + 12);
}

function togglePlay() {
  playing = !playing;
  playButton.html(playing ? 'Pause Loop' : 'Play Loop');
}

function computeLayout() {
  const colInX = canvasWidth * 0.16;
  const colCtrX = canvasWidth * 0.5;
  const colOutX = canvasWidth * 0.84;
  const iconW = min(150, canvasWidth * 0.24);
  const iconH = 52;
  const topY = 78;
  const gapY = 70;

  inputNodes = inputDefs.map((d, i) => ({
    ...d,
    x: colInX - iconW / 2,
    y: topY + i * gapY,
    w: iconW,
    h: iconH,
    cx: colInX,
    cy: topY + i * gapY + iconH / 2
  }));
  outputNodes = outputDefs.map((d, i) => ({
    ...d,
    x: colOutX - iconW / 2,
    y: topY + i * gapY,
    w: iconW,
    h: iconH,
    cx: colOutX,
    cy: topY + i * gapY + iconH / 2
  }));
  const pw = min(170, canvasWidth * 0.26);
  const ph = 110;
  processorBox = {
    name: 'Cytron Maker Pi RP2040',
    info: 'The microcontroller reads every input, runs your MicroPython code, and decides which outputs to trigger — all in milliseconds. This is the "decide" stage of the loop.',
    x: colCtrX - pw / 2,
    y: 140,
    w: pw,
    h: ph,
    cx: colCtrX,
    cy: 140 + ph / 2
  };
}

function draw() {
  updateCanvasSize();
  computeLayout();

  // Drawing area
  noStroke();
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  // Control area
  noStroke();
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Physical Computing: Sense -> Decide -> Act', canvasWidth / 2, 10);

  // Column headers
  textSize(15);
  fill('#555');
  text('INPUTS (Sense)', canvasWidth * 0.16, 50);
  text('PROCESSOR (Decide)', canvasWidth * 0.5, 50);
  text('OUTPUTS (Act)', canvasWidth * 0.84, 50);

  // Connection wires (input -> processor -> output)
  drawWires();

  // Particles
  if (playing) {
    particlePhase += 0.01;
    if (frameCount % 10 === 0) spawnParticle();
    updateParticles();
  }
  drawParticles();

  // Icons
  inputNodes.forEach((n, i) => drawInputIcon(n, i));
  drawProcessor(processorBox);
  outputNodes.forEach((n, i) => drawOutputIcon(n, i));

  // Info bar at bottom of drawing region
  drawInfoBar();

  // Restore defaults
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawWires() {
  stroke('#90a4ae');
  strokeWeight(2);
  // input rows feed into the left of the processor
  inputNodes.forEach(n => {
    drawDashed(n.x + n.w, n.cy, processorBox.x, processorBox.cy);
  });
  // processor feeds each output row
  outputNodes.forEach(n => {
    drawDashed(processorBox.x + processorBox.w, processorBox.cy, n.x, n.cy);
  });
  strokeWeight(1);
}

function drawDashed(x1, y1, x2, y2) {
  const segs = 18;
  for (let i = 0; i < segs; i++) {
    if (i % 2 === 0) {
      const t1 = i / segs, t2 = (i + 1) / segs;
      line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
    }
  }
}

function spawnParticle() {
  // leg 0: input -> processor, leg 1: processor -> output
  const inIdx = floor(random(inputNodes.length));
  particles.push({ leg: 0, t: 0, inIdx: inIdx, outIdx: floor(random(outputNodes.length)) });
}

function updateParticles() {
  for (let p of particles) {
    p.t += 0.03;
    if (p.t >= 1) {
      if (p.leg === 0) { p.leg = 1; p.t = 0; }
      else { p.done = true; }
    }
  }
  particles = particles.filter(p => !p.done);
}

function drawParticles() {
  noStroke();
  fill('#e65100');
  for (let p of particles) {
    let x, y;
    if (p.leg === 0) {
      const a = inputNodes[p.inIdx];
      x = lerp(a.x + a.w, processorBox.x, p.t);
      y = lerp(a.cy, processorBox.cy, p.t);
    } else {
      const b = outputNodes[p.outIdx];
      x = lerp(processorBox.x + processorBox.w, b.x, p.t);
      y = lerp(processorBox.cy, b.cy, p.t);
    }
    circle(x, y, 9);
  }
}

function isSelected(node) {
  return selected && selected.name === node.name;
}

function drawInputIcon(n, i) {
  stroke('black');
  strokeWeight(2);
  fill(isSelected(n) ? '#f9a825' : 'white');
  rect(n.x, n.y, n.w, n.h, 6);
  // simple sensor glyph
  noStroke();
  fill(['#1565c0', '#6a1b9a', '#2e7d32'][i]);
  if (i === 0) { // ToF: ellipse "beam"
    ellipse(n.x + 18, n.cy, 16, 16);
  } else if (i === 1) { // IR: two dots
    circle(n.x + 14, n.cy, 9); circle(n.x + 26, n.cy, 9);
  } else { // bump: small triangle
    triangle(n.x + 10, n.cy + 7, n.x + 22, n.cy + 7, n.x + 16, n.cy - 7);
  }
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text(n.name, n.x + 36, n.cy, n.w - 40, n.h);
}

function drawOutputIcon(n, i) {
  stroke('black');
  strokeWeight(2);
  fill(isSelected(n) ? '#f9a825' : 'white');
  rect(n.x, n.y, n.w, n.h, 6);
  noStroke();
  if (i === 0) { // motor: spinning wheel
    push();
    translate(n.x + 18, n.cy);
    rotate(playing ? particlePhase * 6 : 0);
    stroke('#37474f'); strokeWeight(3); noFill();
    circle(0, 0, 22);
    line(-9, 0, 9, 0); line(0, -9, 0, 9);
    pop();
  } else if (i === 1) { // neopixel dot grid
    const cols = ['#e53935', '#43a047', '#1e88e5'];
    for (let k = 0; k < 3; k++) { fill(cols[k]); circle(n.x + 12 + k * 11, n.cy, 8); }
  } else { // OLED screen
    fill('black'); rect(n.x + 8, n.cy - 9, 22, 18, 2);
    fill('#00e5ff'); rect(n.x + 11, n.cy - 6, 16, 4);
  }
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text(n.name, n.x + 38, n.cy, n.w - 42, n.h);
}

function drawProcessor(p) {
  stroke('black');
  strokeWeight(2);
  fill(isSelected(p) ? '#f9a825' : '#1a237e');
  rect(p.x, p.y, p.w, p.h, 10);
  noStroke();
  fill(isSelected(p) ? 'black' : 'white');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Cytron Maker Pi\nRP2040', p.cx, p.y + 32);
  textSize(11);
  text('MicroPython Code', p.cx, p.y + 72);
  // blinking cursor
  if (frameCount % 60 < 30) {
    text('_', p.cx + 52, p.y + 72);
  }
}

function drawInfoBar() {
  const barY = drawHeight - 56;
  noStroke();
  fill(selected ? '#1a237e' : '#eceff1');
  rect(margin, barY, canvasWidth - 2 * margin, 48, 8);
  fill(selected ? 'white' : '#607d8b');
  textAlign(LEFT, TOP);
  textSize(12.5);
  if (selected) {
    text(selected.name + ': ' + selected.info, margin + 10, barY + 6, canvasWidth - 2 * margin - 20, 42);
  } else {
    text('Click any sensor, the processor, or any output to see what it does.', margin + 10, barY + 14, canvasWidth - 2 * margin - 20, 30);
  }
}

function mousePressed() {
  const all = [...inputNodes, ...outputNodes, processorBox];
  for (let n of all) {
    if (mouseX >= n.x && mouseX <= n.x + n.w && mouseY >= n.y && mouseY <= n.y + n.h) {
      selected = n;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
