// What Goes in Git? Sorting Activity
// CANVAS_HEIGHT: 520
// Bloom L2 (Understand) - Classify: drag ten robot project files into
// "Commit to Git" or "Put in .gitignore". The repository preview and the
// generated .gitignore update on every drop; Check answers marks each card
// and clicking a card explains why it belongs where it does.

let canvasWidth = 700;
let drawHeight = 464;
let controlHeight = 56;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let checkButton, resetButton, hintCheckbox;

// answer: 'commit' or 'ignore'
const FILES = [
  { name: 'main.py', answer: 'commit', hint: 'Your code', reason: 'Your main program. Commit it so your code is saved and shared.' },
  { name: 'secrets.py', answer: 'ignore', hint: 'Holds your WiFi password', reason: 'It holds passwords, and anyone can read a public repo.' },
  { name: 'config.py', answer: 'commit', hint: 'Pin settings', reason: 'Pin settings only (no passwords), and teammates need the same ones.' },
  { name: '__pycache__/', answer: 'ignore', hint: 'Made by Python automatically', reason: 'Made automatically; it can be rebuilt at any time.' },
  { name: 'motors.py', answer: 'commit', hint: 'Your motor functions', reason: 'Your motor functions are your code, so commit them.' },
  { name: '.DS_Store', answer: 'ignore', hint: 'Made by macOS Finder', reason: 'A junk file from macOS. It has nothing to do with your robot.' },
  { name: 'vl53l0x.py', answer: 'commit', hint: 'Distance sensor library', reason: 'A library your robot needs, so others need it too.' },
  { name: 'notes.pyc', answer: 'ignore', hint: 'Compiled Python file', reason: 'Made automatically; it can be rebuilt from the .py file.' },
  { name: 'README.md', answer: 'commit', hint: 'Project description', reason: 'It explains your project to anyone who opens the repository.' },
  { name: 'wifi_password.txt', answer: 'ignore', hint: 'A password in plain text', reason: 'It holds passwords, and anyone can read a public repo.' }
];
const SECRETS = ['secrets.py', 'wifi_password.txt'];

let cards = [];            // {file, bin, x, y, w, h}
let dragCard = null, dragDX = 0, dragDY = 0, pressX = 0, pressY = 0;
let checked = false, checkTime = -9999;
let message = '';
let binRects = {};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  checkButton = createButton('Check answers');
  checkButton.parent(main);
  checkButton.mousePressed(checkAnswers);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);
  hintCheckbox = createCheckbox(' Show hints', false);
  hintCheckbox.parent(main);

  positionControls();
  resetSim();

  describe('A sorting activity with ten project file cards on the left and two bins on the right: Commit to Git and Put in .gitignore. Drag each card into a bin. A repository preview under the commit bin lists what would be public, and turns red if a password file is committed. A generated .gitignore panel lists the ignored files. Check answers marks each card right or wrong.', LABEL);
}

function positionControls() {
  const y = drawHeight + 14;
  checkButton.position(10, y);
  resetButton.position(128, y);
  hintCheckbox.position(196, y + 3);
}

function resetSim() {
  cards = FILES.map(f => ({ file: f, bin: 'pile', x: 0, y: 0, w: 0, h: 0 }));
  checked = false;
  dragCard = null;
  message = 'Drag each file into a bin. The repository preview updates as you go.';
}

function checkAnswers() {
  checked = true;
  checkTime = millis();
  const n = score();
  const unsorted = cards.filter(c => c.bin === 'pile').length;
  message = n + ' of 10 correct.' + (unsorted ? ' ' + unsorted + ' card(s) are still in the pile.' : '') +
    (n < 10 ? ' Click a card with a red X to see why.' : ' Every file is in the right place!');
}

function score() {
  return cards.filter(c => c.bin === c.file.answer).length;
}

// ---------- Layout ----------
function layout() {
  const pileW = canvasWidth < 560 ? max(110, floor(canvasWidth * 0.3)) : max(150, floor(canvasWidth * 0.33));
  const bx = margin + pileW + 10;
  const bw = (canvasWidth - bx - margin - 10) / 2;
  binRects = {
    pile: { x: margin, y: 36, w: pileW, h: drawHeight - 46 },
    commit: { x: bx, y: 36, w: bw, h: 236 },
    ignore: { x: bx + bw + 10, y: 36, w: bw, h: 236 }
  };
  // flow the cards in each area, left to right, wrapping into rows
  const hints = hintCheckbox.checked();
  for (const binName of ['pile', 'commit', 'ignore']) {
    const r = binRects[binName];
    let cx = r.x + 8, cy = r.y + 30, rowH = 0;
    for (const c of cards) {
      if (c.bin !== binName) continue;
      const showHint = hints && binName === 'pile';
      c.w = cardWidth(c.file, showHint, r.w - 16);
      c.h = showHint ? 34 : 28;
      const gap = showHint ? 4 : 6;
      // with hints, one card per row so all ten fit in the pile
      if ((showHint || cx + c.w > r.x + r.w - 6) && cx > r.x + 8) {
        cx = r.x + 8;
        cy += rowH + gap;
        rowH = 0;
      }
      c.x = cx;
      c.y = cy;
      cx += c.w + 6;
      rowH = max(rowH, c.h);
    }
  }
}

function cardFontSize() { return canvasWidth < 560 ? 10 : 12; }

function cardWidth(f, showHint, maxW) {
  push();
  textFont('monospace');
  textSize(cardFontSize());
  let w = textWidth(f.name) + 30;
  if (showHint) {
    textFont('sans-serif');
    textSize(11);
    w = max(w, textWidth(f.hint) + 16);
  }
  pop();
  return min(w, maxW);
}

// ---------- Drawing ----------
function draw() {
  updateCanvasSize();
  layout();

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(CENTER, TOP);
  text('What Goes in Git?', canvasWidth / 2, 6);

  drawArea(binRects.pile, 'Project files', 'dimgray', 'white');
  drawArea(binRects.commit, 'Commit to Git', 'seagreen', 'honeydew');
  drawArea(binRects.ignore, 'Put in .gitignore', 'firebrick', 'mistyrose');
  drawRepoPreview();
  drawGitignore();
  drawFeedback();

  for (const c of cards) if (c !== dragCard) drawCard(c);
  if (dragCard) drawCard(dragCard);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawArea(r, label, col, bg) {
  stroke(col);
  strokeWeight(r === binRects.pile ? 1 : 3);
  fill(bg);
  rect(r.x, r.y, r.w, r.h, 8);
  strokeWeight(1);
  noStroke();
  fill(col);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(label, r.x + 10, r.y + 7);
  textStyle(NORMAL);
}

function drawCard(c) {
  let x = c.x, y = c.y;
  if (c === dragCard) { x = mouseX - dragDX; y = mouseY - dragDY; }
  const wrong = checked && c.bin !== c.file.answer;
  if (wrong && millis() - checkTime < 500) x += sin((millis() - checkTime) * 0.08) * 4;

  stroke(c === dragCard ? 'royalblue' : 'gray');
  strokeWeight(c === dragCard ? 2 : 1);
  fill('white');
  rect(x, y, c.w, c.h, 5);
  strokeWeight(1);
  // tiny file icon
  noStroke();
  fill(c.file.name.endsWith('/') ? 'goldenrod' : 'lightsteelblue');
  rect(x + 6, y + (c.h > 30 ? 4 : 7), 11, 14, 2);
  push();
  textFont('monospace');
  textSize(cardFontSize());
  fill('black');
  textAlign(LEFT, CENTER);
  text(c.file.name, x + 22, y + (c.h > 30 ? 11 : 14));
  pop();
  if (c.h > 30) {
    fill('dimgray');
    textSize(11);
    textAlign(LEFT, CENTER);
    text(c.file.hint, x + 22, y + 26);
  }
  // check mark or X after checking
  if (checked && c.bin !== 'pile') {
    const ok = !wrong;
    fill(ok ? 'seagreen' : 'firebrick');
    circle(x + c.w - 2, y + 2, 16);
    fill('white');
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(ok ? '✓' : '✗', x + c.w - 2, y + 2);
    textStyle(NORMAL);
  }
}

function drawRepoPreview() {
  const b = binRects.commit;
  const r = { x: b.x, y: b.y + b.h + 8, w: b.w, h: 100 };
  const committed = cards.filter(c => c.bin === 'commit').map(c => c.file.name);
  const leak = committed.some(n => SECRETS.includes(n));
  stroke(leak ? 'red' : 'silver');
  strokeWeight(leak ? 2 : 1);
  fill(leak ? 'red' : 'white');
  rect(r.x, r.y, r.w, r.h, 6);
  strokeWeight(1);
  noStroke();
  fill(leak ? 'white' : 'dimgray');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(r.w > 200 ? 'Repository preview (public on GitHub)' : 'Repository preview', r.x + 8, r.y + 6, r.w - 16);
  textStyle(NORMAL);
  if (leak) {
    drawLock(r.x + 18, r.y + 52);
    fill('white');
    textSize(r.w > 200 ? 15 : 12);
    textStyle(BOLD);
    text('Your WiFi password is now public!', r.x + 36, r.y + 42, r.w - 44);
    textStyle(NORMAL);
  } else {
    fill('black');
    push();
    textFont('monospace');
    textSize(12);
    text(committed.length ? committed.join(', ') : '(nothing committed yet)', r.x + 8, r.y + 40, r.w - 16, r.h - 42);
    pop();
  }
}

function drawLock(cx, cy) {
  stroke('white');
  strokeWeight(3);
  noFill();
  arc(cx, cy - 4, 14, 16, PI, TWO_PI);
  strokeWeight(1);
  noStroke();
  fill('white');
  rect(cx - 9, cy - 4, 18, 14, 2);
  fill('red');
  circle(cx, cy + 2, 4);
}

function drawGitignore() {
  const b = binRects.ignore;
  const r = { x: b.x, y: b.y + b.h + 8, w: b.w, h: 100 };
  noStroke();
  fill('black');
  rect(r.x, r.y, r.w, r.h, 6);
  fill('gray');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(r.w > 170 ? 'Generated .gitignore' : '.gitignore', r.x + 8, r.y + 6);
  textStyle(NORMAL);
  const ignored = cards.filter(c => c.bin === 'ignore').map(c => c.file.name);
  push();
  textFont('monospace');
  textSize(12);
  fill('lightgreen');
  const colW = (r.w - 16) / 2;
  for (let k = 0; k < ignored.length; k++) {
    const col = floor(k / 5), row = k % 5;
    text(ignored[k], r.x + 8 + col * colW, r.y + 26 + row * 14.5, colW - 4);
  }
  if (!ignored.length) {
    fill('gray');
    text('# (empty)', r.x + 8, r.y + 26);
  }
  pop();
}

function drawFeedback() {
  // feedback sits under the two panels on the right
  const c = binRects.commit, g = binRects.ignore;
  const r = { x: c.x, y: c.y + c.h + 116, w: g.x + g.w - c.x, h: drawHeight - (c.y + c.h + 116) - 8 };
  noStroke();
  fill('midnightblue');
  textSize(14);
  textAlign(LEFT, TOP);
  text(message, r.x + 2, r.y, r.w - 4, r.h);
}

// ---------- Drag and drop ----------
function cardAt(mx, my) {
  for (let k = cards.length - 1; k >= 0; k--) {
    const c = cards[k];
    if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) return c;
  }
  return null;
}

function mousePressed() {
  const c = cardAt(mouseX, mouseY);
  if (!c) return;
  dragCard = c;
  dragDX = mouseX - c.x;
  dragDY = mouseY - c.y;
  pressX = mouseX;
  pressY = mouseY;
}

function mouseReleased() {
  if (!dragCard) return;
  const c = dragCard;
  dragCard = null;
  // a click (no real drag) shows the reason after checking
  if (dist(mouseX, mouseY, pressX, pressY) < 5) {
    if (checked) {
      const where = c.file.answer === 'commit' ? 'Commit to Git' : 'Put in .gitignore';
      message = c.file.name + ' → ' + where + ': ' + c.file.reason;
    }
    return;
  }
  let target = 'pile';
  for (const b of ['commit', 'ignore']) {
    const r = binRects[b];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) target = b;
  }
  if (target !== c.bin) {
    c.bin = target;
    // move the card to the end so it lands after the others in its bin
    cards.splice(cards.indexOf(c), 1);
    cards.push(c);
    if (checked) { checked = false; message = 'Card moved. Press Check answers again when you are ready.'; }
  }
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
