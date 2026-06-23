// Robot Assembly Workflow
// CANVAS_HEIGHT: 520
// Bloom L3 (Apply): sequence the eight Smart Car assembly steps and explain
// why each step must come before the next. Click a step to reveal its detail.

let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

let resetButton;
let selected = -1;
let visited = {};
let slide = 0; // panel slide animation 0..1

const steps = [
  { t: 'Attach Motors', icon: 'motor',
    d: 'Mount each motor into its plastic bracket with two M3 screws. Both shafts point outward. First because motors are hardest to reach once the board is mounted above them.' },
  { t: 'Install Standoffs', icon: 'pillars',
    d: 'Thread four M3 nylon standoffs through the chassis corner holes; nuts below. Use nylon — metal can short the board. The board mounts onto these standoffs next.' },
  { t: 'Route Motor Wires', icon: 'wire',
    d: 'Thread red and black motor wires up through the chassis opening to the top surface. Impossible to route cleanly once the board covers the opening.' },
  { t: 'Mount Cytron Board', icon: 'pcb',
    d: 'Lower the board onto the standoffs and secure with M3 screws. It must sit flat with no rocking. The board must be in place before wires reach its terminals.' },
  { t: 'Connect Motor Terminals', icon: 'terminal',
    d: 'Left motor wires go into M1, right into M2. Tighten each screw and tug to confirm grip. A loose wire causes erratic behavior that looks like a software bug.' },
  { t: 'Attach Wheels', icon: 'wheel',
    d: 'Press each wheel onto its shaft until it clicks. Spin by hand — must spin freely and sit perpendicular. A crooked wheel makes the robot veer even with perfect code.' },
  { t: 'Connect Battery Pack', icon: 'battery',
    d: 'Red wire to + terminal, black to − terminal. Never reverse polarity — it can permanently damage the motor driver chips.' },
  { t: 'Connect Sensor Cable', icon: 'grove',
    d: 'Plug the time-of-flight sensor Grove cable into the GP16/GP17 port. Tuck excess cable. This sensor is used in every collision-avoidance lab from Chapter 8 on.' }
];

let rects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset Progress');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => { visited = {}; selected = -1; });
  positionControls();
  describe('Eight-step vertical assembly workflow for the Smart Car chassis. Each step is a numbered card; clicking one shows the detailed instructions and the mechanical reason it comes before the next step.', LABEL);
}

function positionControls() { resetButton.position(10, drawHeight + 6); }

function panelX() { return canvasWidth * 0.52; }

function computeRects() {
  rects = [];
  const colW = panelX() - margin * 2;
  const top = 48;
  const avail = drawHeight - top - margin;
  const stepH = (avail - 7 * 8) / 8; // 8 gaps of 8px
  for (let i = 0; i < 8; i++) {
    rects.push({ x: margin, y: top + i * (stepH + 8), w: colW, h: stepH });
  }
}

function stepColor(i) {
  // blue (step 0) to green (step 7)
  return lerpColor(color('#1565c0'), color('#2e7d32'), i / 7);
}

function draw() {
  updateCanvasSize();
  computeRects();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(18); textAlign(CENTER, TOP);
  text('Smart Car Assembly Workflow', canvasWidth * 0.26, 10);

  for (let i = 0; i < 8; i++) drawStep(i);

  // animate slide
  slide = lerp(slide, selected >= 0 ? 1 : 0, 0.25);
  drawDetailPanel();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawStep(i) {
  const r = rects[i];
  const isSel = selected === i;
  noStroke();
  // connector arrow above each step after the first
  if (i > 0) {
    const px = r.x + r.w / 2;
    stroke('#9e9e9e'); strokeWeight(2);
    line(px, r.y - 8, px, r.y);
    fill('#9e9e9e'); noStroke();
    triangle(px - 4, r.y - 3, px + 4, r.y - 3, px, r.y + 2);
  }
  // card
  stroke(isSel ? '#ff6f00' : '#37474f');
  strokeWeight(isSel ? 3 : 1);
  fill(stepColor(i));
  rect(r.x, r.y, r.w, r.h, 6);

  // number circle
  noStroke(); fill('white');
  circle(r.x + 20, r.y + r.h / 2, 24);
  fill('black'); textAlign(CENTER, CENTER); textSize(13);
  text(i + 1, r.x + 20, r.y + r.h / 2);

  // icon
  drawIcon(steps[i].icon, r.x + 48, r.y + r.h / 2);

  // title (centered vertically within the card)
  fill('white'); textAlign(LEFT, CENTER); textSize(13);
  text(steps[i].t, r.x + 70, r.y, r.w - 96, r.h);

  // checkmark if visited
  if (visited[i]) {
    noStroke(); fill('#00e676');
    circle(r.x + r.w - 14, r.y + 14, 18);
    stroke('white'); strokeWeight(2.5); noFill();
    line(r.x + r.w - 18, r.y + 14, r.x + r.w - 15, r.y + 17);
    line(r.x + r.w - 15, r.y + 17, r.x + r.w - 10, r.y + 10);
    strokeWeight(1);
  }
}

function drawIcon(kind, cx, cy) {
  push();
  translate(cx, cy);
  stroke('white'); strokeWeight(1.5); noFill();
  if (kind === 'motor') { rect(-8, -6, 12, 12, 2); line(4, 0, 9, 0); }
  else if (kind === 'pillars') { for (let i = 0; i < 3; i++) line(-7 + i * 6, -7, -7 + i * 6, 7); }
  else if (kind === 'wire') { stroke('#ffcdd2'); line(-8, -6, 8, 6); stroke('#bbdefb'); line(-8, 6, 8, -6); }
  else if (kind === 'pcb') { rect(-8, -7, 16, 14, 1); }
  else if (kind === 'terminal') { rect(-8, -5, 16, 10, 1); line(-3, -5, -3, 5); line(3, -5, 3, 5); }
  else if (kind === 'wheel') { fill('#fff59d'); circle(0, 0, 16); }
  else if (kind === 'battery') { rect(-9, -5, 16, 10, 1); line(8, -2, 8, 2); }
  else if (kind === 'grove') { fill('white'); rect(-8, -5, 16, 10, 2); }
  pop();
}

function drawDetailPanel() {
  const baseX = panelX() + 6;
  const pw = canvasWidth - baseX - margin;
  const px = baseX + (1 - slide) * 30; // slide in from the right
  noStroke();
  fill('#102a43');
  rect(baseX, 48, pw, drawHeight - 48 - margin, 8);

  fill('white'); textAlign(LEFT, TOP);
  if (selected >= 0) {
    push();
    drawingContext.globalAlpha = slide;
    textSize(13); fill('#9fb3c8');
    text('STEP ' + (selected + 1) + ' OF 8', px + 14, 64);
    textSize(19); fill('white');
    text(steps[selected].t, px + 14, 86, pw - 40, 60);
    textSize(14); fill('#cfe3ff');
    text(steps[selected].d, px + 14, 140, pw - 40, drawHeight - 200);
    pop();
  } else {
    textSize(15); fill('#cfe3ff');
    text('Click any step on the left to read its instructions and the mechanical reason it comes before the next step.', baseX + 14, 80, pw - 28, 200);
  }
}

function mousePressed() {
  for (let i = 0; i < 8; i++) {
    const r = rects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      selected = i; visited[i] = true; slide = 0; return;
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
  if (container) { canvasWidth = container.offsetWidth; }
}
