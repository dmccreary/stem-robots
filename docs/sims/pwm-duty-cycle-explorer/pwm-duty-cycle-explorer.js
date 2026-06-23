// PWM Duty Cycle Explorer
// CANVAS_HEIGHT: 400
// Bloom L2 (Understand): connect duty cycle percentage to average voltage and
// motor speed. Drag the slider to change the duty cycle and watch the waveform,
// the average-voltage line, and the spinning motor all respond.

let canvasWidth = 700;
let drawHeight = 350;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let dutySlider;
let motorAngle = 0;
let sliderLeftMargin = 150;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  dutySlider = createSlider(0, 100, 50, 1);
  dutySlider.parent(document.querySelector('main'));
  positionControls();
  describe('A PWM waveform display with a draggable duty-cycle slider. The square wave, an orange average-voltage line, Ton and Toff labels, numeric stats, and a spinning motor icon all update as the duty cycle changes.', LABEL);
}

function positionControls() {
  dutySlider.position(sliderLeftMargin, drawHeight + 16);
  dutySlider.size(max(120, canvasWidth - sliderLeftMargin - margin));
}

function draw() {
  updateCanvasSize();
  const duty = dutySlider.value();

  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textSize(20); textAlign(CENTER, TOP);
  text('PWM Duty Cycle Explorer', canvasWidth / 2, 8);

  drawWaveform(duty);
  drawStats(duty);

  // control label
  noStroke(); fill('black'); textSize(14); textAlign(LEFT, CENTER);
  text('Duty Cycle: ' + duty + '%', 12, drawHeight + 25);

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawWaveform(duty) {
  const wx = margin, wy = 50, ww = canvasWidth - 2 * margin, wh = 170;
  const yHigh = wy + 20, yLow = wy + wh - 20;
  // axis
  stroke('#cfd8dc'); strokeWeight(1);
  line(wx, yLow, wx + ww, yLow);
  noStroke(); fill('#90a4ae'); textSize(11); textAlign(RIGHT, CENTER);
  text('3.3V', wx + 26, yHigh); text('0V', wx + 20, yLow);

  // square wave: 3 periods
  const periods = 3;
  const pw = (ww - 30) / periods;
  const tonW = pw * duty / 100;
  stroke('#1565c0'); strokeWeight(2.5); noFill();
  beginShape();
  let x = wx + 30;
  for (let i = 0; i < periods; i++) {
    vertex(x, yLow);
    vertex(x, duty > 0 ? yHigh : yLow);
    vertex(x + tonW, duty > 0 ? yHigh : yLow);
    vertex(x + tonW, yLow);
    vertex(x + pw, yLow);
    x += pw;
  }
  endShape();

  // average voltage line (orange dashed)
  const yAvg = map(duty, 0, 100, yLow, yHigh);
  stroke('#fb8c00'); strokeWeight(2);
  drawingContext.setLineDash([6, 5]);
  line(wx + 30, yAvg, wx + ww, yAvg);
  drawingContext.setLineDash([]);
  noStroke(); fill('#fb8c00'); textSize(11); textAlign(LEFT, BOTTOM);
  text('average voltage', wx + 34, yAvg - 3);

  // Ton / Toff labels with arrows on first period
  const x0 = wx + 30;
  stroke('#43a047'); strokeWeight(1.5);
  line(x0, yHigh - 12, x0 + tonW, yHigh - 12);
  noStroke(); fill('#43a047'); textSize(11); textAlign(CENTER, BOTTOM);
  if (tonW > 24) text('Ton', x0 + tonW / 2, yHigh - 13);
  stroke('#d32f2f'); strokeWeight(1.5);
  line(x0 + tonW, yLow + 12, x0 + pw, yLow + 12);
  noStroke(); fill('#d32f2f'); textAlign(CENTER, TOP);
  if (pw - tonW > 24) text('Toff', x0 + tonW + (pw - tonW) / 2, yLow + 13);
}

function drawStats(duty) {
  const avg = 3.3 * duty / 100;
  const sy = 245;
  noStroke(); fill('#102a43');
  rect(margin, sy, canvasWidth * 0.55, 86, 8);
  fill('white'); textAlign(LEFT, TOP); textSize(15);
  text('Duty Cycle:  ' + duty + ' %', margin + 14, sy + 12);
  text('Average Voltage:  ' + nf(avg, 1, 2) + ' V', margin + 14, sy + 38);
  text('Motor Speed:  ~' + duty + ' %', margin + 14, sy + 64);

  // spinning motor icon
  const mx = canvasWidth * 0.80, my = sy + 43;
  motorAngle += (duty / 100) * 0.35;
  push();
  translate(mx, my);
  rotate(motorAngle);
  stroke('#37474f'); strokeWeight(4); noFill(); circle(0, 0, 60);
  stroke('#1565c0'); strokeWeight(5);
  for (let a = 0; a < 4; a++) { line(0, 0, cos(a * HALF_PI) * 26, sin(a * HALF_PI) * 26); }
  pop();
  noStroke(); fill('#555'); textSize(12); textAlign(CENTER, TOP);
  text('motor', mx, my + 38);
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
