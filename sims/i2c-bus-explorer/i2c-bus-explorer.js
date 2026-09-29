// I2C Bus Explorer
// CANVAS_HEIGHT: 530
// Bloom L3 (Apply) - Trace: follow one I2C write transaction bit by bit:
// START, 7 address bits, R/W, ACK, 8 data bits, ACK, STOP. Only the device
// whose address matches pulls SDA low for the ACK; the others ignore the
// message. Scan bus probes every usable address like i2c.scan().
// Layout idea from learning-micropython/protocol-comparison.

let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let targetSelect, speedSelect, dataSelect, sendButton, stepButton, resetButton, scanButton;

const DEVICES = [
  { name: 'VL53L0X distance sensor', short: 'Sensor', addr: 0x29 },
  { name: 'SSD1306 OLED display', short: 'OLED', addr: 0x3C }
];
const TARGETS = { 'VL53L0X (0x29)': 0x29, 'SSD1306 (0x3C)': 0x3C, 'Nobody home (0x50)': 0x50 };
const SPEEDS = { '100 kHz Standard': 100000, '400 kHz Fast': 400000 };
const DATA = { '0x00': 0x00, '0x40': 0x40, '0xA5': 0xA5, '0xFF': 0xFF };
const SLOT_COUNT = 20;          // START + 7 + R/W + ACK + 8 + ACK + STOP
const SLOTS_PER_SEC = 4;

let slots = [];                 // {kind, bit, label}
let nowPos = 0;                 // how many slots have been sent (can be fractional)
let sending = false;
let logLines = [];
let loggedUpTo = 0;
let addressed = null;           // device that ACKed, or 'none' after a NACK
let showError = false;
let scanning = false, scanPos = 0, scanFound = [], scanDone = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  targetSelect = makeSelect(main, TARGETS, 'VL53L0X (0x29)');
  speedSelect = makeSelect(main, SPEEDS, '400 kHz Fast');
  dataSelect = makeSelect(main, DATA, '0xA5');

  sendButton = createButton('Send');
  sendButton.parent(main);
  sendButton.mousePressed(startSend);
  stepButton = createButton('Step');
  stepButton.parent(main);
  stepButton.mousePressed(stepOnce);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);
  scanButton = createButton('Scan bus');
  scanButton.parent(main);
  scanButton.mousePressed(startScan);

  positionControls();
  resetSim();

  describe('An I2C bus with an RP2040 controller on the left and two devices, a VL53L0X distance sensor at address 0x29 and an SSD1306 OLED display at address 0x3C, sharing the SDA and SCL wires with pull-up resistors. A timing diagram below shows the SCL and SDA waveforms for START, the 7 address bits, the read/write bit, ACK, 8 data bits, ACK, and STOP. The addressed device lights green when it answers with ACK. A log prints each step.', LABEL);
}

function makeSelect(main, opts, def) {
  const s = createSelect();
  s.parent(main);
  for (const k in opts) s.option(k);
  s.selected(def);
  s.changed(resetSim);
  return s;
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  const narrow = canvasWidth < 600;
  targetSelect.position(72, y1);
  speedSelect.position(narrow ? 230 : 290, y1);
  dataSelect.position(narrow ? 340 : 498, y1);
  if (narrow) { targetSelect.size(150); speedSelect.size(104); dataSelect.size(56); }
  sendButton.position(10, y2);
  stepButton.position(68, y2);
  resetButton.position(122, y2);
  scanButton.position(184, y2);
}

// ---------- Build the bit slots for one write transaction ----------
function buildSlots() {
  const addr = TARGETS[targetSelect.value()];
  const data = DATA[dataSelect.value()];
  const dev = DEVICES.find(d => d.addr === addr);
  slots = [{ kind: 'start', label: 'START' }];
  for (let b = 6; b >= 0; b--) slots.push({ kind: 'addr', bit: (addr >> b) & 1 });
  slots.push({ kind: 'rw', bit: 0 });
  slots.push({ kind: 'ack', bit: dev ? 0 : 1 });
  if (dev) {
    for (let b = 7; b >= 0; b--) slots.push({ kind: 'data', bit: (data >> b) & 1 });
    slots.push({ kind: 'ack', bit: 0 });
  }
  slots.push({ kind: 'stop', label: 'STOP' });
}

function resetSim() {
  sending = false;
  scanning = false;
  scanDone = false;
  scanFound = [];
  nowPos = 0;
  loggedUpTo = 0;
  addressed = null;
  showError = false;
  logLines = ['>>> Press Send to write one byte, or Step to send one bit at a time.'];
  buildSlots();
}

function startSend() {
  if (scanning || scanDone || nowPos >= slots.length) resetSim();
  logLines = [];
  sending = true;
}

function stepOnce() {
  if (scanning || scanDone) resetSim();
  if (logLines.length && logLines[0].startsWith('>>>')) logLines = [];
  sending = false;
  nowPos = min(slots.length, floor(nowPos) + 1);
  fireLogs();
}

function startScan() {
  resetSim();
  scanning = true;
  scanPos = 0;
  logLines = ['>>> devices = i2c.scan()'];
}

// Write log lines for each slot that has been fully sent
function fireLogs() {
  const addr = TARGETS[targetSelect.value()];
  const dev = DEVICES.find(d => d.addr === addr);
  const who = dev ? dev.short : 'Device';
  while (loggedUpTo < floor(nowPos)) {
    const i = loggedUpTo;
    const s = slots[i];
    if (i === 0) logLines.push('Controller: START');
    if (s.kind === 'rw') logLines.push('Controller: address ' + hexU(addr) + ', write');
    if (s.kind === 'ack' && i === 9) {
      if (dev) { logLines.push(who + ': ACK (pulls SDA low)'); addressed = dev; }
      else { logLines.push('No ACK: SDA stays high (NACK)'); addressed = 'none'; }
    }
    if (s.kind === 'data' && slots[i + 1] && slots[i + 1].kind === 'ack') {
      logLines.push('Controller: data ' + dataSelect.value());
    }
    if (s.kind === 'ack' && i > 9) logLines.push(who + ': ACK');
    if (s.kind === 'stop') {
      logLines.push('Controller: STOP');
      if (dev) logLines.push('Transfer OK');
      else { logLines.push('No device answered. Check wiring or address.'); showError = true; }
    }
    loggedUpTo++;
  }
}

function hex2(v) { return '0x' + (v < 16 ? '0' : '') + v.toString(16); }          // like Python hex()
function hexU(v) { return '0x' + (v < 16 ? '0' : '') + v.toString(16).toUpperCase(); } // for labels
function bin(v, n) { let s = v.toString(2); while (s.length < n) s = '0' + s; return s; }

function draw() {
  updateCanvasSize();

  if (sending) {
    nowPos += deltaTime / 1000 * SLOTS_PER_SEC;
    if (nowPos >= slots.length) { nowPos = slots.length; sending = false; }
    fireLogs();
  }
  if (scanning) {
    scanPos += deltaTime / 1000 * 48;     // about 2.5 s for the whole scan
    for (const d of DEVICES) if (scanPos >= d.addr && !scanFound.includes(d.addr)) scanFound.push(d.addr);
    if (scanPos >= 0x78) {
      scanning = false;
      scanDone = true;
      logLines.push("['" + scanFound.map(hex2).join("', '") + "']");
      logLines.push('2 devices answered: 0x29 and 0x3c. Every other address stayed quiet.');
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(LEFT, TOP);
  text('I2C Bus Explorer', 12, 6);
  const f = SPEEDS[speedSelect.value()];
  fill('midnightblue');
  textSize(13);
  textAlign(RIGHT, TOP);
  const tt = canvasWidth < 600 ? (18 / f * 1e6) + ' µs per write' :
    'Transaction time: 18 bit times x 1/' + (f / 1000) + ' kHz = ' + (18 / f * 1e6) + ' µs';
  text(tt, canvasWidth - 12, 10);

  drawWiring();
  if (scanning || scanDone) drawScanGrid(margin, 204, canvasWidth - 2 * margin, 124);
  else drawTiming(margin, 204, canvasWidth - 2 * margin);
  drawLog(margin, 334, canvasWidth - 2 * margin, drawHeight - 342);

  // control labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Talk to:', 12, drawHeight + 20);
  if (canvasWidth >= 600) {
    text('Clock:', 244, drawHeight + 20);
    text('Data byte:', 420, drawHeight + 20);
  }

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

// ---------- Wiring diagram ----------
function drawWiring() {
  const sdaY = 92, sclY = 118, railY = 44;
  const bx = 14, bw = 124;
  const x2 = canvasWidth - 16;
  // 3.3 V rail and pull-up resistors
  stroke('firebrick');
  strokeWeight(2);
  line(bx + bw + 30, railY, bx + bw + 110, railY);
  noStroke();
  fill('firebrick');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('3.3 V', bx + bw + 114, railY);
  drawPullup(bx + bw + 44, railY, sdaY, 'royalblue');
  drawPullup(bx + bw + 92, railY, sclY, 'green');
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('pull-ups 4.7 k', bx + bw + 150, railY);

  // bus lines
  const busActive = sending || (nowPos > 0 && nowPos < slots.length);
  strokeWeight(busActive ? 5 : 4);
  stroke('royalblue');
  line(bx + bw, sdaY, x2, sdaY);
  stroke('green');
  line(bx + bw, sclY, x2, sclY);
  strokeWeight(1);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  fill('royalblue');
  text('SDA (GPIO 16)', x2 - 104, sdaY - 3);
  fill('green');
  text('SCL (GPIO 17)', x2 - 104, sclY - 3);
  textStyle(NORMAL);

  // controller box
  stroke('midnightblue');
  strokeWeight(2);
  fill('midnightblue');
  rect(bx, 70, bw, 70, 8);
  strokeWeight(1);
  noStroke();
  fill('white');
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('RP2040', bx + bw / 2, 94);
  textStyle(NORMAL);
  textSize(12);
  text('(controller)', bx + bw / 2, 114);
  if (showError) {
    fill('red');
    rect(bx, 146, bw + 70, 22, 4);
    fill('white');
    textSize(12);
    textStyle(BOLD);
    text('OSError: [Errno 5] EIO', bx + (bw + 70) / 2, 157);
    textStyle(NORMAL);
  }

  // devices hang below the bus
  const devW = min(170, (x2 - bx - bw - 60) / 2 - 10);
  for (let k = 0; k < DEVICES.length; k++) {
    const d = DEVICES[k];
    const dx = bx + bw + 60 + k * (devW + 24) + (x2 - bx - bw - 60 - 2 * devW - 24) / 2;
    drawDevice(d, dx, 146, devW, sdaY, sclY);
  }
}

function drawPullup(x, y1, y2, col) {
  stroke('dimgray');
  strokeWeight(1.5);
  noFill();
  beginShape();
  vertex(x, y1);
  vertex(x, y1 + 8);
  for (let k = 0; k < 6; k++) vertex(x + (k % 2 === 0 ? -5 : 5), y1 + 10 + k * 4);
  vertex(x, y1 + 36);
  vertex(x, y2);
  endShape();
  noStroke();
  fill(col);
  circle(x, y2, 7);
}

function drawDevice(d, x, y, w, sdaY, sclY) {
  // taps from the bus lines
  const tx1 = x + w * 0.35, tx2 = x + w * 0.65;
  stroke('royalblue');
  strokeWeight(2);
  line(tx1, sdaY, tx1, y);
  stroke('green');
  line(tx2, sclY, tx2, y);
  strokeWeight(1);
  noStroke();
  fill('royalblue');
  circle(tx1, sdaY, 7);
  fill('green');
  circle(tx2, sclY, 7);

  // state: normal, answering (ACK), or ignoring
  let state = 'normal';
  if (scanning || scanDone) {
    if (scanFound.includes(d.addr)) state = 'ack';
  } else if (addressed) {
    state = (addressed === d) ? 'ack' : 'ignore';
  }
  const bg = state === 'ack' ? 'palegreen' : (state === 'ignore' ? 'gainsboro' : 'white');
  stroke(state === 'ack' ? 'seagreen' : 'gray');
  strokeWeight(state === 'ack' ? 3 : 1.5);
  fill(bg);
  rect(x, y, w, 46, 6);
  strokeWeight(1);
  noStroke();
  fill(state === 'ignore' ? 'gray' : 'black');
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  // use just the chip name when the full name will not fit on one line
  text(textWidth(d.name) < w - 8 ? d.name : d.name.split(' ')[0], x + 4, y + 5, w - 8);
  textStyle(NORMAL);
  textAlign(CENTER, BOTTOM);
  text('address ' + hexU(d.addr) + (state === 'ack' ? '  ACK!' : (state === 'ignore' ? '  ignoring' : '')), x + w / 2, y + 43);
}

// ---------- Timing diagram ----------
function drawTiming(x, y, w) {
  const addr = TARGETS[targetSelect.value()];
  const data = DATA[dataSelect.value()];
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  if (w > 560) text('Address ' + hexU(addr) + ' = ' + bin(addr, 7) + '    R/W = 0 (write)    Data ' + dataSelect.value() + ' = ' + bin(data, 8), x + 4, y);
  else text(hexU(addr) + ' = ' + bin(addr, 7) + ', write, ' + dataSelect.value() + ' = ' + bin(data, 8), x + 4, y);

  const left = x + 44, right = x + w - 4;
  const sw = (right - left) / SLOT_COUNT;
  const sclTop = y + 24, sdaTop = y + 64, amp = 24;
  noStroke();
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  fill('green');
  text('SCL', x + 4, sclTop + amp / 2);
  fill('royalblue');
  text('SDA', x + 4, sdaTop + amp / 2);
  textStyle(NORMAL);

  // dotted guide lines at each bit boundary
  stroke('lightgray');
  drawingContext.setLineDash([2, 3]);
  for (let k = 0; k <= SLOT_COUNT; k++) line(left + k * sw, sclTop - 4, left + k * sw, sdaTop + amp + 4);
  drawingContext.setLineDash([]);

  // waveforms for the slots already sent
  const sent = nowPos;
  const sclPts = [], sdaPts = [];
  let sdaLevel = 1;
  for (let k = 0; k < slots.length && k < sent; k++) {
    const s = slots[k];
    const x0 = left + k * sw;
    const frac = min(1, sent - k);   // part of this slot that has been sent
    wavePoints(s, x0, sw, frac, sclTop, sdaTop, amp, sclPts, sdaPts, sdaLevel);
    if (s.kind === 'start') sdaLevel = 0;
    else if (s.kind === 'stop') sdaLevel = 1;
    else sdaLevel = s.bit;
  }
  noFill();
  strokeWeight(2.5);
  stroke('green');
  drawPts(sclPts);
  stroke('royalblue');
  drawPts(sdaPts);
  strokeWeight(1);

  // bit values above SDA and highlight for ACK slots
  for (let k = 0; k < slots.length && k < floor(sent); k++) {
    const s = slots[k];
    const cx = left + k * sw + sw / 2;
    noStroke();
    textAlign(CENTER, BOTTOM);
    if (s.kind === 'ack') {
      fill(s.bit === 0 ? 'seagreen' : 'firebrick');
      textSize(10);
      textStyle(BOLD);
      text(s.bit === 0 ? 'ACK' : 'NACK', cx, sdaTop - 2);
      textStyle(NORMAL);
    } else if (s.bit !== undefined) {
      fill('black');
      textSize(12);
      text(s.bit, cx, sdaTop - 2);
    }
  }

  // segment labels under the waveforms
  const segs = slots.length === SLOT_COUNT ?
    [['START', 0, 1], ['ADDRESS (7 bits)', 1, 8], ['R/W', 8, 9], ['ACK', 9, 10], ['DATA (8 bits)', 10, 18], ['ACK', 18, 19], ['STOP', 19, 20]] :
    [['START', 0, 1], ['ADDRESS (7 bits)', 1, 8], ['R/W', 8, 9], ['NACK', 9, 10], ['STOP', 10, 11], ['(no data sent)', 11, 20]];
  const ly = sdaTop + amp + 8;
  for (const sg of segs) {
    const sx = left + sg[1] * sw + 2, ex = left + sg[2] * sw - 2;
    stroke('gray');
    line(sx, ly, ex, ly);
    line(sx, ly, sx, ly - 4);
    line(ex, ly, ex, ly - 4);
    noStroke();
    fill(sg[0] === '(no data sent)' ? 'gray' : 'black');
    textSize(ex - sx < 36 ? 9 : 11);
    textAlign(CENTER, TOP);
    text(sg[0], (sx + ex) / 2, ly + 3);
  }

  // NOW marker
  if (nowPos > 0 && nowPos < slots.length) {
    const nx = left + nowPos * sw;
    stroke('darkorange');
    strokeWeight(3);
    line(nx, sclTop - 8, nx, sdaTop + amp + 4);
    strokeWeight(1);
    noStroke();
    fill('darkorange');
    triangle(nx - 6, sclTop - 14, nx + 6, sclTop - 14, nx, sclTop - 6);
  }
}

// Add the SCL and SDA points for one slot (only the part already sent)
function wavePoints(s, x0, sw, frac, sclTop, sdaTop, amp, sclPts, sdaPts, prevSda) {
  const hi = (top) => top, lo = (top) => top + amp;
  const xe = x0 + sw * frac;
  const at = (t) => x0 + sw * t;
  const clip = (t) => t <= frac;
  if (s.kind === 'start') {
    // SCL stays high; SDA falls in the middle
    sclPts.push([x0, hi(sclTop)], [xe, hi(sclTop)]);
    sdaPts.push([x0, hi(sdaTop)]);
    if (clip(0.5)) { sdaPts.push([at(0.5), hi(sdaTop)], [at(0.5), lo(sdaTop)], [xe, lo(sdaTop)]); }
    else sdaPts.push([xe, hi(sdaTop)]);
    return;
  }
  if (s.kind === 'stop') {
    // SCL rises first, then SDA rises while SCL is high
    sclPts.push([x0, lo(sclTop)]);
    if (clip(0.25)) sclPts.push([at(0.25), lo(sclTop)], [at(0.25), hi(sclTop)], [xe, hi(sclTop)]);
    else sclPts.push([xe, lo(sclTop)]);
    sdaPts.push([x0, lo(sdaTop)]);
    if (clip(0.6)) sdaPts.push([at(0.6), lo(sdaTop)], [at(0.6), hi(sdaTop)], [xe, hi(sdaTop)]);
    else sdaPts.push([xe, lo(sdaTop)]);
    return;
  }
  // data bit: SCL low then high; SDA changes while SCL is low
  sclPts.push([x0, lo(sclTop)]);
  if (clip(0.5)) sclPts.push([at(0.5), lo(sclTop)], [at(0.5), hi(sclTop)], [xe, hi(sclTop)]);
  else sclPts.push([xe, lo(sclTop)]);
  const lvl = s.bit ? hi(sdaTop) : lo(sdaTop);
  const prev = prevSda ? hi(sdaTop) : lo(sdaTop);
  sdaPts.push([x0, prev], [x0 + 2, lvl], [xe, lvl]);
  // at the end of a full slot SCL falls again
  if (frac >= 1) sclPts.push([x0 + sw, lo(sclTop)]);
}

function drawPts(pts) {
  beginShape();
  for (const p of pts) vertex(p[0], p[1]);
  endShape();
}

// ---------- Scan grid: one cell per 7-bit address ----------
function drawScanGrid(x, y, w, h) {
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  text('i2c.scan() probes each usable address (0x08 to 0x77). Green = a device answered with ACK.', x + 4, y);
  const cols = 16, rows = 8;
  const cw = (w - 8) / cols, ch = (h - 22) / rows;
  for (let a = 0; a < 128; a++) {
    const cx = x + 4 + (a % cols) * cw, cy = y + 20 + floor(a / cols) * ch;
    const reserved = a < 0x08 || a > 0x77;
    const probed = !reserved && a < scanPos;
    let col = 'white';
    if (reserved) col = 'gainsboro';
    else if (scanFound.includes(a) && probed) col = 'limegreen';
    else if (probed) col = 'lightsteelblue';
    stroke('silver');
    fill(col);
    rect(cx, cy, cw - 1, ch - 1);
    if (scanning && floor(scanPos) === a) {
      noFill();
      stroke('darkorange');
      strokeWeight(2);
      rect(cx, cy, cw - 1, ch - 1);
      strokeWeight(1);
    }
    if (scanFound.includes(a) && probed) {
      noStroke();
      fill('black');
      textSize(9);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(hex2(a), cx + cw / 2, cy + ch / 2);
      textStyle(NORMAL);
    }
  }
}

function drawLog(x, y, w, h) {
  noStroke();
  fill('black');
  rect(x, y, w, h, 6);
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  const maxLines = floor((h - 8) / 18);
  const last = logLines.slice(-maxLines);
  for (let k = 0; k < last.length; k++) {
    const t = last[k];
    let col = 'lightgreen';
    if (t.startsWith('>>>')) col = 'gray';
    else if (t.startsWith('No ')) col = 'tomato';
    else if (t.startsWith('Transfer OK') || t.startsWith('[')) col = 'yellow';
    fill(col);
    text(t, x + 10, y + 6 + k * 18);
  }
  drawingContext.restore();
  pop();
}

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
