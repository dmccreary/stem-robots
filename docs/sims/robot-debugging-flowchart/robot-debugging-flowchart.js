// Robot Debugging Flowchart
// CANVAS_HEIGHT: 540
// Bloom L3 (Apply): follow a yes/no debugging path to decide whether a robot
// problem comes from hardware or code, and choose ONE thing to change.
// Step-through design: the learner answers the orange question with the Yes
// and No buttons; the path taken turns gray with check marks and a thick navy
// flow line, and the "What I have learned" log records every answer.

let canvasWidth = 700;
let drawHeight = 445;
let controlHeight = 95;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let symptomSelect, yesButton, noButton, restartButton;
let mouseInside = false;
let lastWidth = 0;

// colors from the specification
const QUESTION_COLOR = '#fff59d';
const ACTION_COLOR = '#bbdefb';
const FIX_COLOR = '#a5d6a7';
const CURRENT_COLOR = '#e65100';
const PATH_COLOR = '#1a237e';

// Each symptom is a "spine" of questions. For every question, one answer
// continues down the spine and the other answer goes right to a result box.
// col 0 = spine (left), col 1 = result column (right). row = vertical slot.
const TREES = {
  'Nothing happens when I power on': {
    start: 'q1',
    nodes: {
      q1: { type: 'q', col: 0, row: 0, text: 'Is the green power LED on?', log: 'Power LED on', yes: 'q2', no: 'f1' },
      f1: { type: 'fix', col: 1, row: 0, tag: 'Hardware', text: 'Check the power switch and the battery holder plug' },
      q2: { type: 'q', col: 0, row: 1, text: 'Are the batteries fresh?', log: 'Batteries fresh', yes: 'q3', no: 'f2' },
      f2: { type: 'fix', col: 1, row: 1, tag: 'Hardware', text: 'Put in four fresh AA batteries' },
      q3: { type: 'q', col: 0, row: 2, text: 'Was the program saved as main.py on the board?', log: 'Saved as main.py', yes: 'a1', no: 'f3' },
      f3: { type: 'fix', col: 1, row: 2, tag: 'Code', text: 'Save your program to the board as main.py' },
      a1: { type: 'action', col: 0, row: 3, tag: 'Code', text: 'Add a print statement at the top of main.py to see if it starts' }
    }
  },
  'Error message in Thonny': {
    start: 'q1',
    nodes: {
      q1: { type: 'q', col: 0, row: 0, text: 'Did you read the error word by word?', log: 'Error read word by word', yes: 'q2', no: 'a1' },
      a1: { type: 'action', col: 1, row: 0, text: 'Read it now, word by word', next: 'q2' },
      q2: { type: 'q', col: 0, row: 1, text: 'Does it say SyntaxError?', log: 'Says SyntaxError', yes: 'f1', no: 'f2' },
      f1: { type: 'fix', col: 1, row: 1, tag: 'Code', text: 'Check colons, quotes, and indentation on the named line' },
      f2: { type: 'fix', col: 0, row: 2, tag: 'Code', text: 'It is a logic or name error. Print your variables.' }
    }
  },
  'Robot spins instead of going straight': {
    start: 'q1',
    nodes: {
      q1: { type: 'q', col: 0, row: 0, text: 'Did it work before your last change?', log: 'Worked before last change', yes: 'a1', no: 'q2' },
      a1: { type: 'action', col: 1, row: 0, tag: 'Code', text: 'Undo the last change and test again' },
      q2: { type: 'q', col: 0, row: 1, text: 'Is either motor wire loose in M1 or M2?', log: 'Motor wire loose', yes: 'f1', no: 'q3' },
      f1: { type: 'fix', col: 1, row: 1, tag: 'Hardware', text: 'Reseat the wires and tighten the screws' },
      q3: { type: 'q', col: 0, row: 2, text: 'Are both motors given the same speed in code?', log: 'Same speed in code', yes: 'a2', no: 'f2' },
      f2: { type: 'fix', col: 1, row: 2, tag: 'Code', text: 'Set both motor speeds to the same value' },
      a2: { type: 'action', col: 0, row: 3, tag: 'Code', text: 'Add a print statement for each speed' }
    }
  },
  'Robot runs but does the wrong thing': {
    start: 'q1',
    nodes: {
      q1: { type: 'q', col: 0, row: 0, text: 'Did it work before your last change?', log: 'Worked before last change', yes: 'a1', no: 'q2' },
      a1: { type: 'action', col: 1, row: 0, tag: 'Code', text: 'Undo the last change and test again' },
      q2: { type: 'q', col: 0, row: 1, text: 'Does it do the same wrong thing every time?', log: 'Same wrong thing every time', yes: 'q3', no: 'f1' },
      f1: { type: 'fix', col: 1, row: 1, tag: 'Hardware', text: 'Check for loose wires and weak batteries' },
      q3: { type: 'q', col: 0, row: 2, text: 'Did you print the values your code uses?', log: 'Printed the values', yes: 'f2', no: 'a2' },
      f2: { type: 'fix', col: 1, row: 2, tag: 'Code', text: 'Fix the first line where a value looks wrong' },
      a2: { type: 'action', col: 0, row: 3, tag: 'Code', text: 'Add a print statement before each decision' }
    }
  }
};

// learner state
let tree;          // the selected symptom's tree
let current;       // id of the current node
let pathIds = [];  // ids of nodes visited so far, in order (includes current)
let answers = [];  // strings for the log, e.g. "Power LED on: yes"

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  mainEl.addEventListener('mouseenter', () => mouseInside = true);
  mainEl.addEventListener('mouseleave', () => mouseInside = false);
  textSize(defaultTextSize);

  // Row 1: symptom dropdown
  symptomSelect = createSelect();
  symptomSelect.parent(mainEl);
  for (const name of Object.keys(TREES)) symptomSelect.option(name);
  symptomSelect.selected('Nothing happens when I power on');
  symptomSelect.style('font-size', '15px');
  symptomSelect.changed(restart);

  // Row 2: answer buttons (at least 44 px tall so they are easy to tap) and Restart
  yesButton = createButton('Yes');
  yesButton.parent(mainEl);
  styleBigButton(yesButton, 70);
  yesButton.mousePressed(() => answer(true));

  noButton = createButton('No');
  noButton.parent(mainEl);
  styleBigButton(noButton, 70);
  noButton.mousePressed(() => answer(false));

  restartButton = createButton('Restart');
  restartButton.parent(mainEl);
  styleBigButton(restartButton, 90);
  restartButton.mousePressed(restart);

  restart();
  positionControls();
  describe('A debugging flowchart for a robot. Yellow diamonds ask yes or no questions, blue boxes are actions and green boxes are fixes, each tagged Hardware or Code. Pick a symptom from the dropdown, answer the orange-outlined question with the Yes and No buttons, and follow the navy path to one thing to change. A log at the bottom records every answer.', LABEL);
}

function styleBigButton(btn, w) {
  btn.style('font-size', '16px');
  btn.style('min-height', '44px');
  btn.style('min-width', w + 'px');
}

function positionControls() {
  symptomSelect.position(95, drawHeight + 9);
  yesButton.position(10, drawHeight + 44);
  noButton.position(90, drawHeight + 44);
  restartButton.position(canvasWidth - 100, drawHeight + 44);
}

// start over on the first question of the selected symptom
function restart() {
  tree = TREES[symptomSelect.value()];
  current = tree.start;
  pathIds = [current];
  answers = [];
  updateButtons();
}

// move along the Yes or No branch of the current question,
// or continue from an action box that leads back to the spine
function answer(isYes) {
  const node = tree.nodes[current];
  if (node.type === 'q') {
    answers.push(node.log + ': ' + (isYes ? 'yes' : 'no'));
    current = isYes ? node.yes : node.no;
  } else if (node.next) {
    answers.push(node.text + ': done');
    current = node.next;
  } else {
    return; // end of the path
  }
  pathIds.push(current);
  updateButtons();
}

function isFinished() {
  const node = tree.nodes[current];
  return node.type !== 'q' && !node.next;
}

// Yes/No for questions, one "Done, next" button for a step that continues,
// and no answer buttons at the end of a path
function updateButtons() {
  const node = tree.nodes[current];
  if (node.type === 'q') {
    yesButton.html('Yes'); yesButton.show(); noButton.show();
  } else if (node.next) {
    yesButton.html('Done, next'); yesButton.show(); noButton.hide();
  } else {
    yesButton.hide(); noButton.hide();
  }
}

function draw() {
  updateCanvasSize();

  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(canvasWidth < 500 ? 18 : 22);
  text('Robot Debugging Flowchart', canvasWidth / 2, 8);

  const G = geometry();
  drawEdges(G);
  for (const id of Object.keys(tree.nodes)) drawNode(G, id);
  drawLog(G);

  // control labels and hints
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(16);
  text('Symptom:', 10, drawHeight + 21);
  textSize(15); fill('dimgray');
  const hintX = yesButton.elt.style.display === 'none' ? 10 : (noButton.elt.style.display === 'none' ? 140 : 170);
  const hint = isFinished() ? 'Path finished. Pick another symptom or press Restart.'
    : (tree.nodes[current].type === 'q' ? 'Answer the orange question.' : 'Do this step, then continue.');
  if (hintX + textWidth(hint) < canvasWidth - 110) text(hint, hintX, drawHeight + 66);
}

// Layout sizes that depend on the canvas width
function geometry() {
  const G = {};
  G.small = canvasWidth < 560;
  G.dW = min(canvasWidth * 0.40, 280);      // diamond width
  G.dH = 70;                                // diamond height
  G.bW = min(canvasWidth * 0.40, 280);      // result box width
  G.bH = 56;                                // result box height
  G.spineX = max(G.dW / 2 + 12, canvasWidth * 0.26);
  G.rightX = canvasWidth - margin - G.bW / 2;
  G.top = 76;                               // center of row 0
  G.rowH = 90;
  G.logY = 381; G.logH = 60;
  G.textSize = G.small ? 12 : 14;
  return G;
}

function nodePos(G, node) {
  return {
    x: node.col === 0 ? G.spineX : G.rightX,
    y: G.top + node.row * G.rowH
  };
}

// True when the learner walked from node a to node b
function onPath(a, b) {
  for (let i = 0; i < pathIds.length - 1; i++) {
    if (pathIds[i] === a && pathIds[i + 1] === b) return true;
  }
  return false;
}

function drawEdges(G) {
  for (const [id, node] of Object.entries(tree.nodes)) {
    const p = nodePos(G, node);
    if (node.type === 'q') {
      drawBranch(G, id, node.yes, 'Yes');
      drawBranch(G, id, node.no, 'No');
    } else if (node.next) {
      // an action box that leads back down to the next question on the spine
      const target = tree.nodes[node.next];
      const t = nodePos(G, target);
      const midY = t.y - G.dH / 2 - 10;
      const used = onPath(id, node.next);
      setEdgeStyle(used);
      noFill();
      line(p.x, p.y + G.bH / 2, p.x, midY);
      line(p.x, midY, t.x + 6, midY);
      arrowHead(t.x + 6, midY, PI, used);
    }
  }
}

// one Yes/No branch from a question to its child (right, or straight down)
function drawBranch(G, fromId, toId, label) {
  const a = tree.nodes[fromId], b = tree.nodes[toId];
  const pa = nodePos(G, a), pb = nodePos(G, b);
  const used = onPath(fromId, toId);
  setEdgeStyle(used);
  noStroke(); fill(used ? PATH_COLOR : 'gray');
  textSize(14); textStyle(BOLD);
  if (b.col === 1) {
    // sideways to the result column
    const x1 = pa.x + G.dW / 2, x2 = pb.x - G.bW / 2 - 2;
    setEdgeStyle(used);
    line(x1, pa.y, x2, pb.y);
    arrowHead(x2, pb.y, 0, used);
    noStroke(); fill(used ? PATH_COLOR : 'gray');
    textAlign(CENTER, BOTTOM);
    text(label, (x1 + x2) / 2, pa.y - 4);
  } else {
    // straight down the spine
    const y1 = pa.y + G.dH / 2;
    const y2 = pb.y - (b.type === 'q' ? G.dH / 2 : G.bH / 2) - 2;
    setEdgeStyle(used);
    line(pa.x, y1, pb.x, y2);
    arrowHead(pb.x, y2, HALF_PI, used);
    noStroke(); fill(used ? PATH_COLOR : 'gray');
    textAlign(RIGHT, CENTER);
    text(label, pa.x - 8, (y1 + y2) / 2);
  }
  textStyle(NORMAL);
}

function setEdgeStyle(used) {
  stroke(used ? PATH_COLOR : 'darkgray');
  strokeWeight(used ? 4 : 1.5);
}

function arrowHead(x, y, angle, used) {
  push();
  translate(x, y); rotate(angle);
  noStroke(); fill(used ? PATH_COLOR : 'darkgray');
  const s = used ? 9 : 7;
  triangle(0, 0, -s, -s * 0.6, -s, s * 0.6);
  pop();
}

function drawNode(G, id) {
  const node = tree.nodes[id];
  const p = nodePos(G, node);
  const isCurrent = id === current;
  const visited = pathIds.includes(id) && !isCurrent;
  const ahead = !pathIds.includes(id);

  // fill: normal color, gray when visited, faded when not reached yet
  let base = node.type === 'q' ? QUESTION_COLOR : (node.type === 'fix' ? FIX_COLOR : ACTION_COLOR);
  let c = color(base);
  if (visited) c = color('gainsboro');
  if (ahead) c.setAlpha(110);

  // outline: orange and gently pulsing on the current node
  if (isCurrent) {
    const pulse = mouseInside ? 1.5 * sin(frameCount * 0.12) : 0;
    stroke(CURRENT_COLOR); strokeWeight(4 + pulse);
  } else {
    stroke(ahead ? 'silver' : 'gray'); strokeWeight(1.5);
  }
  fill(c);

  let w, h;
  if (node.type === 'q') {
    w = G.dW; h = G.dH;
    quad(p.x, p.y - h / 2, p.x + w / 2, p.y, p.x, p.y + h / 2, p.x - w / 2, p.y);
  } else {
    w = G.bW; h = G.bH;
    rect(p.x - w / 2, p.y - h / 2, w, h, 8);
  }

  // node text
  noStroke();
  fill(ahead ? 'gray' : 'black');
  textSize(G.textSize); textAlign(CENTER, CENTER);
  const tw = node.type === 'q' ? w * 0.64 : w - 16;
  text(node.text, p.x - tw / 2, p.y - h / 2 + 2, tw, h - 4);

  // Hardware / Code tag above result boxes
  if (node.tag) drawTag(p.x - w / 2 + 8, p.y - h / 2 - 9, node.tag, ahead);

  // small check-mark badge on visited nodes: at the left tip of a diamond,
  // or on the top-right corner of a box, so it never covers the node text
  if (visited) {
    const cx = node.type === 'q' ? p.x - w / 2 : p.x + w / 2 - 6;
    const cy = node.type === 'q' ? p.y : p.y - h / 2 + 2;
    stroke('green'); strokeWeight(1.5); fill('white');
    circle(cx, cy, 20);
    strokeWeight(3); noFill();
    line(cx - 5, cy, cx - 1, cy + 4);
    line(cx - 1, cy + 4, cx + 5, cy - 5);
  }
}

function drawTag(x, y, tag, faded) {
  textSize(11); textStyle(BOLD);
  const label = tag.toUpperCase();
  const tw = textWidth(label) + 10;
  noStroke();
  const c = color(tag === 'Hardware' ? 'saddlebrown' : 'darkslateblue');
  if (faded) c.setAlpha(110);
  fill(c);
  rect(x, y - 8, tw, 16, 8);
  fill('white');
  textAlign(CENTER, CENTER);
  text(label, x + tw / 2, y);
  textStyle(NORMAL);
}

// "What I have learned" log strip with Sparky's reminder at the end
function drawLog(G) {
  const x = 10, y = G.logY, w = canvasWidth - 20, h = G.logH;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, y, w, h, 8);

  const ts = G.small ? 12 : 14;
  noStroke(); fill('black');
  textAlign(LEFT, TOP); textSize(ts); textStyle(BOLD);
  const head = 'What I have learned: ';
  text(head, x + 10, y + 6);
  const headW = textWidth(head);
  textStyle(NORMAL);

  // the trail starts after the heading and wraps onto a second line if needed
  const trail = answers.length ? answers.join('  >  ') : 'Answer the first question to start your trail.';
  fill(answers.length ? 'black' : 'gray');
  const firstLen = fitPrefix(trail, w - 20 - headW);
  text(trail.slice(0, firstLen), x + 10 + headW, y + 6);
  const rest = trail.slice(firstLen).trim();
  if (rest.length) text(rest, x + 10, y + 23);

  if (isFinished()) {
    fill('darkgreen'); textStyle(BOLD); textSize(ts);
    text('Sparky says: Change only that one thing, then test again.', x + 10, y + 40);
    textStyle(NORMAL);
  }
}

// number of characters of s that fit in width w, breaking at a space
function fitPrefix(s, w) {
  let best = 0;
  for (let i = 1; i <= s.length; i++) {
    if (s[i] === ' ' || i === s.length) {
      if (textWidth(s.slice(0, i)) <= w) best = i; else break;
    }
  }
  return best;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof symptomSelect !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
