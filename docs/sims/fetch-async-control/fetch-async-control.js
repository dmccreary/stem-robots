// Fetch vs. Form Page Reload
// CANVAS_HEIGHT: 547
// Bloom L4 (Analyze, verb Compare): describe why a fetch() call updates only
// part of a page while a form submit reloads the whole page, and how that makes
// robot control smoother. Two simulated controller pages sit side by side; a
// timeline shows request time, blank-page time, and when each robot starts.

let canvasWidth = 800;
let drawHeight = 432;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

const CMDS = ['Forward', 'Back', 'Left', 'Right', 'Stop'];
const STATUS_MS = 5;           // time for fetch() to update the status text

// one record per side
function newSide(kind) {
  return {
    kind: kind,                // 'form' or 'fetch'
    events: [],                // {t0, d, r, cmd, arrived, done}
    missed: [],                // times of lost clicks
    loads: 1,                  // page loads
    status: 'Ready',
    statusFlash: -1,
    busyUntil: -1,             // form page is reloading until this time
    robotCmd: 'Stop',
    robotSince: -1,
    lastLatency: null,
    clicks: 0,
    received: 0,
    missTag: -1,
    pressed: -1, pressedAt: -1
  };
}
let form = newSide('form');
let fet = newSide('fetch');
let scheduled = [];            // {at, fn} for the Fast clicks button
let lastActivity = -10;
let wheel = { form: 0, fetch: 0 };
let latestFetch = null;

// layout
let win = [];
let tl = {}, codeR = {};

// controls
let cmdSelect, bothButton, fastButton, resetButton, delaySlider, sizeSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(pageClick);
  textSize(defaultTextSize);

  cmdSelect = createSelect();
  cmdSelect.parent(document.querySelector('main'));
  for (const c of CMDS) cmdSelect.option(c);
  cmdSelect.selected('Forward');
  bothButton = createButton('Click both');
  bothButton.parent(document.querySelector('main'));
  bothButton.mousePressed(() => { const c = cmdSelect.value(); press(form, c); press(fet, c); });
  fastButton = createButton('Fast clicks');
  fastButton.parent(document.querySelector('main'));
  fastButton.mousePressed(fastClicks);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  delaySlider = createSlider(20, 500, 100, 10);
  delaySlider.parent(document.querySelector('main'));
  sizeSlider = createSlider(1, 50, 5, 1);
  sizeSlider.parent(document.querySelector('main'));

  positionControls();

  describe('Two simulated robot controller web pages side by side. The left page uses form buttons that reload the ' +
    'whole page; the right page uses fetch() and only updates its status text. Clicking a button on a page sends a ' +
    'command to a small robot under it. A timeline shows blue blocks for requests in flight, white blocks for a blank ' +
    'reloading page, green ticks when the robot starts moving, and red marks for missed clicks. Sliders set the network ' +
    'delay and the page size. A code panel highlights the running line of sendCmd().', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  textSize(defaultTextSize);
  const lx = 10 + textWidth('Command:') + 8;
  cmdSelect.position(lx, y0);
  let x = lx + (cmdSelect.elt.offsetWidth || 90) + 8;
  for (const b of [bothButton, fastButton, resetButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 80) + 6;
  }
  const w = max(100, canvasWidth - sliderLeftMargin - margin);
  delaySlider.position(sliderLeftMargin, y0 + 38);
  delaySlider.size(w);
  sizeSlider.position(sliderLeftMargin, y0 + 72);
  sizeSlider.size(w);
}

function computeLayout() {
  const gap = 12;
  const ww = (canvasWidth - 20 - gap) / 2;
  win = [
    { side: form, x: 10, y: 58, w: ww, h: 186, title: 'Form buttons (page reload)' },
    { side: fet, x: 10 + ww + gap, y: 58, w: ww, h: 186, title: 'fetch() buttons (no reload)' }
  ];
  const ty = 306;
  const codeW = min(380, floor(canvasWidth * 0.45));
  codeR = { x: canvasWidth - codeW - 10, y: ty, w: codeW, h: drawHeight - ty - 8 };
  tl = { x: 10, y: ty, w: codeR.x - 20, h: drawHeight - ty - 8 };
}

// ---------- clicking ----------
function now() { return millis(); }

function press(side, cmd) {
  const t = now();
  side.clicks++;
  side.pressed = CMDS.indexOf(cmd);
  side.pressedAt = t;
  lastActivity = t;
  const d = delaySlider.value();
  if (side.kind === 'form') {
    if (t < side.busyUntil) {                 // the page is reloading: the click is lost
      side.missed.push(t);
      side.missTag = t;
      return;
    }
    const r = sizeSlider.value() * 8;          // reload time grows with page size
    side.events.push({ t0: t, d: d, r: r, cmd: cmd, arrived: false, done: false });
    side.busyUntil = t + d + r;
  } else {
    const ev = { t0: t, d: d, r: STATUS_MS, cmd: cmd, arrived: false, done: false };
    side.events.push(ev);
    latestFetch = ev;
  }
}

function fastClicks() {
  const seq = ['Forward', 'Left', 'Stop', 'Forward'];
  const t = now();
  seq.forEach((c, i) => {
    scheduled.push({ at: t + i * 333, fn: () => { press(form, c); press(fet, c); } });
  });
}

function resetAll() {
  form = newSide('form');
  fet = newSide('fetch');
  scheduled = [];
  latestFetch = null;
  lastActivity = -10;
}

// clicks on the simulated page buttons
function pageClick() {
  for (const wn of win) {
    const bs = pageButtons(wn);
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
        press(wn.side, CMDS[i]);
        return;
      }
    }
  }
}

// ---------- time updates ----------
function update() {
  const t = now();
  scheduled = scheduled.filter(s => { if (t >= s.at) { s.fn(); return false; } return true; });
  for (const side of [form, fet]) {
    for (const ev of side.events) {
      if (!ev.arrived && t >= ev.t0 + ev.d / 2) {       // the request reaches the robot
        ev.arrived = true;
        side.robotCmd = ev.cmd;
        side.robotSince = t;
        side.received++;
        side.lastLatency = round(ev.d / 2);
      }
      if (!ev.done && t >= ev.t0 + ev.d + ev.r) {       // page redrawn / status updated
        ev.done = true;
        side.status = ev.cmd.toUpperCase();
        if (side.kind === 'form') side.loads++;
        else side.statusFlash = t;
      }
      lastActivity = max(lastActivity, min(t, ev.t0 + ev.d + ev.r));
    }
    if (side.robotCmd !== 'Stop') wheel[side.kind] += deltaTime / 1000 * 10;
  }
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  update();

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(22);
  textAlign(LEFT, TOP);
  text('Fetch vs. Form Page Reload', 10, 6);

  for (const wn of win) {
    drawWindow(wn);
    drawRobot(wn);
  }
  drawTimeline();
  drawCode();
  drawControlLabels();
}

function pageButtons(wn) {
  const bw = min(90, (wn.w - 40) / 2), bh = 24;
  const cx = wn.x + wn.w / 2;
  const y1 = wn.y + 88;
  return [
    { x: cx - bw - 5, y: y1, w: bw, h: bh },
    { x: cx + 5, y: y1, w: bw, h: bh },
    { x: cx - bw - 5, y: y1 + 30, w: bw, h: bh },
    { x: cx + 5, y: y1 + 30, w: bw, h: bh },
    { x: cx - bw / 2, y: y1 + 60, w: bw, h: bh }
  ];
}

function drawWindow(wn) {
  const s = wn.side, t = now();
  // caption above the window
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, BOTTOM);
  text(wn.title, wn.x + 2, wn.y - 4);
  textStyle(NORMAL);

  // window frame and title bar
  stroke('gray');
  fill(230);
  rect(wn.x, wn.y, wn.w, wn.h, 6);
  // what state is the page in?
  let inFlight = false, blank = false;
  if (s.kind === 'form') {
    const ev = s.events[s.events.length - 1];
    if (ev && !ev.done) {
      inFlight = t < ev.t0 + ev.d;
      blank = !inFlight;
    }
  }
  const loading = inFlight || blank;
  // tab with spinner while the page loads
  noStroke();
  fill('white');
  rect(wn.x + 8, wn.y + 4, min(150, wn.w - 16), 20, 5, 5, 0, 0);
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Robot Control', wn.x + 30, wn.y + 14);
  if (loading) {
    noFill();
    stroke('dodgerblue');
    strokeWeight(2);
    const a = t / 120;
    arc(wn.x + 19, wn.y + 14, 11, 11, a, a + 4.2);
    strokeWeight(1);
  } else {
    noStroke();
    fill('seagreen');
    circle(wn.x + 19, wn.y + 14, 8);
  }
  // page area
  const px = wn.x + 4, py = wn.y + 26, pw = wn.w - 8, ph = wn.h - 30;
  noStroke();
  fill('white');
  rect(px, py, pw, ph, 0, 0, 5, 5);
  if (!blank) {
    const dim = inFlight ? 120 : 255;
    fill(0, 0, 0, dim);
    textSize(17);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text('Sparky Robot Control', wn.x + wn.w / 2, py + 6);
    textStyle(NORMAL);
    // status line (fetch flashes yellow when it changes)
    const flash = s.statusFlash > 0 && t - s.statusFlash < 500;
    if (flash) {
      fill(255, 235, 80, 220 * (1 - (t - s.statusFlash) / 500));
      rect(wn.x + wn.w / 2 - 70, py + 30, 140, 22, 4);
    }
    fill(0, 0, 0, dim);
    textSize(15);
    text('Status: ' + s.status, wn.x + wn.w / 2, py + 33);
    const bs = pageButtons(wn);
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      const hover = mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h;
      const justPressed = s.pressed === i && t - s.pressedAt < 250;
      stroke(120, 120, 120, dim);
      fill(justPressed ? color(180, 200, 255, dim) : hover && !inFlight ? color(225, 235, 255) : color(240, 240, 240, dim));
      rect(b.x, b.y, b.w, b.h, 4);
      noStroke();
      fill(0, 0, 0, dim);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(CMDS[i], b.x + b.w / 2, b.y + b.h / 2);
    }
  } else {
    fill(150);
    textSize(14);
    textAlign(CENTER, CENTER);
    text('(reloading the whole page...)', wn.x + wn.w / 2, py + ph / 2);
  }
  // page load counter and click counts
  noStroke();
  fill(80);
  textSize(13);
  textAlign(LEFT, BOTTOM);
  text('Page loads: ' + s.loads, px + 6, wn.y + wn.h - 4);
  textAlign(RIGHT, BOTTOM);
  const missedN = s.missed.length;
  text('Clicks: ' + s.clicks + (missedN ? '  missed: ' + missedN : ''), px + pw - 6, wn.y + wn.h - 4);
  // "Click missed" tag
  if (s.missTag > 0 && t - s.missTag < 900) {
    const tw = 104;
    noStroke();
    fill(210, 20, 20, 230);
    rect(wn.x + wn.w - tw - 6, wn.y + 3, tw, 20, 5);
    fill('white');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Click missed', wn.x + wn.w - tw / 2 - 6, wn.y + 13);
  }
}

function drawRobot(wn) {
  const s = wn.side;
  const y = wn.y + wn.h + 10;
  const cx = wn.x + 34;
  // robot body (top view, front is up) with a wheel on each side
  stroke('darkolivegreen');
  fill('olivedrab');
  rect(cx - 15, y + 2, 30, 34, 5);
  const moving = s.robotCmd !== 'Stop';
  for (const side of [-1, 1]) {
    push();
    translate(cx + side * 19, y + 19);
    noStroke();
    fill(40);
    rect(-4, -11, 8, 22, 2);
    stroke(200);
    for (let k = 0; k < 3; k++) {
      const sy = moving ? ((wheel[s.kind] * 6 + k * 7) % 21) - 10 : -7 + k * 7;
      line(-3, sy, 3, sy);
    }
    pop();
  }
  // arrow shows the command the robot is running
  noStroke();
  fill('white');
  const dirs = { Forward: 0, Back: PI, Left: -HALF_PI, Right: HALF_PI };
  if (moving) {
    push();
    translate(cx, y + 19);
    rotate(dirs[s.robotCmd]);
    triangle(0, -10, -7, 6, 7, 6);
    pop();
  } else {
    rect(cx - 6, y + 13, 12, 12, 2);
  }
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Robot: ' + s.robotCmd.toUpperCase(), cx + 30, y + 4);
  fill(80);
  textSize(13);
  const ready = s.kind === 'form' ? 'buttons back in ' + (delaySlider.value() + sizeSlider.value() * 8) + ' ms' : 'buttons never go away';
  text('Received: ' + s.received + '  |  ' + ready, cx + 30, y + 22);
}

function drawTimeline() {
  const r = tl, t = now();
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(r.x, r.y, r.w, r.h, 8);
  // the view shows the last 3 seconds, and holds still once nothing is happening
  const span = 3000;
  const end = min(t, lastActivity + 600);
  const start = end - span;
  const lx = r.x + 58, lw = r.w - 68;
  const tx = ms => lx + (ms - start) / span * lw;
  const rows = [['Form', form, r.y + 10], ['fetch()', fet, r.y + 40]];
  for (const [name, side, ry] of rows) {
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, CENTER);
    text(name, r.x + 6, ry + 11);
    stroke(220);
    fill(245);
    rect(lx, ry, lw, 22);
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(lx, ry - 4, lw, 30);
    drawingContext.clip();
    for (const ev of side.events) {
      const inEnd = min(t, ev.t0 + ev.d);
      noStroke();
      fill('royalblue');
      rect(tx(ev.t0), ry + 3, max(1, tx(inEnd) - tx(ev.t0)), 16);
      if (side.kind === 'form' && t > ev.t0 + ev.d) {
        stroke('gray');
        fill('white');
        rect(tx(ev.t0 + ev.d), ry + 3, max(1, tx(min(t, ev.t0 + ev.d + ev.r)) - tx(ev.t0 + ev.d)), 16);
      }
      if (ev.arrived) {
        stroke('green');
        strokeWeight(3);
        const gx = tx(ev.t0 + ev.d / 2);
        line(gx, ry - 3, gx, ry + 25);
        strokeWeight(1);
      }
    }
    for (const m of side.missed) {
      const mx = tx(m);
      stroke('red');
      strokeWeight(2.5);
      line(mx - 5, ry + 6, mx + 5, ry + 16);
      line(mx + 5, ry + 6, mx - 5, ry + 16);
      strokeWeight(1);
    }
    drawingContext.restore();
  }
  // time axis: one tick every 500 ms
  noStroke();
  fill(90);
  textSize(11);
  textAlign(CENTER, TOP);
  stroke(200);
  for (let k = ceil(start / 500) * 500; k <= end; k += 500) {
    const x = tx(k);
    line(x, r.y + 64, x, r.y + 68);
  }
  noStroke();
  text('<- 3 seconds ->', lx + lw / 2, r.y + 67);
  // legend
  const ly = r.y + r.h - 20;
  textSize(12);
  textAlign(LEFT, CENTER);
  let x = r.x + 8;
  const item = (draw, label) => { draw(x, ly); x += 16; fill(40); noStroke(); text(label, x, ly + 1); x += textWidth(label) + 12; };
  item((a, b) => { noStroke(); fill('royalblue'); rect(a, b - 6, 12, 12); }, 'in flight');
  item((a, b) => { stroke('gray'); fill('white'); rect(a, b - 6, 12, 12); }, 'page blank');
  item((a, b) => { stroke('green'); strokeWeight(3); line(a + 6, b - 7, a + 6, b + 7); strokeWeight(1); }, 'robot starts');
  if (x < r.x + r.w - 60) item((a, b) => { stroke('red'); strokeWeight(2.5); line(a + 1, b - 5, a + 11, b + 5); line(a + 11, b - 5, a + 1, b + 5); strokeWeight(1); }, 'missed');
}

function drawCode() {
  const r = codeR, t = now();
  const lines = [
    'async function sendCmd(cmd) {',
    "    const response = await fetch('/action', {",
    "        method: 'POST',",
    "        body: 'cmd=' + cmd",
    '    });',
    '    const text = await response.text();',
    "    document.getElementById('status').innerText = text;",
    '}'
  ];
  // which line is running for the newest fetch()
  let act = -1;
  const ev = latestFetch;
  if (ev) {
    if (t < ev.t0 + ev.d * 0.9) act = 1;
    else if (t < ev.t0 + ev.d + ev.r) act = 5;
    else if (t < ev.t0 + ev.d + ev.r + 400) act = 6;
  }
  stroke('silver');
  fill(250);
  rect(r.x, r.y, r.w, r.h, 6);
  textFont('monospace');
  let ts = 12.5;
  textSize(ts);
  while (ts > 8 && textWidth(lines[6]) > r.w - 12) { ts -= 0.5; textSize(ts); }
  const lh = (r.h - 8) / lines.length;
  for (let i = 0; i < lines.length; i++) {
    const y = r.y + 4 + i * lh;
    if (i === act || (act === 1 && i > 1 && i < 5)) {
      noStroke();
      fill(255, 225, 120);
      rect(r.x + 2, y, r.w - 4, lh, 3);
    }
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    text(lines[i], r.x + 6, y + lh / 2);
  }
  textFont('sans-serif');
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Command:', 10, y0 + 11);
  text('Network delay (ms): ' + delaySlider.value(), 10, y0 + 48);
  text('Page size (KB): ' + sizeSlider.value(), 10, y0 + 82);
}

// ---------- responsive ----------
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
