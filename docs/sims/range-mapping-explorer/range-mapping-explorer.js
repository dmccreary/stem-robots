// Range Mapping Explorer
// CANVAS_HEIGHT: 450
// Bloom L3 (Apply): pick an input range and an output range, move x, and
// predict the mapped value with
//   out_min + (x - in_min) / (in_max - in_min) * (out_max - out_min)
// The two number lines are drawn so the ranges line up: x and the result sit
// the same fraction of the way along their own ranges.

let canvasWidth = 700;
let drawHeight = 300;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

const PRESETS = {
  'Servo angle to duty':        { inMin: 0, inMax: 180, outMin: 3276, outMax: 6553, inName: 'servo angle (degrees)', outName: 'duty_u16 value' },
  'ToF distance to bar height': { inMin: 0, inMax: 200, outMin: 0, outMax: 50, inName: 'distance (cm)', outName: 'bar height (pixels)' },
  'Pot to speed':               { inMin: 0, inMax: 65535, outMin: 0, outMax: 100, inName: 'pot reading', outName: 'speed (percent)' },
  'Custom':                     { inName: 'your input', outName: 'your output' }
};
const PAD = 0.25;   // number lines and the slider reach 25% past each end of the range

// layout (y values in the drawing region)
const IN_Y = 82, OUT_Y = 168, FORMULA_TOP = 222;

// controls
let presetSelect, inMinBox, inMaxBox, outMinBox, outMaxBox;
let clampBox, roundBox, xSlider;
let names = PRESETS['Servo angle to duty'];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  presetSelect = createSelect();
  presetSelect.parent(document.querySelector('main'));
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('Servo angle to duty');
  presetSelect.changed(applyPreset);

  inMinBox = makeBox(); inMaxBox = makeBox();
  outMinBox = makeBox(); outMaxBox = makeBox();

  clampBox = createCheckbox(' Clamp output', false);
  clampBox.parent(document.querySelector('main'));
  roundBox = createCheckbox(' Round to integer', true);
  roundBox.parent(document.querySelector('main'));

  xSlider = createSlider(-45, 225, 90, 1);
  xSlider.parent(document.querySelector('main'));

  applyPreset();
  positionControls();

  describe('Two parallel number lines. The top line is the input range with a blue marker at the input value x. The bottom line is the output range with an orange marker at the mapped value. Gray lines join the ends of the two ranges, and a dashed line joins the two markers. A formula box fills in the real numbers of out_min plus (x minus in_min) divided by (in_max minus in_min) times (out_max minus out_min). A preset menu, four range boxes, clamp and round checkboxes, and an input slider are below.', LABEL);
}

function makeBox() {
  const b = createInput('0', 'number');
  b.parent(document.querySelector('main'));
  b.input(rangesChanged);
  return b;
}

function positionControls() {
  const narrow = canvasWidth < 520;
  const boxW = narrow ? 62 : 80;
  const bx = 118;
  presetSelect.position(76, drawHeight + 9);

  inMinBox.position(bx, drawHeight + 44);   inMinBox.size(boxW);
  inMaxBox.position(bx + boxW + 34, drawHeight + 44);  inMaxBox.size(boxW);
  outMinBox.position(bx, drawHeight + 79);  outMinBox.size(boxW);
  outMaxBox.position(bx + boxW + 34, drawHeight + 79); outMaxBox.size(boxW);
  toX = bx + boxW + 10;

  // short checkbox labels when the canvas is narrow, so they stay on one line
  setBoxLabel(clampBox, narrow ? ' Clamp' : ' Clamp output');
  setBoxLabel(roundBox, narrow ? ' Round' : ' Round to integer');
  const cx = bx + 2 * boxW + 34 + (narrow ? 16 : 30) + 10;
  clampBox.position(cx, drawHeight + 45);
  roundBox.position(cx, drawHeight + 80);

  xSlider.position(sliderLeftMargin, drawHeight + 115);
  xSlider.size(canvasWidth - sliderLeftMargin - margin);
}
let toX = 208;

function setBoxLabel(box, label) {
  box.style('white-space', 'nowrap');
  const span = box.elt.querySelector('span');
  if (span) span.innerHTML = label;
}

// ---------- ranges and the slider ----------

function applyPreset() {
  const p = PRESETS[presetSelect.value()];
  names = p;
  const custom = presetSelect.value() === 'Custom';
  if (!custom) {
    inMinBox.value(p.inMin); inMaxBox.value(p.inMax);
    outMinBox.value(p.outMin); outMaxBox.value(p.outMax);
  }
  // the boxes can only be edited in Custom mode
  for (const b of [inMinBox, inMaxBox, outMinBox, outMaxBox]) b.elt.disabled = !custom;
  updateSliderRange(true);
}

function rangesChanged() {
  updateSliderRange(false);
}

function readRanges() {
  const r = {
    inMin: parseFloat(inMinBox.value()), inMax: parseFloat(inMaxBox.value()),
    outMin: parseFloat(outMinBox.value()), outMax: parseFloat(outMaxBox.value())
  };
  r.ok = [r.inMin, r.inMax, r.outMin, r.outMax].every(v => isFinite(v));
  return r;
}

function updateSliderRange(toMiddle) {
  const r = readRanges();
  if (!r.ok) return;
  const lo = min(r.inMin, r.inMax), hi = max(r.inMin, r.inMax);
  const span = max(hi - lo, 1e-9);
  const step = span >= 10 ? 1 : Math.pow(10, Math.floor(Math.log10(span)) - 2);
  // line the slider ends up with the step so x never gets odd fractions
  const sMin = Math.floor((lo - PAD * span) / step) * step;
  const sMax = Math.ceil((hi + PAD * span) / step) * step;
  const old = xSlider.value();
  xSlider.elt.min = sMin;
  xSlider.elt.max = sMax;
  xSlider.elt.step = step;
  const mid = Math.round(((lo + hi) / 2) / step) * step;
  xSlider.value(toMiddle || old < sMin || old > sMax ? mid : old);
}

// ---------- the math ----------

function mapValue(r, x) {
  const t = (x - r.inMin) / (r.inMax - r.inMin);     // fraction of the way along the input
  const raw = r.outMin + t * (r.outMax - r.outMin);
  let v = raw;
  const oLo = min(r.outMin, r.outMax), oHi = max(r.outMin, r.outMax);
  const outside = raw < oLo - 1e-9 || raw > oHi + 1e-9;
  if (clampBox.checked()) v = constrain(v, oLo, oHi);  // like min(max(v, lo), hi)
  if (roundBox.checked()) v = Math.trunc(v);          // like Python's int(): drops the decimals
  return { t, raw, v, outside };
}

function fmt(v) {
  if (Number.isInteger(v)) return String(v);
  return String(parseFloat(v.toFixed(2)));
}
function paren(v) { return v < 0 ? '(' + fmt(v) + ')' : fmt(v); }

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Range Mapping Explorer', 10, 8);
  textStyle(NORMAL);

  const r = readRanges();
  const x = xSlider.value();
  if (!r.ok) {
    message('Type a number in every range box.', 'crimson');
  } else if (r.inMax === r.inMin) {
    drawLines(r, x, null);
    message('Input range cannot be zero (in_min equals in_max).', 'crimson');
  } else {
    const m = mapValue(r, x);
    drawLines(r, x, m);
    drawFormula(r, x, m);
  }
  drawControlLabels(x);
}

function message(s, col) {
  noStroke(); fill(col); textSize(17); textStyle(BOLD); textAlign(CENTER, CENTER);
  text(s, canvasWidth / 2, FORMULA_TOP + 36);
  textStyle(NORMAL);
}

// padded axis: value -> screen x, so each range fills the same middle part of its line
function axisMap(a, b, v) {
  const lo = min(a, b), hi = max(a, b);
  const span = hi - lo === 0 ? 1 : hi - lo;
  const x0 = 50, x1 = canvasWidth - 50;
  return map(v, lo - PAD * span, hi + PAD * span, x0, x1);
}

function drawAxis(y, a, b, nameA, nameB) {
  const x0 = 50, x1 = canvasWidth - 50;
  stroke('silver'); strokeWeight(2);
  line(x0, y, x1, y);                                   // the padded number line
  stroke('dimgray'); strokeWeight(6);
  line(axisMap(a, b, a), y, axisMap(a, b, b), y);       // the range itself
  strokeWeight(2);
  for (const [v, nm] of [[a, nameA], [b, nameB]]) {
    const tx = axisMap(a, b, v);
    stroke('dimgray'); line(tx, y - 9, tx, y + 9);
    noStroke(); fill('black'); textSize(14); textAlign(CENTER, TOP);
    text(nm + ' = ' + fmt(v), tx, y + 11);
  }
}

function drawLines(r, x, m) {
  // thin gray lines join in_min to out_min and in_max to out_max
  stroke('silver'); strokeWeight(1.5);
  line(axisMap(r.inMin, r.inMax, r.inMin), IN_Y, axisMap(r.outMin, r.outMax, r.outMin), OUT_Y);
  line(axisMap(r.inMin, r.inMax, r.inMax), IN_Y, axisMap(r.outMin, r.outMax, r.outMax), OUT_Y);

  // labels for the two lines, on a backing so the gray lines do not cross them
  textSize(15); textStyle(BOLD); textAlign(LEFT, TOP);
  for (const [s, y] of [['Input x: ' + names.inName, 40], ['Output: ' + names.outName, 124]]) {
    noStroke(); fill('aliceblue');
    rect(6, y - 2, textWidth(s) + 8, 20);
    fill('black');
    text(s, 10, y);
  }
  textStyle(NORMAL);

  drawAxis(IN_Y, r.inMin, r.inMax, 'in_min', 'in_max');
  drawAxis(OUT_Y, r.outMin, r.outMax, 'out_min', 'out_max');
  if (!m) return;

  const xs = axisMap(r.inMin, r.inMax, x);
  const ms = axisMap(r.outMin, r.outMax, m.v);

  // dashed line joins the two markers
  stroke('gray'); strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(xs, IN_Y, ms, OUT_Y);
  drawingContext.setLineDash([]);

  // input marker (blue)
  stroke('white'); strokeWeight(2); fill('royalblue');
  circle(xs, IN_Y, 18);
  noStroke(); fill('royalblue'); textSize(15); textStyle(BOLD); textAlign(CENTER, BOTTOM);
  text('x = ' + fmt(x), constrain(xs, 40, canvasWidth - 40), IN_Y - 11);

  // output marker (orange, red when the result is outside the output range)
  const bad = m.outside && !clampBox.checked();
  stroke('white'); strokeWeight(2); fill(bad ? 'crimson' : 'darkorange');
  circle(ms, OUT_Y, 18);
  // result label on a small backing so the dashed line does not run through it
  const lbl = fmt(m.v), lx = constrain(ms, 40, canvasWidth - 40);
  noStroke(); fill('aliceblue');
  rect(lx - textWidth(lbl) / 2 - 3, OUT_Y - 29, textWidth(lbl) + 6, 18);
  fill(bad ? 'crimson' : 'chocolate'); textAlign(CENTER, BOTTOM);
  text(lbl, lx, OUT_Y - 11);
  textStyle(NORMAL);
  if (bad) {
    fill('crimson'); textSize(14); textStyle(BOLD); textAlign(CENTER, TOP);
    text('Outside range - clamp it!', constrain(ms, 100, canvasWidth - 100), OUT_Y + 29);
    textStyle(NORMAL);
  }
}

function drawFormula(r, x, m) {
  const w = canvasWidth - 20;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(10, FORMULA_TOP, w, 74, 6);

  const line1 = paren(r.outMin) + ' + (' + fmt(x) + ' - ' + paren(r.inMin) + ') / (' +
    fmt(r.inMax) + ' - ' + paren(r.inMin) + ') * (' + fmt(r.outMax) + ' - ' + paren(r.outMin) + ')';
  let line2 = '= ' + fmt(m.raw);
  if (clampBox.checked() && m.outside) {
    line2 += '   clamp -> ' + fmt(constrain(m.raw, min(r.outMin, r.outMax), max(r.outMin, r.outMax)));
  }
  if (roundBox.checked()) line2 += '   int() -> ' + fmt(m.v);

  // shrink the monospace text until the longest line fits the box
  textFont('monospace');
  let fs = 15;
  textSize(fs);
  while (fs > 10 && max(textWidth(line1), textWidth(line2)) > w - 20) { fs--; textSize(fs); }
  noStroke(); fill('black'); textAlign(LEFT, TOP);
  text(line1, 20, FORMULA_TOP + 7);
  fill('chocolate'); textStyle(BOLD);
  text(line2, 20, FORMULA_TOP + 9 + fs + 4);
  textStyle(NORMAL);
  textFont('sans-serif');

  // the same-fraction idea in words
  const pct = (m.t * 100).toFixed(1) + '%';
  fill('dimgray'); textSize(canvasWidth < 560 ? 12 : 14);
  const words = canvasWidth < 700
    ? 'x is ' + pct + ' along the input range, so the result is ' + pct + ' along the output range.'
    : 'x is ' + pct + ' of the way from in_min to in_max, so the result is ' + pct +
      ' of the way from out_min to out_max.';
  text(words, 20, FORMULA_TOP + (canvasWidth < 520 ? 40 : 50), w - 20);
}

function drawControlLabels(x) {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Preset:', 10, drawHeight + 20);
  text('Input range:', 10, drawHeight + 55);
  text('Output range:', 10, drawHeight + 90);
  text('to', toX, drawHeight + 55);
  text('to', toX, drawHeight + 90);
  text('Input x: ' + fmt(x), 10, drawHeight + 125);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof xSlider !== 'undefined') xSlider.size(canvasWidth - sliderLeftMargin - margin);
}
