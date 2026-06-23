// Robot Main Loop Timing
// CANVAS_HEIGHT: 400
// Bloom L2 (Understand): each loop iteration has distinct phases, and
// time.sleep_ms() dominates the period and sets the polling rate.

let canvasWidth = 700;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let speedButton;
const speeds = [1, 5, 10];
let speedIdx = 0;

// Phases: name, duration(ms), color, function
const phases = [
  { name: 'Read sensor', ms: 5, col: '#1e88e5', fn: 'distance = sensor.read()' },
  { name: 'Make decision', ms: 1, col: '#fb8c00', fn: 'action = decide(distance)' },
  { name: 'Move motor', ms: 2, col: '#43a047', fn: 'set_motors(action)' },
  { name: 'Sleep 100 ms', ms: 100, col: '#9e9e9e', fn: 'time.sleep_ms(100)' }
];
const TOTAL = phases.reduce((a, p) => a + p.ms, 0); // 108 ms

let nowMs = 0;
let loopCount = 1;
let lastFrameMs = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  speedButton = createButton('Speed: 1x');
  speedButton.parent(document.querySelector('main'));
  speedButton.mousePressed(() => {
    speedIdx = (speedIdx + 1) % speeds.length;
    speedButton.html('Speed: ' + speeds[speedIdx] + 'x');
  });
  positionControls();
  describe('Animated timeline of one robot main-loop iteration showing four phases — read sensor, make decision, move motor, and a 100 ms sleep — with a moving NOW cursor and a loop counter.', LABEL);
}

function positionControls() { speedButton.position(10, drawHeight + 12); }

function timelineRect() {
  return { x: margin, y: 150, w: canvasWidth - 2 * margin, h: 90 };
}

function msToX(ms, tl) { return tl.x + (ms / TOTAL) * tl.w; }

function draw() {
  updateCanvasSize();

  // advance time by real elapsed * speed
  const t = millis();
  let dt = t - lastFrameMs; lastFrameMs = t;
  dt = constrain(dt, 0, 50);
  nowMs += (dt / 1000) * 1000 * 0.4 * speeds[speedIdx]; // 0.4 scales 1x to a watchable pace
  if (nowMs >= TOTAL) { nowMs -= TOTAL; loopCount++; }

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('Robot Main Loop — One Iteration (108 ms)', canvasWidth / 2, 10);

  // loop counter top-right
  textSize(15); textAlign(RIGHT, TOP); fill('#102a43');
  text('Loop #: ' + loopCount, canvasWidth - margin, 44);

  const tl = timelineRect();
  drawSegments(tl);
  drawAxis(tl);
  drawNowCursor(tl);
  drawHoverTooltip(tl);

  // legend / note
  noStroke(); fill('#555'); textSize(13); textAlign(LEFT, TOP);
  text('The 100 ms sleep dominates the loop — it sets the polling rate (~9 loops/second). Hover a segment for its code and duration.',
       margin, 270, canvasWidth - 2 * margin, 60);

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawSegments(tl) {
  let acc = 0;
  for (let p of phases) {
    const x1 = msToX(acc, tl);
    const x2 = msToX(acc + p.ms, tl);
    const w = max(2, x2 - x1);
    const active = nowMs >= acc && nowMs < acc + p.ms;
    stroke('white'); strokeWeight(1);
    fill(p.col);
    if (active) { drawingContext.shadowBlur = 14; drawingContext.shadowColor = p.col; }
    rect(x1, tl.y, w, tl.h, 3);
    drawingContext.shadowBlur = 0;
    // label inside if wide enough
    noStroke(); fill('white'); textSize(11); textAlign(CENTER, CENTER);
    if (w > 60) text(p.name + '\n' + p.ms + ' ms', x1 + w / 2, tl.y + tl.h / 2);
    acc += p.ms;
  }
  // labels for narrow segments above the bar
  acc = 0;
  for (let p of phases) {
    const x1 = msToX(acc, tl);
    const x2 = msToX(acc + p.ms, tl);
    if ((x2 - x1) <= 60) {
      noStroke(); fill(p.col); textSize(10); textAlign(LEFT, BOTTOM);
      push(); translate(x1, tl.y - 4); rotate(-PI / 6);
      text(p.name + ' (' + p.ms + 'ms)', 0, 0); pop();
    }
    acc += p.ms;
  }
}

function drawAxis(tl) {
  stroke('#90a4ae'); strokeWeight(1);
  line(tl.x, tl.y + tl.h + 6, tl.x + tl.w, tl.y + tl.h + 6);
  noStroke(); fill('#555'); textSize(11); textAlign(CENTER, TOP);
  for (let ms = 0; ms <= TOTAL; ms += 20) {
    const x = msToX(ms, tl);
    stroke('#90a4ae'); line(x, tl.y + tl.h + 4, x, tl.y + tl.h + 9);
    noStroke(); text(ms + ' ms', x, tl.y + tl.h + 12);
  }
}

function drawNowCursor(tl) {
  const x = msToX(nowMs, tl);
  stroke('#d32f2f'); strokeWeight(2);
  line(x, tl.y - 12, x, tl.y + tl.h + 6);
  noStroke(); fill('#d32f2f');
  triangle(x - 6, tl.y - 12, x + 6, tl.y - 12, x, tl.y - 4);
  textSize(11); textAlign(CENTER, BOTTOM);
  text('NOW', x, tl.y - 14);
}

function drawHoverTooltip(tl) {
  if (mouseY < tl.y || mouseY > tl.y + tl.h) return;
  let acc = 0;
  for (let p of phases) {
    const x1 = msToX(acc, tl), x2 = msToX(acc + p.ms, tl);
    if (mouseX >= x1 && mouseX <= x2) {
      const msg = p.name + '  •  ' + p.fn + '  •  ~' + p.ms + ' ms';
      const tw = min(360, textWidth(msg) + 20);
      let tx = mouseX + 10; if (tx + tw > canvasWidth) tx = canvasWidth - tw - 4;
      const ty = tl.y + tl.h + 36;
      noStroke(); fill('#102a43'); rect(tx, ty, tw, 30, 6);
      fill('white'); textSize(12); textAlign(LEFT, CENTER);
      text(msg, tx + 8, ty + 15);
      return;
    }
    acc += p.ms;
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
