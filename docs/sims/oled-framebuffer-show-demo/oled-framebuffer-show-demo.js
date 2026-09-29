// OLED Framebuffer and show()
// CANVAS_HEIGHT: 500
// Bloom L2 (Understand - explain): drawing calls change only the framebuffer in
// memory; display.show() copies the whole framebuffer to the OLED screen in one
// step; display.fill(0) clears the framebuffer. Students run each call one at a
// time and predict what the screen shows when a step is left out.

let canvasWidth = 700;
let drawHeight = 385;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

const W = 128, H = 64;           // SSD1306 resolution
let fb = new Uint8Array(W * H);  // framebuffer (in memory)
let screen = new Uint8Array(W * H); // what the OLED shows

// 8x8 glyphs (public-domain font8x8_basic, least significant bit = left pixel)
const FONT = {
  'H': [0x33, 0x33, 0x33, 0x3F, 0x33, 0x33, 0x33, 0x00],
  'e': [0x00, 0x00, 0x1E, 0x33, 0x3F, 0x03, 0x1E, 0x00],
  'l': [0x0E, 0x0C, 0x0C, 0x0C, 0x0C, 0x0C, 0x1E, 0x00],
  'o': [0x00, 0x00, 0x1E, 0x33, 0x33, 0x33, 0x1E, 0x00],
  '!': [0x18, 0x3C, 0x3C, 0x18, 0x18, 0x00, 0x18, 0x00]
};

// the five steps from the chapter
const STEPS = [
  { code: 'display.fill(0)',                    run: () => fbFill(0) },
  { code: 'display.text("Hello!", 0, 0)',       run: () => fbText('Hello!', 0, 0) },
  { code: 'display.ellipse(64, 32, 20, 20, 1)', run: () => fbEllipse(64, 32, 20, 20) },
  { code: 'display.rect(10, 10, 50, 30, 1)',    run: () => fbRect(10, 10, 50, 30) },
  { code: 'display.show()',                     run: () => show() }
];
const STEP_LABELS = ['fill(0)', 'text()', 'ellipse()', 'rect()', 'show()'];

// controls
let stepButtons = [], runAllButton, resetButton, loopButton, skipBox;

// state
let lastStep = -1;          // index of the step that just ran (highlighted)
let queue = [], nextAt = 0; // "Run all in order"
let looping = false, loopX = 64, passes = 0, loopLine = -1;
let flashUntil = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  STEPS.forEach((s, i) => {
    const b = createButton((i + 1) + '. ' + STEP_LABELS[i]);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => { stopAll(); runStep(i); });
    stepButtons.push(b);
  });
  runAllButton = createButton('Run all in order');
  runAllButton.parent(document.querySelector('main'));
  runAllButton.mousePressed(runAll);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  loopButton = createButton('Loop mode: move the ellipse');
  loopButton.parent(document.querySelector('main'));
  loopButton.mousePressed(toggleLoop);

  skipBox = createCheckbox(' Skip fill(0) in loop mode', false);
  skipBox.parent(document.querySelector('main'));
  skipBox.style('white-space', 'nowrap');

  positionControls();

  describe('Two black 128 by 64 pixel panels side by side. The left panel is the framebuffer in memory and the right panel is the OLED screen. Buttons run display.fill, display.text, display.ellipse, display.rect, and display.show one at a time. Drawing calls change only the left panel; show copies it to the right panel, shown by a flashing arrow. A numbered code list highlights the step that just ran, and a status line says whether the screen matches the framebuffer. A loop mode moves the ellipse and can skip fill(0) to show a smeared trail.', LABEL);
}

function positionControls() {
  let x = 10;
  for (const b of stepButtons) {
    b.position(x, drawHeight + 8);
    x += b.elt.offsetWidth + 6;
  }
  runAllButton.position(10, drawHeight + 43);
  resetButton.position(20 + runAllButton.elt.offsetWidth, drawHeight + 43);
  loopButton.position(10, drawHeight + 78);
  const span = skipBox.elt.querySelector('span');
  if (span) span.innerHTML = canvasWidth < 480 ? ' Skip fill(0)' : ' Skip fill(0) in loop mode';
  skipBox.position(22 + loopButton.elt.offsetWidth, drawHeight + 80);
}

// ---------- the framebuffer and its drawing calls ----------

function setPx(arr, x, y, c) {
  x = Math.round(x); y = Math.round(y);
  if (x >= 0 && x < W && y >= 0 && y < H) arr[y * W + x] = c;
}

function fbFill(c) { fb.fill(c); }

function fbText(s, x, y) {
  for (let k = 0; k < s.length; k++) {
    const g = FONT[s[k]];
    if (!g) continue;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (g[row] & (1 << col)) setPx(fb, x + k * 8 + col, y + row, 1);
      }
    }
  }
}

// outline ellipse, like framebuf.ellipse() without the fill flag
function fbEllipse(cx, cy, xr, yr) {
  for (let a = 0; a < 720; a++) {
    const t = a / 720 * TWO_PI;
    setPx(fb, cx + xr * Math.cos(t), cy + yr * Math.sin(t), 1);
  }
}

// outline rectangle
function fbRect(x, y, w, h) {
  for (let i = 0; i < w; i++) { setPx(fb, x + i, y, 1); setPx(fb, x + i, y + h - 1, 1); }
  for (let j = 0; j < h; j++) { setPx(fb, x, y + j, 1); setPx(fb, x + w - 1, y + j, 1); }
}

// show(): copy the whole framebuffer to the screen in one step
function show() {
  screen.set(fb);
  flashUntil = millis() + 500;
}

function matches() {
  for (let i = 0; i < fb.length; i++) if (fb[i] !== screen[i]) return false;
  return true;
}

// ---------- running steps ----------

function runStep(i) {
  STEPS[i].run();
  lastStep = i;
}

function runAll() {
  stopAll();
  queue = [0, 1, 2, 3, 4];
  nextAt = millis();
}

function stopAll() {
  queue = [];
  if (looping) toggleLoop();
}

function resetAll() {
  stopAll();
  fb.fill(0); screen.fill(0);
  lastStep = -1; passes = 0; loopX = 64; loopLine = -1;
}

function toggleLoop() {
  looping = !looping;
  loopButton.html(looping ? 'Stop loop' : 'Loop mode: move the ellipse');
  if (looping) { queue = []; passes = 0; loopX = 64; nextAt = millis(); loopLine = -1; }
  positionControls();
}

// one loop pass every 500 ms: fill(0) (unless skipped), ellipse at x, show()
function loopPass() {
  if (!skipBox.checked()) fbFill(0);
  fbEllipse(loopX, 32, 20, 20);
  show();
  passes++;
  loopX = (loopX + 8) % W;          // wrap at the right edge
}

function update() {
  if (queue.length && millis() >= nextAt) {
    runStep(queue.shift());
    nextAt = millis() + 600;
  }
  if (looping && millis() >= nextAt) {
    loopPass();
    nextAt = millis() + 500;
  }
}

// ---------- drawing ----------

function panelScale() { return min(2.5, (canvasWidth - 20 - 70) / (2 * W)); }

function draw() {
  updateCanvasSize();
  update();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(canvasWidth < 480 ? 19 : 22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('OLED Framebuffer and show()', 10, 8);
  textStyle(NORMAL);

  const s = panelScale();
  const pw = W * s, ph = H * s;
  const gap = canvasWidth - 20 - 2 * pw;
  const x1 = 10, x2 = 10 + pw + gap, py = 62;

  drawPanel(fb, x1, py, s, 'Framebuffer (in memory)');
  drawPanel(screen, x2, py, s, 'OLED screen (what you see)');
  drawArrow(x1 + pw, x2, py + ph / 2, gap);

  const codeTop = py + ph + 14;
  const codeBottom = drawCode(codeTop);
  drawStatus(codeTop, codeBottom);
}

function drawPanel(arr, x, y, s, title) {
  noStroke(); fill('black'); textSize(canvasWidth < 480 ? 12 : 14); textStyle(BOLD); textAlign(LEFT, BOTTOM);
  text(title, x, y - 4);
  textStyle(NORMAL);
  stroke('dimgray'); strokeWeight(2); fill('black');
  rect(x - 2, y - 2, W * s + 4, H * s + 4, 3);
  noStroke(); fill('white');
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      if (arr[j * W + i]) rect(x + i * s, y + j * s, s, s);
    }
  }
}

function drawArrow(xa, xb, y, gap) {
  const flash = millis() < flashUntil;
  const col = flash ? 'darkorange' : 'royalblue';
  stroke(col); strokeWeight(flash ? 5 : 3);
  line(xa + 6, y, xb - 12, y);
  noStroke(); fill(col);
  triangle(xb - 4, y, xb - 14, y - 7, xb - 14, y + 7);
  fill(col); textSize(12); textStyle(BOLD); textAlign(CENTER, BOTTOM);
  const label = gap > 110 ? 'show() copies' : 'show()';
  text(label, (xa + xb) / 2, y - 9);
  if (gap <= 110) { textAlign(CENTER, TOP); text('copies', (xa + xb) / 2, y + 9); }
  textStyle(NORMAL);
}

function codeLines() {
  if (!looping && passes === 0) return STEPS.map((s, i) => ({ t: (i + 1) + '  ' + s.code, on: i === lastStep }));
  // loop mode shows the loop version of the code
  const skip = skipBox.checked();
  return [
    { t: 'while True:', on: false },
    { t: skip ? '    # display.fill(0)   <- skipped!' : '    display.fill(0)', on: false, warn: skip },
    { t: '    display.ellipse(x, 32, 20, 20, 1)', on: false },
    { t: '    display.show()', on: millis() < flashUntil },
    { t: '    x = (x + 8) % 128', on: false }
  ];
}

function drawCode(top) {
  const narrow = canvasWidth < 560;
  const w = narrow ? canvasWidth - 20 : canvasWidth * 0.58;
  const lines = codeLines();
  const fs = narrow ? 11 : 14, lh = fs + 7;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(10, top, w, lines.length * lh + 12, 6);
  textFont('monospace'); textSize(fs); textAlign(LEFT, TOP);
  lines.forEach((ln, i) => {
    const y = top + 6 + i * lh;
    if (ln.on) { noStroke(); fill('khaki'); rect(12, y - 2, w - 4, lh, 3); }
    noStroke();
    fill(ln.warn ? 'crimson' : 'black');
    textStyle(ln.on ? BOLD : NORMAL);
    text(ln.t, 18, y + 2);
  });
  textStyle(NORMAL);
  textFont('sans-serif');
  return top + lines.length * lh + 12;
}

// status goes to the right of the code (wide) or under it (narrow)
function drawStatus(top, codeBottom) {
  const narrow = canvasWidth < 560;
  const x = narrow ? 10 : canvasWidth * 0.58 + 22;
  const y = narrow ? codeBottom + 8 : top + 4;
  const w = canvasWidth - x - 10;
  const ok = matches();
  noStroke(); textAlign(LEFT, TOP); textStyle(BOLD); textSize(narrow ? 14 : 16);
  fill(ok ? 'seagreen' : 'darkorange');
  text(ok ? 'Screen matches framebuffer' : 'Screen is out of date', x, y, w);
  textStyle(NORMAL);
  textSize(narrow ? 13 : 14); fill('dimgray');
  let yy = y + (textWidth('Screen matches framebuffer') > w ? 44 : 26);
  if (!ok) { text('Press show() to copy the framebuffer to the screen.', x, yy, w); yy += 40; }
  if (looping || passes > 0) {
    fill('black');
    text('Loop pass: ' + passes, x, yy);
    yy += 22;
    if (skipBox.checked() && passes >= 2) {
      fill('crimson'); textStyle(BOLD);
      text('Old drawings never got erased - add display.fill(0)', x, yy, w);
      textStyle(NORMAL);
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
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
}
