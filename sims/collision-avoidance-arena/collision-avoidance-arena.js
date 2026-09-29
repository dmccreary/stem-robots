// Collision Avoidance Arena
// CANVAS_HEIGHT: 550
// Bloom L3 (Apply): tune STOP_DIST_CM and SLOW_DIST_CM and predict how the
// robot's path, speed, and number of turns will change. The virtual robot runs
// the same three-zone rules as the Chapter 10 collision avoidance program:
// full speed above SLOW_DIST_CM, half speed between the two thresholds, and
// stop + turn at or below STOP_DIST_CM. All physics is done in centimeters.

let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 225;
let defaultTextSize = 16;

// ---------- arena model (all units are centimeters) ----------
const ARENA_W = 360;
const ARENA_H = 240;
const BOXES = [
  { x: 60, y: 55, w: 40, h: 40 },
  { x: 150, y: 150, w: 60, h: 30 },
  { x: 270, y: 100, w: 40, h: 40 }
];
const ROBOT_L = 20;          // robot length along its heading (cm)
const ROBOT_W = 16;          // robot width (cm)
const FULL = 65535;          // go_forward() duty
const HALF = 32767;          // go_slow() duty
const LOOP_S = 0.05;         // sleep(0.05) at the end of the while True loop
const STOP_PAUSE_S = 0.1;    // stop_motors(); sleep(0.1)
const TURN_S = 0.4;          // turn_left(duration=0.4)
const MOTOR_TAU = 0.08;      // motors and wheels need a moment to speed up / slow down
const DT = 1 / 60;           // one simulation step per frame
const TRAIL_S = 20;          // keep 20 seconds of path
const CELL = 10;             // coverage grid cell size (cm)

// ---------- robot + program state ----------
let robot = { x: 180, y: 120, h: 0, v: 0 };
let mode = 'drive';          // 'drive' | 'stopping' | 'turning'
let modeTimer = 0;
let loopTimer = 0;
let duty = 0;
let reading = 0;             // last ToF reading in cm (with noise)
let zone = 'FORWARD';
let turnDir = 0;
let turnRate = 0;
let turnLeftToGo = 0;
let turns = 0;
let lastTurn = '-';
let path = [];
let turnSpots = [];
let turnTimes = [];
let simTime = 0;
let touches = 0;
let lastTouchTime = -10;
let bumpFlash = 0;
let stuckUntil = -1;
let visited = [];
let visitedCount = 0;
let freeCells = 0;
let running = false;

// ---------- screen mapping ----------
let ax = 10, ay = 40, s = 1.4;      // arena origin and pixels per cm
let panel = { x: 0, y: 0, w: 0, h: 0, stacked: false };

// ---------- controls ----------
let runButton, resetButton, clearButton, turnSelect;
let stopSlider, slowSlider, speedSlider;
let turnLabel = { text: 'Turn choice:', x: 230 };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(dropRobot);
  textSize(defaultTextSize);

  runButton = createButton('Run');
  runButton.parent(document.querySelector('main'));
  runButton.mousePressed(toggleRun);
  runButton.style('min-width', '64px');

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSim);

  clearButton = createButton('Clear Path');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(clearPath);

  turnSelect = createSelect();
  turnSelect.parent(document.querySelector('main'));
  turnSelect.option('Random (real code)');
  turnSelect.option('Always left');
  turnSelect.option('Always right');
  turnSelect.selected('Random (real code)');

  stopSlider = createSlider(5, 40, 20, 1);
  stopSlider.parent(document.querySelector('main'));
  slowSlider = createSlider(20, 100, 50, 5);
  slowSlider.parent(document.querySelector('main'));
  speedSlider = createSlider(20, 100, 60, 5);
  speedSlider.parent(document.querySelector('main'));

  positionControls();
  resetSim();

  describe('Top-down view of a walled arena with three tan boxes and a small green robot. ' +
    'A colored sensor beam shows the time-of-flight distance ahead: green above the slow distance, ' +
    'amber between the slow and stop distances, red at the stop distance. Dashed arcs show the two ' +
    'thresholds. Press Run to watch the robot drive, slow down, stop, and turn. Sliders set the stop ' +
    'distance, slow distance, and full speed. A dropdown picks random, always-left, or always-right turns. ' +
    'A readout lists distance, zone, motor duty, turn count, floor covered, and wall touches.', LABEL);
}

// ---------- layout ----------
function computeLayout() {
  const top = 38;
  const availH = drawHeight - top - 10;
  if (canvasWidth >= 620) {
    const panelW = 190;
    s = min((canvasWidth - panelW - 32) / ARENA_W, availH / ARENA_H);
    ax = 10;
    ay = top;
    panel = { x: ax + ARENA_W * s + 12, y: top, w: canvasWidth - (ax + ARENA_W * s + 12) - 10, h: availH, stacked: false };
  } else {
    const panelH = 92;
    s = min((canvasWidth - 20) / ARENA_W, (availH - panelH - 6) / ARENA_H);
    ax = (canvasWidth - ARENA_W * s) / 2;
    ay = top;
    panel = { x: 10, y: ay + ARENA_H * s + 6, w: canvasWidth - 20, h: drawHeight - (ay + ARENA_H * s + 6) - 6, stacked: true };
  }
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  runButton.position(x, y0);
  x += (runButton.elt.offsetWidth || 50) + 6;
  resetButton.position(x, y0);
  x += (resetButton.elt.offsetWidth || 55) + 6;
  clearButton.position(x, y0);
  x += (clearButton.elt.offsetWidth || 85) + 14;
  textSize(defaultTextSize);
  const label = (canvasWidth - x > 280) ? 'Turn choice:' : 'Turn:';
  turnLabel = { text: label, x: x };
  x += textWidth(label) + 8;
  turnSelect.position(x, y0);
  turnSelect.size(max(110, min(180, canvasWidth - x - 10)));

  const w = max(100, canvasWidth - sliderLeftMargin - margin);
  stopSlider.position(sliderLeftMargin, y0 + 36);
  stopSlider.size(w);
  slowSlider.position(sliderLeftMargin, y0 + 70);
  slowSlider.size(w);
  speedSlider.position(sliderLeftMargin, y0 + 104);
  speedSlider.size(w);
}

// ---------- simulation control ----------
function toggleRun() {
  running = !running;
  runButton.html(running ? 'Pause' : 'Run');
  if (running && mode === 'drive') loopTimer = 0;
}

function resetSim() {
  running = false;
  if (runButton) runButton.html('Run');
  robot = { x: 180, y: 120, h: 0, v: 0 };
  mode = 'drive';
  modeTimer = 0;
  loopTimer = 0;
  duty = 0;
  turns = 0;
  lastTurn = '-';
  turnTimes = [];
  simTime = 0;
  touches = 0;
  lastTouchTime = -10;
  bumpFlash = 0;
  stuckUntil = -1;
  // Reset keeps the slider and dropdown settings so you can rerun an experiment
  clearPath();
  sense();
}

function clearPath() {
  path = [];
  turnSpots = [];
  visited = [];
  visitedCount = 0;
  freeCells = 0;
  for (let i = 0; i < ARENA_W / CELL; i++) {
    visited.push([]);
    for (let j = 0; j < ARENA_H / CELL; j++) {
      const cx = i * CELL + CELL / 2, cy = j * CELL + CELL / 2;
      const blocked = BOXES.some(b => cx > b.x && cx < b.x + b.w && cy > b.y && cy < b.y + b.h);
      visited[i].push(blocked ? -1 : 0);
      if (!blocked) freeCells++;
    }
  }
  markVisited();
}

// Click inside the arena to drop the robot there with a random heading.
function dropRobot() {
  const cx = (mouseX - ax) / s;
  const cy = (mouseY - ay) / s;
  if (cx < 0 || cx > ARENA_W || cy < 0 || cy > ARENA_H) return;
  robot.x = constrain(cx, 12, ARENA_W - 12);
  robot.y = constrain(cy, 12, ARENA_H - 12);
  robot.h = random(TWO_PI);
  robot.v = 0;
  mode = 'drive';
  loopTimer = 0;
  resolveCollisions(false);
  sense();
}

// ---------- the robot's program (same rules as the chapter code) ----------
function sense() {
  const d = tofDistance();
  reading = max(0, d + random(-1, 1));    // about 1 cm of sensor noise
  const stopD = stopSlider.value();
  const slowD = slowSlider.value();
  if (reading > slowD) zone = 'FORWARD';
  else if (reading > stopD) zone = 'SLOW';
  else zone = 'TURN';
  return reading;
}

function controlLoop() {
  const dist_cm = sense();
  if (dist_cm > slowSlider.value()) {
    duty = FULL;                        // go_forward()
  } else if (dist_cm > stopSlider.value()) {
    duty = HALF;                        // go_slow()
  } else {
    duty = 0;                           // stop_motors(); sleep(0.1)
    mode = 'stopping';
    modeTimer = STOP_PAUSE_S;
  }
}

function startTurn() {
  const choice = turnSelect.value();
  if (choice === 'Always left') turnDir = -1;
  else if (choice === 'Always right') turnDir = 1;
  else turnDir = random([-1, 1]);          // random.choice(["left", "right"])
  lastTurn = turnDir < 0 ? 'LEFT' : 'RIGHT';
  // a timed 0.4 s spin is about 90 degrees, give or take half a degree
  turnLeftToGo = HALF_PI + random(-0.01, 0.01);
  turnRate = turnLeftToGo / TURN_S;
  mode = 'turning';
  turns++;
  turnSpots.push({ x: robot.x, y: robot.y, t: simTime });
  turnTimes.push(simTime);
  turnTimes = turnTimes.filter(t => simTime - t <= 10);
  if (turnTimes.length >= 6) stuckUntil = simTime + 3;
}

function stepSim(dt) {
  simTime += dt;
  if (mode === 'drive') {
    loopTimer -= dt;
    if (loopTimer <= 0) {
      controlLoop();
      loopTimer += LOOP_S;
    }
  } else if (mode === 'stopping') {
    modeTimer -= dt;
    if (modeTimer <= 0) startTurn();
  } else if (mode === 'turning') {
    const step = min(turnRate * dt, turnLeftToGo);
    robot.h += turnDir * step;
    turnLeftToGo -= step;
    if (turnLeftToGo <= 1e-6) {
      mode = 'drive';
      duty = 0;
      loopTimer = 0;
    }
  }
  // wheels cannot change speed instantly, so the forward speed lags the duty
  const target = (mode === 'drive') ? duty / FULL * speedSlider.value() : 0;
  robot.v += (target - robot.v) * min(1, dt / MOTOR_TAU);
  robot.x += cos(robot.h) * robot.v * dt;
  robot.y += sin(robot.h) * robot.v * dt;
  resolveCollisions(true);

  path.push({ x: robot.x, y: robot.y, t: simTime });
  while (path.length && simTime - path[0].t > TRAIL_S) path.shift();
  while (turnSpots.length && simTime - turnSpots[0].t > TRAIL_S) turnSpots.shift();
  markVisited();
}

// Mark the floor cells under the robot's center and both sides as covered.
function markVisited() {
  const px = -sin(robot.h), py = cos(robot.h);
  for (const off of [-6, 0, 6]) {
    const i = floor((robot.x + px * off) / CELL), j = floor((robot.y + py * off) / CELL);
    if (visited[i] && visited[i][j] === 0) {
      visited[i][j] = 1;
      visitedCount++;
    }
  }
}

// ---------- geometry ----------
function rayHit(ox, oy, dx, dy) {
  // distance from (ox, oy) along (dx, dy) to the first wall or box
  let best = Infinity;
  if (dx > 1e-9) best = min(best, (ARENA_W - ox) / dx);
  if (dx < -1e-9) best = min(best, (0 - ox) / dx);
  if (dy > 1e-9) best = min(best, (ARENA_H - oy) / dy);
  if (dy < -1e-9) best = min(best, (0 - oy) / dy);
  for (const b of BOXES) {
    let tmin = -Infinity, tmax = Infinity;
    if (abs(dx) < 1e-9) {
      if (ox < b.x || ox > b.x + b.w) continue;
    } else {
      let t1 = (b.x - ox) / dx, t2 = (b.x + b.w - ox) / dx;
      tmin = max(tmin, min(t1, t2));
      tmax = min(tmax, max(t1, t2));
    }
    if (abs(dy) < 1e-9) {
      if (oy < b.y || oy > b.y + b.h) continue;
    } else {
      let t1 = (b.y - oy) / dy, t2 = (b.y + b.h - oy) / dy;
      tmin = max(tmin, min(t1, t2));
      tmax = min(tmax, max(t1, t2));
    }
    if (tmax >= max(tmin, 0) && tmin >= 0) best = min(best, tmin);
  }
  return max(0, best);
}

function sensorOrigin() {
  return { x: robot.x + cos(robot.h) * ROBOT_L / 2, y: robot.y + sin(robot.h) * ROBOT_L / 2 };
}

// The sensor reports the closest thing inside its 10 degree cone.
function tofDistance() {
  const o = sensorOrigin();
  let d = Infinity;
  for (let k = -2; k <= 2; k++) {
    const a = robot.h + radians(2.5 * k);
    d = min(d, rayHit(o.x, o.y, cos(a), sin(a)));
  }
  return d;
}

function robotPoints() {
  const c = cos(robot.h), sn = sin(robot.h);
  const hl = ROBOT_L / 2, hw = ROBOT_W / 2;
  return [[hl, hw], [hl, -hw], [-hl, hw], [-hl, -hw], [hl, 0], [0, hw], [0, -hw]]
    .map(([a, b]) => ({ x: robot.x + a * c - b * sn, y: robot.y + a * sn + b * c }));
}

// Push the robot out of any wall or box it overlaps and count the touch.
function resolveCollisions(countTouch) {
  let hit = false;
  for (let iter = 0; iter < 6; iter++) {
    let pushed = false;
    for (const p of robotPoints()) {
      if (p.x < 0) { robot.x -= p.x; pushed = true; }
      else if (p.x > ARENA_W) { robot.x -= p.x - ARENA_W; pushed = true; }
      if (p.y < 0) { robot.y -= p.y; pushed = true; }
      else if (p.y > ARENA_H) { robot.y -= p.y - ARENA_H; pushed = true; }
      for (const b of BOXES) {
        if (p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h) {
          const dl = p.x - b.x, dr = b.x + b.w - p.x, du = p.y - b.y, dd = b.y + b.h - p.y;
          const m = min(dl, dr, du, dd);
          if (m === dl) robot.x -= dl + 0.01;
          else if (m === dr) robot.x += dr + 0.01;
          else if (m === du) robot.y -= du + 0.01;
          else robot.y += dd + 0.01;
          pushed = true;
        }
      }
    }
    // box corners that poke into the side of the robot
    const c = cos(robot.h), sn = sin(robot.h);
    for (const b of BOXES) {
      for (const [bx, by] of [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]]) {
        const lx = (bx - robot.x) * c + (by - robot.y) * sn;
        const ly = -(bx - robot.x) * sn + (by - robot.y) * c;
        if (abs(lx) < ROBOT_L / 2 && abs(ly) < ROBOT_W / 2) {
          const px = ROBOT_L / 2 - abs(lx), py = ROBOT_W / 2 - abs(ly);
          let mx = 0, my = 0;
          if (px < py) mx = -Math.sign(lx) * (px + 0.01);
          else my = -Math.sign(ly) * (py + 0.01);
          robot.x += mx * c - my * sn;
          robot.y += mx * sn + my * c;
          pushed = true;
        }
      }
    }
    if (!pushed) break;
    hit = true;
  }
  if (hit && countTouch) {
    if (simTime - lastTouchTime > 0.5) {
      touches++;
      bumpFlash = 0.6;
    }
    lastTouchTime = simTime;
  }
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();

  if (running) {
    stepSim(DT);
  } else if (frameCount % 10 === 0) {
    sense();
  }
  if (bumpFlash > 0) bumpFlash -= DT;

  // keep SLOW_DIST_CM at least STOP_DIST_CM + 5
  const minSlow = ceil((stopSlider.value() + 5) / 5) * 5;
  if (slowSlider.value() < minSlow) slowSlider.value(minSlow);

  // drawing and control regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawArena();
  // clip the path, arcs, and beam to the arena floor
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(ax, ay, ARENA_W * s, ARENA_H * s);
  drawingContext.clip();
  drawPath();
  drawThresholdArcs();
  drawBeam();
  drawingContext.restore();
  drawRobot();
  drawReadout();
  drawBanners();

  // title (drawn after the arena so nothing covers it)
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Collision Avoidance Arena', ax + ARENA_W * s / 2, 8);

  drawControlLabels();
}

function drawArena() {
  // floor
  noStroke();
  fill(238);
  rect(ax, ay, ARENA_W * s, ARENA_H * s);
  // floor already covered (faint blue cells)
  fill(205, 225, 245);
  for (let i = 0; i < visited.length; i++) {
    for (let j = 0; j < visited[i].length; j++) {
      if (visited[i][j] === 1) rect(ax + i * CELL * s, ay + j * CELL * s, CELL * s + 0.5, CELL * s + 0.5);
    }
  }
  // boxes
  stroke('saddlebrown');
  strokeWeight(1);
  fill('tan');
  for (const b of BOXES) rect(ax + b.x * s, ay + b.y * s, b.w * s, b.h * s);
  // walls (4 px dark gray border)
  noFill();
  stroke(bumpFlash > 0 ? 'red' : 'dimgray');
  strokeWeight(4);
  rect(ax - 2, ay - 2, ARENA_W * s + 4, ARENA_H * s + 4);
  strokeWeight(1);
}

function drawPath() {
  // fading blue trace of the last 20 seconds
  strokeWeight(2);
  for (let i = 1; i < path.length; i++) {
    const age = simTime - path[i].t;
    const a = map(age, 0, TRAIL_S, 220, 20);
    stroke(30, 90, 220, a);
    line(ax + path[i - 1].x * s, ay + path[i - 1].y * s, ax + path[i].x * s, ay + path[i].y * s);
  }
  // orange dots where the robot turned
  noStroke();
  for (const t of turnSpots) {
    const a = map(simTime - t.t, 0, TRAIL_S, 255, 40);
    fill(255, 140, 0, a);
    circle(ax + t.x * s, ay + t.y * s, 7);
  }
  strokeWeight(1);
}

function zoneColor(z, alpha) {
  if (z === 'FORWARD') return color(0, 160, 60, alpha);
  if (z === 'SLOW') return color(240, 160, 0, alpha);
  return color(220, 30, 30, alpha);
}

function drawThresholdArcs() {
  const o = sensorOrigin();
  const cx = ax + o.x * s, cy = ay + o.y * s;
  const span = radians(28);
  noFill();
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 5]);
  const stopD = stopSlider.value(), slowD = slowSlider.value();
  stroke(240, 160, 0);
  arc(cx, cy, 2 * slowD * s, 2 * slowD * s, robot.h - span, robot.h + span);
  stroke(220, 30, 30);
  arc(cx, cy, 2 * stopD * s, 2 * stopD * s, robot.h - span, robot.h + span);
  drawingContext.setLineDash([]);
  // labels at the end of each arc
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  const la = robot.h - span - radians(8);
  fill(160, 100, 0);
  text(slowD + ' cm', cx + cos(la) * (slowD * s + 4), cy + sin(la) * (slowD * s + 4));
  fill(190, 20, 20);
  text(stopD + ' cm', cx + cos(la) * (stopD * s + 4), cy + sin(la) * (stopD * s + 4));
  strokeWeight(1);
}

function drawBeam() {
  const o = sensorOrigin();
  const cx = ax + o.x * s, cy = ay + o.y * s;
  const aL = robot.h - radians(5), aR = robot.h + radians(5);
  const dL = rayHit(o.x, o.y, cos(aL), sin(aL));
  const dR = rayHit(o.x, o.y, cos(aR), sin(aR));
  const dC = rayHit(o.x, o.y, cos(robot.h), sin(robot.h));
  noStroke();
  fill(zoneColor(zone, 60));
  triangle(cx, cy, cx + cos(aL) * dL * s, cy + sin(aL) * dL * s, cx + cos(aR) * dR * s, cy + sin(aR) * dR * s);
  stroke(zoneColor(zone, 255));
  strokeWeight(2);
  line(cx, cy, cx + cos(robot.h) * dC * s, cy + sin(robot.h) * dC * s);
  strokeWeight(1);
}

function drawRobot() {
  push();
  translate(ax + robot.x * s, ay + robot.y * s);
  rotate(robot.h);
  scale(s);
  // wheels
  noStroke();
  fill(40);
  rect(-4, -ROBOT_W / 2 - 2.5, 8, 3, 1);
  rect(-4, ROBOT_W / 2 - 0.5, 8, 3, 1);
  // body
  stroke(bumpFlash > 0 ? 'red' : 'darkolivegreen');
  strokeWeight(1 / s);
  fill('olivedrab');
  rect(-ROBOT_L / 2, -ROBOT_W / 2, ROBOT_L, ROBOT_W, 3);
  // heading triangle
  noStroke();
  fill('white');
  triangle(7, 0, -3, -4.5, -3, 4.5);
  pop();
}

function drawReadout() {
  const slowD = slowSlider.value(), stopD = stopSlider.value();
  const lines = [
    ['Distance: ', round(reading) + ' cm', 'black'],
    ['Zone: ', zone, zoneColor(zone, 255)],
    ['Speed: ', mode === 'turning' ? 'spin +/-65535' : duty + ' duty', 'black'],
    ['Turns: ', '' + turns, 'black'],
    ['Last turn: ', lastTurn, 'black'],
    ['Floor covered: ', (freeCells ? round(100 * visitedCount / freeCells) : 0) + '%', 'black'],
    ['Wall touches: ', '' + touches, touches > 0 ? color(200, 0, 0) : 'black'],
    ['Time: ', nf(simTime, 1, 1) + ' s', 'black']
  ];
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(panel.x, panel.y, panel.w, panel.h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  if (!panel.stacked) {
    fill('black');
    textSize(17);
    textStyle(BOLD);
    text('Robot readout', panel.x + 10, panel.y + 8);
    textStyle(NORMAL);
    textSize(16);
    let y = panel.y + 36;
    for (const [k, v, c] of lines) {
      fill('black');
      text(k, panel.x + 10, y);
      fill(c);
      text(v, panel.x + 10 + textWidth(k), y);
      y += 23;
    }
    // zone legend
    y += 6;
    textSize(14);
    const legend = [
      ['FORWARD', '> ' + slowD + ' cm, full'],
      ['SLOW', stopD + ' to ' + slowD + ' cm, half'],
      ['TURN', '<= ' + stopD + ' cm, stop + turn']
    ];
    for (const [z, desc] of legend) {
      fill(zoneColor(z, 255));
      rect(panel.x + 10, y + 2, 12, 12, 2);
      fill('black');
      text(desc, panel.x + 28, y);
      y += 20;
    }
    // the same constants as the chapter code
    y += 8;
    textFont('monospace');
    textSize(14);
    fill(60);
    text('STOP_DIST_CM = ' + stopD, panel.x + 10, y);
    text('SLOW_DIST_CM = ' + slowD, panel.x + 10, y + 19);
    textFont('sans-serif');
  } else {
    textSize(15);
    const colW = panel.w / 2;
    for (let i = 0; i < lines.length; i++) {
      const [k, v, c] = lines[i];
      const x = panel.x + 8 + (i % 2) * colW;
      const y = panel.y + 6 + floor(i / 2) * 20;
      fill('black');
      text(k, x, y);
      fill(c);
      text(v, x + textWidth(k), y);
    }
  }
  textStyle(NORMAL);
}

function drawBanners() {
  const cx = ax + ARENA_W * s / 2;
  textSize(15);
  textAlign(CENTER, CENTER);
  if (simTime < stuckUntil) {
    const msg = 'Stuck in a corner? (6 turns in 10 s)';
    const w = textWidth(msg) + 20;
    stroke('darkorange');
    fill(255, 244, 220, 240);
    rect(cx - w / 2, ay + 8, w, 26, 6);
    noStroke();
    fill(150, 70, 0);
    text(msg, cx, ay + 21);
  }
  if (bumpFlash > 0) {
    const msg = 'Bump! The robot touched a wall or box.';
    const w = textWidth(msg) + 20;
    stroke('red');
    fill(255, 230, 230, 240);
    rect(cx - w / 2, ay + ARENA_H * s - 36, w, 26, 6);
    noStroke();
    fill(170, 0, 0);
    text(msg, cx, ay + ARENA_H * s - 23);
  }
  if (!running && simTime === 0) {
    const msg = 'Press Run. Click the floor to move the robot.';
    const w = textWidth(msg) + 20;
    stroke('silver');
    fill(255, 255, 255, 230);
    rect(cx - w / 2, ay + ARENA_H * s - 36, w, 26, 6);
    noStroke();
    fill(60);
    text(msg, cx, ay + ARENA_H * s - 23);
  }
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text(turnLabel.text, turnLabel.x, y0 + 11);
  text('Stop distance (cm): ' + stopSlider.value(), 10, y0 + 46);
  text('Slow distance (cm): ' + slowSlider.value(), 10, y0 + 80);
  text('Full-duty speed (cm/s): ' + speedSlider.value(), 10, y0 + 114);
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
