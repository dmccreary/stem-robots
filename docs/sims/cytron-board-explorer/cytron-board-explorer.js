// Cytron Maker Pi RP2040 Board Explorer
// CANVAS_HEIGHT: 500
// Click any labeled component on the board to read what it does.
// Bloom L1 (Remember): identify the main components and state their function.

let canvasWidth = 700;
let drawHeight = 460;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let resetButton;
let selectedId = null;
let hoverId = null;

// Components defined as fractions of the board rectangle (relative coords).
// rx,ry = top-left fraction; rw,rh = width/height fraction.
const components = [
  { id: 'rp2040', name: 'RP2040 Chip', rx: 0.40, ry: 0.40, rw: 0.20, rh: 0.20,
    info: 'The brain. A dual-core ARM processor running up to 133 MHz. It executes your MicroPython code.' },
  { id: 'pico', name: 'Pico Module Footprint', rx: 0.30, ry: 0.30, rw: 0.40, rh: 0.42,
    info: 'The Raspberry Pi Pico mounts here. Its 40 pins align with sockets on this board.' },
  { id: 'usb', name: 'USB Micro-B', rx: 0.0, ry: 0.44, rw: 0.10, rh: 0.12,
    info: 'Plug your USB cable here to upload programs or to power the board from a laptop.' },
  { id: 'm1', name: 'Motor Driver M1', rx: 0.18, ry: 0.86, rw: 0.16, rh: 0.12,
    info: 'Drives one DC motor up to 1 A and can reverse direction. M1 = left motor.' },
  { id: 'm2', name: 'Motor Driver M2', rx: 0.40, ry: 0.86, rw: 0.16, rh: 0.12,
    info: 'Drives one DC motor up to 1 A and can reverse direction. M2 = right motor.' },
  { id: 'grove', name: 'Grove Connectors', rx: 0.80, ry: 0.16, rw: 0.16, rh: 0.10,
    info: 'Keyed 4-pin connectors (GP0, GP1, GP2, GP4, GP16, GP17, GP26) for sensors. They only plug in one way — you cannot wire them backwards.' },
  { id: 'leds', name: 'Onboard LEDs', rx: 0.80, ry: 0.40, rw: 0.16, rh: 0.18,
    info: 'Each of the 13 LEDs lights when its GPIO pin goes HIGH. No extra wiring needed to see pin state.' },
  { id: 'buzzer', name: 'Piezo Buzzer', rx: 0.04, ry: 0.16, rw: 0.10, rh: 0.12,
    info: 'Generates tones. Your code uses PWM to play notes or beep patterns.' },
  { id: 'reset', name: 'Reset Button', rx: 0.04, ry: 0.66, rw: 0.09, rh: 0.10,
    info: 'Restarts the board without unplugging USB. Press once to reboot.' },
  { id: 'boot', name: 'Boot Button', rx: 0.04, ry: 0.78, rw: 0.09, rh: 0.10,
    info: 'Hold this while plugging in USB to enter bootloader mode for firmware updates.' },
  { id: 'power', name: 'Power Terminal', rx: 0.62, ry: 0.86, rw: 0.20, rh: 0.12,
    info: 'Connect the AA battery pack here. It powers the motors independently of USB.' }
];

let boardRect = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset Selection');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => { selectedId = null; });
  positionControls();

  describe('Top-view illustration of the Cytron Maker Pi RP2040 board with clickable labeled components and an info panel that explains each one.', LABEL);
}

function positionControls() {
  resetButton.position(10, drawHeight + 8);
}

function panelX() { return canvasWidth * 0.65; }

function computeBoard() {
  const bx = margin;
  const by = 46;
  const bw = canvasWidth * 0.63 - margin * 2;
  const bh = drawHeight - by - margin;
  boardRect = { x: bx, y: by, w: bw, h: bh };
}

function compRect(c) {
  return {
    x: boardRect.x + c.rx * boardRect.w,
    y: boardRect.y + c.ry * boardRect.h,
    w: c.rw * boardRect.w,
    h: c.rh * boardRect.h
  };
}

function draw() {
  updateCanvasSize();
  computeBoard();

  // Backgrounds
  noStroke();
  fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke(); fill('black');
  textSize(20); textAlign(CENTER, TOP);
  text('Cytron Maker Pi RP2040 — Board Explorer', canvasWidth * 0.33, 10);

  // Hover detection
  hoverId = null;
  for (let c of components) {
    const r = compRect(c);
    if (overRect(r) && c.id !== 'pico') { hoverId = c.id; }
  }

  // Board body
  stroke('#00695c'); strokeWeight(2);
  fill('#0d7a6e');
  rect(boardRect.x, boardRect.y, boardRect.w, boardRect.h, 8);

  // Draw components (pico footprint first, as background)
  drawComponent(components.find(c => c.id === 'pico'));
  for (let c of components) { if (c.id !== 'pico') drawComponent(c); }

  // Info panel
  drawInfoPanel();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function overRect(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function drawComponent(c) {
  const r = compRect(c);
  const isSel = selectedId === c.id;
  const isHov = hoverId === c.id;

  if (c.id === 'pico') {
    noFill(); stroke('#b2dfdb'); strokeWeight(1.5); drawingContext.setLineDash([5, 4]);
    rect(r.x, r.y, r.w, r.h, 6);
    drawingContext.setLineDash([]);
    return;
  }

  // body colors per component family
  let body = '#37474f';
  if (c.id === 'rp2040') body = '#263238';
  else if (c.id === 'usb') body = '#90a4ae';
  else if (c.id === 'm1' || c.id === 'm2') body = '#1565c0';
  else if (c.id === 'power') body = '#2e7d32';
  else if (c.id === 'grove') body = '#eeeeee';
  else if (c.id === 'leds') body = '#102027';
  else if (c.id === 'buzzer') body = '#212121';

  stroke(isSel || isHov ? '#ff6f00' : '#004d40');
  strokeWeight(isSel ? 4 : (isHov ? 3 : 1.5));
  fill(body);
  rect(r.x, r.y, r.w, r.h, 4);

  // small glyphs
  noStroke();
  if (c.id === 'leds') {
    const cols = ['#e53935', '#fdd835', '#43a047', '#1e88e5'];
    for (let i = 0; i < 4; i++) { fill(cols[i % 4]); circle(r.x + 8 + i * (r.w - 12) / 3, r.y + 10, 6); }
  } else if (c.id === 'grove') {
    fill('#ffffff'); for (let i = 0; i < 4; i++) rect(r.x + 3 + i * (r.w - 6) / 4, r.y + 3, 3, r.h - 6);
  } else if (c.id === 'buzzer') {
    fill('#424242'); circle(r.x + r.w / 2, r.y + r.h / 2, min(r.w, r.h) * 0.7);
  }

  // label
  noStroke();
  fill(c.id === 'grove' ? 'black' : 'white');
  textSize(10); textAlign(CENTER, CENTER);
  text(shortLabel(c.id), r.x + r.w / 2, r.y + r.h / 2);
}

function shortLabel(id) {
  const m = { rp2040: 'RP2040', usb: 'USB', m1: 'M1', m2: 'M2', grove: 'Grove',
    leds: 'LEDs', buzzer: 'Buzz', reset: 'RST', boot: 'BOOT', power: 'PWR' };
  return m[id] || '';
}

function drawInfoPanel() {
  const px = panelX();
  const pw = canvasWidth - px - margin;
  noStroke();
  fill('#102a43');
  rect(px, 46, pw, drawHeight - 46 - margin, 8);

  const sel = components.find(c => c.id === selectedId);
  fill('white');
  textAlign(LEFT, TOP);
  textSize(16);
  if (sel) {
    text(sel.name, px + 12, 60, pw - 24, 60);
    textSize(13.5);
    fill('#cfe3ff');
    text(sel.info, px + 12, 104, pw - 24, drawHeight - 160);
  } else {
    textSize(15);
    text('Click any labeled component on the board to learn its name and what it does.', px + 12, 70, pw - 24, 200);
  }
}

function mousePressed() {
  for (let c of components) {
    if (c.id === 'pico') continue;
    if (overRect(compRect(c))) { selectedId = c.id; return; }
  }
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
