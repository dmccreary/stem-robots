// Heading Error and Steering Explorer
// CANVAS_HEIGHT: 560
// Bloom L3 (Apply): calculate the shortest-turn heading error with wrap-around,
// then predict the left and right motor speeds that steer() returns for that
// error and Kp. Mirrors the chapter's follower code exactly:
//   heading_error(target, current) = (target - current + 180) % 360 - 180
//   steer(error, base_speed, Kp): turn = Kp * error, left/right clamped to 0..1

let canvasWidth = 800;
let drawHeight = 445;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

let currentSlider, targetSlider, baseSlider, kpSlider;
let naiveCheckbox, playButton, resetButton;

let cur = 350;              // current heading (float so the replay can turn smoothly)
let dragging = null;        // 'current' | 'target' | null
let playing = false;
let tickTimer = 0;
let ticks = 0;
let history = [];           // error after each replay tick
let replayNote = '';
const TICK_MS = 100;        // one 50 ms robot tick, shown at half speed
const MAX_TICKS = 60;       // stop a swinging replay after 60 ticks (3 s of robot time)

// geometry (recomputed each frame)
let dialCx, dialCy, dialR, panelX, panelW, legendY;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  currentSlider = createSlider(0, 359, 350, 1);
  currentSlider.parent(document.querySelector('main'));
  currentSlider.input(() => { cur = currentSlider.value(); stopReplay(); });

  targetSlider = createSlider(0, 359, 20, 1);
  targetSlider.parent(document.querySelector('main'));
  targetSlider.input(stopReplay);

  baseSlider = createSlider(0, 1, 0.5, 0.05);
  baseSlider.parent(document.querySelector('main'));
  kpSlider = createSlider(0.005, 0.1, 0.02, 0.005);
  kpSlider.parent(document.querySelector('main'));

  naiveCheckbox = createCheckbox(' Show naive error (no wrap-around)', true);
  naiveCheckbox.parent(document.querySelector('main'));
  naiveCheckbox.style('font-size', '15px');

  playButton = createButton('Play turn');
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(startReplay);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  positionControls();
  describe('A compass dial with a green arrow for the follower robot\'s current heading and a ' +
    'purple arrow for the target heading from the master. A solid blue arc shows the shorter ' +
    'turn and a dashed gray arc the long way around. A panel shows each step of ' +
    'heading_error(): target minus current, plus 180, modulo 360, minus 180. Two bars show the ' +
    'left and right motor speeds returned by steer(), and Play turn replays the robot turning.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 600;
  const colW = canvasWidth / 2;
  const lblW = narrow ? 104 : 170;
  const sw = max(40, colW - lblW - 16);
  currentSlider.position(margin + lblW, drawHeight + 10); currentSlider.size(sw);
  targetSlider.position(colW + lblW, drawHeight + 10); targetSlider.size(sw);
  baseSlider.position(margin + lblW, drawHeight + 45); baseSlider.size(sw);
  kpSlider.position(colW + lblW, drawHeight + 45); kpSlider.size(sw);
  const span = naiveCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Naive error' : ' Show naive error (no wrap-around)';
  naiveCheckbox.position(margin, drawHeight + 82);
  const bx = narrow ? colW : colW + 40;
  playButton.position(bx, drawHeight + 80);
  resetButton.position(bx + playButton.elt.offsetWidth + 10, drawHeight + 80);
}

// ---------------------------------------------------------------- math (matches the chapter)
function pyMod(a, n) { return ((a % n) + n) % n; }   // Python-style %, never negative

function headingError(target, current) {
  return pyMod(target - current + 180, 360) - 180;
}

function steer(error, base, kp) {
  const turn = kp * error;
  return {
    turn: turn,
    rawLeft: base + turn, rawRight: base - turn,
    left: constrain(base + turn, 0, 1), right: constrain(base - turn, 0, 1)
  };
}

function fmt(v) {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
function signed(v) { const s = fmt(v); return v > 0 ? '+' + s : s; }

// ---------------------------------------------------------------- replay
function startReplay() {
  if (abs(headingError(targetSlider.value(), cur)) < 2) {
    replayNote = 'Already lined up: error is under 2 degrees.';
    return;
  }
  playing = true; tickTimer = 0; ticks = 0; replayNote = '';
  history = [headingError(targetSlider.value(), cur)];
}

function stopReplay() { playing = false; }

function resetAll() {
  stopReplay();
  cur = 350;
  currentSlider.value(350); targetSlider.value(20);
  baseSlider.value(0.5); kpSlider.value(0.02);
  naiveCheckbox.checked(true);
  history = []; replayNote = '';
}

function replayTick() {
  const e = headingError(targetSlider.value(), cur);
  const s = steer(e, baseSlider.value(), kpSlider.value());
  cur = pyMod(cur + (s.left - s.right) * 20, 360);   // each 50 ms tick turns (left - right) x 20 degrees
  currentSlider.value(Math.round(cur) % 360);
  ticks++;
  const e2 = headingError(targetSlider.value(), cur);
  history.push(e2);
  if (abs(e2) < 2) {
    playing = false;
    replayNote = 'Lined up after ' + ticks + ' ticks (' + nf(ticks * 0.05, 1, 2) + ' s).';
  } else if (ticks >= MAX_TICKS) {
    playing = false;
    replayNote = 'Still swinging after 3 s: Kp is too high.';
  }
}

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();
  if (playing) {
    tickTimer += deltaTime;
    while (playing && tickTimer >= TICK_MS) { tickTimer -= TICK_MS; replayTick(); }
  }

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Wide: dial on the left, calculation and motor panels stacked on the right.
  // Narrow: small dial and motor panel side by side, calculation panel below.
  let calcBox, motorBox;
  if (canvasWidth >= 640) {
    const dialW = min(380, canvasWidth * 0.46);
    dialCx = dialW / 2; dialCy = 236; dialR = min(dialW / 2 - 46, 142);
    legendY = dialCy + dialR + 32;
    panelX = dialW + 6; panelW = canvasWidth - panelX - 10;
    calcBox = [panelX, 40, panelW, 214];
    motorBox = [panelX, 262, panelW, drawHeight - 270];
  } else {
    const dialW = canvasWidth * 0.46;
    dialCx = dialW / 2; dialCy = 128; dialR = min(dialW / 2 - 34, 72);
    legendY = dialCy + dialR + 30;
    calcBox = [8, 258, canvasWidth - 16, drawHeight - 266];
    motorBox = [dialW + 4, 34, canvasWidth - dialW - 12, 218];
  }

  const target = targetSlider.value();
  const err = headingError(target, cur);
  const st = steer(err, baseSlider.value(), kpSlider.value());

  noStroke(); fill('black'); textSize(canvasWidth < 600 ? 17 : 22); textAlign(LEFT, TOP);
  text(canvasWidth < 600 ? 'Heading Error and Steering' : 'Heading Error and Steering Explorer', margin, 8);

  drawDial(target, err);
  drawCalcPanel(target, err, calcBox);
  drawMotorPanel(err, st, motorBox);
  drawControlLabels();
}

function angOf(h) { return radians(h - 90); }        // compass heading -> canvas angle

function drawArrow(h, len, col, weight) {
  const a = angOf(h);
  const x2 = dialCx + cos(a) * len, y2 = dialCy + sin(a) * len;
  stroke(col); strokeWeight(weight);
  line(dialCx, dialCy, x2, y2);
  noStroke(); fill(col);
  push(); translate(x2, y2); rotate(a);
  triangle(0, 0, -14, -7, -14, 7);
  pop();
}

function drawDial(target, err) {
  // dial face
  fill('white'); stroke('slategray'); strokeWeight(2);
  circle(dialCx, dialCy, dialR * 2);
  // tick marks every 10 degrees, labels every 90
  for (let d = 0; d < 360; d += 10) {
    const a = angOf(d);
    const r1 = dialR - (d % 30 === 0 ? 12 : 6);
    stroke('slategray'); strokeWeight(d % 90 === 0 ? 2 : 1);
    line(dialCx + cos(a) * r1, dialCy + sin(a) * r1, dialCx + cos(a) * dialR, dialCy + sin(a) * dialR);
  }
  const marks = [['N', 0], ['E', 90], ['S', 180], ['W', 270]];
  noStroke(); fill('black'); textSize(canvasWidth < 640 ? 12 : 14); textAlign(CENTER, CENTER); textStyle(BOLD);
  for (const [m, d] of marks) {
    const a = angOf(d);
    text(m + ' ' + d, dialCx + cos(a) * (dialR + 17), dialCy + sin(a) * (dialR + 12));
  }
  textStyle(NORMAL);

  // turn arcs: short way solid blue, long way dashed gray
  const rArc = dialR * 0.62;
  const c = cur, t = c + err;
  noFill();
  if (abs(err) > 0.05) {
    stroke('gray'); strokeWeight(2);
    drawingContext.setLineDash([6, 6]);
    if (err > 0) arc(dialCx, dialCy, rArc * 2.3, rArc * 2.3, angOf(t), angOf(c));
    else arc(dialCx, dialCy, rArc * 2.3, rArc * 2.3, angOf(c), angOf(t));
    drawingContext.setLineDash([]);
    stroke('royalblue'); strokeWeight(5);
    if (err > 0) arc(dialCx, dialCy, rArc * 2, rArc * 2, angOf(c), angOf(t));
    else arc(dialCx, dialCy, rArc * 2, rArc * 2, angOf(t), angOf(c));
    // labels at the middle of each arc
    const midShort = c + err / 2;
    const longErr = err > 0 ? err - 360 : err + 360;
    const midLong = c + longErr / 2;
    noStroke(); textSize(14); textStyle(BOLD); textAlign(CENTER, CENTER);
    fill('royalblue');
    const a1 = angOf(midShort);
    text(signed(err), dialCx + cos(a1) * (rArc - 18), dialCy + sin(a1) * (rArc - 18));
    fill('gray');
    const a2 = angOf(midLong);
    const rLong = rArc * 1.15 + (canvasWidth < 640 ? -12 : 16);
    text(signed(longErr), dialCx + cos(a2) * rLong, dialCy + sin(a2) * rLong);
    textStyle(NORMAL);
  }

  drawArrow(target, dialR - 4, 'purple', 4);
  drawArrow(cur, dialR - 4, 'green', 4);

  // small robot in the center, rotated to the current heading
  push();
  translate(dialCx, dialCy); rotate(angOf(cur) + HALF_PI);
  stroke('black'); strokeWeight(1.5); fill('olivedrab');
  rectMode(CENTER); rect(0, 0, 26, 32, 5);
  fill('dimgray'); rect(-15, 4, 6, 16, 2); rect(15, 4, 6, 16, 2);
  fill('white'); triangle(0, -14, -6, -4, 6, -4);
  rectMode(CORNER);
  pop();

  // legend under the dial: color swatches name the two arrows
  const ly = legendY;
  const small = canvasWidth < 640;
  textSize(small ? 12 : 14); textAlign(LEFT, CENTER);
  strokeWeight(4);
  stroke('green'); line(margin, ly, margin + 18, ly);
  noStroke(); fill('green'); text('current ' + fmt(cur) + '°', margin + 24, ly);
  const lx2 = small ? margin : margin + 24 + textWidth('current 000.0°') + 12;
  const ly2 = small ? ly + 18 : ly;
  strokeWeight(4); stroke('purple'); line(lx2, ly2, lx2 + 18, ly2);
  noStroke(); fill('purple'); text('target ' + target + '°', lx2 + 24, ly2);
  fill('dimgray'); textSize(small ? 11 : 13);
  if (!small) text('Drag either arrow to change it.', margin, ly2 + 20);
}

function drawCalcPanel(target, err, box) {
  const [x, y, w, h] = box;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, h, 8);
  const small = canvasWidth < 640;
  const fs = small ? 12 : 15;
  noStroke(); fill('indigo'); textSize(fs); textStyle(BOLD); textAlign(LEFT, TOP);
  text('heading_error(' + target + ', ' + fmt(cur) + ')', x + 10, y + 8);
  textStyle(NORMAL);

  const d1 = target - cur, d2 = d1 + 180, d3 = pyMod(d2, 360), d4 = d3 - 180;
  const rows = [
    ['target - current', target + ' - ' + fmt(cur) + ' = ' + fmt(d1)],
    ['+ 180', fmt(d1) + ' + 180 = ' + fmt(d2)],
    ['% 360', fmt(d2) + ' % 360 = ' + fmt(d3)],
    ['- 180', fmt(d3) + ' - 180 = ' + fmt(d4)]
  ];
  textFont('monospace'); textSize(fs);
  const col2 = x + 10 + textWidth('target - current') + 12;
  for (let i = 0; i < rows.length; i++) {
    const ry = y + 34 + i * (fs + 9);
    fill('dimgray'); text(rows[i][0], x + 10, ry);
    fill('black'); text(rows[i][1], col2, ry);
  }
  textFont('sans-serif');

  // result
  const ry = y + 34 + 4 * (fs + 9) + 4;
  fill('royalblue'); textStyle(BOLD); textSize(fs + 2);
  let say;
  if (abs(err) >= 179.95) say = 'Either way is the same length';
  else if (abs(err) < 0.05) say = 'On target: no turn';
  else say = 'Turn ' + (err > 0 ? 'right ' : 'left ') + fmt(abs(err)) + '°';
  text('error = ' + signed(err) + '   ' + say, x + 10, ry);
  textStyle(NORMAL);

  // naive comparison
  if (naiveCheckbox.checked()) {
    const naive = target - cur;
    const differs = abs(naive - err) > 0.05;
    fill(differs ? 'crimson' : 'gray'); textSize(small ? 11 : 14);
    const msg = 'Without wrap-around: target - current = ' + signed(naive) +
      (differs ? ', so the robot would turn the long way (' + fmt(abs(naive)) + '°).' : ', the same answer here.');
    text(msg, x + 10, ry + fs + 12, w - 20, 44);
  }
}

function drawMotorPanel(err, st, box) {
  const [x, y, w, h] = box;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, h, 8);
  const small = canvasWidth < 640;
  const clippedAny = st.rawLeft > 1 || st.rawLeft < 0 || st.rawRight > 1 || st.rawRight < 0;
  let note = '', noteCol = 'forestgreen';
  if (clippedAny) { note = 'Kp is too high: the robot pivots hard.'; noteCol = 'crimson'; }
  else if (abs(err) > 0.05) {
    note = (err > 0 ? 'Left' : 'Right') + ' motor is faster, so the robot turns ' + (err > 0 ? 'right.' : 'left.');
  }

  // title: one line when it fits, otherwise two
  const t1 = 'steer(): turn = Kp × error';
  const t2 = '= ' + nf(kpSlider.value(), 1, 3) + ' × ' + fmt(err) + ' = ' + nf(st.turn, 1, 2);
  noStroke(); fill('indigo'); textSize(small ? 12 : 15); textStyle(BOLD); textAlign(LEFT, TOP);
  let barTop, barH;
  if (textWidth(t1 + ' ' + t2) < w - 20) {
    text(t1 + ' ' + t2, x + 10, y + 7);
    barTop = y + 40; barH = h - 100;
  } else {
    text(t1, x + 8, y + 6); text(t2, x + 8, y + 22);
    textStyle(NORMAL); textSize(11); fill(noteCol);
    text(playing ? 'Turning... tick ' + ticks : (replayNote || note), x + 8, y + 40, w - 16, 30);
    barTop = y + 74; barH = h - 124;
  }
  textStyle(NORMAL);

  // two vertical bars, 0 to 1 (green, or gray when steer() clamped the value)
  const barW = small ? 24 : 34;
  const bars = [['Left', st.left, st.rawLeft], ['Right', st.right, st.rawRight]];
  for (let i = 0; i < 2; i++) {
    const bx = x + 22 + i * (small ? 62 : 96);
    const [name, v, raw] = bars[i];
    fill('whitesmoke'); stroke('silver'); rect(bx, barTop, barW, barH);
    const clipped = abs(raw - v) > 1e-9;
    noStroke(); fill(clipped ? 'gray' : 'forestgreen');
    rect(bx, barTop + barH * (1 - v), barW, barH * v);
    noStroke(); fill('black'); textSize(small ? 11 : 13); textAlign(CENTER, TOP);
    text(name + ' ' + nf(v, 1, 2), bx + barW / 2, barTop + barH + 4);
    fill('dimgray');
    text(Math.round(v * 65535) + ' duty', bx + barW / 2, barTop + barH + (small ? 17 : 20));
    if (clipped) {
      fill('crimson');
      text('(was ' + nf(raw, 1, 2) + ')', bx + barW / 2, barTop + barH + (small ? 30 : 36));
    }
  }
  noStroke(); fill('dimgray'); textSize(11); textAlign(RIGHT, CENTER);
  text('1', x + 17, barTop); text('0', x + 17, barTop + barH);

  // wide layout: note and replay history to the right of the bars
  if (barTop === y + 40) {
    const nx = x + 222, nw = x + w - nx - 10;
    textAlign(LEFT, TOP); textSize(13);
    if (note) {
      fill(noteCol); if (clippedAny) textStyle(BOLD);
      text(note, nx, y + 34, nw, 40);
      textStyle(NORMAL);
    }
    drawHistory(nx, y + 70, nw, h - 78);
  }
}

// Error after each replay tick: a steady shrink means a calm turn,
// sign flips mean the robot is swinging back and forth.
function drawHistory(x, y, w, h) {
  if (w < 60 || h < 40) return;
  noStroke(); fill('black'); textSize(12); textAlign(LEFT, TOP);
  text('Replay: error each tick', x, y);
  const gy = y + 16, gh = h - 30;
  fill('whitesmoke'); stroke('silver'); rect(x, gy, w, gh);
  stroke('silver'); line(x, gy + gh / 2, x + w, gy + gh / 2);
  noStroke(); fill('dimgray'); textSize(10); textAlign(RIGHT, CENTER);
  if (history.length > 0) {
    const maxE = max(10, ...history.map(abs));
    stroke('royalblue'); strokeWeight(2); noFill();
    beginShape();
    for (let i = 0; i < history.length; i++) {
      vertex(x + map(i, 0, MAX_TICKS, 2, w - 2), gy + gh / 2 - (history[i] / maxE) * (gh / 2 - 3));
    }
    endShape();
    noStroke();
  }
  noStroke(); fill(replayNote.startsWith('Still') ? 'crimson' : 'black'); textSize(12); textAlign(LEFT, TOP);
  const status = playing ? 'Turning... tick ' + ticks : (replayNote || 'Press Play turn');
  text(status, x, gy + gh + 2, w, 16);
}

function drawControlLabels() {
  const narrow = canvasWidth < 600;
  const colW = canvasWidth / 2;
  noStroke(); fill('black'); textSize(narrow ? 13 : 15); textAlign(LEFT, CENTER);
  text((narrow ? 'Current: ' : 'Current heading: ') + fmt(cur) + '°', margin, drawHeight + 20);
  text((narrow ? 'Target: ' : 'Target heading: ') + targetSlider.value() + '°', colW, drawHeight + 20);
  text('Base speed: ' + nf(baseSlider.value(), 1, 2), margin, drawHeight + 55);
  text('Kp: ' + nf(kpSlider.value(), 1, 3), colW, drawHeight + 55);
}

// ---------------------------------------------------------------- drag the arrows
function mousePressed() {
  const d = dist(mouseX, mouseY, dialCx, dialCy);
  if (d > dialR + 20 || d < 12 || mouseY > drawHeight) return;
  const h = mouseHeading();
  const dc = abs(headingError(h, cur)), dt = abs(headingError(h, targetSlider.value()));
  dragging = dc <= dt ? 'current' : 'target';
  stopReplay();
  mouseDragged();
}

function mouseDragged() {
  if (!dragging) return;
  const h = Math.round(mouseHeading()) % 360;
  if (dragging === 'current') { cur = h; currentSlider.value(h); }
  else targetSlider.value(h);
}

function mouseReleased() { dragging = null; }

function mouseHeading() {
  return pyMod(degrees(atan2(mouseY - dialCy, mouseX - dialCx)) + 90, 360);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.min(800, container.offsetWidth);
}
