// Transistor Switch Explorer
// CANVAS_HEIGHT: 480
// Bloom L2 (Understand) - Explain: a tiny GPIO signal on the gate of an
// N-channel MOSFET switches a much larger motor current from the battery.
// Meters show both currents and their ratio. Wiring the motor straight to the
// GPIO pin shows why that cannot work (the pin gives only about 12 mA).
// Simplified model: the MOSFET turns on at 1.5 V and the motor current rises
// linearly to its full value at 3.3 V.
// Adapted from moving-rainbow/transistor-circuit-diagrams.

let canvasWidth = 700;
let drawHeight = 410;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let sliderLeftMargin = 290;
let defaultTextSize = 16;

let gpioButton, gateSlider, loadSelect, directCheckbox;

const THRESHOLD = 1.5;        // gate voltage where the MOSFET starts to conduct
const GPIO_LIMIT = 12;        // mA a GPIO pin can safely supply
const LOAD_NORMAL = 'Robot motor (normal)';
const LOAD_STALL = 'Stalled motor (blocked wheel)';

let mouseOverCanvas = false;
let flowPhase = 0, gatePhase = 0, shaftAngle = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  gpioButton = createButton('GPIO: LOW');
  gpioButton.parent(main);
  gpioButton.mousePressed(() => gateSlider.value(gateSlider.value() > 0 ? 0 : 3.3));

  gateSlider = createSlider(0, 3.3, 0, 0.1);
  gateSlider.parent(main);

  loadSelect = createSelect();
  loadSelect.parent(main);
  loadSelect.option(LOAD_NORMAL);
  loadSelect.option(LOAD_STALL);
  loadSelect.selected(LOAD_NORMAL);

  directCheckbox = createCheckbox(' Connect motor directly to GPIO (no transistor)', false);
  directCheckbox.parent(main);

  positionControls();
  describe('A circuit with an RP2040 GPIO pin driving the gate of an N-channel MOSFET through a 220 ohm resistor. The MOSFET switches a DC motor powered by a 6 volt battery pack. Meters on the right show the tiny GPIO current and the large motor current. A slider sets the gate voltage, and a checkbox wires the motor straight to the GPIO pin to show that the pin cannot supply enough current.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 40;
  gpioButton.position(10, y1);
  gateSlider.position(sliderLeftMargin, y1 + 2);
  gateSlider.size(max(80, canvasWidth - sliderLeftMargin - 20));
  loadSelect.position(10, y2);
  // narrow screens: shorter dropdown and checkbox label so the row fits
  const narrow = canvasWidth < 560;
  loadSelect.size(narrow ? 150 : AUTO);
  directCheckbox.position(narrow ? 168 : 240, y2 + 2);
  // p5 nests the <input> inside the <label>, so only change the text <span>
  const lbl = directCheckbox.elt.querySelector('span');
  if (lbl) lbl.textContent = narrow ? ' Motor on GPIO pin' : ' Connect motor directly to GPIO (no transistor)';
}

// ---------- The circuit model ----------
function circuitState() {
  const vg = round(gateSlider.value() * 10) / 10;
  const loadMax = loadSelect.value() === LOAD_STALL ? 500 : 300;
  const direct = directCheckbox.checked();
  let motorI, gpioI, on;
  if (!direct) {
    on = vg >= THRESHOLD;
    motorI = on ? (vg - THRESHOLD) / (3.3 - THRESHOLD) * loadMax : 0;
    gpioI = 0.1 * vg / 3.3;           // the gate draws almost nothing
  } else {
    on = false;
    const demand = loadMax * vg / 3.3; // the motor tries to pull this from the pin
    gpioI = demand;
    motorI = min(demand, GPIO_LIMIT);
  }
  return { vg, loadMax, direct, on, motorI, gpioI };
}

function draw() {
  updateCanvasSize();
  const m = circuitState();

  // button label follows the gate voltage
  gpioButton.html(m.vg <= 0 ? 'GPIO: LOW' : (m.vg >= 3.3 ? 'GPIO: HIGH' : 'GPIO: ' + nf(m.vg, 1, 1) + ' V'));

  // animate only while the mouse is over the sim
  if (mouseOverCanvas) {
    flowPhase += 0.0015 + m.motorI / 300 * 0.006;
    gatePhase += 0.01;
    shaftAngle += m.motorI / 300 * 0.25;
  }

  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(LEFT, TOP);
  text('Transistor Switch Explorer', 12, 8);

  // circuit on the left 60 percent, drawn in a 420 x 370 design space
  const cw = canvasWidth * 0.6;
  const s = min(1, cw / 420);
  push();
  translate(0, 36);
  scale(s);
  drawCircuit(m);
  pop();

  drawPanel(cw + 6, 40, canvasWidth - cw - 16, drawHeight - 50, m);

  // control label
  noStroke();
  fill('black');
  textSize(15);
  textAlign(LEFT, CENTER);
  text('Gate voltage: ' + nf(m.vg, 1, 1) + ' V', 124, drawHeight + 20);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

// ---------- Circuit drawing (design space 420 x 370) ----------
const MX = 250;                 // motor / MOSFET column
const BX = 370;                 // battery column
const TOP_Y = 44, MOTOR_Y = 108, GATE_Y = 214, GND_Y = 320;

function motorLoopPath() {
  return [[BX, 150], [BX, TOP_Y], [MX, TOP_Y], [MX, MOTOR_Y - 26], [MX, MOTOR_Y + 26],
          [MX, GATE_Y - 26], [MX, GATE_Y + 26], [MX, GND_Y], [BX, GND_Y], [BX, 210], [BX, 150]];
}

function drawCircuit(m) {
  const loopOn = !m.direct && m.motorI > 0;
  const orange = 'darkorange';

  // battery label
  noStroke();
  fill(m.direct ? 'gray' : 'black');
  textSize(13);
  textAlign(RIGHT, BOTTOM);
  text('6 V battery pack (4 x AA)', BX + 40, TOP_Y - 8);

  // motor loop wires (thick orange)
  stroke(m.direct ? 'lightgray' : orange);
  strokeWeight(6);
  noFill();
  if (!m.direct) {
    polyline(motorLoopPath());
  } else {
    // battery is disconnected; motor runs from the GPIO pin to ground
    polyline([[BX, 150], [BX, TOP_Y], [MX + 40, TOP_Y]]);
    polyline([[BX, 210], [BX, GND_Y], [MX + 40, GND_Y]]);
    stroke(orange);
    polyline([[MX, MOTOR_Y + 26], [MX, GND_Y], [MX + 60, GND_Y]]);
  }
  strokeWeight(1);

  drawBattery(BX, 180, m.direct);
  drawMotor(MX, MOTOR_Y, m);
  drawMosfet(MX, GATE_Y, m);
  drawGround(MX + 60, GND_Y);

  // control side: RP2040 GPIO box and gate resistor
  const gx = 20, gy = GATE_Y - 22;
  const pinOverload = m.direct && m.gpioI > GPIO_LIMIT;
  if (pinOverload) {
    noStroke();
    fill(255, 0, 0, 70);
    circle(gx + 45, GATE_Y, 120);
  }
  stroke('steelblue');
  strokeWeight(2);
  fill(pinOverload ? 'red' : 'midnightblue');
  rect(gx, gy, 90, 44, 6);
  noStroke();
  fill('white');
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('RP2040', gx + 45, gy + 14);
  text('GPIO', gx + 45, gy + 30);
  textStyle(NORMAL);

  if (!m.direct) {
    // thin blue gate wire with the 220 ohm resistor
    stroke('royalblue');
    strokeWeight(2);
    line(gx + 90, GATE_Y, 132, GATE_Y);
    line(172, GATE_Y, MX - 30, GATE_Y);
    drawResistor(132, GATE_Y);
    if (m.vg > 0) drawDots([[gx + 90, GATE_Y], [MX - 30, GATE_Y]], gatePhase, 5, 5, 'royalblue');
  } else {
    // the GPIO pin wired straight to the motor's top terminal
    stroke(pinOverload ? 'red' : orange);
    strokeWeight(4);
    polyline([[gx + 90, GATE_Y - 10], [150, GATE_Y - 10], [150, TOP_Y], [MX, TOP_Y], [MX, MOTOR_Y - 26]]);
    strokeWeight(1);
    if (m.motorI > 0) drawDots([[gx + 90, GATE_Y - 10], [150, GATE_Y - 10], [150, TOP_Y], [MX, TOP_Y], [MX, MOTOR_Y - 26], [MX, GND_Y]], flowPhase, 4, 6, orange);
  }

  // current dots in the motor loop: more and faster with more current
  if (loopOn) {
    const nDots = 6 + floor(m.motorI / 25);
    drawDots(motorLoopPath(), flowPhase, nDots, 10, orange);
  }
}

function polyline(pts) {
  noFill();
  beginShape();
  for (const p of pts) vertex(p[0], p[1]);
  endShape();
}

// Dots evenly spaced along a path, shifted by phase (0 to 1)
function drawDots(pts, phase, n, size, col) {
  let lens = [], total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = dist(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    lens.push(d);
    total += d;
  }
  noStroke();
  fill(col);
  for (let k = 0; k < n; k++) {
    let d = ((phase + k / n) % 1) * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i]) {
        const f = d / lens[i];
        circle(lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), size);
        break;
      }
      d -= lens[i];
    }
  }
}

function drawBattery(x, y, off) {
  // two cell plates: long line is +, short line is -
  noStroke();
  fill('aliceblue');
  rect(x - 22, y - 32, 44, 64);
  stroke(off ? 'gray' : 'black');
  strokeWeight(4);
  line(x - 20, y - 22, x + 20, y - 22);
  line(x - 10, y - 10, x + 10, y - 10);
  line(x - 20, y + 4, x + 20, y + 4);
  line(x - 10, y + 16, x + 10, y + 16);
  strokeWeight(1);
  noStroke();
  fill(off ? 'gray' : 'firebrick');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('+', x + 24, y - 24);
  fill(off ? 'gray' : 'black');
  text('−', x + 24, y + 18);
  if (off) {
    fill('gray');
    textSize(11);
    textAlign(CENTER, TOP);
    text('not used', x, y + 52);
  }
}

function drawMotor(x, y, m) {
  stroke('dimgray');
  strokeWeight(3);
  fill(m.motorI > 0 ? 'lightyellow' : 'gainsboro');
  circle(x, y, 52);
  // spinning shaft line shows the speed
  stroke('firebrick');
  strokeWeight(3);
  const r = 18;
  line(x - cos(shaftAngle) * r, y - sin(shaftAngle) * r, x + cos(shaftAngle) * r, y + sin(shaftAngle) * r);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('M', x, y);
  textStyle(NORMAL);
  textSize(12);
  textAlign(LEFT, CENTER);
  text('DC motor', x + 32, y);
}

function drawResistor(x, y) {
  stroke('royalblue');
  strokeWeight(2);
  noFill();
  beginShape();
  vertex(x, y);
  for (let k = 0; k < 6; k++) vertex(x + 4 + k * 6, y + (k % 2 === 0 ? -7 : 7));
  vertex(x + 40, y);
  endShape();
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('220 Ω', x + 20, y - 10);
}

// N-channel MOSFET: gate plate on the left, channel in the middle
function drawMosfet(x, y, m) {
  const bypassed = m.direct;
  noStroke();
  fill(bypassed ? 'whitesmoke' : (m.on ? 'palegreen' : 'lightgray'));
  stroke(bypassed ? 'lightgray' : (m.on ? 'seagreen' : 'gray'));
  strokeWeight(2);
  circle(x - 10, y, 64);
  const col = bypassed ? 'silver' : 'black';
  stroke(col);
  strokeWeight(3);
  // gate lead and plate
  line(x - 30, y, x - 22, y);
  line(x - 22, y - 16, x - 22, y + 16);
  // channel: three segments, joined when the transistor is on
  if (m.on) {
    line(x - 14, y - 18, x - 14, y + 18);
  } else {
    line(x - 14, y - 18, x - 14, y - 9);
    line(x - 14, y - 4, x - 14, y + 4);
    line(x - 14, y + 9, x - 14, y + 18);
  }
  // drain (top) and source (bottom) connections
  line(x - 14, y - 14, x, y - 14);
  line(x, y - 14, x, y - 26);
  line(x - 14, y + 14, x, y + 14);
  line(x, y + 14, x, y + 26);
  line(x - 14, y, x, y);
  line(x, y, x, y + 14);
  // arrow into the channel (N-channel)
  noStroke();
  fill(col);
  triangle(x - 14, y, x - 7, y - 4, x - 7, y + 4);
  strokeWeight(1);
  // pin letters and label
  fill(bypassed ? 'silver' : 'dimgray');
  textSize(12);
  textAlign(CENTER, CENTER);
  text('G', x - 30, y - 12);
  text('D', x + 10, y - 22);
  text('S', x + 10, y + 22);
  fill(bypassed ? 'gray' : (m.on ? 'darkgreen' : 'dimgray'));
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(bypassed ? 'MOSFET (bypassed)' : ('MOSFET ' + (m.on ? 'ON' : 'OFF')), x + 26, y);
  textStyle(NORMAL);
}

function drawGround(x, y) {
  stroke('black');
  strokeWeight(3);
  line(x - 18, y + 8, x + 18, y + 8);
  line(x - 11, y + 15, x + 11, y + 15);
  line(x - 4, y + 22, x + 4, y + 22);
  line(x, y, x, y + 8);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('GND', x + 22, y + 15);
}

// ---------- Meters and text panel ----------
function drawPanel(x, y, w, h, m) {
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);

  drawMeter(x + 12, y + 14, w - 24, 'GPIO current (mA)', m.gpioI, GPIO_LIMIT, true,
    m.direct ? (m.gpioI > GPIO_LIMIT ? nf(m.gpioI, 1, 0) + (w < 240 ? ' mA!' : ' mA demanded!') : nf(m.gpioI, 1, 1) + ' mA') : nf(m.gpioI, 1, 2) + ' mA');
  drawMeter(x + 12, y + 90, w - 24, 'Motor current (mA)', m.motorI, 500, false, nf(m.motorI, 1, 0) + ' mA');

  noStroke();
  textAlign(LEFT, TOP);
  let ty = y + 170;
  fill('black');
  textSize(w < 240 ? 13 : 15);
  const gateText = 'Gate voltage: ' + nf(m.vg, 1, 1) + ' V   (turns on at ' + THRESHOLD + ' V)';
  text(gateText, x + 12, ty, w - 24);
  ty += wrappedHeight(gateText, w - 24) + 8;
  if (m.direct) {
    fill('firebrick');
    textStyle(BOLD);
    const warn = m.vg > 0 ? 'A GPIO pin can only give about 12 mA. The motor needs ' + m.loadMax + ' mA.' :
      'Motor wired straight to the pin. Raise the gate voltage to see what happens.';
    text(warn, x + 12, ty, w - 24);
    ty += wrappedHeight(warn, w - 24) + 6;
    textStyle(NORMAL);
    if (m.vg > 0) {
      fill('dimgray');
      textSize(14);
      text('The pin is overloaded and the motor barely turns.', x + 12, ty, w - 24);
    }
  } else if (m.on) {
    fill('darkgreen');
    textStyle(BOLD);
    text('Small signal, big current', x + 12, ty, w - 24);
    ty += wrappedHeight('Small signal, big current', w - 24) + 6;
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    const ratio = m.gpioI > 0 ? m.motorI / m.gpioI : 0;
    text('Motor current is about ' + nfc(round(ratio / 10) * 10) + ' times the GPIO current.', x + 12, ty, w - 24);
  } else {
    fill('dimgray');
    textSize(14);
    text(m.vg > 0 ? 'The gate voltage is below ' + THRESHOLD + ' V, so the MOSFET stays off and no motor current flows.' :
      'GPIO is LOW. The MOSFET is off, so no current flows through the motor.', x + 12, ty, w - 24, 90);
  }
}

// Approximate height of word-wrapped text at the current text size
function wrappedHeight(str, w) {
  return ceil(textWidth(str) * 1.08 / w) * textLeading();
}

function drawMeter(x, y, w, label, value, maxV, allowOverload, valueText) {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  // use a short label when the value text would collide with it
  textStyle(BOLD);
  const vw = textWidth(valueText);
  textStyle(NORMAL);
  text(textWidth(label) + vw + 12 > w ? label.replace(' current', '') : label, x, y);
  const by = y + 22, bh = 20;
  // with overload allowed, the last 20 percent of the bar is a red danger zone
  const scaleW = allowOverload ? w * 0.8 : w;
  stroke('gray');
  fill('whitesmoke');
  rect(x, by, w, bh, 3);
  if (allowOverload) {
    noStroke();
    fill('mistyrose');
    rect(x + scaleW, by + 1, w - scaleW - 1, bh - 2);
  }
  const over = allowOverload && value > maxV;
  const fw = over ? w : constrain(value / maxV, 0, 1) * scaleW;
  noStroke();
  fill(over ? 'red' : (allowOverload ? 'royalblue' : 'darkorange'));
  rect(x + 1, by + 1, max(0, fw - 2), bh - 2, 2);
  // scale labels
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('0', x, by + bh + 2);
  textAlign(CENTER, TOP);
  text(maxV + (allowOverload ? ' (limit)' : ''), x + scaleW, by + bh + 2);
  fill(over ? 'red' : 'black');
  textSize(13);
  textStyle(BOLD);
  textAlign(RIGHT, TOP);
  text(valueText, x + w, y);
  textStyle(NORMAL);
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
