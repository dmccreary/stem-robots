// Magnetometer Calibration Explorer
// CANVAS_HEIGHT: 480
// Bloom L3 (Apply): rotate a simulated magnetometer through a full turn, watch the
// raw X/Y readings trace an off-center circle, then compute and apply the
// hard-iron offset:  offset_x = (max_x + min_x) / 2,  offset_y = (max_y + min_y) / 2
//                    corrected_x = mag_x - offset_x,  corrected_y = mag_y - offset_y
// Heading uses the chapter's formula: heading = atan2(mag_y, mag_x) in degrees.

let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const RADIUS = 200;               // strength of Earth's field in raw sensor units
const NOISE = 3;                  // sensor noise (raw units, standard deviation)
const DEFAULT_OFFSET = [35, -20]; // hard-iron offset from nearby motors and battery
const STEP_DEG = 4;               // one new reading every 4 degrees of rotation
const PLOT_RANGE = 300;           // plot shows -300..+300 on each axis

let rotateSlider, autoButton, computeButton, resetButton, newButton;
let trueOffset = DEFAULT_OFFSET.slice();
let points = [];                  // raw readings {x, y, deg}
let lastDeg = 0;                  // rotation at the last reading
let covered = new Set();          // 10-degree bins that have a reading
let minX, maxX, minY, maxY;
let calib = null;                 // {ox, oy} after Compute Calibration
let autoLeft = 0;                 // degrees still to turn in Auto-rotate

let plotCx, plotCy, plotScale, panelX;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  rotateSlider = createSlider(0, 360, 0, 1);
  rotateSlider.parent(document.querySelector('main'));
  rotateSlider.input(() => addReadingsTo(rotateSlider.value()));

  autoButton = createButton('Auto-rotate');
  autoButton.parent(document.querySelector('main'));
  autoButton.mousePressed(() => { autoLeft = 360; });
  computeButton = createButton('Compute Calibration');
  computeButton.parent(document.querySelector('main'));
  computeButton.mousePressed(computeCalibration);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => resetAll(DEFAULT_OFFSET));
  newButton = createButton('New robot');
  newButton.parent(document.querySelector('main'));
  newButton.mousePressed(() => resetAll([round(random(-70, 70)), round(random(-70, 70))]));

  resetAll(DEFAULT_OFFSET);
  positionControls();
  describe('An X/Y scatter plot of magnetometer readings with the origin marked. Rotating the ' +
    'simulated robot adds red dots that trace a circle whose center is shifted away from the ' +
    'origin by a hard-iron offset. A panel shows the minimum and maximum X and Y readings. ' +
    'Compute Calibration calculates the offsets, marks the center with a crosshair, and overlays ' +
    'a green corrected circle centered on the origin, along with the true, raw, and corrected headings.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 600;
  const lblW = narrow ? 130 : 160;
  rotateSlider.position(margin + lblW, drawHeight + 10);
  rotateSlider.size(max(80, canvasWidth - lblW - 2 * margin));
  computeButton.html(narrow ? 'Compute' : 'Compute Calibration');
  let x = margin;
  for (const b of [autoButton, computeButton, resetButton, newButton]) {
    b.position(x, drawHeight + 46); x += b.elt.offsetWidth + 8;
  }
}

function resetAll(offset) {
  trueOffset = offset.slice();
  points = []; covered = new Set(); calib = null; autoLeft = 0;
  minX = minY = Infinity; maxX = maxY = -Infinity;
  lastDeg = 0;
  rotateSlider.value(0);
  addReading(0);
}

// One raw reading at rotation `deg`: Earth's field circle, shifted by the
// hard-iron offset, plus a little noise.
function addReading(deg) {
  const a = radians(deg);
  const x = RADIUS * cos(a) + trueOffset[0] + randomGaussian(0, NOISE);
  const y = RADIUS * sin(a) + trueOffset[1] + randomGaussian(0, NOISE);
  points.push({ x, y, deg });
  covered.add(Math.floor(((deg % 360) + 360) % 360 / 10));
  minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y);
}

// Add a reading every STEP_DEG between the last rotation and the new one,
// so dragging the slider quickly does not leave gaps.
function addReadingsTo(deg) {
  const dir = deg >= lastDeg ? 1 : -1;
  while (abs(deg - lastDeg) >= STEP_DEG) {
    lastDeg += dir * STEP_DEG;
    addReading(lastDeg);
  }
}

function coveredDegrees() { return covered.size * 10; }

function computeCalibration() {
  if (coveredDegrees() < 360) return;
  calib = { ox: (maxX + minX) / 2, oy: (maxY + minY) / 2 };
}

function headingOf(x, y) { return ((degrees(atan2(y, x)) % 360) + 360) % 360; }

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();
  if (autoLeft > 0) {                       // Auto-rotate: a full turn in about 4 seconds
    const d = min(autoLeft, 90 * min(deltaTime, 50) / 1000);
    autoLeft -= d;
    const nd = rotateSlider.value() + d;
    const wrapped = nd > 360 ? nd - 360 : nd;
    if (nd > 360) { lastDeg -= 360; }
    rotateSlider.value(wrapped);
    addReadingsTo(wrapped);
  }
  const ready = coveredDegrees() >= 360;
  if (ready) computeButton.removeAttribute('disabled');
  else computeButton.attribute('disabled', '');

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  panelX = canvasWidth - (narrow ? 170 : 262);
  const plotW = panelX - 20, plotH = drawHeight - 50;
  plotScale = min(plotW, plotH) / (2 * PLOT_RANGE);
  plotCx = 10 + plotW / 2;
  plotCy = 40 + plotH / 2;

  noStroke(); fill('black'); textSize(narrow ? 16 : 20); textAlign(LEFT, TOP);
  text('Magnetometer Calibration Explorer', margin, 8);

  drawPlot();
  drawPanel(narrow, ready);
  drawControlLabels();
}

function sx(x) { return plotCx + x * plotScale; }
function sy(y) { return plotCy - y * plotScale; }

function drawPlot() {
  const half = PLOT_RANGE * plotScale;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(plotCx - half, plotCy - half, 2 * half, 2 * half);
  // grid every 100 units
  textSize(10);
  for (let v = -PLOT_RANGE; v <= PLOT_RANGE; v += 100) {
    stroke(v === 0 ? 'black' : 'gainsboro'); strokeWeight(v === 0 ? 1.5 : 1);
    line(sx(v), sy(-PLOT_RANGE), sx(v), sy(PLOT_RANGE));
    line(sx(-PLOT_RANGE), sy(v), sx(PLOT_RANGE), sy(v));
    if (v !== 0) {
      noStroke(); fill('gray'); textAlign(CENTER, TOP); text(v, sx(v), sy(0) + 3);
      textAlign(RIGHT, CENTER); text(v, sx(0) - 3, sy(v));
    }
  }
  noStroke(); fill('black'); textSize(12);
  textAlign(RIGHT, BOTTOM); text('mag_x', sx(PLOT_RANGE) - 3, sy(0) - 3);
  textAlign(LEFT, TOP); text('mag_y', sx(0) + 4, sy(PLOT_RANGE) + 3);
  // origin marker
  noFill(); stroke('black'); strokeWeight(2); circle(sx(0), sy(0), 10);
  const narrow = canvasWidth < 600;
  noStroke(); fill('black'); textAlign(RIGHT, BOTTOM); textSize(11);
  if (!narrow) text('origin (0, 0)', sx(0) - 6, sy(0) - 4);

  // raw readings (red)
  noStroke(); fill('crimson');
  for (const p of points) circle(sx(p.x), sy(p.y), 5);

  // live center estimate while collecting: dashed
  if (points.length > 2 && !calib) {
    const cx = (maxX + minX) / 2, cy = (maxY + minY) / 2;
    stroke('gray'); strokeWeight(1); drawingContext.setLineDash([4, 4]);
    line(sx(cx) - 12, sy(cy), sx(cx) + 12, sy(cy)); line(sx(cx), sy(cy) - 12, sx(cx), sy(cy) + 12);
    drawingContext.setLineDash([]);
    noStroke(); fill('gray'); textSize(11); textAlign(LEFT, BOTTOM);
    text('center so far', sx(cx) + 6, sy(cy) - 4);
  }

  if (calib) {
    // corrected readings (green), re-centered on the origin
    stroke('forestgreen'); strokeWeight(1.5); noFill();
    circle(sx(0), sy(0), 2 * RADIUS * plotScale);
    noStroke(); fill('forestgreen');
    for (const p of points) circle(sx(p.x - calib.ox), sy(p.y - calib.oy), 5);
    // big crosshair at the computed center of the raw circle
    stroke('darkorange'); strokeWeight(3);
    line(sx(calib.ox) - 22, sy(calib.oy), sx(calib.ox) + 22, sy(calib.oy));
    line(sx(calib.ox), sy(calib.oy) - 22, sx(calib.ox), sy(calib.oy) + 22);
    // arrow showing the correction: from the raw center back to the origin
    stroke('darkorange'); strokeWeight(1.5); drawingContext.setLineDash([5, 4]);
    line(sx(calib.ox), sy(calib.oy), sx(0), sy(0));
    drawingContext.setLineDash([]);
    noStroke(); fill('darkorange'); textSize(12); textStyle(BOLD);
    if (!narrow) textAlign(sx(calib.ox) >= sx(0) ? LEFT : RIGHT, calib.oy <= 0 ? TOP : BOTTOM);
    if (!narrow) text('computed center', sx(calib.ox) + (sx(calib.ox) >= sx(0) ? 10 : -10), sy(calib.oy) + (calib.oy <= 0 ? 10 : -10));
    textStyle(NORMAL);
  }

  // current reading highlighted
  const cur = points[points.length - 1];
  if (cur) {
    stroke('black'); strokeWeight(2); noFill();
    circle(sx(cur.x), sy(cur.y), 11);
  }

  // legend
  const lx = plotCx - half + 8, ly = plotCy - half + 8;
  noStroke(); fill('crimson'); circle(lx + 4, ly + 6, 7);
  fill('black'); textSize(narrow ? 10 : 12); textAlign(LEFT, CENTER); text(narrow ? 'raw' : 'raw reading', lx + 12, ly + 6);
  if (calib) {
    fill('forestgreen'); circle(lx + 4, ly + 22, 7);
    fill('black'); text(narrow ? 'corrected' : 'corrected reading', lx + 12, ly + 22);
  }
}

function drawPanel(narrow, ready) {
  const x = panelX, y = 40, w = canvasWidth - panelX - 10, h = drawHeight - 50;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, h, 8);
  const fs = narrow ? 11 : 14, lh = narrow ? 15 : 19;
  let yy = y + 8;
  noStroke(); textAlign(LEFT, TOP); textSize(fs);

  // 1. collect
  fill('black'); textStyle(BOLD); text('1. Rotate a full turn', x + 8, yy); textStyle(NORMAL); yy += lh;
  const cov = coveredDegrees();
  fill('whitesmoke'); stroke('silver'); rect(x + 8, yy, w - 16, 10, 3);
  noStroke(); fill(ready ? 'forestgreen' : 'orange'); rect(x + 8, yy, (w - 16) * cov / 360, 10, 3);
  yy += 14;
  fill(ready ? 'forestgreen' : 'dimgray');
  text(narrow ? cov + '° of 360°' : 'Covered ' + cov + '° of 360°, ' + points.length + (points.length === 1 ? ' reading' : ' readings'), x + 8, yy); yy += lh + 2;

  // 2. min and max
  fill('black'); textStyle(BOLD); text('2. Min and max', x + 8, yy); textStyle(NORMAL); yy += lh;
  textFont('monospace'); textSize(fs - 1);
  fill('dimgray');
  text('x: ' + nf(minX, 1, 0) + ' to ' + nf(maxX, 1, 0), x + 8, yy); yy += lh;
  text('y: ' + nf(minY, 1, 0) + ' to ' + nf(maxY, 1, 0), x + 8, yy); yy += lh + 2;
  textFont('sans-serif'); textSize(fs);

  // 3. offsets
  fill('black'); textStyle(BOLD); text('3. Offsets', x + 8, yy); textStyle(NORMAL); yy += lh;
  textFont('monospace'); textSize(fs - 1);
  if (calib) {
    fill('darkorange');
    text('offset_x = ' + nf(calib.ox, 1, 1), x + 8, yy); yy += lh;
    text('offset_y = ' + nf(calib.oy, 1, 1), x + 8, yy); yy += lh + 2;
  } else {
    fill('gray');
    text(ready ? 'Press Compute' : 'Finish the turn first', x + 8, yy); yy += 2 * lh + 2;
  }
  textFont('sans-serif'); textSize(fs);
  if (narrow) return;

  // 4. why it matters: heading at the current rotation
  const cur = points[points.length - 1];
  const trueH = ((rotateSlider.value() % 360) + 360) % 360;
  fill('black'); textStyle(BOLD); text('4. Compass heading now', x + 8, yy); textStyle(NORMAL); yy += lh;
  const rows = [['True', trueH, 'black'], ['From raw', headingOf(cur.x, cur.y), 'crimson']];
  if (calib) rows.push(['Corrected', headingOf(cur.x - calib.ox, cur.y - calib.oy), 'forestgreen']);
  for (const [name, hd, col] of rows) {
    const err = ((hd - trueH + 540) % 360) - 180;
    fill(col); text(name + ': ' + nf(hd, 1, 0) + '°' + (name === 'True' ? '' : '  (off by ' + nf(abs(err), 1, 0) + '°)'), x + 8, yy);
    yy += lh;
  }
}

function drawControlLabels() {
  const narrow = canvasWidth < 600;
  noStroke(); fill('black'); textSize(15); textAlign(LEFT, CENTER);
  text((narrow ? 'Rotate: ' : 'Rotate robot: ') + rotateSlider.value() + '°', margin, drawHeight + 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.min(800, container.offsetWidth);
}
