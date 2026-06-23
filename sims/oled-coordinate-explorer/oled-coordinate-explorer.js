// OLED Coordinate System Explorer
// CANVAS_HEIGHT: 400
// Bloom L3 (Apply): place drawing commands at specific coordinates on the
// 128x64 OLED and read back the equivalent ssd1306 / framebuf Python code.

let canvasWidth = 700;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let gridCheckbox, clearButton;
let drawButtons = [];
let shapes = [];          // accumulated drawn elements
let codeLine = '# Click a Draw button to place an element';

const OLED_W = 128, OLED_H = 64;
let scaleF = 4, oledX = 0, oledY = 40;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  gridCheckbox = createCheckbox(' Show grid', false);
  gridCheckbox.parent(document.querySelector('main'));

  const defs = [['Draw Text', 'text'], ['Draw Line', 'line'], ['Draw Circle', 'circle'], ['Draw Rect', 'rect']];
  for (let d of defs) {
    const b = createButton(d[0]);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => addShape(d[1]));
    drawButtons.push(b);
  }
  clearButton = createButton('Clear');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(() => { shapes = []; codeLine = '# Display cleared with oled.fill(0)'; });

  positionControls();
  describe('A scaled-up 128 by 64 pixel OLED screen. Hover to read pixel coordinates; buttons draw text, a line, a circle, or a rectangle at a random position and show the matching ssd1306 Python code in a code box.', LABEL);
}

function positionControls() {
  let x = 10; const y = drawHeight + 12;
  gridCheckbox.position(x, y + 4); x += 100;
  for (let b of drawButtons) { b.position(x, y); x += (b.elt.offsetWidth || 80) + 6; }
  clearButton.position(x, y);
}

function addShape(kind) {
  if (kind === 'text') {
    const x = floor(random(0, 90)), y = floor(random(0, 56));
    shapes.push({ kind, x, y, txt: 'Hi' });
    codeLine = "oled.text('Hi', " + x + ", " + y + ")";
  } else if (kind === 'line') {
    const x1 = floor(random(0, 128)), y1 = floor(random(0, 64)), x2 = floor(random(0, 128)), y2 = floor(random(0, 64));
    shapes.push({ kind, x1, y1, x2, y2 });
    codeLine = "oled.line(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ", 1)";
  } else if (kind === 'circle') {
    const r = floor(random(6, 18)), x = floor(random(r, 128 - r)), y = floor(random(r, 64 - r));
    shapes.push({ kind, x, y, r });
    codeLine = "oled.ellipse(" + x + ", " + y + ", " + r + ", " + r + ", 1)";
  } else if (kind === 'rect') {
    const w = floor(random(12, 50)), h = floor(random(8, 28)), x = floor(random(0, 128 - w)), y = floor(random(0, 64 - h));
    shapes.push({ kind, x, y, w, h });
    codeLine = "oled.rect(" + x + ", " + y + ", " + w + ", " + h + ", 1)";
  }
  codeLine += "\noled.show()";
}

function draw() {
  updateCanvasSize();
  scaleF = min(4, (canvasWidth - 2 * margin) / OLED_W);
  oledX = (canvasWidth - OLED_W * scaleF) / 2;

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(18); textAlign(CENTER, TOP);
  text('OLED Coordinate Explorer (128 x 64)', canvasWidth / 2, 8);

  drawScreen();
  drawShapes();
  if (gridCheckbox.checked()) drawGrid();
  drawHover();
  drawCodeBox();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function sx(x) { return oledX + x * scaleF; }
function sy(y) { return oledY + y * scaleF; }

function drawScreen() {
  noStroke(); fill('black');
  rect(oledX, oledY, OLED_W * scaleF, OLED_H * scaleF, 4);
  // origin marker
  noStroke(); fill('#00e5ff'); textSize(11); textAlign(LEFT, TOP);
  text('(0,0)', oledX + 3, oledY + 2);
  textAlign(RIGHT, BOTTOM);
  text('(127,63)', oledX + OLED_W * scaleF - 3, oledY + OLED_H * scaleF - 2);
}

function drawGrid() {
  stroke(0, 229, 255, 70); strokeWeight(1);
  for (let x = 0; x <= OLED_W; x += 8) line(sx(x), oledY, sx(x), oledY + OLED_H * scaleF);
  for (let y = 0; y <= OLED_H; y += 8) line(oledX, sy(y), oledX + OLED_W * scaleF, sy(y));
}

function drawShapes() {
  for (let s of shapes) {
    stroke('#ffffff'); strokeWeight(max(1, scaleF * 0.8)); noFill();
    if (s.kind === 'line') line(sx(s.x1), sy(s.y1), sx(s.x2), sy(s.y2));
    else if (s.kind === 'circle') ellipse(sx(s.x), sy(s.y), s.r * 2 * scaleF, s.r * 2 * scaleF);
    else if (s.kind === 'rect') rect(sx(s.x), sy(s.y), s.w * scaleF, s.h * scaleF);
    else if (s.kind === 'text') {
      noStroke(); fill('white'); textSize(8 * scaleF); textAlign(LEFT, TOP);
      text(s.txt, sx(s.x), sy(s.y));
    }
  }
}

function drawHover() {
  const ox = floor((mouseX - oledX) / scaleF);
  const oy = floor((mouseY - oledY) / scaleF);
  if (ox >= 0 && ox < OLED_W && oy >= 0 && oy < OLED_H) {
    noStroke(); fill('#102a43');
    const msg = 'Pixel: (' + ox + ', ' + oy + ')';
    let tx = mouseX + 10, ty = mouseY - 24;
    if (tx + 110 > canvasWidth) tx = canvasWidth - 114;
    rect(tx, ty, 104, 22, 4);
    fill('white'); textSize(12); textAlign(LEFT, CENTER);
    text(msg, tx + 8, ty + 11);
  }
}

function drawCodeBox() {
  const cy = oledY + OLED_H * scaleF + 8;
  noStroke(); fill('#1b2b34');
  rect(margin, cy, canvasWidth - 2 * margin, drawHeight - cy - 6, 4);
  fill('#9ce0a8'); textSize(13); textAlign(LEFT, TOP);
  textFont('monospace');
  text(codeLine, margin + 10, cy + 8, canvasWidth - 2 * margin - 20);
  textFont('Arial');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) { canvasWidth = container.offsetWidth; }
}
