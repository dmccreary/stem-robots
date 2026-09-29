// Arithmetic Operator Playground
// CANVAS_HEIGHT: 460
// Bloom L3 (Apply): predict the result of +, -, *, /, //, % and ** for two
// numbers, and choose the right operator for a robot task.
// Adapted from moving-rainbow/python-operator-playground: the seven-operator
// table is kept; a block picture shows // (full groups, green) and % (leftover,
// orange), and robot presets load real uses of each operator.
// Results follow Python rules: / always gives a float; the others give an int
// when both inputs are ints, and a float when a is a float.

let canvasWidth = 700;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let aInput, bInput, decimalCheckbox, presetSelect;
let lastWidth = 0;
let a = 7, b = 2;          // current operands
let inputNote = '';        // validation message for the number fields
let presetNote = '';       // robot sentence for the chosen preset
let lastGoodA = 7, lastGoodB = 2;

const GROUP_COLOR = '#43a047';   // full groups (the // answer)
const LEFT_COLOR = '#e65100';    // leftover (the % answer)

const OPS = [
  { sym: '+', name: 'Add' },
  { sym: '-', name: 'Subtract' },
  { sym: '*', name: 'Multiply' },
  { sym: '/', name: 'Divide' },
  { sym: '//', name: 'Integer divide' },
  { sym: '%', name: 'Remainder' },
  { sym: '**', name: 'Power' }
];

const PRESETS = [
  { label: 'Choose a robot example...' },
  { label: 'Whole groups of 10 cm: 27 // 10', a: 27, b: 10, focus: '//',
    note: '27 cm holds 2 whole groups of 10 cm. Use // when you only want whole groups.' },
  { label: 'Every 5th loop: loop_count % 5', a: 23, b: 5, focus: '%',
    note: 'loop_count % 5 == 0 is True every 5th loop, when the remainder is 0.' },
  { label: 'Split a speed of 30 in half: 30 / 2', a: 30, b: 2, focus: '/',
    note: '30 / 2 gives 15.0, a float. Use 30 // 2 if you need the int 15.' },
  { label: 'Average of two readings: (30 + 34) / 2', a: 64, b: 2, focus: '/',
    note: 'a = 30 + 34 = 64, and 64 / 2 gives the average: 32.0 cm.' }
];
let focusOp = null;   // operator row to spotlight for a preset

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  aInput = createInput('7', 'number');
  aInput.parent(mainEl);
  aInput.attribute('min', '0'); aInput.attribute('max', '100');
  aInput.input(readInputs);
  bInput = createInput('2', 'number');
  bInput.parent(mainEl);
  bInput.attribute('min', '1'); bInput.attribute('max', '10');
  bInput.input(readInputs);
  for (const inp of [aInput, bInput]) { inp.style('font-size', '15px'); inp.size(56, 22); }

  decimalCheckbox = createCheckbox('Use decimal a (a = 7.5)', false);
  decimalCheckbox.parent(mainEl);
  decimalCheckbox.style('font-size', '15px');
  decimalCheckbox.changed(() => { presetSelect.selected(PRESETS[0].label); presetNote = ''; focusOp = null; readInputs(); });

  presetSelect = createSelect();
  presetSelect.parent(mainEl);
  for (const p of PRESETS) presetSelect.option(p.label);
  presetSelect.style('font-size', '15px');
  presetSelect.changed(loadPreset);

  positionControls();
  describe('A table shows the results of seven Python arithmetic operators for two numbers a and b, with the result type. A picture of a as small squares groups them into blocks of size b: green full groups are the integer division answer and orange leftover squares are the remainder. Number fields, a decimal checkbox, and robot example presets change the inputs.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 560;
  aInput.position(38, drawHeight + 9);
  bInput.position(150, drawHeight + 9);
  decimalCheckbox.position(narrow ? 225 : 240, drawHeight + 11);
  // shorter checkbox label on narrow screens (change only the label text)
  const span = decimalCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? 'a = 7.5' : 'Use decimal a (a = 7.5)';
  presetSelect.position(narrow ? 10 : 140, drawHeight + 46);
  presetSelect.size(narrow ? canvasWidth - 20 : min(360, canvasWidth - 150), 26);
}

// read and check the two number fields
function readInputs() {
  inputNote = '';
  const av = Number(aInput.value());
  const bv = Number(bInput.value());
  if (aInput.value() === '' || !Number.isInteger(av) || av < 0 || av > 100) {
    inputNote = 'a must be a whole number from 0 to 100.';
  } else lastGoodA = av;
  if (bInput.value() !== '' && bv === 0) {
    inputNote = 'b cannot be 0. Dividing by zero is an error in Python.';
  } else if (bInput.value() === '' || !Number.isInteger(bv) || bv < 1 || bv > 10) {
    inputNote = 'b must be a whole number from 1 to 10.';
  } else lastGoodB = bv;
  a = decimalCheckbox.checked() ? 7.5 : lastGoodA;
  b = lastGoodB;
  if (document.activeElement === aInput.elt || document.activeElement === bInput.elt) {
    presetSelect.selected(PRESETS[0].label); presetNote = ''; focusOp = null;
  }
}

function loadPreset() {
  const p = PRESETS.find(x => x.label === presetSelect.value());
  if (!p || p.a === undefined) { presetNote = ''; focusOp = null; return; }
  decimalCheckbox.checked(false);
  aInput.value(p.a); bInput.value(p.b);
  lastGoodA = p.a; lastGoodB = p.b;
  a = p.a; b = p.b;
  inputNote = '';
  presetNote = p.note;
  focusOp = p.focus;
}

// Python-style result and type for one operator
function compute(sym) {
  const isFloat = !Number.isInteger(a);
  let v;
  switch (sym) {
    case '+': v = a + b; break;
    case '-': v = a - b; break;
    case '*': v = a * b; break;
    case '/': return { text: pyFloat(a / b), type: 'float' };
    case '//': v = Math.floor(a / b); break;
    case '%': v = a - b * Math.floor(a / b); break;
    case '**':
      if (!isFloat) return { text: (BigInt(a) ** BigInt(b)).toString(), type: 'int' };
      v = Math.pow(a, b); break;
  }
  return isFloat ? { text: pyFloat(v), type: 'float' } : { text: String(v), type: 'int' };
}

// floats always show a decimal point, like Python: 3 -> "3.0"
function pyFloat(x) {
  const r = parseFloat(x.toPrecision(12));
  return Number.isInteger(r) ? r + '.0' : String(r);
}

function fmtA() { return Number.isInteger(a) ? String(a) : pyFloat(a); }

function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < 560;
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(narrow ? 18 : 22);
  text('Arithmetic Operator Playground', canvasWidth / 2, 6);

  // current inputs, or a warning about them
  textSize(15); textAlign(LEFT, TOP);
  if (inputNote) { fill('firebrick'); textStyle(BOLD); text(inputNote, margin, 34); textStyle(NORMAL); }
  else {
    fill('navy');
    text('a = ' + fmtA() + ' (' + (Number.isInteger(a) ? 'int' : 'float') + ')    b = ' + b + ' (int)', margin, 34);
  }

  let T, P;
  if (!narrow) {
    T = { x: margin, y: 58, w: canvasWidth * 0.55 - margin, rowH: 38 };
    P = { x: canvasWidth * 0.55 + 6, y: 58, w: canvasWidth * 0.45 - margin - 6, h: drawHeight - 66 };
  } else {
    T = { x: margin, y: 54, w: canvasWidth - 2 * margin, rowH: 25 };
    P = { x: margin, y: 256, w: canvasWidth - 2 * margin, h: drawHeight - 262 };
  }
  drawTable(T, narrow);
  drawPicture(P, narrow);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(16); textStyle(BOLD);
  text('a =', 10, drawHeight + 21);
  text('b =', 122, drawHeight + 21);
  textStyle(NORMAL);
  if (!narrow) text('Robot example:', 10, drawHeight + 59);
}

function drawTable(T, narrow) {
  const cols = narrow ? [0, 0.30, 0.52, 0.80] : [0, 0.34, 0.56, 0.80];
  const headers = ['Operator', 'Code', 'Result', 'Type'];
  const hH = narrow ? 22 : 26;
  noStroke(); fill('midnightblue');
  rect(T.x, T.y, T.w, hH, 6, 6, 0, 0);
  fill('white'); textSize(narrow ? 13 : 15); textStyle(BOLD); textAlign(LEFT, CENTER);
  headers.forEach((h, i) => text(h, T.x + 8 + cols[i] * T.w, T.y + hH / 2));
  textStyle(NORMAL);

  const bothInt = Number.isInteger(a);
  let y = T.y + hH;
  const rowH = T.rowH;
  OPS.forEach((op, i) => {
    const r = compute(op.sym);
    // row color: / is blue when both inputs are ints, // green, % orange
    let bg = i % 2 === 0 ? 'white' : 'whitesmoke';
    if (op.sym === '/' && bothInt) bg = 'lightblue';
    if (op.sym === '//') bg = color(67, 160, 71, 45);
    if (op.sym === '%') bg = color(230, 81, 0, 40);
    stroke('gainsboro'); strokeWeight(1); fill(bg);
    rect(T.x, y, T.w, rowH);
    if (focusOp === op.sym) {
      noFill(); stroke('navy'); strokeWeight(3);
      rect(T.x + 1, y + 1, T.w - 2, rowH - 2, 3);
    }
    noStroke(); fill('black'); textAlign(LEFT, CENTER);
    const cy = y + rowH / 2;
    textSize(narrow ? 13 : 15);
    text(narrow ? op.sym : op.name + '  ' + op.sym, T.x + 8, cy);
    if (narrow) { fill('dimgray'); textSize(12); text(op.name, T.x + 30, cy); fill('black'); }
    textFont('monospace'); textSize(narrow ? 13 : 15);
    text('a ' + op.sym + ' b', T.x + 8 + cols[1] * T.w, cy);
    textStyle(BOLD);
    const shown = r.text.length > 12 ? r.text.slice(0, 11) + '…' : r.text;
    text(shown, T.x + 8 + cols[2] * T.w, cy);
    textStyle(NORMAL); textFont('sans-serif');
    fill(r.type === 'float' ? 'mediumblue' : 'darkgreen');
    textSize(narrow ? 13 : 15);
    text(r.type, T.x + 8 + cols[3] * T.w, cy);
    y += rowH;
  });

  if (!narrow && bothInt) {
    noStroke(); fill('steelblue'); textSize(13); textAlign(LEFT, TOP);
    text('Blue row: / always gives a float, even for two ints.', T.x, y + 6);
  }
}

// a as squares grouped into blocks of b: green full groups (//), orange leftover (%)
function drawPicture(P, narrow) {
  stroke('lightsteelblue'); strokeWeight(1); fill('white');
  rect(P.x, P.y, P.w, P.h, 8);
  const groups = Math.floor(a / b);
  const left = a - b * groups;
  const leftTxt = Number.isInteger(left) ? String(left) : pyFloat(left);

  // sentence at the bottom of the panel
  const sentence = fmtA() + (a <= 30 ? ' squares' : ' units') + ' make ' + groups + ' full group' +
    (groups === 1 ? '' : 's') + ' of ' + b + ', with ' + leftTxt + ' left over.';
  const noteH = presetNote ? (narrow ? 32 : 58) : 0;
  const sentH = narrow ? 18 : 40;
  const legendH = narrow ? 0 : 50;
  const areaH = P.h - 16 - sentH - noteH - legendH;

  if (a <= 30) drawSquares(P.x + 10, P.y + 10, P.w - 20, areaH, groups, left);
  else drawBar(P.x + 10, P.y + 10, P.w - 20, areaH, groups, left);

  // legend linking the colors to the two operators
  if (!narrow) {
    const ly = P.y + P.h - sentH - noteH - legendH - 2;
    noStroke(); textSize(14); textAlign(LEFT, CENTER);
    fill(GROUP_COLOR); rect(P.x + 12, ly + 6, 14, 14, 2);
    fill('black'); text('full groups: ' + groups + '   = a // b', P.x + 34, ly + 13);
    fill(LEFT_COLOR); rect(P.x + 12, ly + 28, 14, 14, 2);
    fill('black'); text('left over: ' + leftTxt + '   = a % b', P.x + 34, ly + 35);
  }

  noStroke(); fill('black'); textSize(narrow ? 13 : 15); textAlign(LEFT, TOP);
  let sy = P.y + P.h - sentH - noteH - 4;
  text(sentence, P.x + 10, sy, P.w - 20, sentH + 4);
  if (presetNote) {
    fill('navy'); textStyle(BOLD); textSize(narrow ? 12 : 14);
    text('Robot use: ' + presetNote, P.x + 10, sy + sentH + 2, P.w - 20, noteH);
    textStyle(NORMAL);
  }
}

function drawSquares(x0, y0, w, h, groups, left) {
  // choose the largest square size that fits every row
  const whole = Math.floor(a);
  const half = a - whole > 0;
  let s = 30, layout;
  while (s >= 7) {
    layout = placeSquares(w, s, groups, whole, half);
    if (layout.rows * (s + 8) <= h) break;
    s--;
  }
  for (const q of layout.items) {
    stroke('white'); strokeWeight(1);
    fill(q.inGroup ? GROUP_COLOR : LEFT_COLOR);
    rect(x0 + q.x, y0 + q.y, q.half ? s / 2 : s, s, 2);
  }
  // outline each full group
  noFill(); stroke('darkgreen'); strokeWeight(1.5);
  for (const g of layout.groupBoxes) rect(x0 + g.x - 3, y0 + g.y - 3, g.w + 6, s + 6, 4);
}

// lay out squares group by group, starting a new row when a group will not fit
function placeSquares(w, s, groups, whole, half) {
  const gap = 2, groupGap = 10;
  const items = [], groupBoxes = [];
  let x = 3, y = 3, rows = 1, idx = 0;
  const unitW = s + gap;
  const newRowIfNeeded = (need) => { if (x + need > w && x > 3) { x = 3; y += s + 8; rows++; } };
  for (let g = 0; g < groups; g++) {
    const gw = b * unitW - gap;
    newRowIfNeeded(gw);
    groupBoxes.push({ x: x, y: y, w: gw });
    for (let k = 0; k < b; k++) { items.push({ x: x + k * unitW, y: y, inGroup: true }); idx++; }
    x += gw + groupGap;
  }
  // leftover squares (and the half square for 7.5)
  const leftCount = whole - idx;
  for (let k = 0; k < leftCount; k++) {
    newRowIfNeeded(s);
    items.push({ x: x, y: y, inGroup: false }); x += unitW;
  }
  if (half) { newRowIfNeeded(s / 2); items.push({ x: x, y: y, inGroup: false, half: true }); }
  return { items, groupBoxes, rows };
}

// for a above 30: one bar split into groups of b
function drawBar(x0, y0, w, h, groups, left) {
  noStroke(); fill('dimgray'); textSize(13); textAlign(LEFT, TOP);
  text('Picture scaled to fit: the bar is ' + fmtA() + ' units long.', x0, y0);
  const by = y0 + 24, bh = min(34, h - 30);
  const unit = w / a;
  for (let g = 0; g < groups; g++) {
    stroke('white'); strokeWeight(1);
    fill(g % 2 === 0 ? GROUP_COLOR : 'seagreen');
    rect(x0 + g * b * unit, by, b * unit, bh);
  }
  if (left > 0) { fill(LEFT_COLOR); rect(x0 + groups * b * unit, by, left * unit, bh); }
  noStroke(); fill('black'); textSize(13);
  text(groups + ' green groups of ' + b, x0, by + bh + 6);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof presetSelect !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
