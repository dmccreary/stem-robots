// Robot Loop Pattern Explorer
// CANVAS_HEIGHT: 600
// Bloom L3 (Apply) - Predict: the student predicts how many times a loop body
// runs, then steps through a for loop, a while loop, and a nested loop that
// make a robot blink its NeoPixels or drive toward a wall.

let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 330;
let defaultTextSize = 16;

// controls
let forTab, whileTab, nestedTab, stepButton, runButton, resetButton, speedSlider;
let rangeInput, startInput, stepSizeInput, forgetCheckbox, outerInput, innerInput;

// which loop is shown: 'for', 'while', or 'nested'
let mode = 'for';

// shared run state
let iterations = 0;       // how many times the loop body has run
let done = false;         // loop has finished
let running = false;      // auto-play is on
let lastStepMs = 0;
let squares = [];         // one colored square per finished iteration
let output = [];          // printed lines
let highlight = [];       // code lines to highlight
let badges = {};          // line index -> variable badge text
let litPixel = -1;        // -1 none, 0 or 1 one pixel, 2 both pixels
let litColor = 'dodgerblue';
let message = '';

// for loop settings
let n = 5;
// while loop settings
let startDist = 100, stepSize = 5, distance = 100, forget = false, infinite = false;
// nested loop settings
let outerN = 3, innerN = 4, ci = 0, bi = 0;

const COLOR_NAMES = ['red', 'green', 'blue', 'yellow', 'purple'];
const COLOR_FILLS = ['red', 'limegreen', 'dodgerblue', 'gold', 'mediumorchid'];
const WALL_LIMIT = 20;    // the while condition is distance_cm > 20

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  const main = document.querySelector('main');

  // Row 1: loop tabs
  forTab = createButton('for loop');
  forTab.parent(main);
  forTab.mousePressed(() => setMode('for'));
  whileTab = createButton('while loop');
  whileTab.parent(main);
  whileTab.mousePressed(() => setMode('while'));
  nestedTab = createButton('nested loops');
  nestedTab.parent(main);
  nestedTab.mousePressed(() => setMode('nested'));

  // Row 2: Step / Run / Reset and speed
  stepButton = createButton('Step');
  stepButton.parent(main);
  stepButton.mousePressed(() => { running = false; runButton.html('Run'); doStep(); });
  runButton = createButton('Run');
  runButton.parent(main);
  runButton.mousePressed(toggleRun);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);
  speedSlider = createSlider(1, 10, 2, 1);
  speedSlider.parent(main);

  // Row 3: settings for each loop type
  rangeInput = makeNumberInput(5, 1, 8, 1);
  startInput = makeNumberInput(100, 40, 120, 10);
  stepSizeInput = makeNumberInput(5, 5, 20, 5);
  forgetCheckbox = createCheckbox(' Forget to update distance_cm', false);
  forgetCheckbox.parent(main);
  forgetCheckbox.changed(resetSim);
  outerInput = makeNumberInput(3, 1, 5, 1);
  innerInput = makeNumberInput(4, 1, 6, 1);

  positionControls();
  setMode('for');

  describe('A loop explorer with three tabs: for loop, while loop, and nested loops. The left panel shows MicroPython code with the running line highlighted and the loop variable in an orange badge. The right panel shows a top-down robot whose NeoPixels blink, or which drives toward a wall in the while tab. A counter at the bottom shows how many times the loop body has run.', LABEL);
}

function makeNumberInput(value, lo, hi, stp) {
  const inp = createInput(String(value), 'number');
  inp.parent(document.querySelector('main'));
  inp.attribute('min', lo);
  inp.attribute('max', hi);
  inp.attribute('step', stp);
  inp.size(52);
  inp.input(resetSim);
  // on commit, snap the box back into its allowed range
  inp.changed(() => { readSettings(true); resetSim(); });
  return inp;
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 45, y3 = drawHeight + 84;
  forTab.position(10, y1);
  whileTab.position(92, y1);
  nestedTab.position(186, y1);
  stepButton.position(10, y2);
  runButton.position(66, y2);
  resetButton.position(124, y2);
  speedSlider.position(sliderLeftMargin, y2 + 2);
  speedSlider.size(max(60, canvasWidth - sliderLeftMargin - 20));
  // row 3 positions depend on the label widths drawn in drawControlLabels()
  rangeInput.position(88, y3);
  startInput.position(96, y3);
  stepSizeInput.position(244, y3);
  forgetCheckbox.position(316, y3 + 2);
  outerInput.position(62, y3);
  innerInput.position(186, y3);
}

// Read the number boxes and keep every value inside its range.
function snap(inp, fallback, lo, hi, stp) {
  let v = parseInt(inp.value());
  if (isNaN(v)) v = fallback;
  v = constrain(round(v / stp) * stp, lo, hi);
  return v;
}

function readSettings(writeBack) {
  n = snap(rangeInput, 5, 1, 8, 1);
  startDist = snap(startInput, 100, 40, 120, 10);
  stepSize = snap(stepSizeInput, 5, 5, 20, 5);
  outerN = snap(outerInput, 3, 1, 5, 1);
  innerN = snap(innerInput, 4, 1, 6, 1);
  forget = forgetCheckbox.checked();
  if (writeBack) {
    rangeInput.value(n);
    startInput.value(startDist);
    stepSizeInput.value(stepSize);
    outerInput.value(outerN);
    innerInput.value(innerN);
  }
}

function setMode(m) {
  mode = m;
  const tabs = { for: forTab, while: whileTab, nested: nestedTab };
  for (const k in tabs) {
    tabs[k].style('background-color', k === mode ? 'steelblue' : 'whitesmoke');
    tabs[k].style('color', k === mode ? 'white' : 'black');
    tabs[k].style('font-weight', k === mode ? 'bold' : 'normal');
  }
  // only show the settings that belong to this loop
  mode === 'for' ? rangeInput.show() : rangeInput.hide();
  const w = mode === 'while';
  w ? startInput.show() : startInput.hide();
  w ? stepSizeInput.show() : stepSizeInput.hide();
  w ? forgetCheckbox.show() : forgetCheckbox.hide();
  const nst = mode === 'nested';
  nst ? outerInput.show() : outerInput.hide();
  nst ? innerInput.show() : innerInput.hide();
  resetSim();
}

function resetSim() {
  readSettings(false);
  iterations = 0;
  done = false;
  running = false;
  if (runButton) runButton.html('Run');
  squares = [];
  output = [];
  highlight = [];
  badges = {};
  litPixel = -1;
  distance = startDist;
  infinite = false;
  ci = 0;
  bi = 0;
  message = 'Predict how many times the loop body will run. Then press Step or Run.';
}

function toggleRun() {
  if (done) resetSim();
  running = !running;
  runButton.html(running ? 'Pause' : 'Run');
  lastStepMs = millis();
}

// Run exactly one iteration of the active loop (or the final exit check).
function doStep() {
  if (done) return;
  if (mode === 'for') stepFor();
  else if (mode === 'while') stepWhile();
  else stepNested();
  if (done) { running = false; runButton.html('Run'); }
}

function stepFor() {
  if (iterations < n) {
    const i = iterations;
    output.push('Blink number: ' + i);
    litPixel = i % 2;
    litColor = 'dodgerblue';
    iterations++;
    squares.push('steelblue');
    highlight = [1, 2];
    badges = { 0: 'i = ' + i };
    message = 'Iteration ' + iterations + ' ran with i = ' + i + ', so pixel ' + (i % 2) + ' blinks.';
  } else {
    done = true;
    litPixel = -1;
    output.push('Done!');
    highlight = [3];
    message = 'range(' + n + ') has no values left, so the loop ends after ' + n + ' iterations.';
  }
}

function stepWhile() {
  if (distance > WALL_LIMIT) {
    output.push('Moving forward. Distance: ' + distance);
    const before = distance;
    if (!forget) distance -= stepSize;
    iterations++;
    squares.push('steelblue');
    highlight = [2, 3];
    litPixel = 2;
    litColor = 'limegreen';
    badges = { 1: 'distance_cm = ' + distance };
    message = before + ' > 20 is True, so the body ran. ' +
      (forget ? 'distance_cm did not change!' : 'distance_cm is now ' + distance + '.');
    if (forget && iterations >= 30) {
      done = true;
      infinite = true;
      message = 'The condition never became False. This loop would run forever.';
    }
  } else {
    done = true;
    output.push('Close to the wall. Stop!');
    highlight = [4];
    litPixel = 2;
    litColor = 'red';
    badges = { 1: 'distance_cm = ' + distance };
    message = distance + ' > 20 is False, so the loop ends after ' + iterations + ' iterations.';
  }
}

function stepNested() {
  if (ci < outerN) {
    output.push('flash ' + COLOR_NAMES[ci] + ': blink ' + bi);
    litPixel = bi % 2;
    litColor = COLOR_FILLS[ci];
    badges = { 0: 'color_index = ' + ci, 1: 'blink = ' + bi };
    highlight = [2];
    iterations++;
    squares.push('teal');
    message = 'Inner loop: blink ' + bi + ' of color ' + ci + ' (' + COLOR_NAMES[ci] + ').';
    bi++;
    if (bi >= innerN) {
      bi = 0;
      squares.push('steelblue');
      message += ' The inner loop is done, so the outer loop moves on.';
      ci++;
    }
  } else {
    done = true;
    litPixel = -1;
    output.push('Done!');
    highlight = [3];
    message = 'Outer loop finished: ' + outerN + ' x ' + innerN + ' = ' + (outerN * innerN) + ' flashes.';
  }
}

// The code listing for the active loop
function codeLines() {
  if (mode === 'for') {
    return [
      'for i in range(' + n + '):',
      '    print("Blink number:", i)',
      '    blink_pixel(i % 2)',
      'print("Done!")'
    ];
  }
  if (mode === 'while') {
    return [
      'distance_cm = ' + startDist,
      'while distance_cm > 20:',
      '    print("Moving forward. Distance:", distance_cm)',
      forget ? '    # forgot: distance_cm -= ' + stepSize : '    distance_cm -= ' + stepSize,
      'print("Close to the wall. Stop!")'
    ];
  }
  return [
    'for color_index in range(' + outerN + '):',
    '    for blink in range(' + innerN + '):',
    '        flash(COLORS[color_index])',
    'print("Done!")'
  ];
}

function draw() {
  updateCanvasSize();

  // auto-play
  if (running && millis() - lastStepMs >= 1000 / speedSlider.value()) {
    lastStepMs = millis();
    doStep();
  }

  // drawing and control regions
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Robot Loop Pattern Explorer', canvasWidth / 2, 8);

  const codeW = floor(canvasWidth * 0.58);
  const panelTop = 42, panelH = 318;
  drawCodePanel(margin, panelTop, codeW - margin, panelH);
  drawRobotPanel(codeW + margin, panelTop, canvasWidth - codeW - 2 * margin, panelH);
  drawCounterStrip(margin, panelTop + panelH + 8, canvasWidth - 2 * margin, drawHeight - panelTop - panelH - 16);
  drawControlLabels();

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

  const lines = codeLines();
  const longest = max(lines.map(s => s.length));
  // shrink the code font so the longest line fits the panel
  const codeSize = constrain(floor((w - 24) / (longest * 0.6)), 9, 15);
  const lineH = codeSize + 12;
  const cx = x + 12;
  let ly = y + 36;

  push();
  // clip to the panel so long lines never spill into the robot panel
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x + 2, y + 2, w - 4, h - 4);
  drawingContext.clip();
  textFont('monospace');
  textSize(codeSize);
  for (let k = 0; k < lines.length; k++) {
    if (highlight.includes(k)) {
      noStroke();
      fill('khaki');
      rect(x + 4, ly - 4, w - 8, lineH, 4);
    }
    noStroke();
    const forgotLine = mode === 'while' && forget && k === 3;
    fill(forgotLine ? 'firebrick' : 'black');
    textAlign(LEFT, TOP);
    text(lines[k], cx, ly);
    // orange badge with the loop variable value
    if (badges[k] !== undefined) {
      const bx = cx + textWidth(lines[k]) + 10;
      push();
      textFont('sans-serif');
      textSize(13);
      const bw = textWidth(badges[k]) + 14;
      noStroke();
      fill('darkorange');
      rect(bx, ly - 2, bw, codeSize + 6, 9);
      fill('white');
      textAlign(LEFT, TOP);
      text(badges[k], bx + 7, ly + (codeSize - 13) / 2 + 2);
      pop();
    }
    ly += lineH;
  }
  drawingContext.restore();
  pop();

  // plain-language explanation of the last step
  const my = y + h - 78;
  stroke('gainsboro');
  line(x + 10, my - 8, x + w - 10, my - 8);
  noStroke();
  fill('midnightblue');
  textSize(15);
  textAlign(LEFT, TOP);
  text(message, x + 12, my, w - 24, 76);
}

function drawRobotPanel(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('dimgray');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Robot (top view)', x + 10, y + 8);

  const sceneTop = y + 30, sceneH = 150;
  const rw = min(120, w * 0.4), rh = rw * 0.75;
  let cx = x + w / 2;
  const cy = sceneTop + sceneH / 2;

  if (mode === 'while') {
    // wall on the right, robot drives toward it
    const wallX = x + w - 22;
    stroke('firebrick');
    strokeWeight(10);
    line(wallX, sceneTop + 5, wallX, sceneTop + sceneH - 5);
    strokeWeight(1);
    const scale = (wallX - 5 - (x + 10 + rw)) / 120;
    const frontX = wallX - 5 - distance * scale;
    cx = frontX - rw / 2;
    // double arrow from the robot front to the wall
    const ay = cy + rh / 2 + 22;
    stroke('black');
    strokeWeight(2);
    line(frontX, ay, wallX - 6, ay);
    noStroke();
    fill('black');
    triangle(frontX, ay, frontX + 8, ay - 5, frontX + 8, ay + 5);
    triangle(wallX - 6, ay, wallX - 14, ay - 5, wallX - 14, ay + 5);
    strokeWeight(1);
    noStroke();
    fill('black');
    textSize(14);
    textAlign(CENTER, TOP);
    const lbl = 'distance_cm = ' + distance;
    const half = textWidth(lbl) / 2 + 8;
    text(lbl, constrain((frontX + wallX) / 2, x + half, wallX - 8 - half), ay + 6);
  }

  drawRobot(cx, cy, rw, rh);

  // mini console with the last printed lines
  const conY = y + h - 92;
  noStroke();
  fill('black');
  rect(x + 8, conY, w - 16, 84, 6);
  fill('lightgreen');
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x + 8, conY, w - 16, 84);
  drawingContext.clip();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  const last = output.slice(-4);
  for (let k = 0; k < last.length; k++) {
    text(last[k], x + 16, conY + 6 + k * 19);
  }
  if (output.length === 0) {
    fill('gray');
    text('>>> (output appears here)', x + 16, conY + 6);
  }
  drawingContext.restore();
  pop();

}

function drawRobot(cx, cy, rw, rh) {
  // wheels on the left and right sides of the robot (it faces right)
  noStroke();
  fill('black');
  rect(cx - rw * 0.3, cy - rh / 2 - 9, rw * 0.45, 10, 3);
  rect(cx - rw * 0.3, cy + rh / 2 - 1, rw * 0.45, 10, 3);
  // body
  fill('dimgray');
  rect(cx - rw / 2, cy - rh / 2, rw, rh, 12);
  // two NeoPixels on the front edge
  const d = rw * 0.2;
  for (let p = 0; p < 2; p++) {
    const px = cx + rw / 2 - d * 0.8;
    const py = cy + (p === 0 ? -rh / 4 : rh / 4);
    const on = litPixel === 2 || litPixel === p;
    stroke('black');
    fill(on ? litColor : 'darkslategray');
    circle(px, py, d);
    noStroke();
    fill('white');
    textSize(11);
    textAlign(CENTER, CENTER);
    text(p, px - d * 1.1, py);
  }
}

function drawCounterStrip(x, y, w, h) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(24);
  textAlign(LEFT, TOP);
  text('Iterations: ' + iterations, x + 12, y + 8);

  // right side: formula (nested) or prompt
  textSize(15);
  textAlign(RIGHT, TOP);
  if (mode === 'nested') {
    fill('teal');
    text('outer x inner = ' + outerN + ' x ' + innerN + ' = ' + (outerN * innerN), x + w - 12, y + 12);
    if (outerN * innerN > 20) {
      fill('firebrick');
      text('Each new nesting level multiplies the work.', x + w - 12, y + 32);
    }
  } else if (infinite) {
    // red banner: the while condition never became False
    const bw = min(w - 200, 400);
    fill('red');
    rect(x + w - bw - 10, y + 8, bw, 34, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    text('Infinite loop! Press Ctrl+C in Thonny to stop.', x + w - bw - 6, y + 8, bw - 8, 34);
  } else if (done) {
    fill('darkgreen');
    text('Loop finished after ' + iterations + ' iterations.', x + w - 12, y + 12);
  }

  // one small square per finished iteration
  let sx = x + 12, sy = y + h - 26;
  const size = 14, gap = 3;
  for (let k = 0; k < squares.length; k++) {
    if (sx + size > x + w - 10) { sx = x + 12; sy -= size + gap; }
    fill(squares[k]);
    rect(sx, sy, size, size, 2);
    sx += size + gap;
  }
}

function drawControlLabels() {
  const y2 = drawHeight + 45, y3 = drawHeight + 84;
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Speed: ' + speedSlider.value() + ' steps/s', 190, y2 + 12);
  if (mode === 'for') {
    text('range(n):', 12, y3 + 12);
  } else if (mode === 'while') {
    text('start (cm):', 12, y3 + 12);
    text('step (cm):', 166, y3 + 12);
  } else {
    text('outer:', 12, y3 + 12);
    text('inner:', 136, y3 + 12);
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
