// BLE Connection Lifecycle
// CANVAS_HEIGHT: 544
// Bloom L3 (Apply, verb Sequence): put the BLE connection steps in order and
// match each step to the IRQ event code and the function call in the leader
// and follower code from Chapter 12. Two state machines (follower and leader)
// with the current state in gold, as in the moving-rainbow state-machine sim.

let canvasWidth = 800;
let drawHeight = 464;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

const GOLD = [255, 210, 63];        // current state fill (#ffd23f)
const GOLD_EDGE = [202, 164, 0];    // current state border (#caa400)

const F_STATES = ['ADVERTISING', 'CONNECTED', 'EXECUTING'];
const L_STATES = ['SCANNING', 'CONNECTING', 'CONNECTED', 'SENDING'];
const PACKETS = ['Advertising packet', 'Connect request', 'Write command', 'Disconnect'];

const DEFINITIONS = {
  'F:ADVERTISING': 'ADVERTISING: the follower broadcasts "I am RobotFollower" about 10 times a second and waits for someone to connect.',
  'F:CONNECTED': 'CONNECTED: the follower has a link to the leader. It keeps the link open and waits for a command.',
  'F:EXECUTING': 'EXECUTING: a command was written to the follower. It reads the value with gatts_read() and runs the motors.',
  'L:SCANNING': 'SCANNING: the leader listens for advertising packets for 5 seconds, looking for the name RobotFollower.',
  'L:CONNECTING': 'CONNECTING: the leader found the follower, stopped scanning, and asked to connect with gap_connect().',
  'L:CONNECTED': 'CONNECTED: the leader has a link to the follower and can write commands to it.',
  'L:SENDING': 'SENDING: the leader writes a command such as b"FORWARD" to the follower with gattc_write().'
};

// ---------- state ----------
let step = 0;
let fState = 'ADVERTISING';
let lState = 'idle';
let fEvent = '', lEvent = '';
let packet = -1;               // index of the packet on the air
let packetsDone = [];
let code = '# Press Next Step to begin.';
let logLines = [];
let clock = 0;
let cmd = 'FORWARD';
let motors = 'STOPPED';
let ended = false;
let endNote = '';
let autoPlay = false;
let autoTimer = 0;
let wheel = 0;
let rangeTimer = -1;
let info = null;               // {key, x, y, until}
let circles = [];              // for click detection

// ---------- layout ----------
let colF = 150, colL = 650, midX = 400;

// ---------- controls ----------
let nextButton, autoButton, resetButton, fwdButton, stopButton, rangeCheckbox, nameSelect;
let nameLabelX = 240;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(clickState);
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
  resetButton.mousePressed(resetAll);
  fwdButton = createButton('Send FORWARD');
  fwdButton.parent(document.querySelector('main'));
  fwdButton.mousePressed(() => sendCommand('FORWARD'));
  stopButton = createButton('Send STOP');
  stopButton.parent(document.querySelector('main'));
  stopButton.mousePressed(() => sendCommand('STOP'));

  rangeCheckbox = createCheckbox(' Walk out of range', false);
  rangeCheckbox.parent(document.querySelector('main'));
  rangeCheckbox.changed(rangeChanged);
  nameSelect = createSelect();
  nameSelect.parent(document.querySelector('main'));
  nameSelect.option('RobotFollower');
  nameSelect.option('Robot2');
  nameSelect.selected('RobotFollower');
  nameSelect.changed(resetAll);

  positionControls();
  resetAll();

  describe('Two BLE state machines side by side. The follower (peripheral) has states ADVERTISING, CONNECTED, and ' +
    'EXECUTING. The leader (central) has states SCANNING, CONNECTING, CONNECTED, and SENDING. The current state on each ' +
    'side is gold. The middle column shows radio packets: advertising packet, connect request, write command, and ' +
    'disconnect. Event badges show IRQ codes such as _IRQ_CENTRAL_CONNECT (1) and _IRQ_PERIPHERAL_CONNECT (7). A code ' +
    'strip shows the MicroPython call for each step, and a log lists time-stamped messages.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  for (const b of [nextButton, autoButton, resetButton, fwdButton, stopButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 90) + 6;
  }
  rangeCheckbox.position(10, y0 + 39);
  nameLabelX = 10 + (rangeCheckbox.elt.offsetWidth || 170) + 24;
  textSize(defaultTextSize);
  nameSelect.position(nameLabelX + textWidth('Follower advertising name:') + 8, y0 + 36);
}

function computeLayout() {
  colF = canvasWidth * 0.18;
  colL = canvasWidth * 0.82;
  midX = canvasWidth * 0.5;
}

// ---------- the connection story ----------
const TOTAL_STEPS = 8;

function resetAll() {
  step = 0;
  fState = 'ADVERTISING';
  lState = 'idle';
  fEvent = '';
  lEvent = '';
  packet = -1;
  packetsDone = [];
  code = 'advertise()   # the follower already runs this at startup';
  logLines = [];
  clock = 0;
  cmd = 'FORWARD';
  motors = 'STOPPED';
  ended = false;
  endNote = '';
  autoPlay = false;
  rangeTimer = -1;
  info = null;
  if (autoButton) autoButton.html('Auto Play');
  if (rangeCheckbox) rangeCheckbox.checked(false);
}

function addLog(who, msg) {
  logLines.push('[' + clock.toFixed(1) + ' s] ' + who + ': ' + msg);
  if (logLines.length > 40) logLines.shift();
}

function toggleAuto() {
  if (ended) resetAll();
  autoPlay = !autoPlay;
  autoButton.html(autoPlay ? 'Pause' : 'Auto Play');
  autoTimer = 0;
}

function bothConnected() {
  return fState === 'CONNECTED' && lState === 'CONNECTED';
}

function nextStep() {
  if (ended) return;
  const name = nameSelect.value();
  const outOfRange = rangeCheckbox.checked();
  if (step === 0) {
    step = 1;
    clock = 0.0;
    fState = 'ADVERTISING';
    packet = 0;
    code = 'ble.gap_advertise(100_000, adv_data=payload)   # follower';
    addLog('Follower', "Advertising as '" + name + "'...");
    return;
  }
  if (step === 1) {
    step = 2;
    clock = 0.2;
    lState = 'SCANNING';
    packet = 0;
    code = 'ble.gap_scan(5000)   # leader scans for 5 seconds';
    addLog('Leader', 'Scanning for 5 s...');
    return;
  }
  if (step === 2) {
    // did the leader hear the follower, and does the name match?
    if (outOfRange) {
      clock = 5.2;
      lState = 'idle';
      packet = -1;
      lEvent = '';
      code = '# _IRQ_SCAN_DONE: the 5 second scan ended';
      addLog('Leader', 'Scan finished - follower not found (out of range)');
      finish('The leader never heard an advertising packet. Move the robots closer and press Reset.');
      return;
    }
    if (name !== 'RobotFollower') {
      clock = 0.4;
      lEvent = '_IRQ_SCAN_RESULT (5)';
      packetsDone = [0];
      code = 'if b"RobotFollower" in adv_data:   # False! the name is Robot2';
      addLog('Leader', "Heard 'Robot2' - not the name we want, keep scanning");
      step = 2.5;
      return;
    }
    step = 3;
    clock = 0.4;
    lEvent = '_IRQ_SCAN_RESULT (5)';
    lState = 'CONNECTING';
    packetsDone = [0];
    packet = 1;
    code = 'ble.gap_scan(None); ble.gap_connect(addr_type, addr)   # leader';
    addLog('Leader', 'Found follower - connecting...');
    return;
  }
  if (step === 2.5) {
    clock = 5.2;
    lState = 'idle';
    lEvent = '';
    packet = -1;
    code = '# the 5 second gap_scan(5000) ended with no match';
    addLog('Leader', 'Scan finished - follower not found');
    finish('The leader only connects to a device whose advertising data contains b"RobotFollower".');
    return;
  }
  if (step === 3) {
    step = 4;
    clock = 0.6;
    fState = 'CONNECTED';
    lState = 'CONNECTED';
    fEvent = '_IRQ_CENTRAL_CONNECT (1)';
    lEvent = '_IRQ_PERIPHERAL_CONNECT (7)';
    packetsDone = [0, 1];
    packet = -1;
    code = 'conn_handle, _, _ = data   # both robots save the connection handle';
    addLog('Follower', 'Leader connected!');
    addLog('Leader', 'Connected to follower!');
    if (outOfRange) rangeTimer = millis();
    return;
  }
  if (step === 4) {                 // leader writes the first command
    writeCommand();
    return;
  }
  if (step === 7) {                 // Send buttons write again; Next Step disconnects
    disconnect(false);
    return;
  }
  if (step === 5) {
    step = 6;
    clock += 0.02;
    fState = 'EXECUTING';
    fEvent = '_IRQ_GATTS_WRITE (3)';
    packet = -1;
    packetsDone = [0, 1, 2];
    motors = cmd === 'FORWARD' ? 'FORWARD' : 'STOPPED';
    code = 'cmd = ble.gatts_read(cmd_handle).decode().strip()   # follower';
    addLog('Follower', 'Command received: ' + cmd);
    return;
  }
  if (step === 6) {
    step = 7;
    clock += 0.01;
    fState = 'CONNECTED';
    lState = 'CONNECTED';
    lEvent = '_IRQ_GATTC_WRITE_DONE (17)';
    code = '# _IRQ_GATTC_WRITE_DONE: the write was delivered';
    addLog('Leader', 'Write done');
    return;
  }
}

function writeCommand() {
  step = 5;
  clock = max(clock + 0.4, 1.0);
  lState = 'SENDING';
  packet = 2;
  code = 'ble.gattc_write(conn_handle, value_handle, b"' + cmd + '", 1)   # leader';
  addLog('Leader', 'Sent: ' + cmd);
}

function sendCommand(c) {
  if (!bothConnected() || (step !== 4 && step !== 7)) return;
  cmd = c;
  writeCommand();
}

function disconnect(lost) {
  step = 8;
  clock += lost ? 3 : 1;
  packet = lost ? -1 : 3;
  packetsDone = lost ? packetsDone : [0, 1, 2];
  fEvent = '_IRQ_CENTRAL_DISCONNECT (2)';
  lEvent = '_IRQ_PERIPHERAL_DISCONNECT (8)';
  fState = 'ADVERTISING';
  lState = 'idle';
  motors = 'STOPPED';
  code = lost ? '# link lost: both robots get a disconnect event' : 'ble.gap_disconnect(conn_handle)   # leader';
  if (lost) addLog('Both', 'Link lost - out of range');
  addLog('Leader', 'Follower disconnected.');
  addLog('Follower', "bt_irq calls advertise() again: Advertising as '" + nameSelect.value() + "'...");
  finish('The follower advertises again by itself. The chapter\'s leader code does not restart gap_scan(), so the leader stays idle.');
}

function finish(note) {
  ended = true;
  endNote = note;
  autoPlay = false;
  autoButton.html('Auto Play');
}

function rangeChanged() {
  if (rangeCheckbox.checked() && (step >= 4 && step <= 7)) rangeTimer = millis();
  if (!rangeCheckbox.checked()) rangeTimer = -1;
}

// ---------- clicking a state circle ----------
function clickState() {
  for (const c of circles) {
    if (dist(mouseX, mouseY, c.x, c.y) <= c.r) {
      info = { key: c.key, x: c.x, y: c.y, until: millis() + 7000 };
      return;
    }
  }
  info = null;
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  if (autoPlay && !ended) {
    autoTimer += deltaTime / 1000;
    if (autoTimer >= 1.5) {
      autoTimer = 0;
      nextStep();
    }
  }
  // walking out of range drops the link after 3 seconds
  if (rangeTimer > 0 && !ended && fState !== 'ADVERTISING' && millis() - rangeTimer > 3000) {
    rangeTimer = -1;
    disconnect(true);
  }
  if (motors === 'FORWARD') wheel += deltaTime / 1000 * 10;
  const canSend = bothConnected() && (step === 4 || step === 7) && !ended;
  for (const b of [fwdButton, stopButton]) if (b.elt.disabled === canSend) b.elt.disabled = !canSend;
  if (nextButton.elt.disabled !== ended) nextButton.elt.disabled = ended;

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
  text('BLE Connection Lifecycle', 10, 6);
  textSize(15);
  fill('dimgray');
  textAlign(RIGHT, TOP);
  text('Step ' + min(TOTAL_STEPS, floor(step)) + ' of ' + TOTAL_STEPS, canvasWidth - 10, 10);

  circles = [];
  drawColumn(colF, 'Follower (peripheral)', F_STATES, fState, fEvent, 'F', true);
  drawColumn(colL, 'Leader (central)', L_STATES, lState, lEvent, 'L', false);
  drawRadio();
  drawCodeAndLog();
  drawInfo();
  drawControlLabels();
}

function drawRobot(x, y, isFollower) {
  stroke('darkolivegreen');
  fill('olivedrab');
  rect(x - 22, y, 44, 30, 5);
  const moving = isFollower && motors === 'FORWARD';
  for (const side of [-1, 1]) {
    push();
    translate(x + side * 26, y + 15);
    noStroke();
    fill(40);
    rect(-4, -12, 8, 24, 2);
    stroke(200);
    for (let k = 0; k < 3; k++) {
      const sy = moving ? ((wheel * 6 + k * 8) % 24) - 12 : -8 + k * 8;
      line(-3, sy, 3, sy);
    }
    pop();
  }
  noStroke();
  fill('dodgerblue');
  circle(x, y + 15, 10);
}

function drawColumn(cx, title, states, current, eventText, tag, isFollower) {
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text(title, cx, 36);
  textStyle(NORMAL);
  drawRobot(cx, 56, isFollower);
  // event badge
  const by = 92;
  if (eventText) {
    textFont('monospace');
    textSize(canvasWidth < 700 ? 10.5 : 12);
    const w = textWidth(eventText) + 12;
    fill(40, 40, 90);
    rect(cx - w / 2, by, w, 20, 10);
    fill('white');
    textAlign(CENTER, CENTER);
    text(eventText, cx, by + 10);
    textFont('sans-serif');
  } else {
    fill(120);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(current === 'idle' ? 'idle (not scanning)' : 'no event yet', cx, by + 10);
  }
  // state circles, top to bottom
  const top = 154, bottom = 314;
  const n = states.length;
  const r = min(30, (bottom - top) / (n - 1) / 2 - 4, canvasWidth * 0.08);
  const ys = states.map((s, i) => top + (bottom - top) * i / (n - 1));
  // arrows between neighbors
  stroke(150);
  strokeWeight(2);
  for (let i = 0; i < n - 1; i++) {
    line(cx, ys[i] + r, cx, ys[i + 1] - r - 2);
    noStroke();
    fill(150);
    triangle(cx, ys[i + 1] - r, cx - 5, ys[i + 1] - r - 9, cx + 5, ys[i + 1] - r - 9);
    stroke(150);
  }
  // return arrow from the last state back to CONNECTED (EXECUTING -> CONNECTED, SENDING -> CONNECTED)
  const back = isFollower ? 1 : 2;
  const side = isFollower ? -1 : 1;
  const bx = cx + side * (r + 16);
  noFill();
  line(cx + side * r * 0.7, ys[n - 1] - r * 0.7, bx, ys[n - 1] - r * 0.4);
  line(bx, ys[n - 1] - r * 0.4, bx, ys[back] + r * 0.4);
  line(bx, ys[back] + r * 0.4, cx + side * r * 0.75, ys[back] + r * 0.6);
  strokeWeight(1);
  for (let i = 0; i < n; i++) {
    const on = states[i] === current;
    stroke(on ? color(GOLD_EDGE) : color(170));
    strokeWeight(on ? 4 : 1.5);
    fill(on ? color(GOLD) : color(235));
    circle(cx, ys[i], 2 * r);
    strokeWeight(1);
    noStroke();
    fill(on ? 'black' : 110);
    let ts = 12;
    textSize(ts);
    textStyle(on ? BOLD : NORMAL);
    while (ts > 8 && textWidth(states[i]) > 2 * r + 30) { ts -= 0.5; textSize(ts); }
    textAlign(CENTER, CENTER);
    // label beside the circle so it stays readable
    const lx = cx - side * (r + 8);
    textAlign(isFollower ? LEFT : RIGHT, CENTER);
    text(states[i], lx, ys[i]);
    textStyle(NORMAL);
    circles.push({ x: cx, y: ys[i], r: r, key: tag + ':' + states[i] });
  }
  if (current === 'idle' && eventText) {
    noStroke();
    fill(120);
    textSize(12);
    textAlign(CENTER, TOP);
    text('idle (not scanning)', cx, 115);
  }
}

function drawRadio() {
  const x = midX, w = canvasWidth * 0.28;
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Radio link', x, 36);
  textStyle(NORMAL);
  // dashed radio wave between the robots while a packet is on the air
  if (packet >= 0) {
    stroke('dodgerblue');
    strokeWeight(2);
    drawingContext.setLineDash([6, 6]);
    drawingContext.lineDashOffset = -millis() / 40 * (packet === 0 ? -1 : 1);
    noFill();
    beginShape();
    for (let px = colF + 34; px <= colL - 34; px += 6) {
      vertex(px, 71 + 6 * sin((px - millis() / 5) / 12));
    }
    endShape();
    drawingContext.setLineDash([]);
    drawingContext.lineDashOffset = 0;
    strokeWeight(1);
  }
  // one arrow per packet type
  const toLeader = [true, false, false, false];
  for (let i = 0; i < PACKETS.length; i++) {
    const y = 158 + i * 52;
    const active = packet === i;
    const done = packetsDone.includes(i);
    const c = active ? color('darkgoldenrod') : done ? color('seagreen') : color(185);
    const x1 = x - w / 2, x2 = x + w / 2;
    stroke(c);
    strokeWeight(active ? 3 : 2);
    if (!active && !done) drawingContext.setLineDash([5, 4]);
    line(x1, y, x2, y);
    drawingContext.setLineDash([]);
    noStroke();
    fill(c);
    if (toLeader[i]) triangle(x2, y, x2 - 10, y - 5, x2 - 10, y + 5);
    else triangle(x1, y, x1 + 10, y - 5, x1 + 10, y + 5);
    strokeWeight(1);
    fill(active ? 'black' : done ? color(30, 90, 50) : 140);
    textSize(13);
    textAlign(CENTER, BOTTOM);
    text(PACKETS[i], x, y - 4);
  }
}

function drawCodeAndLog() {
  const x = 10, w = canvasWidth - 20;
  const cy = 352;
  stroke('dimgray');
  fill(35);
  rect(x, cy, w, 26, 5);
  noStroke();
  textFont('monospace');
  let ts = 13;
  textSize(ts);
  while (ts > 9 && textWidth(code) > w - 16) { ts -= 0.5; textSize(ts); }
  fill(255, 225, 120);
  textAlign(LEFT, CENTER);
  text(code, x + 8, cy + 13);
  // log (the newest lines)
  const ly = cy + 32, lh = drawHeight - ly - 8;
  stroke('silver');
  fill(252);
  rect(x, ly, w, lh, 5);
  noStroke();
  textSize(12);
  const lineH = 15;
  const maxLines = floor((lh - 6) / lineH);
  let lines = logLines.slice(-maxLines);
  if (ended && endNote) lines = logLines.slice(-(maxLines - 2));
  let y = ly + 4;
  for (const ln of lines) {
    fill(ln.includes('Follower:') ? color(60, 90, 20) : ln.includes('Both') ? color('firebrick') : color('navy'));
    textAlign(LEFT, TOP);
    text(ln, x + 8, y, w - 16, lineH);
    y += lineH;
  }
  textFont('sans-serif');
  if (ended && endNote) {
    fill('firebrick');
    textSize(12.5);
    textStyle(BOLD);
    text('Note: ' + endNote, x + 8, y, w - 16, 2 * lineH + 4);
    textStyle(NORMAL);
  }
  if (logLines.length === 0) {
    fill(150);
    textSize(13);
    textAlign(LEFT, TOP);
    text('Event log is empty. Press Next Step. Click any state circle to read what it means.', x + 8, ly + 5);
  }
}

function drawInfo() {
  if (!info || millis() > info.until) return;
  const txt = DEFINITIONS[info.key];
  if (!txt) return;
  const w = min(300, canvasWidth * 0.42), h = 74;
  let bx = info.key.startsWith('F') ? info.x + 40 : info.x - 40 - w;
  bx = constrain(bx, 6, canvasWidth - w - 6);
  const by = constrain(info.y - h / 2, 40, drawHeight - h - 100);
  stroke(GOLD_EDGE);
  strokeWeight(2);
  fill(255, 250, 225, 250);
  rect(bx, by, w, h, 8);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  text(txt, bx + 8, by + 6, w - 16, h - 10);
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Follower advertising name:', nameLabelX, y0 + 47);
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
