// PID Feedback Loop Tuner
// CANVAS_HEIGHT: 475
// Bloom L3 (Apply): adjust Kp, Ki, and Kd one at a time and see how each changes a
// simulated robot's turn toward a target heading, including overshoot and
// settling time. Uses the chapter's formula:
//   output = Kp*e + Ki*(integral of e dt) + Kd*(de/dt),  e = target - heading
// Model: a robot turning in place at 50 Hz. Its turn rate follows the PID output
// with a short motor lag and a 0.1 s sensor delay, and one wheel drags slightly while driving,
// so P-only control leaves a small steady-state error that Ki can remove.

let canvasWidth = 800;
let drawHeight = 390;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

// ---- model constants ----
const DT = 0.02;           // 50 Hz control loop, like LOOP_HZ in the build plan
const RUN_TIME = 10;       // each run shows 10 seconds
const STEP_AT = 0.5;       // the target jumps from 0 to 90 degrees at t = 0.5 s
const GAIN = 6;            // turn rate (deg/s) per unit of controller output
const MOTOR_TAU = 0.4;     // the robot takes about 0.4 s to reach a new turn rate
const SENSOR_DELAY = 0.1;  // the heading reading is 0.1 s old
const DRIFT = -1.5;        // one wheel drags while driving: a constant pull on the output
const OUT_MAX = 30;        // controller output limit (the motors can only go so fast)
const Y_MIN = -20, Y_MAX = 160;

let kpSlider, kiSlider, kdSlider, stepButton, resetButton;
let run = null;            // current run: arrays of samples
let ghost = null;          // previous run, drawn in light gray for comparison
let lastInputMs = 0;
let playing = false;       // Step Target animates the run in real time
let playT = RUN_TIME;

let plotL, plotR, plotT, plotB, panelX;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  kpSlider = createSlider(0, 1.0, 0.2, 0.01);
  kpSlider.parent(document.querySelector('main'));
  kiSlider = createSlider(0, 0.2, 0.0, 0.005);
  kiSlider.parent(document.querySelector('main'));
  kdSlider = createSlider(0, 0.5, 0.0, 0.01);
  kdSlider.parent(document.querySelector('main'));
  for (const s of [kpSlider, kiSlider, kdSlider]) s.input(gainsChanged);

  stepButton = createButton('Step Target');
  stepButton.parent(document.querySelector('main'));
  stepButton.mousePressed(stepTarget);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  run = simulate(kpSlider.value(), kiSlider.value(), kdSlider.value());
  positionControls();
  describe('A strip chart of a robot\'s heading over 10 seconds. A dashed purple line is the ' +
    'target heading, which jumps from 0 to 90 degrees; a solid blue line is the robot\'s actual ' +
    'heading under PID control. Sliders set Kp, Ki, and Kd. A panel shows the live error, ' +
    'overshoot, settling time, final error, the P, I, and D terms, and a small heading dial.', LABEL);
}

function positionControls() {
  const colW = canvasWidth / 2;
  const lblW = canvasWidth < 600 ? 78 : 90;
  const sw = max(50, colW - lblW - 18);
  kpSlider.position(margin + lblW, drawHeight + 10); kpSlider.size(sw);
  kiSlider.position(colW + lblW, drawHeight + 10); kiSlider.size(sw);
  kdSlider.position(margin + lblW, drawHeight + 47); kdSlider.size(sw);
  stepButton.position(colW, drawHeight + 45);
  resetButton.position(colW + stepButton.elt.offsetWidth + 10, drawHeight + 45);
}

// ---------------------------------------------------------------- model
// Simulate one 10 s run. Returns samples of time, target, measured heading,
// and the three PID terms.
function simulate(kp, ki, kd) {
  const n = Math.round(RUN_TIME / DT);
  const delaySteps = Math.round(SENSOR_DELAY / DT);
  const buf = new Array(delaySteps).fill(0);
  let heading = 0, rate = 0, integral = 0, prevMeas = 0;
  const out = { t: [], target: [], heading: [], p: [], i: [], d: [] };
  for (let k = 0; k < n; k++) {
    const t = k * DT;
    const target = t >= STEP_AT ? 90 : 0;
    const meas = buf.shift(); buf.push(heading);      // the sensor reading is 0.1 s old
    const e = target - meas;
    const pTerm = kp * e;
    const iTerm = ki * integral;
    // derivative of the error, computed from the heading so the target jump does not cause a spike
    const dTerm = -kd * (meas - prevMeas) / DT;
    prevMeas = meas;
    const raw = pTerm + iTerm + dTerm;
    const u = constrain(raw, -OUT_MAX, OUT_MAX);
    // only keep integrating while the output is not maxed out (prevents wind-up)
    if (u === raw || Math.sign(e) !== Math.sign(raw)) integral += e * DT;
    const drift = t >= STEP_AT ? DRIFT : 0;            // the drag starts when the robot starts driving
    rate += (GAIN * (u + drift) - rate) * DT / MOTOR_TAU;
    heading += rate * DT;
    out.t.push(t); out.target.push(target); out.heading.push(heading);
    out.p.push(pTerm); out.i.push(iTerm); out.d.push(dTerm);
  }
  out.metrics = measure(out);
  return out;
}

function measure(r) {
  let peak = -Infinity;
  for (let k = 0; k < r.t.length; k++) if (r.t[k] >= STEP_AT) peak = max(peak, r.heading[k]);
  const overshoot = max(0, (peak - 90) / 90 * 100);
  // settling time: last moment the heading was more than 2 degrees from the target
  let settle = null;
  for (let k = r.t.length - 1; k >= 0; k--) {
    if (abs(r.heading[k] - 90) > 2) { settle = k === r.t.length - 1 ? null : r.t[k + 1] - STEP_AT; break; }
    if (r.t[k] < STEP_AT) break;
  }
  const finalErr = 90 - r.heading[r.heading.length - 1];
  return { overshoot, settle, finalErr };
}

function gainsChanged() {
  // a new drag starts a new comparison: keep the old curve as a gray ghost
  if (millis() - lastInputMs > 400) ghost = run;
  lastInputMs = millis();
  run = simulate(kpSlider.value(), kiSlider.value(), kdSlider.value());
  playing = false; playT = RUN_TIME;
}

function stepTarget() {
  run = simulate(kpSlider.value(), kiSlider.value(), kdSlider.value());
  playing = true; playT = 0;
}

function resetAll() {
  kpSlider.value(0.2); kiSlider.value(0); kdSlider.value(0);
  ghost = null;
  run = simulate(0.2, 0, 0);
  playing = false; playT = RUN_TIME;
}

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();
  if (playing) {
    playT += min(deltaTime, 100) / 1000;
    if (playT >= RUN_TIME) { playT = RUN_TIME; playing = false; }
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  panelX = canvasWidth - (narrow ? 140 : 215);
  plotL = narrow ? 44 : 56; plotR = panelX - 14; plotT = 44; plotB = drawHeight - 34;

  drawAxes();

  noStroke(); fill('black'); textSize(narrow ? 16 : 20); textAlign(LEFT, TOP);
  text('PID Feedback Loop Tuner', margin, 8);

  drawCurves();
  drawPanel(narrow);
  drawControlLabels();
}

function px(t) { return map(t, 0, RUN_TIME, plotL, plotR); }
function py(h) { return map(h, Y_MIN, Y_MAX, plotB, plotT); }

function drawAxes() {
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(plotL, plotT, plotR - plotL, plotB - plotT);
  textSize(11);
  for (let h = 0; h <= 150; h += 30) {
    stroke('gainsboro'); line(plotL, py(h), plotR, py(h));
    noStroke(); fill('dimgray'); textAlign(RIGHT, CENTER);
    text(h + '°', plotL - 4, py(h));
  }
  for (let t = 0; t <= RUN_TIME; t += 2) {
    stroke('gainsboro'); line(px(t), plotT, px(t), plotB);
    noStroke(); fill('dimgray'); textAlign(CENTER, TOP);
    text(t + ' s', px(t), plotB + 4);
  }
  noStroke(); fill('black'); textSize(13); textAlign(CENTER, TOP);
  text('Time (seconds)', (plotL + plotR) / 2, plotB + 18);
  push();
  translate(14, (plotT + plotB) / 2); rotate(-HALF_PI);
  textAlign(CENTER, CENTER); text('Heading (degrees)', 0, 0);
  pop();
}

function drawCurves() {
  const showUntil = playing ? playT : RUN_TIME;
  // previous run (ghost)
  if (ghost) {
    const c = color('gray'); c.setAlpha(110);
    stroke(c); strokeWeight(2); noFill();
    beginShape();
    for (let k = 0; k < ghost.t.length; k += 2) vertex(px(ghost.t[k]), py(constrain(ghost.heading[k], Y_MIN, Y_MAX)));
    endShape();
  }
  // +/- 2 degree settling band
  const band = color('limegreen'); band.setAlpha(40);
  noStroke(); fill(band);
  rect(px(STEP_AT), py(92), plotR - px(STEP_AT), py(88) - py(92));
  // target (dashed)
  stroke('purple'); strokeWeight(2);
  drawingContext.setLineDash([8, 6]);
  line(px(0), py(0), px(STEP_AT), py(0));
  line(px(STEP_AT), py(0), px(STEP_AT), py(90));
  line(px(STEP_AT), py(90), px(RUN_TIME), py(90));
  drawingContext.setLineDash([]);
  // actual heading (solid)
  stroke('royalblue'); strokeWeight(3); noFill();
  beginShape();
  for (let k = 0; k < run.t.length && run.t[k] <= showUntil; k++) {
    vertex(px(run.t[k]), py(constrain(run.heading[k], Y_MIN, Y_MAX)));
  }
  endShape();
  // playhead
  if (playing) {
    stroke('orange'); strokeWeight(1.5);
    line(px(playT), plotT, px(playT), plotB);
  }
  // legend
  const lx = plotL + 10, ly = plotT + 10;
  noStroke(); fill(255, 255, 255, 220);
  rect(lx - 4, ly - 4, 196, ghost ? 58 : 40, 5);
  textSize(12); textAlign(LEFT, CENTER);
  stroke('purple'); strokeWeight(2); drawingContext.setLineDash([6, 4]);
  line(lx, ly + 6, lx + 24, ly + 6); drawingContext.setLineDash([]);
  noStroke(); fill('black'); text('target heading', lx + 30, ly + 6);
  stroke('royalblue'); strokeWeight(3); line(lx, ly + 24, lx + 24, ly + 24);
  noStroke(); fill('black'); text('actual heading (now)', lx + 30, ly + 24);
  if (ghost) {
    const c = color('gray'); c.setAlpha(140);
    stroke(c); strokeWeight(2); line(lx, ly + 42, lx + 24, ly + 42);
    noStroke(); fill('black'); text('previous settings', lx + 30, ly + 42);
  }
}

function sampleAt(t) {
  return constrain(Math.floor(t / DT), 0, run.t.length - 1);
}

function drawPanel(narrow) {
  const x = panelX, y = 40, w = canvasWidth - panelX - 10;
  const k = sampleAt(playing ? playT : RUN_TIME - DT);
  const err = run.target[k] - run.heading[k];
  const m = run.metrics;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, plotB - y, 8);

  noStroke(); textAlign(LEFT, TOP);
  const fs = narrow ? 11 : 14, lh = narrow ? 16 : 21;
  let yy = y + 8;
  fill('black'); textStyle(BOLD); textSize(fs);
  text(playing ? 'Live, t = ' + nf(playT, 1, 1) + ' s' : 'Result of this run', x + 8, yy); yy += lh + 2;
  textStyle(NORMAL);
  const rows = [
    ['Error now', nf(err, 1, 1) + '°', abs(err) > 2 ? 'crimson' : 'forestgreen'],
    ['Overshoot', nf(m.overshoot, 1, 0) + '%', m.overshoot > 10 ? 'crimson' : 'black'],
    [narrow ? 'Settle time' : 'Settling (±2°)', m.settle === null ? (narrow ? 'none' : 'not in 10 s') : nf(m.settle, 1, 1) + ' s', m.settle === null ? 'crimson' : 'black'],
    ['Final error', nf(m.finalErr, 1, 1) + '°', abs(m.finalErr) > 2 ? 'crimson' : 'black']
  ];
  for (const [a, b, c] of rows) {
    fill('dimgray'); text(a, x + 8, yy);
    fill(c); textStyle(BOLD); textAlign(RIGHT, TOP); text(b, x + w - 8, yy);
    textStyle(NORMAL); textAlign(LEFT, TOP);
    yy += lh;
  }
  if (narrow) return;

  // P, I, D terms at this moment: which part of the controller is doing the work?
  yy += 6;
  fill('black'); textStyle(BOLD); text('Controller terms now', x + 8, yy); textStyle(NORMAL);
  yy += 20;
  const terms = [['P', run.p[k], 'royalblue'], ['I', run.i[k], 'darkorange'], ['D', run.d[k], 'seagreen']];
  const bx = x + 30, bw = w - 90, mid = bx + bw / 2;
  for (const [name, v, col] of terms) {
    fill('black'); textSize(13); text(name, x + 10, yy);
    fill('whitesmoke'); stroke('silver'); rect(bx, yy, bw, 13);
    noStroke(); fill(col);
    const len = constrain(v / OUT_MAX, -1, 1) * bw / 2;
    rect(min(mid, mid + len), yy, abs(len), 13);
    stroke('gray'); line(mid, yy - 2, mid, yy + 15); noStroke();
    fill('black'); textAlign(RIGHT, TOP); text(nf(v, 1, 1), x + w - 8, yy); textAlign(LEFT, TOP);
    yy += 21;
  }

  // small top-down dial: target (purple) and robot heading (blue)
  const r = min(40, (plotB - yy - 16) / 2);
  if (r > 18) {
    const cx = x + w / 2, cy = yy + 8 + r;
    fill('white'); stroke('slategray'); strokeWeight(1.5); circle(cx, cy, 2 * r);
    const ang = h => radians(h - 90);
    stroke('purple'); strokeWeight(2);
    line(cx, cy, cx + cos(ang(run.target[k])) * r, cy + sin(ang(run.target[k])) * r);
    stroke('royalblue'); strokeWeight(3);
    line(cx, cy, cx + cos(ang(run.heading[k])) * (r - 4), cy + sin(ang(run.heading[k])) * (r - 4));
    noStroke(); fill('dimgray'); textSize(10); textAlign(CENTER, BOTTOM);
    text('N', cx, cy - r - 1);
  }
}

function drawControlLabels() {
  const colW = canvasWidth / 2;
  noStroke(); fill('black'); textSize(15); textAlign(LEFT, CENTER);
  text('Kp: ' + nf(kpSlider.value(), 1, 2), margin, drawHeight + 20);
  text('Ki: ' + nf(kiSlider.value(), 1, 3), colW, drawHeight + 20);
  text('Kd: ' + nf(kdSlider.value(), 1, 2), margin, drawHeight + 57);
  const bx = resetButton.x + resetButton.elt.offsetWidth + 12;
  if (bx + 150 < canvasWidth) {
    fill('dimgray'); textSize(13);
    text('Target jumps 0° → 90°', bx, drawHeight + 57);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.min(900, container.offsetWidth);
}
