// Local vs Global Scope Explorer
// CANVAS_HEIGHT: 560
// Bloom L2 (Understand) - Explain: step through three short programs one line
// at a time and watch where each variable lives. Local cards appear inside the
// function box and vanish when the function returns. The `global` keyword
// connects the function to the global card instead of making a new local one.
// Adapted from moving-rainbow/variable-scope-explorer (nested scope boxes).

let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let exampleSelect, globalCheckbox, stepButton, runButton, resetButton;

const EX1 = '1. Local variable: compute_speed';
const EX2 = '2. Global with global keyword: start_motors';
const EX3 = '3. Global without global (the bug)';

// ---------- The three example programs ----------
const EXAMPLES = {
  1: {
    fnName: 'compute_speed',
    code: [
      'def compute_speed(raw_value):',
      '    scaled = raw_value * 0.5',
      '    return scaled',
      '',
      'result = compute_speed(100)',
      'print(result)',
      'print(scaled)'
    ],
    steps: [
      { line: 0, msg: 'Python reads the def line and learns the function compute_speed(). The code inside does not run yet.' },
      { line: 4, call: true, local: ['raw_value', '100'], msg: 'We call compute_speed(100). Python makes a new local scope. The input raw_value = 100 lives inside it.' },
      { line: 1, local: ['scaled', '50.0'], msg: 'scaled = raw_value * 0.5 makes a local variable. It only exists inside compute_speed().' },
      { line: 2, ret: true, msg: 'return scaled sends 50.0 back. The function ends, so raw_value and scaled disappear.' },
      { line: 4, global: ['result', '50.0'], msg: 'The returned value 50.0 is stored in result. result is a global variable.' },
      { line: 5, print: '50.0', msg: 'print(result) works because result lives in the global scope.' },
      { line: 6, nameError: 'scaled', print: "NameError: name 'scaled' isn't defined", msg: 'NameError! scaled only lives inside compute_speed(). It vanished when the function returned.' }
    ]
  },
  2: {
    fnName: 'start_motors',
    code: [
      'is_moving = False',
      '',
      'def start_motors():',
      '    global is_moving',
      '    is_moving = True',
      '    print("Motors on. is_moving =", is_moving)',
      '',
      'start_motors()',
      'print("After call:", is_moving)'
    ],
    steps: [
      { line: 0, global: ['is_moving', 'False'], msg: 'is_moving = False is written outside every function, so it is a global variable.' },
      { line: 2, msg: 'Python learns the function start_motors(). The code inside does not run yet.' },
      { line: 7, call: true, msg: 'We call start_motors(). Python makes a new local scope for it.' },
      { line: 3, arrow: 'is_moving', msg: 'global is_moving tells Python: inside this function, is_moving means the global one.' },
      { line: 4, global: ['is_moving', 'True'], msg: 'is_moving = True changes the global card. No new local variable is made.' },
      { line: 5, print: 'Motors on. is_moving = True', msg: 'The function prints the global value, which is now True.' },
      { line: 7, ret: true, msg: 'start_motors() ends and its local scope disappears. The change to the global stays.' },
      { line: 8, print: 'After call: True', msg: 'After the call, is_moving is True. The global keyword made the change stick.' }
    ]
  },
  3: {
    fnName: 'start_motors',
    code: [
      'is_moving = False',
      '',
      'def start_motors():',
      '    is_moving = True',
      '    print("Motors on. is_moving =", is_moving)',
      '',
      'start_motors()',
      'print("After call:", is_moving)'
    ],
    steps: [
      { line: 0, global: ['is_moving', 'False'], msg: 'is_moving = False is written outside every function, so it is a global variable.' },
      { line: 2, msg: 'Python learns the function start_motors(). The code inside does not run yet.' },
      { line: 6, call: true, msg: 'We call start_motors(). Python makes a new local scope for it.' },
      { line: 3, local: ['is_moving', 'True'], msg: 'There is no global line, so is_moving = True makes a NEW local variable. The global one did not change.' },
      { line: 4, print: 'Motors on. is_moving = True', msg: 'Inside the function, is_moving means the local one, so this prints True.' },
      { line: 6, ret: true, msg: 'start_motors() ends. The local is_moving disappears.' },
      { line: 7, print: 'After call: False', msg: 'After call: False. Python made a new local variable. The global one did not change.' }
    ]
  }
};

// ---------- State ----------
let exampleId = 1;
let stepIndex = 0;          // next step to run
let currentLine = -1;
let globalsList = [];       // {name, value, flashStart}
let localsList = [];        // {name, value}
let fnActive = false;
let fnAnim = null;          // {dir: 'in' or 'out', start}
let fadingLocals = [];      // local cards that are fading after return
let puffs = [];             // {x, y, start}
let arrowTo = null;
let nameErrorVar = null;
let output = [];
let message = '';
let running = false;
let lastStepMs = 0;

const SLIDE_MS = 450, FADE_MS = 700, FLASH_MS = 700;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  exampleSelect = createSelect();
  exampleSelect.parent(main);
  exampleSelect.option(EX1);
  exampleSelect.option(EX2);
  exampleSelect.option(EX3);
  exampleSelect.selected(EX1);
  exampleSelect.changed(onExampleChange);

  stepButton = createButton('Step');
  stepButton.parent(main);
  stepButton.mousePressed(() => { stopRun(); doStep(); });
  runButton = createButton('Run');
  runButton.parent(main);
  runButton.mousePressed(toggleRun);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(() => loadExample(exampleId));

  globalCheckbox = createCheckbox(' Show global keyword', true);
  globalCheckbox.parent(main);
  globalCheckbox.changed(onGlobalToggle);

  positionControls();
  loadExample(1);

  describe('A scope explorer. The left panel shows a short MicroPython program with the current line highlighted. The right panel shows a large global scope box and, while a function runs, a smaller function box inside it. Blue cards are global variables and orange cards are local variables. Stepping through the code shows local variables appearing and disappearing, and shows how the global keyword changes a global variable.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  exampleSelect.position(88, y1);
  exampleSelect.size(min(340, canvasWidth - 100));
  stepButton.position(10, y2);
  runButton.position(66, y2);
  resetButton.position(124, y2);
  globalCheckbox.position(200, y2 + 3);
}

function onExampleChange() {
  const v = exampleSelect.value();
  loadExample(v === EX1 ? 1 : v === EX2 ? 2 : 3);
}

function onGlobalToggle() {
  // the checkbox flips between example 2 (with global) and example 3 (without)
  const id = globalCheckbox.checked() ? 2 : 3;
  exampleSelect.selected(id === 2 ? EX2 : EX3);
  loadExample(id);
}

function loadExample(id) {
  exampleId = id;
  stopRun();
  stepIndex = 0;
  currentLine = -1;
  globalsList = [];
  localsList = [];
  fadingLocals = [];
  puffs = [];
  fnActive = false;
  fnAnim = null;
  arrowTo = null;
  nameErrorVar = null;
  output = [];
  message = 'Press Step to run the program one line at a time. Watch where each variable lives.';
  if (id === 1) {
    globalCheckbox.hide();
  } else {
    globalCheckbox.show();
    globalCheckbox.checked(id === 2);
  }
}

function stopRun() {
  running = false;
  if (runButton) runButton.html('Run');
}

function toggleRun() {
  const ex = EXAMPLES[exampleId];
  if (stepIndex >= ex.steps.length) loadExample(exampleId);
  running = !running;
  runButton.html(running ? 'Pause' : 'Run');
  lastStepMs = millis() - 1000;
}

function doStep() {
  const ex = EXAMPLES[exampleId];
  if (stepIndex >= ex.steps.length) return;
  const s = ex.steps[stepIndex];
  stepIndex++;
  currentLine = s.line;
  message = s.msg;
  if (s.call) {
    fnActive = true;
    fnAnim = { dir: 'in', start: millis() };
  }
  if (s.local) localsList.push({ name: s.local[0], value: s.local[1] });
  if (s.global) {
    const g = globalsList.find(c => c.name === s.global[0]);
    if (g) { g.value = s.global[1]; g.flashStart = millis(); }
    else globalsList.push({ name: s.global[0], value: s.global[1], flashStart: millis() });
  }
  if (s.arrow) arrowTo = s.arrow;
  if (s.ret) {
    // local cards fade away with a puff of smoke; the box slides out
    fadingLocals = localsList.map((c, k) => ({ name: c.name, value: c.value, k }));
    localsList = [];
    arrowTo = null;
    fnAnim = { dir: 'out', start: millis() };
    for (const c of fadingLocals) puffs.push({ k: c.k, start: millis() });
  }
  if (s.print) output.push(s.print);
  if (s.nameError) nameErrorVar = s.nameError;
  if (stepIndex >= ex.steps.length) stopRun();
}

function draw() {
  updateCanvasSize();

  if (running && millis() - lastStepMs >= 1000) {
    lastStepMs = millis();
    doStep();
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Local vs Global Scope Explorer', canvasWidth / 2, 8);

  const codeW = floor(canvasWidth * 0.56);
  const top = 42, panelH = 346;
  drawCodePanel(margin, top, codeW - margin, panelH);
  drawScopePanel(codeW + margin, top, canvasWidth - codeW - 2 * margin, panelH);
  drawMessage(margin, top + panelH + 8, canvasWidth - 2 * margin, drawHeight - top - panelH - 16);

  // control labels
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Example:', 12, drawHeight + 20);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawCodePanel(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  text('MicroPython code', x + 10, y + 8);

  const lines = EXAMPLES[exampleId].code;
  const longest = max(lines.map(s => s.length));
  const gutter = 26;
  const codeSize = constrain(floor((w - gutter - 20) / (longest * 0.6)), 10, 15);
  const lineH = codeSize + 11;
  let ly = y + 34;

  push();
  // clip so long lines never spill into the scope panel at narrow widths
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x + 2, y + 2, w - 4, h - 4);
  drawingContext.clip();
  textFont('monospace');
  textSize(codeSize);
  textAlign(LEFT, TOP);
  for (let k = 0; k < lines.length; k++) {
    if (k === currentLine) {
      noStroke();
      fill('khaki');
      rect(x + 4, ly - 4, w - 8, lineH, 4);
    }
    noStroke();
    fill('gray');
    text(k + 1, x + 8, ly);
    const isGlobalLine = lines[k].trim().startsWith('global ');
    fill(isGlobalLine ? 'mediumblue' : 'black');
    text(lines[k], x + gutter, ly);
    ly += lineH;
  }
  drawingContext.restore();
  pop();

  // output console under the code
  const cy = y + h - 74;
  noStroke();
  fill('black');
  rect(x + 8, cy, w - 16, 66, 6);
  push();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  const last = output.slice(-3);
  if (last.length === 0) {
    fill('gray');
    text('>>> (printed output)', x + 16, cy + 6);
  }
  for (let k = 0; k < last.length; k++) {
    fill(last[k].startsWith('NameError') ? 'tomato' : 'lightgreen');
    text(last[k], x + 16, cy + 6 + k * 19);
  }
  pop();
}

// Card geometry helpers
function cardW(c) {
  textSize(15);
  return textWidth(c.name + ' = ' + c.value) + 22;
}

function drawCard(c, x, y, fillColor, textColor, alpha) {
  const cw = cardW(c);
  const col = color(fillColor);
  col.setAlpha(alpha);
  stroke(0, 0, 0, alpha * 0.4);
  fill(col);
  rect(x, y, cw, 30, 6);
  noStroke();
  const tc = color(textColor);
  tc.setAlpha(alpha);
  fill(tc);
  textSize(15);
  textAlign(LEFT, CENTER);
  text(c.name + ' = ' + c.value, x + 11, y + 15);
  return cw;
}

function drawScopePanel(x, y, w, h) {
  // global scope box
  const gx = x, gy = y, gw = w, gh = h;
  const gcol = color('lightblue');
  gcol.setAlpha(140);
  stroke('steelblue');
  strokeWeight(2);
  fill(gcol);
  rect(gx, gy, gw, gh, 12);
  strokeWeight(1);
  noStroke();
  fill('navy');
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  const gLabel = textWidth('Global scope (the whole program)') < gw - 24 ?
    'Global scope (the whole program)' : 'Global scope';
  text(gLabel, gx + 12, gy + 8);
  textStyle(NORMAL);

  // global cards
  const cardX = gx + 14;
  let cardY = gy + 34;
  const cardPos = {};
  for (const c of globalsList) {
    const flashing = c.flashStart !== undefined && millis() - c.flashStart < FLASH_MS;
    const cw = drawCard(c, cardX, cardY, flashing ? 'limegreen' : 'steelblue', 'white', 255);
    cardPos[c.name] = { x: cardX, y: cardY, w: cw };
    cardY += 40;
  }

  // NameError: a dashed "missing" card with a red tag
  if (nameErrorVar) {
    stroke('red');
    strokeWeight(2);
    drawingContext.setLineDash([5, 4]);
    noFill();
    textSize(15);
    const mw = textWidth(nameErrorVar + ' ?') + 22;
    rect(cardX, cardY, mw, 30, 6);
    drawingContext.setLineDash([]);
    strokeWeight(1);
    noStroke();
    fill('red');
    textAlign(LEFT, CENTER);
    text(nameErrorVar + ' ?', cardX + 11, cardY + 15);
    const tagX = cardX + mw + 8;
    fill('red');
    rect(tagX, cardY + 2, 96, 26, 13);
    fill('white');
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('NameError', tagX + 48, cardY + 15);
    textStyle(NORMAL);
  }

  // function (local scope) box, slides in from the right and out again
  const fx0 = gx + 14, fw = gw - 28;
  const fy = gy + gh * 0.44, fh = gh * 0.52;
  let slide = 0, visible = fnActive;
  if (fnAnim) {
    const t = constrain((millis() - fnAnim.start) / SLIDE_MS, 0, 1);
    const e = t * t * (3 - 2 * t);
    if (fnAnim.dir === 'in') slide = (1 - e);
    else {
      // wait for the local cards to fade, then slide out
      const t2 = constrain((millis() - fnAnim.start - FADE_MS * 0.6) / SLIDE_MS, 0, 1);
      slide = t2 * t2 * (3 - 2 * t2);
      if (t2 >= 1) { fnActive = false; visible = false; }
    }
  }
  if (visible) {
    const fx = fx0 + slide * (fw + 30);
    push();
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(gx + 2, gy, gw - 4, gh);
    drawingContext.clip();
    stroke('darkorange');
    strokeWeight(2);
    fill('peachpuff');
    rect(fx, fy, fw, fh, 10);
    strokeWeight(1);
    noStroke();
    fill('saddlebrown');
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    const fnLong = EXAMPLES[exampleId].fnName + '() - local scope';
    text(textWidth(fnLong) < fw - 20 ? fnLong : EXAMPLES[exampleId].fnName + '()', fx + 10, fy + 8);
    textStyle(NORMAL);

    // local cards
    let ly = fy + 34;
    for (const c of localsList) {
      drawCard(c, fx + 12, ly, 'darkorange', 'black', 255);
      ly += 40;
    }
    // fading local cards after return
    if (fadingLocals.length && fnAnim && fnAnim.dir === 'out') {
      const a = 255 * (1 - constrain((millis() - fnAnim.start) / FADE_MS, 0, 1));
      for (const c of fadingLocals) {
        drawCard(c, fx + 12, fy + 34 + c.k * 40, 'darkorange', 'black', a);
      }
    }
    drawingContext.restore();
    pop();

    // dashed arrow from the function box to the global card
    if (arrowTo && cardPos[arrowTo]) {
      const p = cardPos[arrowTo];
      const ax = fx + fw * 0.7, ay = fy;
      const bx = p.x + p.w + 4, by = p.y + 15;
      stroke('mediumblue');
      strokeWeight(2);
      drawingContext.setLineDash([6, 5]);
      noFill();
      bezier(ax, ay, ax, by, ax, by, bx + 10, by);
      drawingContext.setLineDash([]);
      noStroke();
      fill('mediumblue');
      triangle(bx, by, bx + 12, by - 6, bx + 12, by + 6);
      strokeWeight(1);
      textSize(13);
      textAlign(LEFT, BOTTOM);
      text('global is_moving', min(ax + 6, gx + gw - 110), fy - 4);
    }
  }

  // puffs of smoke where local cards vanished
  for (const pf of puffs) {
    const t = (millis() - pf.start) / (FADE_MS + 200);
    if (t > 1) continue;
    const px = fx0 + 40, py = fy + 34 + pf.k * 40 + 15;
    noStroke();
    fill(150, 150, 150, 200 * (1 - t));
    for (let q = 0; q < 4; q++) {
      circle(px + q * 22 + t * 10, py - t * 18 - (q % 2) * 6, 16 + t * 26);
    }
  }
  puffs = puffs.filter(pf => millis() - pf.start < FADE_MS + 200);
}

function drawMessage(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(nameErrorVar ? 'firebrick' : 'midnightblue');
  textSize(16);
  textAlign(LEFT, TOP);
  text(message, x + 12, y + 10, w - 24, h - 14);
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
