// Voltage and Current Water Analogy
// CANVAS_HEIGHT: 445
// Bloom L2 (Understand / Explain): voltage is like water pressure, current is
// like water flow. A water loop and a robot circuit sit side by side and obey
// the same two sliders, so students can predict and then check what changes.
// Current = Voltage / Resistance (Ohm's law). Loop path and battery symbol
// adapted from learning-micropython/ohms-law-calculator.

let canvasWidth = 700;
let drawHeight = 330;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 235;
let defaultTextSize = 16;

let voltSlider, resSlider, loopButton;
let loopOpen = false;
let flowOffset = 0;       // position of the moving dots around the loop (0-1)
let mouseInside = false;  // dots move only while the reader is using the sim
let lastWidth = 0;

const VOLTS_PER_BATTERY = 1.5;
const MAX_CURRENT = 1.2;   // 6.0 V across 5 ohms, the fastest flow

// colors from the specification
const PIPE_COLOR = '#1976d2';
const WIRE_COLOR = '#1a237e';
const MOTOR_COLOR = '#e65100';

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  mainEl.addEventListener('mouseenter', () => mouseInside = true);
  mainEl.addEventListener('mouseleave', () => mouseInside = false);
  textSize(defaultTextSize);

  voltSlider = createSlider(1, 4, 4, 1);     // number of AA batteries in series
  voltSlider.parent(mainEl);
  resSlider = createSlider(5, 30, 12, 1);    // motor resistance in ohms
  resSlider.parent(mainEl);

  loopButton = createButton('Break the loop');
  loopButton.parent(mainEl);
  loopButton.style('font-size', '15px');
  loopButton.mousePressed(() => {
    loopOpen = !loopOpen;
    loopButton.html(loopOpen ? 'Fix the loop' : 'Break the loop');
  });

  positionControls();
  describe('Two matching loops side by side. On the left, a pump pushes blue water dots around a pipe with a narrow section. On the right, a battery pack pushes yellow charge dots around a wire through a motor. Sliders set the number of batteries (voltage) and the motor resistance; both loops show the same pressure or voltage and the same flow or current, calculated as voltage divided by resistance. A button breaks the loop to stop all flow.', LABEL);
}

function positionControls() {
  const w = max(100, canvasWidth - sliderLeftMargin - margin);
  voltSlider.position(sliderLeftMargin, drawHeight + 8);
  voltSlider.size(w);
  resSlider.position(sliderLeftMargin, drawHeight + 43);
  resSlider.size(w);
  loopButton.position(10, drawHeight + 78);
}

function draw() {
  updateCanvasSize();

  // model
  const batteries = voltSlider.value();
  const volts = batteries * VOLTS_PER_BATTERY;
  const ohms = resSlider.value();
  const amps = loopOpen ? 0 : volts / ohms;
  if (mouseInside && !loopOpen) flowOffset = (flowOffset + (amps / MAX_CURRENT) * 0.006) % 1;

  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black');
  textAlign(CENTER, TOP); textSize(canvasWidth < 500 ? 18 : 22);
  text('Voltage and Current: The Water Analogy', canvasWidth / 2, 8);

  // two panels: side by side on wide screens, stacked (water on top) on narrow ones
  const wide = canvasWidth >= 620;
  let P1, P2;
  if (wide) {
    const pw = (canvasWidth - 30) / 2, ph = drawHeight - 36 - 40;
    P1 = { x: 10, y: 38, w: pw, h: ph };
    P2 = { x: 20 + pw, y: 38, w: pw, h: ph };
  } else {
    const pw = canvasWidth - 20, ph = (drawHeight - 38 - 40) / 2;
    P1 = { x: 10, y: 38, w: pw, h: ph };
    P2 = { x: 10, y: 38 + ph + 4, w: pw, h: ph };
  }
  drawPanel(P1, 'water', volts, ohms, amps);
  drawPanel(P2, 'circuit', volts, ohms, amps);

  // open-circuit banner
  if (loopOpen) {
    const bw = min(320, canvasWidth - 40);
    noStroke(); fill('firebrick');
    rect(canvasWidth / 2 - bw / 2, drawHeight - 34, bw, 28, 6);
    fill('white'); textStyle(BOLD); textSize(16); textAlign(CENTER, CENTER);
    text('Open circuit: no flow', canvasWidth / 2, drawHeight - 20);
    textStyle(NORMAL);
  } else {
    noStroke(); fill('dimgray'); textSize(14); textAlign(CENTER, CENTER);
    text('Same push, same flow: both loops follow the same rule.', canvasWidth / 2, drawHeight - 20);
  }

  // control labels and the formula
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(15);
  text('Voltage: ' + batteries + (batteries === 1 ? ' battery' : ' batteries') + ' = ' + nf(volts, 1, 1) + ' V', 10, drawHeight + 18);
  text('Motor resistance: ' + ohms + ' ohms', 10, drawHeight + 53);
  textStyle(BOLD); textSize(16);
  const fx = 150;
  if (loopOpen) {
    fill('firebrick');
    text('Loop is open, so Current = 0 A', fx, drawHeight + 92);
  } else {
    fill('black');
    const formula = nf(volts, 1, 1) + ' V / ' + ohms + ' ohms = ' + nf(amps, 1, 2) + ' A';
    text((canvasWidth < 480 ? '' : 'Current = ') + formula, fx, drawHeight + 92);
  }
  textStyle(NORMAL);
}

// One loop: 'water' (pump, pipe, narrow pipe) or 'circuit' (battery, wire, motor)
function drawPanel(P, kind, volts, ohms, amps) {
  const isWater = kind === 'water';
  const small = P.h < 150; // stacked panels on narrow screens

  // panel background and header
  stroke('lightsteelblue'); strokeWeight(1); fill('ghostwhite');
  rect(P.x, P.y, P.w, P.h, 8);
  noStroke(); fill('black'); textStyle(BOLD); textSize(15); textAlign(LEFT, TOP);
  text(isWater ? 'Water Loop' : 'Robot Circuit', P.x + 10, P.y + 5);
  textStyle(NORMAL);

  // loop geometry, with room outside the loop for the side labels.
  // Wide panels put the meters under the loop; short panels put them inside it.
  const lx = P.x + 86, rx = P.x + P.w - 92;
  const topY = P.y + (small ? 30 : 36);
  const botY = small ? P.y + P.h - 10 : P.y + P.h - 84;
  const midY = (topY + botY) / 2;
  const gapX = lx + (rx - lx) * 0.6; // where the loop breaks when it is opened

  // the loop itself
  const thick = isWater ? 16 : 4;
  const col = isWater ? PIPE_COLOR : WIRE_COLOR;
  noFill(); stroke(col); strokeWeight(thick); strokeJoin(ROUND);
  rect(lx, topY, rx - lx, botY - topY);
  if (isWater) {
    // water inside the pipe
    stroke('lightskyblue'); strokeWeight(10);
    rect(lx, topY, rx - lx, botY - topY);
    // narrow pipe section on the right side: thinner as resistance goes up
    const narrowH = min(60, (botY - topY) * 0.5);
    const nw = map(ohms, 5, 30, 12, 3);
    stroke('ghostwhite'); strokeWeight(20);
    line(rx, midY - narrowH / 2, rx, midY + narrowH / 2);
    stroke(PIPE_COLOR); strokeWeight(nw + 6);
    line(rx, midY - narrowH / 2, rx, midY + narrowH / 2);
    stroke('lightskyblue'); strokeWeight(nw);
    line(rx, midY - narrowH / 2 - 4, rx, midY + narrowH / 2 + 4);
  }

  // break in the loop (closed valve or open switch)
  if (loopOpen) {
    stroke('ghostwhite'); strokeWeight(thick + 6);
    line(gapX - 14, topY, gapX + 14, topY);
    if (isWater) {
      stroke('firebrick'); strokeWeight(5);
      line(gapX - 14, topY - 12, gapX - 14, topY + 12);
      line(gapX + 14, topY - 12, gapX + 14, topY + 12);
    } else {
      stroke(WIRE_COLOR); strokeWeight(4);
      line(gapX - 14, topY, gapX + 10, topY - 12); // switch lever lifted up
      noStroke(); fill('firebrick');
      circle(gapX - 14, topY, 8); circle(gapX + 14, topY, 8);
    }
  }

  // moving dots: blue water or yellow charge, same speed in both loops
  drawDots(lx, rx, topY, botY, isWater);

  // the push (left side) and the load (right side)
  if (isWater) drawPump(lx, midY);
  else drawBattery(lx, midY);
  if (!isWater) drawMotor(rx, midY);

  // labels outside the loop that map the two pictures onto each other
  noStroke(); textSize(small ? 12 : 13); fill('black');
  textAlign(RIGHT, CENTER);
  if (isWater) {
    text('Pump', lx - 22, midY - 9);
    text('= Battery', lx - 22, midY + 8);
  } else {
    text('Battery', lx - 14, midY - 18);
    text('pack', lx - 14, midY - 4);
    textStyle(BOLD); fill(WIRE_COLOR);
    text(nf(volts, 1, 1) + ' V', lx - 14, midY + 14);
    textStyle(NORMAL); fill('black');
  }
  textAlign(LEFT, CENTER);
  if (isWater) {
    text('Narrow pipe', rx + 14, midY - 8);
    text('= Motor', rx + 14, midY + 8);
  } else {
    text('Motor', rx + 24, midY - 8);
    text('(the load)', rx + 24, midY + 8);
  }

  // meters for the push and the flow
  let ix, iw, iy, rowH;
  if (small) {
    ix = lx + 20; iw = rx - lx - 40; iy = topY + 12; rowH = 26;
  } else {
    ix = P.x + 16; iw = P.w - 32; iy = botY + 20; rowH = 30;
  }
  const pushLabel = isWater ? 'Pressure' : 'Voltage';
  const flowLabel = isWater ? 'Flow' : 'Current';
  const pushVal = isWater ? 'like ' + nf(volts, 1, 1) + ' V' : nf(volts, 1, 1) + ' V';
  const flowVal = isWater ? 'like ' + nf(amps, 1, 2) + ' A' : nf(amps, 1, 2) + ' A';
  drawMeter(ix, iy, iw, pushLabel, pushVal, volts / 6.0, 'mediumpurple', small);
  drawMeter(ix, iy + rowH, iw, flowLabel, flowVal, amps / MAX_CURRENT, isWater ? 'royalblue' : 'goldenrod', small);
}

// a labeled horizontal bar: label and value on one line, bar underneath
function drawMeter(x, y, w, label, val, frac, col, small) {
  noStroke(); fill('black'); textSize(small ? 12 : 13);
  textAlign(LEFT, TOP); text(label, x, y);
  textAlign(RIGHT, TOP); textStyle(BOLD); text(val, x + w, y); textStyle(NORMAL);
  const by = y + (small ? 14 : 16);
  fill('gainsboro'); rect(x, by, w, 7, 3);
  fill(col); rect(x, by, w * constrain(frac, 0, 1), 7, 3);
}

function drawDots(lx, rx, topY, botY, isWater) {
  const W = rx - lx, H = botY - topY, total = 2 * (W + H);
  const n = 14;
  for (let i = 0; i < n; i++) {
    const t = (i / n + flowOffset) % 1;
    const p = posOnLoop(t, lx, rx, topY, botY, W, H, total);
    if (isWater) { noStroke(); fill('royalblue'); circle(p.x, p.y, 7); }
    else { stroke('black'); strokeWeight(1); fill('gold'); circle(p.x, p.y, 8); }
  }
}

// Clockwise around the loop: up the left side, across the top, down the right, back
function posOnLoop(t, lx, rx, topY, botY, W, H, total) {
  let d = t * total;
  if (d < H) return { x: lx, y: botY - d };
  d -= H;
  if (d < W) return { x: lx + d, y: topY };
  d -= W;
  if (d < H) return { x: rx, y: topY + d };
  d -= H;
  return { x: rx - d, y: botY };
}

// pump: a round housing with an arrow showing which way it pushes the water
function drawPump(x, y) {
  stroke(PIPE_COLOR); strokeWeight(3); fill('white');
  circle(x, y, 32);
  noStroke(); fill(PIPE_COLOR);
  triangle(x - 8, y + 6, x + 8, y + 6, x, y - 9);
}

// battery symbol: long plate (+) on top, short plate (-) below, across the wire
function drawBattery(x, y) {
  stroke('ghostwhite'); strokeWeight(8);
  line(x, y - 12, x, y + 6);
  stroke(WIRE_COLOR); strokeWeight(3);
  line(x - 13, y - 8, x + 13, y - 8);
  line(x - 7, y + 2, x + 7, y + 2);
  noStroke(); fill(WIRE_COLOR); textSize(12); textAlign(LEFT, CENTER);
  text('+', x + 15, y - 12);
}

function drawMotor(x, y) {
  stroke('black'); strokeWeight(2); fill(MOTOR_COLOR);
  circle(x, y, 34);
  noStroke(); fill('white'); textStyle(BOLD); textSize(16); textAlign(CENTER, CENTER);
  text('M', x, y + 1);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof voltSlider !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
