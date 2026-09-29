// Data Type Explorer
// CANVAS_HEIGHT: 430
// Bloom L2 (Understand / Classify): identify the data type of a value and
// explain how a small change, such as a decimal point or quotes, changes it.
// Adapted from learning-micropython/python-data-type-explorer: the four
// colored type boxes and click-to-classify idea are kept; values are typed or
// picked from robot presets, then slide into the matching bin, and a REPL-style
// panel shows type(value) with a plain-English reason.
// The canvas height is fixed. The preset buttons wrap onto more rows on narrow
// screens, so the control area grows and the drawing area shrinks to match.

let canvasWidth = 700;
let drawHeight = 350;       // wide-screen value
let controlHeight = 80;     // wide-screen value
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let valueInput, checkButton, plusCheckbox;
let presetButtons = [];
let lastWidth = 0;

// the four chapter types
const BINS = [
  { type: 'int', color: '#1976d2', sample: '255', desc: 'whole number' },
  { type: 'float', color: '#43a047', sample: '0.92', desc: 'has a decimal point' },
  { type: 'str', color: '#e65100', sample: '"Sparky"', desc: 'text in quotes' },
  { type: 'bool', color: '#7b1fa2', sample: 'True', desc: 'True or False' }
];

// robot values from Chapter 3
const PRESETS = [
  { v: '15', use: 'distance_cm = 15' },
  { v: '30.5', use: 'distance_cm = 30.5' },
  { v: '"Sparky"', use: 'robot_name = "Sparky"' },
  { v: "'All systems go!'", use: "status_message = 'All systems go!'" },
  { v: '65535', use: 'motor_speed = 65535   # maximum PWM duty' },
  { v: '0.92', use: 'scale_factor = 0.92   # sensor calibration' },
  { v: 'True', use: 'is_moving = True' },
  { v: 'False', use: 'obstacle_detected = False' },
  { v: '"15"', use: 'distance_text = "15"   # text for the OLED' },
  { v: 'true', use: 'is_moving = true   # lowercase!' }
];

// current result
let shown = null;        // { value, type, error, reason, plus, plusNote, use }
let predicted = null;    // bin the learner clicked before checking
let predictionNote = '';
let slideStart = -1;     // time the token started sliding into its bin
const SLIDE_MS = 600;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  valueInput = createInput('15');
  valueInput.parent(mainEl);
  valueInput.style('font-size', '15px');
  valueInput.style('font-family', 'monospace');
  valueInput.changed(checkType);

  checkButton = createButton('Check type');
  checkButton.parent(mainEl);
  checkButton.style('font-size', '15px');
  checkButton.mousePressed(checkType);

  plusCheckbox = createCheckbox('Show what value + 1 does', false);
  plusCheckbox.parent(mainEl);
  plusCheckbox.style('font-size', '15px');

  for (const p of PRESETS) {
    const b = createButton(p.v);
    b.parent(mainEl);
    b.style('font-family', 'monospace');
    b.style('font-size', '13px');
    b.mousePressed(() => { valueInput.value(p.v); checkType(); });
    presetButtons.push(b);
  }

  shown = classify('15');   // default: 15 already in the int bin
  positionControls();
  describe('Four colored bins labeled int, float, str and bool. Type a value or pick a robot value, press Check type, and a token slides into the matching bin. A REPL-style panel shows type(value), the class name, and a plain-English reason. A checkbox shows what value + 1 does for that type, including errors.', LABEL);
}

// Row 1: value field, Check type, and the + 1 checkbox (wraps if needed).
// Following rows: preset buttons, wrapping as the width allows.
function positionControls() {
  const narrow = canvasWidth < 560;
  // preset buttons flow left to right, wrapping when a row is full
  let x = 10, rowY = 40;
  const places = [];
  for (const b of presetButtons) {
    const w = b.elt.offsetWidth || 50;
    if (x + w > canvasWidth - 10 && x > 10) { x = 10; rowY += 32; }
    places.push({ b: b, x: x, y: rowY });
    x += w + 6;
  }
  // the checkbox sits on row 1 on wide screens, after the presets on narrow ones
  let cbX = 390, cbY = 10;
  if (narrow) {
    if (x + 230 > canvasWidth - 10) { x = 10; rowY += 32; }
    cbX = x; cbY = rowY + 3;
  }
  controlHeight = rowY + 36;
  drawHeight = canvasHeight - controlHeight;
  valueInput.position(112, drawHeight + 7);
  valueInput.size(narrow ? 130 : 160, 22);
  checkButton.position(narrow ? 256 : 284, drawHeight + 6);
  plusCheckbox.position(cbX, drawHeight + cbY);
  for (const p of places) p.b.position(p.x, drawHeight + p.y);
}

// Classify a typed value with the chapter's rules and build the explanation
function classify(raw) {
  const v = raw.trim();
  const r = { value: v, use: '' };
  const preset = PRESETS.find(p => p.v === v);
  if (preset) r.use = preset.use;
  if (/^-?\d+$/.test(v)) {
    r.type = 'int';
    r.reason = v + ' has no decimal point and no quotes, so it is an int.';
    r.plus = (BigInt(v) + 1n).toString();
  } else if (/^-?(\d+\.\d*|\.\d+)$/.test(v)) {
    r.type = 'float';
    r.reason = v + ' has a decimal point, so it is a float.';
    const f = parseFloat(v) + 1;
    r.plus = Number.isInteger(f) ? f + '.0' : String(parseFloat(f.toPrecision(12)));
  } else if (/^'[^']*'$/.test(v) || /^"[^"]*"$/.test(v)) {
    r.type = 'str';
    const inner = v.slice(1, -1);
    if (/^-?\d+(\.\d+)?$/.test(inner)) r.reason = 'It looks like a number, but the quotes make it a string.';
    else r.reason = v + ' is inside quotes, so it is a str (a string of text).';
    r.plus = null;
    r.plusError = "TypeError: can't convert 'int' object to str implicitly";
    r.plusNote = 'You cannot add a number to text. Remove the quotes to do math.';
  } else if (v === 'True' || v === 'False') {
    r.type = 'bool';
    r.reason = v + ' is one of the two bool values, True or False. The capital letter matters.';
    r.plus = v === 'True' ? '2' : '1';
    r.plusNote = 'A bool acts like 1 or 0 in math, but it is still a bool.';
  } else if (v === '') {
    r.error = 'SyntaxError: invalid syntax';
    r.reason = 'Type a value first. Check capital letters and quotes.';
  } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(v)) {
    r.error = "NameError: name '" + v + "' isn't defined";
    r.reason = 'Python thinks ' + v + ' is a variable name, but no variable has that name. Check capital letters and quotes.';
  } else {
    r.error = 'SyntaxError: invalid syntax';
    r.reason = 'Python cannot read ' + v + ' as one value. Check capital letters and quotes.';
  }
  if (r.error) r.plusError = r.error;
  return r;
}

function checkType() {
  shown = classify(valueInput.value());
  slideStart = millis();
  if (predicted) {
    const actual = shown.type || 'an error';
    predictionNote = predicted === shown.type ? 'You predicted ' + predicted + '. Correct!'
      : 'You predicted ' + predicted + ', but it is ' + actual + '.';
  } else predictionNote = '';
  predicted = null;
}

// ---------------- drawing ----------------
function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < 560;
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(narrow ? 18 : 22);
  text('Data Type Explorer', canvasWidth / 2, 6);
  fill('dimgray'); textSize(13);
  if (!narrow) text('Tip: click a bin to predict the type, then press Check type.', canvasWidth / 2, 32);

  const boxes = binBoxes(narrow);
  boxes.forEach((B, i) => drawBin(B, BINS[i], narrow));
  drawToken(boxes, narrow);
  const panelY = narrow ? boxes[3].y + boxes[3].h + 8 : 178;
  drawResult(margin, panelY, canvasWidth - 2 * margin, drawHeight - panelY - 8, narrow);

  // control label
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(15);
  text('Type a value:', 10, drawHeight + 19);
}

// four bins in a row, or a 2 x 2 grid on narrow screens
function binBoxes(narrow) {
  const out = [];
  if (!narrow) {
    const gap = 10, w = (canvasWidth - 2 * margin - 3 * gap) / 4;
    for (let i = 0; i < 4; i++) out.push({ x: margin + i * (w + gap), y: 52, w: w, h: 118 });
  } else {
    const gap = 8, w = (canvasWidth - 2 * margin - gap) / 2, h = 50;
    for (let i = 0; i < 4; i++) {
      out.push({ x: margin + (i % 2) * (w + gap), y: 30 + floor(i / 2) * (h + gap), w: w, h: h });
    }
  }
  return out;
}

function drawBin(B, bin, narrow) {
  const isAnswer = shown && shown.type === bin.type;
  const isPrediction = predicted === bin.type;
  stroke(isPrediction ? 'orange' : (isAnswer ? 'gold' : 'white'));
  strokeWeight(isPrediction || isAnswer ? 4 : 2);
  const c = color(bin.color);
  if (shown && shown.type && !isAnswer) c.setAlpha(150);
  fill(c);
  rect(B.x, B.y, B.w, B.h, 10);
  noStroke(); fill('white');
  textAlign(LEFT, TOP); textFont('monospace'); textStyle(BOLD); textSize(narrow ? 17 : 20);
  text(bin.type, B.x + 10, B.y + 6);
  textStyle(NORMAL);
  if (!narrow) { textSize(13); text('e.g. ' + bin.sample, B.x + 10, B.y + 52); }
  textFont('sans-serif'); textAlign(LEFT, TOP); textSize(narrow ? 12 : 13);
  text(bin.desc, B.x + 10, B.y + (narrow ? 27 : 32));
}

// the value token slides into its bin; errors shake and stay outside
function drawToken(boxes, narrow) {
  if (!shown) return;
  const maxLen = narrow ? 11 : 18;
  const label = shown.value.length > maxLen ? shown.value.slice(0, maxLen - 1) + '…' : shown.value;
  textFont('monospace'); textSize(narrow ? 13 : 15); textStyle(BOLD);
  const tw = textWidth(label) + 18, th = narrow ? 22 : 26;
  let tx, ty;
  const t = slideStart < 0 ? 1 : constrain((millis() - slideStart) / SLIDE_MS, 0, 1);
  const ease = 1 - pow(1 - t, 3);
  if (shown.type) {
    const B = boxes[BINS.findIndex(b => b.type === shown.type)];
    const endX = narrow ? B.x + B.w - tw / 2 - 6 : B.x + B.w / 2;
    const endY = narrow ? B.y + 14 : B.y + B.h - th / 2 - 8;
    const startX = canvasWidth / 2, startY = drawHeight - 20;
    tx = lerp(startX, endX, ease); ty = lerp(startY, endY, ease);
  } else {
    tx = canvasWidth / 2 + (t < 1 ? sin(t * 40) * 6 : 0);
    ty = narrow ? boxes[3].y + boxes[3].h - 6 : 162;
  }
  stroke(shown.type ? 'black' : 'firebrick'); strokeWeight(2);
  fill(shown.type ? 'white' : 'mistyrose');
  rect(tx - tw / 2, ty - th / 2, tw, th, 6);
  noStroke(); fill(shown.type ? 'black' : 'firebrick');
  textAlign(CENTER, CENTER);
  text(label, tx, ty + 1);
  textStyle(NORMAL); textFont('sans-serif');
}

// REPL-style panel with type(value), the reason, and optionally value + 1
function drawResult(x, y, w, h, narrow) {
  noStroke(); fill('#1e1e1e');
  rect(x, y, w, h, 8);
  if (!shown) return;
  const lh = narrow ? 16 : 19;
  let ty = y + 8;
  textAlign(LEFT, TOP); textFont('monospace'); textSize(narrow ? 12 : 14);
  fill('lightgreen');
  text('>>> type(' + shown.value + ')', x + 10, ty, w - 20, lh); ty += lh;
  fill(shown.error ? 'salmon' : 'white');
  text(shown.error ? shown.error : "<class '" + shown.type + "'>", x + 10, ty, w - 20, lh); ty += lh;
  if (plusCheckbox.checked()) {
    fill('lightgreen');
    text('>>> ' + shown.value + ' + 1', x + 10, ty, w - 20, lh); ty += lh;
    fill(shown.plusError ? 'salmon' : 'white');
    text(shown.plusError ? shown.plusError : shown.plus, x + 10, ty, w - 20, lh * 2);
    ty += textWidth(shown.plusError || '') > w - 20 ? lh * 2 : lh;
  }
  textFont('sans-serif');
  ty += 4;
  textSize(narrow ? 12 : 14); fill('khaki');
  let sentence = shown.reason;
  if (plusCheckbox.checked() && shown.plusNote) sentence += ' ' + shown.plusNote;
  text(sentence, x + 10, ty, w - 20, lh * 3); ty += lh * (textWidth(sentence) > w - 20 ? 2 : 1) + 4;
  if (shown.use && ty < y + h - lh) {
    fill('lightsteelblue'); textFont('monospace'); textSize(narrow ? 11 : 13);
    text('Robot code: ' + shown.use, x + 10, ty, w - 20, lh); ty += lh;
    textFont('sans-serif');
  }
  if (predictionNote && ty < y + h - lh + 2) {
    textStyle(BOLD); textSize(narrow ? 12 : 14);
    fill(predictionNote.endsWith('Correct!') ? 'palegreen' : 'orange');
    text(predictionNote, x + 10, ty, w - 20, lh);
    textStyle(NORMAL);
  }
}

// click a bin to predict before pressing Check type
function mousePressed() {
  const boxes = binBoxes(canvasWidth < 560);
  for (let i = 0; i < 4; i++) {
    const B = boxes[i];
    if (mouseX > B.x && mouseX < B.x + B.w && mouseY > B.y && mouseY < B.y + B.h) {
      predicted = BINS[i].type;
      predictionNote = 'Prediction: ' + predicted + '. Now press Check type.';
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof plusCheckbox !== 'undefined' && presetButtons.length === PRESETS.length && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
