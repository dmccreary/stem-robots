// Battery Runtime Estimator
// CANVAS_HEIGHT: 470
// Bloom L3 (Apply) - Calculate: estimate robot runtime with
// runtime (h) = usable capacity (mAh) / total current (mA).
// The robot's loads are the RP2040 and sensors, the OLED display, the
// NeoPixels, and two motors whose current depends on the motor duty.
// Adapted from moving-rainbow/battery-life-calculator (capacity / current).

let canvasWidth = 700;
let drawHeight = 320;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 230;
let defaultTextSize = 16;

let batterySelect, dutySlider, healthSlider, oledCheckbox, pixelCheckbox, runButton, resetButton;

const BATTERIES = {
  '4 x AA alkaline (2000 mAh, 6.0 V)': { mah: 2000, lipo: false, volts: 6.0 },
  '2S LiPo 1000 mAh (7.4 V)': { mah: 1000, lipo: true, volts: 7.4 },
  '2S LiPo 2000 mAh (7.4 V)': { mah: 2000, lipo: true, volts: 7.4 }
};
const BASE_MA = 60, OLED_MA = 20, PIXEL_MA = 30, MOTOR_MA = 250;

let running = false;
let elapsedH = 0;          // simulated hours since Run was pressed
let stoppedLow = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  batterySelect = createSelect();
  batterySelect.parent(main);
  for (const k in BATTERIES) batterySelect.option(k);
  batterySelect.selected('4 x AA alkaline (2000 mAh, 6.0 V)');
  batterySelect.changed(resetRun);

  runButton = createButton('Run');
  runButton.parent(main);
  runButton.mousePressed(toggleRun);
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetRun);

  dutySlider = createSlider(0, 100, 60, 5);
  dutySlider.parent(main);
  dutySlider.input(resetRun);
  healthSlider = createSlider(50, 100, 100, 5);
  healthSlider.parent(main);
  healthSlider.input(resetRun);

  oledCheckbox = createCheckbox(' OLED display on (20 mA)', true);
  oledCheckbox.parent(main);
  oledCheckbox.changed(resetRun);
  pixelCheckbox = createCheckbox(' NeoPixels on (30 mA)', false);
  pixelCheckbox.parent(main);
  pixelCheckbox.changed(resetRun);

  positionControls();
  describe('A battery runtime calculator. A large battery gauge, the pack voltage, and the estimated runtime appear on the left. A table on the right lists the current drawn by the microcontroller and sensors, the OLED display, the NeoPixels, and the motors. A formula strip shows usable capacity divided by total current. Controls choose the battery, motor duty, battery health, and which loads are on, and Run drains the gauge.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 43, y3 = drawHeight + 78, y4 = drawHeight + 113;
  batterySelect.position(90, y1);
  batterySelect.size(canvasWidth < 560 ? max(120, canvasWidth - 225) : AUTO);
  runButton.position(min(360, canvasWidth - 120), y1);
  resetButton.position(min(420, canvasWidth - 60), y1);
  dutySlider.position(sliderLeftMargin, y2);
  dutySlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  healthSlider.position(sliderLeftMargin, y3);
  healthSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
  oledCheckbox.position(10, y4);
  const narrow = canvasWidth < 560;
  pixelCheckbox.position(narrow ? 170 : 230, y4);
  // shorter checkbox text on narrow screens (p5 keeps the text in a <span>)
  setCheckboxText(oledCheckbox, narrow ? ' OLED (20 mA)' : ' OLED display on (20 mA)');
  setCheckboxText(pixelCheckbox, narrow ? ' NeoPixels (30 mA)' : ' NeoPixels on (30 mA)');
}

function setCheckboxText(cb, t) {
  const span = cb.elt.querySelector('span');
  if (span) span.textContent = t;
}

function toggleRun() {
  if (stoppedLow || fractionLeft() <= 0.0001) resetRun();
  running = !running;
  runButton.html(running ? 'Pause' : 'Run');
}

function resetRun() {
  running = false;
  if (runButton) runButton.html('Run');
  elapsedH = 0;
  stoppedLow = false;
}

// ---------- The runtime model ----------
function calc() {
  const b = BATTERIES[batterySelect.value()];
  const duty = dutySlider.value();
  const health = healthSlider.value();
  const loads = {
    base: BASE_MA,
    oled: oledCheckbox.checked() ? OLED_MA : 0,
    pixels: pixelCheckbox.checked() ? PIXEL_MA : 0,
    motors: 2 * (duty / 100) * MOTOR_MA
  };
  const total = loads.base + loads.oled + loads.pixels + loads.motors;
  let usable = b.mah * health / 100;
  let factor = 1, factorNote = '';
  if (b.lipo) { factor = 0.8; factorNote = '0.8 (LiPo: stop at 3.0 V per cell)'; }
  else if (total > 300) { factor = 0.7; factorNote = '0.7 (alkaline above 300 mA)'; }
  usable *= factor;
  const hours = total > 0 ? usable / total : 0;
  return { b, duty, health, loads, total, usable, factor, factorNote, hours };
}

// Fraction of the gauge still full (1 = full). LiPo stops at 20 percent.
function fractionLeft() {
  const c = calc();
  const floorPct = c.b.lipo ? 0.2 : 0;
  if (c.hours <= 0) return 1;
  const used = constrain(elapsedH / c.hours, 0, 1);
  return 1 - used * (1 - floorPct);
}

function formatHM(h) {
  const totalMin = round(h * 60);
  return floor(totalMin / 60) + ' h ' + (totalMin % 60) + ' min';
}

function draw() {
  updateCanvasSize();
  const c = calc();

  // Run: 1 simulated hour per real second
  if (running) {
    elapsedH += deltaTime / 1000;
    if (elapsedH >= c.hours) {
      elapsedH = c.hours;
      running = false;
      runButton.html('Run');
      if (c.b.lipo) stoppedLow = true;
    }
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(CENTER, TOP);
  text('Battery Runtime Estimator', canvasWidth / 2, 6);

  const leftW = canvasWidth * 0.46;
  drawGauge(margin, 42, min(260, leftW - margin - 24), 84, c);
  drawResults(margin, 138, leftW - margin, c);
  drawLoadTable(leftW + 10, 40, canvasWidth - leftW - 10 - margin, c);
  drawFormula(10, 244, canvasWidth - 20, 68, c);
  drawControlLabels(c);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

function drawGauge(x, y, w, h, c) {
  const f = fractionLeft();
  // battery outline with a terminal nub
  stroke('black');
  strokeWeight(3);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  rect(x + w, y + h * 0.3, 10, h * 0.4, 3);
  strokeWeight(1);
  // fill color: green above 50 percent, yellow 20-50, red below 20
  const col = f > 0.5 ? 'limegreen' : (f >= 0.2 ? 'gold' : 'red');
  noStroke();
  fill(col);
  rect(x + 5, y + 5, max(0, (w - 10) * f), h - 10, 6);
  // LiPo cutoff line at 20 percent
  if (c.b.lipo) {
    stroke('firebrick');
    strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    line(x + 5 + (w - 10) * 0.2, y + 4, x + 5 + (w - 10) * 0.2, y + h - 4);
    drawingContext.setLineDash([]);
    strokeWeight(1);
  }
  noStroke();
  fill('black');
  textSize(26);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(round(f * 100) + '%', x + w / 2, y + h / 2);
  textStyle(NORMAL);
}

function packVoltage(c, f) {
  // approximate: alkaline 1.5 V -> 1.0 V per cell; LiPo nominal 3.7 V -> 3.0 V per cell at cutoff
  if (c.b.lipo) return 2 * (3.0 + 0.7 * (f - 0.2) / 0.8);
  return 4 * (1.0 + 0.5 * f);
}

function drawResults(x, y, w, c) {
  const f = fractionLeft();
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, TOP);
  const v = packVoltage(c, f);
  text('Pack voltage: ' + nf(v, 1, 1) + ' V', x, y);
  if (stoppedLow) {
    const tw = textWidth('Pack voltage: ' + nf(v, 1, 1) + ' V');
    fill('red');
    rect(x + tw + 8, y - 3, 128, 22, 4);
    fill('white');
    textStyle(BOLD);
    textSize(13);
    text('LOW - shut down!', x + tw + 14, y + 1);
    textStyle(NORMAL);
  }
  fill('black');
  textSize(15);
  text('Estimated runtime:', x, y + 28);
  fill('midnightblue');
  textSize(28);
  textStyle(BOLD);
  text(formatHM(c.hours), x, y + 48);
  textStyle(NORMAL);
  if (elapsedH > 0) {
    fill('dimgray');
    textSize(14);
    text('Elapsed: ' + formatHM(elapsedH) + (running && w > 260 ? '  (1 hour per second)' : ''), x, y + 84);
  }
}

function drawLoadTable(x, y, w, c) {
  stroke('silver');
  fill('white');
  rect(x, y, w, 196, 8);
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Current draw', x + 10, y + 8);
  textStyle(NORMAL);
  const rows = [
    ['Microcontroller and sensors', c.loads.base, 'steelblue'],
    ['OLED display', c.loads.oled, 'mediumpurple'],
    ['NeoPixels', c.loads.pixels, 'hotpink'],
    ['Motors (2 x ' + c.duty + '% x 250 mA)', c.loads.motors, 'darkorange']
  ];
  const labelW = min(200, w * 0.55);
  const barX = x + 10 + labelW, barW = w - labelW - 70;
  let ry = y + 36;
  for (const r of rows) {
    fill('black');
    textSize(13);
    textAlign(LEFT, CENTER);
    text(r[0], x + 10, ry + 9, labelW - 6);
    fill('whitesmoke');
    rect(barX, ry + 2, barW, 14, 2);
    fill(r[2]);
    rect(barX, ry + 2, barW * constrain(r[1] / 500, 0, 1), 14, 2);
    fill('black');
    textAlign(RIGHT, CENTER);
    text(nf(r[1], 1, 0) + ' mA', x + w - 10, ry + 9);
    ry += 28;
  }
  stroke('gray');
  line(x + 10, ry, x + w - 10, ry);
  noStroke();
  fill('black');
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Total current', x + 10, ry + 6);
  textAlign(RIGHT, TOP);
  text(nf(c.total, 1, 0) + ' mA', x + w - 10, ry + 6);
  textStyle(NORMAL);
  if (c.duty >= 100) {
    fill('firebrick');
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Motors use most of your battery.', x + 10, ry + 30, w - 20);
    textStyle(NORMAL);
  }
}

function drawFormula(x, y, w, h, c) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  const narrow = w < 540;
  textSize(narrow ? 11 : 14);
  textAlign(LEFT, TOP);
  let cap = 'usable capacity = ' + c.b.mah + ' mAh x ' + c.health + '% health';
  if (c.factor < 1) cap += ' x ' + (narrow ? c.factor : c.factorNote);
  cap += ' = ' + nf(c.usable, 1, 0) + ' mAh';
  text(cap, x + 12, y + 10, w - 24);
  fill('midnightblue');
  textStyle(BOLD);
  const rt = (narrow ? 'runtime = ' : 'runtime (h) = capacity (mAh) / current (mA) = ') + nf(c.usable, 1, 0) + ' / ' + nf(c.total, 1, 0) +
    ' = ' + nf(c.hours, 1, 2) + ' h';
  text(rt, x + 12, y + 40, w - 24);
  textStyle(NORMAL);
}

function drawControlLabels(c) {
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Battery:', 12, drawHeight + 20);
  text('Motor duty: ' + c.duty + ' %', 12, drawHeight + 55);
  text('Battery health: ' + c.health + ' %', 12, drawHeight + 90);
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
