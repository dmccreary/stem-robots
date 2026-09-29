// Flash Memory vs RAM Power Cycle
// CANVAS_HEIGHT: 420
// Bloom L2 (Understand / Explain): predict which data stays in the board after
// power is removed (Flash) and which data disappears (RAM).
// Step-through design: every button press is one action, the board picture
// updates, and the log explains the result in one plain sentence.
// Flash numbers: the RP2040 Pico module has 2048 KB of flash. MicroPython
// itself uses 640 KB, leaving a 1408 KB file system for your files.

let canvasWidth = 700;
let drawHeight = 336;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

let saveButton, runButton, changeButton, powerButton, pictureButton, resetButton;
let buttons = [];
let lastWidth = 0;

const FLASH_KB = 2048;
const SYSTEM_KB = 640;          // MicroPython itself lives in flash too
const FLASH_COLOR = '#1976d2';
const RAM_COLOR = '#e65100';
const BOOT_MS = 1400;           // length of the boot animation

// board state
let powerOn, mainSaved, running, ram, logLines, meterWarn, bootStart;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  saveButton = makeButton('Save main.py to Flash', saveMain);
  runButton = makeButton('Run program', runProgram);
  changeButton = makeButton('Change speed to 80', changeSpeed);
  powerButton = makeButton('Power OFF', togglePower);
  pictureButton = makeButton('Add a 2 MB picture file', addPicture);
  resetButton = makeButton('Reset', resetBoard);

  resetBoard();
  positionControls();
  describe('A power switch, a Raspberry Pi RP2040 board with a blue Flash memory block and an orange RAM block, and a log of what the board is doing. Buttons save main.py to Flash, run the program, change a variable, turn the power off and on, and try to save a file that is too big. Turning the power off empties RAM but Flash keeps its files.', LABEL);
}

function makeButton(label, fn) {
  const b = createButton(label);
  b.parent(document.querySelector('main'));
  b.style('font-size', '13px');
  b.style('line-height', '1.1');
  b.mousePressed(fn);
  buttons.push(b);
  return b;
}

// two rows of three equal-width buttons; long labels wrap onto two lines
function positionControls() {
  const gap = 8;
  const colW = min(210, (canvasWidth - 20 - 2 * gap) / 3);
  const rows = [[saveButton, runButton, changeButton], [powerButton, pictureButton, resetButton]];
  rows.forEach((row, r) => {
    row.forEach((b, c) => {
      b.position(10 + c * (colW + gap), drawHeight + 7 + r * 38);
      b.size(colW, 34);
    });
  });
}

function resetBoard() {
  powerOn = true;
  mainSaved = false;
  running = false;
  ram = [];
  meterWarn = false;
  bootStart = null;
  logLines = ['Board is on. Nothing saved yet.'];
  saveButton.html('Save main.py to Flash');
  saveButton.removeAttribute('disabled');
  powerButton.html('Power OFF');
}

function addLog(s) {
  logLines.unshift(s);
  if (logLines.length > 12) logLines.pop();
}

function isBooting() { return bootStart !== null; }

// ---------- button actions ----------
function saveMain() {
  if (isBooting()) return;
  meterWarn = false;
  if (!powerOn) { addLog('The board has no power. Turn it on to save files.'); return; }
  if (mainSaved) return;
  mainSaved = true;
  saveButton.html('Saved');
  saveButton.attribute('disabled', '');
  addLog('Saved main.py (1 KB) to Flash. It will stay there with no power.');
}

function runProgram() {
  if (isBooting()) return;
  meterWarn = false;
  if (!powerOn) { addLog('The board has no power, so nothing can run.'); return; }
  if (!mainSaved) { addLog('No main.py found. Nothing to run.'); return; }
  startProgram();
  addLog('Running main.py: RAM now holds speed = 50 and distance_cm = 32.');
}

function startProgram() {
  ram = [{ name: 'speed', value: 50 }, { name: 'distance_cm', value: 32 }];
  running = true;
}

function changeSpeed() {
  if (isBooting()) return;
  meterWarn = false;
  const v = ram.find(r => r.name === 'speed');
  if (!powerOn || !v) { addLog('Nothing is running, so there is no speed variable to change.'); return; }
  v.value = 80;
  addLog('Changed speed to 80 in RAM only. main.py in Flash still says speed = 50.');
}

function togglePower() {
  if (isBooting()) return;
  meterWarn = false;
  if (powerOn) {
    powerOn = false;
    running = false;
    powerButton.html('Power ON');
    const lost = ram.map(r => r.name + ' = ' + r.value).join(' and ');
    ram = [];
    const kept = mainSaved ? 'Flash still has main.py.' : 'Flash keeps whatever was saved.';
    addLog(lost ? 'Power off: RAM lost ' + lost + '. ' + kept : 'Power off: RAM is empty. ' + kept);
  } else {
    powerOn = true;
    powerButton.html('Power OFF');
    if (mainSaved) {
      bootStart = millis();
      addLog('Power on. Boot: reading main.py from Flash...');
    } else {
      addLog('Power on. No main.py found. Nothing to run.');
    }
  }
}

function addPicture() {
  if (isBooting()) return;
  if (!powerOn) { addLog('The board has no power. Turn it on to save files.'); return; }
  meterWarn = true;
  addLog('Not enough space. Keep files small. (The picture needs 2048 KB; only ' + freeKB() + ' KB is free.)');
}

function usedKB() { return SYSTEM_KB + (mainSaved ? 1 : 0); }
function freeKB() { return FLASH_KB - usedKB(); }

// ---------- drawing ----------
function draw() {
  updateCanvasSize();

  // finish the boot animation: main.py starts again with its saved values
  if (isBooting() && millis() - bootStart > BOOT_MS) {
    bootStart = null;
    startProgram();
    addLog('main.py started again: speed = 50 and distance_cm = 32.');
  }

  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const L = layout();
  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(L.narrow ? 18 : 22);
  text('Flash Memory vs RAM Power Cycle', canvasWidth / 2, 6);

  drawPower(L);
  drawBoard(L);
  drawLog(L);
}

// Wide: power | board | log side by side. Narrow: power row, board, log below.
function layout() {
  const L = { narrow: canvasWidth < 600 };
  if (!L.narrow) {
    L.power = { x: margin, y: 40, w: canvasWidth * 0.20, h: drawHeight - 50 };
    L.board = { x: canvasWidth * 0.22 + 4, y: 40, w: canvasWidth * 0.42, h: drawHeight - 50 };
    L.log = { x: canvasWidth * 0.66, y: 40, w: canvasWidth * 0.34 - margin, h: drawHeight - 50 };
  } else {
    L.power = { x: margin, y: 32, w: canvasWidth - 2 * margin, h: 34 };
    L.board = { x: margin, y: 70, w: canvasWidth - 2 * margin, h: 190 };
    L.log = { x: margin, y: 264, w: canvasWidth - 2 * margin, h: drawHeight - 270 };
  }
  return L;
}

function drawPower(L) {
  const P = L.power;
  const swColor = powerOn ? 'limegreen' : 'gray';
  if (!L.narrow) {
    const cx = P.x + P.w / 2;
    // USB plug
    stroke('dimgray'); strokeWeight(2); fill('lightgray');
    rect(cx - 30, P.y + 20, 22, 34, 3);
    fill('silver'); rect(cx - 26, P.y + 8, 14, 12, 2);
    noStroke(); fill('black'); textSize(12); textAlign(CENTER, TOP);
    text('USB', cx - 19, P.y + 58);
    // battery
    stroke('dimgray'); strokeWeight(2); fill('#43a047');
    rect(cx + 8, P.y + 18, 24, 38, 3);
    fill('silver'); rect(cx + 15, P.y + 13, 10, 5, 1);
    noStroke(); fill('black'); text('Battery', cx + 20, P.y + 58);
    // wire from the battery to the board
    stroke(powerOn ? 'firebrick' : 'darkgray'); strokeWeight(3);
    line(cx + 32, P.y + 37, L.board.x, P.y + 37);
    // power switch (slide toggle)
    const sy = P.y + 100;
    stroke('dimgray'); strokeWeight(2); fill(swColor);
    rect(cx - 30, sy, 60, 28, 14);
    noStroke(); fill('white');
    circle(powerOn ? cx + 16 : cx - 16, sy + 14, 22);
    fill('black'); textSize(15); textStyle(BOLD); textAlign(CENTER, TOP);
    text(powerOn ? 'Power: ON' : 'Power: OFF', cx, sy + 34);
    textStyle(NORMAL);
    noStroke(); fill('dimgray'); textSize(12);
    text('Flip it with the', cx, P.y + 190);
    text('Power button', cx, P.y + 206);
  } else {
    // compact row: switch and label
    const sy = P.y + 3;
    stroke('dimgray'); strokeWeight(2); fill(swColor);
    rect(P.x, sy, 50, 24, 12);
    noStroke(); fill('white');
    circle(powerOn ? P.x + 37 : P.x + 13, sy + 12, 18);
    fill('black'); textSize(15); textStyle(BOLD); textAlign(LEFT, CENTER);
    text(powerOn ? 'Power: ON' : 'Power: OFF', P.x + 60, sy + 12);
    textStyle(NORMAL);
  }
}

function drawBoard(L) {
  const B = L.board;
  // circuit board
  stroke('darkgreen'); strokeWeight(2); fill('seagreen');
  rect(B.x, B.y, B.w, B.h, 10);
  noStroke(); fill('white'); textSize(14); textStyle(BOLD); textAlign(LEFT, TOP);
  text('RP2040 board', B.x + 10, B.y + 6);
  textStyle(NORMAL);

  // status tag
  let tag = null, tagCol = null;
  if (!powerOn) { tag = 'No power'; tagCol = 'dimgray'; }
  else if (isBooting()) { tag = 'Booting'; tagCol = 'darkorange'; }
  else if (running) { tag = 'Running'; tagCol = 'darkgreen'; }
  if (tag) {
    textSize(13); textStyle(BOLD);
    const tw = textWidth(tag) + 16;
    fill('white'); rect(B.x + B.w - tw - 8, B.y + 5, tw, 20, 10);
    fill(tagCol); textAlign(CENTER, CENTER);
    text(tag, B.x + B.w - tw / 2 - 8, B.y + 15);
    textStyle(NORMAL);
  }

  // memory blocks: side by side on the narrow layout, stacked on the wide one
  let F, R;
  if (!L.narrow) {
    const h = (B.h - 44) / 2;
    F = { x: B.x + 10, y: B.y + 30, w: B.w - 20, h: h };
    R = { x: B.x + 10, y: B.y + 38 + h, w: B.w - 20, h: h };
  } else {
    const w = (B.w - 30) / 2;
    F = { x: B.x + 10, y: B.y + 30, w: w, h: B.h - 40 };
    R = { x: B.x + 20 + w, y: B.y + 30, w: w, h: B.h - 40 };
  }
  drawFlash(F, L.narrow);
  drawRam(R, L.narrow);
  if (isBooting()) drawBootArrow(F, R, L.narrow);

  // dim everything when the power is off; Flash files are still there
  if (!powerOn) {
    noStroke(); fill(40, 40, 40, 110);
    rect(B.x, B.y, B.w, B.h, 10);
    if (mainSaved) {
      textSize(12); textStyle(BOLD);
      const label = 'main.py still saved';
      const tw = textWidth(label) + 14;
      fill('white'); rect(F.x + F.w - tw - 6, F.y + (L.narrow ? 54 : 43), tw, 18, 9);
      fill(FLASH_COLOR); textAlign(CENTER, CENTER);
      text(label, F.x + F.w - tw / 2 - 6, F.y + (L.narrow ? 63 : 52));
      textStyle(NORMAL);
    }
  }
}

function drawFlash(F, narrow) {
  stroke('white'); strokeWeight(1.5); fill(FLASH_COLOR);
  rect(F.x, F.y, F.w, F.h, 6);
  noStroke(); fill('white'); textAlign(LEFT, TOP);
  textSize(narrow ? 12 : 14); textStyle(BOLD);
  text(narrow ? 'Flash (2 MB)' : 'Flash (2 MB) - permanent', F.x + 8, F.y + 5);
  if (narrow) { textStyle(NORMAL); textSize(11); text('permanent', F.x + 8, F.y + 20); }
  textStyle(NORMAL);

  // file list
  textSize(narrow ? 12 : 13);
  let y = F.y + (narrow ? 38 : 26);
  fill('lightsteelblue');
  text('MicroPython (built in)', F.x + 10, y);
  y += 17;
  fill('white');
  if (mainSaved) {
    textStyle(BOLD); text('main.py   1 KB', F.x + 10, y); textStyle(NORMAL);
  } else {
    fill('lightsteelblue'); text('(no files saved yet)', F.x + 10, y);
  }

  // space meter
  const my = F.y + F.h - (narrow ? 30 : 22);
  const mw = F.w - 20;
  fill('white'); rect(F.x + 10, my, mw, 7, 3);
  fill(meterWarn ? 'red' : 'gold');
  rect(F.x + 10, my, mw * usedKB() / FLASH_KB, 7, 3);
  fill(meterWarn ? 'mistyrose' : 'white'); textSize(narrow ? 11 : 12);
  text('Used: ' + usedKB() + ' KB of ' + FLASH_KB + ' KB', F.x + 10, my + 9);
  if (meterWarn && !narrow) {
    textAlign(RIGHT, TOP); textStyle(BOLD);
    text('Too big!', F.x + F.w - 10, my + 9);
    textStyle(NORMAL); textAlign(LEFT, TOP);
  }
}

function drawRam(R, narrow) {
  stroke('white'); strokeWeight(1.5); fill(RAM_COLOR);
  rect(R.x, R.y, R.w, R.h, 6);
  noStroke(); fill('white'); textAlign(LEFT, TOP);
  textSize(narrow ? 12 : 14); textStyle(BOLD);
  text(narrow ? 'RAM (264 KB)' : 'RAM (264 KB) - temporary', R.x + 8, R.y + 5);
  if (narrow) { textStyle(NORMAL); textSize(11); text('temporary', R.x + 8, R.y + 20); }
  textStyle(NORMAL);

  let y = R.y + (narrow ? 38 : 26);
  textSize(narrow ? 12 : 14);
  if (ram.length === 0) {
    fill('peachpuff');
    text(powerOn ? '(no variables yet)' : '(empty: no power)', R.x + 10, y);
  } else {
    textFont('monospace');
    for (const v of ram) {
      fill('white');
      text(v.name + ' = ' + v.value, R.x + 10, y);
      y += narrow ? 17 : 20;
    }
    textFont('sans-serif');
  }
}

// a document icon slides from Flash into RAM while the board boots
function drawBootArrow(F, R, narrow) {
  const t = constrain((millis() - bootStart) / BOOT_MS, 0, 1);
  let x1, y1, x2, y2;
  if (!narrow) { x1 = F.x + F.w * 0.75; y1 = F.y + F.h - 6; x2 = x1; y2 = R.y + 22; }
  else { x1 = F.x + F.w - 6; y1 = F.y + F.h / 2; x2 = R.x + 6; y2 = y1; }
  stroke('gold'); strokeWeight(4);
  line(x1, y1, x2, y2);
  const px = lerp(x1, x2, t), py = lerp(y1, y2, t);
  stroke('dimgray'); strokeWeight(1); fill('white');
  rect(px - 8, py - 10, 16, 20, 2);
  noStroke(); fill('black'); textSize(12); textStyle(BOLD);
  textAlign(narrow ? CENTER : LEFT, CENTER);
  if (!narrow) text('Boot: reading main.py', x1 + 14, (y1 + y2) / 2);
  textStyle(NORMAL);
}

// "What the board is doing" log: newest line on top, older lines fade
function drawLog(L) {
  const P = L.log;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(P.x, P.y, P.w, P.h, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP);
  textSize(14); textStyle(BOLD);
  text('What the board is doing', P.x + 8, P.y + 6);
  textStyle(NORMAL);

  const ts = L.narrow ? 12 : 13, lh = ts + 4;
  textSize(ts);
  let y = P.y + 26;
  for (let i = 0; i < logLines.length; i++) {
    textStyle(i === 0 ? BOLD : NORMAL);
    const lines = wrapText(logLines[i], P.w - 16);
    if (y + lines.length * lh > P.y + P.h - 4) break;
    fill(i === 0 ? 'black' : 'gray');
    for (const ln of lines) { text(ln, P.x + 8, y); y += lh; }
    textStyle(NORMAL);
    y += 4;
  }
}

// split a sentence into lines that fit a width at the current text size
function wrapText(s, w) {
  const words = s.split(' ');
  const out = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? cur + ' ' + word : word;
    if (textWidth(test) > w && cur) { out.push(cur); cur = word; }
    else cur = test;
  }
  if (cur) out.push(cur);
  return out;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof resetButton !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
