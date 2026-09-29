// IR Reflectance Threshold Explorer
// CANVAS_HEIGHT: 470
// Bloom L3 (Apply - predict): predict whether an active-LOW IR sensor reads 0 or
// 1 for a surface and distance, and set the trimmer threshold so the sensor
// switches at a chosen distance.
// Model: reflected IR = peak * 100 / (1 + (distance / 4)^2), plus 15 in a bright
// room, capped at 100. Output is 0 (detected) when reflected IR >= threshold.

let canvasWidth = 700;
let drawHeight = 355;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 165;
let defaultTextSize = 16;

const SURFACES = {
  White: { peak: 1.0,  fill: 'white',   curve: 'royalblue' },
  Gray:  { peak: 0.55, fill: 'darkgray', curve: 'seagreen' },
  Black: { peak: 0.15, fill: 'black',   curve: 'dimgray' }
};
const MAX_CM = 15;
const AMBIENT = 15;       // extra IR from a bright room

// layout
const SURF_TOP = 244;     // top of the surface in the side view
const PX_PER_CM = 11.5;
const G_TOP = 50, G_BOTTOM = 262;   // graph plot area

// controls
let surfaceButtons = {}, autoButton, brightBox, distSlider, threshSlider;
let surface = 'White';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  for (const name of Object.keys(SURFACES)) {
    const b = createButton(name);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => { surface = name; styleSurfaceButtons(); });
    surfaceButtons[name] = b;
  }
  autoButton = createButton('Auto-calibrate');
  autoButton.parent(document.querySelector('main'));
  autoButton.mousePressed(autoCalibrate);

  brightBox = createCheckbox(' Bright room', false);
  brightBox.parent(document.querySelector('main'));
  brightBox.style('white-space', 'nowrap');

  distSlider = createSlider(0, MAX_CM, 4, 0.5);
  distSlider.parent(document.querySelector('main'));
  threshSlider = createSlider(5, 95, 40, 1);
  threshSlider.parent(document.querySelector('main'));

  styleSurfaceButtons();
  positionControls();

  describe('Left: a side view of an IR sensor module above a white, gray, or black surface, with red rays bouncing back to the detector, and an output box showing 0 for surface detected or 1 for nothing detected. Right: a graph of reflected IR from 0 to 100 against distance from 0 to 15 centimeters, with one curve per surface, an orange threshold line, and a shaded Detected area above the threshold. Controls choose the surface, distance, threshold, and bright room, and an Auto-calibrate button sets the threshold halfway between black and white.', LABEL);
}

function styleSurfaceButtons() {
  for (const [name, b] of Object.entries(surfaceButtons)) {
    b.style('background-color', name === surface ? 'moccasin' : '');
    b.style('font-weight', name === surface ? 'bold' : 'normal');
  }
}

function positionControls() {
  let x = 10;
  const y = drawHeight + 8;
  for (const b of Object.values(surfaceButtons)) {
    b.position(x, y);
    x += b.elt.offsetWidth + 4;
  }
  x += 10;
  autoButton.position(x, y);
  x += autoButton.elt.offsetWidth + 12;
  const span = brightBox.elt.querySelector('span');
  if (span) span.innerHTML = canvasWidth < 440 ? ' Bright' : ' Bright room';
  brightBox.position(x, y + 2);

  const w = canvasWidth - sliderLeftMargin - margin;
  distSlider.position(sliderLeftMargin, drawHeight + 44);   distSlider.size(w);
  threshSlider.position(sliderLeftMargin, drawHeight + 79); threshSlider.size(w);
}

// ---------- the model ----------

function ambient() { return brightBox.checked() ? AMBIENT : 0; }

function reflected(name, d) {
  const ir = SURFACES[name].peak * 100 / (1 + (d / 4) * (d / 4)) + ambient();
  return min(ir, 100);
}

// active LOW: 0 means the sensor sees a surface
function output(name, d) {
  return reflected(name, d) >= threshSlider.value() ? 0 : 1;
}

function autoCalibrate() {
  const d = distSlider.value();
  threshSlider.value(round((reflected('White', d) + reflected('Black', d)) / 2));
}

// the distance where this surface's curve crosses the threshold
function switchDistance(name) {
  const T = threshSlider.value(), amb = ambient();
  const top = min(100, SURFACES[name].peak * 100 + amb);
  if (T <= amb) return 'always';           // even far away the reading is above T
  if (T > top) return 'never';             // even touching, the reading is below T
  return 4 * sqrt(SURFACES[name].peak * 100 / (T - amb) - 1);
}

// ---------- drawing ----------

function leftW() { return max(150, canvasWidth * 0.4); }

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const d = distSlider.value();
  drawGraph(d);
  drawSideView(d);
  drawOutput(d);

  noStroke(); fill('black'); textSize(canvasWidth < 560 ? 18 : 22); textStyle(BOLD); textAlign(LEFT, TOP);
  text('IR Reflectance Threshold Explorer', 10, 8);
  textStyle(NORMAL);

  drawControlLabels(d);
}

function drawSideView(d) {
  const lw = leftW();
  const cx = lw / 2;
  // surface
  stroke('gray'); strokeWeight(1); fill(SURFACES[surface].fill);
  rect(14, SURF_TOP, lw - 28, 16);
  noStroke(); fill(surface === 'Black' ? 'white' : 'black'); textSize(12); textAlign(CENTER, CENTER);
  text(surface + ' surface', cx, SURF_TOP + 8);

  // sensor module: bottom edge sits d cm above the surface
  const by = SURF_TOP - d * PX_PER_CM;
  const ex = cx - 22, dx = cx + 22;             // emitter and detector
  const ir = reflected(surface, d);

  // dotted red rays: down to the surface, then back up to the detector
  const c = color('red'); c.setAlpha(60 + 195 * ir / 100);
  stroke(c); strokeWeight(2);
  drawingContext.setLineDash([3, 4]);
  line(ex, by + 4, cx, SURF_TOP);
  line(cx, SURF_TOP, dx, by + 4);
  drawingContext.setLineDash([]);

  stroke('black'); strokeWeight(1); fill('darkgreen');
  rect(cx - 45, by - 20, 90, 18, 3);            // circuit board
  fill('red'); circle(ex, by - 1, 12);          // IR emitter
  fill('black'); circle(dx, by - 1, 12);        // detector
  // distance dimension on the left (or in the label when there is no room)
  const lx = cx - 60;
  textSize(13);
  const roomy = lx - 7 - textWidth(d.toFixed(1) + ' cm') > 2;
  noStroke(); fill('black'); textSize(12); textAlign(CENTER, BOTTOM);
  text(roomy ? 'IR sensor' : 'IR sensor, ' + d.toFixed(1) + ' cm up', cx, by - 22);
  if (d > 0) {
    stroke('navy'); strokeWeight(1);
    line(lx, by, lx, SURF_TOP);
    line(lx - 4, by, lx + 4, by); line(lx - 4, SURF_TOP, lx + 4, SURF_TOP);
    if (roomy) {
      noStroke(); fill('navy'); textSize(13); textAlign(RIGHT, CENTER);
      text(d.toFixed(1) + ' cm', lx - 5, (by + SURF_TOP) / 2);
    }
  }
}

function drawOutput(d) {
  const lw = leftW();
  const narrow = canvasWidth < 560;
  const out = output(surface, d);
  const x = 10, y = 270, w = lw - 20, h = drawHeight - y - 6;
  stroke(out === 0 ? 'seagreen' : 'crimson'); strokeWeight(2);
  fill(out === 0 ? 'honeydew' : 'mistyrose');
  rect(x, y, w, h, 6);
  noStroke(); textAlign(LEFT, TOP);
  fill(out === 0 ? 'darkgreen' : 'crimson'); textStyle(BOLD); textSize(narrow ? 15 : 18);
  text('Sensor output: ' + out, x + 8, y + 7);
  textStyle(NORMAL); textSize(narrow ? 12 : 14);
  text(out === 0 ? '(surface detected)' : '(nothing detected)', x + 8, y + (narrow ? 27 : 31));
  fill('black'); textFont('monospace'); textSize(canvasWidth < 440 ? 10 : (narrow ? 11 : 13));
  text(narrow ? 'ir_left.value() -> ' + out : 'Reads: ir_left.value() -> ' + out, x + 8, y + (narrow ? 47 : 54));
  textFont('sans-serif');
}

function drawGraph(d) {
  const gx0 = leftW() + 48, gx1 = canvasWidth - 14;
  const X = cm => map(cm, 0, MAX_CM, gx0, gx1);
  const Y = v => map(v, 0, 100, G_BOTTOM, G_TOP);
  const T = threshSlider.value();

  // plot background, then the "Detected" zone above the threshold
  stroke('silver'); strokeWeight(1); fill('white');
  rect(gx0, G_TOP, gx1 - gx0, G_BOTTOM - G_TOP);
  noStroke(); fill('honeydew');
  rect(gx0, G_TOP, gx1 - gx0, Y(T) - G_TOP);
  // zone labels sit on the right, where every curve is low
  const narrow = gx1 - gx0 < 260;
  fill('seagreen'); textSize(13); textStyle(BOLD); textAlign(RIGHT, TOP);
  if (Y(T) - G_TOP > 36) text(narrow ? 'Detected (0)' : 'Detected (output 0)', gx1 - 6, G_TOP + 4);
  fill('crimson');
  if (G_BOTTOM - Y(T) > 44) text(narrow ? 'Not detected (1)' : 'Not detected (output 1)', gx1 - 6, Y(T) + 5);
  textStyle(NORMAL);

  // grid and axes
  stroke('gainsboro'); strokeWeight(1);
  for (let v = 20; v < 100; v += 20) line(gx0, Y(v), gx1, Y(v));
  noStroke(); fill('black'); textSize(12); textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 20) text(v, gx0 - 5, Y(v));
  textAlign(CENTER, TOP);
  const step = (gx1 - gx0) < 240 ? 5 : 3;
  for (let cm = 0; cm <= MAX_CM; cm += step) {
    stroke('black'); line(X(cm), G_BOTTOM, X(cm), G_BOTTOM + 4);
    noStroke(); text(cm, X(cm), G_BOTTOM + 5);
  }
  textSize(13);
  text('Distance to surface (cm)', (gx0 + gx1) / 2, G_BOTTOM + 34);
  push();
  translate(gx0 - 34, (G_TOP + G_BOTTOM) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Reflected IR (0 to 100)', 0, 0);
  pop();

  // one curve per surface; the active one is thick
  for (const name of Object.keys(SURFACES)) {
    const active = name === surface;
    stroke(SURFACES[name].curve); strokeWeight(active ? 4 : 1.5); noFill();
    beginShape();
    for (let cm = 0; cm <= MAX_CM; cm += 0.25) vertex(X(cm), Y(reflected(name, cm)));
    endShape();
  }

  // threshold line (the trimmer dial)
  stroke('darkorange'); strokeWeight(2.5);
  line(gx0, Y(T), gx1, Y(T));
  noStroke(); fill('darkorange'); textSize(13); textStyle(BOLD); textAlign(RIGHT, BOTTOM);
  text('threshold ' + T, gx1 - 4, Y(T) - 3);
  textStyle(NORMAL);

  // where the active curve crosses the threshold
  const sd = switchDistance(surface);
  if (typeof sd === 'number' && sd <= MAX_CM) {
    stroke('darkorange'); strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(X(sd), Y(T), X(sd), G_BOTTOM);
    drawingContext.setLineDash([]);
    // label it on its own row under the tick labels
    noStroke(); fill('chocolate'); textSize(12); textStyle(BOLD); textAlign(CENTER, TOP);
    const s = '\u2191 switches at ' + sd.toFixed(1) + ' cm';
    const half = textWidth(s) / 2;
    text(s, constrain(X(sd), gx0 - 30 + half, gx1 - half), G_BOTTOM + 19);
    textStyle(NORMAL);
  } else {
    // the curve never crosses the line inside 0-15 cm
    noStroke(); fill('chocolate'); textSize(12); textStyle(BOLD); textAlign(CENTER, TOP);
    const never = sd === 'never';
    const msg = narrow ? (never ? ': never detected' : ': always detected')
      : (never ? ': never detected at this threshold' : ': detected at every distance shown');
    text(surface.toLowerCase() + msg, (gx0 + gx1) / 2, G_BOTTOM + 19);
    textStyle(NORMAL);
  }

  // current reading: dot on the active curve
  const ir = reflected(surface, d);
  stroke('black'); strokeWeight(1); fill(SURFACES[surface].curve);
  circle(X(d), Y(ir), 13);
  noStroke(); fill('black'); textSize(13); textStyle(BOLD);
  textAlign(X(d) > (gx0 + gx1) / 2 ? RIGHT : LEFT, BOTTOM);
  text(ir.toFixed(1), X(d) + (X(d) > (gx0 + gx1) / 2 ? -9 : 9), Y(ir) - 5);
  textStyle(NORMAL);

  // label each curve directly instead of using a legend
  noStroke(); textSize(12);
  for (const name of Object.keys(SURFACES)) {
    textStyle(name === surface ? BOLD : NORMAL);
    fill(SURFACES[name].curve);
    if (name === 'White') {
      textAlign(LEFT, CENTER);
      text('white', X(3) + 9, Y(reflected(name, 3)) - 4);
    } else {
      textAlign(LEFT, BOTTOM);
      text(name.toLowerCase(), gx0 + 5, Y(reflected(name, 0)) - 3);
    }
  }
  textStyle(NORMAL);

  // calibration warning
  if (output('White', d) === output('Black', d)) {
    noStroke(); fill('darkorange'); textStyle(BOLD); textSize(14); textAlign(LEFT, TOP);
    text('Black and white give the same answer here', gx0 - 40, G_BOTTOM + 54, gx1 - gx0 + 40);
    textStyle(NORMAL);
  }
}

function drawControlLabels(d) {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Distance: ' + d.toFixed(1) + ' cm', 10, drawHeight + 54);
  text('Threshold: ' + threshSlider.value(), 10, drawHeight + 89);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof threshSlider !== 'undefined') {
    const w = canvasWidth - sliderLeftMargin - margin;
    distSlider.size(w); threshSlider.size(w);
  }
}
