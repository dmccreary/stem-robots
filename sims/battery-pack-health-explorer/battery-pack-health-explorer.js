// Battery Pack Health Explorer
// CANVAS_HEIGHT: 450
// Bloom L4 (Analyze): connect the voltage of a four-AA battery pack to motor
// speed and to the risk that the RP2040 microcontroller resets.
//
// Simplified teaching model (from the chapter 1 specification):
//   each battery  = 0.9 + 0.6 * (charge / 100) volts  (1.5 V fresh, 0.9 V worn out)
//   pack voltage  = 4 * battery voltage               (6.0 V fresh, 3.6 V worn out)
//   motor speed   = (pack voltage / 6.0) * commanded duty fraction
//   reset risk    = pack voltage below 4.5 V

let canvasWidth = 700;
let drawHeight = 335;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 190;
let defaultTextSize = 16;

let chargeSlider, commandRadio, freshButton, wearCheckbox;
let charge = 100;        // battery charge in percent (fractional while wearing down)
let wheelPhase = 0;      // tread animation phase
let mouseInside = false; // animate the wheels only while the reader is using the sim
let lastWidth = 0;       // width the controls were last positioned for

const RESET_VOLTS = 4.5; // below this the board may reset
const FULL_VOLTS = 6.0;  // four fresh AA cells

// battery colors from the specification
const FRESH_COLOR = '#43a047';
const MID_COLOR = '#fdd835';
const WEAK_COLOR = '#e53935';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  mainEl.addEventListener('mouseenter', () => mouseInside = true);
  mainEl.addEventListener('mouseleave', () => mouseInside = false);
  textSize(defaultTextSize);

  // Row 1: battery charge slider (5% steps)
  chargeSlider = createSlider(0, 100, 100, 5);
  chargeSlider.parent(mainEl);
  chargeSlider.input(() => { charge = chargeSlider.value(); });

  // Row 2: what the program asks the motors to do
  commandRadio = createRadio();
  commandRadio.parent(mainEl);
  commandRadio.option('full', 'Full speed (duty 65535)');
  commandRadio.option('half', 'Half speed (duty 32768)');
  commandRadio.selected('full');
  commandRadio.style('font-size', '15px');

  // Row 3: fresh batteries button and wear-down toggle
  freshButton = createButton('Swap in fresh batteries');
  freshButton.parent(mainEl);
  freshButton.style('font-size', '15px');
  freshButton.mousePressed(() => {
    charge = 100;
    chargeSlider.value(100);
    wearCheckbox.checked(false);
  });

  wearCheckbox = createCheckbox('Wear down over time', false);
  wearCheckbox.parent(mainEl);
  wearCheckbox.style('font-size', '15px');

  positionControls();
  describe('Four AA batteries connected in series above a 0 to 6 volt pack-voltage bar, a top view of a two-wheeled robot, a Brain (RP2040) status lamp, and a Sparky speech bubble. A battery charge slider, a full or half speed command, a fresh-battery button, and a wear-down toggle change the pack voltage, the motor speed, and whether the board is at risk of resetting.', LABEL);
}

function positionControls() {
  chargeSlider.position(sliderLeftMargin, drawHeight + 8);
  chargeSlider.size(max(100, canvasWidth - sliderLeftMargin - margin));
  // on narrow screens the radio buttons start at the left edge with no label
  commandRadio.position(isNarrow() ? 10 : 165, drawHeight + 45);
  freshButton.position(10, drawHeight + 79);
  wearCheckbox.position(210, drawHeight + 83);
}

function isNarrow() {
  return canvasWidth < 600;
}

function draw() {
  updateCanvasSize();

  // slow automatic drain: 1% per second while the toggle is on
  if (wearCheckbox.checked() && charge > 0) {
    charge = max(0, charge - min(deltaTime, 250) / 1000);
    chargeSlider.value(round(charge));
    if (charge <= 0) wearCheckbox.checked(false);
  }

  // model values (computed from the displayed whole-number charge)
  const c = round(charge);
  const cellVolts = 0.9 + 0.6 * (c / 100);
  const packVolts = 4 * cellVolts;
  const dutyFraction = commandRadio.value() === 'half' ? 0.5 : 1.0;
  const speedPct = (packVolts / FULL_VOLTS) * dutyFraction * 100;
  const resetRisk = packVolts < RESET_VOLTS;

  if (mouseInside) wheelPhase += speedPct / 100 * 1.6;

  // drawing and control regions
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke(); fill('black');
  textAlign(CENTER, TOP);
  textSize(isNarrow() ? 18 : 22);
  text('Battery Pack Health Explorer', canvasWidth / 2, 8);

  const L = computeLayout();
  drawBatteries(L, c, cellVolts);
  drawVoltageBar(L, packVolts);
  drawReadouts(L, packVolts, speedPct, resetRisk);
  drawRobot(L.robotX, L.robotY, L.robotScale, speedPct);
  drawLamp(L.lampX, L.lampY, resetRisk, L.small);
  drawSparky(L.sparkyX, L.sparkyY, L.sparkyW, packVolts, L.small);

  // control labels
  noStroke(); fill('black');
  textAlign(LEFT, CENTER); textSize(16);
  text('Battery charge: ' + c + '%', 10, drawHeight + 18);
  if (!isNarrow()) text('Program command:', 10, drawHeight + 55);
}

// Positions for every part of the drawing, for wide and narrow screens.
// Wide: batteries, bar and readouts on the left; Sparky, robot and lamp on the right.
// Narrow: batteries and bar span the full width; readouts, robot and lamp sit below.
function computeLayout() {
  const L = {};
  if (!isNarrow()) {
    const leftW = canvasWidth * 0.58;
    const rightX = leftW + 10;
    const rightW = canvasWidth - rightX - margin;
    L.small = false;
    L.packX = margin; L.packW = leftW - 2 * margin;
    L.packY = 70; L.cellH = 40; L.cellLabelSize = 15;
    L.packTitleY = 44;
    L.barX = margin + 10; L.barW = leftW - 2 * margin - 20;
    L.barY = 168; L.barH = 22;
    L.panelX = margin; L.panelY = 232; L.panelW = leftW - 2 * margin; L.panelH = 92;
    L.sparkyX = rightX; L.sparkyY = 44; L.sparkyW = rightW;
    L.robotX = rightX + rightW * 0.5; L.robotY = 200; L.robotScale = 1.0;
    L.lampX = rightX + rightW * 0.5 - 70; L.lampY = 298;
  } else {
    L.small = true;
    L.packX = margin; L.packW = canvasWidth - 2 * margin;
    L.packY = 50; L.cellH = 28; L.cellLabelSize = 13;
    L.packTitleY = 34;
    L.barX = margin + 10; L.barW = canvasWidth - 2 * margin - 20;
    L.barY = 126; L.barH = 18;
    L.panelX = margin - 10; L.panelY = 186; L.panelW = canvasWidth * 0.56 - margin; L.panelH = 96;
    L.sparkyX = margin - 10; L.sparkyY = 288; L.sparkyW = canvasWidth * 0.56 - margin;
    const rightX = canvasWidth * 0.56;
    L.robotX = rightX + (canvasWidth - rightX) * 0.5; L.robotY = 240; L.robotScale = 0.7;
    L.lampX = rightX + 6; L.lampY = 314;
  }
  return L;
}

// Four AA cells in a row, + of one touching - of the next (a series connection)
function drawBatteries(L, c, cellVolts) {
  noStroke(); fill('black');
  textAlign(LEFT, CENTER); textSize(L.small ? 14 : 16);
  text('4 AA batteries in series (+ to -)', L.packX, L.packTitleY);

  const slotW = L.packW / 4;
  const nubW = 6;
  const bodyW = slotW - nubW - 14;
  const bodyH = L.cellH;
  const col = batteryColor(c);

  for (let i = 0; i < 4; i++) {
    const x = L.packX + i * slotW;
    const y = L.packY;

    // wire from this cell's + nub to the next cell's - end
    if (i < 3) {
      stroke('dimgray'); strokeWeight(3);
      line(x + bodyW + nubW, y + bodyH / 2, x + slotW, y + bodyH / 2);
    }

    // battery body: white shell with a colored charge level
    stroke('black'); strokeWeight(1.5);
    fill('white');
    rect(x, y, bodyW, bodyH, 5);
    noStroke(); fill(col);
    const levelW = (bodyW - 4) * (c / 100);
    if (levelW > 0) rect(x + 2, y + 2, levelW, bodyH - 4, 4);
    // + nub on the right end
    stroke('black'); strokeWeight(1.5); fill('silver');
    rect(x + bodyW, y + bodyH * 0.3, nubW, bodyH * 0.4, 1);

    // - and + marks
    noStroke(); fill('black');
    textAlign(CENTER, CENTER); textSize(L.small ? 14 : 18);
    text('-', x + 9, y + bodyH / 2 - 1);
    text('+', x + bodyW - 10, y + bodyH / 2);

    // this cell's voltage
    textSize(L.cellLabelSize); textAlign(CENTER, TOP);
    text(nf(cellVolts, 1, 2) + ' V', x + bodyW / 2, y + bodyH + 5);
  }
}

// green at full charge, fading to yellow, then to red when weak
function batteryColor(c) {
  if (c >= 50) return lerpColor(color(MID_COLOR), color(FRESH_COLOR), (c - 50) / 50);
  return lerpColor(color(WEAK_COLOR), color(MID_COLOR), c / 50);
}

// Horizontal 0-6 V bar with red (<4.0), yellow (4.0-4.8) and green (4.8-6.0) zones
function drawVoltageBar(L, packVolts) {
  const vx = v => L.barX + (v / FULL_VOLTS) * L.barW;

  // (on narrow screens the readout panel names the value instead)
  if (!L.small) {
    noStroke(); fill('black');
    textAlign(LEFT, BOTTOM); textSize(16);
    text('Pack voltage', L.packX, L.barY - 16);
  }

  // zones
  noStroke();
  fill('lightcoral'); rect(vx(0), L.barY, vx(4.0) - vx(0), L.barH);
  fill('khaki'); rect(vx(4.0), L.barY, vx(4.8) - vx(4.0), L.barH);
  fill('lightgreen'); rect(vx(4.8), L.barY, vx(6.0) - vx(4.8), L.barH);
  noFill(); stroke('gray'); strokeWeight(1);
  rect(L.barX, L.barY, L.barW, L.barH);

  // tick marks every volt
  textSize(L.small ? 12 : 13); textAlign(CENTER, TOP);
  for (let v = 0; v <= 6; v++) {
    stroke('gray'); strokeWeight(1);
    line(vx(v), L.barY + L.barH, vx(v), L.barY + L.barH + 4);
    noStroke(); fill('dimgray');
    text(v + ' V', vx(v), L.barY + L.barH + 5);
  }

  // reset line at 4.5 V
  stroke('darkred'); strokeWeight(2);
  drawingContext.setLineDash([4, 3]);
  line(vx(RESET_VOLTS), L.barY - 4, vx(RESET_VOLTS), L.barY + L.barH + 4);
  drawingContext.setLineDash([]);
  noStroke(); fill('darkred');
  textSize(L.small ? 12 : 13); textAlign(RIGHT, TOP);
  text('reset line 4.5 V', vx(RESET_VOLTS) - 4, L.barY + L.barH + 22);

  // pointer at the current pack voltage
  const px = vx(packVolts);
  stroke('navy'); strokeWeight(3);
  line(px, L.barY - 2, px, L.barY + L.barH + 2);
  noStroke(); fill('navy');
  triangle(px - 7, L.barY - 12, px + 7, L.barY - 12, px, L.barY - 2);
  textAlign(CENTER, BOTTOM); textSize(L.small ? 13 : 15);
  text(nf(packVolts, 1, 2) + ' V', constrain(px, L.barX + 20, L.barX + L.barW - 20), L.barY - 13);
}

// Dark readout panel: pack voltage, motor speed, board status
function drawReadouts(L, packVolts, speedPct, resetRisk) {
  noStroke(); fill('midnightblue');
  rect(L.panelX, L.panelY, L.panelW, L.panelH, 8);

  const ts = L.small ? 13 : 15;
  const lineH = L.small ? 18 : 21;
  const x1 = L.panelX + 10;
  const x2 = L.panelX + L.panelW - 10;
  let y = L.panelY + 8;

  textSize(ts); textAlign(LEFT, TOP); fill('white');
  text('Pack voltage', x1, y);
  textAlign(RIGHT, TOP); text(nf(packVolts, 1, 2) + ' V', x2, y);
  y += lineH;
  textAlign(LEFT, TOP);
  text('Motor speed (% of best)', x1, y);
  textAlign(RIGHT, TOP); text(round(speedPct) + '%', x2, y);
  y += lineH;
  textAlign(LEFT, TOP);
  text('Board status', x1, y);
  textAlign(RIGHT, TOP);
  fill(resetRisk ? 'lightpink' : 'palegreen');
  text(resetRisk ? 'Reset risk' : 'OK', x2, y);
  y += lineH;

  textAlign(LEFT, TOP);
  textSize(L.small ? 12 : 14);
  if (resetRisk) {
    fill('lightpink');
    text('The board may reset or read sensors wrong.', x1, y, L.panelW - 20, 40);
  } else {
    fill('lightsteelblue');
    text('Voltage is high enough for the board.', x1, y, L.panelW - 20, 40);
  }
}

// Top view of the two-wheeled robot. Tread marks scroll at the motor speed,
// and the arrow in front grows with speed.
function drawRobot(cx, cy, s, speedPct) {
  const bodyW = 72 * s, bodyH = 92 * s;
  const wheelW = 18 * s, wheelH = 52 * s;

  // forward-motion arrow, length set by motor speed
  const arrowLen = map(speedPct, 0, 100, 4, s < 1 ? 24 : 46);
  const ay = cy - bodyH / 2 - 6;
  stroke('seagreen'); strokeWeight(4);
  line(cx, ay, cx, ay - arrowLen);
  noStroke(); fill('seagreen');
  triangle(cx - 8, ay - arrowLen, cx + 8, ay - arrowLen, cx, ay - arrowLen - 10);

  // chassis
  stroke('black'); strokeWeight(2); fill('whitesmoke');
  rect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH, 10 * s);
  // distance sensor at the front
  noStroke(); fill('black');
  rect(cx - 10 * s, cy - bodyH / 2 - 4 * s, 20 * s, 8 * s, 2);
  // brain board on top
  fill('teal');
  rect(cx - 22 * s, cy - 18 * s, 44 * s, 36 * s, 4);
  if (s >= 1) {
    fill('white'); textAlign(CENTER, CENTER); textSize(11);
    text('RP2040', cx, cy);
  }

  // two wheels, one on each side
  for (const side of [-1, 1]) {
    const wx = cx + side * (bodyW / 2 + wheelW / 2 + 2) - wheelW / 2;
    const wy = cy - wheelH / 2 + 8 * s;
    stroke('black'); strokeWeight(2); fill('#f9a825');
    rect(wx, wy, wheelW, wheelH, 5);
    // tread lines that scroll while the wheel turns
    stroke('saddlebrown'); strokeWeight(2);
    const gap = 10 * s;
    const off = (wheelPhase % gap);
    for (let t = wy + off; t < wy + wheelH - 2; t += gap) {
      if (t > wy + 2) line(wx + 3, t, wx + wheelW - 3, t);
    }
  }

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(s < 1 ? 12 : 14);
  text('Wheel speed ' + round(speedPct) + '%', cx, cy + bodyH / 2 + 8);
}

// "Brain (RP2040)" status lamp: steady green when OK, blinking red at reset risk
function drawLamp(x, y, resetRisk, small) {
  let lampColor = 'limegreen';
  if (resetRisk) lampColor = (floor(millis() / 400) % 2 === 0) ? 'red' : 'maroon';
  stroke('black'); strokeWeight(2); fill(lampColor);
  circle(x, y, small ? 20 : 26);
  noStroke(); fill('black');
  textAlign(LEFT, CENTER); textSize(small ? 13 : 16);
  text('Brain (RP2040)', x + (small ? 16 : 20), y - 8);
  fill(resetRisk ? 'firebrick' : 'darkgreen');
  text(resetRisk ? 'Reset risk' : 'OK', x + (small ? 16 : 20), y + 10);
}

// Sparky's speech bubble reacts to the pack voltage
function drawSparky(x, y, w, packVolts, small) {
  let msg = 'Fresh batteries!';
  if (packVolts < RESET_VOLTS) msg = 'Try new batteries!';
  else if (packVolts < 4.8) msg = 'Getting sluggish...';

  // tiny Sparky face: navy screen, white eyes, smile
  const fw = small ? 30 : 38, fh = small ? 26 : 32;
  stroke('black'); strokeWeight(2); fill('#1a237e');
  rect(x + 4, y + 4, fw, fh, 6);
  noStroke(); fill('white');
  ellipse(x + 4 + fw * 0.32, y + 4 + fh * 0.4, fw * 0.18, fh * 0.3);
  ellipse(x + 4 + fw * 0.68, y + 4 + fh * 0.4, fw * 0.18, fh * 0.3);
  noFill(); stroke('white'); strokeWeight(2);
  arc(x + 4 + fw / 2, y + 4 + fh * 0.62, fw * 0.45, fh * 0.3, 0, PI);

  // speech bubble with a tail pointing at Sparky
  const bx = x + fw + 16, bw = w - fw - 16, bh = small ? 30 : 36;
  stroke('gray'); strokeWeight(1.5); fill('white');
  rect(bx, y + 2, bw, bh, 10);
  noStroke(); fill('white');
  triangle(bx + 1, y + 12, bx + 1, y + 24, bx - 9, y + 18);
  stroke('gray'); strokeWeight(1.5);
  line(bx, y + 12, bx - 9, y + 18);
  line(bx - 9, y + 18, bx, y + 24);

  noStroke(); fill('black');
  textAlign(LEFT, CENTER); textSize(small ? 13 : 16);
  text(msg, bx + 10, y + 2 + bh / 2);
  textAlign(CENTER, TOP); textSize(12); fill('dimgray');
  text('Sparky', x + 4 + fw / 2, y + fh + 7);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  // move and resize the controls only when the width actually changes
  if (typeof chargeSlider !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
