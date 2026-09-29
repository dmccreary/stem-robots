// Resistor Color Code Calculator
// CANVAS_HEIGHT: 450
// Bloom L3 (Apply): read a four-band resistor's value in ohms from its colors,
// and choose stripe colors for a target value.
// Adapted from learning-micropython/resistor-color-code-calculator: the color
// tables, resistor drawing and value formatting are reused; dropdowns, a value
// field, a clickable example table and a quiz mode are added.
// The canvas height is fixed. On narrow screens the dropdowns stack in two rows,
// so the control area grows and the drawing area shrinks by the same amount.

let canvasWidth = 700;
let drawHeight = 350;       // wide-screen value (narrow: 280)
let controlHeight = 100;    // wide-screen value (narrow: 170)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let stripeSelects = [];
let valueInput, showButton, randomButton, revealButton;
let lastWidth = 0;
let quizMode = false;      // hide the answer until Reveal is pressed
let message = '';          // feedback for the value field
let messageColor = 'black';
let rowBoxes = [];         // clickable example rows (canvas coordinates)

// Digit colors for stripes 1 and 2
const DIGITS = [
  { name: 'black', digit: 0, css: 'black' },
  { name: 'brown', digit: 1, css: 'saddlebrown' },
  { name: 'red', digit: 2, css: 'red' },
  { name: 'orange', digit: 3, css: 'darkorange' },
  { name: 'yellow', digit: 4, css: 'yellow' },
  { name: 'green', digit: 5, css: 'green' },
  { name: 'blue', digit: 6, css: 'blue' },
  { name: 'violet', digit: 7, css: 'darkviolet' },
  { name: 'gray', digit: 8, css: 'gray' },
  { name: 'white', digit: 9, css: 'white' }
];

// Multiplier colors for stripe 3
const MULTS = [
  { name: 'black', mult: 1, css: 'black', label: 'x1' },
  { name: 'brown', mult: 10, css: 'saddlebrown', label: 'x10' },
  { name: 'red', mult: 100, css: 'red', label: 'x100' },
  { name: 'orange', mult: 1e3, css: 'darkorange', label: 'x1k' },
  { name: 'yellow', mult: 1e4, css: 'yellow', label: 'x10k' },
  { name: 'green', mult: 1e5, css: 'green', label: 'x100k' },
  { name: 'blue', mult: 1e6, css: 'blue', label: 'x1M' },
  { name: 'violet', mult: 1e7, css: 'darkviolet', label: 'x10M' },
  { name: 'gold', mult: 0.1, css: 'goldenrod', label: 'x0.1' },
  { name: 'silver', mult: 0.01, css: 'silver', label: 'x0.01' }
];

// Tolerance colors for stripe 4
const TOLS = [
  { name: 'gold', tol: 5, css: 'goldenrod' },
  { name: 'silver', tol: 10, css: 'silver' },
  { name: 'brown', tol: 1, css: 'saddlebrown' }
];

// Example resistors used in robot labs
const EXAMPLES = [
  { use: 'LED protector', stripes: ['orange', 'orange', 'brown', 'gold'] },
  { use: 'Pull-down for a button input', stripes: ['brown', 'black', 'orange', 'gold'] },
  { use: 'Pull-up', stripes: ['yellow', 'violet', 'red', 'gold'] }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  // four stripe dropdowns (stripe 1 has no black option)
  const tables = [DIGITS.slice(1), DIGITS, MULTS, TOLS];
  tables.forEach((table, i) => {
    const sel = createSelect();
    sel.parent(mainEl);
    for (const c of table) sel.option(optionLabel(i, c), c.name);
    sel.style('font-size', '14px');
    // give every option its own color chip (shown in browsers that allow it)
    Array.from(sel.elt.options).forEach((o, k) => {
      o.style.backgroundColor = table[k].css;
      o.style.color = textColorFor(table[k].name);
    });
    sel.changed(() => { quizMode = false; message = ''; updateReveal(); });
    stripeSelects.push(sel);
  });

  valueInput = createInput('');
  valueInput.parent(mainEl);
  valueInput.attribute('placeholder', 'e.g. 10k');
  valueInput.style('font-size', '14px');
  valueInput.changed(showStripesForValue);

  showButton = createButton('Show stripes');
  showButton.parent(mainEl);
  showButton.mousePressed(showStripesForValue);
  randomButton = createButton('Random resistor');
  randomButton.parent(mainEl);
  randomButton.mousePressed(randomResistor);
  revealButton = createButton('Reveal');
  revealButton.parent(mainEl);
  revealButton.mousePressed(() => { quizMode = false; message = ''; updateReveal(); });
  for (const b of [showButton, randomButton, revealButton]) b.style('font-size', '14px');

  setStripes(['orange', 'orange', 'brown', 'gold']);
  positionControls();
  describe('A tan resistor with four colored stripes above a large readout of its value in ohms, the math that produces it, and its tolerance range. Four dropdowns set the stripe colors, a value field finds the stripes for a target value, a table of example resistors loads common lab values, and a quiz mode hides the answer until Reveal is pressed.', LABEL);
}

function optionLabel(stripe, c) {
  if (stripe < 2) return c.digit + ' - ' + c.name;
  if (stripe === 2) return c.label + ' - ' + c.name;
  return c.tol + '% - ' + c.name;
}

function textColorFor(name) {
  return ['black', 'brown', 'blue', 'violet', 'green', 'red', 'gray'].includes(name) ? 'white' : 'black';
}

function isNarrow() { return canvasWidth < 560; }

// Wide: one row of four dropdowns plus a value row.
// Narrow: dropdowns in two rows of two, then the value row and the button row.
function positionControls() {
  controlHeight = isNarrow() ? 170 : 100;
  drawHeight = canvasHeight - controlHeight;
  const cols = isNarrow() ? 2 : 4;
  const colW = (canvasWidth - 20 - (cols - 1) * 10) / cols;
  stripeSelects.forEach((sel, i) => {
    const r = floor(i / cols), c = i % cols;
    sel.position(10 + c * (colW + 10), drawHeight + 24 + r * 46);
    sel.size(colW, 26);
  });
  const y = isNarrow() ? drawHeight + 104 : drawHeight + 62;
  const inputX = isNarrow() ? 118 : 165;
  valueInput.position(inputX, y + 2);
  valueInput.size(80, 22);
  showButton.position(inputX + 92, y);
  if (isNarrow()) {
    randomButton.position(10, y + 34);
    revealButton.position(140, y + 34);
  } else {
    randomButton.position(inputX + 202, y);
    revealButton.position(inputX + 330, y);
  }
  styleSelects();
  updateReveal();
}

// each dropdown shows the color it has selected, like a color chip.
// In quiz mode the text is hidden so the digits do not give the answer away.
function styleSelects() {
  const tables = [DIGITS, DIGITS, MULTS, TOLS];
  stripeSelects.forEach((sel, i) => {
    const c = tables[i].find(t => t.name === sel.value());
    sel.style('background-color', c.css);
    sel.style('color', quizMode ? c.css : textColorFor(c.name));
  });
}

function updateReveal() {
  if (quizMode) revealButton.removeAttribute('disabled');
  else revealButton.attribute('disabled', '');
  styleSelects();
}

function setStripes(names) {
  stripeSelects.forEach((sel, i) => sel.selected(names[i]));
  styleSelects();
}

// current value from the dropdowns
function current() {
  const d1 = DIGITS.find(c => c.name === stripeSelects[0].value());
  const d2 = DIGITS.find(c => c.name === stripeSelects[1].value());
  const m = MULTS.find(c => c.name === stripeSelects[2].value());
  const t = TOLS.find(c => c.name === stripeSelects[3].value());
  const digits = 10 * d1.digit + d2.digit;
  return { d1, d2, m, t, digits, ohms: roundTiny(digits * m.mult) };
}

function roundTiny(x) { return parseFloat(x.toPrecision(6)); }

// 330 -> "330", 4700 -> "4.7k", 1000000 -> "1M"
function fmt(ohms) {
  if (ohms >= 1e6) return trimNum(ohms / 1e6) + 'M';
  if (ohms >= 1e3) return trimNum(ohms / 1e3) + 'k';
  return trimNum(ohms);
}
function trimNum(n) { return parseFloat(n.toFixed(3)).toString(); }
function commas(n) { return n.toLocaleString('en-US', { maximumFractionDigits: 3 }); }

// Parse "330", "10k", "4.7k", "1M" and pick the closest two-digit + multiplier match
function showStripesForValue() {
  const raw = valueInput.value().trim().toLowerCase().replace(/ohms?|,|\s/g, '');
  const m = raw.match(/^([0-9]*\.?[0-9]+)([km]?)$/);
  if (!m) { message = 'Type a number of ohms, like 330, 4.7k or 1M.'; messageColor = 'firebrick'; return; }
  let v = parseFloat(m[1]) * (m[2] === 'k' ? 1e3 : m[2] === 'm' ? 1e6 : 1);
  if (v < 1) { message = 'Try a value of at least 1 ohm.'; messageColor = 'firebrick'; return; }
  if (v > 99e7) v = 99e7;
  let e = floor(Math.log10(v)) - 1;
  let digits = round(v / Math.pow(10, e));
  if (digits >= 100) { digits = 10; e += 1; }
  if (digits < 10) { digits *= 10; e -= 1; }
  const mult = MULTS.find(c => abs(c.mult - Math.pow(10, e)) < 1e-9 * Math.pow(10, e));
  const d1 = DIGITS[floor(digits / 10)], d2 = DIGITS[digits % 10];
  setStripes([d1.name, d2.name, mult.name, stripeSelects[3].value()]);
  quizMode = false; updateReveal();
  const got = roundTiny(digits * mult.mult);
  const colors = d1.name + ', ' + d2.name + ', ' + mult.name;
  if (abs(got - v) < 1e-9 * v) {
    message = fmt(got) + ' ohms = ' + colors + '.'; messageColor = 'darkgreen';
  } else {
    message = 'Closest match: ' + fmt(got) + ' ohms (' + colors + '). Two digits cannot make ' + commas(v) + '.';
    messageColor = 'darkorange';
  }
}

function randomResistor() {
  const d1 = DIGITS[floor(random(1, 10))].name;
  const d2 = DIGITS[floor(random(0, 10))].name;
  const m = MULTS[floor(random(0, 7))].name;   // x1 to x1M
  const t = TOLS[floor(random(0, 3))].name;
  quizMode = true;
  setStripes([d1, d2, m, t]);
  message = 'Quiz: read the stripes, work out the value, then press Reveal.';
  messageColor = 'purple';
  updateReveal();
}

// ---------------- drawing ----------------
function draw() {
  updateCanvasSize();
  const N = isNarrow();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(N ? 18 : 22);
  text('Resistor Color Code Calculator', canvasWidth / 2, 6);

  const c = current();
  drawResistor(canvasWidth / 2, N ? 58 : 76, N ? 44 : 64, [c.d1.css, c.d2.css, c.m.css, c.t.css]);
  drawReadout(c, N);
  drawExamples(N);

  // message line
  if (message) {
    noStroke(); fill(messageColor); textSize(N ? 13 : 15); textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(message, 10, drawHeight - (N ? 27 : 30), canvasWidth - 20, 30);
    textStyle(NORMAL);
  }

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(14);
  const labels = ['Stripe 1', 'Stripe 2', 'Stripe 3 (multiplier)', 'Stripe 4 (tolerance)'];
  const cols = N ? 2 : 4;
  const colW = (canvasWidth - 20 - (cols - 1) * 10) / cols;
  labels.forEach((lab, i) => {
    const r = floor(i / cols), col = i % cols;
    text(lab, 10 + col * (colW + 10), drawHeight + 6 + r * 46);
  });
  textAlign(LEFT, CENTER);
  const y = N ? drawHeight + 117 : drawHeight + 75;
  text(N ? 'Value (ohms):' : 'Enter a value (ohms):', 10, y);
}

// Tan body, wire leads, and four stripes (three grouped left, tolerance right)
function drawResistor(cx, cy, bodyH, cols) {
  const bodyW = min(canvasWidth * 0.55, 340);
  const bx = cx - bodyW / 2, by = cy - bodyH / 2;
  stroke('gray'); strokeWeight(5);
  line(margin, cy, bx + 6, cy);
  line(bx + bodyW - 6, cy, canvasWidth - margin, cy);
  stroke('peru'); strokeWeight(1.5); fill('#d7b98e');
  rect(bx, by, bodyW, bodyH, 12);
  const bandW = bodyW * 0.075;
  const pos = [0.18, 0.32, 0.46, 0.82];
  for (let i = 0; i < 4; i++) {
    const x = bx + bodyW * pos[i] - bandW / 2;
    stroke(cols[i] === 'white' || cols[i] === 'yellow' ? 'darkgray' : cols[i]); strokeWeight(1);
    fill(cols[i]);
    rect(x, by + 2, bandW, bodyH - 4, 2);
    noStroke(); fill('dimgray'); textSize(12); textAlign(CENTER, TOP);
    text(i + 1, x + bandW / 2, by + bodyH + 3);
  }
}

function drawReadout(c, N) {
  const cx = canvasWidth / 2;
  let y = N ? 98 : 124;
  noStroke(); textAlign(CENTER, TOP);
  if (quizMode) {
    fill('purple'); textSize(N ? 20 : 26); textStyle(BOLD);
    text('? ohms', cx, y);
    textStyle(NORMAL); textSize(N ? 13 : 15); fill('dimgray');
    text('Read the stripes. Press Reveal to check.', cx, y + (N ? 26 : 34));
    return;
  }
  fill('black'); textSize(N ? 20 : 26); textStyle(BOLD);
  text(fmt(c.ohms) + ' ohms, ' + c.t.tol + '% tolerance', cx, y);
  textStyle(NORMAL);
  y += N ? 26 : 34;
  fill('navy'); textSize(N ? 15 : 17);
  text(c.digits + ' x ' + commas(c.m.mult) + ' = ' + commas(c.ohms), cx, y);
  y += N ? 20 : 24;
  const lo = roundTiny(c.ohms * (1 - c.t.tol / 100));
  const hi = roundTiny(c.ohms * (1 + c.t.tol / 100));
  fill('dimgray'); textSize(N ? 13 : 15);
  text('Real value can be ' + fmt(lo) + ' to ' + fmt(hi) + ' ohms', cx, y);
}

// Example table: click a row to load that resistor
function drawExamples(N) {
  const x = 10, w = canvasWidth - 20;
  let y = N ? 163 : 206;
  const rowH = N ? 23 : 27;
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(N ? 13 : 14); textStyle(BOLD);
  text('Example resistors (click a row to load it)', x, y);
  textStyle(NORMAL);
  y += N ? 18 : 22;
  rowBoxes = [];
  const c = current();
  EXAMPLES.forEach((ex, i) => {
    const active = ex.stripes.every((s, k) => s === stripeSelects[k].value());
    const hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + rowH - 2;
    stroke(active ? 'navy' : 'lightsteelblue'); strokeWeight(active ? 2 : 1);
    fill(hover ? 'lavender' : 'white');
    rect(x, y, w, rowH - 3, 5);
    // four color chips
    for (let k = 0; k < 4; k++) {
      const table = k < 2 ? DIGITS : (k === 2 ? MULTS : TOLS);
      const chip = table.find(t => t.name === ex.stripes[k]);
      stroke('dimgray'); strokeWeight(1); fill(chip.css);
      rect(x + 8 + k * 14, y + 4, 11, rowH - 11, 2);
    }
    const val = exampleValue(ex);
    noStroke(); fill('black'); textSize(N ? 12 : 14); textAlign(LEFT, CENTER);
    const label = N ? ex.use + ': ' + fmt(val) + ' ohms'
      : ex.use + ': ' + fmt(val) + ' ohms (' + ex.stripes.join(', ') + ')';
    text(label, x + 70, y + (rowH - 3) / 2);
    rowBoxes.push({ x: x, y: y, w: w, h: rowH - 3, stripes: ex.stripes });
    y += rowH;
  });
}

function exampleValue(ex) {
  const d1 = DIGITS.find(c => c.name === ex.stripes[0]).digit;
  const d2 = DIGITS.find(c => c.name === ex.stripes[1]).digit;
  const m = MULTS.find(c => c.name === ex.stripes[2]).mult;
  return roundTiny((10 * d1 + d2) * m);
}

function mousePressed() {
  for (const r of rowBoxes) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      setStripes(r.stripes);
      quizMode = false; updateReveal();
      message = '';
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
  if (typeof revealButton !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
