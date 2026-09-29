// Cooperative Multitasking Timeline
// CANVAS_HEIGHT: 560
// Bloom L4 (Analyze - Compare): compare a blocking loop that calls time.sleep()
// with cooperative uasyncio tasks that pause at await, and predict which
// outside events (BLE messages, obstacles) the blocking program handles late.
// Adapted from learning-micropython/blocking-vs-nonblocking (same author):
// keeps its lane timeline and blocked/free coloring, adds the robot's three
// jobs, event markers, and on-time / late counters.

let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

// ---- timing model (all times in seconds) ----
const WINDOW_S = 4;          // one page of the timeline shows 4 seconds
const ON_TIME_MS = 50;       // handled within 50 ms counts as "on time"
const BLINK_WORK = 0.001;    // led.toggle() takes about 1 ms
const BLE_WORK = 0.001;      // check_ble_messages() takes about 1 ms
const SENSOR_PAUSE = 0.02;   // the sensor task awaits 0.02 s between reads

const KIND_COLOR = {
  blink: 'royalblue',
  ble: 'forestgreen',
  sensor: 'darkorange',
  sleep: 'crimson',
  idle: 'gainsboro'
};

// ---- controls ----
let playButton, resetButton, bleButton, obstacleButton, randomButton;
let longSleepCheckbox, blinkSlider, pollSlider, sensorSlider;

// ---- simulation state ----
let tNow = 0;               // simulated clock
let playing = false;
let randomOn = false;
let nextRandomT = 0;
let events = [];            // {t, kind: 'ble'|'obstacle', A: handledTime|null, B: handledTime|null}
let simA, simB;             // Panel A (blocking) and Panel B (cooperative) threads

// ---- layout (recomputed every frame) ----
let tlLeft = 96, tlRight = 540, showCode = true, codeX = 552;
const A_TOP = 0, B_TOP = 186;
const A_LANE_Y = 34, A_LANE_H = 42;
const B_LANE_Y = B_TOP + 34, B_LANE_H = 23;
const B_LANES = ['blink', 'ble', 'sensor', 'loop'];
const B_LANE_NAMES = { blink: 'blink LED', ble: 'poll BLE', sensor: 'read sensor', loop: 'event loop' };

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(togglePlay);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSim);

  bleButton = createButton('BLE message');
  bleButton.parent(document.querySelector('main'));
  bleButton.mousePressed(() => dropEvent('ble'));

  obstacleButton = createButton('Obstacle');
  obstacleButton.parent(document.querySelector('main'));
  obstacleButton.mousePressed(() => dropEvent('obstacle'));

  randomButton = createButton('Random events: off');
  randomButton.parent(document.querySelector('main'));
  randomButton.mousePressed(toggleRandom);

  blinkSlider = createSlider(0.1, 1.0, 0.5, 0.1);
  blinkSlider.parent(document.querySelector('main'));
  pollSlider = createSlider(0.01, 0.2, 0.02, 0.01);
  pollSlider.parent(document.querySelector('main'));
  sensorSlider = createSlider(5, 100, 20, 5);
  sensorSlider.parent(document.querySelector('main'));

  longSleepCheckbox = createCheckbox(' Long time.sleep() in Panel A', true);
  longSleepCheckbox.parent(document.querySelector('main'));
  longSleepCheckbox.style('font-size', '15px');
  longSleepCheckbox.style('font-family', 'Arial, Helvetica, sans-serif');

  resetSim();
  positionControls();

  describe('Two stacked timelines of one robot thread over 4 seconds. Panel A runs a blocking ' +
    'loop: blink LED, check BLE, read sensor, then time.sleep, drawn as red stripes. Panel B ' +
    'runs three uasyncio tasks that pause at await, with an event loop lane. Buttons drop BLE ' +
    'messages or obstacles at the current time; markers show whether each event was handled ' +
    'on time or late, with counters for on-time events, late events, and idle time.', LABEL);
}

// ---------------------------------------------------------------- controls
function positionControls() {
  // shorter labels on narrow screens so every control stays on its row
  const narrow = canvasWidth < 600;
  randomButton.html((narrow ? 'Random: ' : 'Random events: ') + (randomOn ? 'on' : 'off'));
  const span = longSleepCheckbox.elt.querySelector('span');
  if (span) span.textContent = narrow ? ' Long sleep in A' : ' Long time.sleep() in Panel A';
  // Row 1: buttons placed left to right using their real widths
  let x = margin;
  const y1 = drawHeight + 8;
  for (const b of [playButton, resetButton, bleButton, obstacleButton, randomButton]) {
    b.position(x, y1);
    x += b.elt.offsetWidth + 6;
  }
  // Rows 2 and 3: two columns of label + slider
  const colW = canvasWidth / 2;
  const lblW = canvasWidth < 600 ? 110 : 140;
  const sw = max(40, colW - lblW - 18);
  blinkSlider.position(margin + lblW, drawHeight + 44);
  blinkSlider.size(sw);
  pollSlider.position(colW + lblW, drawHeight + 44);
  pollSlider.size(sw);
  sensorSlider.position(margin + lblW, drawHeight + 78);
  sensorSlider.size(sw);
  longSleepCheckbox.position(colW + 4, drawHeight + 78);
}

function togglePlay() {
  playing = !playing;
  playButton.html(playing ? 'Pause' : 'Play');
}

function toggleRandom() {
  randomOn = !randomOn;
  nextRandomT = tNow + random(0.3, 1.0);
  if (randomOn && !playing) togglePlay();
  positionControls();
}

function resetSim() {
  tNow = 0;
  events = [];
  simA = { t: 0, step: 0, nextBlink: 0, blocks: [], sleepTotal: 0, last: null };
  simB = {
    t: 0,
    tasks: [{ kind: 'blink', ready: 0 }, { kind: 'ble', ready: 0 }, { kind: 'sensor', ready: 0 }],
    blocks: [], idleTotal: 0, last: null
  };
  if (playing) togglePlay();
  if (randomOn) toggleRandom();
}

// An outside event arrives "now". If the clock is paused, start it so the
// student can watch how long each panel takes to notice the event.
function dropEvent(kind) {
  events.push({ t: tNow, kind: kind, A: null, B: null });
  if (!playing) togglePlay();
}

// ---------------------------------------------------------------- model
function blinkPeriod() { return blinkSlider.value(); }
function pollPeriod() { return pollSlider.value(); }
function sensorWork() { return sensorSlider.value() / 1000; }
function longSleep() { return longSleepCheckbox.checked(); }

function workTime(kind) {
  if (kind === 'blink') return BLINK_WORK;
  if (kind === 'ble') return BLE_WORK;
  return sensorWork();
}

function pauseTime(kind) {
  if (kind === 'blink') return blinkPeriod();
  if (kind === 'ble') return pollPeriod();
  return SENSOR_PAUSE;
}

// A job "handles" a waiting event when it STARTS after the event arrived:
// check_ble_messages() handles BLE messages, read_distance() handles obstacles.
function resolveEvents(panel, block) {
  const match = block.kind === 'ble' ? 'ble' : (block.kind === 'sensor' ? 'obstacle' : null);
  if (!match) return;
  for (const e of events) {
    if (e[panel] === null && e.kind === match && e.t <= block.t0 + 1e-9) e[panel] = block.t0;
  }
}

// Panel A: while True: blink, check BLE, read sensor, time.sleep(...)
function advanceA() {
  while (simA.t <= tNow) {
    const s = simA.step;
    let kind, dur;
    if (s === 0) {
      if (longSleep() || simA.t >= simA.nextBlink - 1e-9) {
        kind = 'blink'; dur = BLINK_WORK; simA.nextBlink = simA.t + blinkPeriod();
      } else { simA.step = 1; continue; }   // short-sleep version skips the LED until it is due
    } else if (s === 1) { kind = 'ble'; dur = BLE_WORK; }
    else if (s === 2) { kind = 'sensor'; dur = sensorWork(); }
    else { kind = 'sleep'; dur = longSleep() ? blinkPeriod() : pollPeriod(); }
    const b = { t0: simA.t, t1: simA.t + dur, kind: kind };
    simA.blocks.push(b);
    simA.last = b;
    if (kind === 'sleep') simA.sleepTotal += dur;
    resolveEvents('A', b);
    simA.t = b.t1;
    simA.step = (s + 1) % 4;
  }
}

// Panel B: one thread, an event loop picks whichever ready task has waited longest
function advanceB() {
  while (simB.t <= tNow) {
    let pick = null;
    for (const k of simB.tasks) {
      if (k.ready <= simB.t + 1e-9 && (pick === null || k.ready < pick.ready - 1e-12)) pick = k;
    }
    let b;
    if (pick === null) {
      const nt = Math.min(...simB.tasks.map(k => k.ready));
      b = { t0: simB.t, t1: nt, kind: 'idle' };
      simB.idleTotal += nt - simB.t;
    } else {
      b = { t0: simB.t, t1: simB.t + workTime(pick.kind), kind: pick.kind };
      pick.ready = b.t1 + pauseTime(pick.kind);   // await asyncio.sleep(pause)
    }
    simB.blocks.push(b);
    simB.last = b;
    resolveEvents('B', b);
    simB.t = b.t1;
  }
}

function pageStart() { return Math.floor(tNow / WINDOW_S + 1e-9) * WINDOW_S; }

function pruneBlocks(sim) {
  const p0 = pageStart();
  let i = 0;
  while (i < sim.blocks.length - 1 && sim.blocks[i].t1 < p0) i++;
  if (i > 0) sim.blocks.splice(0, i);
}

function activeKind(sim) {
  const b = sim.last;
  if (b && b.t0 <= tNow && tNow < b.t1) return b.kind;
  return null;
}

// ---------------------------------------------------------------- draw
function draw() {
  updateCanvasSize();

  if (playing) {
    tNow += min(deltaTime, 100) / 1000;
    while (randomOn && tNow >= nextRandomT) {
      events.push({ t: nextRandomT, kind: random() < 0.5 ? 'ble' : 'obstacle', A: null, B: null });
      nextRandomT += random(0.3, 1.0);
    }
  }
  advanceA();
  advanceB();
  pruneBlocks(simA);
  pruneBlocks(simB);

  // layout
  showCode = canvasWidth >= 620;
  tlLeft = 96;
  codeX = canvasWidth - 250;
  tlRight = showCode ? codeX - 14 : canvasWidth - 12;

  // backgrounds
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  line(0, B_TOP, canvasWidth, B_TOP);

  drawPanelA();
  drawPanelB();
  drawPlayhead();
  drawControlLabels();
}

function tx(t) {
  return map(t - pageStart(), 0, WINDOW_S, tlLeft, tlRight);
}

function drawTimeAxis(y) {
  const p0 = pageStart();
  stroke('gray'); strokeWeight(1);
  line(tlLeft, y, tlRight, y);
  for (let s = 0; s <= WINDOW_S; s++) {
    const x = map(s, 0, WINDOW_S, tlLeft, tlRight);
    line(x, y, x, y + 4);
    noStroke(); fill('dimgray'); textSize(12); textAlign(CENTER, TOP);
    text((p0 + s) + ' s', x, y + 5);
    stroke('gray');
  }
  noStroke();
}

// Draw one block clipped to the revealed part of the current page
function blockSpan(b) {
  const p0 = pageStart();
  const shownEnd = min(tNow, p0 + WINDOW_S);
  if (b.t1 <= p0 || b.t0 > shownEnd) return null;
  const x0 = tx(max(b.t0, p0));
  const x1 = max(tx(min(b.t1, shownEnd)), x0 + 1.5);   // 1 ms jobs are still visible
  return [x0, x1];
}

// Red diagonal stripes for time.sleep(); each 45-degree stripe is clipped to the block
function drawStripes(x0, y, w, h) {
  fill('mistyrose'); noStroke();
  rect(x0, y, w, h);
  stroke('crimson'); strokeWeight(2);
  const phase = (x0 - tlLeft) % 9;
  for (let sx = x0 - h - phase; sx < x0 + w; sx += 9) {
    const u0 = max(0, x0 - sx);
    const u1 = min(h, x0 + w - sx);
    if (u1 > u0) line(sx + u0, y + h - u0, sx + u1, y + h - u1);
  }
  noStroke();
}

function drawPanelA() {
  const longS = longSleep();
  noStroke(); fill('black'); textSize(16); textStyle(BOLD); textAlign(LEFT, TOP);
  const sleepTxt = longS ? nf(blinkPeriod(), 1, 1) : nf(pollPeriod(), 1, 2);
  text('A. Blocking: time.sleep(' + sleepTxt + ')', margin, A_TOP + 8);
  textStyle(NORMAL);

  // lane
  noStroke(); fill('dimgray'); textSize(13); textAlign(RIGHT, CENTER);
  text('main thread', tlLeft - 6, A_LANE_Y + A_LANE_H / 2);
  fill('white'); stroke('silver');
  rect(tlLeft, A_LANE_Y, tlRight - tlLeft, A_LANE_H);
  noStroke();
  for (const b of simA.blocks) {
    const sp = blockSpan(b);
    if (!sp) continue;
    if (b.kind === 'sleep') drawStripes(sp[0], A_LANE_Y + 1, sp[1] - sp[0], A_LANE_H - 2);
    else { fill(KIND_COLOR[b.kind]); rect(sp[0], A_LANE_Y + 1, sp[1] - sp[0], A_LANE_H - 2); }
  }
  if (tNow === 0) drawStartHint(A_LANE_Y + A_LANE_H / 2);
  drawTimeAxis(A_LANE_Y + A_LANE_H + 2);
  drawMarkers('A', A_LANE_Y + A_LANE_H + 24);
  drawCounters('A', A_TOP + 146);
  noStroke(); fill('dimgray'); textSize(13); textAlign(LEFT, TOP);
  text('Red stripes = time.sleep(): the whole thread is stuck.', margin, A_TOP + 166);

  if (showCode) {
    const lines = longS ? [
      'while True:',
      '    led.toggle()',
      '    check_ble_messages()',
      '    distance = read_distance()',
      '    time.sleep(' + sleepTxt + ')'
    ] : [
      'while True:',
      '    if blink_due(): led.toggle()',
      '    check_ble_messages()',
      '    distance = read_distance()',
      '    time.sleep(' + sleepTxt + ')'
    ];
    const k = activeKind(simA);
    const hi = { blink: 1, ble: 2, sensor: 3, sleep: 4 }[k];
    drawCode(codeX, A_TOP + 30, lines, hi === undefined ? [] : [hi], []);
  }
}

function drawPanelB() {
  noStroke(); fill('black'); textSize(16); textStyle(BOLD); textAlign(LEFT, TOP);
  text('B. Cooperative: await asyncio.sleep()', margin, B_TOP + 8);
  textStyle(NORMAL);

  for (let i = 0; i < B_LANES.length; i++) {
    const lane = B_LANES[i];
    const y = B_LANE_Y + i * B_LANE_H;
    noStroke(); fill(lane === 'loop' ? 'black' : 'dimgray'); textSize(13); textAlign(RIGHT, CENTER);
    text(B_LANE_NAMES[lane], tlLeft - 6, y + B_LANE_H / 2);
    fill(lane === 'loop' ? 'whitesmoke' : 'white'); stroke('silver');
    rect(tlLeft, y, tlRight - tlLeft, B_LANE_H);
    // dashed gray line = this task is waiting at await (thread is free for others)
    if (lane !== 'loop' && tNow > 0) {
      const xEnd = tx(min(tNow, pageStart() + WINDOW_S));
      stroke('darkgray'); strokeWeight(1);
      drawingContext.setLineDash([4, 4]);
      line(tlLeft, y + B_LANE_H / 2, xEnd, y + B_LANE_H / 2);
      drawingContext.setLineDash([]);
    }
    noStroke();
  }
  for (const b of simB.blocks) {
    const sp = blockSpan(b);
    if (!sp) continue;
    const loopY = B_LANE_Y + 3 * B_LANE_H;
    if (b.kind === 'idle') {
      fill('gainsboro'); rect(sp[0], loopY + 5, sp[1] - sp[0], B_LANE_H - 10);
    } else {
      const li = B_LANES.indexOf(b.kind);
      fill(KIND_COLOR[b.kind]);
      rect(sp[0], B_LANE_Y + li * B_LANE_H + 2, sp[1] - sp[0], B_LANE_H - 4);
      rect(sp[0], loopY + 2, sp[1] - sp[0], B_LANE_H - 4);
    }
  }
  // hand-off arrow: the event loop gives the thread to the running task
  const k = activeKind(simB);
  if (k && k !== 'idle' && tNow > 0) {
    const li = B_LANES.indexOf(k);
    const x = tx(tNow) + 6;
    const yFrom = B_LANE_Y + 3 * B_LANE_H + 4;
    const yTo = B_LANE_Y + li * B_LANE_H + B_LANE_H / 2;
    stroke(KIND_COLOR[k]); strokeWeight(2);
    line(x, yFrom, x, yTo + 5);
    noStroke(); fill(KIND_COLOR[k]);
    triangle(x, yTo, x - 4, yTo + 7, x + 4, yTo + 7);
  }
  if (tNow === 0) drawStartHint(B_LANE_Y + 1.5 * B_LANE_H);
  const axisY = B_LANE_Y + 4 * B_LANE_H + 2;
  drawTimeAxis(axisY);
  drawMarkers('B', axisY + 22);
  drawCounters('B', B_TOP + 206);
  noStroke(); fill('dimgray'); textSize(13); textAlign(LEFT, TOP);
  text('One thread, but nobody sleeps while others wait.', margin, B_TOP + 226);
  if (sensorSlider.value() > 50) {
    fill('crimson'); textStyle(BOLD);
    text('A long task with no await still blocks everyone.', margin, B_TOP + 244);
    textStyle(NORMAL);
  }

  if (showCode) {
    const lines = [
      '# 3 tasks, each in while True:',
      'blink_status_led():',
      '    led.toggle()',
      '    await asyncio.sleep(' + nf(blinkPeriod(), 1, 1) + ')',
      'poll_ble():',
      '    check_ble_messages()',
      '    await asyncio.sleep(' + nf(pollPeriod(), 1, 2) + ')',
      'read_sensor():',
      '    distance = read_distance()',
      '    await asyncio.sleep(' + SENSOR_PAUSE + ')'
    ];
    const workLine = { blink: 2, ble: 5, sensor: 8 };
    const awaitLine = { blink: 3, ble: 6, sensor: 9 };
    const hi = (k && workLine[k] !== undefined) ? [workLine[k]] : [];
    const dim = [];
    if (tNow > 0) for (const kk of ['blink', 'ble', 'sensor']) if (kk !== k) dim.push(awaitLine[kk]);
    drawCode(codeX, B_TOP + 30, lines, hi, dim);
  }
}

function drawStartHint(y) {
  noStroke(); fill('gray'); textSize(13); textAlign(CENTER, CENTER);
  text('Press Play, BLE message, or Obstacle to start the clock', (tlLeft + tlRight) / 2, y);
}

// Code listing with the running line in yellow and awaiting lines in light blue
function drawCode(x, y, lines, highlight, dim) {
  const lh = 16;
  const w = canvasWidth - x - 8;
  fill('white'); stroke('silver'); strokeWeight(1);
  rect(x, y, w, lines.length * lh + 10, 6);
  noStroke();
  textFont('monospace');
  textSize(12); textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) {
    const ly = y + 5 + i * lh;
    if (highlight.includes(i)) { fill('gold'); rect(x + 3, ly - 1, w - 6, lh, 3); }
    else if (dim.includes(i)) { fill('lavender'); rect(x + 3, ly - 1, w - 6, lh, 3); }
    noStroke();
    fill(lines[i].startsWith('#') ? 'gray' : 'black');
    text(lines[i], x + 7, ly + 1);
  }
  textFont('sans-serif');
}

// Event markers: a triangle when the event arrives, a bar while it waits,
// and a check (on time) or red X with the delay (late) when it is handled.
function drawMarkers(panel, y) {
  const p0 = pageStart();
  let n = 0;
  for (const e of events) {
    if (e.t < p0 || e.t > p0 + WINDOW_S) continue;
    const row = (n++) % 2;          // alternate label rows so delays do not overlap
    const col = e.kind === 'ble' ? 'forestgreen' : 'crimson';
    const x = tx(e.t);
    const handled = e[panel];
    const endT = handled === null ? tNow : handled;
    const waitMs = (endT - e.t) * 1000;
    const late = waitMs > ON_TIME_MS;
    // waiting bar
    stroke(late ? 'crimson' : col); strokeWeight(3);
    line(x, y + 4, tx(min(endT, p0 + WINDOW_S)), y + 4);
    // arrival triangle
    stroke('white'); strokeWeight(1); fill(col);
    triangle(x, y - 6, x - 6, y + 6, x + 6, y + 6);
    noStroke();
    if (handled !== null) {
      const hx = tx(min(handled, p0 + WINDOW_S));
      if (late) {
        stroke('crimson'); strokeWeight(3);
        line(hx - 5, y - 1, hx + 5, y + 9); line(hx - 5, y + 9, hx + 5, y - 1);
        noStroke(); fill('crimson'); textSize(12); textAlign(CENTER, TOP);
        text(round(waitMs) + ' ms late', hx, y + 11 + row * 13);
      } else {
        stroke('forestgreen'); strokeWeight(2.5); noFill();
        line(x + 6, y + 12, x + 9, y + 16); line(x + 9, y + 16, x + 15, y + 8);
        noStroke();
      }
    } else if (late) {
      noStroke(); fill('crimson'); textSize(12); textAlign(CENTER, TOP);
      text('waiting...', tx(min(tNow, p0 + WINDOW_S)), y + 11 + row * 13);
    }
  }
  noStroke();
}

function drawCounters(panel, y) {
  let onTime = 0, lateN = 0, worst = 0;
  for (const e of events) {
    const h = e[panel];
    const waited = ((h === null ? tNow : h) - e.t) * 1000;
    if (h !== null && waited <= ON_TIME_MS) onTime++;
    else if (waited > ON_TIME_MS) { lateN++; worst = max(worst, waited); }
  }
  let idle = 0;
  if (tNow > 0) {
    if (panel === 'A') {
      let s = simA.sleepTotal;
      if (simA.last && simA.last.kind === 'sleep') s -= max(0, simA.last.t1 - tNow);
      idle = 100 * s / tNow;
    } else {
      let s = simB.idleTotal;
      if (simB.last && simB.last.kind === 'idle') s -= max(0, simB.last.t1 - tNow);
      idle = 100 * s / tNow;
    }
  }
  noStroke(); textSize(14); textAlign(LEFT, TOP);
  let x = margin;
  fill('forestgreen'); textStyle(BOLD);
  const s1 = 'On time: ' + onTime;
  text(s1, x, y); x += textWidth(s1) + 16;
  fill('crimson');
  const s2 = 'Late: ' + lateN + (lateN > 0 ? ' (worst ' + round(worst) + ' ms)' : '');
  text(s2, x, y); x += textWidth(s2) + 16;
  fill('black');
  text('Thread idle: ' + round(idle) + '%', x, y);
  textStyle(NORMAL);
}

function drawPlayhead() {
  if (tNow <= 0) return;
  const x = tx(min(tNow, pageStart() + WINDOW_S));
  stroke('purple'); strokeWeight(2);
  line(x, A_LANE_Y - 4, x, A_LANE_Y + A_LANE_H + 4);
  line(x, B_LANE_Y - 4, x, B_LANE_Y + 4 * B_LANE_H + 4);
  noStroke(); fill('purple'); textSize(14); textAlign(RIGHT, TOP);
  text('clock: ' + nf(tNow, 1, 2) + ' s', tlRight, A_TOP + 10);
}

function drawControlLabels() {
  const narrow = canvasWidth < 600;
  const colW = canvasWidth / 2;
  noStroke(); fill('black'); textSize(15); textAlign(LEFT, CENTER);
  text((narrow ? 'Blink: ' : 'Blink period: ') + nf(blinkPeriod(), 1, 1) + ' s', margin, drawHeight + 54);
  text((narrow ? 'Poll: ' : 'BLE poll: ') + nf(pollPeriod(), 1, 2) + ' s', colW, drawHeight + 54);
  text((narrow ? 'Sensor: ' : 'Sensor read: ') + sensorSlider.value() + ' ms', margin, drawHeight + 88);
  textSize(defaultTextSize);
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
