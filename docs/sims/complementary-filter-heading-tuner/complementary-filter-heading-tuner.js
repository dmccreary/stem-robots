// Complementary Filter Heading Tuner
// CANVAS_HEIGHT: 505
// Bloom L4 (Analyze): compare a gyro-only heading, a magnetometer-only heading, and
// the fused complementary-filter heading against the true heading, and connect the
// alpha slider to which sensor dominates. The fused needle uses the chapter's
//   HeadingFilter.update(): heading = alpha*(heading + gyro_z*dt) + (1 - alpha)*compass
// run 50 times a second (dt = 0.02 s). One small change: the compass correction is
// measured the short way around the circle, like heading_error(), so a heading near
// north (359 vs 1 degree) does not jump.

let canvasWidth = 800;
let drawHeight = 420;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

const DT = 0.02;              // 50 Hz filter loop (LOOP_HZ in the build plan)
const GYRO_NOISE = 0.3;       // small random gyro noise, deg/s
const TURN_DEG = 90, TURN_TIME = 2;
const AVG_WINDOW = 5;         // average error over the last 5 seconds
const CHART_WINDOW = 20;      // strip chart shows the last 20 seconds
const COLORS = { truth: 'black', gyro: 'darkorange', mag: 'forestgreen', fused: 'royalblue' };

let alphaSlider, driftSlider, noiseSlider, turnButton, resetButton;
let t = 0, acc = 0;
let trueH = 0, trueRate = 0, turnLeft = 0;
let gyroH = 0, magH = 0, fusedH = 0;
let hist = [];                // {t, gyro, mag, fused} signed errors

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  alphaSlider = createSlider(0.8, 0.999, 0.98, 0.001);
  alphaSlider.parent(document.querySelector('main'));
  driftSlider = createSlider(0, 2, 0.5, 0.1);
  driftSlider.parent(document.querySelector('main'));
  noiseSlider = createSlider(0, 15, 5, 0.5);
  noiseSlider.parent(document.querySelector('main'));
  turnButton = createButton('Start Turn');
  turnButton.parent(document.querySelector('main'));
  turnButton.mousePressed(() => { if (turnLeft <= 0) turnLeft = TURN_DEG; });
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  resetAll();
  positionControls();
  describe('A compass dial with four needles: black for the true heading, orange for the ' +
    'gyro-only estimate that slowly drifts, green for the magnetometer-only estimate that ' +
    'jitters, and blue for the fused complementary-filter estimate. A table shows each ' +
    'estimate\'s error now and averaged over 5 seconds, a strip chart shows the errors over ' +
    'time, and sliders set alpha, gyro drift, and magnetometer noise.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 600;
  const colW = canvasWidth / 2;
  const lblW = narrow ? 104 : 150;
  const sw = max(50, colW - lblW - 18);
  alphaSlider.position(margin + lblW, drawHeight + 10); alphaSlider.size(sw);
  driftSlider.position(colW + lblW, drawHeight + 10); driftSlider.size(sw);
  noiseSlider.position(margin + lblW, drawHeight + 47); noiseSlider.size(sw);
  turnButton.position(colW, drawHeight + 45);
  resetButton.position(colW + turnButton.elt.offsetWidth + 10, drawHeight + 45);
}

function resetAll() {
  alphaSlider.value(0.98); driftSlider.value(0.5); noiseSlider.value(5);
  t = 0; acc = 0; trueH = 0; trueRate = 0; turnLeft = 0;
  gyroH = 0; magH = 0; fusedH = 0; hist = [];
}

function wrap360(a) { return ((a % 360) + 360) % 360; }
function diff(a, b) { return ((a - b + 540) % 360) - 180; }   // shortest signed a - b

// One 20 ms tick of the robot's loop
function step() {
  // the true heading: hold still, or turn 90 degrees over 2 seconds
  trueRate = 0;
  if (turnLeft > 0) {
    const d = min(turnLeft, TURN_DEG / TURN_TIME * DT);
    turnLeft -= d; trueRate = d / DT;
  }
  trueH = wrap360(trueH + trueRate * DT);

  // sensors
  const gyroZ = trueRate + driftSlider.value() + randomGaussian(0, GYRO_NOISE);   // bias makes it drift
  const compass = wrap360(trueH + randomGaussian(0, noiseSlider.value()));        // noisy but no drift

  // estimates
  gyroH = wrap360(gyroH + gyroZ * DT);            // gyro only: integrate, never corrected
  magH = compass;                                 // magnetometer only
  const alpha = alphaSlider.value();
  const gyroEstimate = fusedH + gyroZ * DT;       // HeadingFilter.update()
  fusedH = wrap360(gyroEstimate + (1 - alpha) * diff(compass, gyroEstimate));

  t += DT;
  hist.push({ t, gyro: diff(gyroH, trueH), mag: diff(magH, trueH), fused: diff(fusedH, trueH) });
  while (hist.length && hist[0].t < t - CHART_WINDOW) hist.shift();
}

function avgError(key) {
  let s = 0, n = 0;
  for (let i = hist.length - 1; i >= 0 && hist[i].t > t - AVG_WINDOW; i--) { s += abs(hist[i][key]); n++; }
  return n ? s / n : 0;
}

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();
  acc += min(deltaTime, 100) / 1000;
  while (acc >= DT) { step(); acc -= DT; }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  const leftW = narrow ? canvasWidth * 0.5 : min(440, canvasWidth * 0.55);
  noStroke(); fill('black'); textSize(narrow ? 16 : 20); textAlign(LEFT, TOP);
  text('Complementary Filter Heading Tuner', margin, 8);

  drawDial(leftW, narrow);
  drawPanel(leftW + 8, canvasWidth - leftW - 18, narrow);
  drawControlLabels(narrow);
}

function drawNeedle(h, len, col, w) {
  const a = radians(h - 90);
  stroke(col); strokeWeight(w);
  line(0, 0, cos(a) * len, sin(a) * len);
  noStroke(); fill(col);
  circle(cos(a) * len, sin(a) * len, w + 6);
}

function drawDial(leftW, narrow) {
  const R = min(leftW / 2 - (narrow ? 26 : 40), 138);
  const cx = leftW / 2, cy = narrow ? 150 : 196;
  push();
  translate(cx, cy);
  fill('white'); stroke('slategray'); strokeWeight(2);
  circle(0, 0, 2 * R);
  for (let d = 0; d < 360; d += 10) {
    const a = radians(d - 90);
    const r1 = R - (d % 30 === 0 ? 12 : 6);
    stroke('slategray'); strokeWeight(d % 90 === 0 ? 2 : 1);
    line(cos(a) * r1, sin(a) * r1, cos(a) * R, sin(a) * R);
  }
  noStroke(); fill('black'); textSize(narrow ? 11 : 14); textStyle(BOLD); textAlign(CENTER, CENTER);
  for (const [m, d] of [['N', 0], ['E', 90], ['S', 180], ['W', 270]]) {
    const a = radians(d - 90);
    text(m, cos(a) * (R + (narrow ? 10 : 16)), sin(a) * (R + (narrow ? 10 : 16)));
  }
  textStyle(NORMAL);
  // needles: different lengths so overlapping needles stay visible
  drawNeedle(magH, R * 0.62, COLORS.mag, 3);
  drawNeedle(gyroH, R * 0.74, COLORS.gyro, 3);
  drawNeedle(fusedH, R * 0.86, COLORS.fused, 4);
  drawNeedle(trueH, R * 0.97, COLORS.truth, 2);
  fill('black'); noStroke(); circle(0, 0, 10);
  pop();

  // legend with current values
  const rows = [['True heading', trueH, COLORS.truth], ['Gyro only', gyroH, COLORS.gyro],
    ['Magnetometer only', magH, COLORS.mag], ['Fused (filter)', fusedH, COLORS.fused]];
  textSize(narrow ? 11 : 13); textAlign(LEFT, CENTER);
  let ly = cy + R + (narrow ? 20 : 30);
  const colX = narrow ? [margin, margin] : [margin, leftW / 2 + 4];
  for (let i = 0; i < rows.length; i++) {
    const [name, h, col] = rows[i];
    const x = narrow ? margin : colX[i % 2];
    const y = narrow ? ly + i * 15 : ly + Math.floor(i / 2) * 20;
    stroke(col); strokeWeight(4); line(x, y, x + 16, y);
    noStroke(); fill(col); text(name + ' ' + nf(h, 1, 1) + '°', x + 22, y);
  }
}

function drawPanel(x, w, narrow) {
  const fs = narrow ? 11 : 14;
  // error table
  let y = 40;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, narrow ? 92 : 112, 8);
  noStroke(); fill('black'); textStyle(BOLD); textSize(fs); textAlign(LEFT, TOP);
  text('Error vs. true heading', x + 8, y + 7);
  textStyle(NORMAL);
  const c1 = x + w * (narrow ? 0.52 : 0.56), c2 = x + w - 8;
  fill('dimgray'); textSize(fs - 1);
  textAlign(RIGHT, TOP); text('now', c1, y + 7 + (narrow ? 15 : 20)); text('avg 5 s', c2, y + 7 + (narrow ? 15 : 20));
  const rows = [['Gyro only', 'gyro', COLORS.gyro], ['Mag only', 'mag', COLORS.mag], ['Fused', 'fused', COLORS.fused]];
  const last = hist.length ? hist[hist.length - 1] : { gyro: 0, mag: 0, fused: 0 };
  const avgs = rows.map(r => avgError(r[1]));
  const best = avgs.indexOf(min(...avgs));
  for (let i = 0; i < rows.length; i++) {
    const ry = y + 7 + (narrow ? 15 : 20) * (i + 2);
    textSize(fs); fill(rows[i][2]); textAlign(LEFT, TOP);
    textStyle(i === best && t > 1 ? BOLD : NORMAL);
    text(rows[i][0], x + 8, ry);
    textAlign(RIGHT, TOP);
    text(nf(abs(last[rows[i][1]]), 1, 1) + '°', c1, ry);
    text(nf(avgs[i], 1, 1) + '°', c2, ry);
    textStyle(NORMAL);
  }

  // which sensor does the fused estimate trust?
  y += narrow ? 100 : 122;
  const alpha = alphaSlider.value();
  noStroke(); fill('black'); textSize(fs); textAlign(LEFT, TOP);
  text('Each update trusts:', x + 2, y);
  y += fs + 6;
  const bw = w - 4;
  fill(COLORS.gyro); rect(x + 2, y, bw * alpha, 14, 3, 0, 0, 3);
  fill(COLORS.mag); rect(x + 2 + bw * alpha, y, max(2, bw * (1 - alpha)), 14, 0, 3, 3, 0);
  y += 18;
  textSize(fs - 1);
  fill(COLORS.gyro); textAlign(LEFT, TOP); text('gyro ' + nf(alpha * 100, 1, 1) + '%', x + 2, y);
  fill(COLORS.mag); textAlign(RIGHT, TOP); text('compass ' + nf((1 - alpha) * 100, 1, 1) + '%', x + w - 2, y);

  // strip chart of signed errors
  y += fs + 10;
  const ch = drawHeight - y - 10;
  if (ch < 50) return;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, ch, 6);
  noStroke(); fill('black'); textSize(fs - 1); textAlign(LEFT, TOP);
  text('Error over the last ' + CHART_WINDOW + ' s', x + 6, y + 4);
  const gy = y + 22, gh = ch - 28, mid = gy + gh / 2, range = 15;
  stroke('gainsboro'); line(x + 4, mid, x + w - 4, mid);
  noStroke(); fill('gray'); textSize(10); textAlign(LEFT, CENTER);
  text('+' + range + '°', x + 4, gy + 4); text('-' + range + '°', x + 4, gy + gh - 4); text('0', x + 4, mid - 6);
  for (const [key, col, wgt] of [['mag', COLORS.mag, 1], ['gyro', COLORS.gyro, 2], ['fused', COLORS.fused, 2]]) {
    stroke(col); strokeWeight(wgt); noFill();
    beginShape();
    for (const p of hist) {
      const px = map(p.t, t - CHART_WINDOW, t, x + 28, x + w - 6);
      vertex(px, mid - constrain(p[key], -range, range) / range * (gh / 2 - 2));
    }
    endShape();
  }
  noStroke();
}

function drawControlLabels(narrow) {
  const colW = canvasWidth / 2;
  noStroke(); fill('black'); textSize(narrow ? 13 : 15); textAlign(LEFT, CENTER);
  text('Alpha: ' + nf(alphaSlider.value(), 1, 3), margin, drawHeight + 20);
  text((narrow ? 'Drift: ' : 'Gyro drift: ') + nf(driftSlider.value(), 1, 1) + ' °/s', colW, drawHeight + 20);
  text((narrow ? 'Noise: ' : 'Mag noise: ') + nf(noiseSlider.value(), 1, 1) + '°', margin, drawHeight + 57);
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
