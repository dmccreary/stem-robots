// Socket Server Lifecycle
// CANVAS_HEIGHT: 545
// Bloom L3 (Apply, verb Sequence): order the socket calls a web server makes,
// explain which call blocks, and explain why the robot handles one browser at
// a time. Two-column lifecycle: Browser (client) on the left, the Pico W web
// server from Chapter 11 on the right, with a listen(1) queue at the bottom.

let canvasWidth = 800;
let drawHeight = 465;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const SERVER_IP = '192.168.1.105';
const BROWSER_IP = { A: '192.168.1.20', B: '192.168.1.21' };

// server rows (index into ROWS); the loop is rows 3-7
const ROWS = [
  { code: 's = socket.socket()', note: 'Create the server socket.' },
  { code: 's.bind(addr)   # port 80', note: 'addr is ("0.0.0.0", 80). Claim port 80, the web port.' },
  { code: 's.listen(1)', note: 'Start listening. One browser may wait in the queue.' },
  { code: 'conn, client = s.accept()', note: '' },
  { code: 'request = conn.recv(1024)', note: 'Read the request the browser sent.' },
  { code: 'handle_cmd(cmd)', note: 'Only a POST with cmd= runs a motor command, before the page is sent.' },
  { code: 'conn.send(html_page())', note: 'Send the HTML page back to the browser.' },
  { code: 'conn.close()', note: 'Hang up on this browser. The loop goes back to accept().' },
  { code: 'finally: s.close()', note: '' }
];

// ---------- server state ----------
let pc = 0;                 // step 0..9
let current = null;         // browser being served {name, ip, request}
let queue = [];             // waiting browsers (listen(1) = 1 slot)
let refused = [];
let served = 0;
let motors = 'STOPPED';
let lastRequest = '';
let waitStart = 0;
let bound = false;
let portInUse = false;
let bindError = false;
let autoPlay = false;
let autoTimer = 0;
let message = '';
let wheelAngle = 0;

// ---------- layout ----------
let L = {};

// ---------- controls ----------
let nextButton, autoButton, resetButton, requestSelect;
let browserAButton, browserBButton, closeCheckbox;
let requestLabelX = 260;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next Step');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextStep);
  autoButton = createButton('Auto Play');
  autoButton.parent(document.querySelector('main'));
  autoButton.style('min-width', '86px');
  autoButton.mousePressed(toggleAuto);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetServer);

  requestSelect = createSelect();
  requestSelect.parent(document.querySelector('main'));
  requestSelect.option('GET /');
  requestSelect.option('POST cmd=forward');
  requestSelect.option('POST cmd=stop');
  requestSelect.selected('GET /');

  browserAButton = createButton('Browser A connects');
  browserAButton.parent(document.querySelector('main'));
  browserAButton.mousePressed(() => browserConnects('A'));
  browserBButton = createButton('Browser B connects');
  browserBButton.parent(document.querySelector('main'));
  browserBButton.mousePressed(() => browserConnects('B'));
  closeCheckbox = createCheckbox(' Add s.close() at the end', true);
  closeCheckbox.parent(document.querySelector('main'));

  positionControls();
  resetServer();
  portInUse = false;

  describe('Two-column socket lifecycle. The right column lists the robot web server calls socket, bind, listen, ' +
    'and a while loop with accept, recv, handle_cmd, send, and close. The left column shows the browser: connect, send ' +
    'request, receive HTML, close. Arrows between the columns show network messages. A red WAITING tag and stopwatch ' +
    'show that accept blocks until a browser connects. A queue strip holds one waiting browser from listen(1); extra ' +
    'browsers are refused. A small robot spins its wheels after a POST cmd=forward request.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  for (const b of [nextButton, autoButton, resetButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 80) + 6;
  }
  x += 10;
  requestLabelX = x;
  textSize(defaultTextSize);
  requestSelect.position(x + textWidth('Request type:') + 8, y0);
  x = 10;
  for (const b of [browserAButton, browserBButton]) {
    b.position(x, y0 + 36);
    x += (b.elt.offsetWidth || 140) + 6;
  }
  closeCheckbox.position(x + 10, y0 + 39);
}

function computeLayout() {
  const W = canvasWidth;
  L.leftX = 10;
  L.leftW = floor(W * 0.34);
  L.srvX = floor(W * 0.52);
  L.srvW = W - L.srvX - 10;
  L.rowH = 25;
  L.rowY = [62, 92, 122, 170, 201, 232, 263, 294, 334];
  L.codeY = 362;
  L.queueY = 420;
}

// ---------- server program ----------
function resetServer() {
  if (bindError) {
    portInUse = false;               // second reset: unplug and replug the robot
  } else if (bound && !closeCheckbox.checked()) {
    portInUse = true;                // the old socket never closed
  } else {
    portInUse = false;
  }
  pc = 0;
  current = null;
  queue = [];
  refused = [];
  served = 0;
  motors = 'STOPPED';
  lastRequest = '';
  bound = false;
  bindError = false;
  autoPlay = false;
  if (autoButton) autoButton.html('Auto Play');
  message = portInUse ? 'Restarted without s.close() last time. Press Next Step and watch bind().' : 'Press Next Step to start the server.';
}

function toggleAuto() {
  autoPlay = !autoPlay;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  autoTimer = 0;
}

function isBlocked() {
  return pc === 4 && current === null;
}

function nextStep() {
  if (bindError) return;
  if (pc === 9) finishClose();          // close() ended the last browser's turn
  message = '';
  if (pc === 0) { pc = 1; return; }
  if (pc === 1) {
    pc = 2;
    if (portInUse) {
      bindError = true;
      message = 'OSError: [Errno 98] EADDRINUSE. The old socket still holds port 80. Press Reset to unplug and replug the robot.';
    } else {
      bound = true;
    }
    return;
  }
  if (pc === 2) { pc = 3; return; }
  if (pc === 3 || pc === 9) {
    pc = 4;
    if (queue.length) {
      current = queue.shift();
      message = 'accept() returns right away: Browser ' + current.name + ' was waiting in the queue.';
    } else {
      waitStart = millis();
      message = 'accept() is blocked. Nothing else runs until a browser connects.';
    }
    return;
  }
  if (pc === 4) {
    if (current === null) {
      message = 'Still blocked in accept(). Press "Browser A connects" or "Browser B connects".';
      return;
    }
    pc = 5;
    message = 'accept() returned a NEW socket, conn, just for Browser ' + current.name + ' (' + current.ip + ').';
    return;
  }
  if (pc === 5) {
    pc = 6;
    current.request = requestSelect.value();
    lastRequest = current.request;
    return;
  }
  if (pc === 6) {
    pc = 7;
    if (current.request === 'POST cmd=forward') motors = 'FORWARD';
    else if (current.request === 'POST cmd=stop') motors = 'STOPPED';
    return;
  }
  if (pc === 7) { pc = 8; return; }
  if (pc === 8) {
    pc = 9;
    return;
  }
}

// When the server closes conn at step 9, the browser is done.
function finishClose() {
  if (pc === 9 && current) {
    served++;
    current = null;
  }
}

function browserConnects(name) {
  const b = { name: name, ip: BROWSER_IP[name], request: '' };
  if (pc < 3 || bindError) {
    refused.push({ name: name, why: 'nobody listening' });
    message = 'Browser ' + name + ' was refused: the server is not listening on port 80 yet.';
    return;
  }
  if (isBlocked()) {
    current = b;
    pc = 5;
    message = 'Browser ' + name + ' connected, so accept() returned a NEW socket, conn, for it.';
    return;
  }
  if (queue.length < 1) {
    queue.push(b);
    message = 'Browser ' + name + ' waits in the listen(1) queue until the server calls accept() again.';
    return;
  }
  refused.push({ name: name, why: 'queue full' });
  message = 'Connection refused! listen(1) only holds 1 waiting browser.';
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  if (autoPlay) {
    autoTimer += deltaTime / 1000;
    if (autoTimer >= 1.2) {
      autoTimer = 0;
      if (!isBlocked() && !bindError) nextStep();
    }
  }
  if (motors === 'FORWARD') wheelAngle += deltaTime / 1000 * 8;
  if (bindError !== nextButton.elt.disabled) nextButton.elt.disabled = bindError;

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(canvasWidth < 600 ? 18 : 22);
  textAlign(LEFT, TOP);
  text('Socket Server Lifecycle', 10, 8);
  textSize(15);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Step ' + pc + ' of 9', canvasWidth - 10, 12);

  drawServerColumn();
  drawBrowserColumn();
  drawBlocking();
  drawCodeBar();
  drawQueue();
  drawControlLabels();
}

// row index highlighted for each step
function activeRow() {
  return [-1, 0, 1, 2, 3, 3, 4, 5, 6, 7][pc];
}

function rowState(i) {
  const a = activeRow();
  if (i === 8) return 'finally';
  if (bindError && i === 1) return 'failed';
  if (i === a) return 'active';
  if (i < 3) return pc > i + 1 ? 'done' : 'pending';
  // loop rows: done if already passed in this trip around the loop
  if (pc >= 4 && i < a) return 'done';
  return 'pending';
}

function stateFill(st) {
  if (st === 'active') return color(255, 214, 90);
  if (st === 'done') return color(200, 238, 205);
  if (st === 'failed') return color(255, 190, 190);
  return color(248);
}

function drawServerColumn() {
  const x = L.srvX, w = L.srvW;
  noStroke();
  fill('black');
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Robot (server, Pico W)', x, 40);
  textStyle(NORMAL);

  // while True loop box
  const lt = L.rowY[3] - 19, lb = L.rowY[7] + L.rowH + 6;
  stroke('steelblue');
  strokeWeight(1.5);
  noFill();
  rect(x - 6, lt, w + 2, lb - lt, 8);
  strokeWeight(1);
  noStroke();
  fill('steelblue');
  textFont('monospace');
  textSize(13);
  text('while True:', x, lt + 3);
  // return arrow from close() back to accept()
  const rx = x + w - 12;
  stroke('steelblue');
  strokeWeight(2);
  noFill();
  line(rx, L.rowY[7] + L.rowH / 2, rx, L.rowY[3] + L.rowH / 2);
  line(rx, L.rowY[7] + L.rowH / 2, rx - 10, L.rowY[7] + L.rowH / 2);
  noStroke();
  fill('steelblue');
  triangle(rx - 12, L.rowY[3] + L.rowH / 2, rx - 4, L.rowY[3] + L.rowH / 2 - 5, rx - 4, L.rowY[3] + L.rowH / 2 + 5);
  stroke('steelblue');
  line(rx, L.rowY[3] + L.rowH / 2, rx - 6, L.rowY[3] + L.rowH / 2);
  strokeWeight(1);

  for (let i = 0; i < ROWS.length; i++) {
    const st = rowState(i);
    const y = L.rowY[i];
    const bw = w - 26;
    let label = ROWS[i].code;
    if (i === 5) {
      label = 'handle_cmd(cmd)';
      if (pc >= 7 && current) {
        if (current.request === 'POST cmd=forward') label = 'handle_cmd("forward") -> go_forward()';
        else if (current.request === 'POST cmd=stop') label = 'handle_cmd("stop") -> stop_motors()';
        else label = 'GET /: no cmd, skip handle_cmd()';
      }
    }
    if (i === 8) {
      const on = closeCheckbox.checked();
      stroke(on ? 'gray' : 'firebrick');
      if (!on) drawingContext.setLineDash([4, 3]);
      fill(on ? 248 : color(255, 240, 240));
      rect(x, y, bw, L.rowH - 4, 5);
      drawingContext.setLineDash([]);
      noStroke();
      fill(on ? 'black' : 'firebrick');
      textSize(13);
      textAlign(LEFT, CENTER);
      text(on ? label : '(no s.close() at the end)', x + 8, y + (L.rowH - 4) / 2);
      continue;
    }
    stroke(st === 'active' ? 'darkgoldenrod' : st === 'failed' ? 'red' : 'gray');
    strokeWeight(st === 'active' ? 2 : 1);
    fill(stateFill(st));
    rect(x, y, bw, L.rowH, 5);
    strokeWeight(1);
    noStroke();
    fill('black');
    let ts = 14;
    textSize(ts);
    while (ts > 9 && textWidth(label) > bw - 14) { ts -= 0.5; textSize(ts); }
    textAlign(LEFT, CENTER);
    text(label, x + 8, y + L.rowH / 2);
  }
  textFont('sans-serif');
}

function drawBrowserColumn() {
  const x = L.leftX, w = L.leftW;
  noStroke();
  fill('black');
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Browser (client)', x, 40);
  textStyle(NORMAL);

  drawMotors(x, 62, w);

  // the four browser steps line up with accept, recv, send, close
  const who = current ? current.name : null;
  const req = current && current.request ? current.request : requestSelect.value();
  const steps = [
    { row: 3, text: 'connect to ' + SERVER_IP + ':80', on: pc >= 5, act: pc === 5 },
    { row: 4, text: 'send ' + req, on: pc >= 6, act: pc === 6 },
    { row: 6, text: 'receive HTML', on: pc >= 8, act: pc === 8 },
    { row: 7, text: 'close', on: pc >= 9, act: pc === 9 }
  ];
  noStroke();
  fill(who ? 'navy' : 'gray');
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text(who ? 'Browser ' + who + '  (' + current.ip + ')' : 'no browser connected', x, L.rowY[3] - 6);
  for (const s of steps) {
    const y = L.rowY[s.row];
    const st = !who ? 'pending' : s.act ? 'active' : s.on ? 'done' : 'pending';
    stroke(st === 'active' ? 'darkgoldenrod' : 'gray');
    strokeWeight(st === 'active' ? 2 : 1);
    fill(stateFill(st));
    rect(x, y, w, L.rowH, 5);
    strokeWeight(1);
    noStroke();
    fill(who ? 'black' : 150);
    let ts = 14;
    textSize(ts);
    while (ts > 9 && textWidth(s.text) > w - 12) { ts -= 0.5; textSize(ts); }
    textAlign(LEFT, CENTER);
    text(s.text, x + 8, y + L.rowH / 2);
    // network arrows between the columns
    if (who && (s.on || s.act)) {
      const y2 = y + L.rowH / 2;
      const ax1 = x + w + 4, ax2 = L.srvX - 4;
      const toServer = s.row !== 6;
      const c = s.act ? color('darkgoldenrod') : color('seagreen');
      stroke(c);
      strokeWeight(s.act ? 3 : 2);
      line(ax1, y2, ax2, y2);
      noStroke();
      fill(c);
      if (toServer) triangle(ax2, y2, ax2 - 9, y2 - 5, ax2 - 9, y2 + 5);
      else triangle(ax1, y2, ax1 + 9, y2 - 5, ax1 + 9, y2 + 5);
      strokeWeight(1);
    }
  }
}

function drawMotors(x, y, w) {
  stroke('silver');
  fill(255, 255, 255, 220);
  rect(x, y, w, 72, 8);
  // tiny robot, top view
  const cx = x + 44, cy = y + 36;
  stroke('darkolivegreen');
  fill('olivedrab');
  rect(cx - 20, cy - 16, 40, 32, 5);
  for (const side of [-1, 1]) {
    push();
    translate(cx, cy + side * 21);
    noStroke();
    fill(40);
    rect(-10, -4, 20, 8, 2);
    // spokes move when the wheels spin
    stroke(200);
    for (let k = 0; k < 3; k++) {
      const sx = ((wheelAngle * 6 + k * 7) % 20) - 10;
      line(sx, -3, sx, 3);
    }
    pop();
  }
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Motors:', x + 76, y + 8);
  fill(motors === 'FORWARD' ? 'darkgreen' : 'firebrick');
  textStyle(BOLD);
  text(motors === 'FORWARD' ? 'go_forward()' : 'stopped', x + 76, y + 26);
  textStyle(NORMAL);
  fill('dimgray');
  textSize(13);
  text('Browsers served: ' + served, x + 76, y + 46);
}

function drawBlocking() {
  if (!isBlocked()) return;
  const y = L.rowY[3];
  const x1 = L.leftX + L.leftW + 8, x2 = L.srvX - 8;
  const pulse = 0.5 + 0.5 * sin(millis() / 180);
  noStroke();
  fill(220, 30, 30, 150 + 105 * pulse);
  rect(x1, y - 2, x2 - x1, L.rowH + 4, 6);
  fill('white');
  textSize(canvasWidth < 700 ? 11 : 13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('WAITING (blocked)', (x1 + x2) / 2, y + L.rowH / 2);
  textStyle(NORMAL);
  // stopwatch
  const secs = (millis() - waitStart) / 1000;
  const sx = (x1 + x2) / 2, sy = y + L.rowH + 22;
  stroke('firebrick');
  strokeWeight(2);
  fill('white');
  circle(sx - 26, sy, 20);
  line(sx - 26, sy, sx - 26 + 7 * sin(secs * TWO_PI / 5), sy - 7 * cos(secs * TWO_PI / 5));
  line(sx - 26, sy - 10, sx - 26, sy - 13);
  strokeWeight(1);
  noStroke();
  fill('firebrick');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(secs.toFixed(1) + ' s', sx - 12, sy);
}

function drawCodeBar() {
  const x = 10, y = L.codeY, w = canvasWidth - 20, h = 34;
  const a = activeRow();
  stroke('dimgray');
  fill(35);
  rect(x, y, w, h, 6);
  noStroke();
  textFont('monospace');
  textSize(14);
  textAlign(LEFT, CENTER);
  let code = a >= 0 ? ROWS[a].code : '# not started';
  if (a === 5 && current) {
    if (current.request === 'POST cmd=forward') code = 'handle_cmd("forward")   # calls go_forward()';
    else if (current.request === 'POST cmd=stop') code = 'handle_cmd("stop")      # calls stop_motors()';
    else code = '# GET / has no cmd=, so handle_cmd() is skipped';
  }
  if (a === 4 && current) code = 'request = conn.recv(1024)   # "' + (current.request.startsWith('GET') ? 'GET / HTTP/1.1' : 'POST / ... ' + current.request.slice(5)) + '"';
  fill(bindError ? color(255, 140, 140) : color(255, 225, 120));
  text(code, x + 10, y + h / 2);
  textFont('sans-serif');
  // plain-language explanation under the code
  let note = message;
  if (!note && a >= 0) note = ROWS[a].note;
  noStroke();
  fill(bindError || note.startsWith('Connection refused') ? 'firebrick' : 'black');
  let ts = 14;
  textSize(ts);
  while (ts > 10 && textWidth(note) > w) { ts -= 0.5; textSize(ts); }
  textAlign(LEFT, TOP);
  text(note, x + 2, y + h + 4, w, 34);
}

function drawQueue() {
  const y = L.queueY + 6;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('listen(1) queue:', 10, y + 15);
  const qx = 10 + textWidth('listen(1) queue:') + 8;
  stroke('steelblue');
  strokeWeight(2);
  fill(queue.length ? color(225, 238, 255) : 'white');
  rect(qx, y, 110, 30, 5);
  strokeWeight(1);
  if (queue.length) {
    drawBrowserIcon(qx + 16, y + 15, false);
    noStroke();
    fill('navy');
    textSize(14);
    textAlign(LEFT, CENTER);
    text('Browser ' + queue[0].name, qx + 30, y + 15);
  } else {
    noStroke();
    fill(160);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('(empty)', qx + 55, y + 15);
  }
  // refused browsers
  let rx = qx + 130;
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  if (refused.length) {
    text('Refused:', rx, y + 15);
    rx += textWidth('Refused:') + 10;
    for (const r of refused.slice(-6)) {
      if (rx > canvasWidth - 40) break;
      drawBrowserIcon(rx + 8, y + 15, true);
      noStroke();
      fill('firebrick');
      textSize(13);
      text(r.name, rx + 20, y + 15);
      rx += 40;
    }
  }
}

function drawBrowserIcon(x, y, refusedIcon) {
  stroke('gray');
  fill('white');
  rect(x - 9, y - 8, 18, 15, 2);
  noStroke();
  fill('steelblue');
  rect(x - 9, y - 8, 18, 4, 2);
  if (refusedIcon) {
    stroke('red');
    strokeWeight(2.5);
    line(x - 9, y - 8, x + 9, y + 7);
    line(x + 9, y - 8, x - 9, y + 7);
    strokeWeight(1);
  }
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Request type:', requestLabelX, y0 + 11);
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
