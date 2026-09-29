// Sensor Coverage Comparison
// CANVAS_HEIGHT: 520
// Bloom L4 (Analyze - compare): compare the range, beam width, and blind spots
// of the ToF, ultrasonic, IR, and bump sensors by dragging an obstacle around a
// top-down view of the robot, then choose which sensors to combine.
// All positions are in cm, measured from the center of the robot's front edge
// (x to the right, y straight ahead).

let canvasWidth = 700;
let drawHeight = 440;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// robot size (cm)
const ROBOT_W = 12, ROBOT_L = 14;

// sensor zones
const SENSORS = {
  ToF:        { col: 'seagreen',     halfDeg: 12.5, min: 3, max: 200, label: 'ToF (25°, 3-200 cm)' },
  Ultrasonic: { col: 'mediumpurple', halfDeg: 15,   min: 2, max: 400, label: 'Ultrasonic (30°, 2-400 cm)' },
  IR:         { col: 'darkorange',   reach: 10, width: 2, label: 'IR left + right (~1-10 cm)' },
  Bump:       { col: 'crimson',      label: 'Bump switch (contact)' }
};

const OBSTACLES = {
  'Hard wall':      { d: 12, fill: 'gray',       hides: [] },
  'Soft cloth':     { d: 12, fill: 'thistle',    hides: ['Ultrasonic'] },   // sound is absorbed
  'Thin table leg': { d: 3,  fill: 'saddlebrown', hides: [] },
  'Glass':          { d: 12, fill: 'lightcyan',  hides: ['ToF'] }           // the laser passes through
};

// views: pixels per cm and how far below the canvas top the robot front sits
const VIEWS = { far: { ppc: 2, frontY: 406 }, near: { ppc: 6, frontY: 346 } };

// controls
let boxes = {}, obstacleSelect, driveButton, zoomBox;

// state
let obs = { x: 0, y: 86 };      // obstacle center (cm); near edge at 80 cm
let dragging = false;
let driving = false, lastT = 0, driveNote = '';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (const name of Object.keys(SENSORS)) {
    const b = createCheckbox(' ' + name, true);
    b.parent(document.querySelector('main'));
    b.style('white-space', 'nowrap');
    boxes[name] = b;
  }
  obstacleSelect = createSelect();
  obstacleSelect.parent(document.querySelector('main'));
  Object.keys(OBSTACLES).forEach(k => obstacleSelect.option(k));
  obstacleSelect.selected('Hard wall');
  obstacleSelect.changed(() => { keepInFront(); driveNote = ''; });

  driveButton = createButton('Drive forward');
  driveButton.parent(document.querySelector('main'));
  driveButton.mousePressed(toggleDrive);

  zoomBox = createCheckbox(' Zoom in near robot', false);
  zoomBox.parent(document.querySelector('main'));
  zoomBox.style('white-space', 'nowrap');

  positionControls();

  describe('Top-down view of a robot at the bottom center facing up, with the sensing area of each sensor: a narrow green ToF wedge to 200 centimeters, a slightly wider purple ultrasonic cone, two short orange IR strips at the front corners, and a red bump bar on the front edge. A draggable obstacle lights up the sensors that detect it, and a legend lists each sensor with its reading. Checkboxes turn sensors on and off, a menu changes the obstacle type, and a button drives the robot forward.', LABEL);
}

function positionControls() {
  let x = 10;
  for (const b of Object.values(boxes)) {
    b.position(x, drawHeight + 10);
    x += b.elt.offsetWidth + 18;
  }
  obstacleSelect.position(88, drawHeight + 45);
  let x2 = 88 + obstacleSelect.elt.offsetWidth + 10;
  driveButton.position(x2, drawHeight + 44);
  x2 += driveButton.elt.offsetWidth + 12;
  const span = zoomBox.elt.querySelector('span');
  if (span) span.innerHTML = canvasWidth < 560 ? ' Zoom in' : ' Zoom in near robot';
  zoomBox.position(x2, drawHeight + 46);
}

function view() { return zoomBox.checked() ? VIEWS.near : VIEWS.far; }
function obstacle() { return OBSTACLES[obstacleSelect.value()]; }

// cm -> screen
function sx(xcm) { return canvasWidth / 2 + xcm * view().ppc; }
function sy(ycm) { return view().frontY - ycm * view().ppc; }

// ---------- geometry ----------

// does a circle (center c, radius r) overlap a wedge from the origin?
function wedgeHit(c, r, s) {
  const d = Math.hypot(c.x, c.y);
  if (d - r > s.max || d + r < s.min) return false;
  const half = radians(s.halfDeg);
  const ang = Math.atan2(c.x, c.y);               // 0 = straight ahead
  if (Math.abs(ang) <= half) return true;
  // otherwise check the distance to the nearer edge ray
  const edge = ang > 0 ? half : -half;
  const ux = Math.sin(edge), uy = Math.cos(edge);
  const t = constrain(c.x * ux + c.y * uy, 0, s.max);
  return Math.hypot(c.x - t * ux, c.y - t * uy) <= r;
}

// circle versus axis-aligned rectangle
function rectHit(c, r, x0, y0, x1, y1) {
  const nx = constrain(c.x, x0, x1), ny = constrain(c.y, y0, y1);
  return Math.hypot(c.x - nx, c.y - ny) <= r;
}

function irZones() {
  const w = SENSORS.IR.width, reach = SENSORS.IR.reach;
  const lx = -ROBOT_W / 2 + 1.5, rx = ROBOT_W / 2 - 1.5;
  return [
    { name: 'left',  x0: lx - w / 2, x1: lx + w / 2, y0: 0, y1: reach, cx: lx },
    { name: 'right', x0: rx - w / 2, x1: rx + w / 2, y0: 0, y1: reach, cx: rx }
  ];
}

// which sensors see the obstacle, and what each one reads (cm)
function readings() {
  const r = obstacle().d / 2;
  const hides = obstacle().hides;
  const out = {};
  for (const name of ['ToF', 'Ultrasonic']) {
    const s = SENSORS[name];
    let res = null;
    if (boxes[name].checked() && !hides.includes(name) && wedgeHit(obs, r, s)) {
      const dist = Math.hypot(obs.x, obs.y) - r;
      // inside the minimum range the sensor cannot measure: a dead zone
      res = dist < s.min ? 'too close' : Math.round(dist);
    }
    out[name] = res;
  }
  let ir = null;
  if (boxes.IR.checked()) {
    for (const z of irZones()) {
      if (rectHit(obs, r, z.x0, z.y0, z.x1, z.y1)) {
        const dist = Math.max(1, Math.round(Math.hypot(obs.x - z.cx, obs.y) - r));
        ir = (ir ? ir + ', ' : '') + z.name + ' ' + dist + ' cm';
      }
    }
  }
  out.IR = ir;
  out.Bump = boxes.Bump.checked() && touching() ? 'contact' : null;
  return out;
}

function touching() {
  const r = obstacle().d / 2;
  return rectHit(obs, r, -ROBOT_W / 2, -0.5, ROBOT_W / 2, 0.6);
}

// the obstacle may not overlap the robot: keep it in front of the front edge
function keepInFront() {
  const r = obstacle().d / 2;
  if (obs.y < r) obs.y = r;
}

// ---------- driving ----------

function toggleDrive() {
  driving = !driving;
  driveButton.html(driving ? 'Stop' : 'Drive forward');
  driveNote = driving ? 'Driving forward at 10 cm per second...' : '';
  lastT = millis();
  positionControls();
}

function updateDrive() {
  if (!driving) return;
  const dt = (millis() - lastT) / 1000;
  lastT = millis();
  const r = obstacle().d / 2;
  const inPath = Math.abs(obs.x) < ROBOT_W / 2 + r;
  // the view follows the robot, so the obstacle comes toward us
  obs.y -= 10 * dt;
  if (inPath && obs.y <= r) {
    obs.y = r;
    stopDrive(boxes.Bump.checked() ? 'Bump switch pressed: robot stopped.'
      : 'Crash! The bump switch is off, so nothing stopped the robot.');
  } else if (!inPath && obs.y <= -ROBOT_L) {
    obs.y = -ROBOT_L;
    stopDrive('The robot drove past the obstacle.');
  }
}

function stopDrive(note) {
  driving = false;
  driveButton.html('Drive forward');
  driveNote = note;
  positionControls();
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  updateDrive();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const rd = readings();

  // clip drawing to the play area so zones do not spill into the controls
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, canvasWidth, drawHeight);
  drawingContext.clip();
  drawRings();
  drawZones(rd);
  drawRobot();
  drawObstacle();
  drawingContext.restore();
  pop();

  drawLegend(rd);
  drawStatus(rd);
  drawControlLabels();
  cursor(dragging || overObstacle() ? 'grab' : ARROW);
}

function drawRings() {
  const step = zoomBox.checked() ? 10 : 50;
  const maxCm = zoomBox.checked() ? 60 : 200;
  noFill(); stroke('lightsteelblue'); strokeWeight(1);
  drawingContext.setLineDash([4, 5]);
  for (let cm = step; cm <= maxCm; cm += step) {
    const rr = cm * view().ppc;
    arc(sx(0), sy(0), 2 * rr, 2 * rr, PI, TWO_PI);
  }
  drawingContext.setLineDash([]);
  // label each ring on a diagonal, up and to the left, clear of the sensor wedges
  noStroke(); fill('steelblue'); textSize(12); textAlign(RIGHT, BOTTOM);
  for (let cm = step; cm <= maxCm; cm += step) {
    const rr = cm * view().ppc;
    text(cm + ' cm', sx(0) - rr * 0.707, sy(0) - rr * 0.707);
  }
}

function wedgePoly(s) {
  const half = radians(s.halfDeg);
  const far = min(s.max, 260);
  beginShape();
  vertex(sx(s.min * Math.sin(-half)), sy(s.min * Math.cos(half)));
  vertex(sx(far * Math.sin(-half)), sy(far * Math.cos(half)));
  vertex(sx(far * Math.sin(half)), sy(far * Math.cos(half)));
  vertex(sx(s.min * Math.sin(half)), sy(s.min * Math.cos(half)));
  endShape(CLOSE);
}

function zoneColor(name, lit) {
  const c = color(SENSORS[name].col);
  c.setAlpha(lit ? 110 : 30);
  return c;
}

function drawZones(rd) {
  // ultrasonic first (wider), then ToF on top
  for (const name of ['Ultrasonic', 'ToF']) {
    if (!boxes[name].checked()) continue;
    const s = SENSORS[name];
    const lit = rd[name] !== null && rd[name] !== 'too close';
    fill(zoneColor(name, lit));
    stroke(SENSORS[name].col); strokeWeight(lit ? 2 : 1);
    wedgePoly(s);
    // dotted mark for the minimum range (dead zone)
    stroke(SENSORS[name].col); strokeWeight(1.5);
    drawingContext.setLineDash([2, 3]);
    noFill();
    const rr = s.min * view().ppc;
    arc(sx(0), sy(0), 2 * rr, 2 * rr, -HALF_PI - radians(s.halfDeg + 8), -HALF_PI + radians(s.halfDeg + 8));
    drawingContext.setLineDash([]);
  }
  if (zoomBox.checked() && boxes.ToF.checked()) {
    noStroke(); fill('seagreen'); textSize(12); textAlign(LEFT, CENTER);
    text('3 cm minimum', sx(0) + 40, sy(3));
  }
  if (boxes.IR.checked()) {
    const lit = rd.IR !== null;
    for (const z of irZones()) {
      fill(zoneColor('IR', lit)); stroke('darkorange'); strokeWeight(lit ? 2 : 1);
      rect(sx(z.x0), sy(z.y1), (z.x1 - z.x0) * view().ppc, (z.y1 - z.y0) * view().ppc);
    }
  }
}

function drawRobot() {
  const ppc = view().ppc;
  const x0 = sx(-ROBOT_W / 2), y0 = sy(0);
  // wheels on the sides
  noStroke(); fill('black');
  rect(x0 - 2.2 * ppc, y0 + 3 * ppc, 2 * ppc, 6 * ppc, 2);
  rect(sx(ROBOT_W / 2) + 0.2 * ppc, y0 + 3 * ppc, 2 * ppc, 6 * ppc, 2);
  // body
  stroke('navy'); strokeWeight(1); fill('royalblue');
  rect(x0, y0, ROBOT_W * ppc, ROBOT_L * ppc, 3 * ppc / 2 + 2);
  // bump bar across the front edge
  if (boxes.Bump.checked()) {
    noStroke(); fill(touching() ? 'crimson' : 'lightcoral');
    rect(x0 - 1, y0 - max(3, 0.8 * ppc), ROBOT_W * ppc + 2, max(3, 0.8 * ppc), 2);
  }
  // sensors on the front: IR at the corners, ToF/ultrasonic in the middle
  noStroke(); fill('white');
  circle(sx(0), y0 + max(4, 1.2 * ppc), max(4, 1.5 * ppc));
}

function drawObstacle() {
  const o = obstacle();
  const r = o.d / 2 * view().ppc;
  const px = sx(obs.x), py = sy(obs.y);
  if (py + r < 0) {
    // off the top of a zoomed-in view
    noStroke(); fill('dimgray'); textSize(13); textAlign(CENTER, TOP);
    text('↑ obstacle is ' + round(Math.hypot(obs.x, obs.y) - o.d / 2) + ' cm away, beyond this view', canvasWidth / 2, 72);
    return;
  }
  stroke(obstacleSelect.value() === 'Glass' ? 'steelblue' : 'black'); strokeWeight(dragging ? 3 : 1.5);
  fill(o.fill);
  circle(px, py, 2 * r);
  if (r < 8) {                                    // a thin leg is tiny: ring it so it can be found
    noFill(); stroke('saddlebrown'); strokeWeight(1);
    drawingContext.setLineDash([2, 3]);
    circle(px, py, 22);
    drawingContext.setLineDash([]);
  }
}

function overObstacle() {
  const r = max(obstacle().d / 2 * view().ppc, 11);
  return dist(mouseX, mouseY, sx(obs.x), sy(obs.y)) <= r + 3 && mouseY < drawHeight;
}

function drawLegend(rd) {
  const narrow = canvasWidth < 560;
  const w = narrow ? 186 : 250, rowH = 36;
  const x = canvasWidth - w - 8, y = narrow ? 92 : 8;   // below the title when narrow
  noStroke(); fill(255, 255, 255, 225); stroke('silver'); strokeWeight(1);
  rect(x, y, w, 4 * rowH + 8, 8);
  let yy = y + 8;
  for (const name of Object.keys(SENSORS)) {
    const on = boxes[name].checked();
    const val = rd[name];
    noStroke(); fill(on ? SENSORS[name].col : 'lightgray');
    rect(x + 8, yy + 3, 12, 12, 2);
    fill(on ? 'black' : 'gray'); textAlign(LEFT, TOP); textSize(narrow ? 11 : 13);
    text(narrow ? name + (name === 'IR' ? ' (L + R)' : '') : SENSORS[name].label, x + 26, yy + 1);
    textSize(narrow ? 12 : 14); textStyle(BOLD);
    if (!on) { fill('gray'); text('off', x + 26, yy + 17); }
    else if (val === null) { fill('gray'); textStyle(NORMAL); text('no reading', x + 26, yy + 17); }
    else {
      fill(SENSORS[name].col);
      if (val === 'too close') fill('gray');
      text(name === 'IR' || val === 'too close' ? val : name === 'Bump' ? 'contact!' : val + ' cm', x + 26, yy + 17);
    }
    textStyle(NORMAL);
    yy += rowH;
  }
}

function drawStatus(rd) {
  const n = Object.values(rd).filter(v => v !== null && v !== 'too close').length;
  const r = obstacle().d / 2;
  const near = Math.hypot(obs.x, obs.y) - r < 30;
  const narrow = canvasWidth < 560;
  noStroke(); fill(255, 255, 255, 200);
  rect(0, 0, narrow ? canvasWidth : min(canvasWidth - 270, 330), driveNote ? 84 : 64);
  fill('black'); textAlign(LEFT, TOP); textStyle(BOLD);
  textSize(canvasWidth < 560 ? 17 : 22);
  text('Sensor Coverage Comparison', 10, 8);
  textSize(15);
  if (n === 0 && near) { fill('crimson'); text('Blind spot!', 10, 38); }
  else { fill(n > 0 ? 'darkgreen' : 'dimgray'); text('Detected by ' + n + ' of 4 sensors', 10, 38); }
  textStyle(NORMAL);
  if (driveNote) {
    fill(driveNote.startsWith('Crash') ? 'crimson' : 'navy'); textSize(13); textAlign(LEFT, TOP);
    text(driveNote, 10, 62);
  }
}

function drawControlLabels() {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Obstacle:', 10, drawHeight + 56);
}

// ---------- dragging the obstacle ----------

function mousePressed() {
  if (overObstacle()) { dragging = true; if (driving) stopDrive(''); driveNote = ''; }
}

function mouseDragged() {
  if (!dragging) return;
  const ppc = view().ppc;
  obs.x = (constrain(mouseX, 0, canvasWidth) - canvasWidth / 2) / ppc;
  obs.y = (view().frontY - constrain(mouseY, 0, drawHeight)) / ppc;
  keepInFront();
}

function mouseReleased() { dragging = false; }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
