// H-Bridge Switch States
// CANVAS_HEIGHT: 400
// Bloom L4 (Analyze): trace current paths through the four switches to predict
// motor direction. Forward closes SW1+SW4; Reverse closes SW2+SW3.

let canvasWidth = 700;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let fwdButton, revButton, stopButton;
let state = 'STOPPED';   // FORWARD, REVERSE, STOPPED
let flow = 0;            // animation phase

// geometry (computed each frame)
let Lx, Rx, topY, midY, botY, cx;
let sw = {};             // switch positions

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  fwdButton = createButton('Forward');
  fwdButton.parent(document.querySelector('main'));
  fwdButton.mousePressed(() => state = 'FORWARD');
  revButton = createButton('Reverse');
  revButton.parent(document.querySelector('main'));
  revButton.mousePressed(() => state = 'REVERSE');
  stopButton = createButton('Stop');
  stopButton.parent(document.querySelector('main'));
  stopButton.mousePressed(() => state = 'STOPPED');

  positionControls();
  describe('Schematic of an H-bridge with four switches at the corners of an H and a motor in the center bar. Forward, Reverse, and Stop buttons open and close switches and animate current flow to show how the motor direction is set.', LABEL);
}

function positionControls() {
  fwdButton.position(10, drawHeight + 12);
  revButton.position(90, drawHeight + 12);
  stopButton.position(175, drawHeight + 12);
}

function computeGeometry() {
  cx = canvasWidth / 2;
  Lx = cx - 130; Rx = cx + 130;
  topY = 80; midY = 195; botY = 300;
  sw = {
    SW1: { x: Lx, y: (topY + midY) / 2, label: 'SW1', info: 'SW1 — top-left switch. Closed = connects motor terminal A to V+.' },
    SW2: { x: Lx, y: (midY + botY) / 2, label: 'SW2', info: 'SW2 — bottom-left switch. Closed = connects motor terminal A to GND.' },
    SW3: { x: Rx, y: (topY + midY) / 2, label: 'SW3', info: 'SW3 — top-right switch. Closed = connects motor terminal B to V+.' },
    SW4: { x: Rx, y: (midY + botY) / 2, label: 'SW4', info: 'SW4 — bottom-right switch. Closed = connects motor terminal B to GND.' }
  };
}

function closedSet() {
  if (state === 'FORWARD') return { SW1: true, SW4: true };
  if (state === 'REVERSE') return { SW2: true, SW3: true };
  return {};
}

function draw() {
  updateCanvasSize();
  computeGeometry();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('H-Bridge Switch States', canvasWidth / 2, 10);

  drawWires();
  if (state !== 'STOPPED') { flow += 0.01; drawCurrent(); }
  drawSwitches();
  drawMotorAndRails();
  drawStatus();
  drawTooltip();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawWires() {
  stroke('#607d8b'); strokeWeight(3); noFill();
  // top rail
  line(Lx, topY, Rx, topY);
  // bottom rail
  line(Lx, botY, Rx, botY);
  // left rail
  line(Lx, topY, Lx, botY);
  // right rail
  line(Rx, topY, Rx, botY);
  // V+ and GND stubs
  line(cx, topY - 26, cx, topY);
  line(cx, botY, cx, botY + 26);
}

function fwdPath() {
  return [[cx, topY], [Lx, topY], [Lx, midY], [Rx, midY], [Rx, botY], [cx, botY]];
}
function revPath() {
  return [[cx, topY], [Rx, topY], [Rx, midY], [Lx, midY], [Lx, botY], [cx, botY]];
}

function drawCurrent() {
  const path = state === 'FORWARD' ? fwdPath() : revPath();
  const col = state === 'FORWARD' ? '#fb8c00' : '#1e88e5';
  // total length
  let segLen = [], total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = dist(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
    segLen.push(d); total += d;
  }
  noStroke(); fill(col);
  const nDots = 16;
  for (let k = 0; k < nDots; k++) {
    let d = ((flow + k / nDots) % 1) * total;
    for (let i = 0; i < segLen.length; i++) {
      if (d <= segLen[i]) {
        const f = d / segLen[i];
        const x = lerp(path[i][0], path[i + 1][0], f);
        const y = lerp(path[i][1], path[i + 1][1], f);
        circle(x, y, 8);
        break;
      }
      d -= segLen[i];
    }
  }
}

function drawSwitches() {
  const closed = closedSet();
  const hov = hoverSwitch();
  for (let key of ['SW1', 'SW2', 'SW3', 'SW4']) {
    const s = sw[key];
    const isClosed = !!closed[key];
    stroke(hov === key ? '#ff6f00' : '#333'); strokeWeight(hov === key ? 3 : 1.5);
    fill(isClosed ? '#43a047' : '#e53935');
    circle(s.x, s.y, 26);
    noStroke(); fill('white'); textSize(11); textAlign(CENTER, CENTER);
    text(s.label, s.x, s.y);
    fill('#333'); textSize(10);
    text(isClosed ? 'closed' : 'open', s.x, s.y + 22);
  }
}

function drawMotorAndRails() {
  // motor in the center of the mid bar
  stroke('#333'); strokeWeight(2); fill('#fffde7');
  circle(cx, midY, 50);
  noStroke(); fill('#333'); textSize(20); textAlign(CENTER, CENTER);
  text('M', cx, midY);
  fill('#555'); textSize(11);
  text('A', Lx + 30, midY - 12); text('B', Rx - 30, midY - 12);
  // connect motor to mid nodes
  stroke('#607d8b'); strokeWeight(3);
  line(Lx, midY, cx - 25, midY); line(cx + 25, midY, Rx, midY);
  // V+ / GND labels
  noStroke(); fill('#d32f2f'); textSize(14); textAlign(CENTER, BOTTOM);
  text('V+', cx, topY - 28);
  fill('#333'); textAlign(CENTER, TOP);
  text('GND', cx, botY + 28);
}

function drawStatus() {
  const col = state === 'FORWARD' ? '#fb8c00' : (state === 'REVERSE' ? '#1e88e5' : '#777');
  noStroke(); fill(col); textSize(18); textAlign(RIGHT, TOP);
  text('Motor: ' + state, canvasWidth - margin, 44);
}

function hoverSwitch() {
  for (let key of ['SW1', 'SW2', 'SW3', 'SW4']) {
    if (dist(mouseX, mouseY, sw[key].x, sw[key].y) < 16) return key;
  }
  return null;
}

function drawTooltip() {
  const h = hoverSwitch();
  if (!h) return;
  const msg = sw[h].info;
  const tw = min(300, textWidth(msg) + 20);
  let tx = mouseX + 12; if (tx + tw > canvasWidth) tx = canvasWidth - tw - 4;
  let ty = mouseY - 36;
  noStroke(); fill('#102a43'); rect(tx, ty, tw, 32, 6);
  fill('white'); textSize(12); textAlign(LEFT, TOP);
  text(msg, tx + 8, ty + 5, tw - 16, 26);
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
