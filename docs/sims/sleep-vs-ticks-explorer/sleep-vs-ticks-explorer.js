// Sleep vs Timer Explorer
// CANVAS_HEIGHT: 515
// Bloom L4 (Analyze) - Compare: two robots blink an LED and watch for a wall.
// Version A uses sleep(), so it can only check the sensor when it wakes up.
// Version B uses ticks_ms()/ticks_diff(), so it checks the sensor every few ms
// and still blinks the LED on time. Drop an obstacle and compare how long each
// version takes to notice it.
// Adapted from learning-micropython/blocking-vs-nonblocking (two-timeline layout).

let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 290;
let defaultTextSize = 16;

let playButton, resetButton, speedButton, dropButton, blinkSlider, checkSlider;

const WINDOW_MS = 3000;       // time shown on the axis
const ROBOT_SPEED = 40;       // cm per second
const SLOW_MOTION = 0.25;     // 1x plays at one quarter of real time
let speedMult = 1;
let nowMs = 0;
let playing = false;
let obstacleMs = null;        // when the obstacle appears

// timeline geometry
let tlLeft = 128, tlRight = 680;
const A_TOP = 34, B_TOP = 140;
const AXIS_Y = 244;
const LANE_H = 26;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  playButton = createButton('Play');
  playButton.parent(main);
  playButton.mousePressed(togglePlay);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);
  speedButton = createButton('Speed: 1x');
  speedButton.parent(main);
  speedButton.mousePressed(cycleSpeed);
  dropButton = createButton('Drop an obstacle now');
  dropButton.parent(main);
  dropButton.mousePressed(dropObstacle);

  blinkSlider = createSlider(100, 1000, 500, 100);
  blinkSlider.parent(main);
  checkSlider = createSlider(10, 100, 20, 10);
  checkSlider.parent(main);

  positionControls();
  describe('Two timelines share a 0 to 3000 millisecond axis. Version A blinks an LED with sleep and can only read its distance sensor when it wakes up, so most of its timeline is hatched as sleeping. Version B uses a ticks_ms timer and reads the sensor every few milliseconds while still blinking the LED. An orange NOW cursor sweeps across both, and a dropped obstacle shows how long each version takes to detect it.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 45, y3 = drawHeight + 80;
  playButton.position(10, y1);
  resetButton.position(70, y1);
  speedButton.position(132, y1);
  dropButton.position(224, y1);
  blinkSlider.position(sliderLeftMargin, y2);
  blinkSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  checkSlider.position(sliderLeftMargin, y3);
  checkSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
}

function togglePlay() {
  if (nowMs >= WINDOW_MS) nowMs = 0;
  playing = !playing;
  playButton.html(playing ? 'Pause' : 'Play');
}

function resetSim() {
  playing = false;
  playButton.html('Play');
  nowMs = 0;
  obstacleMs = null;
}

function cycleSpeed() {
  speedMult = speedMult === 1 ? 2 : speedMult === 2 ? 4 : 1;
  speedButton.html('Speed: ' + speedMult + 'x');
}

function dropObstacle() {
  // Before the sweep starts, drop the obstacle at a random time instead.
  if (nowMs <= 0) obstacleMs = round(random(300, 2700));
  else obstacleMs = round(nowMs);
}

// ---------- The two robot programs ----------
// Version A: read sensor, toggle LED, sleep(interval). Wakes at k * interval.
function aWakeTimes(interval) {
  const t = [];
  for (let k = 0; k * interval <= WINDOW_MS; k++) t.push(k * interval);
  return t;
}

// Version B: check the sensor every checkMs; toggle the LED when
// ticks_diff(ticks_ms(), last) >= interval, then set last = ticks_ms().
function bSchedule(interval, checkMs) {
  const checks = [], toggles = [0];
  let last = 0;
  for (let t = 0; t <= WINDOW_MS; t += checkMs) {
    checks.push(t);
    if (t - last >= interval) { toggles.push(t); last = t; }
  }
  return { checks, toggles };
}

// First sensor read at or after time t, from a sorted list of read times.
// If none is inside the window, extend the schedule with the given period.
function firstReadAfter(times, t, period) {
  for (const r of times) if (r >= t) return r;
  let r = times[times.length - 1];
  while (r < t) r += period;
  return r;
}

function draw() {
  updateCanvasSize();
  tlLeft = 128;
  tlRight = canvasWidth - margin;

  if (playing) {
    nowMs += deltaTime * SLOW_MOTION * speedMult;
    if (nowMs >= WINDOW_MS) {
      nowMs = WINDOW_MS;
      playing = false;
      playButton.html('Play');
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(CENTER, TOP);
  text('Sleep vs Timer Explorer', canvasWidth / 2, 6);

  const interval = blinkSlider.value();
  const checkMs = checkSlider.value();
  const aTimes = aWakeTimes(interval);
  const b = bSchedule(interval, checkMs);

  drawTimelineA(interval, aTimes, checkMs);
  drawTimelineB(interval, b);
  drawAxis();
  drawFutureShade();
  drawObstacle(interval, checkMs, aTimes, b.checks);
  drawNowCursor();
  drawResults(interval, checkMs, aTimes, b.checks);
  drawControlLabels(interval, checkMs);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function tx(t) { return map(t, 0, WINDOW_MS, tlLeft, tlRight); }

function drawLaneFrame(top, title, code) {
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(title, 10, top);
  textStyle(NORMAL);
  push();
  textFont('monospace');
  textSize(13);
  fill('midnightblue');
  text(code, 10 + textWidthBold(title) + 14, top + 2);
  pop();
  // lane labels and backgrounds
  const ledY = top + 22, chkY = top + 22 + LANE_H + 6;
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('LED blink', 10, ledY + LANE_H / 2);
  text('Obstacle check', 10, chkY + LANE_H / 2);
  stroke('silver');
  fill('white');
  rect(tlLeft, ledY, tlRight - tlLeft, LANE_H);
  rect(tlLeft, chkY, tlRight - tlLeft, LANE_H);
  noStroke();
  return { ledY, chkY };
}

function textWidthBold(s) {
  push();
  textSize(15);
  textStyle(BOLD);
  const w = textWidth(s);
  pop();
  return w;
}

function drawLedBlocks(ledY, toggles) {
  // LED starts ON at t = 0 and flips at every toggle time after that
  let on = true;
  for (let k = 0; k < toggles.length; k++) {
    const t0 = toggles[k];
    const t1 = k + 1 < toggles.length ? toggles[k + 1] : WINDOW_MS;
    if (k > 0) on = !on;
    fill(on ? 'limegreen' : 'lightgray');
    rect(tx(t0), ledY + 3, max(1, tx(t1) - tx(t0)), LANE_H - 6);
  }
}

function drawTimelineA(interval, aTimes, checkMs) {
  const { ledY, chkY } = drawLaneFrame(A_TOP, 'Version A: sleep(' + (interval / 1000) + ')',
    'led.toggle(); sleep(' + (interval / 1000) + ')');
  drawLedBlocks(ledY, aTimes);

  // sleep periods: hatched bar across both lanes
  const top = ledY, bot = chkY + LANE_H;
  for (let k = 0; k < aTimes.length; k++) {
    const x0 = tx(aTimes[k]) + 3;
    const x1 = k + 1 < aTimes.length ? tx(aTimes[k + 1]) : tx(WINDOW_MS);
    if (x1 - x0 < 2) continue;
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(x0, top, x1 - x0, bot - top);
    drawingContext.clip();
    stroke(90, 90, 90, 110);
    strokeWeight(1);
    for (let hx = x0 - (bot - top); hx < x1; hx += 7) line(hx, bot, hx + (bot - top), top);
    drawingContext.restore();
  }
  noStroke();

  // missed chances to check: red dashed outlines at version B's check times
  // (thinned to one mark per 100 ms or more so the lane stays readable)
  const spacing = ceil(max(100, 8 * WINDOW_MS / (tlRight - tlLeft)) / checkMs) * checkMs;
  stroke('crimson');
  strokeWeight(1);
  drawingContext.setLineDash([2, 2]);
  noFill();
  for (let t = 0; t <= WINDOW_MS; t += spacing) {
    if (aTimes.includes(t)) continue;
    rect(tx(t) - 1.5, chkY + 5, 3, LANE_H - 10);
  }
  drawingContext.setLineDash([]);
  noStroke();

  // sensor reads when the robot wakes up
  fill('blue');
  for (const t of aTimes) rect(tx(t) - 2, chkY + 2, 4, LANE_H - 4);

  // label for the sleeping bar
  fill(255, 255, 255, 220);
  const label = 'sleeping - can\'t do anything else';
  textSize(12);
  const lw = textWidth(label) + 10;
  const lx = tlLeft + (tlRight - tlLeft) / 2 - lw / 2;
  rect(lx, chkY + LANE_H / 2 - 9, lw, 18, 4);
  fill('dimgray');
  textAlign(CENTER, CENTER);
  text(label, lx + lw / 2, chkY + LANE_H / 2);
}

function drawTimelineB(interval, b) {
  const { ledY, chkY } = drawLaneFrame(B_TOP, 'Version B: ticks_ms timer',
    'if ticks_diff(ticks_ms(), last) >= ' + interval + ':');
  drawLedBlocks(ledY, b.toggles);
  stroke('blue');
  strokeWeight(1);
  for (const t of b.checks) line(tx(t), chkY + 4, tx(t), chkY + LANE_H - 4);
  noStroke();
}

function drawAxis() {
  const y = AXIS_Y;
  stroke('gray');
  line(tlLeft, y, tlRight, y);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (let t = 0; t <= WINDOW_MS; t += 500) {
    stroke('gray');
    line(tx(t), y - 4, tx(t), y + 4);
    noStroke();
    const wide = tlRight - tlLeft > 420;
    text(t === WINDOW_MS && wide ? '3000 ms' : t, tx(t) - (t === WINDOW_MS && wide ? 16 : 0), y + 6);
  }
}

// Dim the part of both timelines that NOW has not reached yet.
function drawFutureShade() {
  const x = tx(nowMs);
  if (x >= tlRight) return;
  noStroke();
  fill(240, 248, 255, 190);
  rect(x, A_TOP + 20, tlRight - x + 1, 2 * LANE_H + 12);
  rect(x, B_TOP + 20, tlRight - x + 1, 2 * LANE_H + 12);
}

function drawNowCursor() {
  const x = tx(nowMs);
  stroke('darkorange');
  strokeWeight(3);
  // two segments so the cursor never crosses the version titles
  line(x, A_TOP + 20, x, A_TOP + 22 + 2 * LANE_H + 20);
  line(x, B_TOP + 20, x, AXIS_Y);
  strokeWeight(1);
  noStroke();
  fill('darkorange');
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('NOW ' + round(nowMs) + ' ms', constrain(x, tlLeft + 36, tlRight - 36), AXIS_Y + 21);
  textStyle(NORMAL);
}

function drawObstacle(interval, checkMs, aTimes, bChecks) {
  if (obstacleMs === null) return;
  const x = tx(obstacleMs);
  const aDet = firstReadAfter(aTimes, obstacleMs, interval);
  const bDet = firstReadAfter(bChecks, obstacleMs, checkMs);
  const rows = [
    { chkY: A_TOP + 22 + LANE_H + 6, det: aDet },
    { chkY: B_TOP + 22 + LANE_H + 6, det: bDet }
  ];
  for (const r of rows) {
    // red triangle where the obstacle appears
    fill('red');
    noStroke();
    triangle(x, r.chkY + LANE_H, x - 7, r.chkY + LANE_H + 12, x + 7, r.chkY + LANE_H + 12);
    // once NOW passes the detection time, show the delay arrow
    if (nowMs >= r.det || nowMs >= WINDOW_MS) {
      const xd = min(tx(r.det), tlRight);
      stroke('gold');
      strokeWeight(4);
      line(x, r.chkY + LANE_H + 6, xd, r.chkY + LANE_H + 6);
      strokeWeight(1);
      noStroke();
      fill('goldenrod');
      triangle(xd, r.chkY + LANE_H + 6, xd - 8, r.chkY + LANE_H + 1, xd - 8, r.chkY + LANE_H + 11);
      // delay in ms next to the arrow tip
      fill('black');
      textSize(12);
      textStyle(BOLD);
      textAlign(LEFT, TOP);
      text((r.det - obstacleMs) + ' ms', min(max(xd, x + 8) + 4, tlRight - 44), r.chkY + LANE_H + 1);
      textStyle(NORMAL);
    }
  }
  // label to the left of the upper triangle (the delay arrow points right)
  fill('red');
  textSize(12);
  const chkA = A_TOP + 22 + LANE_H + 6;
  if (x - tlLeft > 110) {
    textAlign(RIGHT, TOP);
    text('Obstacle appears', x - 10, chkA + LANE_H + 1);
  } else {
    textAlign(LEFT, TOP);
    text('Obstacle appears', tlRight - 100, chkA + LANE_H + 1);
  }
}

function drawResults(interval, checkMs, aTimes, bChecks) {
  const y = AXIS_Y + 42;
  const h = drawHeight - y - 8;
  stroke('silver');
  fill('white');
  rect(10, y, canvasWidth - 20, h, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(15);
  if (obstacleMs === null) {
    fill('dimgray');
    text('Press "Drop an obstacle now" while the NOW cursor moves (or before you press Play for a random time). Then compare how fast each version notices it.', 22, y + 10, canvasWidth - 44, h - 14);
  } else {
    const aDelay = firstReadAfter(aTimes, obstacleMs, interval) - obstacleMs;
    const bDelay = firstReadAfter(bChecks, obstacleMs, checkMs) - obstacleMs;
    const doneA = nowMs >= obstacleMs + aDelay || nowMs >= WINDOW_MS;
    const doneB = nowMs >= obstacleMs + bDelay || nowMs >= WINDOW_MS;
    fill('black');
    textStyle(BOLD);
    text('Obstacle at ' + obstacleMs + ' ms.  Detection delay:  A = ' +
      (doneA ? aDelay + ' ms' : '...') + ',  B = ' + (doneB ? bDelay + ' ms' : '...'), 22, y + 10, canvasWidth - 44);
    textStyle(NORMAL);
    if (doneA) {
      const cmA = nf(ROBOT_SPEED * aDelay / 1000, 1, 1);
      const cmB = nf(ROBOT_SPEED * bDelay / 1000, 1, 1);
      fill('firebrick');
      text('At 40 cm/s, Robot A traveled ' + cmA + ' cm before it noticed. Robot B traveled ' + cmB + ' cm.', 22, y + 34, canvasWidth - 44);
    }
  }
  drawLegend(22, y + h - 22);
  if (interval > 500) {
    fill('darkorange');
    textStyle(BOLD);
    textAlign(RIGHT, BOTTOM);
    textAlign(LEFT, TOP);
    textSize(15);
    text('Longer sleep = a longer blind spot.', 22, y + 56);
    textStyle(NORMAL);
  }
}

// One-line key for the timeline symbols
function drawLegend(x, y) {
  textSize(12);
  textAlign(LEFT, CENTER);
  const items = [
    ['limegreen', 'LED on'],
    ['blue', 'sensor read'],
    ['crimson', 'missed check (asleep)'],
    ['gray', 'sleeping'],
    ['gold', 'detection delay']
  ];
  let lx = x;
  for (const [c, label] of items) {
    if (lx + textWidth(label) + 20 > canvasWidth - 20) break;
    noStroke();
    fill(c);
    rect(lx, y + 3, 12, 12, 2);
    fill('dimgray');
    text(label, lx + 16, y + 9);
    lx += textWidth(label) + 32;
  }
}

function drawControlLabels(interval, checkMs) {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Blink interval: ' + interval + ' ms', 12, drawHeight + 55);
  text('Sensor check every: ' + checkMs + ' ms (B)', 12, drawHeight + 90);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
