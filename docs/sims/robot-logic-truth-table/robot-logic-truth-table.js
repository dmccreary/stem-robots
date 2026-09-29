// Robot Logic Truth Table
// CANVAS_HEIGHT: 480
// Bloom L3 (Apply): evaluate and, or, and not expressions for robot conditions
// and predict when the robot will stop.
// Logic evaluation adapted from moving-rainbow/python-operator-playground.
// A = obstacle_close (distance under 20 cm), B = robot_moving. The lamp shows
// the Emergency stop rule; the truth table highlights the current row, and
// other rows stay hidden ("?") until the learner predicts or shows them.
// The canvas height is fixed; controls wrap onto more rows on narrow screens,
// so the control area grows and the drawing area shrinks to match.

let canvasWidth = 700;
let drawHeight = 368;       // wide-screen value
let controlHeight = 112;    // wide-screen value
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let aBox, bBox, orderBox, exprRadio, showAllButton, predictButton, trueButton, falseButton;
let lastWidth = 0;

const EXPRS = [
  { key: 'A and B', code: 'if obstacle_close and robot_moving:', f: (a, b) => a && b },
  { key: 'A or B', code: 'if obstacle_close or robot_moving:', f: (a, b) => a || b },
  { key: 'not A', code: 'if not obstacle_close:', f: (a, b) => !a, aOnly: true },
  { key: 'not A and B', code: 'if not obstacle_close and robot_moving:', f: (a, b) => !a && b },
  { key: '(not A) or B', code: 'if (not obstacle_close) or robot_moving:', f: (a, b) => !a || b }
];

let A = true, B = true;
let showAll = false;
let predictMode = false;
let pickedRow = null;        // row key chosen for a prediction, e.g. "TF"
let revealed = new Set();    // rows answered correctly
let feedback = '';
let feedbackColor = 'black';
let tableRows = [];          // clickable row boxes
let switchBoxes = [];        // clickable switch boxes in the scene

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  aBox = createCheckbox('A: obstacle_close', true);
  bBox = createCheckbox('B: robot_moving', true);
  orderBox = createCheckbox('Show parentheses order', false);
  for (const c of [aBox, bBox, orderBox]) { c.parent(mainEl); c.style('font-size', '15px'); }
  aBox.changed(() => { A = aBox.checked(); });
  bBox.changed(() => { B = bBox.checked(); });

  exprRadio = createRadio();
  exprRadio.parent(mainEl);
  for (const e of EXPRS) exprRadio.option(e.key, e.key.replace(/ /g, '\u00a0'));
  exprRadio.selected('A and B');
  exprRadio.style('font-size', '15px');
  exprRadio.style('font-family', 'monospace');
  // keep each radio button next to its label when the group wraps
  exprRadio.elt.querySelectorAll('label').forEach(l => {
    l.style.whiteSpace = 'nowrap';
    l.style.display = 'inline-block';
    l.style.marginRight = '8px';
  });
  exprRadio.changed(() => { revealed.clear(); pickedRow = null; feedback = ''; });

  showAllButton = makeButton('Show all rows', () => {
    showAll = !showAll;
    showAllButton.html(showAll ? 'Hide other rows' : 'Show all rows');
  });
  predictButton = makeButton('Test my prediction', () => {
    predictMode = !predictMode;
    pickedRow = null;
    predictButton.html(predictMode ? 'Stop testing' : 'Test my prediction');
    feedback = predictMode ? 'Click a ? in the Result column, then press True or False.' : '';
    feedbackColor = 'purple';
    updatePredictButtons();
  });
  trueButton = makeButton('True', () => checkPrediction(true));
  falseButton = makeButton('False', () => checkPrediction(false));
  updatePredictButtons();

  positionControls();
  describe('A robot near a wall with two switches, A obstacle_close and B robot_moving, and an Emergency stop lamp. A code line shows the chosen and, or, or not rule with live True and False values. A truth table lists every combination of A and B, highlights the current row, and lets students predict hidden results.', LABEL);
}

function makeButton(label, fn) {
  const b = createButton(label);
  b.parent(document.querySelector('main'));
  b.style('font-size', '14px');
  b.mousePressed(fn);
  return b;
}

function updatePredictButtons() {
  for (const b of [trueButton, falseButton]) {
    if (predictMode && pickedRow) b.removeAttribute('disabled'); else b.attribute('disabled', '');
  }
}

// Row 1: the two switches and the order checkbox. Row 2: the expression radio.
// Row 3: table buttons. Each group wraps when the width runs out.
function positionControls() {
  let rowY = 6;
  const plan = [];
  const flow = (els, h) => {
    let x = 10;
    for (const el of els) {
      const w = el.elt.offsetWidth || 120;
      if (x + w > canvasWidth - 8 && x > 10) { x = 10; rowY += h; }
      plan.push({ el: el, x: x, y: rowY });
      x += w + 14;
    }
    rowY += h;
  };
  flow([aBox, bBox, orderBox], 30);
  // the radio group wraps inside its own box; measure how tall it is
  exprRadio.style('width', (canvasWidth - 110) + 'px');
  plan.push({ el: exprRadio, x: 100, y: rowY + 2 });
  exprRadio.position(100, drawHeight + rowY + 2);
  const rh = max(26, exprRadio.elt.offsetHeight || 26);
  rowY += rh + 8;
  flow([showAllButton, predictButton, trueButton, falseButton], 32);
  controlHeight = rowY + 4;
  drawHeight = canvasHeight - controlHeight;
  for (const p of plan) p.el.position(p.x, drawHeight + p.y);
  radioTop = drawHeight + plan.find(p => p.el === exprRadio).y;
}
let radioTop = 0;

function currentExpr() { return EXPRS.find(e => e.key === exprRadio.value()) || EXPRS[0]; }
function rowKey(a, b) { return (a ? 'T' : 'F') + (b ? 'T' : 'F'); }
function tf(v) { return v ? 'True' : 'False'; }

function checkPrediction(guess) {
  if (!predictMode || !pickedRow) return;
  const e = currentExpr();
  const a = pickedRow[0] === 'T', b = pickedRow[1] === 'T';
  if (e.f(a, b) === guess) {
    revealed.add(pickedRow);
    feedback = 'Correct! ' + e.key + ' is ' + tf(guess) + ' when A is ' + tf(a) + (e.aOnly ? '.' : ' and B is ' + tf(b) + '.');
    feedbackColor = 'darkgreen';
    pickedRow = null;
  } else {
    feedback = 'Not yet, look at the rule.';
    feedbackColor = 'firebrick';
  }
  updatePredictButtons();
}

// plain-words description of what the robot does
function behavior(e, a, b, r) {
  switch (e.key) {
    case 'A and B':
      if (r) return 'Both are True: the robot stops!';
      return (a || b) ? 'Only one is True: no emergency stop.' : 'Both are False: no emergency stop.';
    case 'A or B':
      return r ? 'At least one is True: the robot stops!' : 'Both are False: the lamp stays dark.';
    case 'not A':
      return r ? 'obstacle_close is False, and not flips it to True: the robot stops!'
        : 'obstacle_close is True, and not flips it to False: no stop.';
    case 'not A and B':
      return r ? 'Not close to an obstacle AND moving: the robot stops!'
        : 'This rule needs A False and B True. No stop.';
    default:
      return r ? 'At least one side is True: the robot stops!'
        : 'not A is False and B is False: no stop.';
  }
}

// ---------------- drawing ----------------
function draw() {
  updateCanvasSize();
  A = aBox.checked(); B = bBox.checked();
  const narrow = canvasWidth < 600;
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(narrow ? 18 : 22);
  text('Robot Logic Truth Table', canvasWidth / 2, 6);

  const e = currentExpr();
  const result = e.f(A, B);

  if (!narrow) {
    const leftW = canvasWidth * 0.54;
    drawScene(margin, 36, leftW - 2 * margin, 168, result, false);
    drawCode(margin, 212, leftW - 2 * margin, 88, e, result, false);
    drawMessage(margin, 306, leftW - 2 * margin, drawHeight - 312, e, result, false);
    drawLamp(leftW + 40, 70, result, false);
    drawTable(leftW + 4, 112, canvasWidth - leftW - 14, drawHeight - 120, e, false);
  } else {
    drawScene(margin, 30, canvasWidth - 2 * margin, 104, result, true);
    drawCode(margin, 138, canvasWidth - 2 * margin, 58, e, result, true);
    const tableH = min(126, drawHeight - 200 - 42);
    drawTable(margin, 200, canvasWidth - 2 * margin, tableH, e, true);
    drawMessage(margin, 204 + tableH, canvasWidth - 2 * margin, drawHeight - 208 - tableH, e, result, true);
  }

  // control label for the radio group
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(15);
  text('Rule:', 10, radioTop + 3);
}

// robot near a wall, two switches, and the emergency-stop lamp
function drawScene(x, y, w, h, result, narrow) {
  stroke('lightsteelblue'); strokeWeight(1); fill('white');
  rect(x, y, w, h, 8);

  // switches on the left
  switchBoxes = [];
  const sw = [{ label: 'A  obstacle_close', note: '(distance under 20 cm)', v: A, box: aBox },
              { label: 'B  robot_moving', note: '', v: B, box: bBox }];
  const sx = x + 10;
  sw.forEach((s, i) => {
    const sy = y + 12 + i * (narrow ? 44 : 70);
    stroke('dimgray'); strokeWeight(1.5); fill(s.v ? 'limegreen' : 'lightgray');
    rect(sx, sy, 48, 24, 12);
    noStroke(); fill('white'); circle(s.v ? sx + 36 : sx + 12, sy + 12, 20);
    fill(s.v ? 'darkgreen' : 'dimgray'); textAlign(LEFT, CENTER); textSize(narrow ? 13 : 15); textStyle(BOLD);
    text(tf(s.v), sx + 54, sy + 12);
    textStyle(NORMAL); fill('black'); textFont('monospace'); textSize(narrow ? 11 : 13);
    text(s.label, sx, sy + (narrow ? 34 : 36));
    textFont('sans-serif');
    if (s.note && !narrow) { fill('dimgray'); textSize(12); text(s.note, sx, sy + 51); }
    switchBoxes.push({ x: sx, y: sy, w: 100, h: 24, box: s.box });
  });

  // robot heading toward a wall: close when A is True, far when False
  const trackL = x + (narrow ? 150 : 172);
  const wallX = narrow ? x + w - 96 : x + w - 22;
  const midY = y + h / 2 + (narrow ? 0 : 6);
  stroke('dimgray'); strokeWeight(1); fill('burlywood');
  rect(wallX, y + 10, 12, h - 20);
  const robotX = A ? wallX - 36 : trackL + 34;
  // motion lines behind a moving robot
  if (B) {
    stroke('steelblue'); strokeWeight(2);
    for (let k = 0; k < 3; k++) line(robotX - 34 - k * 6, midY - 10 + k * 10, robotX - 24 - k * 6, midY - 10 + k * 10);
  }
  stroke('black'); strokeWeight(1.5); fill('whitesmoke');
  rect(robotX - 20, midY - 16, 40, 32, 6);
  noStroke(); fill('#f9a825');
  rect(robotX - 14, midY - 22, 22, 6, 2); rect(robotX - 14, midY + 16, 22, 6, 2);
  fill('black'); rect(robotX + 20, midY - 5, 5, 10);
  // distance label
  stroke('gray'); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(robotX + 26, midY + 30, wallX, midY + 30);
  drawingContext.setLineDash([]);
  noStroke(); fill('dimgray'); textSize(12); textAlign(CENTER, TOP);
  text(A ? '12 cm' : '60 cm', min((robotX + 26 + wallX) / 2, wallX - 24), midY + 33);

  if (narrow) drawLamp(x + w - 42, y + h / 2 - 8, result, true);
}

// the Emergency stop lamp: red when the rule is True
function drawLamp(lx, ly, result, narrow) {
  const d = narrow ? 38 : 50;
  stroke('black'); strokeWeight(2); fill(result ? 'red' : 'dimgray');
  circle(lx, ly, d);
  if (result) { noFill(); stroke(255, 0, 0, 90); strokeWeight(6); circle(lx, ly, d + 12); }
  noStroke(); fill('black'); textStyle(BOLD);
  if (narrow) {
    textAlign(CENTER, TOP); textSize(11);
    text('Emergency', lx, ly + 22); text('stop?', lx, ly + 34);
  } else {
    textAlign(LEFT, CENTER); textSize(17);
    text('Emergency stop?', lx + 40, ly - 9);
    textStyle(NORMAL); textSize(15); fill(result ? 'firebrick' : 'dimgray');
    text(result ? 'True: STOP' : 'False: keep going', lx + 40, ly + 12);
  }
  textStyle(NORMAL);
}

// the code line, live values, and optional order circles
function drawCode(x, y, w, h, e, result, narrow) {
  noStroke(); fill('#1e1e1e');
  rect(x, y, w, h, 8);
  textFont('monospace');
  let ts = narrow ? 12 : 14;
  textSize(ts);
  while (textWidth(e.code) > w - 20 && ts > 9) { ts--; textSize(ts); }
  const cx = x + 10, cy = y + (narrow ? 18 : 26);
  // syntax colors: keywords orange, names white
  const tokens = e.code.match(/if|not|and|or|[A-Za-z_]+|\s+|./g);
  let tx = cx;
  const opPos = [];
  textAlign(LEFT, CENTER);
  for (const t of tokens) {
    if (t === 'if') fill('orchid');
    else if (t === 'not' || t === 'and' || t === 'or') { fill('orange'); opPos.push({ t: t, x: tx + textWidth(t) / 2 }); }
    else fill('white');
    text(t, tx, cy);
    tx += textWidth(t);
  }
  // numbered circles show the order Python uses: not (1), and (2), or (3)
  if (orderBox.checked()) {
    const order = { not: 1, and: 2, or: 3 };
    for (const p of opPos) {
      stroke('gold'); strokeWeight(1.5); fill('black');
      circle(p.x, cy - (narrow ? 14 : 17), narrow ? 13 : 15);
      noStroke(); fill('gold'); textSize(narrow ? 10 : 11); textAlign(CENTER, CENTER);
      text(order[p.t], p.x, cy - (narrow ? 14 : 17));
    }
    textSize(ts);
  }
  // live values with each step (second line when it does not fit)
  textAlign(LEFT, CENTER); textSize(narrow ? 12 : 14);
  fill(result ? 'salmon' : 'lightgreen');
  const steps = liveSteps(e);
  if (textWidth(steps) <= w - 20) text(steps, cx, cy + (narrow ? 20 : 30));
  else {
    const cut = steps.indexOf(' -> ');
    text(steps.slice(0, cut), cx, cy + (narrow ? 18 : 26));
    text(steps.slice(cut + 1), cx, cy + (narrow ? 32 : 46));
  }
  textFont('sans-serif');
}

function liveSteps(e) {
  const a = tf(A), b = tf(B);
  switch (e.key) {
    case 'A and B': return a + ' and ' + b + ' -> ' + tf(A && B);
    case 'A or B': return a + ' or ' + b + ' -> ' + tf(A || B);
    case 'not A': return 'not ' + a + ' -> ' + tf(!A);
    case 'not A and B': return '(not ' + a + ') and ' + b + ' -> ' + tf(!A) + ' and ' + b + ' -> ' + tf(!A && B);
    default: return '(not ' + a + ') or ' + b + ' -> ' + tf(!A) + ' or ' + b + ' -> ' + tf(!A || B);
  }
}

function drawMessage(x, y, w, h, e, result, narrow) {
  noStroke(); textAlign(LEFT, TOP); textSize(narrow ? 13 : 15);
  fill(result ? 'firebrick' : 'darkslategray'); textStyle(BOLD);
  text(behavior(e, A, B, result), x + 2, y, w - 4, 40);
  textStyle(NORMAL);
  if (feedback) {
    fill(feedbackColor); textSize(narrow ? 12 : 14);
    text(feedback, x + 2, y + (narrow ? 18 : 40), w - 4, 40);
  }
}

// Truth table: A, B, Result. Current row yellow; other results hidden unless
// shown, predicted correctly, or Show all rows is on.
function drawTable(x, y, w, h, e, narrow) {
  const rows = e.aOnly ? [[false, false], [true, false]] : [[false, false], [false, true], [true, false], [true, true]];
  const hH = narrow ? 24 : 40;
  const rowH = min(narrow ? 24 : 46, (h - hH) / rows.length);
  const cols = e.aOnly ? [0, 0.5] : [0, 0.34, 0.68];
  const heads = e.aOnly ? ['A obstacle_close', 'Result'] : ['A obstacle_close', 'B robot_moving', 'Result'];
  noStroke(); fill('midnightblue');
  rect(x, y, w, hH, 6, 6, 0, 0);
  fill('white'); textAlign(LEFT, CENTER); textStyle(BOLD);
  heads.forEach((hd, i) => {
    const cxl = x + 8 + cols[i] * w;
    const colW = (i + 1 < cols.length ? cols[i + 1] : 1) * w - cols[i] * w - 10;
    if (narrow) { textSize(12); text(hd.split(' ')[0], cxl, y + hH / 2); }
    else {
      const parts = hd.split(' ');
      textSize(15); text(parts[0], cxl, y + 12);
      if (parts[1]) { textSize(11); textStyle(NORMAL); textFont('monospace'); text(fitWord(parts[1], colW), cxl, y + 29); textFont('sans-serif'); textStyle(BOLD); }
    }
  });
  textStyle(NORMAL);

  tableRows = [];
  rows.forEach((r, i) => {
    const ry = y + hH + i * rowH;
    const key = rowKey(r[0], r[1]);
    const current = e.aOnly ? r[0] === A : (r[0] === A && r[1] === B);
    const picked = predictMode && pickedRow === key;
    stroke('gainsboro'); strokeWeight(1);
    fill(current ? '#fff59d' : (i % 2 === 0 ? 'white' : 'whitesmoke'));
    rect(x, ry, w, rowH);
    const res = e.f(r[0], r[1]);
    const show = current || showAll || revealed.has(key);
    noStroke(); textAlign(LEFT, CENTER); textSize(narrow ? 13 : 16);
    fill(r[0] ? 'darkgreen' : 'dimgray'); text(tf(r[0]), x + 8 + cols[0] * w, ry + rowH / 2);
    if (!e.aOnly) { fill(r[1] ? 'darkgreen' : 'dimgray'); text(tf(r[1]), x + 8 + cols[1] * w, ry + rowH / 2); }
    const rc = x + cols[cols.length - 1] * w;
    if (current) textStyle(BOLD);
    fill(show ? (res ? 'firebrick' : 'black') : 'purple');
    text(show ? tf(res) : '?', rc + 8, ry + rowH / 2);
    textStyle(NORMAL);
    if (picked) { noFill(); stroke('orange'); strokeWeight(3); rect(rc + 2, ry + 2, x + w - rc - 4, rowH - 4, 4); }
    tableRows.push({ x: x, y: ry, w: w, h: rowH, a: r[0], b: r[1], key: key, hidden: !show, rc: rc });
  });
}

function fitWord(s, w) {
  if (textWidth(s) <= w) return s;
  let t = s;
  while (t.length > 1 && textWidth(t + '…') > w) t = t.slice(0, -1);
  return t + '…';
}

// click a switch to flip it, or a table row to jump to it (or pick it to predict)
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const s of switchBoxes) {
    if (mouseX > s.x && mouseX < s.x + s.w && mouseY > s.y && mouseY < s.y + s.h) {
      s.box.checked(!s.box.checked());
      return;
    }
  }
  for (const r of tableRows) {
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      if (predictMode) {
        if (r.hidden) { pickedRow = r.key; feedback = 'Is this row True or False? Press a button.'; feedbackColor = 'purple'; }
        else { feedback = 'That row is already showing. Pick a row with a ?'; feedbackColor = 'purple'; }
        updatePredictButtons();
      } else {
        aBox.checked(r.a);
        if (!currentExpr().aOnly) bBox.checked(r.b);
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof falseButton !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
