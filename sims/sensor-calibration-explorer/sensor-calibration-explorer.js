// Sensor Calibration Two-Point Process
// CANVAS_HEIGHT: 400
// Bloom L3 (Apply): adjust calibration parameters (zero offset and scale) and
// see how a corrected reading lines up with true distance, reducing error.

let canvasWidth = 700;
let drawHeight = 280;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let offsetSlider, scaleSlider, testSlider, calibrateButton;
let calT = 0;             // animation 0 raw -> 1 corrected
let calibrated = false;
let sliderLeftMargin = 165;

const XMAX = 200, YMAX = 220;
let plot = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  offsetSlider = createSlider(-20, 20, 8, 1);
  offsetSlider.parent(document.querySelector('main'));
  offsetSlider.input(() => calibrated = false);
  scaleSlider = createSlider(0.8, 1.2, 1.1, 0.01);
  scaleSlider.parent(document.querySelector('main'));
  scaleSlider.input(() => calibrated = false);
  testSlider = createSlider(0, 200, 100, 1);
  testSlider.parent(document.querySelector('main'));

  calibrateButton = createButton('Calibrate');
  calibrateButton.parent(document.querySelector('main'));
  calibrateButton.mousePressed(() => { calibrated = true; });

  positionControls();
  describe('A graph of sensor reading versus true distance. A green ideal line and an orange raw-sensor line that is offset and scaled. Sliders adjust the offset and scale; the Calibrate button animates the orange line onto the ideal line. A test-point slider reads out raw, corrected, and error values.', LABEL);
}

function positionControls() {
  const w = max(120, canvasWidth - sliderLeftMargin - margin - 110);
  offsetSlider.position(sliderLeftMargin, drawHeight + 10);
  offsetSlider.size(w);
  scaleSlider.position(sliderLeftMargin, drawHeight + 42);
  scaleSlider.size(w);
  testSlider.position(sliderLeftMargin, drawHeight + 74);
  testSlider.size(w);
  calibrateButton.position(canvasWidth - 95, drawHeight + 40);
}

function draw() {
  updateCanvasSize();
  computePlot();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // animate calibration
  calT = lerp(calT, calibrated ? 1 : 0, 0.12);

  noStroke(); fill('black'); textSize(18); textAlign(CENTER, TOP);
  text('Sensor Calibration', canvasWidth * 0.5, 6);

  drawAxes();
  drawLines();
  drawTestPoint();
  drawControlLabels();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function computePlot() {
  plot = { x: 56, y: 36, w: canvasWidth - 56 - margin, h: drawHeight - 36 - 30 };
}
function px(xv) { return plot.x + (xv / XMAX) * plot.w; }
function py(yv) { return plot.y + plot.h - (yv / YMAX) * plot.h; }

function drawAxes() {
  stroke('#b0bec5'); strokeWeight(1);
  line(plot.x, plot.y, plot.x, plot.y + plot.h);
  line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  noStroke(); fill('#607d8b'); textSize(11);
  textAlign(CENTER, TOP);
  for (let xv = 0; xv <= XMAX; xv += 50) text(xv, px(xv), plot.y + plot.h + 4);
  textAlign(RIGHT, CENTER);
  for (let yv = 0; yv <= YMAX; yv += 55) text(yv, plot.x - 4, py(yv));
  // axis titles
  textAlign(CENTER, BOTTOM); fill('#37474f'); textSize(12);
  text('True distance (cm)', plot.x + plot.w / 2, drawHeight - 2);
  push(); translate(12, plot.y + plot.h / 2); rotate(-HALF_PI);
  text('Sensor reading (cm)', 0, 0); pop();
}

function rawY(xv) { return scaleSlider.value() * xv + offsetSlider.value(); }

function drawLines() {
  // ideal (green)
  stroke('#43a047'); strokeWeight(2.5);
  line(px(0), py(0), px(XMAX), py(XMAX));
  noStroke(); fill('#2e7d32'); textSize(11); textAlign(LEFT, BOTTOM);
  text('ideal (sensor = true)', px(120), py(120) - 4);

  // orange line: lerp from raw to ideal by calT
  stroke('#fb8c00'); strokeWeight(2.5);
  const y0 = lerp(rawY(0), 0, calT);
  const yMax = lerp(rawY(XMAX), XMAX, calT);
  line(px(0), py(y0), px(XMAX), py(yMax));
  noStroke(); fill('#e65100'); textAlign(LEFT, TOP);
  text(calibrated ? 'corrected' : 'raw sensor', px(20), py(rawY(20)) + (calibrated ? -28 : 6));
}

function drawTestPoint() {
  const tx = testSlider.value();
  const raw = rawY(tx);
  const corrected = (raw - offsetSlider.value()) / scaleSlider.value();
  const err = raw - tx;
  // vertical cursor
  stroke('#90a4ae'); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(px(tx), plot.y, px(tx), plot.y + plot.h);
  drawingContext.setLineDash([]);
  // markers
  noStroke(); fill('#fb8c00'); circle(px(tx), py(raw), 7);
  fill('#43a047'); circle(px(tx), py(tx), 6);

  // readout box
  const bw = 150, bx = px(tx) > canvasWidth - bw - 10 ? px(tx) - bw - 8 : px(tx) + 8;
  fill('#102a43'); rect(bx, plot.y + 4, bw, 58, 6);
  fill('white'); textSize(12); textAlign(LEFT, TOP);
  text('Raw: ' + nf(raw, 1, 1) + ' cm', bx + 8, plot.y + 9);
  text('Corrected: ' + nf(corrected, 1, 1) + ' cm', bx + 8, plot.y + 26);
  text('Error: ' + nf(err, 1, 1) + ' cm', bx + 8, plot.y + 43);
}

function drawControlLabels() {
  noStroke(); fill('black'); textSize(13); textAlign(LEFT, CENTER);
  text('Zero offset: ' + offsetSlider.value() + ' cm', 10, drawHeight + 19);
  text('Scale factor: ' + nf(scaleSlider.value(), 1, 2), 10, drawHeight + 51);
  text('Test point: ' + testSlider.value() + ' cm', 10, drawHeight + 83);
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
