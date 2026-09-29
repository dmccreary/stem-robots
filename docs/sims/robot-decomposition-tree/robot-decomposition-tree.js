// Robot Decomposition Tree
// CANVAS_HEIGHT: 520
// Bloom L3 (Apply): break a robot goal into sub-tasks and decide when a task
// is small enough to write as code.
// Adapted from moving-rainbow/decomposition-in-action: the LED-strip goal is
// replaced by robot goals, nodes grow on demand ("Split it"), and a
// "Small enough to code?" check turns finished pieces green.

let canvasWidth = 700;
let drawHeight = 435;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let goalSelect, splitButton, smallButton, resetButton;
let mouseInside = false;
let lastWidth = 0;

// colors from the specification
const BIG_COLOR = '#bbdefb';     // still too big (not split yet)
const SMALL_COLOR = '#a5d6a7';   // small enough to code
const SELECT_COLOR = '#e65100';  // selected node outline

// Answer bank: how each goal breaks apart. A task with no children is
// "small enough to code", and its code idea appears in a bubble once it is green.
const BANK = {
  'Avoid the wall': {
    label: 'Avoid the wall',
    children: [
      { label: 'Spin the motors forward', code: 'motor_forward(75)' },
      { label: 'Read the distance sensor every 0.1 s', code: 'd = read_dist()' },
      {
        label: 'If distance is under 20 cm, stop and turn',
        children: [
          { label: 'Stop both motors', code: 'motor_stop()' },
          { label: 'Reverse for 1 s', code: 'motor_reverse(75)' },
          { label: 'Turn left or right', code: 'turn_left(75)' }
        ]
      }
    ]
  },
  'Follow a line': {
    label: 'Follow a line',
    children: [
      { label: 'Read the left and right line sensors', code: 'l = left_sensor()' },
      {
        label: 'Decide: is the line left, center, or right?',
        children: [
          { label: 'Left sensor sees dark', code: 'if left_dark:' },
          { label: 'Right sensor sees dark', code: 'if right_dark:' }
        ]
      },
      { label: 'Steer the motors to match', code: 'steer(side)' }
    ]
  },
  'Show distance on the OLED': {
    label: 'Show distance on the OLED',
    children: [
      { label: 'Read the distance sensor', code: 'd = read_dist()' },
      { label: 'Turn the number into text', code: 's = str(d)' },
      { label: 'Draw the text on the OLED', code: 'oled.text(s,0,0)' }
    ]
  }
};

// runtime tree
let root = null;      // { bank, label, depth, children: [], split, small, x, y, w, h }
let selected = null;  // the node the learner clicked
let message = 'Click the goal box to select it, then press Split it.';
let messageColor = 'black';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  mainEl.addEventListener('mouseenter', () => mouseInside = true);
  mainEl.addEventListener('mouseleave', () => mouseInside = false);
  textSize(defaultTextSize);

  // Row 1: goal picker and reset
  goalSelect = createSelect();
  goalSelect.parent(mainEl);
  for (const g of Object.keys(BANK)) goalSelect.option(g);
  goalSelect.selected('Avoid the wall');
  goalSelect.style('font-size', '15px');
  goalSelect.changed(resetTree);

  resetButton = createButton('Reset');
  resetButton.parent(mainEl);
  resetButton.style('font-size', '15px');
  resetButton.mousePressed(resetTree);

  // Row 2: the two decomposition actions
  splitButton = createButton('Split it');
  splitButton.parent(mainEl);
  splitButton.style('font-size', '15px');
  splitButton.mousePressed(splitSelected);

  smallButton = createButton('Small enough to code?');
  smallButton.parent(mainEl);
  smallButton.style('font-size', '15px');
  smallButton.mousePressed(checkSmall);

  resetTree();
  positionControls();
  describe('A decomposition tree for a robot goal. Click a box to select it, press Split it to break it into two or three smaller tasks, and press Small enough to code to turn a finished task green and show a one-line MicroPython idea. A status panel counts how many pieces are ready to code.', LABEL);
}

function positionControls() {
  goalSelect.position(100, drawHeight + 10);
  resetButton.position(max(360, 100 + 250), drawHeight + 9);
  if (canvasWidth < 460) resetButton.position(canvasWidth - 75, drawHeight + 46);
  splitButton.position(10, drawHeight + 46);
  smallButton.position(100, drawHeight + 46);
}

function resetTree() {
  const bank = BANK[goalSelect.value()];
  root = makeNode(bank, 0);
  selected = null;
  message = 'Click the goal box to select it, then press Split it.';
  messageColor = 'black';
  updateButtons();
}

function makeNode(bank, depth) {
  return { bank: bank, label: bank.label, depth: depth, children: [], split: false, small: false };
}

// Split the selected task into the smaller tasks from the answer bank
function splitSelected() {
  if (!selected) return;
  if (selected.small) {
    say('Already small. Time to code it!', 'darkgreen');
  } else if (selected.split) {
    say('This task is already split. Pick one of its smaller tasks.', 'black');
  } else if (!selected.bank.children) {
    say('This task cannot be split any more. Try Small enough to code?', 'darkslateblue');
  } else {
    selected.children = selected.bank.children.map(b => makeNode(b, selected.depth + 1));
    selected.split = true;
    say('Split into ' + selected.children.length + ' smaller tasks. Click one to check it.', 'black');
    selected = null;
  }
  updateButtons();
}

// Mark the selected task green if it is a leaf in the answer bank
function checkSmall() {
  if (!selected) return;
  if (selected.split) {
    say('This task is already split. Check its smaller tasks instead.', 'black');
  } else if (selected.bank.children) {
    say('Still too big. Can you split it more?', 'firebrick');
  } else if (selected.small) {
    say('Already small. Time to code it!', 'darkgreen');
  } else {
    selected.small = true;
    say('Yes! "' + selected.label + '" is small enough to code.', 'darkgreen');
    selected = null;
  }
  if (isComplete()) say('Fully decomposed! Each piece is ready to code.', 'darkgreen');
  updateButtons();
}

function say(msg, col) { message = msg; messageColor = col; }

// The action buttons only work when a task is selected
function updateButtons() {
  for (const b of [splitButton, smallButton]) {
    if (selected) b.removeAttribute('disabled'); else b.attribute('disabled', '');
  }
}

function allNodes(n = root, out = []) {
  out.push(n);
  for (const c of n.children) allNodes(c, out);
  return out;
}

function leaves() { return allNodes().filter(n => n.children.length === 0); }
function readyCount() { return leaves().filter(n => n.small).length; }
function isComplete() { const L = leaves(); return L.length > 0 && L.every(n => n.small); }

function draw() {
  updateCanvasSize();

  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const G = geometry();
  layoutTree(G);

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(G.narrow ? 18 : 22);
  text('Robot Decomposition Tree', G.treeW / 2, 8);

  if (isComplete()) drawGlow();
  if (!root.split) drawGhostChildren(G);
  drawLinks(root);
  for (const n of allNodes()) drawNode(n, G);
  drawStatus(G);

  // control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(16);
  text('Robot goal:', 10, drawHeight + 22);
}

// Wide screens: tree on the left 68%, status panel on the right.
// Narrow screens: tree across the full width, status strip below it.
function geometry() {
  const G = {};
  G.narrow = canvasWidth < 560;
  G.treeW = G.narrow ? canvasWidth : canvasWidth * 0.68;
  G.colW = (G.treeW - 2 * margin) / 3;
  G.labelSize = G.narrow ? 12 : 13;
  G.codeSize = G.narrow ? 11 : 12;
  if (G.narrow) {
    G.panel = { x: 8, y: 382, w: canvasWidth - 16, h: 48 };
  } else {
    G.panel = { x: G.treeW + 4, y: 40, w: canvasWidth - G.treeW - 14, h: drawHeight - 50 };
  }
  return G;
}

// goal at the top, its children in three columns, and grandchildren
// stacked under their parent in the same column
function layoutTree(G) {
  root.w = min(G.treeW * 0.5, 240); root.h = 40;
  root.x = G.treeW / 2; root.y = 62;
  root.children.forEach((c, i) => {
    c.w = G.colW - 12; c.h = 48;
    c.x = margin + G.colW * (i + 0.5);
    c.y = 144;
    c.children.forEach((g, j) => {
      g.w = G.colW - 22; g.h = 38;
      g.x = c.x + 6;
      g.y = c.y + 55 + j * 66;
    });
  });
}

// Before the first split, faint dashed boxes show where smaller tasks will grow
function drawGhostChildren(G) {
  drawingContext.setLineDash([5, 5]);
  for (let i = 0; i < 3; i++) {
    const x = margin + G.colW * (i + 0.5), w = G.colW - 12;
    stroke('lightsteelblue'); strokeWeight(1.5); noFill();
    line(root.x, root.y + root.h / 2, x, 120);
    rect(x - w / 2, 120, w, 48, 8);
    noStroke(); fill('lightsteelblue');
    textAlign(CENTER, CENTER); textSize(24);
    text('?', x, 144);
  }
  drawingContext.setLineDash([]);
  noStroke(); fill('slategray'); textSize(14); textAlign(CENTER, TOP);
  text('Smaller tasks will grow here when you split the goal.', 15, 184, G.treeW - 30, 40);
}

function drawGlow() {
  // soft pulsing glow behind every node when the goal is fully decomposed
  const a = mouseInside ? 70 + 50 * sin(frameCount * 0.08) : 90;
  noFill(); stroke(67, 160, 71, a); strokeWeight(10);
  for (const n of allNodes()) rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, 10);
}

function drawLinks(n) {
  stroke('slategray'); strokeWeight(1.5); noFill();
  for (const c of n.children) {
    if (n.depth === 0) {
      // goal to each column
      line(n.x, n.y + n.h / 2, c.x, c.y - c.h / 2);
    } else {
      // elbow line down the left side of the column
      const ex = n.x - n.w / 2 + 6;
      line(ex, n.y + n.h / 2, ex, c.y);
      line(ex, c.y, c.x - c.w / 2, c.y);
    }
    drawLinks(c);
  }
}

function drawNode(n, G) {
  const isSel = n === selected;
  let fillColor = BIG_COLOR;
  if (n.small) fillColor = SMALL_COLOR;
  else if (n.split) fillColor = 'white';

  stroke(isSel ? SELECT_COLOR : (n.split ? 'navy' : 'slategray'));
  strokeWeight(isSel ? 4 : 1.5);
  fill(fillColor);
  rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, 8);

  noStroke(); fill('black');
  textAlign(CENTER, CENTER);
  textSize(n.depth === 0 ? (G.narrow ? 15 : 17) : G.labelSize);
  textStyle(n.depth === 0 ? BOLD : NORMAL);
  text(n.label, n.x - n.w / 2 + 6, n.y - n.h / 2 + 2, n.w - 12, n.h - 4);
  textStyle(NORMAL);

  if (n.small) {
    // check-mark badge on the top-right corner
    const cx = n.x + n.w / 2 - 4, cy = n.y - n.h / 2 + 4;
    stroke('green'); strokeWeight(1.5); fill('white');
    circle(cx, cy, 18);
    strokeWeight(3); noFill();
    line(cx - 5, cy, cx - 1, cy + 4);
    line(cx - 1, cy + 4, cx + 5, cy - 5);
    drawCodeBubble(n, G);
  }
}

// one-line MicroPython idea under a green node
function drawCodeBubble(n, G) {
  textFont('monospace'); textSize(G.codeSize);
  const tw = textWidth(n.bank.code) + 10;
  const bx = n.x - tw / 2, by = n.y + n.h / 2 + 5;
  stroke('darkgray'); strokeWeight(1); fill('ivory');
  rect(bx, by, tw, 17, 5);
  noStroke(); fill('ivory');
  triangle(n.x - 5, by + 1, n.x + 5, by + 1, n.x, by - 4);
  stroke('darkgray');
  line(n.x - 5, by, n.x, by - 4); line(n.x, by - 4, n.x + 5, by);
  noStroke(); fill('darkslateblue');
  textAlign(CENTER, CENTER);
  text(n.bank.code, n.x, by + 9);
  textFont('sans-serif');
}

function drawStatus(G) {
  const P = G.panel;
  const ready = readyCount();
  const total = leaves().length;
  const counter = (ready === 0 && total <= 1) ? '0 pieces ready' : ready + ' of ' + total + ' pieces ready';

  stroke('silver'); strokeWeight(1); fill('white');
  rect(P.x, P.y, P.w, P.h, 8);
  noStroke();

  if (G.narrow) {
    // compact two-line strip under the tree
    fill('black'); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
    text(counter, P.x + 8, P.y + 5);
    textStyle(NORMAL); fill(messageColor); textSize(12);
    text(message, P.x + 8, P.y + 22, P.w - 16, 24);
    return;
  }

  const x = P.x + 10, w = P.w - 20;
  let y = P.y + 10;
  fill('black'); textAlign(LEFT, TOP);
  textSize(16); textStyle(BOLD);
  text('Status', x, y); y += 26;
  textStyle(NORMAL); textSize(14); fill('dimgray');
  text('Goal: ' + root.label, x, y, w, 40); y += 40;

  fill(ready > 0 && ready === total ? 'darkgreen' : 'black');
  textSize(18); textStyle(BOLD);
  text(counter, x, y, w, 50); y += 50;
  textStyle(NORMAL);

  textSize(14); fill('black');
  text('Selected:', x, y); y += 19;
  fill(selected ? SELECT_COLOR : 'gray');
  text(selected ? selected.label : '(click a box)', x, y, w, 40); y += 44;

  fill(messageColor); textSize(14); textStyle(BOLD);
  text(message, x, y, w, 80);
  textStyle(NORMAL);

  // legend at the bottom of the panel
  let ly = P.y + P.h - 74;
  textSize(13);
  legendRow(x, ly, BIG_COLOR, 'slategray', 1.5, 'Not checked yet'); ly += 24;
  legendRow(x, ly, SMALL_COLOR, 'slategray', 1.5, 'Small enough to code'); ly += 24;
  legendRow(x, ly, 'white', SELECT_COLOR, 3, 'Selected');
}

function legendRow(x, y, fc, sc, sw, label) {
  stroke(sc); strokeWeight(sw); fill(fc);
  rect(x, y, 26, 16, 4);
  noStroke(); fill('black'); textAlign(LEFT, CENTER);
  text(label, x + 34, y + 8);
  textAlign(LEFT, TOP);
}

// click a tree box to select it (the buttons then act on it)
function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const n of allNodes()) {
    if (abs(mouseX - n.x) < n.w / 2 && abs(mouseY - n.y) < n.h / 2) {
      selected = n;
      if (n.small) say('Already small. Time to code it!', 'darkgreen');
      else if (n.split) say('Already split. Pick one of its smaller tasks.', 'black');
      else say('Selected. Split it, or check if it is small enough to code.', 'black');
      updateButtons();
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
  if (typeof goalSelect !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
