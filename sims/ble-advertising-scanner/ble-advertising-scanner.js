// BLE Advertising and Scanning
// CANVAS_HEIGHT: 550
// Bloom L2 (Understand, verb Explain): describe how the advertising interval,
// the scan window, and distance decide whether a scanner hears a BLE device,
// and how the advertising interval affects power use. Press Start scan to run
// one ble.gap_scan() and see every advertising packet marked heard or missed.

let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

const ENVIRONMENTS = {
  'Open air': 50,
  'Classroom': 20,
  'Metal shelves in the way': 8
};
const MAX_M = 60;              // floor view shows 0 to 60 meters
const CH_COLORS = ['royalblue', 'seagreen', 'darkorange'];   // channels 37, 38, 39

// ---------- scan run ----------
let running = false;
let finished = false;
let runStart = 0;
let runSpan = 5500;            // ms of timeline for this run
let events = [];               // {t, heard}
let firstHeard = null;
let scanMs = 5000;
let rangeM = 20;
let distM = 3;

// layout
let floorR = {}, tlR = {}, infoR = {};
let leaderX = 740, robotY = 110, pxPerM = 12;
let dragging = false;

// controls
let startButton, resetButton, envSelect, distSlider, intervalSlider, scanSlider;
let envLabelX = 200;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(startDrag);
  textSize(defaultTextSize);

  startButton = createButton('Start scan');
  startButton.parent(document.querySelector('main'));
  startButton.mousePressed(startScan);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);
  envSelect = createSelect();
  envSelect.parent(document.querySelector('main'));
  for (const k of Object.keys(ENVIRONMENTS)) envSelect.option(k);
  envSelect.selected('Classroom');
  envSelect.changed(clearRun);

  distSlider = createSlider(1, 60, 3, 0.5);
  distSlider.parent(document.querySelector('main'));
  distSlider.input(clearRun);
  intervalSlider = createSlider(100, 1000, 100, 50);
  intervalSlider.parent(document.querySelector('main'));
  intervalSlider.input(clearRun);
  scanSlider = createSlider(50, 5000, 5000, 50);
  scanSlider.parent(document.querySelector('main'));
  scanSlider.input(clearRun);

  positionControls();

  describe('A floor view with a follower robot on the left sending BLE advertising packets as colored rings, and a ' +
    'leader robot on the right that scans for them. Shaded range zones mark 5, 20, and 50 meters. Sliders set the ' +
    'distance, the advertising interval, and the scan window, and a dropdown picks open air, classroom, or metal ' +
    'shelves. A timeline marks each advertising packet as heard or missed. Readouts show packets sent and heard, the ' +
    'first-heard time, the follower current in milliamps, and battery life, compared with WiFi.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  startButton.position(10, y0);
  resetButton.position(10 + (startButton.elt.offsetWidth || 85) + 6, y0);
  envLabelX = 10 + (startButton.elt.offsetWidth || 85) + 6 + (resetButton.elt.offsetWidth || 55) + 18;
  textSize(defaultTextSize);
  envSelect.position(envLabelX + textWidth('Environment:') + 8, y0);
  const w = max(100, canvasWidth - sliderLeftMargin - margin);
  distSlider.position(sliderLeftMargin, y0 + 36);
  distSlider.size(w);
  intervalSlider.position(sliderLeftMargin, y0 + 70);
  intervalSlider.size(w);
  scanSlider.position(sliderLeftMargin, y0 + 104);
  scanSlider.size(w);
}

function computeLayout() {
  floorR = { x: 10, y: 36, w: canvasWidth - 20, h: 168 };
  leaderX = floorR.x + floorR.w - 46;
  pxPerM = (leaderX - (floorR.x + 30)) / MAX_M;
  robotY = floorR.y + 70;
  const infoW = canvasWidth >= 620 ? 300 : floor((canvasWidth - 30) * 0.5);
  infoR = { x: canvasWidth - infoW - 10, y: 212, w: infoW, h: drawHeight - 212 - 8 };
  tlR = { x: 10, y: 212, w: infoR.x - 20, h: drawHeight - 212 - 8 };
}

// ---------- model ----------
function currentMa() {
  return 1.0 + 100 / intervalSlider.value();     // advertising current (mA)
}

function rssi(d) {
  return round(-59 - 20 * Math.log10(max(d, 0.5)));  // simple path-loss model
}

// Chance that one packet is lost: none in the near half of the range, about half
// at 80 % of the range, and every packet beyond the range.
function lossChance(d, range) {
  const f = d / range;
  if (f <= 0.5) return 0;
  if (f <= 0.8) return 0.5 * (f - 0.5) / 0.3;
  if (f <= 1) return 0.5 + 0.5 * (f - 0.8) / 0.2;
  return 1;
}

function followerX() {
  return leaderX - distM * pxPerM;
}

function clearRun() {
  running = false;
  finished = false;
  events = [];
  firstHeard = null;
}

function resetAll() {
  distSlider.value(3);
  intervalSlider.value(100);
  scanSlider.value(5000);
  envSelect.selected('Classroom');
  clearRun();
}

function startScan() {
  scanMs = scanSlider.value();
  rangeM = ENVIRONMENTS[envSelect.value()];
  distM = distSlider.value();
  const interval = intervalSlider.value();
  runSpan = max(1500, min(5500, scanMs + 800));
  events = [];
  firstHeard = null;
  // one advertising event every interval, plus a random 0-10 ms delay;
  // the scan starts at a random moment in the follower's advertising cycle
  const phase = random(0, interval);
  for (let k = 0; ; k++) {
    const t = phase + k * interval + random(0, 10);
    if (t > runSpan) break;
    const heard = t <= scanMs && random() >= lossChance(distM, rangeM);
    events.push({ t: t, heard: heard, inScan: t <= scanMs });
    if (heard && firstHeard === null) firstHeard = t;
  }
  runStart = millis();
  running = true;
  finished = false;
}

function elapsedMs() {
  if (!running && !finished) return 0;
  if (finished) return runSpan;
  return min(runSpan, millis() - runStart);
}

// ---------- dragging the follower ----------
function startDrag() {
  if (abs(mouseX - followerX()) < 26 && abs(mouseY - robotY) < 30) dragging = true;
}

function mouseDragged() {
  if (!dragging) return;
  const d = constrain((leaderX - mouseX) / pxPerM, 1, 60);
  distSlider.value(round(d * 2) / 2);
  clearRun();
}

function mouseReleased() {
  dragging = false;
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  if (!running && !finished) {
    distM = distSlider.value();
    rangeM = ENVIRONMENTS[envSelect.value()];
    scanMs = scanSlider.value();
  }
  if (running && millis() - runStart >= runSpan) {
    running = false;
    finished = true;
  }

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawFloor();
  noStroke();
  fill('black');
  textSize(22);
  textAlign(LEFT, TOP);
  text('BLE Advertising and Scanning', 10, 6);

  drawTimeline();
  drawInfo();
  drawControlLabels();
}

function drawFloor() {
  const r = floorR;
  stroke('silver');
  fill(250, 250, 245);
  rect(r.x, r.y, r.w, r.h, 6);
  const fx = followerX();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(r.x, r.y, r.w, r.h - 26);
  drawingContext.clip();
  // range zones around the follower (numbers from Chapter 12)
  noStroke();
  const zones = [[50, color(230, 60, 60, 28), 'open-air limit 50 m'], [20, color(240, 200, 0, 40), 'indoor limit 20 m'], [5, color(40, 180, 80, 45), 'near-perfect 5 m']];
  for (const [m, c] of zones) {
    fill(c);
    circle(fx, robotY, 2 * m * pxPerM);
  }
  // this room's reach
  noFill();
  stroke('firebrick');
  strokeWeight(1.5);
  drawingContext.setLineDash([6, 5]);
  circle(fx, robotY, 2 * rangeM * pxPerM);
  drawingContext.setLineDash([]);
  strokeWeight(1);
  // advertising rings during a scan run
  if (running) {
    const now = elapsedMs();
    for (const ev of events) {
      for (let ch = 0; ch < 3; ch++) {
        const age = now - ev.t - ch * 40;
        if (age < 0 || age > 700) continue;
        const rad = age / 700 * rangeM * pxPerM;
        stroke(red(color(CH_COLORS[ch])), green(color(CH_COLORS[ch])), blue(color(CH_COLORS[ch])), 200 * (1 - age / 700));
        strokeWeight(2);
        noFill();
        circle(fx, robotY, 2 * rad);
      }
    }
    strokeWeight(1);
  }
  drawingContext.restore();

  // zone legend (numbers from Chapter 12)
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  let lgx = r.x + 8;
  for (const [c, label] of [[color(40, 180, 80, 120), 'near-perfect 5 m'], [color(240, 200, 0, 140), 'indoor limit 20 m'], [color(230, 60, 60, 90), 'open-air limit 50 m']]) {
    fill(c);
    rect(lgx, r.y + 6, 12, 12, 2);
    fill(50);
    text(label, lgx + 16, r.y + 12);
    lgx += textWidth(label) + 30;
  }
  fill('firebrick');
  const rx = fx - rangeM * pxPerM;
  textAlign(LEFT, TOP);
  text('reach in this room: ' + rangeM + ' m', max(r.x + 6, min(rx + 4, r.x + r.w - 170)), r.y + r.h - 44);

  // ruler (meters from the leader)
  const ry = r.y + r.h - 24;
  stroke('gray');
  line(leaderX - MAX_M * pxPerM, ry, leaderX, ry);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(CENTER, TOP);
  for (let m = 0; m <= MAX_M; m += 10) {
    const x = leaderX - m * pxPerM;
    stroke('gray');
    line(x, ry - 4, x, ry + 2);
    noStroke();
    text(m + ' m', x, ry + 4);
  }

  // robots
  const close = leaderX - fx < 120;
  drawRobotIcon(fx, robotY, 'RobotFollower', '(peripheral)', close);
  drawRobotIcon(leaderX, robotY, 'Leader', '(central)', false);
  // leader radio: scanning or sleeping
  const now = elapsedMs();
  const scanning = running && now <= scanMs;
  const bw = 70, bx = leaderX - bw / 2, by = robotY + 44;
  noStroke();
  fill(scanning ? color(40, 170, 90) : color(190));
  rect(bx, by, bw, 16, 4);
  fill('white');
  textSize(11);
  textAlign(CENTER, CENTER);
  text(scanning ? 'Scanning' : 'Sleeping', leaderX, by + 8);
  // distance label between the robots
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, BOTTOM);
  if (leaderX - fx > 70) text(nf(distM, 1, 1) + ' m', (fx + leaderX) / 2, robotY - 6);
}

function drawRobotIcon(x, y, name, role, labelLeft) {
  stroke('darkolivegreen');
  fill('olivedrab');
  rect(x - 16, y - 13, 32, 26, 5);
  noStroke();
  fill(40);
  rect(x - 20, y - 8, 4, 16, 1);
  rect(x + 16, y - 8, 4, 16, 1);
  fill('white');
  circle(x, y, 8);
  fill('black');
  textSize(12);
  if (labelLeft) {
    // robots are close together: put the follower's label on its left side
    textAlign(RIGHT, CENTER);
    text(name, x - 24, y - 6);
    fill(90);
    text(role, x - 24, y + 8);
    return;
  }
  textAlign(CENTER, TOP);
  text(name, x, y + 15);
  fill(90);
  text(role, x, y + 28);
}

function drawTimeline() {
  const r = tlR;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(r.x, r.y, r.w, r.h, 8);
  const lx = r.x + 74, lw = r.w - 84;
  const now = elapsedMs();
  const span = (running || finished) ? runSpan : max(1500, min(5500, scanSlider.value() + 800));
  const tx = ms => lx + ms / span * lw;
  const y1 = r.y + 12, y2 = r.y + 44;
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Adverts', r.x + 8, y1 + 10);
  text('Scan', r.x + 8, y2 + 10);
  // row 2: the scan window bar
  stroke(220);
  fill(240);
  rect(lx, y2, lw, 20, 3);
  noStroke();
  fill(40, 170, 90, 170);
  rect(lx, y2, tx(min(scanMs, span)) - lx, 20, 3);
  fill('white');
  textSize(11);
  textAlign(LEFT, CENTER);
  if (tx(min(scanMs, span)) - lx > 90) text('gap_scan(' + scanMs + ')', lx + 5, y2 + 10);
  // row 1: one tick per advertising event, with a heard / missed dot
  stroke(220);
  line(lx, y1 + 20, lx + lw, y1 + 20);
  for (const ev of events) {
    if (ev.t > now) break;
    const x = tx(ev.t);
    stroke(120);
    line(x, y1 + 4, x, y1 + 20);
    noStroke();
    fill(ev.heard ? 'limegreen' : 'darkgray');
    circle(x, y1 + 4, ev.heard ? 7 : 5);
  }
  // playhead
  if (running) {
    stroke('red');
    strokeWeight(2);
    line(tx(now), y1 - 4, tx(now), y2 + 24);
    strokeWeight(1);
  }
  // time axis
  noStroke();
  fill(90);
  textSize(11);
  textAlign(CENTER, TOP);
  let step = span > 3000 ? 1000 : 500;
  if (lw < 260) step *= 2;
  for (let t = 0; t <= span; t += step) {
    text((t / 1000) + ' s', tx(t), y2 + 22);
  }
  // legend
  textAlign(LEFT, CENTER);
  let x = r.x + 8;
  const ly = y2 + 44;
  fill('limegreen');
  circle(x + 4, ly, 7);
  fill(40);
  text('heard', x + 12, ly);
  x += 58;
  fill('darkgray');
  circle(x + 4, ly, 5);
  fill(40);
  text('missed (radio off or out of range)', x + 12, ly);

  // current use: BLE advertising versus WiFi
  const cy = ly + 18;
  const barX = r.x + 108, barW = r.w - 118;
  const maMax = 150;
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('BLE advertising', r.x + 8, cy + 7);
  text('WiFi active', r.x + 8, cy + 29);
  fill('royalblue');
  rect(barX, cy, max(2, currentMa() / maMax * barW), 14, 2);
  fill(180);
  rect(barX + 80 / maMax * barW, cy + 22, 70 / maMax * barW, 14, 2);
  fill(225);
  rect(barX, cy + 22, 80 / maMax * barW, 14, 2);
  fill(20);
  textSize(12);
  text(nf(currentMa(), 1, 1) + ' mA', barX + max(2, currentMa() / maMax * barW) + 6, cy + 7);
  textAlign(CENTER, CENTER);
  text('80 to 150 mA', barX + 115 / maMax * barW, cy + 29);
}

function drawInfo() {
  const r = infoR;
  const now = elapsedMs();
  const sent = events.filter(e => e.t <= now).length;
  const heard = events.filter(e => e.t <= now && e.heard).length;
  const ma = currentMa();
  stroke('silver');
  fill(255, 255, 255, 240);
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(canvasWidth < 600 ? 12 : 14);
  const rows = [
    ['Packets sent: ', '' + sent],
    ['Packets heard: ', '' + heard],
    ['First heard at: ', firstHeard !== null && now >= firstHeard ? round(firstHeard) + ' ms' : '-'],
    ['Follower current: ', nf(ma, 1, 2) + ' mA'],
    ['Battery life on 1000 mAh: ', round(1000 / ma) + ' hours']
  ];
  let y = r.y + 8;
  for (const [k, v] of rows) {
    fill('black');
    text(k, r.x + 10, y);
    fill('navy');
    text(v, r.x + 10 + textWidth(k), y);
    y += 19;
  }
  // phone-style scan results list
  y += 4;
  stroke('gainsboro');
  line(r.x + 8, y, r.x + r.w - 8, y);
  noStroke();
  fill('dimgray');
  textSize(13);
  text('Scan results', r.x + 10, y + 4);
  y += 22;
  textSize(14);
  if (firstHeard !== null && now >= firstHeard) {
    fill('royalblue');
    circle(r.x + 16, y + 8, 10);
    fill('black');
    text('RobotFollower,  RSSI ' + rssi(distM) + ' dBm', r.x + 26, y);
  } else if (finished) {
    fill('firebrick');
    text('Scan finished - no devices found.', r.x + 10, y, r.w - 20, 40);
    fill('dimgray');
    textSize(13);
    text('Try moving the robots closer.', r.x + 10, y + 20, r.w - 20, 40);
  } else if (running) {
    fill('dimgray');
    text('Scanning...', r.x + 10, y);
  } else {
    fill('dimgray');
    text('Press Start scan.', r.x + 10, y);
  }
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Environment:', envLabelX, y0 + 11);
  text('Distance (m): ' + nf(distSlider.value(), 1, 1), 10, y0 + 46);
  text('Advertising interval (ms): ' + intervalSlider.value(), 10, y0 + 80);
  text('Scan window (ms): ' + scanSlider.value(), 10, y0 + 114);
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
