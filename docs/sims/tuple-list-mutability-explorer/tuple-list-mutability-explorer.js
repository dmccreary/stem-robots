// Tuple vs List Mutability
// CANVAS_HEIGHT: 420
// Bloom L2 (Understand) - Distinguish: run the same operation on a list and a
// tuple that hold the same robot data. Reading and looping work on both.
// Changing, appending, and removing work only on the list; the tuple refuses
// with a TypeError or AttributeError. Students pick the right container for
// fixed hardware values.

let canvasWidth = 700;
let drawHeight = 340;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let dataSelect, opSelect, valueInput, tryButton, resetButton;

// Data sets (motor pins match config.py: GP8, GP9, GP10, GP11)
const DATA_SETS = {
  'motor_pins = 8, 9, 10, 11': { name: 'motor_pins', values: [8, 9, 10, 11] },
  'rgb_red = 255, 0, 0': { name: 'rgb_red', values: [255, 0, 0] },
  'board_size = 128, 64': { name: 'board_size', values: [128, 64] }
};
const OPS = ['Change item 0', 'Append a value', 'Remove the last item', 'Read item 0', 'Loop over all items'];
const MAX_ITEMS = 12;

let dataKey = 'motor_pins = 8, 9, 10, 11';
let listVals = [], tupleVals = [];
let listResult = null, tupleResult = null;   // {ok, text}
let outputLine = '';
let listWorked = 0, tupleBlocked = 0;
let flashIndex = -1, flashStart = 0;
let shakeStart = -1000;
let attempted = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  dataSelect = createSelect();
  dataSelect.parent(main);
  for (const k in DATA_SETS) dataSelect.option(k);
  dataSelect.selected(dataKey);
  dataSelect.changed(() => { dataKey = dataSelect.value(); resetSim(); });

  opSelect = createSelect();
  opSelect.parent(main);
  for (const o of OPS) opSelect.option(o);
  opSelect.selected(OPS[0]);
  opSelect.changed(() => { listResult = null; tupleResult = null; attempted = false; outputLine = ''; });

  valueInput = createInput('5', 'number');
  valueInput.parent(main);
  valueInput.attribute('min', 0);
  valueInput.attribute('max', 255);
  valueInput.size(52);
  valueInput.changed(() => valueInput.value(newValue()));

  tryButton = createButton('Try it on both');
  tryButton.parent(main);
  tryButton.mousePressed(tryIt);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);

  positionControls();
  resetSim();

  describe('Two panels show the same robot data stored as a list on the left and a tuple on the right. Choose an operation such as change item 0, append, remove, read, or loop, then press Try it on both. The list accepts changes and flashes the changed box, while the tuple shows a padlock that shakes and a red TypeError or AttributeError bubble.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  dataSelect.position(86, y1);
  if (canvasWidth < 600) {
    // narrow: two dropdowns share the row, no "Operation:" label
    const dw = max(110, canvasWidth / 2 - 90);
    dataSelect.size(dw);
    opSelect.position(86 + dw + 8, y1);
    opSelect.size(max(100, canvasWidth - (86 + dw + 8) - 10));
  } else {
    dataSelect.size(200);
    opSelect.position(390, y1);
    opSelect.size(AUTO);
  }
  valueInput.position(96, y2);
  tryButton.position(170, y2);
  resetButton.position(290, y2);
}

function newValue() {
  let v = parseInt(valueInput.value());
  if (isNaN(v)) v = 5;
  return constrain(v, 0, 255);
}

function resetSim() {
  listVals = DATA_SETS[dataKey].values.slice();
  tupleVals = DATA_SETS[dataKey].values.slice();
  listResult = null;
  tupleResult = null;
  outputLine = '';
  listWorked = 0;
  tupleBlocked = 0;
  flashIndex = -1;
  attempted = false;
}

// The line of MicroPython for the chosen operation
function codeFor(op, name, v) {
  if (op === OPS[0]) return name + '[0] = ' + v;
  if (op === OPS[1]) return name + '.append(' + v + ')';
  if (op === OPS[2]) return name + '.pop()';
  if (op === OPS[3]) return 'print(' + name + '[0])';
  return 'for x in ' + name + ': print(x)';
}

function tryIt() {
  const op = opSelect.value();
  const v = newValue();
  valueInput.value(v);
  attempted = true;
  flashIndex = -1;
  let listOut = '', tupleOut = '';

  // ---- list: every operation is allowed (unless the list is empty) ----
  if (op === OPS[0]) {
    if (listVals.length) { listVals[0] = v; flashIndex = 0; listResult = { ok: true, text: 'Worked!' }; listWorked++; }
    else listResult = { ok: false, text: 'IndexError: list index out of range' };
  } else if (op === OPS[1]) {
    if (listVals.length < MAX_ITEMS) {
      listVals.push(v);
      flashIndex = listVals.length - 1;
      listResult = { ok: true, text: 'Worked!' };
      listWorked++;
    } else {
      listResult = { ok: true, text: 'Worked! (this demo shows 12 items at most)' };
    }
  } else if (op === OPS[2]) {
    if (listVals.length) { listOut = 'removed ' + listVals.pop(); listResult = { ok: true, text: 'Worked!' }; listWorked++; }
    else listResult = { ok: false, text: 'IndexError: pop from empty list' };
  } else if (op === OPS[3]) {
    if (listVals.length) { listOut = String(listVals[0]); listResult = { ok: true, text: 'Worked!' }; }
    else listResult = { ok: false, text: 'IndexError: list index out of range' };
  } else {
    listOut = listVals.join(' ');
    listResult = { ok: true, text: 'Worked!' };
  }

  // ---- tuple: reading and looping work, changes are refused ----
  if (op === OPS[0]) {
    tupleResult = { ok: false, text: "TypeError: 'tuple' object doesn't support item assignment" };
  } else if (op === OPS[1]) {
    tupleResult = { ok: false, text: "AttributeError: 'tuple' object has no attribute 'append'" };
  } else if (op === OPS[2]) {
    tupleResult = { ok: false, text: "AttributeError: 'tuple' object has no attribute 'pop'" };
  } else if (op === OPS[3]) {
    tupleOut = String(tupleVals[0]);
    tupleResult = { ok: true, text: 'Worked!' };
  } else {
    tupleOut = tupleVals.join(' ');
    tupleResult = { ok: true, text: 'Worked!' };
  }
  if (!tupleResult.ok) { tupleBlocked++; shakeStart = millis(); }
  flashStart = millis();

  if (op === OPS[3] || op === OPS[4]) {
    outputLine = 'List prints: ' + (listOut || '-') + '     Tuple prints: ' + tupleOut;
  } else if (op === OPS[2] && listOut) {
    outputLine = 'List: ' + listOut + '. The tuple did not change.';
  } else {
    outputLine = 'List is now [' + listVals.join(', ') + '].  Tuple is still (' + tupleVals.join(', ') + ').';
  }
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
  text('Tuple vs List Mutability', canvasWidth / 2, 8);

  const pw = (canvasWidth - 3 * margin) / 2;
  drawPanel(margin, 38, pw, 212, true);
  drawPanel(2 * margin + pw, 38, pw, 212, false);
  drawConsole(margin, 258, canvasWidth - 2 * margin, 74);

  // control labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Data set:', 12, drawHeight + 20);
  if (canvasWidth >= 600) text('Operation:', 310, drawHeight + 20);
  text('New value:', 12, drawHeight + 56);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawPanel(x, y, w, h, isList) {
  const name = DATA_SETS[dataKey].name;
  const vals = isList ? listVals : tupleVals;
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);

  // header
  noStroke();
  fill(isList ? 'steelblue' : 'dimgray');
  textSize(17);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(isList ? 'List [ ]' : 'Tuple ( )', x + 10, y + 8);
  textStyle(NORMAL);
  fill('black');
  push();
  textFont('monospace');
  textSize(13);
  const open = isList ? '[' : '(', close = isList ? ']' : ')';
  const tail = (!isList && vals.length === 1) ? ',' : '';
  text(name + ' = ' + open + vals.join(', ') + tail + close, x + 10, y + 32, w - 20);
  pop();

  // padlock above the tuple row (shakes when a change is refused)
  const rowY = y + 86;
  if (!isList) {
    const shaking = millis() - shakeStart < 500;
    const dx = shaking ? sin((millis() - shakeStart) * 0.08) * 5 : 0;
    drawPadlock(x + w - 34 + dx, y + 16);
  }

  // row of boxes with brackets at each end
  const n = max(vals.length, 1);
  const bw = min(54, (w - 60) / n);
  const rowW = vals.length ? bw * vals.length : 80;   // leave room for the (empty) label
  const rx = x + (w - rowW) / 2;
  fill(isList ? 'steelblue' : 'gray');
  noStroke();
  textSize(40);
  textAlign(CENTER, CENTER);
  text(open, rx - 12, rowY + 17);
  text(close, rx + rowW + 12, rowY + 17);
  for (let k = 0; k < vals.length; k++) {
    const bx = rx + k * bw;
    const flashing = isList && k === flashIndex && millis() - flashStart < 900;
    stroke('white');
    strokeWeight(2);
    fill(flashing ? 'gold' : (isList ? 'lightsteelblue' : 'gainsboro'));
    rect(bx, rowY, bw, 36, 4);
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(bw < 34 ? 12 : 15);
    textAlign(CENTER, CENTER);
    text(vals[k], bx + bw / 2, rowY + 18);
    fill('gray');
    textSize(12);
    text(k, bx + bw / 2, rowY - 10);
  }
  if (vals.length === 0) {
    fill('gray');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('(empty)', x + w / 2, rowY + 18);
  }

  // code for the current attempt
  const code = codeFor(opSelect.value(), name, newValue());
  push();
  clipTo(x + 2, y + 2, w - 4, h - 4);
  textFont('monospace');
  textSize(14);
  fill(attempted ? 'black' : 'gray');
  textAlign(LEFT, TOP);
  text('>>> ' + code, x + 10, rowY + 50);
  drawingContext.restore();
  pop();

  // result bubble
  const res = isList ? listResult : tupleResult;
  const by = rowY + 76;
  if (res) {
    fill(res.ok ? 'honeydew' : 'mistyrose');
    stroke(res.ok ? 'seagreen' : 'firebrick');
    strokeWeight(2);
    rect(x + 10, by, w - 20, 42, 8);
    strokeWeight(1);
    noStroke();
    fill(res.ok ? 'darkgreen' : 'firebrick');
    // at narrow widths show only the error type so it fits the bubble
    const msg = (!res.ok && w < 300) ? res.text.split(':')[0] : res.text;
    textSize(res.ok ? 16 : 13);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text((res.ok ? '✓ ' : '✗ ') + msg, x + 20, by + 4, w - 40, 34);
    textStyle(NORMAL);
  } else {
    fill('gray');
    textSize(14);
    textAlign(LEFT, TOP);
    text('Predict: will this work? Then press Try it on both.', x + 12, by + 4, w - 24);
  }
}

function drawPadlock(cx, cy) {
  stroke('dimgray');
  strokeWeight(3);
  noFill();
  arc(cx, cy + 6, 16, 18, PI, TWO_PI);
  strokeWeight(1);
  noStroke();
  fill('goldenrod');
  rect(cx - 11, cy + 6, 22, 17, 3);
  fill('black');
  circle(cx, cy + 13, 4);
  rect(cx - 1, cy + 13, 2, 6);
}

function drawConsole(x, y, w, h) {
  noStroke();
  fill('black');
  rect(x, y, w, h, 6);
  push();
  clipTo(x, y, w, h);
  textFont('monospace');
  textSize(w < 560 ? 11 : 13);
  textAlign(LEFT, TOP);
  fill('lightgreen');
  text(outputLine || '>>> (results appear here)', x + 12, y + 8);
  fill('white');
  text('List: ' + listWorked + ' changes worked,  Tuple: ' + tupleBlocked + ' changes blocked', x + 12, y + 29);
  fill('gold');
  text('Use a tuple when the values must never change, like pin numbers.', x + 12, y + 50);
  drawingContext.restore();
  pop();
}

// Clip drawing to a rectangle (call drawingContext.restore() when done)
function clipTo(x, y, w, h) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();
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
