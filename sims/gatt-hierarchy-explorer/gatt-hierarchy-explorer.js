// GATT Hierarchy Explorer
// CANVAS_HEIGHT: 520
// Bloom L2 (Understand, verb Classify): identify the device, service,
// characteristic, UUID, and property in a GATT tree, and predict which
// operations a characteristic allows. Click a box to see its details, then act
// as the leader robot (the central) and try Read, Write, or Subscribe.

let canvasWidth = 800;
let drawHeight = 440;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// ---------- the follower's GATT tree ----------
const NODES = [
  { id: 'device', type: 'device', name: 'Device: RobotFollower', short: 'RobotFollower', level: 0,
    uuid: '', props: [], color: 'olivedrab',
    plain: 'A device: the follower robot itself. It holds services.' },
  { id: 'service', type: 'service', name: 'Service: Robot Command Service', short: 'Robot Command Service', level: 1,
    uuid: '12345678-1234-5678-1234-56789abcdef0', props: [], color: 'royalblue',
    plain: 'A category of related data. It holds characteristics.' },
  { id: 'command', type: 'characteristic', name: 'Characteristic: Command', short: 'Command', level: 2,
    uuid: '12345678-1234-5678-1234-56789abcdef1', props: ['WRITE'], flags: '_FLAG_WRITE = 0x0008', color: 'darkorange',
    plain: 'A single data slot. The leader writes a command string here.' },
  { id: 'status', type: 'characteristic', name: 'Characteristic: Status', short: 'Status', level: 2,
    uuid: '12345678-1234-5678-1234-56789abcdef2', props: ['READ', 'NOTIFY'], flags: '_FLAG_READ | _FLAG_NOTIFY = 0x0012', color: 'darkorange',
    note: 'optional, not in our code', plain: 'A single data slot. The follower reports "OK" or "BUSY" here.' },
  { id: 'battery', type: 'service', name: 'Service: Battery Service', short: 'Battery Service', level: 1,
    uuid: '0x180F', props: [], color: 'gray', note: 'extra example, not in our code',
    plain: 'A category of related data. 0x180F is the standard short UUID for battery information.' }
];

let selectedId = 'command';
let values = { command: '', status: 'OK' };
let logLines = [];
let result = { text: 'Command is selected. Pick a value and try Write, Read, or Subscribe.', ok: null };
let subscribed = false;
let notifyTimer = 0;
let motor = 'STOPPED';
let wheel = 0;
let boxes = [];           // clickable tree boxes

// layout
let treeR = {}, detailR = {}, logR = {};

// controls
let valueSelect, valueInput, readButton, writeButton, subButton;
let lookupInput, lookupButton, resetButton;
let valueLabelX = 10, lookupLabelX = 10;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(clickTree);
  textSize(defaultTextSize);

  valueSelect = createSelect();
  valueSelect.parent(document.querySelector('main'));
  for (const v of ['FORWARD', 'STOP', 'LEFT', 'RIGHT', 'custom...']) valueSelect.option(v);
  valueSelect.selected('FORWARD');
  valueSelect.changed(() => {
    if (valueSelect.value() !== 'custom...') valueInput.value(valueSelect.value());
    else { valueInput.value(''); valueInput.elt.focus(); }
  });
  valueInput = createInput('FORWARD');
  valueInput.parent(document.querySelector('main'));
  valueInput.attribute('maxlength', '20');
  valueInput.size(100);

  readButton = createButton('Read');
  readButton.parent(document.querySelector('main'));
  readButton.mousePressed(doRead);
  writeButton = createButton('Write');
  writeButton.parent(document.querySelector('main'));
  writeButton.mousePressed(doWrite);
  subButton = createButton('Subscribe (notify)');
  subButton.parent(document.querySelector('main'));
  subButton.mousePressed(doSubscribe);

  lookupInput = createInput('');
  lookupInput.parent(document.querySelector('main'));
  lookupInput.attribute('placeholder', 'type a UUID');
  lookupInput.size(200);
  lookupButton = createButton('Look up');
  lookupButton.parent(document.querySelector('main'));
  lookupButton.mousePressed(doLookup);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  positionControls();

  describe('A GATT tree for the follower robot drawn as nested boxes: the device RobotFollower holds the Robot Command ' +
    'Service, which holds the Command characteristic (WRITE only) and an optional Status characteristic (READ and ' +
    'NOTIFY); a gray Battery Service is an extra example. Clicking a box shows its type, UUID, properties, and a ' +
    'plain-language meaning. Read, Write, and Subscribe buttons act as the leader robot, and a message log shows the ' +
    'result, including refusals when a property is missing.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  textSize(defaultTextSize);
  valueLabelX = 10;
  let x = 10 + textWidth('Value:') + 8;
  valueSelect.position(x, y0);
  x += (valueSelect.elt.offsetWidth || 100) + 6;
  valueInput.position(x, y0);
  x += (valueInput.elt.offsetWidth || 100) + 12;
  for (const b of [readButton, writeButton, subButton]) {
    b.position(x, y0);
    x += (b.elt.offsetWidth || 70) + 6;
  }
  lookupLabelX = 10;
  x = 10 + textWidth('Look up UUID:') + 8;
  lookupInput.position(x, y0 + 38);
  lookupInput.size(min(300, max(120, canvasWidth - x - 170)));
  x += (lookupInput.elt.offsetWidth || 200) + 6;
  lookupButton.position(x, y0 + 38);
  x += (lookupButton.elt.offsetWidth || 70) + 6;
  resetButton.position(x, y0 + 38);
}

function computeLayout() {
  const tw = floor(canvasWidth * 0.5);
  treeR = { x: 10, y: 36, w: tw - 15, h: drawHeight - 44 };
  detailR = { x: tw + 5, y: 36, w: canvasWidth - tw - 15, h: 200 };
  logR = { x: tw + 5, y: 244, w: canvasWidth - tw - 15, h: drawHeight - 244 - 8 };
}

// ---------- actions (the leader is the central) ----------
function node(id) {
  return NODES.find(n => n.id === id);
}

function addLog(line) {
  logLines.push(line);
  if (logLines.length > 60) logLines.shift();
}

function refuse(n, prop) {
  if (n.type !== 'characteristic') {
    result = { text: 'Data lives in characteristics. A ' + n.type + ' has no value to ' + prop.toLowerCase() + '.', ok: false };
    addLog('Central -> ' + prop + ' ' + n.short + ': not a characteristic');
    return true;
  }
  if (!n.props.includes(prop)) {
    result = { text: 'Not permitted: ' + n.short + ' has no ' + prop + ' property.', ok: false };
    addLog('Central -> ' + prop + ' ' + n.short + ': not permitted');
    return true;
  }
  return false;
}

function doWrite() {
  const n = node(selectedId);
  if (refuse(n, 'WRITE')) return;
  const v = (valueInput.value() || '').trim().toUpperCase().slice(0, 20);
  if (!v) {
    result = { text: 'Type a value to write first.', ok: false };
    return;
  }
  values[n.id] = v;
  addLog('Central -> WRITE ' + n.short + ' "' + v + '"');
  addLog('Peripheral IRQ: _IRQ_GATTS_WRITE (3)');
  addLog('Peripheral: ble.gatts_read(cmd_handle) -> b"' + v + '"');
  if (['FORWARD', 'STOP', 'LEFT', 'RIGHT'].includes(v)) {
    motor = v === 'STOP' ? 'STOPPED' : v;
    addLog('Peripheral: execute_command("' + v + '")');
    result = { text: 'Written! The follower got event 3, read "' + v + '", and ran the motors.', ok: true };
  } else {
    addLog('Peripheral: Command received: ' + v + ' (unknown, ignored)');
    result = { text: 'Written, but "' + v + '" is not a command the follower knows, so the motors do nothing.', ok: true };
  }
}

function doRead() {
  const n = node(selectedId);
  if (refuse(n, 'READ')) return;
  addLog('Central -> READ ' + n.short);
  addLog('Peripheral -> b"' + values[n.id] + '"');
  result = { text: 'Read ' + n.short + ': b"' + values[n.id] + '"', ok: true };
}

function doSubscribe() {
  const n = node(selectedId);
  if (subscribed) {
    subscribed = false;
    addLog('Central -> UNSUBSCRIBE Status');
    result = { text: 'Notifications stopped.', ok: true };
    return;
  }
  if (refuse(n, 'NOTIFY')) return;
  subscribed = true;
  notifyTimer = 0;
  addLog('Central -> SUBSCRIBE ' + n.short + ' (notify)');
  result = { text: 'Subscribed! The follower now sends Status every 2 seconds without being asked.', ok: true };
}

function doLookup() {
  const q = (lookupInput.value() || '').trim().toLowerCase();
  if (!q) {
    result = { text: 'Type a UUID to look up, such as 12345678-1234-5678-1234-56789abcdef1.', ok: null };
    return;
  }
  const exact = NODES.find(n => n.uuid && n.uuid.toLowerCase() === q);
  const ends = NODES.filter(n => n.uuid && q.length >= 4 && n.uuid.toLowerCase().endsWith(q));
  const hit = exact || (ends.length === 1 ? ends[0] : null);
  if (hit) {
    selectedId = hit.id;
    addLog('Look up ' + q + ' -> ' + hit.name);
    result = { text: 'Found: ' + hit.name + '.', ok: true };
  } else {
    addLog('Look up ' + q + ' -> No such attribute');
    result = { text: 'No such attribute. Check every digit of the UUID.', ok: false };
  }
}

function resetAll() {
  selectedId = 'command';
  values = { command: '', status: 'OK' };
  logLines = [];
  subscribed = false;
  motor = 'STOPPED';
  valueSelect.selected('FORWARD');
  valueInput.value('FORWARD');
  lookupInput.value('');
  result = { text: 'Command is selected. Pick a value and try Write, Read, or Subscribe.', ok: null };
}

function clickTree() {
  for (const b of boxes) {
    if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
      selectedId = b.id;
      const n = node(b.id);
      result = { text: n.name + ' selected.', ok: null };
      return;
    }
  }
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  if (subscribed) {
    notifyTimer += deltaTime / 1000;
    if (notifyTimer >= 2) {
      notifyTimer = 0;
      values.status = motor === 'STOPPED' ? 'OK' : 'BUSY';
      addLog('Peripheral -> NOTIFY Status b"' + values.status + '"');
    }
  }
  if (motor !== 'STOPPED') wheel += deltaTime / 1000 * 10;
  styleActionButtons();
  const subLabel = subscribed ? 'Unsubscribe' : 'Subscribe (notify)';
  if (subButton.html() !== subLabel) subButton.html(subLabel);

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
  text('GATT Hierarchy Explorer', 10, 6);

  drawTree();
  drawDetail();
  drawLog();
  drawControlLabels();
}

// dim the buttons the selected item does not allow (they still explain why when pressed)
function styleActionButtons() {
  const n = node(selectedId);
  const allow = p => n.type === 'characteristic' && n.props.includes(p);
  readButton.style('opacity', allow('READ') ? '1' : '0.45');
  writeButton.style('opacity', allow('WRITE') ? '1' : '0.45');
  subButton.style('opacity', allow('NOTIFY') || subscribed ? '1' : '0.45');
}

function drawTree() {
  const r = treeR;
  stroke('silver');
  fill(255, 255, 255, 230);
  rect(r.x, r.y, r.w, r.h, 8);
  boxes = [];
  const indent = 22;
  const layout = {
    device: { y: r.y + 8, h: 34 },
    service: { y: r.y + 54, h: 52 },
    command: { y: r.y + 118, h: 86 },
    status: { y: r.y + 214, h: 86 },
    battery: { y: r.y + 312, h: 52 }
  };
  // tree lines
  stroke(150);
  strokeWeight(1.5);
  const lineX = lvl => r.x + 16 + lvl * indent;
  line(lineX(0), layout.device.y + layout.device.h, lineX(0), layout.battery.y + 24);
  line(lineX(0), layout.service.y + 24, lineX(1) - 2, layout.service.y + 24);
  line(lineX(0), layout.battery.y + 24, lineX(1) - 2, layout.battery.y + 24);
  line(lineX(1), layout.service.y + layout.service.h, lineX(1), layout.status.y + 24);
  line(lineX(1), layout.command.y + 24, lineX(2) - 2, layout.command.y + 24);
  line(lineX(1), layout.status.y + 24, lineX(2) - 2, layout.status.y + 24);
  strokeWeight(1);

  for (const n of NODES) {
    const L = layout[n.id];
    const x = r.x + 8 + n.level * indent + (n.level > 0 ? 8 : 0);
    const w = r.x + r.w - 8 - x;
    const sel = n.id === selectedId;
    const base = color(n.color);
    stroke(sel ? color(202, 164, 0) : base);
    strokeWeight(sel ? 4 : 2);
    fill(red(base), green(base), blue(base), n.id === 'battery' || n.note ? 22 : 34);
    if (n.note) drawingContext.setLineDash([6, 4]);
    rect(x, L.y, w, L.h, 7);
    drawingContext.setLineDash([]);
    strokeWeight(1);
    boxes.push({ id: n.id, x: x, y: L.y, w: w, h: L.h });
    // title
    noStroke();
    fill(n.id === 'battery' ? 90 : 20);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(n.name, x + 8, L.y + 5);
    textStyle(NORMAL);
    if (n.note) {
      // the note goes beside the title if it fits, otherwise in the bottom-right corner
      textSize(14);
      textStyle(BOLD);
      const titleW = textWidth(n.name);
      textStyle(NORMAL);
      textSize(11);
      const noteText = '(' + n.note + ')';
      fill(110);
      textAlign(RIGHT, TOP);
      if (titleW + textWidth(noteText) + 24 < w) text(noteText, x + w - 6, L.y + 7);
      else text(noteText, x + w - 6, L.y + L.h - 16);
      textAlign(LEFT, TOP);
    }
    // UUID line
    if (n.uuid) {
      textFont('monospace');
      textSize(12);
      fill(60);
      let u = n.type === 'characteristic' ? '...' + n.uuid.slice(-7) : n.uuid;
      if (textWidth('UUID ' + u) > w - 16) u = '...' + n.uuid.slice(-12);
      text('UUID ' + u, x + 8, L.y + 26);
      textFont('sans-serif');
    }
    if (n.type === 'characteristic') {
      // property badges
      let bx = x + 8;
      const by = L.y + 46;
      for (const p of ['READ', 'WRITE', 'NOTIFY']) {
        const has = n.props.includes(p);
        textSize(11);
        const bw = textWidth(p) + 12;
        stroke(has ? 'darkorange' : 'gainsboro');
        fill(has ? color(255, 225, 180) : color(248));
        rect(bx, by, bw, 16, 8);
        noStroke();
        fill(has ? 'black' : 190);
        textAlign(CENTER, CENTER);
        text(p, bx + bw / 2, by + 8);
        bx += bw + 5;
      }
      // value box
      textFont('monospace');
      textSize(12);
      const val = 'b"' + values[n.id] + '"';
      stroke('dimgray');
      fill(40);
      const vw = min(w - 16, textWidth('value ' + val) + 14);
      rect(x + 8, L.y + 66, vw, 16, 3);
      noStroke();
      fill(170, 240, 170);
      textAlign(LEFT, CENTER);
      text('value ' + val, x + 14, L.y + 74);
      textFont('sans-serif');
    }
  }
  // the follower robot, next to the device box; wheels turn after a motor command
  drawRobot(r.x + r.w - 44, layout.device.y + 17);
}

function drawRobot(cx, cy) {
  stroke('darkolivegreen');
  fill('olivedrab');
  rect(cx - 13, cy - 11, 26, 22, 4);
  for (const side of [-1, 1]) {
    push();
    translate(cx + side * 17, cy);
    noStroke();
    fill(40);
    rect(-3, -9, 6, 18, 2);
    stroke(200);
    for (let k = 0; k < 3; k++) {
      const sy = motor !== 'STOPPED' ? ((wheel * 5 + k * 6) % 18) - 9 : -6 + k * 6;
      line(-2, sy, 2, sy);
    }
    pop();
  }
  noStroke();
  fill('white');
  if (motor === 'STOPPED') rect(cx - 4, cy - 4, 8, 8, 1);
  else {
    push();
    translate(cx, cy);
    rotate({ FORWARD: 0, LEFT: -HALF_PI, RIGHT: HALF_PI }[motor] || 0);
    triangle(0, -7, -5, 4, 5, 4);
    pop();
  }
  fill(60);
  textSize(10);
  textAlign(CENTER, TOP);
  text(motor, cx, cy + 12);
}

function drawDetail() {
  const r = detailR;
  const n = node(selectedId);
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Details', r.x + 10, r.y + 6);
  fill('black');
  textSize(16);
  textStyle(BOLD);
  text(n.short, r.x + 10, r.y + 24);
  textStyle(NORMAL);
  textSize(14);
  const typeText = n.type === 'device' ? 'device' : n.type === 'service' ? 'service' : 'characteristic';
  let y = r.y + 48;
  const row = (k, v, col) => {
    fill('dimgray');
    text(k, r.x + 10, y);
    fill(col || 'black');
    text(v, r.x + 100, y, r.w - 110, 40);
    y += textWidth(v) > r.w - 110 ? 36 : 20;
  };
  row('Type:', typeText, n.color === 'gray' ? 'dimgray' : n.color);
  // UUID, split over two lines when it is long
  fill('dimgray');
  text('UUID:', r.x + 10, y);
  textFont('monospace');
  textSize(12.5);
  fill('black');
  if (!n.uuid) {
    textFont('sans-serif');
    textSize(14);
    text('(a device is found by its name, not a UUID)', r.x + 100, y, r.w - 110, 40);
    y += 20;
  } else if (textWidth(n.uuid) > r.w - 110) {
    const cut = n.uuid.lastIndexOf('-', 24);
    text(n.uuid.slice(0, cut + 1), r.x + 100, y);
    text(n.uuid.slice(cut + 1), r.x + 100, y + 16);
    y += 36;
  } else {
    text(n.uuid, r.x + 100, y);
    y += 20;
  }
  textFont('sans-serif');
  textSize(14);
  row('Properties:', n.type === 'characteristic' ? n.props.join(', ') : 'none (only characteristics have them)');
  if (n.flags) {
    fill('dimgray');
    text('Flags:', r.x + 10, y);
    textFont('monospace');
    textSize(12.5);
    fill('black');
    text(n.flags, r.x + 100, y);
    textFont('sans-serif');
    textSize(14);
    y += 20;
  }
  fill('navy');
  textStyle(ITALIC);
  text(n.plain, r.x + 10, y + 4, r.w - 20, r.y + r.h - y - 6);
  textStyle(NORMAL);
}

function drawLog() {
  const r = logR;
  stroke('silver');
  fill(255, 255, 255, 235);
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Leader actions and message log', r.x + 10, r.y + 6);
  // result of the last action
  fill(result.ok === true ? 'darkgreen' : result.ok === false ? 'firebrick' : 'black');
  textSize(14);
  text(result.text, r.x + 10, r.y + 24, r.w - 20, 38);
  // log lines (newest at the bottom)
  const top = r.y + 64;
  stroke('dimgray');
  fill(35);
  rect(r.x + 8, top, r.w - 16, r.y + r.h - top - 8, 5);
  noStroke();
  textFont('monospace');
  let ts = 12;
  textSize(ts);
  const lineH = 15;
  const maxLines = floor((r.y + r.h - top - 14) / lineH);
  const lines = logLines.slice(-maxLines);
  let y = top + 5;
  for (const ln of lines) {
    let s = ln;
    while (s.length > 4 && textWidth(s) > r.w - 30) s = s.slice(0, -1);
    if (s !== ln) s = s.slice(0, -2) + '..';
    fill(ln.startsWith('Central') ? color(150, 200, 255) : ln.includes('not permitted') || ln.includes('No such') ? color(255, 140, 140) : color(170, 240, 170));
    text(s, r.x + 14, y);
    y += lineH;
  }
  if (!logLines.length) {
    fill(150);
    text('(empty)', r.x + 14, y);
  }
  textFont('sans-serif');
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Value:', valueLabelX, y0 + 11);
  text('Look up UUID:', lookupLabelX, y0 + 49);
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
