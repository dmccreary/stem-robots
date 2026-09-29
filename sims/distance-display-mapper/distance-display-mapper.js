// Distance to Display Mapper
// CANVAS_HEIGHT: 420
// Bloom L3 (Apply): predict the OLED bar height and NeoPixel status color for any
// distance, and explain why min(bar_height, 50) and the 50 cm / 20 cm
// thresholds are in the code. One distance feeds draw_distance_bar(),
// draw_meter(), and set_status_color() from Chapter 9.

let canvasWidth = 700;
let drawHeight = 305;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

const W = 128, H = 64;   // SSD1306 pixels

// 8x8 glyphs (public-domain font8x8_basic, least significant bit = left pixel)
const FONT = {
  '0': [0x3E, 0x63, 0x73, 0x7B, 0x6F, 0x67, 0x3E, 0x00], '1': [0x0C, 0x0E, 0x0C, 0x0C, 0x0C, 0x0C, 0x3F, 0x00],
  '2': [0x1E, 0x33, 0x30, 0x1C, 0x06, 0x33, 0x3F, 0x00], '3': [0x1E, 0x33, 0x30, 0x1C, 0x30, 0x33, 0x1E, 0x00],
  '4': [0x38, 0x3C, 0x36, 0x33, 0x7F, 0x30, 0x78, 0x00], '5': [0x3F, 0x03, 0x1F, 0x30, 0x30, 0x33, 0x1E, 0x00],
  '6': [0x1C, 0x06, 0x03, 0x1F, 0x33, 0x33, 0x1E, 0x00], '7': [0x3F, 0x33, 0x30, 0x18, 0x0C, 0x0C, 0x0C, 0x00],
  '8': [0x1E, 0x33, 0x33, 0x1E, 0x33, 0x33, 0x1E, 0x00], '9': [0x1E, 0x33, 0x33, 0x3E, 0x30, 0x18, 0x0E, 0x00],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0C, 0x0C, 0x00],
  'c': [0x00, 0x00, 0x1E, 0x33, 0x03, 0x33, 0x1E, 0x00], 'm': [0x00, 0x00, 0x33, 0x7F, 0x7F, 0x6B, 0x63, 0x00],
  'D': [0x1F, 0x36, 0x66, 0x66, 0x66, 0x36, 0x1F, 0x00], 'i': [0x0C, 0x00, 0x0E, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],
  's': [0x00, 0x00, 0x3E, 0x03, 0x1E, 0x30, 0x1F, 0x00], 't': [0x08, 0x0C, 0x3E, 0x0C, 0x0C, 0x2C, 0x18, 0x00],
  'a': [0x00, 0x00, 0x1E, 0x30, 0x3E, 0x33, 0x6E, 0x00], 'n': [0x00, 0x00, 0x1F, 0x33, 0x33, 0x33, 0x33, 0x00],
  'e': [0x00, 0x00, 0x1E, 0x33, 0x3F, 0x03, 0x1E, 0x00],
  'I': [0x1E, 0x0C, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00], 'S': [0x1E, 0x33, 0x07, 0x0E, 0x38, 0x33, 0x1E, 0x00],
  'T': [0x3F, 0x2D, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00], 'A': [0x0C, 0x1E, 0x33, 0x33, 0x3F, 0x33, 0x33, 0x00],
  'N': [0x63, 0x67, 0x6F, 0x7B, 0x73, 0x63, 0x63, 0x00], 'C': [0x3C, 0x66, 0x03, 0x03, 0x03, 0x66, 0x3C, 0x00],
  'E': [0x7F, 0x46, 0x16, 0x1E, 0x16, 0x46, 0x7F, 0x00]
};

// controls
let sweepButton, clampBox, distSlider, maxSlider;

// state
let sweeping = false, sweepDir = -1, sweepPos = 100, lastT = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  sweepButton = createButton('Sweep');
  sweepButton.parent(document.querySelector('main'));
  sweepButton.mousePressed(toggleSweep);

  clampBox = createCheckbox(' Use min(bar_height, 50) clamp', true);
  clampBox.parent(document.querySelector('main'));
  clampBox.style('white-space', 'nowrap');

  distSlider = createSlider(0, 300, 100, 1);
  distSlider.parent(document.querySelector('main'));
  distSlider.input(() => { if (sweeping) toggleSweep(); });
  maxSlider = createSlider(100, 300, 200, 10);
  maxSlider.parent(document.querySelector('main'));

  positionControls();

  describe('Three views of one distance reading. Left: a 128 by 64 pixel OLED bar chart drawn like draw_distance_bar, with a bar whose height is distance divided by max_cm times 50. Middle: an OLED meter drawn like draw_meter with the distance to one decimal. Right: a NeoPixel colored green above 50 centimeters, yellow from 20 to 50, and red below 20, with a small zone scale. A formula box shows the bar height math and the status color decision. Sliders set the distance and max_cm, a checkbox turns the clamp on or off, and a Sweep button moves the distance.', LABEL);
}

function positionControls() {
  sweepButton.position(10, drawHeight + 8);
  const span = clampBox.elt.querySelector('span');
  if (span) span.innerHTML = canvasWidth < 440 ? ' min(..., 50) clamp' : ' Use min(bar_height, 50) clamp';
  clampBox.position(24 + sweepButton.elt.offsetWidth, drawHeight + 10);
  const w = canvasWidth - sliderLeftMargin - margin;
  distSlider.position(sliderLeftMargin, drawHeight + 44); distSlider.size(w);
  maxSlider.position(sliderLeftMargin, drawHeight + 79);  maxSlider.size(w);
}

function toggleSweep() {
  sweeping = !sweeping;
  sweepButton.html(sweeping ? 'Stop' : 'Sweep');
  sweepPos = distSlider.value();
  lastT = millis();
  positionControls();
}

// like a wall getting closer, then farther: 300 -> 0 -> 300 at 60 cm per second
function updateSweep() {
  if (!sweeping) return;
  const dt = (millis() - lastT) / 1000;
  lastT = millis();
  sweepPos += sweepDir * 60 * dt;
  if (sweepPos <= 0) { sweepPos = 0; sweepDir = 1; }
  if (sweepPos >= 300) { sweepPos = 300; sweepDir = -1; }
  distSlider.value(Math.round(sweepPos));
}

// ---------- the chapter's code, as JavaScript ----------

function barHeightRaw(d, maxCm) { return Math.trunc(d / maxCm * 50); }    // int(distance_cm / max_cm * 50)
function barHeight(d, maxCm) {
  const bh = barHeightRaw(d, maxCm);
  return clampBox.checked() ? Math.min(bh, 50) : bh;                     // min(bar_height, 50)
}
function statusColor(d) {
  if (d > 50) return { c: [0, 255, 0], name: 'green', why: d + ' > 50' };
  if (d > 20) return { c: [255, 200, 0], name: 'yellow', why: d + ' > 20' };
  return { c: [255, 0, 0], name: 'red', why: d + ' <= 20' };
}

// a tiny 1-bit framebuffer with the drawing calls the code uses
function makeFB() { return new Uint8Array(W * H); }
function px(fb, x, y) { if (x >= 0 && x < W && y >= 0 && y < H) fb[y * W + x] = 1; }
function fbText(fb, s, x, y) {
  for (let k = 0; k < s.length; k++) {
    const g = FONT[s[k]];
    if (!g) continue;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (g[r] & (1 << c)) px(fb, x + k * 8 + c, y + r);
  }
}
function fbFillRect(fb, x, y, w, h) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(fb, i, j);   // off-screen pixels are clipped
}
function fbHLine(fb, x0, x1, y) { for (let i = x0; i <= x1; i++) px(fb, i, y); }

// ---------- layout ----------

function layout() {
  if (canvasWidth >= 560) {
    const s = min(2, (canvasWidth - 20 - 24 - 130) / (2 * W));
    const pw = W * s;
    return { narrow: false, s, bar: { x: 10, y: 66 }, meter: { x: 10 + pw + 12, y: 66 },
             np: { x: 10 + 2 * pw + 24, y: 66, w: canvasWidth - 20 - 2 * pw - 24, h: H * s },
             formulaY: 66 + H * s + 16 };
  }
  const s = (canvasWidth - 30) / (2 * W);
  const pw = W * s;
  return { narrow: true, s, bar: { x: 10, y: 58 }, meter: { x: 20 + pw, y: 58 },
           np: { x: 10, y: 58 + H * s + 8, w: canvasWidth - 20, h: 56 },
           formulaY: 58 + H * s + 72 };
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  updateSweep();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const d = distSlider.value(), maxCm = maxSlider.value();
  const L = layout();

  drawBarPanel(L, d, maxCm);
  drawMeterPanel(L, d);
  drawNeoPixel(L, d);
  drawFormula(L, d, maxCm);

  noStroke(); fill('black'); textSize(L.narrow ? 18 : 22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Distance to Display Mapper', 10, 8);
  textStyle(NORMAL);
  drawControlLabels(d, maxCm);
}

function drawOLED(fb, x, y, s, title, narrow, alignRight) {
  noStroke(); fill('black'); textSize(narrow ? 12 : 14); textStyle(BOLD);
  textAlign(alignRight ? RIGHT : LEFT, BOTTOM);
  text(title, alignRight ? x + W * s : x, y - 4);
  textStyle(NORMAL);
  stroke('dimgray'); strokeWeight(2); fill('black');
  rect(x - 2, y - 2, W * s + 4, H * s + 4, 3);
  noStroke(); fill('white');
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (fb[j * W + i]) rect(x + i * s, y + j * s, s, s);
}

// draw_distance_bar(): fill_rect(20, 63 - bar_height, 20, bar_height, 1)
function drawBarPanel(L, d, maxCm) {
  const fb = makeFB();
  const bh = barHeight(d, maxCm);
  fbFillRect(fb, 20, 63 - bh, 20, bh);
  fbText(fb, d.toFixed(0) + 'cm', 45, 28);
  fbText(fb, 'Distance', 0, 0);
  const { x, y } = L.bar, s = L.s;
  const over = bh > 63;
  drawOLED(fb, x, y, s, 'OLED bar chart', L.narrow, over);   // title moves right to make room

  // dashed line: the 50-pixel maximum (y = 13)
  stroke('deepskyblue'); strokeWeight(1.5);
  drawingContext.setLineDash([4, 3]);
  line(x, y + 13 * s, x + W * s, y + 13 * s);
  drawingContext.setLineDash([]);
  noStroke(); fill('deepskyblue'); textSize(12); textAlign(RIGHT, BOTTOM);
  text('50 px max', x + W * s - 3, y + 13 * s - 2);

  // a bar taller than 63 pixels leaves the screen: a red stub pokes out of the top
  if (over) {
    noStroke(); fill('crimson');
    rect(x + 20 * s, y - 16, 20 * s, 14);
    triangle(x + 20 * s - 3, y - 16, x + 40 * s + 3, y - 16, x + 30 * s, y - 24);
    textSize(L.narrow ? 11 : 13); textStyle(BOLD); textAlign(RIGHT, BOTTOM);
    text('Bar leaves the screen!', x + W * s - 4, y + H * s - 4);
    textStyle(NORMAL);
  }
}

// draw_meter(): "DISTANCE" at (20, 0), value at (30, 28), "cm" at (90, 28), line at y = 20
function drawMeterPanel(L, d) {
  const fb = makeFB();
  fbText(fb, 'DISTANCE', 20, 0);
  fbText(fb, d.toFixed(1), 30, 28);
  fbText(fb, 'cm', 90, 28);
  fbHLine(fb, 0, 127, 20);
  drawOLED(fb, L.meter.x, L.meter.y, L.s, 'OLED meter', L.narrow);
}

// set_status_color(): one NeoPixel plus a small scale of the color zones
function drawNeoPixel(L, d) {
  const st = statusColor(d);
  const { x, y, w, h } = L.np;
  noStroke(); fill('black'); textSize(L.narrow ? 12 : 14); textStyle(BOLD); textAlign(LEFT, BOTTOM);
  if (!L.narrow) text('NeoPixel status', x, y - 4);
  textStyle(NORMAL);
  stroke('dimgray'); strokeWeight(1); fill('darkslategray');
  rect(x, y, w, h, 6);

  const zoneMax = 100;   // the scale shows 0 to 100 cm; farther readings sit at the top
  const zones = [{ lo: 0, hi: 20, col: 'red' }, { lo: 20, hi: 50, col: 'gold' }, { lo: 50, hi: 100, col: 'limegreen' }];
  if (!L.narrow) {
    // LED on the left, a tall zone scale on the right
    const r = 26, cx = x + 12 + r, cy = y + h / 2 - 10;
    glowLED(cx, cy, r, st.c);
    noStroke(); fill('white'); textSize(12); textAlign(CENTER, TOP);
    text('np[0]:', cx, cy + r + 8);
    text(st.name, cx, cy + r + 22);
    const sx = x + w - 40, sTop = y + 14, sBot = y + h - 12;
    const Y = cm => map(min(cm, zoneMax), 0, zoneMax, sBot, sTop);
    for (const z of zones) { fill(z.col); noStroke(); rect(sx, Y(z.hi), 14, Y(z.lo) - Y(z.hi)); }
    fill('white'); textSize(12); textAlign(RIGHT, CENTER);
    text('100+', sx - 3, Y(100)); text('50', sx - 3, Y(50)); text('20', sx - 3, Y(20)); text('0', sx - 3, Y(0));
    fill('white'); stroke('black'); strokeWeight(1);
    const my = Y(d);
    triangle(sx + 16, my, sx + 25, my - 6, sx + 25, my + 6);          // marker for this distance
    noStroke(); fill('lightgray'); textSize(12); textAlign(LEFT, CENTER);
    text('cm', sx + 18, sBot);
  } else {
    // narrow: LED on the left, horizontal scale on the right
    const cx = x + 36, cy = y + h / 2;
    glowLED(cx, cy, 20, st.c);
    const sL = x + 80, sR = x + w - 14, sy = y + 22;
    const X = cm => map(min(cm, zoneMax), 0, zoneMax, sL, sR);
    for (const z of zones) { fill(z.col); noStroke(); rect(X(z.lo), sy, X(z.hi) - X(z.lo), 12); }
    fill('white'); textSize(12); textAlign(CENTER, TOP);
    text('0', X(0), sy + 15); text('20', X(20), sy + 15); text('50', X(50), sy + 15); text('100+', X(100) - 8, sy + 15);
    text('np[0]: ' + st.name, (sL + sR) / 2, y + 4);
    stroke('black'); strokeWeight(1); fill('white');
    const mx = X(d);
    triangle(mx, sy - 1, mx - 5, sy - 9, mx + 5, sy - 9);
  }
}

function glowLED(cx, cy, r, c) {
  push();                                   // push/pop keeps p5's cached styles in sync
  drawingContext.shadowColor = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  drawingContext.shadowBlur = 30;
  stroke('white'); strokeWeight(2); fill(c[0], c[1], c[2]);
  circle(cx, cy, 2 * r);
  pop();
}

function drawFormula(L, d, maxCm) {
  const y = L.formulaY, w = canvasWidth - 20;
  const raw = barHeightRaw(d, maxCm), bh = barHeight(d, maxCm);
  const st = statusColor(d);
  const lines = [
    { t: 'bar_height = int(' + d + ' / ' + maxCm + ' * 50) = ' + raw, col: 'black' },
    clampBox.checked()
      ? { t: 'bar_height = min(' + raw + ', 50) = ' + bh, col: 'black' }
      : { t: raw > 50 ? 'no clamp: ' + raw + ' px is taller than the 50 px bar area!' : 'no clamp: bar_height stays ' + raw,
          col: raw > 50 ? 'crimson' : 'dimgray' },
    { t: 'set_status_color(' + d + '): ' + st.why + ', so ' + st.name + ' (' + st.c.join(', ') + ')', col: 'navy' }
  ];
  textFont('monospace');
  let fs = L.narrow ? 12 : 15;
  textSize(fs);
  while (fs > 9 && max(...lines.map(l => textWidth(l.t))) > w - 20) { fs--; textSize(fs); }
  const lh = fs + 8;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(10, y, w, lines.length * lh + 10, 6);
  noStroke(); textAlign(LEFT, TOP);
  lines.forEach((l, i) => { fill(l.col); text(l.t, 20, y + 7 + i * lh); });
  textFont('sans-serif');
}

function drawControlLabels(d, maxCm) {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Distance: ' + d + ' cm' + (d > maxCm ? ' (beyond)' : ''), 10, drawHeight + 54);
  text('max_cm: ' + maxCm, 10, drawHeight + 89);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof maxSlider !== 'undefined') {
    const w = canvasWidth - sliderLeftMargin - margin;
    distSlider.size(w); maxSlider.size(w);
  }
}
