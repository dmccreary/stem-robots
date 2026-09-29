// Commit or Ignore Sorter
// CANVAS_HEIGHT: 500
// Bloom L2 (Understand, verb Classify): decide which project files belong in
// version control and which belong in .gitignore, and explain the reason for
// each. Drag a file card into a bin (or select it and press a bin button).
// Each drop gets a check or an X and one sentence explaining why.

let canvasWidth = 800;
let drawHeight = 420;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

// ---------- the ten file cards ----------
// answer: 'commit', 'ignore', or 'either' (discussion card)
const FILES = [
  { name: 'main.py', answer: 'commit', folder: false, pattern: 'main.py',
    right: 'main.py is your robot program. Commit it so git saves every change.',
    wrong: 'main.py is your robot program! If git ignores it, your code is never saved.' },
  { name: 'config.py', answer: 'commit', folder: false, pattern: 'config.py',
    right: 'config.py holds pin numbers. They are hardware facts, so they are safe to share.',
    wrong: 'config.py only holds pin numbers and tuning constants. Those are hardware facts, safe to share.' },
  { name: 'secrets.py', answer: 'ignore', folder: false, pattern: 'secrets.py',
    right: 'secrets.py holds your WiFi password. Anyone who sees your repo would see it.',
    wrong: 'Once a secret is committed, it stays in git history. You would need to change the password.' },
  { name: '.gitignore', answer: 'commit', folder: false, pattern: '.gitignore',
    right: 'Commit .gitignore so everyone who copies the project skips the same files.',
    wrong: 'If .gitignore is not committed, your teammates never get the list of files to skip.' },
  { name: '__pycache__/', answer: 'ignore', folder: true, pattern: '__pycache__/',
    right: '__pycache__/ holds files Python rebuilds by itself. No need to save them.',
    wrong: 'Python rebuilds __pycache__/ on its own. Committing it just adds clutter.' },
  { name: 'notes.pyc', answer: 'ignore', folder: false, pattern: '*.pyc',
    right: '.pyc files are compiled Python that gets rebuilt. The *.pyc pattern ignores them all.',
    wrong: 'notes.pyc is compiled Python that gets rebuilt. Ignore it with the *.pyc pattern.' },
  { name: '.DS_Store', answer: 'ignore', folder: false, pattern: '.DS_Store',
    right: '.DS_Store is a Mac folder file. It has no use in the project.',
    wrong: '.DS_Store is a Mac folder file with no use in the project. Ignore it.' },
  { name: 'README.md', answer: 'commit', folder: false, pattern: 'README.md',
    right: 'README.md explains your project to other people. Always commit it.',
    wrong: 'README.md explains your project. Without it, nobody knows how to use your code.' },
  { name: 'lib/vl53l0x.py', answer: 'commit', folder: false, pattern: 'lib/vl53l0x.py',
    right: 'Your code imports this sensor driver. Commit it so the project runs on any robot.',
    wrong: 'Without lib/vl53l0x.py, a teammate\'s robot cannot read the distance sensor.' },
  { name: 'heading_log.csv', answer: 'either', folder: false, pattern: 'heading_log.csv',
    right: 'Small logs can be committed for a class project. Large or private logs should be ignored.',
    wrong: 'Small logs can be committed for a class project. Large or private logs should be ignored.' }
];

let cards = [];            // { i, loc: 'pile' | 'commit' | 'ignore', order, showMark, x, y, w, h }
let dropCounter = 0;
let selected = -1;
let dragging = -1;
let dragDX = 0, dragDY = 0, dragX = 0, dragY = 0, pressX = 0, pressY = 0;
let checkedAll = false;
let answersShown = false;
let feedback = { title: 'Sort the files', text: 'Drag each file card into a bin. You can also click a card, then press a bin button.', good: null };
let binFlash = 0;

// layout regions
let pileR, commitR, ignoreR, rightR;

// controls
let commitButton, ignoreButton, checkButton, answersButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(pressCanvas);
  textSize(defaultTextSize);

  commitButton = createButton('Commit selected');
  commitButton.parent(document.querySelector('main'));
  commitButton.mousePressed(() => placeSelected('commit'));
  ignoreButton = createButton('Add selected to .gitignore');
  ignoreButton.parent(document.querySelector('main'));
  ignoreButton.mousePressed(() => placeSelected('ignore'));
  checkButton = createButton('Check All');
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkAll);
  answersButton = createButton('Show Answers');
  answersButton.parent(document.querySelector('main'));
  answersButton.mousePressed(showAnswers);
  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSorter);

  commitButton.style('border', '2px solid seagreen');
  ignoreButton.style('border', '2px solid firebrick');

  positionControls();
  resetSorter();

  describe('A sorting activity with ten project file cards: main.py, config.py, secrets.py, .gitignore, __pycache__/, ' +
    'notes.pyc, .DS_Store, README.md, lib/vl53l0x.py, and heading_log.csv. Drag each card into a green Commit to git bin ' +
    'or a red Add to .gitignore bin. Each drop shows a check or an X and one sentence of feedback. A live .gitignore ' +
    'preview lists the ignored files, and a score shows how many cards are in the right bin.', LABEL);
}

function positionControls() {
  const y0 = drawHeight + 8;
  commitButton.position(10, y0);
  ignoreButton.position(10 + (commitButton.elt.offsetWidth || 130) + 8, y0);
  let x = 10;
  for (const b of [checkButton, answersButton, resetButton]) {
    b.position(x, y0 + 36);
    x += (b.elt.offsetWidth || 90) + 8;
  }
}

function computeLayout() {
  const top = 44, bottom = drawHeight - 10;
  const pileW = floor(canvasWidth * 0.29);
  const rightW = floor(canvasWidth * 0.29);
  const binsW = canvasWidth - pileW - rightW - 40;
  pileR = { x: 10, y: top, w: pileW, h: bottom - top };
  const binH = (bottom - top - 10) / 2;
  commitR = { x: pileR.x + pileW + 10, y: top, w: binsW, h: binH };
  ignoreR = { x: commitR.x, y: top + binH + 10, w: binsW, h: binH };
  rightR = { x: commitR.x + binsW + 10, y: top, w: rightW, h: bottom - top };
}

// ---------- state changes ----------
function resetSorter() {
  cards = FILES.map((f, i) => ({ i: i, loc: 'pile', order: i, showMark: false }));
  selected = -1;
  dragging = -1;
  checkedAll = false;
  answersShown = false;
  binFlash = 0;
  dropCounter = 0;
  feedback = { title: 'Sort the files', text: 'Drag each file card into a bin. You can also click a card, then press a bin button.', good: null };
}

function isCorrect(card) {
  const a = FILES[card.i].answer;
  if (card.loc === 'pile') return false;
  return a === 'either' || a === card.loc;
}

function score() {
  return cards.filter(isCorrect).length;
}

function moveCard(idx, loc) {
  const c = cards[idx];
  const f = FILES[c.i];
  c.loc = loc;
  c.order = ++dropCounter;
  checkedAll = false;
  if (loc === 'pile') {
    c.showMark = false;
    c.order = c.i;
    feedback = { title: f.name, text: 'Back in the pile. Drag it into a bin when you are ready.', good: null };
    return;
  }
  c.showMark = true;
  const ok = isCorrect(c);
  feedback = { title: f.name + (ok ? ' - correct' : ' - try again'), text: ok ? f.right : f.wrong, good: ok };
  if (f.answer === 'either') feedback.title = f.name + ' - either bin works';
  if (f.name === 'secrets.py' && loc === 'commit') binFlash = 1.2;
  if (score() === FILES.length) {
    feedback = { title: '10 of 10!', text: 'Compare your .gitignore preview with the one in Chapter 10. Which line protects your WiFi password?', good: true };
  }
}

function placeSelected(loc) {
  if (selected < 0) {
    feedback = { title: 'No card selected', text: 'Click a file card first, then press a bin button.', good: null };
    return;
  }
  moveCard(selected, loc);
  selectNextInPile();
}

function selectNextInPile() {
  const pile = cardsIn('pile');
  selected = pile.length ? pile[0] : -1;
}

function checkAll() {
  checkedAll = true;
  for (const c of cards) if (c.loc !== 'pile') c.showMark = true;
  const placed = cards.filter(c => c.loc !== 'pile');
  const right = score();
  const wrong = placed.length - right;
  const left = cards.length - placed.length;
  feedback = {
    title: 'Check All: ' + right + ' correct',
    text: wrong + ' in the wrong bin, ' + left + ' not sorted yet.' + (wrong ? ' Drag a red card to the other bin.' : ''),
    good: right === FILES.length
  };
}

function showAnswers() {
  for (const c of cards) {
    const a = FILES[c.i].answer;
    c.loc = (a === 'ignore') ? 'ignore' : 'commit';
    c.order = c.i;
    c.showMark = true;
  }
  answersShown = true;
  checkedAll = true;
  selected = -1;
  feedback = { title: 'Answers shown', text: 'The red bin now matches the chapter .gitignore. heading_log.csv could go in either bin.', good: true };
}

// indices of cards in a location, in display order
function cardsIn(loc) {
  return cards.map((c, k) => k).filter(k => cards[k].loc === loc).sort((a, b) => cards[a].order - cards[b].order);
}

// ---------- mouse and keyboard ----------
function cardAt(mx, my) {
  for (let k = cards.length - 1; k >= 0; k--) {
    const c = cards[k];
    if (c.w && mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) return k;
  }
  return -1;
}

function pressCanvas() {
  const k = cardAt(mouseX, mouseY);
  if (k < 0) return;
  selected = k;
  dragging = k;
  dragDX = mouseX - cards[k].x;
  dragDY = mouseY - cards[k].y;
  dragX = cards[k].x;
  dragY = cards[k].y;
  pressX = mouseX;
  pressY = mouseY;
}

function mouseDragged() {
  if (dragging < 0) return;
  dragX = mouseX - dragDX;
  dragY = mouseY - dragDY;
}

function mouseReleased() {
  if (dragging < 0) return;
  const k = dragging;
  dragging = -1;
  if (dist(mouseX, mouseY, pressX, pressY) < 5) {
    feedback = { title: FILES[cards[k].i].name + ' selected', text: 'Drag it into a bin, or press a bin button below.', good: null };
    return;
  }
  const inside = r => mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
  if (inside(commitR)) moveCard(k, 'commit');
  else if (inside(ignoreR)) moveCard(k, 'ignore');
  else if (inside(pileR)) moveCard(k, 'pile');
}

function keyPressed() {
  if (keyCode === DOWN_ARROW || keyCode === UP_ARROW) {
    const order = cardsIn('pile').concat(cardsIn('commit'), cardsIn('ignore'));
    if (!order.length) return;
    let pos = order.indexOf(selected);
    pos = (pos + (keyCode === DOWN_ARROW ? 1 : order.length - 1)) % order.length;
    selected = order[pos];
    return false;
  }
  if (key === 'c' || key === 'C') placeSelected('commit');
  if (key === 'i' || key === 'I') placeSelected('ignore');
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  if (binFlash > 0) binFlash = max(0, binFlash - deltaTime / 1000);

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
  text('Commit or Ignore?', 10, 10);

  drawRegions();
  layoutCards();
  drawCards();
  drawRight();
  drawControlHints();
}

function drawRegions() {
  // file pile
  stroke('silver');
  fill(250);
  rect(pileR.x, pileR.y, pileR.w, pileR.h, 8);
  noStroke();
  fill('dimgray');
  textSize(15);
  textAlign(LEFT, TOP);
  text('File pile (' + cardsIn('pile').length + ' left)', pileR.x + 8, pileR.y + 6);

  // commit bin (green) and ignore bin (red)
  const flashRed = binFlash > 0 && floor(binFlash * 6) % 2 === 0;
  strokeWeight(3);
  stroke(flashRed ? 'red' : 'seagreen');
  fill(flashRed ? color(255, 200, 200) : color(235, 250, 238));
  rect(commitR.x, commitR.y, commitR.w, commitR.h, 10);
  stroke('firebrick');
  fill(253, 236, 236);
  rect(ignoreR.x, ignoreR.y, ignoreR.w, ignoreR.h, 10);
  strokeWeight(1);
  noStroke();
  textSize(16);
  textStyle(BOLD);
  fill('darkgreen');
  text('Commit to git', commitR.x + 10, commitR.y + 6);
  fill('firebrick');
  text('Add to .gitignore', ignoreR.x + 10, ignoreR.y + 6);
  textStyle(NORMAL);
}

// Compute where every card sits (pile list, or a grid inside a bin).
function layoutCards() {
  const pile = cardsIn('pile');
  const pRowH = min(34, (pileR.h - 32) / FILES.length);
  pile.forEach((k, n) => {
    Object.assign(cards[k], { x: pileR.x + 6, y: pileR.y + 28 + n * pRowH, w: pileR.w - 12, h: pRowH - 5 });
  });
  for (const [loc, r] of [['commit', commitR], ['ignore', ignoreR]]) {
    const list = cardsIn(loc);
    const cols = (r.w >= 250 && list.length > 5) ? 2 : 1;
    const rows = max(1, ceil(list.length / cols));
    const rowH = min(32, (r.h - 32) / rows);
    const colW = (r.w - 12) / cols;
    list.forEach((k, n) => {
      const col = n % cols, row = floor(n / cols);
      Object.assign(cards[k], { x: r.x + 6 + col * colW, y: r.y + 28 + row * rowH, w: colW - 6, h: rowH - 4 });
    });
  }
}

function drawCards() {
  const order = [];
  for (let k = 0; k < cards.length; k++) if (k !== dragging) order.push(k);
  if (dragging >= 0) order.push(dragging);
  for (const k of order) {
    const c = cards[k];
    let x = c.x, y = c.y;
    if (k === dragging) { x = dragX; y = dragY; }
    drawCard(c, x, y, c.w, c.h, k === selected, k === dragging);
  }
}

function drawCard(c, x, y, w, h, isSel, isDrag) {
  const f = FILES[c.i];
  const ok = isCorrect(c);
  if (isDrag) {
    noStroke();
    fill(0, 0, 0, 40);
    rect(x + 4, y + 4, w, h, 6);
  }
  // card body, tinted after Check All
  let body = color('white');
  if (checkedAll && c.loc !== 'pile') body = ok ? color(215, 245, 220) : color(255, 215, 215);
  stroke(isSel ? 'orange' : 'gray');
  strokeWeight(isSel ? 3 : 1);
  fill(body);
  rect(x, y, w, h, 6);
  strokeWeight(1);
  // icon: folder or page
  const ix = x + 6, iy = y + h / 2;
  const s = min(14, h - 8);
  if (f.folder) {
    noStroke();
    fill('goldenrod');
    rect(ix, iy - s / 2 + 2, s + 2, s - 3, 2);
    rect(ix, iy - s / 2, s / 2, 3, 1);
  } else {
    stroke('slategray');
    fill('ghostwhite');
    rect(ix, iy - s / 2, s - 3, s, 1);
    line(ix + 2, iy - 1, ix + s - 6, iy - 1);
    line(ix + 2, iy + 2, ix + s - 6, iy + 2);
  }
  // file name (shrinks to fit)
  const markW = c.showMark ? h : 0;
  const maxW = w - (s + 14) - markW - 4;
  textFont('monospace');
  let ts = 14;
  textSize(ts);
  while (ts > 10 && textWidth(f.name) > maxW) { ts--; textSize(ts); }
  let shown = f.name;
  while (shown.length > 3 && textWidth(shown + '..') > maxW && textWidth(shown) > maxW) shown = shown.slice(0, -1);
  if (shown !== f.name) shown += '..';
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  text(shown, ix + s + 6, iy + 1);
  textFont('sans-serif');
  // check or X
  if (c.showMark && c.loc !== 'pile') {
    const cx = x + w - h / 2 - 2, cy = iy, r = min(9, h / 2 - 2);
    noStroke();
    fill(ok ? 'seagreen' : 'firebrick');
    circle(cx, cy, 2 * r);
    stroke('white');
    strokeWeight(2);
    if (ok) {
      line(cx - r * 0.5, cy, cx - r * 0.1, cy + r * 0.45);
      line(cx - r * 0.1, cy + r * 0.45, cx + r * 0.55, cy - r * 0.45);
    } else {
      line(cx - r * 0.45, cy - r * 0.45, cx + r * 0.45, cy + r * 0.45);
      line(cx + r * 0.45, cy - r * 0.45, cx - r * 0.45, cy + r * 0.45);
    }
    strokeWeight(1);
  }
}

function drawRight() {
  const r = rightR;
  // score
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);
  fill(score() === FILES.length ? 'darkgreen' : 'black');
  text('Correct: ' + score() + ' / ' + FILES.length, r.x, 12);
  textStyle(NORMAL);

  // live .gitignore preview (patterns from the red bin)
  const prevH = 176;
  noStroke();
  fill('dimgray');
  textSize(15);
  text('.gitignore preview', r.x, r.y + 2);
  stroke('dimgray');
  fill(40);
  rect(r.x, r.y + 22, r.w, prevH - 22, 6);
  textFont('monospace');
  const list = cardsIn('ignore');
  const lineH = min(18, (prevH - 34) / max(1, list.length));
  let y = r.y + 30;
  noStroke();
  if (list.length === 0) {
    fill(160);
    textSize(13);
    text('# empty - nothing ignored', r.x + 8, y);
  }
  for (const k of list) {
    const c = cards[k];
    const pat = FILES[c.i].pattern;
    let ts = 14;
    textSize(ts);
    while (ts > 9 && textWidth(pat) > r.w - 16) { ts--; textSize(ts); }
    fill(checkedAll && !isCorrect(c) ? color(255, 120, 120) : color(170, 240, 170));
    text(pat, r.x + 8, y);
    y += lineH;
  }
  textFont('sans-serif');

  // feedback panel
  const fy = r.y + prevH + 10;
  const fh = r.h - prevH - 10;
  stroke(feedback.good === true ? 'seagreen' : feedback.good === false ? 'firebrick' : 'silver');
  strokeWeight(2);
  fill(255, 255, 255, 240);
  rect(r.x, fy, r.w, fh, 8);
  strokeWeight(1);
  noStroke();
  textSize(16);
  textStyle(BOLD);
  fill(feedback.good === true ? 'darkgreen' : feedback.good === false ? 'firebrick' : 'black');
  text(feedback.title, r.x + 8, fy + 8, r.w - 16, 40);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  const titleLines = textWidth(feedback.title) > r.w - 16 ? 2 : 1;
  text(feedback.text, r.x + 8, fy + 12 + titleLines * 20, r.w - 16, fh - 16 - titleLines * 20);
}

function drawControlHints() {
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, CENTER);
  const x = 10 + (commitButton.elt.offsetWidth || 130) + 8 + (ignoreButton.elt.offsetWidth || 190) + 14;
  if (canvasWidth - x > 200) text('Keys: Up/Down select, C commit, I ignore', x, drawHeight + 19);
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
