// Line Follower Simulator
// CANVAS_HEIGHT: 550
// Bloom L4 (Analyze): explain how the four IR sensor states and the fast/slow
// motor speeds make the robot steer, and predict what happens when the speed is
// too high, the correction is too weak, or the loop runs too slowly.
// The robot runs the exact rules of adjust_motors() from Chapter 10.

let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

// ---------- world (centimeters) ----------
const WORLD_W = 300, WORLD_H = 180;
const LINE_HALF = 2;          // the black line is 4 cm wide
const ROBOT_L = 16, ROBOT_W = 12;
const SENSOR_FWD = 8;         // sensors sit on the front edge
const SENSOR_SIDE = 2;        // 4 cm apart
const WHEEL_BASE = 12;        // cm between the wheels
const TOP_SPEED = 80;         // cm/s at duty 65535
const FULL = 65535;
const TRAIL_S = 15;
const SUBSTEPS = 4;

let trackName = 'Oval';
let track = [];               // list of {x, y} points along the line center
let robot = { x: 0, y: 0, h: 0 };
let leftVal = 1, rightVal = 1;  // 0 = LOW (on line), 1 = HIGH (off line)
let leftDuty = 0, rightDuty = 0;
let updateTimer = 0;
let simTime = 0;
let framesTotal = 0, framesOnLine = 0;
let bothHighTime = 0;
let lineLost = false;
let running = false;
let trail = [];

// layout
let view = { x: 10, y: 40, s: 1.7 };
let panel = { x: 540, y: 40, w: 250, h: 350, narrow: false };

// controls
let runButton, resetButton, clearButton, trackSelect;
let fastSlider, slowSlider, rateSlider;
let trackLabelX = 300;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  runButton = createButton('Run');
  runButton.parent(document.querySelector('main'));
  runButton.style('min-width', '64px');
  runButton.mousePressed(toggleRun);
  resetButton = createButton('Reset robot');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetRobot);
  clearButton = createButton('Clear path');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(() => { trail = []; });
  trackSelect = createSelect();
  trackSelect.parent(document.querySelector('main'));
  trackSelect.option('Oval');
  trackSelect.option('Figure-8');
  trackSelect.option('Zigzag');
  trackSelect.selected('Oval');
  trackSelect.changed(() => { trackName = trackSelect.value(); buildTrack(); resetRobot(); });

  // duty sliders move in steps of 1000 but also snap to FULL (65535) and HALF (32767)
  fastSlider = createSlider(20000, 65535, 65535, 1);
  fastSlider.parent(document.querySelector('main'));
  fastSlider.input(() => snapDuty(fastSlider));
  slowSlider = createSlider(0, 60000, 32767, 1);
  slowSlider.parent(document.querySelector('main'));
  slowSlider.input(() => snapDuty(slowSlider));
  rateSlider = createSlider(5, 100, 50, 5);
  rateSlider.parent(document.querySelector('main'));

  positionControls();
  buildTrack();
  resetRobot();

  describe('Top-down view of a black line track on a white floor with a small green robot. Two sensor circles on the ' +
    'front of the robot turn black when they are over the line (LOW) and yellow when they are off it (HIGH). A table ' +
    'highlights which of the four sensor states is active and what the motors do. Sliders set the fast and slow motor ' +
    'duty and the update rate. A dropdown picks an oval, figure-8, or zigzag track. Readouts show both sensor values, ' +
    'both motor duties, the tightest turn, and the percent of time on the line.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  for (const b of [runButton, resetButton, clearButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 80) + 6;
  }
  x += 10;
  trackLabelX = x;
  textSize(defaultTextSize);
  trackSelect.position(x + textWidth('Track:') + 8, y0);
  const w = max(100, canvasWidth - sliderLeftMargin - margin);
  fastSlider.position(sliderLeftMargin, y0 + 36);
  fastSlider.size(w);
  slowSlider.position(sliderLeftMargin, y0 + 70);
  slowSlider.size(w);
  rateSlider.position(sliderLeftMargin, y0 + 104);
  rateSlider.size(w);
}

function computeLayout() {
  const top = 40, bottom = drawHeight - 10;
  if (canvasWidth >= 620) {
    const pw = 250;
    const vw = canvasWidth - pw - 30;
    view.s = min(vw / WORLD_W, (bottom - top) / WORLD_H);
    view.x = 10;
    view.y = top + ((bottom - top) - WORLD_H * view.s) / 2;
    panel = { x: 10 + vw + 10, y: top, w: pw, h: bottom - top, narrow: false };
  } else {
    const ph = 100;
    view.s = min((canvasWidth - 20) / WORLD_W, (bottom - top - ph - 8) / WORLD_H);
    view.x = (canvasWidth - WORLD_W * view.s) / 2;
    view.y = top;
    const py = top + WORLD_H * view.s + 8;
    panel = { x: 10, y: py, w: canvasWidth - 20, h: bottom - py, narrow: true };
  }
}

// ---------- tracks ----------
function addArc(pts, cx, cy, r, a0, a1) {
  const n = max(4, ceil(abs(a1 - a0) * r / 2));
  for (let k = 1; k <= n; k++) {
    const a = a0 + (a1 - a0) * k / n;
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
}

function addLine(pts, x1, y1) {
  const p = pts[pts.length - 1];
  const n = max(1, ceil(dist(p.x, p.y, x1, y1) / 2));
  for (let k = 1; k <= n; k++) pts.push({ x: lerp(p.x, x1, k / n), y: lerp(p.y, y1, k / n) });
}

// Round the corners of a closed polygon with radius r, then sample it every 2 cm.
function roundedPolygon(corners, r) {
  const pts = [];
  const n = corners.length;
  for (let i = 0; i < n; i++) {
    const p0 = corners[(i - 1 + n) % n], p1 = corners[i], p2 = corners[(i + 1) % n];
    const a = createVector(p0.x - p1.x, p0.y - p1.y).normalize();
    const b = createVector(p2.x - p1.x, p2.y - p1.y).normalize();
    const half = acos(constrain(a.dot(b), -1, 1)) / 2;
    const cut = r / tan(half);
    const start = { x: p1.x + a.x * cut, y: p1.y + a.y * cut };
    const end = { x: p1.x + b.x * cut, y: p1.y + b.y * cut };
    const bis = createVector(a.x + b.x, a.y + b.y).normalize();
    const cdist = r / sin(half);
    const c = { x: p1.x + bis.x * cdist, y: p1.y + bis.y * cdist };
    if (pts.length === 0) pts.push(start); else addLine(pts, start.x, start.y);
    let a0 = atan2(start.y - c.y, start.x - c.x);
    let a1 = atan2(end.y - c.y, end.x - c.x);
    let d = a1 - a0;
    while (d > PI) d -= TWO_PI;
    while (d < -PI) d += TWO_PI;
    addArc(pts, c.x, c.y, r, a0, a0 + d);
  }
  addLine(pts, pts[0].x, pts[0].y);
  return pts;
}

function buildTrack() {
  let pts = [];
  if (trackName === 'Oval') {
    const cx = 150, cy = 90, L = 75, r = 60;
    pts.push({ x: cx - L, y: cy - r });
    addLine(pts, cx + L, cy - r);
    addArc(pts, cx + L, cy, r, -HALF_PI, HALF_PI);
    addLine(pts, cx - L, cy + r);
    addArc(pts, cx - L, cy, r, HALF_PI, PI + HALF_PI);
  } else if (trackName === 'Figure-8') {
    // lemniscate of Gerono, stretched to fill the floor
    const n = 360;
    for (let k = 0; k <= n; k++) {
      const t = -HALF_PI + TWO_PI * k / n;
      pts.push({ x: 150 + 125 * cos(t), y: 90 + 70 * sin(2 * t) });
    }
  } else {
    // zigzag along the top, then back along the bottom
    const corners = [
      { x: 30, y: 60 }, { x: 70, y: 25 }, { x: 110, y: 70 }, { x: 150, y: 25 },
      { x: 190, y: 70 }, { x: 230, y: 25 }, { x: 270, y: 60 },
      { x: 270, y: 155 }, { x: 30, y: 155 }
    ];
    pts = roundedPolygon(corners, 8);
  }
  track = pts;
}

// shortest distance from (px, py) to the line center
function lineDistance(px, py) {
  let best = Infinity;
  for (let i = 1; i < track.length; i++) {
    const a = track[i - 1], b = track[i];
    const dx = b.x - a.x, dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    let t = len2 > 0 ? ((px - a.x) * dx + (py - a.y) * dy) / len2 : 0;
    t = constrain(t, 0, 1);
    const ex = a.x + t * dx - px, ey = a.y + t * dy - py;
    const d2 = ex * ex + ey * ey;
    if (d2 < best) best = d2;
  }
  return sqrt(best);
}

// ---------- robot and program ----------
function sensorPos(side) {
  // side = -1 for the left sensor, +1 for the right sensor
  const c = cos(robot.h), s = sin(robot.h);
  const lx = s, ly = -c;                 // unit vector pointing to the robot's left
  return {
    x: robot.x + SENSOR_FWD * c - side * SENSOR_SIDE * lx,
    y: robot.y + SENSOR_FWD * s - side * SENSOR_SIDE * ly
  };
}

function readSensors() {
  const L = sensorPos(-1), R = sensorPos(1);
  leftVal = lineDistance(L.x, L.y) <= LINE_HALF ? 0 : 1;
  rightVal = lineDistance(R.x, R.y) <= LINE_HALF ? 0 : 1;
}

function snapDuty(slider) {
  const v = slider.value();
  let best = round(v / 1000) * 1000;
  for (const c of [FULL, 32767]) if (abs(v - c) < abs(v - best)) best = c;
  slider.value(best);
}

function fastDuty() { return fastSlider.value(); }
function slowDuty() { return min(slowSlider.value(), fastSlider.value()); }

// the same rules as adjust_motors(left_val, right_val) in Chapter 10
function adjustMotors(lv, rv) {
  if (lv === 0 && rv === 1) {
    rightDuty = fastDuty();
    leftDuty = slowDuty();
  } else if (lv === 1 && rv === 0) {
    rightDuty = slowDuty();
    leftDuty = fastDuty();
  } else {
    rightDuty = fastDuty();
    leftDuty = fastDuty();
  }
}

function resetRobot() {
  running = false;
  if (runButton) runButton.html('Run');
  const a = track[0], b = track[3];
  robot = { x: a.x, y: a.y, h: atan2(b.y - a.y, b.x - a.x) };
  leftDuty = rightDuty = 0;
  updateTimer = 0;
  simTime = 0;
  framesTotal = framesOnLine = 0;
  bothHighTime = 0;
  lineLost = false;
  trail = [];
  readSensors();
}

function toggleRun() {
  if (lineLost) resetRobot();
  running = !running;
  runButton.html(running ? 'Pause' : 'Run');
}

function stepSim(dt) {
  simTime += dt;
  updateTimer -= dt;
  if (updateTimer <= 0) {
    readSensors();                       // lv = ir_left.value(); rv = ir_right.value()
    adjustMotors(leftVal, rightVal);     // adjust_motors(lv, rv)
    updateTimer += 1 / rateSlider.value(); // sleep(1 / rate)
  }
  // differential drive
  const v = (leftDuty + rightDuty) / 2 / FULL * TOP_SPEED;
  const w = (rightDuty - leftDuty) / FULL * TOP_SPEED / WHEEL_BASE;
  robot.h -= w * dt;                    // right wheel faster = turn left (counterclockwise)
  robot.x += v * cos(robot.h) * dt;
  robot.y += v * sin(robot.h) * dt;
}

function frameUpdate() {
  const dt = 1 / 60;
  for (let k = 0; k < SUBSTEPS; k++) stepSim(dt / SUBSTEPS);
  // what the sensors see right now (for display and time-on-line)
  const L = sensorPos(-1), R = sensorPos(1);
  const lNow = lineDistance(L.x, L.y) <= LINE_HALF, rNow = lineDistance(R.x, R.y) <= LINE_HALF;
  framesTotal++;
  if (lNow || rNow) {
    framesOnLine++;
    bothHighTime = 0;
  } else {
    bothHighTime += dt;
  }
  trail.push({ x: robot.x, y: robot.y, t: simTime });
  while (trail.length && simTime - trail[0].t > TRAIL_S) trail.shift();
  const off = robot.x < -20 || robot.x > WORLD_W + 20 || robot.y < -20 || robot.y > WORLD_H + 20;
  if (bothHighTime > 2 || off) {
    lineLost = true;
    running = false;
    leftDuty = rightDuty = 0;
    runButton.html('Run');
  }
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  // keep the slow speed at or below the fast speed
  if (slowSlider.value() > fastSlider.value()) slowSlider.value(fastSlider.value());
  if (running) frameUpdate();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTrack();
  drawTrail();
  drawRobot();
  drawBanner();
  drawPanel();

  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Line Follower Simulator', view.x + WORLD_W * view.s / 2, 8);

  drawControlLabels();
}

function drawTrack() {
  stroke('gray');
  fill('white');
  rect(view.x, view.y, WORLD_W * view.s, WORLD_H * view.s, 4);
  // sensor legend in the corner of the floor
  noStroke();
  fill(90);
  textSize(13);
  textAlign(LEFT, BOTTOM);
  if (WORLD_W * view.s > 330) text('Left sensor = blue ring    Right sensor = red ring', view.x + 8, view.y + WORLD_H * view.s - 5);
  noFill();
  stroke(20);
  strokeWeight(2 * LINE_HALF * view.s);
  strokeJoin(ROUND);
  beginShape();
  for (const p of track) vertex(view.x + p.x * view.s, view.y + p.y * view.s);
  endShape();
  strokeWeight(1);
}

function drawTrail() {
  strokeWeight(1.5);
  for (let i = 1; i < trail.length; i++) {
    const a = map(simTime - trail[i].t, 0, TRAIL_S, 230, 0);
    stroke(30, 100, 230, a);
    line(view.x + trail[i - 1].x * view.s, view.y + trail[i - 1].y * view.s,
      view.x + trail[i].x * view.s, view.y + trail[i].y * view.s);
  }
  strokeWeight(1);
}

function drawRobot() {
  push();
  translate(view.x + robot.x * view.s, view.y + robot.y * view.s);
  rotate(robot.h);
  scale(view.s);
  noStroke();
  fill(40);
  rect(-3.5, -ROBOT_W / 2 - 2, 7, 2.5, 0.8);
  rect(-3.5, ROBOT_W / 2 - 0.5, 7, 2.5, 0.8);
  stroke('darkolivegreen');
  strokeWeight(0.5);
  fill(107, 142, 35, 225);
  rect(-ROBOT_L / 2, -ROBOT_W / 2, ROBOT_L, ROBOT_W, 2.5);
  noStroke();
  fill('white');
  triangle(4, 0, -3, -3, -3, 3);
  pop();
  // sensors: black = LOW (over the line), light yellow = HIGH (over white)
  for (const [side, val] of [[-1, leftVal], [1, rightVal]]) {
    const p = sensorPos(side);
    stroke(side < 0 ? 'blue' : 'red');
    strokeWeight(1.5);
    fill(val === 0 ? 'black' : 'lightyellow');
    circle(view.x + p.x * view.s, view.y + p.y * view.s, max(9, 3 * view.s));
  }
  strokeWeight(1);
}

function drawBanner() {
  if (!lineLost && running) return;
  const cx = view.x + WORLD_W * view.s / 2, cy = view.y + WORLD_H * view.s / 2;
  textAlign(CENTER, CENTER);
  if (lineLost) {
    textSize(20);
    const msg = 'Line lost!';
    stroke('red');
    fill(255, 235, 235, 240);
    rect(cx - 150, cy - 30, 300, 60, 8);
    noStroke();
    fill('red');
    text(msg, cx, cy - 10);
    textSize(14);
    fill(120, 0, 0);
    text('Both sensors HIGH for 2 s. Press Run to retry.', cx, cy + 14);
  } else if (simTime === 0) {
    textSize(15);
    const msg = 'Press Run to start the robot.';
    const w = textWidth(msg) + 20;
    stroke('silver');
    fill(255, 255, 255, 235);
    rect(cx - w / 2, cy - 14, w, 28, 6);
    noStroke();
    fill(60);
    text(msg, cx, cy);
  }
}

function stateIndex() {
  if (leftVal === 1 && rightVal === 1) return 0;
  if (leftVal === 0 && rightVal === 1) return 1;
  if (leftVal === 1 && rightVal === 0) return 2;
  return 3;
}

function turnRadiusText() {
  const f = fastDuty(), s = slowDuty();
  if (f === s) return 'none (no turning)';
  return round(WHEEL_BASE / 2 * (f + s) / (f - s)) + ' cm';
}

function drawPanel() {
  const p = panel;
  const onLine = framesTotal ? round(100 * framesOnLine / framesTotal) : 100;
  const valText = v => v + (v === 0 ? ' LOW (line)' : ' HIGH (white)');
  const rows = [
    ['Left IR: ', valText(leftVal)],
    ['Right IR: ', valText(rightVal)],
    ['Left motor: ', '' + leftDuty],
    ['Right motor: ', '' + rightDuty],
    ['Time on line: ', onLine + ' %  (' + nf(simTime, 1, 1) + ' s)'],
    ['Tightest turn: ', turnRadiusText()]
  ];
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(p.x, p.y, p.w, p.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (p.narrow) {
    textSize(13);
    const colW = p.w / 2;
    rows.forEach((r, i) => {
      fill('black');
      text(r[0] + r[1], p.x + 6 + (i % 2) * colW, p.y + 6 + floor(i / 2) * 18);
    });
    const st = STATES[stateIndex()];
    fill('darkgoldenrod');
    textSize(14);
    text('State: ' + st.l + '/' + st.r + ' ' + st.act, p.x + 6, p.y + 62);
    return;
  }
  let y = p.y + 8;
  textSize(15);
  for (const [k, v] of rows) {
    fill('black');
    text(k, p.x + 10, y);
    fill(k.startsWith('Time') && onLine < 90 ? 'firebrick' : 'navy');
    text(v, p.x + 10 + textWidth(k), y);
    y += 21;
  }
  // loop timing, as in the chapter code
  textFont('monospace');
  textSize(13);
  fill(80);
  text('sleep(' + (1 / rateSlider.value()).toFixed(3) + ')  # ' + rateSlider.value() + ' Hz', p.x + 10, y + 2);
  textFont('sans-serif');
  y += 26;
  drawStateTable(p.x + 8, y, p.w - 16);
}

const STATES = [
  { l: 'HIGH', r: 'HIGH', act: 'both fast (line lost?)' },
  { l: 'LOW', r: 'HIGH', act: 'left slow: veers left' },
  { l: 'HIGH', r: 'LOW', act: 'right slow: veers right' },
  { l: 'LOW', r: 'LOW', act: 'both fast: straight' }
];

function drawStateTable(x, y, w) {
  noStroke();
  fill('black');
  textSize(14);
  textStyle(BOLD);
  text('Left', x + 2, y);
  text('Right', x + 48, y);
  text('Motors do', x + 100, y);
  textStyle(NORMAL);
  y += 20;
  const active = stateIndex();
  const rowH = 30;
  for (let i = 0; i < STATES.length; i++) {
    const st = STATES[i];
    if (i === active) {
      stroke('darkgoldenrod');
      fill('gold');
    } else {
      stroke('gainsboro');
      fill(248);
    }
    rect(x, y, w, rowH - 3, 5);
    for (const [bx, val] of [[x + 3, st.l], [x + 49, st.r]]) {
      stroke('gray');
      fill(val === 'LOW' ? 'black' : 'lightyellow');
      rect(bx, y + 4, 42, rowH - 11, 3);
      noStroke();
      fill(val === 'LOW' ? 'white' : 'black');
      textSize(12);
      textAlign(CENTER, CENTER);
      text(val, bx + 21, y + rowH / 2 - 1);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(st.act, x + 98, y + rowH / 2 - 1);
    y += rowH;
  }
  textAlign(LEFT, TOP);
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Track:', trackLabelX, y0 + 11);
  text('Fast speed (duty): ' + fastDuty(), 10, y0 + 46);
  text('Slow speed (duty): ' + slowDuty(), 10, y0 + 80);
  text('Update rate (Hz): ' + rateSlider.value(), 10, y0 + 114);
}

// ---------- responsive ----------
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
