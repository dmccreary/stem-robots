// REPL and Save Workflow
// CANVAS_HEIGHT: 500
// Bloom L3 (Apply): decide when to test an idea in the REPL and when to save
// it in main.py, and predict what runs after a power cycle.
// Adapted from learning-micropython/repl-workflow (interactive mode vs script
// mode): a mock Thonny window, a board with a Flash file list, and a
// four-step workflow checklist. Only main.py runs by itself at power-up, REPL
// variables vanish at power-off, and a saved file prints only with print().
// The canvas height is fixed. Buttons wrap onto more rows on narrow screens,
// so the control area grows and the drawing area shrinks to match.

let canvasWidth = 700;
let drawHeight = 354;       // wide-screen value
let controlHeight = 146;    // wide-screen value
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let shellInput, enterButton, copyButton, clearButton, saveSelect, saveButton, powerButton;
let quickButtons = [];
let lastWidth = 0;

const QUICK = ['print("Hello, robot!")', 'print("Ready to roll!")', '3 + 4', '10 / 3', 'speed = 50', 'speed * 2'];
const SHELL_BG = '#1a237e';
const ACTIVE = '#e65100';

// state
let shell = [];          // { text, kind } kind: in, out, err, hint, sys
let accepted = [];       // REPL lines that worked (for Copy)
let editor = [];         // lines in the Editor
let editorName = '<untitled>';
let flash = {};          // file name -> array of lines
let vars = {};           // REPL variables in RAM
let replUsed = false, poweredWithMain = false;
let powerOffUntil = 0;   // board is "unplugged" until this time
let sparky = 'Try a line in the REPL. The board runs it right away.';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  shellInput = createInput('');
  shellInput.parent(mainEl);
  shellInput.attribute('placeholder', 'type a line, then press Enter');
  shellInput.style('font-family', 'monospace');
  shellInput.style('font-size', '14px');
  shellInput.elt.addEventListener('keydown', e => { if (e.key === 'Enter') runLine(shellInput.value()); });
  enterButton = makeButton('Enter', () => runLine(shellInput.value()));

  for (const q of QUICK) {
    const b = makeButton(q, () => { shellInput.value(q); runLine(q); });
    b.style('font-family', 'monospace');
    b.style('font-size', '12px');
    quickButtons.push(b);
  }
  copyButton = makeButton('Copy REPL lines into Editor', copyToEditor);
  clearButton = makeButton('Clear Editor', () => { editor = []; editorName = '<untitled>'; updateSparky(); });
  saveSelect = createSelect();
  saveSelect.parent(mainEl);
  saveSelect.option('Save as main.py', 'main.py');
  saveSelect.option('Save as test.py', 'test.py');
  saveSelect.style('font-size', '14px');
  saveButton = makeButton('Save to board', saveToBoard);
  powerButton = makeButton('Unplug and replug', powerCycle);

  shell.push({ text: 'MicroPython on the Cytron Maker Pi RP2040', kind: 'sys' });
  positionControls();
  describe('A mock Thonny window with an Editor pane and a dark Shell pane, next to a board with a power LED and a Flash list of saved files, a four-step workflow checklist, and a Sparky tip. Type or pick a line to run in the REPL, copy the working lines into the Editor, save them as main.py or test.py, and unplug and replug the board to see what runs by itself.', LABEL);
}

function makeButton(label, fn) {
  const b = createButton(label);
  b.parent(document.querySelector('main'));
  b.style('font-size', '14px');
  b.mousePressed(fn);
  return b;
}

// Row 1: the Shell input. Then the quick lines, then the file buttons,
// each group flowing left to right and wrapping when a row is full.
function positionControls() {
  const narrow = canvasWidth < 560;
  let rowY = 6;
  const plan = [];
  plan.push({ el: shellInput, x: 44, y: rowY + 2 });
  const inputW = canvasWidth - 44 - 80;
  plan.push({ el: enterButton, x: 44 + inputW + 8, y: rowY });
  rowY += 34;
  const flow = (els) => {
    let x = 10;
    for (const el of els) {
      const w = el.elt.offsetWidth || 90;
      if (x + w > canvasWidth - 8 && x > 10) { x = 10; rowY += 32; }
      plan.push({ el: el, x: x, y: rowY });
      x += w + 6;
    }
    rowY += 32;
  };
  flow(quickButtons);
  flow([copyButton, clearButton, saveSelect, saveButton, powerButton]);
  controlHeight = rowY + 6;
  drawHeight = canvasHeight - controlHeight;
  shellInput.size(inputW, 22);
  for (const p of plan) p.el.position(p.x, drawHeight + p.y);
}

// ---------------- REPL ----------------
function runLine(raw) {
  if (isOff()) return;
  const line = raw.trim();
  shellInput.value('');
  if (!line) return;
  shell.push({ text: '>>> ' + line, kind: 'in' });
  const r = evaluate(line, vars);
  if (r.out !== null && r.out !== undefined) shell.push({ text: r.out, kind: r.error ? 'err' : 'out' });
  if (r.error) shell.push({ text: 'That is OK. Errors are information.', kind: 'hint' });
  else { accepted.push(line); replUsed = true; }
  trimShell();
  updateSparky();
}

// The small set of lines this Shell understands, with MicroPython results.
// repl = true echoes expression results (REPL); false is a saved program.
function evaluate(line, env, repl = true) {
  const compact = line.replace(/\s+/g, '');
  let m = line.match(/^print\(\s*(["'])(.*)\1\s*\)$/);
  if (m) return { out: m[2] };
  if (compact === '3+4') return { out: repl ? '7' : null };
  if (compact === '10/3') return { out: repl ? '3.3333333333333' : null };
  m = compact.match(/^([A-Za-z_]\w*)=(-?\d+)$/);
  if (m) { env[m[1]] = parseInt(m[2]); return { out: null }; }
  if (compact === 'speed*2' || compact === 'speed') {
    if (env.speed === undefined) return { out: "NameError: name 'speed' isn't defined", error: true };
    const v = compact === 'speed' ? env.speed : env.speed * 2;
    return { out: repl ? String(v) : null };
  }
  m = compact.match(/^[A-Za-z_]\w*$/);
  if (m && compact !== 'print') return { out: "NameError: name '" + compact + "' isn't defined", error: true };
  return { out: 'SyntaxError: invalid syntax', error: true };
}

function trimShell() { while (shell.length > 40) shell.shift(); }

// ---------------- Editor, Save, Power ----------------
function copyToEditor() {
  if (accepted.length === 0) { sparky = 'Run a line in the REPL first. Only lines that worked get copied.'; return; }
  editor = editor.concat(accepted);
  accepted = [];
  updateSparky();
}

function saveToBoard() {
  if (isOff()) return;
  if (editor.length === 0) { sparky = 'The Editor is empty. Copy some REPL lines into it first.'; return; }
  const name = saveSelect.value();
  flash[name] = editor.slice();
  editorName = name;
  shell.push({ text: 'Saved ' + name + ' to the board.', kind: 'sys' });
  updateSparky();
}

function isOff() { return millis() < powerOffUntil; }

// Unplug: RAM (REPL variables) is wiped. Replug: main.py runs by itself.
function powerCycle() {
  if (isOff()) return;
  vars = {};
  accepted = [];
  powerOffUntil = millis() + 900;
  shell.push({ text: '--- board unplugged: REPL variables are gone ---', kind: 'sys' });
  setTimeout(bootBoard, 950);
}

function bootBoard() {
  shell.push({ text: '--- board powered up ---', kind: 'sys' });
  if (flash['main.py']) {
    const env = {};
    let printed = 0, silent = 0;
    for (const ln of flash['main.py']) {
      const r = evaluate(ln, env, false);
      if (r.out !== null && r.out !== undefined) { shell.push({ text: r.out, kind: r.error ? 'err' : 'out' }); printed++; if (r.error) break; }
      else silent++;
    }
    poweredWithMain = true;
    vars = env;
    sparky = 'main.py ran by itself!' + (silent ? ' Lines without print() ran silently, because a saved program only shows what you print.' : '');
  } else if (flash['test.py']) {
    shell.push({ text: 'No main.py found. Run test.py from Thonny yourself.', kind: 'hint' });
    sparky = 'test.py is saved, but only main.py runs by itself at power-up.';
  } else {
    shell.push({ text: 'No main.py found. Nothing ran.', kind: 'hint' });
    sparky = 'Nothing was saved, so nothing ran. REPL lines are never saved on their own.';
  }
  trimShell();
}

// which workflow step is done
function stepsDone() {
  return [replUsed, editor.length > 0, !!flash['main.py'], poweredWithMain];
}

function updateSparky() {
  const d = stepsDone();
  if (!d[0]) sparky = 'Try a line in the REPL. The board runs it right away.';
  else if (!d[1]) sparky = 'Nice! Copy the lines that worked into the Editor so you can keep them.';
  else if (!d[2]) sparky = flash['test.py'] ? 'test.py is saved, but only main.py runs by itself at power-up.'
    : 'Now save the Editor to the board as main.py. REPL lines are not saved.';
  else if (!d[3]) sparky = 'Unplug and replug the board. Predict what the Shell will show.';
  else sparky = 'Your program now runs every time the robot powers up!';
}

// ---------------- drawing ----------------
function draw() {
  updateCanvasSize();
  const narrow = canvasWidth < 560;
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(narrow ? 18 : 22);
  text('REPL and Save Workflow', canvasWidth / 2, 6);

  if (!narrow) {
    const half = canvasWidth / 2;
    drawThonny(margin, 36, half - margin - 5, drawHeight - 44, false);
    drawBoard(half + 5, 36, half - margin - 5, 132, false);
    drawChips(half + 5, 176, half - margin - 5, false);
    drawSparky(half + 5, 176 + 4 * 28 + 4, half - margin - 5, drawHeight - (176 + 4 * 28 + 4) - 6, false);
  } else {
    const tH = drawHeight - 30 - 6 - 126;  // Thonny gets all the height the board row does not need
    drawThonny(margin, 30, canvasWidth - 2 * margin, tH, true);
    const y2 = 30 + tH + 6;
    const colW = (canvasWidth - 2 * margin - 8) / 2;
    drawBoard(margin, y2, colW, 86, true);
    drawChips(margin + colW + 8, y2, colW, true);
    drawSparky(margin, y2 + 92, canvasWidth - 2 * margin, drawHeight - y2 - 94, true);
  }

  // Shell prompt label in the control area
  noStroke(); fill(SHELL_BG); textFont('monospace'); textStyle(BOLD); textSize(16);
  textAlign(LEFT, CENTER);
  text('>>>', 8, drawHeight + 19);
  textStyle(NORMAL); textFont('sans-serif');
}

function drawThonny(x, y, w, h, narrow) {
  // window frame and title bar
  stroke('gray'); strokeWeight(1); fill('gainsboro');
  rect(x, y, w, h, 6);
  noStroke(); fill('black'); textSize(narrow ? 12 : 13); textAlign(LEFT, CENTER);
  textStyle(BOLD); text('Thonny', x + 8, y + 10); textStyle(NORMAL);
  // editor tab
  const tabX = x + 66, tabW = min(140, w - 76);
  fill('white'); rect(tabX, y + 3, tabW, 17, 4, 4, 0, 0);
  fill('dimgray'); textSize(12);
  text(editorName, tabX + 8, y + 12);

  // Editor pane with line numbers and syntax colors
  const lh = narrow ? 15 : 17;
  const edLines = narrow ? 3 : 5;
  const ey = y + 20, eh = edLines * lh + 8;
  fill('white'); rect(x + 4, ey, w - 8, eh);
  fill('whitesmoke'); rect(x + 4, ey, 26, eh);
  textFont('monospace'); textSize(narrow ? 12 : 13);
  const start = max(0, editor.length - edLines);
  for (let i = 0; i < edLines; i++) {
    const ly = ey + 4 + i * lh + lh / 2;
    fill('gray'); textAlign(RIGHT, CENTER);
    text(start + i + 1, x + 26, ly);
    if (editor[start + i] !== undefined) drawCode(editor[start + i], x + 36, ly);
  }
  if (editor.length === 0) {
    fill('silver'); textAlign(LEFT, CENTER);
    text('(empty: copy REPL lines here)', x + 36, ey + 4 + lh / 2);
  }

  // Shell pane
  const sy = ey + eh + 2;
  fill('gainsboro'); rect(x + 4, sy, w - 8, 16);
  fill('black'); textFont('sans-serif'); textSize(12); textAlign(LEFT, CENTER);
  text('Shell', x + 10, sy + 8);
  const shY = sy + 16, shH = y + h - 4 - shY;
  fill(SHELL_BG); rect(x + 4, shY, w - 8, shH);
  textFont('monospace'); textSize(narrow ? 11 : 13);
  const slh = narrow ? 14 : 16;
  const maxLines = floor((shH - 6) / slh) - 1;
  const lines = shell.slice(-maxLines);
  let ty = shY + 4 + slh / 2;
  textAlign(LEFT, CENTER);
  for (const s of lines) {
    const col = { in: 'white', out: 'lightgreen', err: 'salmon', hint: 'khaki', sys: 'lightsteelblue' }[s.kind];
    fill(col);
    text(fitText(s.text, w - 20), x + 10, ty);
    ty += slh;
  }
  // prompt with a blinking cursor
  fill('white');
  const prompt = isOff() ? '(no power)' : '>>> ';
  text(prompt, x + 10, ty);
  if (!isOff() && floor(millis() / 500) % 2 === 0) {
    rect(x + 10 + textWidth(prompt), ty - slh / 2 + 2, 8, slh - 4);
  }
  textFont('sans-serif');
}

// cut a line so it fits the pane width
function fitText(s, w) {
  if (textWidth(s) <= w) return s;
  let t = s;
  while (t.length > 1 && textWidth(t + '…') > w) t = t.slice(0, -1);
  return t + '…';
}

// simple syntax colors: print in purple, strings in green, numbers in blue
function drawCode(line, x, y) {
  const tokens = line.match(/print|"[^"]*"|'[^']*'|\d+(\.\d+)?|\s+|[A-Za-z_]\w*|./g) || [];
  let cx = x;
  textAlign(LEFT, CENTER);
  for (const t of tokens) {
    if (t === 'print') fill('purple');
    else if (/^["']/.test(t)) fill('green');
    else if (/^\d/.test(t)) fill('blue');
    else fill('black');
    text(t, cx, y);
    cx += textWidth(t);
  }
}

function drawBoard(x, y, w, h, narrow) {
  const off = isOff();
  stroke('darkgreen'); strokeWeight(2); fill('seagreen');
  rect(x, y, w, h, 8);
  noStroke(); fill('white'); textSize(narrow ? 12 : 13); textStyle(BOLD); textAlign(LEFT, TOP);
  text(narrow ? 'Board' : 'Maker Pi RP2040', x + 8, y + 6);
  textStyle(NORMAL);
  // power LED and reset button
  stroke('black'); strokeWeight(1); fill(off ? 'darkslategray' : 'lime');
  circle(x + w - 60, y + 13, 10);
  noStroke(); fill('white'); textSize(11); textAlign(LEFT, CENTER);
  text('PWR', x + w - 52, y + 13);
  stroke('black'); fill('lightgray'); rect(x + w - 22, y + 6, 14, 14, 3);

  // Flash file list
  const fx = x + 8, fy = y + 26, fw = narrow ? w - 16 : w * 0.58 - 12, fh = h - 34;
  stroke('white'); strokeWeight(1); fill('#1976d2');
  rect(fx, fy, fw, fh, 5);
  noStroke(); fill('white'); textSize(narrow ? 11 : 13); textStyle(BOLD); textAlign(LEFT, TOP);
  text('Flash: saved files', fx + 6, fy + 4);
  textStyle(NORMAL); textFont('monospace'); textSize(narrow ? 11 : 12);
  const names = Object.keys(flash);
  let ly = fy + (narrow ? 20 : 24);
  if (names.length === 0) { fill('lightsteelblue'); text('(empty)', fx + 6, ly); }
  for (const n of names) {
    fill(n === 'main.py' ? 'gold' : 'white');
    text(n + '  (' + flash[n].length + (flash[n].length === 1 ? ' line)' : ' lines)'), fx + 6, ly);
    ly += narrow ? 14 : 17;
  }
  textFont('sans-serif');

  // RAM: the REPL variables (wide screens only)
  if (!narrow) {
    const rx = x + w * 0.58 + 2, rw = w * 0.42 - 10;
    stroke('white'); fill('#e65100');
    rect(rx, fy, rw, fh, 5);
    noStroke(); fill('white'); textSize(13); textStyle(BOLD);
    text('RAM: variables', rx + 6, fy + 4);
    textStyle(NORMAL); textFont('monospace'); textSize(12);
    const keys = Object.keys(vars);
    if (keys.length === 0) { fill('peachpuff'); text('(none)', rx + 6, fy + 24); }
    keys.forEach((k, i) => { fill('white'); text(k + ' = ' + vars[k], rx + 6, fy + 24 + i * 17); });
    textFont('sans-serif');
  }

  if (off) {
    noStroke(); fill(30, 30, 30, 140); rect(x, y, w, h, 8);
    fill('white'); textSize(16); textStyle(BOLD); textAlign(CENTER, CENTER);
    text('Unplugged', x + w / 2, y + h / 2);
    textStyle(NORMAL);
  }
}

// four workflow chips: active orange, finished green with a check
function drawChips(x, y, w, narrow) {
  const labels = ['1 Try in REPL', '2 Write in Editor', '3 Save to board as main.py', '4 Power-cycle'];
  const done = stepsDone();
  const active = done.indexOf(false);
  const ch = narrow ? 20 : 24, gap = narrow ? 2 : 4;
  labels.forEach((lab, i) => {
    const cy = y + i * (ch + gap);
    let bg = 'white', fg = 'dimgray', bd = 'silver';
    if (done[i]) { bg = 'honeydew'; fg = 'darkgreen'; bd = 'green'; }
    if (i === active) { bg = ACTIVE; fg = 'white'; bd = ACTIVE; }
    stroke(bd); strokeWeight(1.5); fill(bg);
    rect(x, cy, w, ch, ch / 2);
    noStroke(); fill(fg); textSize(narrow ? 11 : 14); textAlign(LEFT, CENTER);
    if (i === active) textStyle(BOLD);
    text(fitText(lab, w - 34), x + 10, cy + ch / 2);
    textStyle(NORMAL);
    if (done[i]) {
      stroke('green'); strokeWeight(2.5); noFill();
      const kx = x + w - 18, ky = cy + ch / 2;
      line(kx - 5, ky, kx - 1, ky + 4); line(kx - 1, ky + 4, kx + 6, ky - 5);
    }
  });
}

function drawSparky(x, y, w, h, narrow) {
  // tiny Sparky face
  stroke('black'); strokeWeight(1.5); fill('#1a237e');
  rect(x, y + 2, 26, 22, 5);
  noStroke(); fill('white');
  ellipse(x + 8, y + 11, 5, 7); ellipse(x + 18, y + 11, 5, 7);
  noFill(); stroke('white'); strokeWeight(1.5); arc(x + 13, y + 15, 12, 7, 0, PI);
  noStroke(); fill('navy'); textSize(narrow ? 12 : 14); textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('Sparky says: ' + sparky, x + 34, y + 2, w - 36, h);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof powerButton !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
