// WiFi Connect Sequence
// CANVAS_HEIGHT: 500
// Bloom L3 (Apply, verb Sequence): put the WiFi connection calls in order and
// explain what the robot does when the network is missing, the password is
// wrong, or the timeout runs out. Step through the Chapter 11 connect code one
// call at a time; the waiting loop runs on a clock so the timeout bar fills.

let canvasWidth = 800;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// ---------- scenarios (times are in seconds after connect()) ----------
const SCENARIOS = {
  'Success': { auth: 1.5, dhcp: 2.5, up: 3 },
  'Wrong password': { authFail: 2 },
  'Network out of range': { noAP: 3 },
  'Slow router (connects at 8 s)': { auth: 6.5, dhcp: 7.5, up: 8 },
  'Slow router (connects at 12 s)': { auth: 10.5, dhcp: 11.5, up: 12 }
};
const IFCONFIG = ['192.168.1.105', '255.255.255.0', '192.168.1.1', '192.168.1.1'];
const CLOCK_SPEED = 2;          // the waiting loop runs at 2x real time

// ---------- program state ----------
let step = 0;                   // 0..8
let totalSteps = 8;
let waiting = false;            // true while the while-loop is polling
let elapsed = 0;                // seconds since start = ticks_ms()
let polls = 0;
let pollTimer = 0;
let outcome = null;             // null, 'connected', 'failed'
let console_ = [];
let autoPlay = false;
let autoTimer = 0;
let statusCode = null;

// ---------- layout ----------
let seq = { x: 10, w: 430, robotX: 100, apX: 350 };
let right = { x: 450, w: 340 };

// ---------- controls ----------
let nextButton, autoButton, resetButton, scenarioSelect, secretsCheckbox, timeoutSlider;
let scenarioLabelX = 260;
let timeoutX = 160;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next Step');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextStep);
  autoButton = createButton('Auto Play');
  autoButton.parent(document.querySelector('main'));
  autoButton.style('min-width', '86px');
  autoButton.mousePressed(toggleAuto);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSequence);

  scenarioSelect = createSelect();
  scenarioSelect.parent(document.querySelector('main'));
  for (const k of Object.keys(SCENARIOS)) scenarioSelect.option(k);
  scenarioSelect.selected('Success');
  scenarioSelect.changed(resetSequence);

  secretsCheckbox = createCheckbox(' Use secrets.py', true);
  secretsCheckbox.parent(document.querySelector('main'));

  timeoutSlider = createSlider(2, 20, 10, 1);
  timeoutSlider.parent(document.querySelector('main'));
  timeoutSlider.input(() => { if (step > 4) resetSequence(); });

  positionControls();
  resetSequence();

  describe('A sequence diagram with two lifelines, Robot (MicroPython) and Access Point (router). Next Step walks ' +
    'through WLAN(STA_IF), active(True), connect(), authentication, DHCP, isconnected(), and ifconfig(). The code panel ' +
    'highlights the running line. A status panel shows wlan.status(), an elapsed-time bar with the timeout, and a serial ' +
    'console. A scenario dropdown picks success, wrong password, network out of range, or a slow router.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  for (const b of [nextButton, autoButton, resetButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 80) + 6;
  }
  x += 10;
  scenarioLabelX = x;
  textSize(defaultTextSize);
  scenarioSelect.position(x + textWidth('Scenario:') + 8, y0);
  secretsCheckbox.position(10, y0 + 38);
  const sl = 10 + 150 + textWidth('Timeout (s): 20') + 12;
  timeoutSlider.position(sl, y0 + 38);
  timeoutSlider.size(max(90, canvasWidth - sl - margin));
  timeoutX = 10 + 150;
}

function computeLayout() {
  const leftW = floor(canvasWidth * 0.54);
  seq = { x: 10, w: leftW - 10, robotX: 10 + leftW * 0.22, apX: 10 + leftW * 0.8 };
  right = { x: leftW + 10, w: canvasWidth - leftW - 20 };
}

// ---------- program steps ----------
function scenario() {
  return SCENARIOS[scenarioSelect.value()];
}

function resetSequence() {
  step = 0;
  waiting = false;
  elapsed = 0;
  polls = 0;
  pollTimer = 0;
  outcome = null;
  console_ = [];
  statusCode = null;
  autoPlay = false;
  if (autoButton) autoButton.html('Auto Play');
}

function toggleAuto() {
  if (outcome && step >= totalSteps) resetSequence();
  autoPlay = !autoPlay;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  autoTimer = 0;
}

function isDone() {
  return step >= totalSteps;
}

function nextStep() {
  if (waiting || isDone()) return;
  step++;
  if (step === 1) statusCode = 0;                         // STAT_IDLE
  if (step === 3) statusCode = 1;                         // STAT_CONNECTING
  if (step === 5) {                                       // enter the while loop
    waiting = true;
    elapsed = 0;
    polls = 0;
    pollTimer = 0;
  }
  if (step === 6 && outcome === 'failed') {
    console_.push('WiFi connection failed!');
  }
  if (step === 8 && outcome === 'connected') {
    console_.push('Connected! IP address: ' + IFCONFIG[0]);
  }
}

// the while loop: poll isconnected() every 0.1 s until connected or timeout
function updateWaiting(dt) {
  if (!waiting) return;
  const sc = scenario();
  elapsed += dt;
  pollTimer -= dt;
  while (pollTimer <= 0) {
    polls++;
    pollTimer += 0.1;
  }
  if (sc.authFail && elapsed >= sc.authFail) statusCode = -3;   // STAT_WRONG_PASSWORD
  if (sc.noAP && elapsed >= sc.noAP) statusCode = -2;           // STAT_NO_AP_FOUND
  if (sc.up && elapsed >= sc.up && elapsed < timeoutSlider.value()) {
    statusCode = 3;                                             // STAT_GOT_IP
    waiting = false;
    elapsed = sc.up;
    outcome = 'connected';
    return;
  }
  if (elapsed > timeoutSlider.value()) {
    waiting = false;
    elapsed = timeoutSlider.value();
    outcome = 'failed';
    if (sc.up) statusCode = 1;                                 // still connecting when we gave up
  }
}

// which code lines are running right now (indexes into codeLines())
function activeLines() {
  if (step === 0) return [];
  if (step <= 4) return [step];
  if (step === 5) {
    if (waiting) return [5, 6, 9];              // the loop body repeats every 0.1 s
    return outcome === 'failed' ? [6] : [5];
  }
  if (step === 6) return outcome === 'failed' ? [7] : [10];
  if (step === 7) return outcome === 'failed' ? [8] : [11];
  if (step === 8) return outcome === 'failed' ? [10] : [12];
  return [];
}

function codeLines() {
  const t = timeoutSlider.value() * 1000;
  const useSecrets = secretsCheckbox.checked();
  return [
    useSecrets ? 'from secrets import WIFI_SSID, WIFI_PASSWORD' : '# no secrets.py - the password is typed below',
    'wlan = network.WLAN(network.STA_IF)',
    'wlan.active(True)',
    useSecrets ? 'wlan.connect(WIFI_SSID, WIFI_PASSWORD)' : 'wlan.connect("SchoolRobotics", "your-password-here")',
    'start = ticks_ms()',
    'while not wlan.isconnected():',
    '    if ticks_diff(ticks_ms(), start) > ' + t + ':',
    '        print("WiFi connection failed!")',
    '        break',
    '    sleep(0.1)',
    'if wlan.isconnected():',
    '    ip = wlan.ifconfig()[0]',
    '    print(f"Connected! IP address: {ip}")'
  ];
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  updateWaiting(deltaTime / 1000 * CLOCK_SPEED);
  if (autoPlay) {
    autoTimer += deltaTime / 1000;
    if (!waiting && autoTimer >= 1.2) {
      autoTimer = 0;
      if (isDone()) {
        autoPlay = false;
        autoButton.html('Auto Play');
      } else {
        nextStep();
      }
    }
  }

  // Next Step waits while the loop is polling
  const blocked = waiting || isDone();
  if (blocked !== nextButton.elt.disabled) nextButton.elt.disabled = blocked;

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(canvasWidth < 600 ? 18 : 22);
  textAlign(LEFT, TOP);
  text('WiFi Connect Sequence', 10, 8);
  textSize(15);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Step ' + step + ' of ' + totalSteps, canvasWidth < 600 ? canvasWidth - 10 : seq.x + seq.w, 12);

  drawSequence();
  drawCode();
  drawStatus();
  drawControlLabels();
}

function drawLifelineHead(x, y, label, isRobot) {
  // icon
  if (isRobot) {
    stroke('darkolivegreen');
    fill('olivedrab');
    rect(x - 22, y, 44, 30, 5);
    noStroke();
    fill(40);
    rect(x - 26, y + 8, 5, 14, 2);
    rect(x + 21, y + 8, 5, 14, 2);
    // NeoPixel-style status LED
    let led = color(200);
    if (statusCode === 1) led = color('orange');
    if (outcome === 'connected' && step >= 6) led = color('limegreen');
    if (outcome === 'failed' && step >= 6) led = color('red');
    stroke('white');
    strokeWeight(2);
    fill(led);
    circle(x, y + 15, 14);
    strokeWeight(1);
  } else {
    stroke('dimgray');
    fill('slategray');
    rect(x - 26, y + 12, 52, 18, 4);
    stroke('dimgray');
    strokeWeight(3);
    line(x - 16, y + 12, x - 22, y);
    line(x + 16, y + 12, x + 22, y);
    strokeWeight(1);
    noStroke();
    fill('lime');
    circle(x - 14, y + 21, 4);
    circle(x - 6, y + 21, 4);
  }
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, TOP);
  text(label, x, y + 34);
}

function arrowState(n) {
  // returns 'pending' | 'active' | 'done' | 'failed' | 'hidden'
  const sc = scenario();
  if (n === 1) return step < 1 ? 'pending' : step === 1 ? 'active' : 'done';
  if (n === 2) return step < 2 ? 'pending' : step === 2 ? 'active' : 'done';
  if (n === 3) return step < 3 ? 'pending' : step === 3 ? 'active' : 'done';
  if (step < 5) return 'pending';
  if (n === 4) {  // Authentication reply
    if (sc.authFail) return elapsed >= sc.authFail ? 'failed' : 'pending';
    if (sc.noAP) return outcome === 'failed' ? 'failed' : 'pending';
    return elapsed >= sc.auth ? 'done' : 'pending';
  }
  if (n === 5) {  // DHCP
    if (!sc.dhcp) return 'pending';
    return elapsed >= sc.dhcp ? 'done' : 'pending';
  }
  if (n === 6) {  // isconnected() polling
    if (waiting) return 'active';
    return outcome === 'connected' ? 'done' : 'failed';
  }
  if (n === 7) {  // ifconfig()
    if (outcome !== 'connected' || step < 7) return 'pending';
    return step === 7 ? 'active' : 'done';
  }
  return 'pending';
}

function stateColor(st) {
  if (st === 'active') return color('goldenrod');
  if (st === 'done') return color('seagreen');
  if (st === 'failed') return color('firebrick');
  return color(185);
}

function drawArrow(x1, x2, y, st, label, dashed) {
  const c = stateColor(st);
  stroke(c);
  strokeWeight(st === 'active' ? 3 : 2);
  if (dashed || st === 'pending') drawingContext.setLineDash([6, 4]);
  line(x1, y, x2, y);
  drawingContext.setLineDash([]);
  const dir = x2 > x1 ? 1 : -1;
  noStroke();
  fill(c);
  triangle(x2, y, x2 - dir * 10, y - 5, x2 - dir * 10, y + 5);
  strokeWeight(1);
  drawArrowLabel((x1 + x2) / 2, y - 3, label, st);
}

function drawSelfArrow(x, y, st, label) {
  const c = stateColor(st);
  stroke(c);
  strokeWeight(st === 'active' ? 3 : 2);
  noFill();
  if (st === 'pending') drawingContext.setLineDash([6, 4]);
  beginShape();
  vertex(x, y - 8);
  vertex(x + 28, y - 8);
  vertex(x + 28, y + 8);
  vertex(x + 4, y + 8);
  endShape();
  drawingContext.setLineDash([]);
  noStroke();
  fill(c);
  triangle(x, y + 8, x + 9, y + 3, x + 9, y + 13);
  strokeWeight(1);
  drawArrowLabel(x + 34, y, label, st, LEFT);
}

function drawArrowLabel(x, y, label, st, align) {
  noStroke();
  textFont('monospace');
  textSize(13);
  const w = textWidth(label);
  if (align === LEFT) {
    if (st === 'active') {
      fill(255, 236, 170);
      rect(x - 3, y - 9, w + 6, 18, 3);
    }
    fill(st === 'pending' ? 140 : 20);
    textAlign(LEFT, CENTER);
    text(label, x, y);
  } else {
    if (st === 'active') {
      fill(255, 236, 170);
      rect(x - w / 2 - 3, y - 17, w + 6, 17, 3);
    }
    fill(st === 'pending' ? 140 : 20);
    textAlign(CENTER, BOTTOM);
    text(label, x, y);
  }
  textFont('sans-serif');
}

function drawSequence() {
  const top = 42;
  const rx = seq.robotX, ax = seq.apX;
  drawLifelineHead(rx, top, 'Robot (MicroPython)', true);
  drawLifelineHead(ax, top, 'Access Point (router)', false);
  // lifelines
  stroke('gray');
  drawingContext.setLineDash([4, 4]);
  line(rx, top + 54, rx, drawHeight - 12);
  line(ax, top + 54, ax, drawHeight - 12);
  drawingContext.setLineDash([]);

  const sc = scenario();
  const y0 = top + 78, dy = 42;
  drawSelfArrow(rx, y0, arrowState(1), 'WLAN(STA_IF)');
  drawSelfArrow(rx, y0 + dy, arrowState(2), 'active(True)');
  drawArrow(rx, ax, y0 + 2 * dy, arrowState(3), 'connect(SSID, PASSWORD)');
  // authentication reply
  const s4 = arrowState(4);
  let authLabel = 'Authentication';
  if (sc.authFail && s4 === 'failed') authLabel = 'Authentication: wrong password';
  if (sc.noAP) authLabel = (s4 === 'failed') ? 'no reply (out of range)' : 'Authentication';
  drawArrow(ax, rx, y0 + 3 * dy, s4, authLabel, sc.noAP);
  if (s4 === 'failed') drawX(rx + 30, y0 + 3 * dy);
  drawArrow(ax, rx, y0 + 4 * dy, arrowState(5), 'IP address (DHCP)');
  const s6 = arrowState(6);
  let isc = 'isconnected()';
  if (step >= 5) isc += (outcome === 'connected') ? ' -> True' : ' -> False';
  drawSelfArrow(rx, y0 + 5 * dy, s6, isc);
  drawSelfArrow(rx, y0 + 6 * dy, arrowState(7), 'ifconfig()[0]');
  if (step >= 7 && outcome === 'connected') {
    noStroke();
    fill('darkgreen');
    textFont('monospace');
    textSize(12);
    textAlign(LEFT, TOP);
    text("-> '" + IFCONFIG[0] + "'", rx + 34, y0 + 6 * dy + 10);
    textFont('sans-serif');
  }
}

function drawX(x, y) {
  stroke('firebrick');
  strokeWeight(4);
  line(x - 9, y - 9, x + 9, y + 9);
  line(x + 9, y - 9, x - 9, y + 9);
  strokeWeight(1);
}

function drawCode() {
  const lines = codeLines();
  const x = right.x, y = 36, w = right.w;
  const lineH = 15;
  const h = lines.length * lineH + 12;
  stroke('silver');
  fill(250);
  rect(x, y, w, h, 6);
  textFont('monospace');
  let ts = 13;
  textSize(ts);
  const longest = lines.reduce((a, b) => (textWidth(a) > textWidth(b) ? a : b));
  while (ts > 8 && textWidth(longest) > w - 14) { ts -= 0.5; textSize(ts); }
  const act = activeLines();
  for (let i = 0; i < lines.length; i++) {
    const ly = y + 6 + i * lineH;
    if (act.includes(i)) {
      noStroke();
      fill(outcome === 'failed' && (i >= 6 && i <= 8) ? color(255, 200, 200) : color(255, 225, 120));
      rect(x + 3, ly - 1, w - 6, lineH, 3);
    }
    noStroke();
    const plain = !secretsCheckbox.checked() && (i === 0 || i === 3);
    fill(plain ? 'firebrick' : 'black');
    textAlign(LEFT, TOP);
    text(lines[i], x + 7, ly);
  }
  textFont('sans-serif');
  if (!secretsCheckbox.checked()) {
    const tag = 'Would be committed to git!';
    textSize(13);
    const tw = textWidth(tag) + 12;
    noStroke();
    fill('firebrick');
    rect(x + w - tw - 4, y + 3 * lineH + 20, tw, 18, 4);
    fill('white');
    textAlign(LEFT, CENTER);
    text(tag, x + w - tw + 2, y + 3 * lineH + 29);
  }
}

function statusName(code) {
  const names = { 0: 'STAT_IDLE', 1: 'STAT_CONNECTING', 3: 'STAT_GOT_IP', '-2': 'STAT_NO_AP_FOUND', '-3': 'STAT_WRONG_PASSWORD' };
  return names[code] || '';
}

function drawStatus() {
  const x = right.x, w = right.w;
  let y = 36 + codeLines().length * 15 + 20;
  // wlan.status()
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  fill('black');
  const st = statusCode === null ? 'not created yet' : statusCode + ' (' + statusName(statusCode) + ')';
  text('wlan.status() = ', x, y);
  fill(statusCode === 3 ? 'darkgreen' : statusCode !== null && statusCode < 0 ? 'firebrick' : 'navy');
  text(st, x + textWidth('wlan.status() = '), y);

  // elapsed-time bar from 0 to the timeout
  y += 24;
  const tmax = timeoutSlider.value();
  const barW = w - 2;
  const span = max(tmax, scenario().up || 0);
  const pxPerS = barW / span;
  stroke('gray');
  fill('white');
  rect(x, y, barW, 18, 4);
  noStroke();
  fill(outcome === 'failed' ? 'firebrick' : outcome === 'connected' ? 'seagreen' : 'orange');
  rect(x, y, min(elapsed, span) * pxPerS, 18, 4);
  // timeout marker
  stroke('black');
  strokeWeight(2);
  line(x + tmax * pxPerS, y - 4, x + tmax * pxPerS, y + 22);
  strokeWeight(1);
  // when the router would be ready
  const sc = scenario();
  if (sc.up) {
    stroke('darkgreen');
    drawingContext.setLineDash([3, 3]);
    line(x + sc.up * pxPerS, y - 4, x + sc.up * pxPerS, y + 22);
    drawingContext.setLineDash([]);
  }
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  text('elapsed ' + elapsed.toFixed(1) + ' s   timeout ' + tmax + ' s' + (sc.up ? '   router ready ' + sc.up + ' s' : ''), x, y + 22);
  fill('dimgray');
  text('isconnected() was called ' + polls + ' times', x, y + 40);

  // serial console
  y += 62;
  const ch = drawHeight - 10 - y;
  stroke('dimgray');
  fill(30);
  rect(x, y, w, ch, 5);
  noStroke();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  fill(150);
  text('>>> serial console', x + 6, y + 4);
  let cy = y + 22;
  for (const ln of console_) {
    fill(ln.startsWith('Connected') ? color(140, 240, 140) : color(255, 140, 140));
    text(ln, x + 6, cy, w - 12, 34);
    cy += 17;
  }
  textFont('sans-serif');

  // hint after a failure
  if (outcome === 'failed' && step >= 6) {
    const hx = seq.x + 8, hw = seq.w - 16, hh = 58, hy = drawHeight - hh - 14;
    stroke('darkorange');
    fill(255, 246, 225, 245);
    rect(hx, hy, hw, hh, 8);
    noStroke();
    fill(140, 60, 0);
    textSize(14);
    textAlign(LEFT, TOP);
    text('Hint: Check the SSID, the password in secrets.py, and that the network is 2.4 GHz. A slow router may need a longer timeout.', hx + 8, hy + 6, hw - 16, hh - 8);
  }
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Scenario:', scenarioLabelX, y0 + 11);
  text('Timeout (s): ' + timeoutSlider.value(), timeoutX, y0 + 48);
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
