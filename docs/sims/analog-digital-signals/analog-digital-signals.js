// Analog vs Digital Signal Comparison
// CANVAS_HEIGHT: 350
// Bloom L2 (Understand): distinguish continuous analog signals from discrete
// digital signals and see why an ADC is needed. Move the mouse to read the
// voltage at any point on each signal.

let canvasWidth = 700;
let drawHeight = 300;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let typeSelect;
const cycles = 3;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  typeSelect = createSelect();
  typeSelect.parent(document.querySelector('main'));
  typeSelect.option('Sine wave');
  typeSelect.option('Potentiometer (sawtooth ramp)');
  typeSelect.option('Microphone (noise)');
  typeSelect.selected('Sine wave');
  positionControls();
  describe('Two side-by-side panels comparing a continuous analog signal (left) with a discrete digital square wave (right). A vertical cursor follows the mouse and reads the voltage on each signal. A dropdown changes the analog signal type.', LABEL);
}

function positionControls() {
  typeSelect.position(135, drawHeight + 13);
}

function panels() {
  const top = 64, h = 200;
  const pw = (canvasWidth - 3 * margin) / 2;
  return {
    left: { x: margin, y: top, w: pw, h: h },
    right: { x: margin * 2 + pw, y: top, w: pw, h: h }
  };
}

// analog voltage 0..3.3 for normalized t 0..1
function analogVolt(t) {
  const kind = typeSelect ? typeSelect.value() : 'Sine wave';
  if (kind.startsWith('Potentiometer')) return 3.3 * (t * cycles % 1);
  if (kind.startsWith('Microphone')) return 3.3 * noise(t * 18);
  return 1.65 + 1.65 * sin(TWO_PI * cycles * t);
}
// digital square wave HIGH/LOW for t
function digitalHigh(t) {
  return (sin(TWO_PI * cycles * t) >= 0);
}

function draw() {
  updateCanvasSize();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(19); textAlign(CENTER, TOP);
  text('Analog vs Digital Signals', canvasWidth / 2, 8);

  const p = panels();
  // cursor t derived from mouseX across either panel
  let t = null;
  if (mouseX >= p.left.x && mouseX <= p.left.x + p.left.w) t = (mouseX - p.left.x) / p.left.w;
  else if (mouseX >= p.right.x && mouseX <= p.right.x + p.right.w) t = (mouseX - p.right.x) / p.right.w;

  drawAnalogPanel(p.left, t);
  drawDigitalPanel(p.right, t);

  noStroke(); fill('black'); textSize(14); textAlign(LEFT, CENTER);
  text('Signal Type:', 15, drawHeight + 22);

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function panelFrame(pn, title, col) {
  noStroke(); fill('white'); stroke('#cfd8dc'); strokeWeight(1);
  rect(pn.x, pn.y, pn.w, pn.h);
  noStroke(); fill(col); textSize(14); textAlign(LEFT, TOP);
  text(title, pn.x + 8, pn.y + 6);
  // 0 and 3.3 axis labels
  fill('#90a4ae'); textSize(10); textAlign(RIGHT, CENTER);
  text('3.3', pn.x + 24, pn.y + 26);
  text('0', pn.x + 24, pn.y + pn.h - 12);
  stroke('#eceff1'); line(pn.x + 28, pn.y + 26, pn.x + pn.w - 6, pn.y + 26);
  line(pn.x + 28, pn.y + pn.h - 12, pn.x + pn.w - 6, pn.y + pn.h - 12);
}

function voltToY(pn, v) {
  return map(v, 0, 3.3, pn.y + pn.h - 12, pn.y + 26);
}

function drawAnalogPanel(pn, t) {
  panelFrame(pn, 'Analog Signal', '#e65100');
  // smooth curve
  stroke('#fb8c00'); strokeWeight(2.5); noFill();
  beginShape();
  for (let px = 0; px <= pn.w - 34; px++) {
    const tt = px / (pn.w - 34);
    vertex(pn.x + 28 + px, voltToY(pn, analogVolt(tt)));
  }
  endShape();
  if (t !== null) {
    const cx = pn.x + 28 + t * (pn.w - 34);
    const v = analogVolt(t);
    drawCursor(pn, cx, voltToY(pn, v), '#e65100');
    noStroke(); fill('#102a43');
    rect(pn.x + 8, pn.y + pn.h - 30, 150, 22, 4);
    fill('white'); textSize(13); textAlign(LEFT, CENTER);
    text('Voltage: ' + nf(v, 1, 2) + ' V', pn.x + 14, pn.y + pn.h - 19);
  }
}

function drawDigitalPanel(pn, t) {
  panelFrame(pn, 'Digital Signal', '#1565c0');
  stroke('#1e88e5'); strokeWeight(2.5); noFill();
  beginShape();
  let prevHigh = digitalHigh(0);
  for (let px = 0; px <= pn.w - 34; px++) {
    const tt = px / (pn.w - 34);
    const hi = digitalHigh(tt);
    const y = voltToY(pn, hi ? 3.3 : 0);
    if (hi !== prevHigh) { vertex(pn.x + 28 + px, voltToY(pn, prevHigh ? 3.3 : 0)); }
    vertex(pn.x + 28 + px, y);
    prevHigh = hi;
  }
  endShape();
  if (t !== null) {
    const cx = pn.x + 28 + t * (pn.w - 34);
    const hi = digitalHigh(t);
    drawCursor(pn, cx, voltToY(pn, hi ? 3.3 : 0), '#1565c0');
    noStroke(); fill('#102a43');
    rect(pn.x + 8, pn.y + pn.h - 30, 160, 22, 4);
    fill('white'); textSize(13); textAlign(LEFT, CENTER);
    text(hi ? 'HIGH (3.3 V)' : 'LOW (0 V)', pn.x + 14, pn.y + pn.h - 19);
  }
}

function drawCursor(pn, cx, cy, col) {
  stroke(col); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(cx, pn.y + 22, cx, pn.y + pn.h - 6);
  drawingContext.setLineDash([]);
  noStroke(); fill(col); circle(cx, cy, 8);
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
