// NeoPixel RGB Color Mixer
// CANVAS_HEIGHT: 505
// Bloom L3 (Apply): choose R, G, and B values from 0 to 255 to make a target
// color on the robot's two NeoPixels (GPIO 18), and write the matching
// np[0] = (r, g, b) line.
// Adapted from learning-micropython/neopixel-color-mixer (same author).

let canvasWidth = 700;
let drawHeight = 250;
let controlHeight = 255;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// the color table from Chapter 9
const TABLE = [
  { n: 'Red', c: [255, 0, 0] }, { n: 'Green', c: [0, 255, 0] }, { n: 'Blue', c: [0, 0, 255] },
  { n: 'Yellow', c: [255, 200, 0] }, { n: 'White', c: [255, 255, 255] },
  { n: 'Orange', c: [255, 80, 0] }, { n: 'Off', c: [0, 0, 0] }
];
// status colors used by set_status_color()
const STATUS = [
  { n: 'Clear', c: [0, 255, 0], bg: 'palegreen' },
  { n: 'Caution', c: [255, 200, 0], bg: 'khaki' },
  { n: 'Stop', c: [255, 0, 0], bg: 'lightcoral' },
  { n: 'Standby', c: [0, 0, 255], bg: 'lightblue' }
];

// controls
let sliders = [], boxes = [], brightSlider, editRadio, presetButtons = [], statusButtons = [];

// each LED keeps its own color (before brightness)
let leds = [[255, 80, 0], [255, 80, 0]];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const tints = ['red', 'green', 'blue'];
  for (let i = 0; i < 3; i++) {
    const s = createSlider(0, 255, leds[0][i], 1);
    s.parent(document.querySelector('main'));
    s.style('accent-color', tints[i]);
    s.input(() => setChannel(i, s.value()));
    sliders.push(s);
    const b = createInput(String(leds[0][i]), 'number');
    b.parent(document.querySelector('main'));
    b.attribute('min', 0); b.attribute('max', 255);
    b.size(56);
    b.input(() => {
      const v = parseInt(b.value(), 10);
      if (!isNaN(v)) setChannel(i, constrain(v, 0, 255), true);
    });
    boxes.push(b);
  }

  brightSlider = createSlider(0, 100, 100, 5);
  brightSlider.parent(document.querySelector('main'));

  editRadio = createRadio();
  editRadio.parent(document.querySelector('main'));
  ['LED 0', 'LED 1', 'Both'].forEach(o => editRadio.option(o));
  editRadio.selected('Both');
  editRadio.style('white-space', 'nowrap');
  // a little space between the radio choices
  editRadio.elt.querySelectorAll('label').forEach(l => { l.style.marginRight = '14px'; });
  editRadio.changed(editChanged);

  for (const p of TABLE) {
    const b = createButton(p.n);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => applyColor(p.c));
    presetButtons.push(b);
  }
  for (const p of STATUS) {
    const b = createButton(p.n);
    b.parent(document.querySelector('main'));
    b.style('background-color', p.bg);
    b.mousePressed(() => applyColor(p.c));
    statusButtons.push(b);
  }

  positionControls();

  describe('Two large round NeoPixel LEDs labeled np[0] and np[1] on a dark circuit board glow with the mixed color. Beside them are a solid color swatch, the closest color name from the chapter table, and a MicroPython code box with np[0] = (r, g, b) and np.write(). Below are red, green, and blue sliders with number boxes, a brightness slider, a choice of which LED to edit, color preset buttons, and traffic-light status buttons.', LABEL);
}

function positionControls() {
  const sw = canvasWidth - sliderLeftMargin - 90;
  for (let i = 0; i < 3; i++) {
    sliders[i].position(sliderLeftMargin, drawHeight + 8 + i * 35);
    sliders[i].size(sw);
    boxes[i].position(canvasWidth - 76, drawHeight + 6 + i * 35);
  }
  brightSlider.position(sliderLeftMargin, drawHeight + 113);
  brightSlider.size(canvasWidth - sliderLeftMargin - margin);
  editRadio.position(60, drawHeight + 146);

  const small = canvasWidth < 480;
  let x = 10;
  for (const b of presetButtons) {
    b.style('font-size', small ? '12px' : '13px');
    b.position(x, drawHeight + 181);
    x += b.elt.offsetWidth + (small ? 3 : 6);
  }
  x = 72;
  for (const b of statusButtons) {
    b.style('font-size', small ? '12px' : '13px');
    b.position(x, drawHeight + 216);
    x += b.elt.offsetWidth + (small ? 3 : 6);
  }
}

// ---------- color state ----------

function editedLeds() {
  const e = editRadio.value();
  return e === 'LED 0' ? [0] : e === 'LED 1' ? [1] : [0, 1];
}

function setChannel(i, v, fromBox) {
  for (const k of editedLeds()) leds[k][i] = v;
  sliders[i].value(v);
  if (!fromBox) boxes[i].value(v);
}

function applyColor(c) {
  for (const k of editedLeds()) leds[k] = c.slice();
  syncControls();
}

// show the edited LED's color on the sliders; "Both" copies the sliders to both LEDs
function editChanged() {
  if (editRadio.value() === 'Both') {
    leds[1] = [sliders[0].value(), sliders[1].value(), sliders[2].value()];
    leds[0] = leds[1].slice();
  }
  syncControls();
}

function syncControls() {
  const c = leds[editedLeds()[0]];
  for (let i = 0; i < 3; i++) { sliders[i].value(c[i]); boxes[i].value(c[i]); }
}

// brightness scales each channel; the code shows whole numbers, rounded down
function scaled(c) {
  const k = brightSlider.value() / 100;
  return c.map(v => Math.floor(v * k));
}

function closestName(c) {
  let best = null, bestD = Infinity;
  for (const t of TABLE) {
    const d = Math.hypot(c[0] - t.c[0], c[1] - t.c[1], c[2] - t.c[2]);
    if (d < bestD) { bestD = d; best = t.n; }
  }
  return bestD > 60 ? 'Custom color' : best;
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(canvasWidth < 480 ? 19 : 22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('NeoPixel RGB Color Mixer', 10, 8);
  textStyle(NORMAL);

  drawBoard();
  drawInfo();
  drawControlLabels();
}

function boardW() { return canvasWidth * 0.52; }

function drawBoard() {
  const w = boardW(), x = 10, y = 40, h = drawHeight - 50;
  stroke('black'); strokeWeight(1); fill('darkslategray');
  rect(x, y, w, h, 8);
  noStroke(); fill('lightgray'); textSize(12); textAlign(LEFT, TOP);
  text('Maker Pi RP2040 - NeoPixels on GPIO 18', x + 8, y + 6, w - 16);

  const r = min(w * 0.17, 52);
  const edited = editedLeds();
  for (let k = 0; k < 2; k++) {
    const cx = x + w * (k === 0 ? 0.28 : 0.72), cy = y + h * 0.52;
    const c = scaled(leds[k]);
    const lum = (c[0] + c[1] + c[2]) / 765;
    // glow: a soft halo that grows with brightness (push/pop keeps p5's styles in sync)
    push();
    if (lum > 0) {
      drawingContext.shadowColor = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      drawingContext.shadowBlur = 12 + 50 * lum;
    }
    fill(lum > 0 ? color(c[0], c[1], c[2]) : color('black'));
    stroke(lum > 0 ? 'white' : 'dimgray'); strokeWeight(2);
    circle(cx, cy, 2 * r);
    pop();
    if (lum === 0) {
      noStroke(); fill('gray'); textSize(15); textAlign(CENTER, CENTER);
      text('Off', cx, cy);
    }
    // a dashed ring marks the LED(s) the sliders are editing
    if (edited.includes(k)) {
      noFill(); stroke('white'); strokeWeight(1.5);
      drawingContext.setLineDash([4, 4]);
      circle(cx, cy, 2 * r + 14);
      drawingContext.setLineDash([]);
    }
    noStroke(); fill('white'); textSize(15); textStyle(BOLD); textAlign(CENTER, TOP);
    text('np[' + k + ']', cx, cy + r + 10);
    textStyle(NORMAL);
  }
}

function drawInfo() {
  const x = boardW() + 26, w = canvasWidth - x - 12;
  const narrow = canvasWidth < 560;
  const main = leds[editedLeds()[0]];
  const c = scaled(main);

  // solid swatch, no glow
  stroke('gray'); strokeWeight(1); fill(c[0], c[1], c[2]);
  rect(x, 42, w, 30, 4);
  noStroke(); fill('black'); textSize(narrow ? 13 : 15); textAlign(LEFT, TOP);
  const nm = closestName(main);
  const b = brightSlider.value();
  text('Closest name: ' + nm + (b < 100 && nm !== 'Custom color' ? ' at ' + b + '%' : ''), x, 80, w);

  // code box with the scaled values
  const lines = [];
  for (let k = 0; k < 2; k++) {
    const s = scaled(leds[k]);
    lines.push('np[' + k + '] = (' + s.join(', ') + ')');
  }
  lines.push('np.write()');
  textFont('monospace');
  let fs = narrow ? 12 : 15;
  textSize(fs);
  while (fs > 9 && textWidth(lines[0]) > w - 16) { fs--; textSize(fs); }
  const lh = fs + 6, by = narrow ? 118 : 108;
  stroke('silver'); fill('whitesmoke');
  rect(x, by, w, lines.length * lh + 12, 6);
  noStroke(); textAlign(LEFT, TOP);
  lines.forEach((s, i) => {
    const bold = i < 2 && editedLeds().includes(i);
    fill(bold ? 'navy' : 'dimgray');
    textStyle(bold ? BOLD : NORMAL);
    text(s, x + 8, by + 7 + i * lh);
  });
  textStyle(NORMAL);
  textFont('sans-serif');

  // tips
  const ty = by + lines.length * lh + 20;
  textSize(narrow ? 12 : 14);
  if (main[0] === 255 && main[1] === 255 && main[2] === 255) {
    fill('darkorange'); textStyle(BOLD);
    text('White uses all three channels. It draws the most current!', x, ty, w);
    textStyle(NORMAL);
  } else if (b < 100) {
    fill('dimgray');
    text('Brightness ' + b + '%: each value is multiplied by ' + (b / 100) + ' and rounded down.', x, ty, w);
  }
}

function drawControlLabels() {
  noStroke(); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  const c = leds[editedLeds()[0]];
  fill('darkred');   text('Red: ' + c[0], 10, drawHeight + 18);
  fill('darkgreen'); text('Green: ' + c[1], 10, drawHeight + 53);
  fill('darkblue');  text('Blue: ' + c[2], 10, drawHeight + 88);
  fill('black');
  text('Brightness: ' + brightSlider.value() + '%', 10, drawHeight + 123);
  text('Edit:', 10, drawHeight + 158);
  text('Status:', 10, drawHeight + 228);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof brightSlider !== 'undefined') {
    for (const s of sliders) s.size(canvasWidth - sliderLeftMargin - 90);
    brightSlider.size(canvasWidth - sliderLeftMargin - margin);
  }
}
