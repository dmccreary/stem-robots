// GPIO Pin Explorer
// CANVAS_HEIGHT: 410
// Bloom L2 (Understand): explain digital input vs output pins and how
// HIGH/LOW map to voltage (0.0 / 3.3 V) and MicroPython True/False.

let canvasWidth = 700;
let drawHeight = 360;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let defaultTextSize = 16;

let modeSelect;
let toggleButton;

let pinMode = 'Output';      // 'Output' or 'Input'
let outputHigh = false;      // GP15 output state
let buttonPressed = false;   // GP14 input state
let dispVolt = 0;            // animated voltage display

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeSelect = createSelect();
  modeSelect.parent(document.querySelector('main'));
  modeSelect.option('Output');
  modeSelect.option('Input');
  modeSelect.selected('Output');
  modeSelect.changed(onModeChange);

  toggleButton = createButton('Set HIGH');
  toggleButton.parent(document.querySelector('main'));
  toggleButton.mousePressed(onToggle);

  positionControls();
  describe('Schematic of two GPIO pins: GP15 driving an LED in output mode and GP14 reading a push button in input mode. A mode dropdown and a toggle button change the pin state; voltage bars and a data display show the resulting voltage and MicroPython boolean value.', LABEL);
}

function positionControls() {
  modeSelect.position(135, drawHeight + 13);
  toggleButton.position(360, drawHeight + 12);
}

function onModeChange() {
  pinMode = modeSelect.value();
  updateToggleLabel();
}

function onToggle() {
  if (pinMode === 'Output') outputHigh = !outputHigh;
  else buttonPressed = !buttonPressed;
  updateToggleLabel();
}

function updateToggleLabel() {
  if (pinMode === 'Output') toggleButton.html(outputHigh ? 'Set LOW' : 'Set HIGH');
  else toggleButton.html(buttonPressed ? 'Release Button' : 'Press Button');
}

// the active pin reflects the selected mode
function activeVoltage() {
  if (pinMode === 'Output') return outputHigh ? 3.3 : 0;
  return buttonPressed ? 3.3 : 0;
}
function activeValue() {
  if (pinMode === 'Output') return outputHigh;
  return buttonPressed;
}

function draw() {
  updateCanvasSize();

  // Backgrounds
  noStroke(); fill('aliceblue'); stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  noStroke(); fill('white'); stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke(); fill('black');
  textSize(20); textAlign(CENTER, TOP);
  text('GPIO Pin Explorer', canvasWidth / 2, 10);

  const splitX = canvasWidth * 0.55;
  drawSchematic(splitX);
  drawDataPanel(splitX);

  // control labels
  noStroke(); fill('black'); textSize(14); textAlign(LEFT, CENTER);
  text('Select Pin Mode:', 10, drawHeight + 22);

  textSize(defaultTextSize); textAlign(LEFT, CENTER);
}

function drawSchematic(splitX) {
  const w = splitX - margin;
  // RP2040 block
  const chipX = margin + 10, chipY = 70, chipW = 70, chipH = 220;
  noStroke(); fill('#263238');
  rect(chipX, chipY, chipW, chipH, 6);
  fill('white'); textAlign(CENTER, CENTER); textSize(13);
  text('RP2040', chipX + chipW / 2, chipY + chipH / 2);

  // --- GP15 output row (LED) ---
  const y15 = 110;
  drawPinLabel('GP15', chipX + chipW, y15, pinMode === 'Output' ? 'OUTPUT' : 'output');
  // wire
  const wireStart = chipX + chipW + 40;
  stroke(pinMode === 'Output' ? '#1565c0' : '#b0bec5'); strokeWeight(3);
  line(chipX + chipW, y15, wireStart, y15);
  // voltage bar on wire
  drawVoltageBar(wireStart, y15 - 8, pinMode === 'Output' ? (outputHigh ? 3.3 : 0) : 0, 90);
  // resistor + LED
  const ledX = wireStart + 120;
  noStroke(); fill('#8d6e63'); rect(wireStart + 92, y15 - 6, 18, 12, 2); // resistor
  const ledOn = pinMode === 'Output' && outputHigh;
  stroke('#555'); strokeWeight(1.5);
  fill(ledOn ? '#ffeb3b' : '#9e9e9e');
  if (ledOn) { drawingContext.shadowBlur = 18; drawingContext.shadowColor = 'yellow'; }
  circle(ledX, y15, 26);
  drawingContext.shadowBlur = 0;
  noStroke(); fill('black'); textSize(12); textAlign(CENTER, TOP);
  text('LED', ledX, y15 + 16);

  // --- GP14 input row (button) ---
  const y14 = 250;
  drawPinLabel('GP14', chipX + chipW, y14, pinMode === 'Input' ? 'INPUT' : 'input');
  stroke(pinMode === 'Input' ? '#1565c0' : '#b0bec5'); strokeWeight(3);
  line(chipX + chipW, y14, wireStart, y14);
  drawVoltageBar(wireStart, y14 - 8, pinMode === 'Input' ? (buttonPressed ? 3.3 : 0) : 0, 90);
  // push button (raised vs depressed)
  const btnX = wireStart + 110, btnPressed = pinMode === 'Input' && buttonPressed;
  stroke('#555'); strokeWeight(2); fill('#cfd8dc');
  rect(btnX - 16, y14 - 14, 32, 28, 4);
  noStroke(); fill(btnPressed ? '#ff7043' : '#eceff1');
  rect(btnX - 11, y14 - (btnPressed ? 5 : 10), 22, btnPressed ? 12 : 18, 3);
  fill('black'); textSize(12); textAlign(CENTER, TOP);
  text(btnPressed ? 'pressed' : 'released', btnX, y14 + 18);
}

function drawPinLabel(name, x, y, mode) {
  noStroke(); fill('black'); textSize(12); textAlign(LEFT, CENTER);
  text(name, x + 4, y - 18);
  fill(mode === mode.toUpperCase() ? '#ff6f00' : '#90a4ae');
  textSize(11);
  text(mode.toUpperCase(), x + 4, y - 4);
}

function drawVoltageBar(x, y, volts, w) {
  const frac = volts / 3.3;
  noStroke(); fill('#e0e0e0'); rect(x, y, w, 14, 3);
  fill(volts > 1.65 ? '#43a047' : '#ef5350');
  rect(x, y, w * frac, 14, 3);
  noStroke(); fill('black'); textSize(11); textAlign(LEFT, CENTER);
  text(nf(volts, 1, 1) + ' V', x + w + 6, y + 7);
}

function drawDataPanel(splitX) {
  const px = splitX + 10;
  const pw = canvasWidth - px - margin;
  noStroke(); fill('#102a43');
  rect(px, 60, pw, 250, 8);
  fill('white'); textAlign(LEFT, TOP);
  textSize(16);
  text('Live Pin Data', px + 14, 74);

  const rows = [
    ['Pin Mode', pinMode === 'Output' ? 'OUTPUT (GP15)' : 'INPUT (GP14)'],
    ['Voltage', nf(dispVolt, 1, 2) + ' V'],
    ['MicroPython value', activeValue() ? 'True' : 'False']
  ];
  // animate displayed voltage toward target
  dispVolt = lerp(dispVolt, activeVoltage(), 0.2);

  textSize(15);
  let yy = 116;
  for (let r of rows) {
    fill('#9fb3c8'); text(r[0], px + 14, yy);
    fill('white'); textSize(18);
    text(r[1], px + 14, yy + 18);
    textSize(15);
    yy += 56;
  }

  fill('#cfe3ff'); textSize(12);
  text(pinMode === 'Input'
      ? 'Pull-up keeps the line HIGH (3.3 V) when the button is pressed.'
      : 'HIGH = 3.3 V = True lights the LED. LOW = 0 V = False.',
      px + 14, 290, pw - 28, 60);
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
