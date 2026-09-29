// Button Bounce Timeline
// CANVAS_HEIGHT: 500
// Bloom L4 (Analyze): one physical press makes many falling edges, and every
// falling edge fires the IRQ handler. The debounce test
// `ticks_diff(now, last_press_time) > window` decides which edges count.
// Students tune the window so each real press counts once and none are missed.

let canvasWidth = 700;
let drawHeight = 385;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

// ----- timeline settings -----
const T_MAX = 200;        // the timeline shows 0 to 200 ms
const PLAY_MS = 1200;     // screen time used to play 200 ms (slow motion)
const PRESS1 = 20;        // the first press starts at 20 ms
const PRESS_GAP = 100;    // "Press twice quickly" presses are 100 ms apart

// ----- layout of the three strips (y values inside the drawing region) -----
const STRIP1_TOP = 40, STRIP1_H = 76;    // Pin 20 signal
const STRIP2_TOP = 124, STRIP2_H = 50;   // falling edges
const STRIP3_TOP = 182, STRIP3_H = 50;   // presses counted
const AXIS_Y = 240;                      // shared time axis
const PANEL_TOP = 266;                   // button graphic, counters, code
let plotLeft = 104;
let plotRight = 680;

// ----- controls -----
let pressButton, twiceButton, resetButton, codeCheckbox;
let bounceSlider, windowSlider;

// ----- state -----
let run = null;           // the timeline on screen: transitions, edges, presses
let playStart = 0;
let playing = false;
let bandColor;

const CODE_LINES = [
  'def button_pressed(pin):',
  '    global last_press_time',
  '    now = ticks_ms()',
  '    if ticks_diff(now, last_press_time) > ',
  '        last_press_time = now',
  '        print("Button press registered!")'
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  bandColor = color('steelblue');
  bandColor.setAlpha(45);

  pressButton = createButton('Press');
  pressButton.parent(document.querySelector('main'));
  pressButton.mousePressed(() => startRun('single'));

  twiceButton = createButton('Press twice quickly');
  twiceButton.parent(document.querySelector('main'));
  twiceButton.mousePressed(() => startRun('twice'));

  resetButton = createButton('Reset counters');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  codeCheckbox = createCheckbox(' Show code', false);
  codeCheckbox.parent(document.querySelector('main'));

  // Bounce length: how long the metal contacts bounce (ms)
  bounceSlider = createSlider(0, 30, 12, 1);
  bounceSlider.parent(document.querySelector('main'));
  // a new bounce pattern is built when the student lets go of the slider
  bounceSlider.changed(() => { if (run) startRun(run.kind); });

  // Debounce window: the number in the `> 150` test (ms)
  windowSlider = createSlider(0, 300, 150, 10);
  windowSlider.parent(document.querySelector('main'));

  positionControls();

  describe('A timeline from 0 to 200 milliseconds with three strips. The top strip shows the pin 20 voltage dropping from 3.3 volts to 0 volts when the button is pressed, with contact bounce flipping it several times. The middle strip marks each falling edge that fires the interrupt. The bottom strip shows which edges the debounce code counts as presses and which it ignores. Buttons simulate one press or two quick presses, and sliders set the bounce length and the debounce window.', LABEL);
}

function positionControls() {
  const narrow = canvasWidth < 470;
  twiceButton.html(narrow ? 'Press twice' : 'Press twice quickly');
  resetButton.html(narrow ? 'Reset' : 'Reset counters');

  let x = 10;
  const y1 = drawHeight + 8;
  pressButton.position(x, y1);
  x += pressButton.elt.offsetWidth + 8;
  twiceButton.position(x, y1);
  x += twiceButton.elt.offsetWidth + 8;
  resetButton.position(x, y1);
  x += resetButton.elt.offsetWidth + 14;
  codeCheckbox.position(x, y1 + 2);

  bounceSlider.position(sliderLeftMargin, drawHeight + 44);
  bounceSlider.size(canvasWidth - sliderLeftMargin - margin);
  windowSlider.position(sliderLeftMargin, drawHeight + 80);
  windowSlider.size(canvasWidth - sliderLeftMargin - margin);
}

// ---------- building a bounce pattern ----------

function startRun(kind) {
  run = buildRun(kind);
  playStart = millis();
  playing = true;
}

function resetAll() {
  run = null;
  playing = false;
}

function buildRun(kind) {
  const bounceLen = bounceSlider.value();
  const starts = kind === 'twice' ? [PRESS1, PRESS1 + PRESS_GAP] : [PRESS1];
  // releases are clean rising edges (a rising edge does not fire IRQ_FALLING)
  const releases = kind === 'twice' ? [75, 175] : [160];
  const transitions = [{ t: 0, level: 1 }];   // resting HIGH (pull-up)
  const edges = [];
  starts.forEach((start, p) => {
    for (const tr of makeBounce(start, bounceLen)) {
      transitions.push(tr);
      if (tr.level === 0) edges.push({ t: tr.t, press: p });
    }
    transitions.push({ t: releases[p], level: 1 });
  });
  return { kind, starts, releases, transitions, edges };
}

// One press: the contacts touch (falling edge), then bounce open and closed
// n times inside bounceLen ms, then settle LOW. Every drop to LOW is an edge.
function makeBounce(start, bounceLen) {
  if (bounceLen <= 0) return [{ t: start, level: 0 }];
  let n = floor(random(3, 13));             // 3 to 12 bounces
  n = min(n, max(1, floor(bounceLen)));     // a very short bounce has room for fewer
  const lows = [], highs = [];
  let total = 0;
  for (let i = 0; i < n; i++) {
    const lo = random(0.2, 2), hi = random(0.2, 2);
    lows.push(lo); highs.push(hi); total += lo + hi;
  }
  const scale = bounceLen / total;          // stretch the bounces to fill bounceLen
  let t = start;
  const pts = [{ t, level: 0 }];
  for (let i = 0; i < n; i++) {
    t += lows[i] * scale;  pts.push({ t, level: 1 });
    t += highs[i] * scale; pts.push({ t, level: 0 });
  }
  return pts;
}

// ---------- the debounce handler, edge by edge ----------
// Same rule as the MicroPython code: accept an edge only when the time since
// the last accepted edge is greater than the debounce window.
function evaluateEdges(upTo) {
  const win = windowSlider.value();
  let last = -Infinity;
  const out = [];
  if (!run) return out;
  for (const e of run.edges) {
    if (e.t > upTo) break;
    const since = e.t - last;
    const accepted = since > win;
    if (accepted) last = e.t;
    out.push({ t: e.t, press: e.press, accepted, since, n: out.length + 1 });
  }
  return out;
}

function currentTime() {
  if (!run) return -1;
  if (!playing) return T_MAX;
  const t = (millis() - playStart) / PLAY_MS * T_MAX;
  if (t >= T_MAX) { playing = false; return T_MAX; }
  return t;
}

function tToX(t) {
  return plotLeft + (t / T_MAX) * (plotRight - plotLeft);
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  plotLeft = 104;
  plotRight = canvasWidth - margin;

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const now = currentTime();
  const evals = evaluateEdges(now);

  drawStrips();
  drawBands(evals);
  drawWaveform(now);
  drawEdges(evals);
  drawCounted(evals);
  drawAxis();
  if (playing) drawPlayhead(now);

  // title (drawn after the strips so nothing covers it)
  noStroke(); fill('black'); textSize(22); textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Button Bounce Timeline', 10, 9);
  textStyle(NORMAL);

  drawButtonGraphic(now);
  drawCounters(evals);
  if (codeCheckbox.checked()) drawCode();
  drawTooltip(evals);
  drawControlLabels();
}

function drawStrips() {
  stroke('silver'); strokeWeight(1); fill('white');
  rect(plotLeft, STRIP1_TOP, plotRight - plotLeft, STRIP1_H);
  rect(plotLeft, STRIP2_TOP, plotRight - plotLeft, STRIP2_H);
  rect(plotLeft, STRIP3_TOP, plotRight - plotLeft, STRIP3_H);

  // strip names in the left gutter
  noStroke(); fill('black'); textSize(14); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Pin 20\nsignal', 8, STRIP1_TOP + 2);
  text('Falling\nedges', 8, STRIP2_TOP + 1);
  text('Presses\ncounted', 8, STRIP3_TOP + 1);
  textStyle(NORMAL); textSize(13); fill('dimgray');
  text('(IRQ fires)', 8, STRIP2_TOP + 34);

  // voltage levels for strip 1
  textAlign(RIGHT, CENTER); fill('black');
  text('3.3 V', plotLeft - 5, highY());
  text('0 V', plotLeft - 5, lowY());

  // faint reference lines for HIGH and LOW
  stroke('gainsboro'); strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(plotLeft, highY(), plotRight, highY());
  line(plotLeft, lowY(), plotRight, lowY());
  drawingContext.setLineDash([]);

  // legend for strip 3
  noStroke(); textSize(13); textAlign(RIGHT, TOP);
  fill('gray');
  text('× ignored', plotRight - 6, STRIP3_TOP + 3);
  fill('seagreen');
  text('✓ counted   ', plotRight - 6 - textWidth('× ignored'), STRIP3_TOP + 3);
}

function highY() { return STRIP1_TOP + 22; }
function lowY() { return STRIP1_TOP + STRIP1_H - 12; }

// shaded blue band: the debounce window after each accepted edge
function drawBands(evals) {
  const win = windowSlider.value();
  if (win <= 0) return;
  let first = true;
  for (const e of evals) {
    if (!e.accepted) continue;
    const x1 = tToX(e.t);
    const x2 = tToX(min(e.t + win, T_MAX));
    noStroke(); fill(bandColor);
    rect(x1, STRIP1_TOP, x2 - x1, STRIP3_TOP + STRIP3_H - STRIP1_TOP);
    stroke('steelblue'); strokeWeight(1);
    line(x1, STRIP1_TOP, x1, STRIP3_TOP + STRIP3_H);
    if (first) {
      noStroke(); fill('midnightblue'); textSize(13); textAlign(LEFT, TOP);
      text('Debounce window: ' + win + ' ms', x1 + 4, STRIP1_TOP + 3);
      first = false;
    }
  }
}

// the pin 20 voltage as a step waveform, drawn up to the playhead
function drawWaveform(now) {
  stroke('navy'); strokeWeight(2); noFill();
  if (!run) {
    line(plotLeft, highY(), plotRight, highY());
    return;
  }
  const tr = run.transitions;
  let level = tr[0].level;
  let prevX = tToX(0);
  for (let i = 1; i < tr.length; i++) {
    if (tr[i].t > now) break;
    const x = tToX(tr[i].t);
    const y = level ? highY() : lowY();
    line(prevX, y, x, y);                 // flat part
    line(x, highY(), x, lowY());          // the switch
    level = tr[i].level;
    prevX = x;
  }
  const endX = tToX(now);
  const y = level ? highY() : lowY();
  line(prevX, y, endX, y);
}

// strip 2: a red down-arrow at every falling edge (each one fires the IRQ)
function drawEdges(evals) {
  const top = STRIP2_TOP + 17, bot = STRIP2_TOP + STRIP2_H - 5;
  let lastLabelX = -1000;
  for (const e of evals) {
    const x = tToX(e.t);
    stroke('crimson'); strokeWeight(1.5);
    line(x, top, x, bot - 5);
    noStroke(); fill('crimson');
    triangle(x - 3.5, bot - 6, x + 3.5, bot - 6, x, bot);
    // number the edges where there is room for the label
    if (x - lastLabelX >= 16) {
      noStroke(); fill('crimson'); textSize(12); textAlign(CENTER, TOP);
      text(e.n, x, STRIP2_TOP + 3);
      lastLabelX = x;
    }
  }
}

// strip 3: green check = counted as a press, gray x = ignored by the handler
function drawCounted(evals) {
  const cy = STRIP3_TOP + 32;
  for (const e of evals) {
    const x = tToX(e.t);
    if (e.accepted) {
      stroke('seagreen'); strokeWeight(3); noFill();
      line(x - 6, cy, x - 1, cy + 6);
      line(x - 1, cy + 6, x + 8, cy - 8);
    }
  }
  for (const e of evals) {
    if (e.accepted) continue;
    const x = tToX(e.t);
    stroke('gray'); strokeWeight(1.5);
    line(x - 3, cy - 3, x + 3, cy + 3);
    line(x - 3, cy + 3, x + 3, cy - 3);
  }
  // after playback, name the mistake next to the press that caused it
  if (!run || playing) return;
  noStroke(); textSize(13); textStyle(BOLD); textAlign(LEFT, CENTER);
  run.starts.forEach((start, p) => {
    const mine = evals.filter(e => e.press === p);
    const counted = mine.filter(e => e.accepted).length;
    const lastX = tToX(mine[mine.length - 1].t);
    if (counted === 0) {
      fill('crimson'); text('missed!', lastX + 12, cy);
    } else if (counted > 1) {
      fill('darkorange'); text('+' + (counted - 1) + ' extra', lastX + 12, cy);
    }
  });
  textStyle(NORMAL);
}

function drawAxis() {
  stroke('black'); strokeWeight(1);
  line(plotLeft, AXIS_Y, plotRight, AXIS_Y);
  noStroke(); fill('black'); textSize(13);
  for (let t = 0; t <= T_MAX; t += 25) {
    const x = tToX(t);
    stroke('black');
    line(x, AXIS_Y, x, AXIS_Y + (t % 50 === 0 ? 6 : 3));
    if (t % 50 === 0) {
      noStroke(); textAlign(CENTER, TOP);
      text(t, x, AXIS_Y + 7);
    }
  }
  noStroke(); textAlign(RIGHT, TOP);
  text('time (ms)', plotLeft - 5, AXIS_Y + 7);
}

function drawPlayhead(now) {
  const x = tToX(now);
  stroke('dimgray'); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(x, STRIP1_TOP, x, AXIS_Y);
  drawingContext.setLineDash([]);
}

// the physical button: dark while it is held down
function isHeld(now) {
  if (!run) return false;
  for (let p = 0; p < run.starts.length; p++) {
    if (now >= run.starts[p] && now < run.releases[p]) return true;
  }
  return false;
}

function drawButtonGraphic(now) {
  const held = playing && isHeld(now);
  const cx = 50, cy = PANEL_TOP + 42;
  stroke('dimgray'); strokeWeight(1); fill('silver');
  rect(cx - 34, cy - 34, 68, 68, 8);            // button body
  stroke('black'); fill(held ? 'dimgray' : 'whitesmoke');
  circle(cx, cy + (held ? 2 : 0), held ? 40 : 46); // the cap moves down when pressed
  noStroke(); fill('black'); textSize(13); textAlign(CENTER, TOP);
  text(held ? 'pressed' : 'released', cx, cy + 40);
}

function drawCounters(evals) {
  const x = 100;
  const edgesSeen = evals.length;
  const counted = evals.filter(e => e.accepted).length;
  noStroke(); textAlign(LEFT, TOP); textSize(17); textStyle(BOLD);
  fill('crimson');
  text('Falling edges seen: ' + edgesSeen, x, PANEL_TOP + 4);
  fill('seagreen');
  text('Presses counted: ' + counted, x, PANEL_TOP + 28);
  textStyle(NORMAL);

  const s = statusMessage(evals);
  const boxW = codeCheckbox.checked() && !codeOverlays() ? codeLeft() - x - 12 : canvasWidth - x - margin;
  fill(s.col); textSize(15); textStyle(s.bold ? BOLD : NORMAL);
  text(s.msg, x, PANEL_TOP + 56, boxW, 60);
  textStyle(NORMAL);
}

function statusMessage(evals) {
  if (!run) return { msg: 'Click Press to see what one button press does to pin 20.', col: 'dimgray' };
  if (playing) return { msg: 'Playing in slow motion: 200 ms takes 1.2 seconds.', col: 'dimgray' };
  const perPress = run.starts.map(() => 0);
  for (const e of evals) if (e.accepted) perPress[e.press]++;
  if (perPress.some(c => c === 0)) return { msg: 'A real press was missed!', col: 'crimson', bold: true };
  if (perPress.some(c => c > 1)) return { msg: 'Bounce counted as extra presses!', col: 'darkorange', bold: true };
  return { msg: run.starts.length > 1 ? 'Both real presses counted once each.' : 'One real press, counted once.', col: 'seagreen', bold: true };
}

// ---------- the MicroPython handler ----------

function codeFontSize() { return canvasWidth >= 690 ? 13 : 11; }

function codeWidth() {
  textFont('monospace'); textSize(codeFontSize());
  let w = 0;
  for (const s of CODE_LINES) w = max(w, textWidth(s + '300:'));
  textFont('sans-serif');
  return w + 20;
}

function codeLeft() { return canvasWidth - codeWidth() - 10; }
function codeOverlays() { return codeLeft() < 300; }

function drawCode() {
  const w = codeWidth();
  const fs = codeFontSize();
  const lh = fs + 4;
  const h = CODE_LINES.length * lh + 14;
  const x = canvasWidth - w - 10;
  // when the canvas is narrow, the code box sits over the strips instead
  const y = codeOverlays() ? STRIP1_TOP : PANEL_TOP;
  stroke('silver'); strokeWeight(1); fill('whitesmoke');
  rect(x, y, w, h, 6);
  textFont('monospace'); textSize(fs); textAlign(LEFT, TOP); noStroke();
  CODE_LINES.forEach((s, i) => {
    const ty = y + 7 + i * lh;
    fill('black');
    text(s, x + 10, ty);
    if (i === 3) {
      // the debounce window number, live from the slider
      fill('darkorange'); textStyle(BOLD);
      text(windowSlider.value() + ':', x + 10 + textWidth(s), ty);
      textStyle(NORMAL);
    }
  });
  textFont('sans-serif');
}

// ---------- hover: explain one edge ----------

function drawTooltip(evals) {
  if (!evals.length) return;
  if (mouseY < STRIP1_TOP || mouseY > STRIP3_TOP + STRIP3_H) return;
  let best = null, bestD = 7;
  for (const e of evals) {
    const d = abs(mouseX - tToX(e.t));
    if (d < bestD) { bestD = d; best = e; }
  }
  if (!best) return;
  const win = windowSlider.value();
  const x = tToX(best.t);
  stroke('black'); strokeWeight(1);
  line(x, STRIP1_TOP, x, STRIP3_TOP + STRIP3_H);

  const lines = ['Edge ' + best.n + ' at ' + best.t.toFixed(1) + ' ms'];
  if (best.since === Infinity) {
    lines.push('No press counted yet');
    lines.push('Result: counted');
  } else {
    lines.push('Since last counted press: ' + best.since.toFixed(1) + ' ms');
    lines.push(best.since.toFixed(1) + ' > ' + win + '?  ' +
      (best.accepted ? 'Yes, so it is counted' : 'No, so it is ignored'));
  }
  textSize(14);
  let w = 0;
  for (const s of lines) w = max(w, textWidth(s));
  w += 16;
  const h = lines.length * 18 + 10;
  let tx = mouseX + 12;
  if (tx + w > canvasWidth - 4) tx = mouseX - w - 12;
  tx = max(4, tx);
  const ty = constrain(mouseY - h / 2, 4, drawHeight - h - 4);
  noStroke(); fill('midnightblue');
  rect(tx, ty, w, h, 6);
  fill('white'); textAlign(LEFT, TOP);
  lines.forEach((s, i) => text(s, tx + 8, ty + 6 + i * 18));
}

function drawControlLabels() {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Bounce length: ' + bounceSlider.value() + ' ms', 10, drawHeight + 54);
  text('Debounce window: ' + windowSlider.value() + ' ms', 10, drawHeight + 90);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof bounceSlider !== 'undefined') {
    bounceSlider.size(canvasWidth - sliderLeftMargin - margin);
    windowSlider.size(canvasWidth - sliderLeftMargin - margin);
  }
}
