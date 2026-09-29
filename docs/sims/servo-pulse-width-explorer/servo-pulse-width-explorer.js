// Servo Pulse Width Explorer
// CANVAS_HEIGHT: 480
// Bloom L2 (Understand - explain): a servo angle from 0 to 180 degrees maps to a
// pulse width from 1 ms to 2 ms inside a 20 ms (50 Hz) period, and to a
// duty_u16 value from about 3276 to 6553. Same math as angle_to_duty().
// Adapted from learning-micropython/servo-pwm-explorer (same author).

let canvasWidth = 700;
let drawHeight = 330;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

const DEFAULT_MIN = 3276;   // 1 ms pulse = 0 degrees
const DEFAULT_MAX = 6553;   // 2 ms pulse = 180 degrees
const PERIOD_MS = 20;       // 50 Hz

// layout
const TL_TOP = 204, TL_BOTTOM = 326;   // PWM timeline box

// controls
let sweepButton, resetButton, angleSlider, minSlider, maxSlider;

// state
let sweeping = false, sweepDir = 1, lastStep = 0;
let armAngle = 90;          // drawn angle (eases toward the target like a real servo)
let lastGood = 90;          // arm freezes here if the calibration is invalid

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sweepButton = createButton('Sweep');
  sweepButton.parent(document.querySelector('main'));
  sweepButton.mousePressed(toggleSweep);

  resetButton = createButton('Reset calibration');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => { minSlider.value(DEFAULT_MIN); maxSlider.value(DEFAULT_MAX); });

  angleSlider = createSlider(0, 180, 90, 1);
  angleSlider.parent(document.querySelector('main'));
  minSlider = createSlider(2500, 4000, DEFAULT_MIN, 1);
  minSlider.parent(document.querySelector('main'));
  maxSlider = createSlider(5500, 7500, DEFAULT_MAX, 1);
  maxSlider.parent(document.querySelector('main'));

  positionControls();

  describe('A top view of a servo with a half-circle scale from 0 degrees on the left to 180 degrees on the right and an orange arm pointing at the current angle. A readout shows the angle, the pulse width in milliseconds, and the duty_u16 value, with a zoomed gauge of the pulse width. Below, a PWM timeline shows two 20 millisecond cycles with the orange HIGH pulse. Sliders set the angle and the minimum and maximum duty calibration.', LABEL);
}

function positionControls() {
  sweepButton.position(10, drawHeight + 8);
  resetButton.position(20 + sweepButton.elt.offsetWidth, drawHeight + 8);
  const w = canvasWidth - sliderLeftMargin - margin;
  angleSlider.position(sliderLeftMargin, drawHeight + 44);  angleSlider.size(w);
  minSlider.position(sliderLeftMargin, drawHeight + 79);    minSlider.size(w);
  maxSlider.position(sliderLeftMargin, drawHeight + 114);   maxSlider.size(w);
}

function toggleSweep() {
  sweeping = !sweeping;
  sweepButton.html(sweeping ? 'Stop sweep' : 'Sweep');
  angleSlider.elt.disabled = sweeping;   // the slider follows the sweep
  lastStep = millis();
  positionControls();                    // the button label changed width
}

// like the Servo Sweep Code: 5 degree steps every 20 ms, 0 -> 180 -> 0
function updateSweep() {
  if (!sweeping) return;
  while (millis() - lastStep >= 20) {
    lastStep += 20;
    let a = angleSlider.value() + 5 * sweepDir;
    if (a >= 180) { a = 180; sweepDir = -1; }
    if (a <= 0) { a = 0; sweepDir = 1; }
    angleSlider.value(a);
  }
}

// angle_to_duty(): duty = int(min_duty + (angle / 180) * (max_duty - min_duty))
function angleToDuty(angle, minD, maxD) {
  return Math.trunc(minD + (angle / 180) * (maxD - minD));
}

function draw() {
  updateCanvasSize();
  updateSweep();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const angle = angleSlider.value();
  const minD = minSlider.value(), maxD = maxSlider.value();
  const valid = minD < maxD;
  if (valid) lastGood = angle;
  armAngle = lerp(armAngle, lastGood, 0.35);

  const duty = valid ? angleToDuty(angle, minD, maxD) : null;
  const pulseMs = valid ? duty / 65535 * PERIOD_MS : null;

  noStroke(); fill('black'); textSize(22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Servo Pulse Width Explorer', 10, 8);
  textStyle(NORMAL);

  drawServo(armAngle);
  drawReadout(angle, pulseMs, duty, valid);
  drawTimeline(pulseMs);
  drawControlLabels(angle, minD, maxD);
}

// ---------- servo view ----------

function servoGeom() {
  const narrow = canvasWidth < 560;
  return { cx: narrow ? 100 : 145, cy: 160, R: narrow ? 68 : 92 };
}

function drawServo(a) {
  const { cx, cy, R } = servoGeom();
  // servo body with mounting tabs
  stroke('dimgray'); strokeWeight(1); fill('silver');
  rect(cx - R * 0.8, cy - 8, R * 1.6, 12, 3);
  fill('gray');
  rect(cx - R * 0.6, cy - 20, R * 1.2, 50, 8);

  // blue half-circle scale from 0 (left) to 180 (right)
  noFill(); stroke('steelblue'); strokeWeight(3);
  arc(cx, cy, 2 * R, 2 * R, PI, TWO_PI);
  for (let d = 0; d <= 180; d += 15) {
    const t = radians(180 - d);
    const major = d % 45 === 0;
    const r1 = R - (major ? 10 : 5);
    stroke('steelblue'); strokeWeight(major ? 2 : 1);
    line(cx + r1 * cos(t), cy - r1 * sin(t), cx + R * cos(t), cy - R * sin(t));
    if (major) {
      noStroke(); fill('steelblue'); textSize(13); textAlign(CENTER, CENTER);
      text(d + '°', cx + (R + 16) * cos(t), cy - (R + 12) * sin(t));
    }
  }

  // orange arm from the shaft toward the angle
  const t = radians(180 - a);
  const L = R - 16;
  stroke('darkorange'); strokeWeight(9); strokeCap(ROUND);
  line(cx, cy, cx + L * cos(t), cy - L * sin(t));
  noStroke(); fill('white'); stroke('dimgray'); strokeWeight(1);
  circle(cx, cy, 16);
}

// ---------- readout panel ----------

function drawReadout(angle, pulseMs, duty, valid) {
  const { cx, R } = servoGeom();
  const x = cx + R + 40;
  const w = canvasWidth - margin - x;
  noStroke(); textAlign(LEFT, TOP); textStyle(BOLD);
  textSize(canvasWidth < 560 ? 16 : 19);
  fill('black');
  text('Angle: ' + angle + '°', x, 42);
  fill('chocolate');
  text('Pulse: ' + (valid ? pulseMs.toFixed(2) + ' ms' : '--'), x, 68);
  fill('navy');
  text('duty_u16: ' + (valid ? duty : '--'), x, 94);
  textStyle(NORMAL);

  if (!valid) {
    fill('crimson'); textStyle(BOLD); textSize(15);
    text('Min must be smaller than max', x, 124, w);
    textStyle(NORMAL);
    return;
  }

  // the line of MicroPython that sends this pulse
  textFont('monospace'); textSize(canvasWidth < 560 ? 12 : 14);
  fill('whitesmoke'); stroke('silver'); strokeWeight(1);
  const code = 'servo.duty_u16(' + duty + ')';
  rect(x, 122, textWidth(code) + 14, 22, 4);
  noStroke(); fill('navy');
  text(code, x + 7, 126);
  textFont('sans-serif');

  drawGauge(x, 154, min(w, 360), pulseMs);
}

// zoomed-in pulse gauge from 0 to 2.5 ms, with the servo range marked
function drawGauge(x, y, w, pulseMs) {
  const g = ms => x + (ms / 2.5) * w;
  noStroke(); fill('black'); textSize(13); textAlign(LEFT, TOP);
  const label = w >= 300 ? 'Pulse width, zoomed in (servo range 1 to 2 ms)' : 'Pulse width, zoomed in';
  text(label, x, y);
  const by = y + 18;
  fill('lavender'); stroke('silver'); strokeWeight(1);
  rect(g(1), by, g(2) - g(1), 12);                 // the 0-180 degree range
  noFill(); rect(x, by, w, 12);
  noStroke(); fill('darkorange');
  rect(x, by + 2, g(min(pulseMs, 2.5)) - x, 8);    // this pulse
  fill('dimgray'); textSize(12); textAlign(CENTER, TOP);
  for (const ms of [0, 1, 1.5, 2, 2.5]) {
    stroke('dimgray'); line(g(ms), by + 12, g(ms), by + 16);
    noStroke(); text(ms + (ms === 2.5 ? ' ms' : ''), g(ms), by + 17);
  }
}

// ---------- PWM timeline: two 20 ms cycles ----------

function drawTimeline(pulseMs) {
  const x = 10, w = canvasWidth - 20;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, TL_TOP, w, TL_BOTTOM - TL_TOP, 6);

  const x0 = x + 44, x1 = x + w - 14;
  const T = ms => x0 + (ms / (2 * PERIOD_MS)) * (x1 - x0);
  const hiY = TL_TOP + 38, loY = TL_TOP + 84;

  noStroke(); fill('black'); textSize(14); textAlign(LEFT, TOP);
  text(canvasWidth < 560 ? 'PWM on config.SERVO_PIN, 50 Hz' :
    'PWM signal on config.SERVO_PIN: 50 Hz, two 20 ms cycles', x + 8, TL_TOP + 5);
  textSize(13); textAlign(RIGHT, CENTER);
  text('HIGH', x0 - 6, hiY);
  text('LOW', x0 - 6, loY);

  for (let c = 0; c < 2; c++) {
    const t0 = c * PERIOD_MS;
    // ghost pulses: the 1 ms and 2 ms ends of the servo range
    noStroke(); fill('lavender');
    rect(T(t0 + 1), hiY, T(t0 + 2) - T(t0 + 1), loY - hiY);
    stroke('mediumpurple'); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(T(t0 + 1), hiY, T(t0 + 1), loY);
    line(T(t0 + 2), hiY, T(t0 + 2), loY);
    drawingContext.setLineDash([]);

    if (pulseMs !== null) {
      // HIGH pulse (orange), then LOW for the rest of the period (gray)
      noStroke(); fill('bisque');
      rect(T(t0), hiY, T(t0 + pulseMs) - T(t0), loY - hiY);
      strokeWeight(3);
      stroke('darkorange');
      line(T(t0), loY, T(t0), hiY);
      line(T(t0), hiY, T(t0 + pulseMs), hiY);
      line(T(t0 + pulseMs), hiY, T(t0 + pulseMs), loY);
      stroke('darkgray');
      line(T(t0 + pulseMs), loY, T(t0 + PERIOD_MS), loY);
    }
    // dotted line at the end of each period
    stroke('gray'); strokeWeight(1);
    drawingContext.setLineDash([2, 4]);
    line(T(t0 + PERIOD_MS), TL_TOP + 24, T(t0 + PERIOD_MS), loY + 8);
    drawingContext.setLineDash([]);
  }

  // pulse arrow and label
  if (pulseMs !== null) {
    const ay = hiY - 9;
    arrow2(T(0), T(pulseMs), ay, 'chocolate');
    noStroke(); fill('chocolate'); textSize(14); textStyle(BOLD); textAlign(LEFT, CENTER);
    text('Pulse: ' + pulseMs.toFixed(2) + ' ms', T(2) + 8, ay);
    textStyle(NORMAL);
  }
  // period arrow and label
  const py = loY + 18;
  arrow2(T(0), T(PERIOD_MS), py, 'navy');
  noStroke(); fill('navy'); textSize(14); textAlign(CENTER, TOP);
  text('Period: 20 ms', (T(0) + T(PERIOD_MS)) / 2, py + 4);
  fill('mediumpurple'); textSize(13); textAlign(LEFT, TOP);
  text('shaded: 1 to 2 ms', T(PERIOD_MS) + 8, py + 4);
}

function arrow2(xa, xb, y, col) {
  stroke(col); strokeWeight(1.5);
  line(xa, y, xb, y);
  noStroke(); fill(col);
  if (xb - xa > 10) {
    triangle(xa, y, xa + 6, y - 4, xa + 6, y + 4);
    triangle(xb, y, xb - 6, y - 4, xb - 6, y + 4);
  }
}

function drawControlLabels(angle, minD, maxD) {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Angle: ' + angle + '°' + (sweeping ? ' (sweep)' : ''), 10, drawHeight + 54);
  text('Min duty (0°): ' + minD, 10, drawHeight + 89);
  text('Max duty (180°): ' + maxD, 10, drawHeight + 124);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof maxSlider !== 'undefined') {
    const w = canvasWidth - sliderLeftMargin - margin;
    angleSlider.size(w); minSlider.size(w); maxSlider.size(w);
  }
}
