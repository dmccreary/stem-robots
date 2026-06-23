// Variable Assignment Explorer
// CANVAS_HEIGHT: 350
// Bloom L3 (Apply): assignment stores a value in a named memory location.
// Type a name and value, click Assign, and watch the value travel into a
// memory box. Assignment is NOT saying two things are equal.

let canvasWidth = 700;
let drawHeight = 300;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let nameInput, valueInput, assignButton, resetButton;
let boxes = [];          // {name, value, type, alpha}
let anim = null;         // {name, value, type, t, targetIndex}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nameInput = createInput('speed');
  nameInput.parent(document.querySelector('main'));
  nameInput.attribute('placeholder', 'name');
  nameInput.size(70);

  valueInput = createInput('75');
  valueInput.parent(document.querySelector('main'));
  valueInput.attribute('placeholder', 'value');
  valueInput.size(70);

  assignButton = createButton('Assign');
  assignButton.parent(document.querySelector('main'));
  assignButton.mousePressed(startAssign);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(startReset);

  positionControls();
  describe('Interactive showing variable assignment: a typed name and value travel from an assignment statement into a named memory box. Up to four memory boxes are shown.', LABEL);
}

function positionControls() {
  const y = drawHeight + 13;
  nameInput.position(60, y);
  valueInput.position(190, y);
  assignButton.position(270, y - 1);
  resetButton.position(345, y - 1);
}

function inferType(v) {
  if (v === 'True' || v === 'False') return 'bool';
  if (/^-?\d+$/.test(v)) return 'int';
  if (/^-?\d*\.\d+$/.test(v)) return 'float';
  return 'str';
}

function startAssign() {
  const nm = nameInput.value().trim();
  const vl = valueInput.value().trim();
  if (nm === '' || vl === '') return;
  // reuse a box with the same name, else next free slot, else cycle oldest
  let idx = boxes.findIndex(b => b.name === nm);
  if (idx < 0) {
    if (boxes.length < 4) { boxes.push({ name: nm, value: '', type: '', alpha: 255 }); idx = boxes.length - 1; }
    else idx = 0;
  }
  anim = { name: nm, value: vl, type: inferType(vl), t: 0, targetIndex: idx };
}

function startReset() {
  for (let b of boxes) b.fading = true;
}

function draw() {
  updateCanvasSize();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('Variable Assignment', canvasWidth / 2, 8);

  // labels for control inputs
  fill('#e65100'); textSize(13); textAlign(LEFT, CENTER);
  text('Name:', 10, drawHeight + 22);
  text('=', 175, drawHeight + 22);

  drawStatementBox();
  drawMemoryBoxes();
  updateAnim();
  drawArrow();
  drawHoverTooltip();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function stmtBox() { return { x: margin + 10, y: 70, w: canvasWidth * 0.32, h: 70 }; }
function boxSlot(i) {
  const rightX = canvasWidth * 0.52;
  const w = canvasWidth - rightX - margin - 10;
  const h = 46;
  return { x: rightX, y: 62 + i * (h + 12), w: w, h: h };
}

function drawStatementBox() {
  const s = stmtBox();
  noStroke(); fill('#fff3e0'); stroke('#e65100'); strokeWeight(2);
  rect(s.x, s.y, s.w, s.h, 8);
  noStroke(); fill('#e65100'); textSize(12); textAlign(LEFT, TOP);
  text('Assignment statement', s.x + 10, s.y + 8);
  fill('black'); textSize(20); textAlign(CENTER, CENTER);
  const nm = nameInput.value().trim() || 'name';
  const vl = valueInput.value().trim() || 'value';
  text(nm + ' = ' + vl, s.x + s.w / 2, s.y + s.h / 2 + 6);

  // section heading for memory
  fill('#e65100'); textSize(13); textAlign(LEFT, TOP);
  text('Memory (named boxes)', canvasWidth * 0.52, 44);
}

function drawMemoryBoxes() {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (b.fading) { b.alpha -= 12; }
    const sl = boxSlot(i);
    push();
    drawingContext.globalAlpha = constrain(b.alpha / 255, 0, 1);
    stroke('#0d1b3e'); strokeWeight(2); fill('#1a237e');
    rect(sl.x, sl.y, sl.w, sl.h, 8);
    noStroke();
    // name tag on top-left
    fill('#fdd835'); textSize(13); textAlign(LEFT, CENTER);
    text(b.name, sl.x + 10, sl.y + sl.h / 2);
    // value
    fill('white'); textSize(17); textAlign(RIGHT, CENTER);
    text(b.value === '' ? '—' : b.value, sl.x + sl.w - 70, sl.y + sl.h / 2);
    // type pill
    fill('#90caf9'); textSize(11); textAlign(RIGHT, CENTER);
    text(b.type ? '(' + b.type + ')' : '', sl.x + sl.w - 10, sl.y + sl.h / 2);
    pop();
  }
  // remove fully-faded boxes
  if (boxes.length && boxes.every(b => b.fading && b.alpha <= 0)) boxes = [];
}

function updateAnim() {
  if (!anim) return;
  anim.t += 0.04;
  if (anim.t >= 1) {
    const b = boxes[anim.targetIndex];
    b.name = anim.name; b.value = anim.value; b.type = anim.type; b.alpha = 255; b.fading = false;
    anim = null;
  }
}

function drawArrow() {
  if (!anim) return;
  const s = stmtBox();
  const sl = boxSlot(anim.targetIndex);
  const x1 = s.x + s.w, y1 = s.y + s.h / 2;
  const x2 = sl.x, y2 = sl.y + sl.h / 2;
  const x = lerp(x1, x2, anim.t), y = lerp(y1, y2, anim.t);
  // trail line
  stroke('#fdd835'); strokeWeight(3);
  line(x1, y1, x, y);
  // moving value chip
  noStroke(); fill('#fbc02d');
  rect(x - 24, y - 13, 48, 26, 6);
  fill('black'); textSize(13); textAlign(CENTER, CENTER);
  text(anim.value, x, y);
  // arrowhead
  fill('#fdd835');
  triangle(x, y - 6, x, y + 6, x + 9, y);
}

function drawHoverTooltip() {
  for (let i = 0; i < boxes.length; i++) {
    const sl = boxSlot(i);
    const b = boxes[i];
    if (b.alpha > 10 && mouseX >= sl.x && mouseX <= sl.x + sl.w && mouseY >= sl.y && mouseY <= sl.y + sl.h) {
      const msg = 'Variable: ' + b.name + ' stores ' + (b.value || '—') + ' of type ' + (b.type || '?') + '.';
      const tw = min(260, textWidth(msg) + 20);
      let tx = mouseX + 12, ty = mouseY - 30;
      if (tx + tw > canvasWidth) tx = canvasWidth - tw - 4;
      noStroke(); fill('#102a43'); rect(tx, ty, tw, 40, 6);
      fill('white'); textSize(12); textAlign(LEFT, TOP);
      text(msg, tx + 8, ty + 6, tw - 16, 32);
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
  if (container) { canvasWidth = container.offsetWidth; }
}
