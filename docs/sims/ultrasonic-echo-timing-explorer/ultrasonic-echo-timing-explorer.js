// Ultrasonic Echo Timing Explorer
// CANVAS_HEIGHT: 480
// Bloom L3 (Apply): convert an echo pulse duration in microseconds into a
// distance with distance_cm = duration_us / 58, and see where 58 comes from.
// Adapted from learning-micropython/ultrasonic-ranging (same author).
// Model (HC-SR04 datasheet): after the 10 us trigger the module sends 8 sound
// pulses, raises Echo, and drops Echo when the echo returns. So the Echo HIGH
// time equals the round-trip time of the sound.

let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 160;
let defaultTextSize = 16;

const TRIGGER_US = 10;     // trigger pulse
const BURST_US = 200;      // 8 cycles at 40 kHz; Echo rises when the burst ends
const ECHO_START = TRIGGER_US + BURST_US;
const SPEEDS = { '0 C': 331, '20 C': 343, '30 C': 349 };   // speed of sound, m/s

// zoom levels shared by the side view and the timeline
const ZOOMS = [
  { maxCm: 60,  axisUs: 4000,  tick: 10,  tickUs: 1000, slow: 1000 },
  { maxCm: 180, axisUs: 12000, tick: 30,  tickUs: 2000, slow: 300 },
  { maxCm: 470, axisUs: 30000, tick: 100, tickUs: 5000, slow: 120 }
];

// layout (y values)
const FLOOR_Y = 160, SENSOR_Y = 118;
const TL_TOP = 178, TL_BOTTOM = 302;
const MATH_TOP = 310;
const ROBOT_FRONT = 96;    // x where the sound leaves the sensor

// controls
let fireButton, tempSelect, softBox, distSlider;

// state
let zoom = ZOOMS[0];
let firing = false, fireStart = 0, fireZoom = ZOOMS[0];
let dragging = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  fireButton = createButton('Fire sensor');
  fireButton.parent(document.querySelector('main'));
  fireButton.mousePressed(fire);

  tempSelect = createSelect();
  tempSelect.parent(document.querySelector('main'));
  Object.keys(SPEEDS).forEach(k => tempSelect.option(k));
  tempSelect.selected('20 C');

  softBox = createCheckbox(' Soft surface (weak echo)', false);
  softBox.parent(document.querySelector('main'));
  softBox.style('white-space', 'nowrap');

  distSlider = createSlider(2, 450, 20, 1);
  distSlider.parent(document.querySelector('main'));
  distSlider.input(() => { firing = false; });

  positionControls();

  describe('Side view of a robot with an HC-SR04 ultrasonic sensor facing a wall. Below it, a timeline shows the Trigger pin with a 10 microsecond pulse and the Echo pin, which stays HIGH for the round-trip time of the sound. A math box converts the echo time to centimeters with duration divided by 58. Controls set the distance, the air temperature, and a soft wall surface, and a Fire sensor button replays the measurement in slow motion.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 560;
  const span = softBox.elt.querySelector('span');
  if (span) span.innerHTML = narrow ? ' Soft surface' : ' Soft surface (weak echo)';
  fireButton.position(10, drawHeight + 8);
  tempX = 22 + fireButton.elt.offsetWidth;
  tempSelect.position(tempX + (narrow ? 44 : 128), drawHeight + 9);
  softBox.position(tempX + (narrow ? 44 : 128) + tempSelect.elt.offsetWidth + 14, drawHeight + 10);
  distSlider.position(sliderLeftMargin, drawHeight + 44);
  distSlider.size(canvasWidth - sliderLeftMargin - margin);
}
let tempX = 110;

// ---------- the physics ----------

function speedCmPerUs() { return SPEEDS[tempSelect.value()] / 10000; }   // 343 m/s -> 0.0343 cm/us

function measurement() {
  const d = distSlider.value();
  const v = speedCmPerUs();
  const roundTrip = 2 * d / v;                 // microseconds
  let problem = null;
  if (d < 2) problem = 'close';
  else if (d > 400) problem = 'far';
  else if (softBox.checked() && d > 250) problem = 'soft';
  return { d, v, duration: Math.round(roundTrip), valid: problem === null, problem };
}

function pickZoom(d) {
  for (const z of ZOOMS) if (d <= z.maxCm * 0.85) return z;
  return ZOOMS[ZOOMS.length - 1];
}

function fire() {
  firing = true;
  fireStart = millis();
  fireZoom = zoom;
}

// simulated time in microseconds (slow motion while firing)
function simTime(m) {
  if (!firing) return Infinity;
  const t = (millis() - fireStart) * 1000 / fireZoom.slow;
  const end = m.valid ? ECHO_START + m.duration * 1.15 + 100 : fireZoom.axisUs;
  if (t > end) { firing = false; return Infinity; }
  return t;
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  const m = measurement();
  if (!dragging && !firing) zoom = pickZoom(m.d);

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const t = simTime(m);

  drawScene(m, t);
  noStroke(); fill('black'); textSize(22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Ultrasonic Echo Timing Explorer', 10, 8);
  textStyle(NORMAL);

  drawTimeline(m, t);
  drawMath(m);
  drawControlLabels(m);

  // show a sideways-arrow cursor over the wall so students know they can drag it
  cursor(dragging || nearWall() ? 'ew-resize' : ARROW);
}

function xOfCm(cm) {
  return ROBOT_FRONT + (cm / zoom.maxCm) * (canvasWidth - margin - ROBOT_FRONT);
}

function drawScene(m, t) {
  // floor and ruler
  stroke('dimgray'); strokeWeight(2);
  line(0, FLOOR_Y, canvasWidth, FLOOR_Y);
  noStroke(); fill('dimgray'); textSize(12); textAlign(CENTER, TOP);
  for (let cm = 0; cm <= zoom.maxCm; cm += zoom.tick) {
    const x = xOfCm(cm);
    stroke('dimgray'); strokeWeight(1); line(x, FLOOR_Y, x, FLOOR_Y + 5);
    noStroke(); text(cm === 0 ? '0 cm' : cm, x, FLOOR_Y + 6);
  }

  drawRobot();

  // the wall
  const wx = xOfCm(min(m.d, zoom.maxCm));
  stroke('saddlebrown'); strokeWeight(1);
  fill(softBox.checked() ? 'burlywood' : 'peru');
  rect(wx, 58, 14, FLOOR_Y - 58);
  if (softBox.checked()) {                      // soft surface: bumpy foam texture
    noStroke(); fill('wheat');
    for (let y = 64; y < FLOOR_Y - 4; y += 12) circle(wx + 7, y, 7);
  }

  // distance dimension line
  const dy = 48;
  stroke('navy'); strokeWeight(1);
  line(ROBOT_FRONT, dy, wx, dy);
  line(ROBOT_FRONT, dy - 5, ROBOT_FRONT, dy + 5);
  line(wx, dy - 5, wx, dy + 5);
  noStroke(); fill('navy'); textSize(14); textStyle(BOLD); textAlign(CENTER, BOTTOM);
  const lbl = 'distance = ' + m.d + ' cm';
  text(lbl, constrain((ROBOT_FRONT + wx) / 2, textWidth(lbl) / 2 + 4, canvasWidth - textWidth(lbl) / 2 - 4), dy - 3);
  textStyle(NORMAL);

  if (t !== Infinity) drawSound(m, t, wx);
  else drawPaths(m, wx);
}

// when idle, faint arrows show that the sound goes there AND back
function drawPaths(m, wx) {
  const x0 = ROBOT_FRONT + 4, x1 = wx - 4;
  if (x1 - x0 < 20) return;
  drawingContext.setLineDash([5, 4]);
  strokeWeight(1.5);
  stroke('royalblue'); line(x0, SENSOR_Y - 9, x1, SENSOR_Y - 9);
  if (m.valid) { stroke('darkorange'); line(x1, SENSOR_Y + 9, x0, SENSOR_Y + 9); }
  drawingContext.setLineDash([]);
  noStroke(); fill('royalblue');
  triangle(x1, SENSOR_Y - 9, x1 - 7, SENSOR_Y - 13, x1 - 7, SENSOR_Y - 5);
  if (m.valid) {
    fill('darkorange');
    triangle(x0, SENSOR_Y + 9, x0 + 7, SENSOR_Y + 5, x0 + 7, SENSOR_Y + 13);
  }
  if (x1 - x0 > 90) {
    textSize(12); textAlign(CENTER, BOTTOM); fill('royalblue');
    text('there', (x0 + x1) / 2, SENSOR_Y - 12);
    if (m.valid) { textAlign(CENTER, TOP); fill('darkorange'); text('back', (x0 + x1) / 2, SENSOR_Y + 12); }
  }
}

function drawRobot() {
  // body, wheel, and the HC-SR04 "eyes"
  stroke('black'); strokeWeight(1);
  fill('steelblue');
  rect(14, 96, 66, 46, 6);
  fill('dimgray');
  circle(34, 146, 26); circle(64, 146, 26);
  fill('royalblue');
  rect(78, 100, 6, 38, 2);
  fill('silver');
  rect(84, 102, 12, 14, 3); rect(84, 122, 12, 14, 3);
  noStroke(); fill('black'); textSize(11); textAlign(CENTER, TOP);
  text('HC-SR04', 48, 80);
}

function drawSound(m, t, wx) {
  const flight = t - ECHO_START;                 // us since the burst left
  if (flight < 0) {
    // the 8-pulse burst is being sent
    noFill(); stroke('royalblue'); strokeWeight(2);
    for (let k = 0; k < 3; k++) arc(ROBOT_FRONT, SENSOR_Y, 10 + k * 8, 18 + k * 12, -0.6, 0.6);
    return;
  }
  const travelled = flight * m.v;                // cm the wavefront has moved
  const pxPerCm = (canvasWidth - margin - ROBOT_FRONT) / zoom.maxCm;

  // outgoing wave (blue) until it reaches the wall
  if (travelled < m.d) {
    let a = 255;
    if (m.problem === 'far') a = 255 * max(0, 1 - travelled / 420);  // too weak to come back
    wave(ROBOT_FRONT + travelled * pxPerCm, 1, 'royalblue', a);
  } else if (m.problem !== 'far') {
    // echo (orange) coming back to the sensor
    const back = travelled - m.d;
    if (back < m.d) {
      let a = softBox.checked() ? 120 : 255;
      if (m.problem === 'soft') a = 120 * max(0, 1 - back / (m.d * 0.5));
      wave(wx - back * pxPerCm, -1, 'darkorange', a);
    }
  }
  noStroke(); fill('dimgray'); textSize(13); textAlign(RIGHT, TOP);
  text('Sound slowed down ' + zoom.slow.toLocaleString() + ' times', canvasWidth - 8, 62);
}

// a wavefront of three arcs at x, facing right (dir 1) or left (dir -1)
function wave(x, dir, col, alpha) {
  if (alpha <= 1) return;
  const c = color(col); c.setAlpha(alpha);
  noFill(); stroke(c); strokeWeight(2.5);
  for (let k = 0; k < 3; k++) {
    const xx = x - dir * k * 7;
    if (dir > 0) arc(xx - 30, SENSOR_Y, 60, 70, -0.55, 0.55);
    else arc(xx + 30, SENSOR_Y, 60, 70, PI - 0.55, PI + 0.55);
  }
}

// ---------- timeline ----------

function drawTimeline(m, t) {
  const x = 10, w = canvasWidth - 20;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, TL_TOP, w, TL_BOTTOM - TL_TOP, 6);

  const z = firing ? fireZoom : zoom;
  const x0 = x + 92, x1 = x + w - 14;
  const T = us => x0 + (min(us, z.axisUs) / z.axisUs) * (x1 - x0);
  const trigHi = TL_TOP + 16, trigLo = TL_TOP + 38;
  const echoHi = TL_TOP + 62, echoLo = TL_TOP + 84;
  const axisY = TL_TOP + 94;

  noStroke(); fill('black'); textSize(14); textStyle(BOLD); textAlign(LEFT, CENTER);
  text('Trigger pin', x + 8, (trigHi + trigLo) / 2);
  text('Echo pin', x + 8, (echoHi + echoLo) / 2);
  textStyle(NORMAL);

  const now = min(t, z.axisUs);

  // trigger row: a 10 us HIGH pulse (drawn at least 3 px wide so it can be seen)
  stroke('navy'); strokeWeight(2); noFill();
  const tw = max(T(TRIGGER_US) - T(0), 3);
  if (now > 0) {
    beginShape();
    vertex(T(0), trigLo); vertex(T(0), trigHi);
    vertex(T(0) + tw, trigHi); vertex(T(0) + tw, trigLo);
    vertex(max(T(now), T(0) + tw), trigLo);
    endShape();
    noStroke(); fill('navy'); textSize(13); textAlign(LEFT, CENTER);
    text('10 µs trigger', T(0) + tw + 6, trigHi + 2);
  }

  // echo row
  const echoEnd = ECHO_START + m.duration;
  stroke('darkorange'); strokeWeight(2); noFill();
  beginShape();
  vertex(T(0), echoLo);
  if (now >= ECHO_START) {
    vertex(T(ECHO_START), echoLo); vertex(T(ECHO_START), echoHi);
    if (m.valid && now >= echoEnd) {
      vertex(T(echoEnd), echoHi); vertex(T(echoEnd), echoLo);
      vertex(T(now), echoLo);
    } else {
      vertex(T(now), echoHi);
    }
  } else {
    vertex(T(now), echoLo);
  }
  endShape();

  // label the echo pulse
  noStroke(); textSize(13); textStyle(BOLD);
  if (m.valid && now >= echoEnd) {
    fill('chocolate');
    const s = 'Echo HIGH: ' + m.duration + ' µs';
    const mid = (T(ECHO_START) + T(echoEnd)) / 2;
    const fits = T(echoEnd) - T(ECHO_START) > textWidth(s) + 8;
    textAlign(fits ? CENTER : LEFT, BOTTOM);
    text(s, fits ? mid : T(echoEnd) + 6, echoHi - 3);
    // bracket under the pulse
    stroke('chocolate'); strokeWeight(1);
    line(T(ECHO_START), echoLo + 5, T(echoEnd), echoLo + 5);
  } else if (!m.valid && now >= z.axisUs) {
    fill('crimson'); textAlign(RIGHT, BOTTOM);
    text('no echo: Echo stays HIGH →', x1, echoHi - 3);
  }
  textStyle(NORMAL);

  // time axis
  stroke('black'); strokeWeight(1);
  line(x0, axisY, x1, axisY);
  noStroke(); fill('black'); textSize(12); textAlign(CENTER, TOP);
  // label every tick, or every other tick when they would crowd together
  const every = (T(z.tickUs) - T(0)) < 48 ? 2 : 1;
  for (let i = 0, us = 0; us <= z.axisUs; us += z.tickUs, i++) {
    stroke('black'); line(T(us), axisY, T(us), axisY + 4);
    noStroke();
    if (i % every === 0) text(us.toLocaleString(), T(us), axisY + 5);
  }
  textAlign(RIGHT, TOP);
  text('time (µs)', x0 - 8, axisY + 5);

  if (firing) {
    stroke('gray'); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(T(now), TL_TOP + 6, T(now), axisY);
    drawingContext.setLineDash([]);
  }
}

// ---------- the math readout ----------

function drawMath(m) {
  const x = 10, w = canvasWidth - 20;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, MATH_TOP, w, drawHeight - MATH_TOP - 6, 6);
  const narrow = canvasWidth < 560;
  const fs = narrow ? 13 : 16;

  if (!m.valid) {
    textFont('monospace'); textSize(fs); noStroke(); fill('black'); textAlign(LEFT, TOP);
    text('duration_us = ???', x + 10, MATH_TOP + 8);
    textFont('sans-serif');
    fill('crimson'); textStyle(BOLD); textSize(narrow ? 14 : 16);
    text('No valid echo - your code would wait forever! Add a timeout.', x + 10, MATH_TOP + 30, w - 20);
    textStyle(NORMAL); fill('dimgray'); textSize(narrow ? 12 : 14);
    const why = m.problem === 'close' ? 'Under 2 cm the echo comes back while the sensor is still sending.'
      : m.problem === 'far' ? 'Past 400 cm the echo is too weak for the HC-SR04 to hear.'
      : 'A soft surface soaks up sound. Past 250 cm the weak echo is lost.';
    text(why, x + 10, MATH_TOP + (narrow ? 64 : 56), w - 20);
    return;
  }

  const code = m.duration / 58;
  const err = (code - m.d) / m.d * 100;
  textFont('monospace'); textSize(fs); noStroke(); textAlign(LEFT, TOP);
  fill('black');
  text('duration_us = ' + m.duration, x + 10, MATH_TOP + 8);
  fill('navy'); textStyle(BOLD);
  text('distance_cm = ' + m.duration + ' / 58 = ' + code.toFixed(1) + ' cm', x + 10, MATH_TOP + 8 + fs + 6);
  textStyle(NORMAL);
  textFont('sans-serif');

  textSize(narrow ? 13 : 14); fill('black');
  text('Code says ' + code.toFixed(1) + ' cm.  True distance ' + m.d.toFixed(1) + ' cm  (' +
    (err >= 0 ? '+' : '') + err.toFixed(1) + '%)', x + 10, MATH_TOP + 2 * fs + 17, w - 20);
  fill('dimgray'); textSize(narrow ? 12 : 13);
  text(narrow ? '58 comes from 2 x 1 / 0.0343 cm per µs.'
    : '58 comes from 2 x 1 / 0.0343 cm per µs: the sound goes there and back at 343 m/s.',
    x + 10, MATH_TOP + 2 * fs + 35, w - 20);
}

function drawControlLabels(m) {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  if (canvasWidth >= 560) text('Air temperature:', tempX, drawHeight + 20);
  else text('Air:', tempX, drawHeight + 20);
  text('Distance: ' + m.d + ' cm', 10, drawHeight + 54);
}

// ---------- dragging the wall ----------

function nearWall() {
  const wx = xOfCm(min(distSlider.value(), zoom.maxCm));
  return mouseY > 50 && mouseY < FLOOR_Y && mouseX > wx - 8 && mouseX < wx + 22;
}

function mousePressed() {
  if (nearWall()) { dragging = true; firing = false; }
}

function mouseDragged() {
  if (!dragging) return;
  const cm = (mouseX - ROBOT_FRONT) / (canvasWidth - margin - ROBOT_FRONT) * zoom.maxCm;
  distSlider.value(round(constrain(cm, 2, min(450, zoom.maxCm))));
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof distSlider !== 'undefined') distSlider.size(canvasWidth - sliderLeftMargin - margin);
}
