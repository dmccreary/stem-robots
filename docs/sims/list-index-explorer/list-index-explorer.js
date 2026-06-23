// List Index Explorer
// CANVAS_HEIGHT: 300
// Bloom L3 (Apply): access list items by positive and negative index.
// Drag the slider, click a box, or press Iterate to step through the list.

let canvasWidth = 700;
let drawHeight = 230;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

const values = ['red', 'green', 'blue', 'orange', 'purple'];
const boxFills = ['#e53935', '#43a047', '#1e88e5', '#fb8c00', '#8e24aa'];

let indexSlider, iterateButton;
let index = 0;            // -5..4
let iterating = false;
let lastStep = 0;

let boxRects = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  indexSlider = createSlider(-5, 4, 0, 1);
  indexSlider.parent(document.querySelector('main'));
  indexSlider.input(() => { index = indexSlider.value(); iterating = false; });

  iterateButton = createButton('Iterate');
  iterateButton.parent(document.querySelector('main'));
  iterateButton.mousePressed(startIterate);

  positionControls();
  describe('Five colored boxes holding the values red, green, blue, orange and purple. Positive indices 0 to 4 appear above each box and negative indices -5 to -1 below. A slider, clicks, and an Iterate button select a box and show the matching Python indexing expression.', LABEL);
}

let sliderLeftMargin = 230;
function positionControls() {
  iterateButton.position(10, drawHeight + 14);
  indexSlider.position(sliderLeftMargin, drawHeight + 16);
  indexSlider.size(max(120, canvasWidth - sliderLeftMargin - margin));
}

function startIterate() {
  iterating = true;
  index = 0;
  indexSlider.value(0);
  lastStep = millis();
}

function selectedBox() {
  return index >= 0 ? index : index + 5;
}

function draw() {
  updateCanvasSize();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('List Index Explorer', canvasWidth / 2, 10);

  // iterate stepping
  if (iterating && millis() - lastStep > 500) {
    index++;
    if (index > 4) { index = 4; iterating = false; }
    indexSlider.value(index);
    lastStep = millis();
  }

  drawBoxes();
  drawExpression();
  drawControlLabels();

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawBoxes() {
  const sel = selectedBox();
  const totalW = canvasWidth - 2 * margin;
  const gap = 14;
  const bw = (totalW - gap * 4) / 5;
  const bh = 80;
  const top = 90;
  boxRects = [];
  for (let i = 0; i < 5; i++) {
    const x = margin + i * (bw + gap);
    boxRects.push({ x: x, y: top, w: bw, h: bh });

    // positive index above
    noStroke(); fill('#555'); textSize(15); textAlign(CENTER, BOTTOM);
    text(i, x + bw / 2, top - 8);
    // negative index below
    fill('#9e9e9e'); textAlign(CENTER, TOP);
    text(i - 5, x + bw / 2, top + bh + 6);

    // box
    if (i === sel) {
      stroke('#fdd835'); strokeWeight(5);
      drawingContext.shadowBlur = 18; drawingContext.shadowColor = '#fdd835';
    } else { stroke('#333'); strokeWeight(1.5); }
    fill(boxFills[i]);
    rect(x, top, bw, bh, 8);
    drawingContext.shadowBlur = 0;

    noStroke(); fill('white'); textSize(16); textAlign(CENTER, CENTER);
    text("'" + values[i] + "'", x + bw / 2, top + bh / 2);
  }
}

function drawExpression() {
  const sel = selectedBox();
  noStroke(); fill('#102a43');
  const bw = 320, bx = canvasWidth / 2 - bw / 2, by = drawHeight - 42;
  rect(bx, by, bw, 30, 6);
  fill('white'); textSize(17); textAlign(CENTER, CENTER);
  text("colors[" + index + "]  =  '" + values[sel] + "'", canvasWidth / 2, by + 15);
}

function drawControlLabels() {
  noStroke(); fill('black'); textSize(14); textAlign(LEFT, CENTER);
  text('Index: ' + index, 120, drawHeight + 25);
}

function mousePressed() {
  for (let i = 0; i < boxRects.length; i++) {
    const r = boxRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      iterating = false;
      index = i;                 // clicking shows the positive index
      indexSlider.value(i);
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
