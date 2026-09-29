// Module Import Flow
// CANVAS_HEIGHT: 500
// Bloom L2 (Understand) - Explain: three files on the robot (config.py,
// motors.py, main.py) linked by import. Change RIGHT_FORWARD_PIN in config.py
// and every file that imports config follows along. Switch to hard-coded pins
// and the same change leaves five stale numbers and a disconnected motor.

let canvasWidth = 700;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let pinSelect, hardCheckbox, runButton, resetButton;

let pin = 11;                 // value in config.py (and where the wire is)
let hardCoded = false;
let consoleLines = [];
let runSteps = [];
let runIndex = 0, lastStepMs = 0, running = false;
let pulses = {};              // arrow name -> start time
let loadedGlow = {};          // file name -> start time
let changedAt = -9999;        // when the config line last changed

const STEP_MS = 900;
const HARD_PIN = 11;          // the number typed into the hard-coded files

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  pinSelect = createSelect();
  pinSelect.parent(main);
  for (const p of [11, 12, 13, 14, 15]) pinSelect.option(String(p));
  pinSelect.selected('11');
  pinSelect.changed(onPinChange);

  hardCheckbox = createCheckbox(' Hard-code pins instead (no config.py)', false);
  hardCheckbox.parent(main);
  hardCheckbox.changed(() => { hardCoded = hardCheckbox.checked(); stopRun(); consoleLines = []; reportPin(); });

  runButton = createButton('Run main.py');
  runButton.parent(main);
  runButton.mousePressed(startRun);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);

  positionControls();
  resetSim();

  describe('Three file cards linked by import arrows: config.py at the top, motors.py at the lower left, and main.py at the lower right. A small wiring picture shows which GP pin the right forward motor wire uses. Changing RIGHT_FORWARD_PIN updates the highlighted spots in every file that imports config. With hard-coded pins, the other files keep the old number and the motor wire shows as not connected. A console at the bottom prints the import order when main.py runs.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  pinSelect.position(190, y1);
  hardCheckbox.position(256, y1 + 3);
  runButton.position(10, y2);
  resetButton.position(120, y2);
}

function resetSim() {
  pin = 11;
  pinSelect.selected('11');
  hardCoded = false;
  hardCheckbox.checked(false);
  stopRun();
  consoleLines = ['>>> Press "Run main.py" to watch the imports run in order.'];
  pulses = {};
  loadedGlow = {};
}

function onPinChange() {
  pin = int(pinSelect.value());
  changedAt = millis();
  stopRun();
  reportPin();
}

// Console message after the pin changes
function reportPin() {
  if (!hardCoded) {
    consoleLines.push('Edited config.py: RIGHT_FORWARD_PIN = ' + pin);
    consoleLines.push('1 line changed, 0 other files edited.');
  } else if (pin !== HARD_PIN) {
    consoleLines.push('Edited config.py: RIGHT_FORWARD_PIN = ' + pin + ' (but nobody imports it)');
    consoleLines.push('Pin mismatch! motors.py still uses ' + HARD_PIN + '. Edit 5 lines by hand.');
  } else {
    consoleLines.push('Hard-coded mode: the number ' + HARD_PIN + ' is typed in 5 places.');
  }
}

function stopRun() {
  running = false;
}

function startRun() {
  consoleLines = [];
  runIndex = 0;
  running = true;
  lastStepMs = millis() - STEP_MS;
  const shownPin = hardCoded ? HARD_PIN : pin;
  if (!hardCoded) {
    runSteps = [
      { line: 'main.py: import config', arrow: 'main-config' },
      { line: 'config.py loaded', glow: 'config' },
      { line: 'main.py: import motors', arrow: 'main-motors' },
      { line: 'motors.py: import config (already loaded)', arrow: 'motors-config' },
      { line: 'Right forward pin: ' + shownPin, glow: 'main' },
      { line: 'All motors stopped.', glow: 'motors' }
    ];
  } else {
    runSteps = [
      { line: 'main.py: import motors', arrow: 'main-motors' },
      { line: 'motors.py loaded (it never imports config)', glow: 'motors' },
      { line: 'Right forward pin: ' + shownPin, glow: 'main' },
      { line: 'Stopped pin ' + shownPin, glow: 'motors' }
    ];
    if (pin !== HARD_PIN) runSteps.push({ line: 'Pin mismatch! The wire is on GP' + pin + ' but the code drives GP' + HARD_PIN + '.' });
  }
}

function draw() {
  updateCanvasSize();

  // play the run one step at a time
  if (running && millis() - lastStepMs >= STEP_MS) {
    lastStepMs = millis();
    const s = runSteps[runIndex];
    consoleLines.push(s.line);
    if (s.arrow) pulses[s.arrow] = millis();
    if (s.glow) loadedGlow[s.glow] = millis();
    runIndex++;
    if (runIndex >= runSteps.length) running = false;
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
  text('Module Import Flow', canvasWidth / 2, 8);

  // layout: wiring strip on the left, three file cards on the right
  // below 560 px the wiring picture is hidden so the file cards stay readable
  const narrow = canvasWidth < 560;
  const stripW = narrow ? -12 : 112;
  const ax = margin + stripW + 12, aw = canvasWidth - ax - margin;
  const cw = min(272, (aw - 20) / 2);
  const cfg = { x: ax + (aw - cw) / 2, y: 42, w: cw, h: 116 };
  const mot = { x: ax, y: 190, w: cw, h: 124 };
  const mn = { x: ax + aw - cw, y: 190, w: cw, h: 124 };

  drawArrows(cfg, mot, mn);
  drawCard(cfg, 'config.py', 'steelblue', configLines(), 'config');
  drawCard(mot, 'motors.py', 'seagreen', motorsLines(), 'motors');
  drawCard(mn, 'main.py', 'darkorange', mainLines(), 'main');
  drawCounter(ax + aw, 46, cfg.x + cfg.w);
  if (!narrow) drawWiring(margin, 40, stripW, 280);
  drawConsole(margin, 326, canvasWidth - 2 * margin, 86);

  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('RIGHT_FORWARD_PIN:', 12, drawHeight + 20);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

// ---------- File contents ----------
// {C} marks config.RIGHT_FORWARD_PIN (yellow), {H} marks a hard-coded number (pink)
function configLines() {
  return [
    'RIGHT_FORWARD_PIN = {V}',
    'RIGHT_REVERSE_PIN = 10',
    'LEFT_FORWARD_PIN  = 9',
    'LEFT_REVERSE_PIN  = 8'
  ];
}
function motorsLines() {
  if (!hardCoded) {
    return ['import config', 'from machine import Pin', 'rf = Pin({C})', 'def stop_all():', '    print("All motors stopped.")'];
  }
  return ['from machine import Pin', 'rf = Pin({H})', 'def stop_all():', '    Pin({H}).value(0)', '    print("Stopped pin", {H})'];
}
function mainLines() {
  if (!hardCoded) {
    return ['import config', 'import motors', 'print("Right forward pin:",', '      {C})', 'motors.stop_all()'];
  }
  return ['import motors', 'RF_PIN = {H}', 'print("Right forward pin:", {H})', 'motors.stop_all()'];
}

function drawCard(c, title, col, lines, id) {
  const glow = loadedGlow[id] !== undefined && millis() - loadedGlow[id] < 800;
  stroke(glow ? 'gold' : col);
  strokeWeight(glow ? 5 : 2);
  fill('white');
  rect(c.x, c.y, c.w, c.h, 8);
  strokeWeight(1);
  // title tab
  noStroke();
  fill(col);
  rect(c.x, c.y, c.w, 22, 8, 8, 0, 0);
  fill('white');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(title, c.x + 10, c.y + 11);
  textStyle(NORMAL);

  // monospace code, sized so the longest line fits
  // (the value badge after config.RIGHT_FORWARD_PIN takes about 5 more characters)
  const plain = lines.map(s => s.replace('{C}', 'config.RIGHT_FORWARD_PIN.....').replace(/\{H\}/g, '11').replace('{V}', '11'));
  const longest = max(plain.map(s => s.length));
  const size = constrain((c.w - 16) / (longest * 0.6), 8, 13);
  push();
  textFont('monospace');
  textSize(size);
  const chW = textWidth('M');
  const lineH = size + 6;
  for (let k = 0; k < lines.length; k++) {
    drawCodeLine(lines[k], c.x + 8, c.y + 28 + k * lineH, chW, size, id);
  }
  pop();
}

// Draw one code line, highlighting the marked pieces.
function drawCodeLine(src, x, y, chW, size, id) {
  const parts = src.split(/(\{C\}|\{H\}|\{V\})/);
  let cx = x;
  for (const p of parts) {
    let txt = p, bg = null, fg = 'black';
    if (p === '{C}') { txt = 'config.RIGHT_FORWARD_PIN'; bg = 'khaki'; }
    else if (p === '{H}') { txt = String(HARD_PIN); bg = (pin !== HARD_PIN) ? 'salmon' : 'mistyrose'; }
    else if (p === '{V}') {
      txt = String(pin);
      const flash = millis() - changedAt < 900;
      bg = flash ? 'gold' : 'khaki';
    }
    const w = txt.length * chW;
    if (bg) {
      noStroke();
      fill(bg);
      rect(cx - 1, y - 1, w + 2, size + 3, 2);
    }
    noStroke();
    fill(fg);
    textAlign(LEFT, TOP);
    text(txt, cx, y);
    cx += w;
    // value badge after config.RIGHT_FORWARD_PIN
    if (p === '{C}') {
      push();
      textFont('sans-serif');
      textSize(11);
      fill('darkorange');
      rect(cx + 4, y - 1, 24, size + 3, 6);
      fill('white');
      textAlign(CENTER, TOP);
      text(pin, cx + 16, y + 1);
      pop();
      cx += 30;
    }
  }
}

function arrowBetween(x1, y1, x2, y2, label, name, active) {
  if (!active) {
    stroke('lightgray');
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(x1, y1, x2, y2);
    drawingContext.setLineDash([]);
    strokeWeight(1);
    noStroke();
    fill('gray');
    textSize(12);
    textAlign(CENTER, CENTER);
    text('no import', (x1 + x2) / 2 + 30, (y1 + y2) / 2);
    return;
  }
  const pulsing = pulses[name] !== undefined && millis() - pulses[name] < 700;
  stroke(pulsing ? 'gold' : 'slategray');
  strokeWeight(pulsing ? 6 : 2.5);
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(a);
  noStroke();
  fill(pulsing ? 'goldenrod' : 'slategray');
  triangle(0, 0, -12, -6, -12, 6);
  pop();
  strokeWeight(1);
  if (canvasWidth < 560) return;   // no room for labels at narrow widths
  // label with a white backing so it stays readable over the line
  textSize(13);
  const lw = textWidth(label) + 10;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  noStroke();
  fill(255, 255, 255, 230);
  rect(mx - lw / 2, my - 10, lw, 20, 4);
  fill('black');
  textAlign(CENTER, CENTER);
  text(label, mx, my);
}

function drawArrows(cfg, mot, mn) {
  // motors.py -> config.py and main.py -> config.py
  arrowBetween(mot.x + mot.w * 0.55, mot.y, cfg.x + cfg.w * 0.2, cfg.y + cfg.h, 'import config', 'motors-config', !hardCoded);
  arrowBetween(mn.x + mn.w * 0.45, mn.y, cfg.x + cfg.w * 0.8, cfg.y + cfg.h, 'import config', 'main-config', !hardCoded);
  // main.py -> motors.py: a direct arrow when the gap is wide enough,
  // otherwise a bridge over the narrow gap between the two cards
  if (mn.x - (mot.x + mot.w) >= 100) {
    arrowBetween(mn.x, mn.y + mn.h / 2, mot.x + mot.w, mot.y + mot.h / 2, 'import motors', 'main-motors', true);
    return;
  }
  const pulsing = pulses['main-motors'] !== undefined && millis() - pulses['main-motors'] < 700;
  const inset = canvasWidth < 560 ? 12 : 44;
  const x1 = mn.x + inset, x2 = mot.x + mot.w - inset, by = mn.y - 16;
  stroke(pulsing ? 'gold' : 'slategray');
  strokeWeight(pulsing ? 6 : 2.5);
  noFill();
  line(x1, mn.y, x1, by);
  line(x1, by, x2, by);
  line(x2, by, x2, mot.y - 2);
  strokeWeight(1);
  noStroke();
  fill(pulsing ? 'goldenrod' : 'slategray');
  triangle(x2, mot.y, x2 - 6, mot.y - 12, x2 + 6, mot.y - 12);
  textSize(13);
  const lw = textWidth('import motors') + 10;
  fill(255, 255, 255, 230);
  rect((x1 + x2) / 2 - lw / 2, by - 10, lw, 20, 4);
  fill('black');
  textAlign(CENTER, CENTER);
  text('import motors', (x1 + x2) / 2, by);
}

function drawCounter(rightX, y, cfgRight) {
  const lines = hardCoded ? 5 : 1;
  noStroke();
  fill(hardCoded ? 'firebrick' : 'darkgreen');
  textStyle(BOLD);
  textAlign(RIGHT, TOP);
  if (rightX - cfgRight > 90) {
    textSize(14);
    text('Lines to edit:', rightX - 4, y + 8);
    textSize(34);
    text(lines, rightX - 4, y + 28);
  } else {
    textSize(14);
    text('Lines to edit: ' + lines, rightX - 4, y + 124);
  }
  textStyle(NORMAL);
}

// Small wiring picture: right motor, header pins GP8-GP15, and the wires
function drawWiring(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Robot wiring', x + w / 2, y + 6);
  textStyle(NORMAL);

  // motor
  const mx = x + 30, my = y + 50;
  stroke('dimgray');
  fill('lightgray');
  circle(mx, my, 34);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(CENTER, CENTER);
  text('M', mx, my);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('right', mx + 21, my - 6);
  text('motor', mx + 21, my + 7);

  // header pins
  const pinX = x + w - 44, top = y + 92, gap = 20;
  const codePin = hardCoded ? HARD_PIN : pin;
  const connected = codePin === pin;
  for (let p = 8; p <= 15; p++) {
    const py = top + (p - 8) * gap;
    const driven = p === codePin;
    stroke(driven ? 'goldenrod' : 'dimgray');
    strokeWeight(driven ? 3 : 1);
    fill('gold');
    rect(pinX - 6, py - 6, 12, 12, 2);
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(LEFT, CENTER);
    text('GP' + p, pinX + 10, py);
  }
  // other motor wires (GP8, GP9, GP10) in gray
  stroke('darkgray');
  strokeWeight(2);
  noFill();
  for (let p = 8; p <= 10; p++) {
    const py = top + (p - 8) * gap;
    bezier(mx, my + 17, mx, py, pinX - 40, py, pinX - 6, py);
  }
  // right forward wire in orange, to the pin in config.py
  const wy = top + (pin - 8) * gap;
  stroke(connected ? 'darkorange' : 'firebrick');
  strokeWeight(3);
  if (!connected) drawingContext.setLineDash([5, 4]);
  bezier(mx + 8, my + 17, mx + 8, wy, pinX - 30, wy, pinX - 6, wy);
  drawingContext.setLineDash([]);
  strokeWeight(1);

  // status
  noStroke();
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  if (connected) {
    fill('darkgreen');
    text('✓ wire on GP' + pin, x + w / 2, y + h - 18);
  } else {
    fill('firebrick');
    text('✗ code drives GP' + codePin, x + w / 2, y + h - 30);
    text('not connected!', x + w / 2, y + h - 16);
  }
  textStyle(NORMAL);
}

function drawConsole(x, y, w, h) {
  noStroke();
  fill('black');
  rect(x, y, w, h, 6);
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x, y, w, h);
  drawingContext.clip();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  const last = consoleLines.slice(-4);
  for (let k = 0; k < last.length; k++) {
    const bad = last[k].startsWith('Pin mismatch');
    fill(bad ? 'tomato' : (last[k].startsWith('>>>') ? 'gray' : 'lightgreen'));
    text(last[k], x + 12, y + 8 + k * 19);
  }
  drawingContext.restore();
  pop();
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
