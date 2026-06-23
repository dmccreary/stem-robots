// Differential Drive Turn Simulator
// CANVAS_HEIGHT: 450
// Bloom L3 (Apply): predict and verify robot motion from left/right wheel speed
// ratios. Equal speeds drive straight; opposite speeds spin in place.

let canvasWidth = 700;
let drawHeight = 330;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let leftSlider, rightSlider, resetButton;
let presetButtons = [];
let sliderLeftMargin = 175;

// robot state
let rx, ry, heading;
let trail = [];
const wheelBase = 38;

const presets = [
  { label: 'Forward', l: 80, r: 80 },
  { label: 'Backward', l: -80, r: -80 },
  { label: 'Spin Left', l: -60, r: 60 },
  { label: 'Spin Right', l: 60, r: -60 },
  { label: 'Gradual Left', l: 40, r: 80 },
  { label: 'Gradual Right', l: 80, r: 40 }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  leftSlider = createSlider(-100, 100, 0, 1);
  leftSlider.parent(document.querySelector('main'));
  rightSlider = createSlider(-100, 100, 0, 1);
  rightSlider.parent(document.querySelector('main'));

  for (let p of presets) {
    const b = createButton(p.label);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => { leftSlider.value(p.l); rightSlider.value(p.r); });
    presetButtons.push(b);
  }
  resetButton = createButton('Reset position');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetRobot);

  positionControls();
  resetRobot();
  describe('Top-down view of a two-wheeled robot. Two sliders set the left and right wheel speeds; the robot moves by differential drive and leaves a fading trail. Preset buttons set common motions like driving straight or spinning in place.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  leftSlider.position(sliderLeftMargin, y0 + 4);
  leftSlider.size(max(120, canvasWidth - sliderLeftMargin - margin));
  rightSlider.position(sliderLeftMargin, y0 + 34);
  rightSlider.size(max(120, canvasWidth - sliderLeftMargin - margin));

  // preset buttons row + reset
  let x = 10;
  const by = y0 + 70;
  for (let b of presetButtons) { b.position(x, by); x += b.elt.offsetWidth + 6 || 86; }
  resetButton.position(x, by);
}

function resetRobot() {
  rx = canvasWidth / 2; ry = drawHeight / 2; heading = -HALF_PI; trail = [];
}

function draw() {
  updateCanvasSize();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // arena border
  noFill(); stroke('#b0bec5'); strokeWeight(1);
  rect(6, 34, canvasWidth - 12, drawHeight - 40);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('Differential Drive Simulator', canvasWidth / 2, 8);

  const vL = leftSlider.value(), vR = rightSlider.value();
  updatePhysics(vL, vR);
  drawTrail();
  drawRobot();
  drawControlLabels(vL, vR);

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function updatePhysics(vL, vR) {
  const dt = 0.4;
  const v = (vL + vR) / 2 * 0.03;       // forward speed (px/step)
  const omega = (vR - vL) / wheelBase * 0.03; // rad/step
  heading += omega * dt * 10;
  rx += v * cos(heading) * dt * 10;
  ry += v * sin(heading) * dt * 10;

  // clamp to arena
  const L = 18, left = 6 + L, right = canvasWidth - 6 - L, top = 34 + L, bot = drawHeight - 6 - L;
  rx = constrain(rx, left, right);
  ry = constrain(ry, top, bot);

  if ((vL !== 0 || vR !== 0) && frameCount % 3 === 0) {
    trail.push({ x: rx, y: ry, age: 0 });
    if (trail.length > 120) trail.shift();
  }
  for (let t of trail) t.age++;
}

function drawTrail() {
  noStroke();
  for (let t of trail) {
    const a = map(t.age, 0, 120, 180, 0);
    fill(255, 138, 0, a);
    circle(t.x, t.y, 5);
  }
}

function drawRobot() {
  push();
  translate(rx, ry);
  rotate(heading);
  rectMode(CENTER);
  // body (nose points +x)
  stroke('#0d47a1'); strokeWeight(2); fill('#1976d2');
  rect(0, 0, 44, 30, 4);
  // nose marker
  noStroke(); fill('#fdd835'); triangle(22, 0, 12, -8, 12, 8);
  // wheels
  fill('#263238');
  rect(-6, -18, 22, 8, 2);  // top wheel
  rect(-6, 18, 22, 8, 2);   // bottom wheel
  noStroke(); fill('white'); textSize(11); textAlign(CENTER, CENTER);
  rectMode(CORNER);
  push(); rotate(0); text('L', -6, -18); text('R', -6, 18); pop();
  pop();
  rectMode(CORNER);
}

function drawControlLabels(vL, vR) {
  noStroke(); fill('black'); textSize(13); textAlign(LEFT, CENTER);
  text('Left wheel: ' + vL + '%', 10, drawHeight + 16);
  text('Right wheel: ' + vR + '%', 10, drawHeight + 46);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) { canvasWidth = container.offsetWidth; }
}
