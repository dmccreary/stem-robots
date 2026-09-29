// Swarm Collective Behaviors
// CANVAS_HEIGHT: 600
// Bloom L4 (Analyze): connect ONE local rule and its settings to the group
// pattern it produces, and see that no robot needs to know the whole plan.
// Every follower runs the same rule chosen in the Behavior menu:
//   Convoy following:  speed = 0.5 + Kp x (gap - target gap), limited to 0..1
//                      (1.0 = 30 cm/s), and turn toward the nearest robot ahead
//   Collective avoid:  drive straight, bounce off the field edge, turn 90 degrees
//                      when the wall is closer than 20 cm (optionally tell others)
//   Leader broadcast:  turn = Kp x (leader heading - my heading)
// Field is 480 cm x 320 cm. Drag the leader or the gray wall with the mouse.

let canvasWidth = 800;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---- world constants (cm, s) ----
const FIELD_W = 480, FIELD_H = 320;
const MAX_SPEED = 30;          // cm/s speed limit
const CRUISE = 0.5;            // leader cruise speed as a fraction of MAX_SPEED
const ROBOT_LEN = 14;          // robot length in cm (gap = center distance - length)
const AVOID_DIST = 20;         // turn away when the wall is closer than 20 cm
const ALERT_RADIUS = 200;      // shared wall alerts reach robots within 200 cm
let SENSOR_PERIOD = 0.6;       // each follower reads its distance sensor and updates its speed every 0.6 s
const BROADCAST_PERIOD = 0.1;  // leader heading packets arrive 10 times a second
let CORNER_DIST = 30;           // the leader slows down this close (cm) to a corner
let CORNER_SPEED = 0.3;         // ...to this fraction of top speed
let MOTOR_TAU = 0.6;           // motors take about 0.6 s to reach a new speed
const SIM_SPEED = 2;           // the clock runs 2x faster than real time
const TRAIL_LEN = 40;          // 40-frame fading trails
const WAYPOINTS = [[60, 60], [420, 60], [420, 260], [60, 260]];

// ---- controls ----
let runButton, scatterButton, resetButton, behaviorSelect, shareCheckbox;
let gapSlider, kpSlider, rangeSlider, countSlider;

// ---- state ----
let robots = [];
let running = false;
let wall = { x1: 200, y1: 165, x2: 300, y2: 165 };   // draggable gray bar (cm)
let dragging = null, dragOffset = [0, 0];
let alerts = [];          // expanding rings when a robot shares a wall alert
let fieldX = 0, fieldY = 0, scalePx = 1.3;   // field placement on the canvas
let smoothGap = 30, smoothErr = 0;           // smoothed readouts

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  runButton = createButton('Run');
  runButton.parent(document.querySelector('main'));
  runButton.style('min-width', '64px');
  runButton.mousePressed(() => { running = !running; runButton.html(running ? 'Pause' : 'Run'); });
  scatterButton = createButton('Scatter robots');
  scatterButton.parent(document.querySelector('main'));
  scatterButton.mousePressed(scatterRobots);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetRobots);

  behaviorSelect = createSelect();
  behaviorSelect.parent(document.querySelector('main'));
  behaviorSelect.option('Convoy following', 'convoy');
  behaviorSelect.option('Collective obstacle avoidance', 'avoid');
  behaviorSelect.option('Leader broadcast (all steer to leader)', 'broadcast');
  behaviorSelect.selected('convoy');
  behaviorSelect.style('font-size', '14px');
  behaviorSelect.changed(() => {
    for (const r of robots) { r.state = r.leader ? 'LEAD' : 'SEARCH'; r.target = null; }
    senseAll();
  });

  shareCheckbox = createCheckbox(' Share wall alerts', false);
  shareCheckbox.parent(document.querySelector('main'));
  shareCheckbox.style('font-size', '15px');

  gapSlider = createSlider(15, 80, 30, 1);
  gapSlider.parent(document.querySelector('main'));
  kpSlider = createSlider(0.005, 0.1, 0.03, 0.005);
  kpSlider.parent(document.querySelector('main'));
  rangeSlider = createSlider(20, 100, 60, 5);
  rangeSlider.parent(document.querySelector('main'));
  countSlider = createSlider(3, 8, 6, 1);
  countSlider.parent(document.querySelector('main'));
  countSlider.input(adjustRobotCount);

  resetRobots();
  positionControls();
  describe('A top-down field with a purple leader robot and green follower robots, each with a ' +
    'faint sensor-range circle and a fading trail. Thin gray lines join each follower to the ' +
    'robot it follows. A menu swaps the single rule every follower runs: convoy following, ' +
    'collective obstacle avoidance around a draggable gray wall, or steering to the leader\'s ' +
    'broadcast heading. Readouts show the average gap, the gap error, and robots in AVOID.', LABEL);
}

// ---------------------------------------------------------------- controls
function positionControls() {
  const narrow = canvasWidth < 640;
  const rowH = narrow ? 29 : 37;
  const y0 = drawHeight + 7;
  scatterButton.html(narrow ? 'Scatter' : 'Scatter robots');
  let x = margin;
  for (const b of [runButton, scatterButton, resetButton]) {
    b.position(x, y0); x += b.elt.offsetWidth + 6;
  }
  const span = shareCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Share alerts' : ' Share wall alerts';
  if (narrow) {
    behaviorSelect.position(margin, y0 + rowH);
    shareCheckbox.position(margin + behaviorSelect.elt.offsetWidth + 10, y0 + rowH + 2);
  } else {
    behaviorSelect.position(x + 78, y0);
    shareCheckbox.position(x + 78 + behaviorSelect.elt.offsetWidth + 12, y0 + 2);
  }
  const colW = canvasWidth / 2;
  const lblW = narrow ? 100 : 170;
  const sw = max(40, colW - lblW - 16);
  const r2 = narrow ? y0 + 2 * rowH : y0 + rowH;
  const r3 = r2 + rowH;
  gapSlider.position(margin + lblW, r2); gapSlider.size(sw);
  kpSlider.position(colW + lblW, r2); kpSlider.size(sw);
  rangeSlider.position(margin + lblW, r3); rangeSlider.size(sw);
  countSlider.position(colW + lblW, r3); countSlider.size(sw);
}

function mode() { return behaviorSelect.value(); }

// ---------------------------------------------------------------- robots
function makeRobot(i, x, y, h) {
  return {
    leader: i === 0, x: x, y: y, h: h, v: 0, vCmd: 0,
    state: i === 0 ? 'LEAD' : 'SEARCH', target: null, gap: null, headErr: 0,
    sampleT: random(SENSOR_PERIOD), avoidT: 0, avoidH: 0, wp: 1,
    trail: [], seed: random(1000)
  };
}

// Default: a scattered line behind the leader, everyone facing east, paused
function resetRobots() {
  running = false;
  runButton.html('Run');
  robots = [];
  alerts = [];
  const n = countSlider.value();
  for (let i = 0; i < n; i++) {
    const x = 300 - i * 38 + (i ? random(-6, 6) : 0);
    const y = 60 + (i ? random(-10, 10) : 0);
    robots.push(makeRobot(i, x, y, 0));
  }
  senseAll();
}

// Take one sensor reading right away so the starting chain is visible
function senseAll() {
  for (const r of robots) {
    if (r.leader || mode() !== 'convoy') continue;
    senseConvoy(r);
    if (r.target !== null) r.state = 'FOLLOW';
  }
}

function scatterRobots() {
  for (const r of robots) {
    r.x = random(30, FIELD_W - 30); r.y = random(30, FIELD_H - 30);
    r.h = random(TWO_PI); r.v = 0; r.trail = []; r.target = null;
    r.state = r.leader ? 'LEAD' : 'SEARCH';
  }
}

function adjustRobotCount() {
  const n = countSlider.value();
  while (robots.length < n) {
    const last = robots[robots.length - 1];
    robots.push(makeRobot(robots.length, constrain(last.x - 38 * cos(last.h), 20, FIELD_W - 20),
      constrain(last.y - 38 * sin(last.h), 20, FIELD_H - 20), last.h));
  }
  while (robots.length > n) robots.pop();
}

function wrapPi(a) { return atan2(sin(a), cos(a)); }

function turnToward(r, desired, maxRate, dt) {
  const e = wrapPi(desired - r.h);
  r.h += constrain(e, -maxRate * dt, maxRate * dt);
}

// Closest point on the wall bar to a robot
function wallPoint(r) {
  const dx = wall.x2 - wall.x1, dy = wall.y2 - wall.y1;
  const t = constrain(((r.x - wall.x1) * dx + (r.y - wall.y1) * dy) / (dx * dx + dy * dy), 0, 1);
  return [wall.x1 + t * dx, wall.y1 + t * dy];
}

// Distance the front sensor measures to the wall (Infinity if not in front or out of range)
function wallDistanceAhead(r) {
  const [px, py] = wallPoint(r);
  const d = dist(r.x, r.y, px, py) - ROBOT_LEN / 2;
  if (d > rangeSlider.value()) return Infinity;
  const ang = abs(wrapPi(atan2(py - r.y, px - r.x) - r.h));
  return ang < radians(60) ? d : Infinity;
}

function enterAvoid(r, sawItMyself) {
  const [px, py] = wallPoint(r);
  const away = atan2(r.y - py, r.x - px);
  const a1 = r.h + HALF_PI, a2 = r.h - HALF_PI;
  // turn 90 degrees toward whichever side points more away from the wall
  r.avoidH = abs(wrapPi(a1 - away)) < abs(wrapPi(a2 - away)) ? a1 : a2;
  r.state = 'AVOID';
  r.avoidT = 0.8;
  if (sawItMyself && shareCheckbox.checked()) {
    alerts.push({ x: r.x, y: r.y, age: 0 });
    for (const o of robots) {
      if (o !== r && o.state !== 'AVOID' && dist(o.x, o.y, r.x, r.y) < ALERT_RADIUS) enterAvoid(o, false);
    }
  }
}

// One sensor reading: find the nearest robot AHEAD within sensor range
function senseConvoy(r) {
  let best = null, bestD = Infinity;
  for (let j = 0; j < robots.length; j++) {
    const o = robots[j];
    if (o === r) continue;
    const d = dist(r.x, r.y, o.x, o.y);
    const gap = d - ROBOT_LEN;
    if (gap > rangeSlider.value()) continue;
    const ang = abs(wrapPi(atan2(o.y - r.y, o.x - r.x) - r.h));
    if (ang > radians(75)) continue;           // only robots in front of me count
    if (d < bestD) { bestD = d; best = j; }
  }
  r.target = best;
  r.gap = best === null ? null : bestD - ROBOT_LEN;
}

function updateRobot(r, dt) {
  const m = mode();
  const leader = robots[0];

  // sensor sample: the robot only knows what its last reading said
  r.sampleT -= dt;
  if (r.sampleT <= 0) {
    r.sampleT += m === 'broadcast' ? BROADCAST_PERIOD : SENSOR_PERIOD;
    if (!r.leader && m === 'convoy') senseConvoy(r);
    if (!r.leader && m === 'broadcast') r.headErr = degrees(wrapPi(leader.h - r.h));
  }

  // safety reflex: the wall can interrupt any state
  if (r.state !== 'AVOID' && wallDistanceAhead(r) < AVOID_DIST) enterAvoid(r, true);

  if (r.state === 'AVOID') {
    r.avoidT -= dt;
    turnToward(r, r.avoidH, radians(240), dt);
    r.vCmd = 0.3 * MAX_SPEED;
    if (r.avoidT <= 0) { r.state = r.leader ? 'LEAD' : 'SEARCH'; r.target = null; }
  } else if (m === 'avoid') {
    r.state = r.leader ? 'LEAD' : 'FOLLOW';
    r.vCmd = CRUISE * MAX_SPEED;                 // straight line; edges bounce below
  } else if (r.leader) {
    // the leader drives a slow loop through four waypoints and slows down for
    // each corner, which sends a stop-and-go wave back along the convoy
    const [wx, wy] = WAYPOINTS[r.wp];
    const dw = dist(r.x, r.y, wx, wy);
    if (dw < 20) r.wp = (r.wp + 1) % WAYPOINTS.length;
    if (dragging !== 'leader') turnToward(r, atan2(wy - r.y, wx - r.x), radians(90), dt);
    r.vCmd = (dw < CORNER_DIST ? CORNER_SPEED : CRUISE) * MAX_SPEED;
  } else if (m === 'convoy') {
    if (r.target !== null && robots[r.target]) {
      const o = robots[r.target];
      r.state = 'FOLLOW';
      turnToward(r, atan2(o.y - r.y, o.x - r.x), radians(120), dt);
      const cmd = constrain(CRUISE + kpSlider.value() * (r.gap - gapSlider.value()), 0, 1);
      r.vCmd = cmd * MAX_SPEED;
    } else {
      r.state = 'SEARCH';                       // nothing ahead in range: wander slowly
      r.h += (noise(r.seed + millis() / 2000) - 0.5) * 2.5 * dt;
      r.vCmd = 0.2 * MAX_SPEED;
    }
  } else {                                        // leader broadcast
    r.state = 'FOLLOW';
    const turn = constrain(kpSlider.value() * r.headErr, -1, 1);   // turn = Kp x heading error
    r.h += radians(turn * 200) * dt;
    r.vCmd = CRUISE * MAX_SPEED;
  }

  // motors lag behind the command
  r.v += (r.vCmd - r.v) * min(1, dt / MOTOR_TAU);
  if (!(r.leader && dragging === 'leader')) {
    r.x += cos(r.h) * r.v * dt;
    r.y += sin(r.h) * r.v * dt;
  }
  // field edges: bounce in collective-avoidance mode (and while searching);
  // otherwise the robot just slides along the edge and keeps its heading
  const R = ROBOT_LEN / 2;
  const bounce = m === 'avoid' || r.state === 'SEARCH';
  if (r.x < R) { r.x = R; if (bounce) r.h = PI - r.h; }
  if (r.x > FIELD_W - R) { r.x = FIELD_W - R; if (bounce) r.h = PI - r.h; }
  if (r.y < R) { r.y = R; if (bounce) r.h = -r.h; }
  if (r.y > FIELD_H - R) { r.y = FIELD_H - R; if (bounce) r.h = -r.h; }
  r.h = wrapPi(r.h);
}

// Robots are solid: push apart any two that overlap
function separate() {
  for (let i = 0; i < robots.length; i++) {
    for (let j = i + 1; j < robots.length; j++) {
      const a = robots[i], b = robots[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d > 0 && d < ROBOT_LEN + 2) {
        const push = (ROBOT_LEN + 2 - d) / 2;
        const ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
        a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push;
      }
    }
  }
}

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();
  const dt = min(deltaTime / 1000, 0.05) * SIM_SPEED;
  if (running) {
    const steps = 2;
    for (let s = 0; s < steps; s++) {
      for (const r of robots) updateRobot(r, dt / steps);
      separate();
    }
    for (const r of robots) {
      r.trail.push([r.x, r.y]);
      if (r.trail.length > TRAIL_LEN) r.trail.shift();
    }
    for (const a of alerts) a.age += dt;
    alerts = alerts.filter(a => a.age < 1.2);
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // field placement: keep 480 x 320 cm proportions and fit the space
  const top = canvasWidth < 640 ? 64 : 54;
  scalePx = min((canvasWidth - 2 * margin) / FIELD_W, (drawHeight - top - 6) / FIELD_H);
  fieldX = (canvasWidth - FIELD_W * scalePx) / 2;
  fieldY = top;

  drawHeader();
  drawField();
  drawControlLabels();
}

function sx(x) { return fieldX + x * scalePx; }
function sy(y) { return fieldY + y * scalePx; }

function drawHeader() {
  const narrow = canvasWidth < 640;
  noStroke(); fill('black'); textSize(narrow ? 16 : 18); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Swarm Collective Behaviors', margin, 6);
  // the key idea, under the field on narrow screens
  textStyle(ITALIC); fill('dimgray'); textSize(13);
  const note = 'No robot has the plan. Each one runs the same local rule.';
  if (narrow) { textAlign(LEFT, TOP); text(note, margin, fieldY + FIELD_H * scalePx + 8, canvasWidth - 2 * margin, 40); }
  else { textAlign(RIGHT, TOP); text(note, canvasWidth - margin, 9); }
  textStyle(NORMAL);

  // readouts
  const m = mode();
  const followers = robots.filter(r => !r.leader && r.state === 'FOLLOW' && r.gap !== null);
  let gapTxt = '—', errTxt = '—';
  if (m === 'convoy' && followers.length) {
    const avg = followers.reduce((s, r) => s + r.gap, 0) / followers.length;
    const err = followers.reduce((s, r) => s + abs(r.gap - gapSlider.value()), 0) / followers.length;
    smoothGap += (avg - smoothGap) * 0.05;       // smooth the readouts so they are easy to read
    smoothErr += (err - smoothErr) * 0.05;
    gapTxt = nf(smoothGap, 1, 0) + ' cm'; errTxt = nf(smoothErr, 1, 1) + ' cm';
  }
  const nAvoid = robots.filter(r => r.state === 'AVOID').length;
  const modeName = { convoy: 'Convoy', avoid: 'Collective avoidance', broadcast: 'Leader broadcast' }[m];
  const items = [['Mode', modeName]];
  if (m === 'broadcast') {
    const fs = robots.filter(r => !r.leader);
    const he = fs.length ? fs.reduce((s, r) => s + abs(degrees(wrapPi(robots[0].h - r.h))), 0) / fs.length : 0;
    items.push(['Avg heading error', nf(he, 1, 0) + '°']);
  } else {
    items.push(['Avg gap to robot ahead', gapTxt], ['Gap error', errTxt]);
  }
  items.push(['Robots in AVOID', String(nAvoid)]);
  textSize(narrow ? 12 : 14); textAlign(LEFT, TOP);
  let x = margin, y = 30;
  for (const [k, v] of items) {
    textStyle(BOLD); const w = textWidth(k + ': ' + v); textStyle(NORMAL);
    if (x > margin && x + w > canvasWidth - margin) { x = margin; y += 16; }   // wrap on narrow screens
    fill('dimgray'); text(k + ': ', x, y); x += textWidth(k + ': ');
    fill(k === 'Robots in AVOID' && nAvoid > 0 ? 'crimson' : 'black'); textStyle(BOLD);
    text(v, x, y); x += textWidth(v) + (narrow ? 10 : 18);
    textStyle(NORMAL);
  }
}

function drawField() {
  // floor
  fill('gainsboro'); stroke('dimgray'); strokeWeight(3);
  rect(fieldX, fieldY, FIELD_W * scalePx, FIELD_H * scalePx);
  // 1 m grid
  stroke('lightgray'); strokeWeight(1);
  for (let gx = 100; gx < FIELD_W; gx += 100) line(sx(gx), sy(0), sx(gx), sy(FIELD_H));
  for (let gy = 100; gy < FIELD_H; gy += 100) line(sx(0), sy(gy), sx(FIELD_W), sy(gy));
  noStroke(); fill('gray'); textSize(10); textAlign(LEFT, BOTTOM);
  text('grid = 1 m', sx(4), sy(FIELD_H) - 2);

  // wall obstacle
  stroke('dimgray'); strokeWeight(max(5, 6 * scalePx)); strokeCap(ROUND);
  line(sx(wall.x1), sy(wall.y1), sx(wall.x2), sy(wall.y2));
  strokeCap(ROUND);
  noStroke(); fill('dimgray'); textSize(11); textAlign(CENTER, BOTTOM);
  text('wall (drag me)', sx((wall.x1 + wall.x2) / 2), sy(wall.y1) - 6);

  // rings and trails are clipped to the field so they never spill onto the controls
  push();
  beginClip();
  rect(fieldX, fieldY, FIELD_W * scalePx, FIELD_H * scalePx);
  endClip();

  // shared alert rings
  for (const a of alerts) {
    const c = color('crimson'); c.setAlpha(200 * (1 - a.age / 1.2));
    noFill(); stroke(c); strokeWeight(2);
    circle(sx(a.x), sy(a.y), 2 * ALERT_RADIUS * scalePx * (a.age / 1.2));
  }

  // sensor range circles and trails
  for (const r of robots) {
    const col = robotColor(r);
    const ring = color(col); ring.setAlpha(45);
    noFill(); stroke(ring); strokeWeight(1);
    circle(sx(r.x), sy(r.y), 2 * (rangeSlider.value() + ROBOT_LEN / 2) * scalePx);
    for (let k = 1; k < r.trail.length; k++) {
      const tc = color(col); tc.setAlpha(map(k, 0, r.trail.length, 0, 160));
      stroke(tc); strokeWeight(2);
      line(sx(r.trail[k - 1][0]), sy(r.trail[k - 1][1]), sx(r.trail[k][0]), sy(r.trail[k][1]));
    }
  }
  pop();

  // follow lines: each follower to the robot it is following
  if (mode() === 'convoy') {
    stroke('gray'); strokeWeight(1);
    for (const r of robots) {
      if (!r.leader && r.state === 'FOLLOW' && r.target !== null && robots[r.target]) {
        const o = robots[r.target];
        line(sx(r.x), sy(r.y), sx(o.x), sy(o.y));
      }
    }
  }

  for (const r of robots) drawRobot(r);
  noStroke();
}

function robotColor(r) {
  if (r.state === 'AVOID') return 'crimson';
  if (r.leader) return 'darkorchid';
  if (r.state === 'SEARCH') return 'gray';
  return 'olivedrab';
}

function drawRobot(r) {
  const s = max(0.8, scalePx);
  push();
  translate(sx(r.x), sy(r.y));
  rotate(r.h);
  stroke('black'); strokeWeight(1);
  fill(robotColor(r));
  triangle(10 * s, 0, -7 * s, -6 * s, -7 * s, 6 * s);
  pop();
  if (r.leader) {
    // crown mark above the leader
    const cx = sx(r.x), cy = sy(r.y) - 13 * s;
    fill('gold'); stroke('black'); strokeWeight(1);
    beginShape();
    vertex(cx - 7, cy + 4); vertex(cx - 7, cy - 3); vertex(cx - 3.5, cy + 1);
    vertex(cx, cy - 5); vertex(cx + 3.5, cy + 1); vertex(cx + 7, cy - 3); vertex(cx + 7, cy + 4);
    endShape(CLOSE);
  }
}

function drawControlLabels() {
  const narrow = canvasWidth < 640;
  const rowH = narrow ? 29 : 37;
  const y0 = drawHeight + 7;
  const colW = canvasWidth / 2;
  noStroke(); fill('black'); textSize(narrow ? 13 : 15); textAlign(LEFT, CENTER);
  if (!narrow) {
    const bx = resetButton.x + resetButton.elt.offsetWidth + 10;
    text('Behavior:', bx, y0 + 11);
  }
  const r2 = (narrow ? y0 + 2 * rowH : y0 + rowH) + 10;
  const r3 = r2 + rowH;
  text((narrow ? 'Gap: ' : 'Target gap: ') + gapSlider.value() + ' cm', margin, r2);
  text((narrow ? 'Kp: ' : 'Follower gain Kp: ') + nf(kpSlider.value(), 1, 3), colW, r2);
  text((narrow ? 'Range: ' : 'Sensor range: ') + rangeSlider.value() + ' cm', margin, r3);
  text((narrow ? 'Robots: ' : 'Number of robots: ') + countSlider.value(), colW, r3);
}

// ---------------------------------------------------------------- mouse: drag the leader or the wall
function toCm(px, py) { return [(px - fieldX) / scalePx, (py - fieldY) / scalePx]; }

function mousePressed() {
  if (mouseY > drawHeight || mouseY < fieldY) return;
  const [mx, my] = toCm(mouseX, mouseY);
  const L = robots[0];
  if (dist(mx, my, L.x, L.y) < 16) { dragging = 'leader'; return; }
  const [px, py] = wallPoint({ x: mx, y: my });
  if (dist(mx, my, px, py) < 10) {
    dragging = 'wall';
    dragOffset = [mx - wall.x1, my - wall.y1];
  }
}

function mouseDragged() {
  if (!dragging) return;
  const [mx, my] = toCm(mouseX, mouseY);
  if (dragging === 'leader') {
    const L = robots[0];
    const nx = constrain(mx, 8, FIELD_W - 8), ny = constrain(my, 8, FIELD_H - 8);
    if (dist(nx, ny, L.x, L.y) > 1) L.h = atan2(ny - L.y, nx - L.x);
    L.x = nx; L.y = ny;
  } else {
    const w = wall.x2 - wall.x1, h = wall.y2 - wall.y1;
    wall.x1 = constrain(mx - dragOffset[0], 5, FIELD_W - 5 - w);
    wall.y1 = constrain(my - dragOffset[1], 5, FIELD_H - 5);
    wall.x2 = wall.x1 + w; wall.y2 = wall.y1 + h;
  }
}

function mouseReleased() { dragging = null; }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.min(800, container.offsetWidth);
}
