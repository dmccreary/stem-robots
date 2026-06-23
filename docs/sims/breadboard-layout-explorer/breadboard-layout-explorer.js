// Breadboard Layout Explorer
// CANVAS_HEIGHT: 420
// Bloom L2 (Understand): explain which holes on a breadboard are electrically
// connected. Click a terminal-strip hole to light its connected column (a-e or
// f-j); click a power rail to light the whole rail. Connections never cross the
// center IC channel.

let canvasWidth = 700;
let drawHeight = 380;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

let resetButton;
const N = 30;            // number of numbered rows drawn (representative section)
let highlight = null;     // {type, row}
let board = null;
let yLines = {};          // band y positions

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  resetButton = createButton('Reset Highlights');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(() => { highlight = null; });
  positionControls();

  describe('Top-view of a solderless breadboard. Clicking a hole highlights every hole electrically connected to it: a column of five in the a-e or f-j terminal strip, or an entire power rail. The center IC channel is not connected across.', LABEL);
}

function positionControls() { resetButton.position(10, drawHeight + 6); }

function panelX() { return canvasWidth * 0.70; }

function computeBoard() {
  const bx = margin, by = 44;
  const bw = panelX() - margin * 2;
  const bh = drawHeight - by - margin;
  board = { x: bx, y: by, w: bw, h: bh };

  // vertical bands (top to bottom): redTop, blueTop, a,b,c,d,e, gap, f,g,h,i,j, blueBot, redBot
  const top = by + 14;
  const bottom = by + bh - 14;
  const usable = bottom - top;
  // 14 hole-lines + a gap worth ~1.4 lines => 15.4 slots
  const slot = usable / 15.4;
  let y = top;
  yLines.redTop = y; y += slot;
  yLines.blueTop = y; y += slot * 1.3;
  yLines.a = y; y += slot; yLines.b = y; y += slot; yLines.c = y; y += slot;
  yLines.d = y; y += slot; yLines.e = y; y += slot;
  yLines.gapTop = y - slot * 0.2; y += slot * 1.4; yLines.gapBot = y - slot * 0.5;
  yLines.f = y; y += slot; yLines.g = y; y += slot; yLines.h = y; y += slot;
  yLines.i = y; y += slot; yLines.j = y; y += slot * 1.3;
  yLines.blueBot = y; y += slot;
  yLines.redBot = y;
}

function rowX(i) {
  const left = board.x + 28;
  const right = board.x + board.w - 14;
  return map(i, 0, N - 1, left, right);
}

function draw() {
  updateCanvasSize();
  computeBoard();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(19); textAlign(CENTER, TOP);
  text('Breadboard Layout Explorer', canvasWidth * 0.35, 10);

  // board body (cream)
  noStroke(); fill('#f5f0e1'); stroke('#d7ceb2'); strokeWeight(1);
  rect(board.x, board.y, board.w, board.h, 6);

  drawRailStripes();
  drawHoles();
  drawCenterGap();
  drawColumnLabels();
  drawInfoPanel();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawRailStripes() {
  // red and blue rail guide lines
  stroke('#e53935'); strokeWeight(2);
  line(board.x + 20, yLines.redTop, board.x + board.w - 8, yLines.redTop);
  line(board.x + 20, yLines.redBot, board.x + board.w - 8, yLines.redBot);
  stroke('#1e88e5'); strokeWeight(2);
  line(board.x + 20, yLines.blueTop, board.x + board.w - 8, yLines.blueTop);
  line(board.x + 20, yLines.blueBot, board.x + board.w - 8, yLines.blueBot);
  strokeWeight(1);
}

function holeColor(band, i) {
  if (!highlight) return '#37474f';
  const h = highlight;
  if ((h.type === 'redTop' && band === 'redTop') ||
      (h.type === 'blueTop' && band === 'blueTop') ||
      (h.type === 'redBot' && band === 'redBot') ||
      (h.type === 'blueBot' && band === 'blueBot')) return '#ffd600';
  if (h.type === 'ae' && 'abcde'.includes(band) && i === h.row) return '#ffd600';
  if (h.type === 'fj' && 'fghij'.includes(band) && i === h.row) return '#ffd600';
  return '#37474f';
}

function drawHoles() {
  const bands = ['redTop', 'blueTop', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'blueBot', 'redBot'];
  for (let band of bands) {
    const y = yLines[band];
    for (let i = 0; i < N; i++) {
      // rails skip a hole every 6 (typical) — keep simple: draw all
      const x = rowX(i);
      const c = holeColor(band, i);
      noStroke();
      if (c === '#ffd600') { drawingContext.shadowBlur = 8; drawingContext.shadowColor = '#fbc02d'; }
      fill(c);
      circle(x, y, 5.5);
      drawingContext.shadowBlur = 0;
    }
  }
  // hover hint
  const hit = hitTest(mouseX, mouseY);
  if (hit) {
    noFill(); stroke('#ff6f00'); strokeWeight(2);
    const x = rowX(hit.row);
    circle(x, yLines[hit.band], 9);
    strokeWeight(1);
  }
}

function drawCenterGap() {
  noStroke(); fill('#5d4037');
  rect(board.x + 14, yLines.gapTop, board.w - 22, yLines.gapBot - yLines.gapTop, 2);
  fill('white'); textSize(10); textAlign(CENTER, CENTER);
  text('IC channel — NOT connected across the gap', board.x + board.w / 2, (yLines.gapTop + yLines.gapBot) / 2);
}

function drawColumnLabels() {
  noStroke(); fill('#555'); textSize(10); textAlign(CENTER, CENTER);
  text('+', board.x + 12, yLines.redTop);
  text('-', board.x + 12, yLines.blueTop);
  text('-', board.x + 12, yLines.blueBot);
  text('+', board.x + 12, yLines.redBot);
  for (let L of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
    text(L, board.x + 18, yLines[L]);
  }
}

// returns {band, row} for a click/hover position
function hitTest(mx, my) {
  if (!board || mx < board.x + 22 || mx > board.x + board.w) return null;
  // nearest row index
  let row = round(map(mx, rowX(0), rowX(N - 1), 0, N - 1));
  row = constrain(row, 0, N - 1);
  // nearest band
  let best = null, bestD = 12;
  for (let band of ['redTop', 'blueTop', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'blueBot', 'redBot']) {
    const d = abs(my - yLines[band]);
    if (d < bestD) { bestD = d; best = band; }
  }
  if (!best) return null;
  return { band: best, row: row };
}

function drawInfoPanel() {
  const px = panelX();
  const pw = canvasWidth - px - margin;
  noStroke(); fill('#102a43');
  rect(px, board.y, pw, board.h, 8);
  fill('white'); textAlign(LEFT, TOP); textSize(15);
  text('Connection Details', px + 12, board.y + 12);
  textSize(13); fill('#cfe3ff');
  let msg = 'Hover to preview a hole; click to light every hole connected to it.';
  if (highlight) {
    const h = highlight;
    if (h.type === 'ae') msg = 'All five holes in this column (a–e, row ' + (h.row + 1) + ') are connected. This connection does NOT cross the center gap.';
    else if (h.type === 'fj') msg = 'All five holes in this column (f–j, row ' + (h.row + 1) + ') are connected. This connection does NOT cross the center gap.';
    else if (h.type === 'redTop' || h.type === 'redBot') msg = 'Red (+) rail: connected to 3.3 V power. Every hole along this rail shares the same voltage.';
    else msg = 'Blue (−) rail: connected to GND (0 V). Every hole along this rail shares ground.';
  }
  text(msg, px + 12, board.y + 40, pw - 24, board.h - 60);
}

function mousePressed() {
  const hit = hitTest(mouseX, mouseY);
  if (!hit) return;
  const b = hit.band;
  if ('abcde'.includes(b)) highlight = { type: 'ae', row: hit.row };
  else if ('fghij'.includes(b)) highlight = { type: 'fj', row: hit.row };
  else highlight = { type: b, row: hit.row };
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
