// Sensor Dictionary Explorer
// CANVAS_HEIGHT: 520
// Bloom L3 (Apply): read, update, and add entries in the robot dictionary by
// key, and predict the KeyError for a key that is not there yet. The
// dictionary is drawn as a cabinet of labeled drawers (key tab + value box).

let canvasWidth = 700;
let drawHeight = 430;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let keySelect, valueInput, compareCheckbox;
let readButton, updateButton, addButton, resetButton;

const KEYS = ['name', 'speed', 'is_moving', 'distance_cm', 'battery_pct'];
const DEFAULT_NEW = { name: 'Rex', speed: '50', is_moving: 'False', distance_cm: '12.5', battery_pct: '85' };
const START_ROWS = [
  { key: 'name', value: 'Sparky' },
  { key: 'speed', value: 75 },
  { key: 'is_moving', value: true },
  { key: 'distance_cm', value: 30.5 }
];

let rows = [];               // {key, value, addedAt, isNew}
let codeLine = '';
let codePreview = true;      // gray preview until the first action
let output = [];
let message = '';
let pointerKey = null, pointerStart = 0;
let glowKey = null, glowStart = 0, glowColor = 'limegreen';
let missingKey = null;       // shows the red KeyError drawer

const ROW_H = 46, ROW_GAP = 10;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  keySelect = createSelect();
  keySelect.parent(main);
  for (const k of KEYS) keySelect.option(k);
  keySelect.selected('name');
  keySelect.changed(onKeyChange);

  valueInput = createInput(DEFAULT_NEW.name);
  valueInput.parent(main);
  valueInput.size(80);

  compareCheckbox = createCheckbox(' Compare to a list', false);
  compareCheckbox.parent(main);

  readButton = createButton('Read');
  readButton.parent(main);
  readButton.mousePressed(doRead);
  updateButton = createButton('Update value');
  updateButton.parent(main);
  updateButton.mousePressed(() => doAssign('update'));
  addButton = createButton('Add new key');
  addButton.parent(main);
  addButton.mousePressed(() => doAssign('add'));
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);

  positionControls();
  resetSim();

  describe('A robot dictionary drawn as a cabinet of drawers. Each drawer has a teal key tab such as name, speed, is_moving, or distance_cm and a value box. Choose a key and press Read, Update value, or Add new key. A yellow arrow points to the drawer, the matching line of MicroPython appears on the right with its printed output, and a red KeyError drawer appears when the key is missing.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 10, y2 = drawHeight + 50;
  const narrow = canvasWidth < 560;
  keySelect.position(52, y1);
  valueInput.position(narrow ? 200 : 250, y1);
  valueInput.size(narrow ? 56 : 80);
  compareCheckbox.position(narrow ? 264 : 360, y1 + 3);
  readButton.position(10, y2);
  updateButton.position(70, y2);
  addButton.position(184, y2);
  resetButton.position(292, y2);
}

function onKeyChange() {
  valueInput.value(DEFAULT_NEW[keySelect.value()]);
  if (codePreview) codeLine = 'print(robot["' + keySelect.value() + '"])';
}

function resetSim() {
  rows = START_ROWS.map(r => ({ key: r.key, value: r.value, addedAt: -9999, isNew: false }));
  output = [];
  missingKey = null;
  pointerKey = null;
  glowKey = null;
  codePreview = true;
  codeLine = 'print(robot["' + keySelect.value() + '"])';
  message = 'Pick a key, predict what will happen, then press Read, Update value, or Add new key.';
}

// Turn the typed text into a Python value: number, True/False, or a string
function parseValue(txt) {
  const t = txt.trim();
  if (t === 'True') return true;
  if (t === 'False') return false;
  if (t !== '' && !isNaN(Number(t))) return Number(t);
  return t.replace(/^["']|["']$/g, '');
}

// How Python shows a value in code (repr) and when printed (str)
function pyRepr(v) {
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (typeof v === 'string') return '"' + v + '"';
  return String(v);
}
function pyStr(v) {
  if (v === true) return 'True';
  if (v === false) return 'False';
  return String(v);
}

function findRow(k) { return rows.find(r => r.key === k); }

function doRead() {
  const k = keySelect.value();
  codePreview = false;
  codeLine = 'print(robot["' + k + '"])';
  pointerKey = k;
  pointerStart = millis();
  const row = findRow(k);
  if (row) {
    missingKey = null;
    output.push(pyStr(row.value));
    glowKey = k;
    glowColor = 'limegreen';
    glowStart = millis();
    message = 'robot["' + k + '"] finds the drawer labeled "' + k + '" and returns ' + pyRepr(row.value) + '.';
  } else {
    missingKey = k;
    output.push('Traceback (most recent call last):');
    output.push("KeyError: '" + k + "'");
    message = 'KeyError! There is no drawer labeled "' + k + '" yet. Add the key first, then read it again.';
  }
}

function doAssign(kind) {
  const k = keySelect.value();
  const v = parseValue(valueInput.value());
  codePreview = false;
  codeLine = 'robot["' + k + '"] = ' + pyRepr(v);
  pointerKey = k;
  pointerStart = millis();
  missingKey = null;
  const row = findRow(k);
  if (row) {
    const old = row.value;
    row.value = v;
    glowKey = k;
    glowColor = 'gold';
    glowStart = millis();
    message = (kind === 'add' ? 'The key "' + k + '" already exists, so this just updated it: ' :
      'The value for "' + k + '" changed: ') + pyRepr(old) + ' → ' + pyRepr(v) + '.';
  } else {
    rows.push({ key: k, value: v, addedAt: millis(), isNew: true });
    glowKey = null;
    message = (kind === 'update' ? 'There was no "' + k + '" key, so this assignment ADDED it. Updating and adding use the same code! ' :
      'A new drawer "' + k + '" was added. ') + 'len(robot) is now ' + rows.length + '.';
  }
  output.push('>>> (no output)');
}

function draw() {
  updateCanvasSize();
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(CENTER, TOP);
  text('Sensor Dictionary Explorer', canvasWidth / 2, 8);

  const cabW = floor(canvasWidth * 0.57) - margin;
  drawCabinet(margin, 40, cabW, 380);
  const rx = margin + cabW + 10;
  drawRightPanel(rx, 40, canvasWidth - rx - margin, 380);
  drawPointer(margin, cabW, rx);

  // control labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Key:', 12, drawHeight + 22);
  if (canvasWidth < 560) text('Value:', 154, drawHeight + 22);
  else text('New value:', 172, drawHeight + 22);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function rowY(i) { return 40 + 50 + i * (ROW_H + ROW_GAP); }

function drawCabinet(x, y, w, h) {
  stroke('saddlebrown');
  strokeWeight(3);
  fill('wheat');
  rect(x, y, w, h, 10);
  strokeWeight(1);
  noStroke();
  fill('saddlebrown');
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(w > 340 ? 'robot  (a dictionary)' : 'robot', x + 14, y + 12);
  textStyle(NORMAL);
  // len(robot) in the corner
  push();
  textFont('monospace');
  textSize(14);
  fill('black');
  textAlign(RIGHT, TOP);
  text('len(robot) = ' + rows.length, x + w - 14, y + 14);
  pop();

  const tabW = min(130, w * 0.36);
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    let ry = rowY(i);
    // a newly added row slides in from the bottom
    const t = constrain((millis() - r.addedAt) / 500, 0, 1);
    if (t < 1) ry = lerp(y + h + 10, ry, t * t * (3 - 2 * t));
    drawDrawer(x + 14, ry, tabW, w - 28, r);
  }

  // red KeyError drawer for a missing key
  if (missingKey) {
    const ry = rowY(rows.length);
    stroke('darkred');
    strokeWeight(2);
    fill('mistyrose');
    rect(x + 14, ry, w - 28, ROW_H, 6);
    strokeWeight(1);
    drawLock(x + 34, ry + ROW_H / 2);
    noStroke();
    fill('firebrick');
    textSize(15);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("KeyError: '" + missingKey + "'", x + 58, ry + ROW_H / 2);
    textStyle(NORMAL);
  }
}

function drawDrawer(x, y, tabW, w, r) {
  // drawer body
  stroke(r.isNew ? 'royalblue' : 'peru');
  strokeWeight(r.isNew ? 3 : 1);
  fill('oldlace');
  rect(x, y, w, ROW_H, 6);
  strokeWeight(1);
  // key tab
  noStroke();
  fill('teal');
  rect(x + 6, y + 6, tabW, ROW_H - 12, 5);
  fill('white');
  textStyle(BOLD);
  textSize(14);
  // shrink the label if a long key does not fit the tab
  textSize(min(14, 14 * (tabW - 10) / textWidth(r.key)));
  textAlign(CENTER, CENTER);
  text(r.key, x + 6 + tabW / 2, y + ROW_H / 2);
  textStyle(NORMAL);
  // value box (glows green on read, yellow on update)
  const vx = x + tabW + 16, vw = w - tabW - 24;
  const glowing = glowKey === r.key && millis() - glowStart < 1200;
  stroke(glowing ? glowColor : 'dimgray');
  strokeWeight(glowing ? 4 : 1.5);
  fill(glowing && glowColor === 'gold' ? 'lemonchiffon' : 'white');
  rect(vx, y + 6, vw, ROW_H - 12, 5);
  strokeWeight(1);
  noStroke();
  fill('black');
  push();
  textFont('monospace');
  textSize(15);
  textAlign(LEFT, CENTER);
  text(pyRepr(r.value), vx + 10, y + ROW_H / 2);
  pop();
}

function drawLock(cx, cy) {
  stroke('darkred');
  strokeWeight(2.5);
  noFill();
  arc(cx, cy - 3, 12, 14, PI, TWO_PI);
  strokeWeight(1);
  noStroke();
  fill('firebrick');
  rect(cx - 8, cy - 3, 16, 13, 2);
}

function drawRightPanel(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  text('MicroPython', x + 10, y + 8);

  // the code line for the current action
  fill(codePreview ? 'whitesmoke' : 'lightyellow');
  stroke('gainsboro');
  rect(x + 8, y + 28, w - 16, 44, 5);
  noStroke();
  push();
  textFont('monospace');
  textSize(w < 260 ? 12 : 14);
  fill(codePreview ? 'gray' : 'black');
  textAlign(LEFT, CENTER);
  text(codeLine, x + 16, y + 50);
  pop();

  // plain-language explanation
  fill(missingKey ? 'firebrick' : 'midnightblue');
  textSize(14);
  textAlign(LEFT, TOP);
  text(message, x + 10, y + 80, w - 20, 72);

  // console
  const compare = compareCheckbox.checked();
  const cy = y + 156;
  const ch = compare ? 92 : h - 164;
  noStroke();
  fill('black');
  rect(x + 8, cy, w - 16, ch, 6);
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x + 8, cy, w - 16, ch);
  drawingContext.clip();
  textFont('monospace');
  textSize(w < 300 ? 11 : 13);
  textAlign(LEFT, TOP);
  const maxLines = floor((ch - 10) / 18);
  const last = output.slice(-maxLines);
  if (last.length === 0) {
    fill('gray');
    text('>>> (output)', x + 16, cy + 6);
  }
  for (let k = 0; k < last.length; k++) {
    const isErr = last[k].startsWith('KeyError') || last[k].startsWith('Traceback');
    fill(isErr ? 'tomato' : (last[k].startsWith('>>>') ? 'gray' : 'lightgreen'));
    text(last[k], x + 16, cy + 6 + k * 18);
  }
  drawingContext.restore();
  pop();

  if (compare) drawListCompare(x + 8, cy + ch + 8, w - 16, h - (cy - y) - ch - 16);
}

// The same four values stored as a list, found by number instead of by name
function drawListCompare(x, y, w, h) {
  stroke('steelblue');
  fill('aliceblue');
  rect(x, y, w, h, 6);
  noStroke();
  fill('steelblue');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Same values as a list, robot_list:', x + 8, y + 6, w - 12);
  textStyle(NORMAL);
  const vals = ['"Sparky"', '75', 'True', '30.5'];
  const bw = min(64, (w - 20) / 4);
  for (let k = 0; k < 4; k++) {
    const bx = x + 10 + k * bw;
    stroke('white');
    fill('lightsteelblue');
    rect(bx, y + 40, bw - 2, 30, 3);
    noStroke();
    fill('gray');
    textSize(11);
    textAlign(CENTER, BOTTOM);
    text(k, bx + bw / 2, y + 38);
    fill('black');
    textSize(12);
    textAlign(CENTER, CENTER);
    text(vals[k], bx + bw / 2 - 1, y + 55);
  }
  fill('midnightblue');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Which is easier to read: robot_list[1] or robot["speed"]?', x + 8, y + 78, w - 16);
}

// Yellow arrow that slides from the code panel to the drawer being used
function drawPointer(cabX, cabW, panelX) {
  if (!pointerKey) return;
  let idx = rows.findIndex(r => r.key === pointerKey);
  if (idx < 0) idx = rows.length;          // the missing-key drawer slot
  const tx = cabX + cabW - 20, ty = rowY(idx) + ROW_H / 2;
  const sx = panelX + 4, sy = 40 + 50;
  const t = constrain((millis() - pointerStart) / 450, 0, 1);
  const e = t * t * (3 - 2 * t);
  const ex = lerp(sx, tx, e), ey = lerp(sy, ty, e);
  stroke('black');
  strokeWeight(7);
  line(sx, sy, ex, ey);
  stroke('gold');
  strokeWeight(4);
  line(sx, sy, ex, ey);
  strokeWeight(1);
  const a = atan2(ey - sy, ex - sx);
  push();
  translate(ex, ey);
  rotate(a);
  stroke('black');
  fill('gold');
  triangle(4, 0, -12, -8, -12, 8);
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
