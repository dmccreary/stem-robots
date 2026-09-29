// Hardware Troubleshooting Detective
// CANVAS_HEIGHT: 480
// Bloom L4 (Analyze): use the six troubleshooting checks from Chapter 2 to
// narrow down a hidden hardware fault, and justify which check to run first.
// Each broken robot shows a symptom. Checks cost points, so the best
// detectives pick the check that rules out the most suspects first.
// Rings on the robot: green = looks fine, amber = a clue, red = found it.

let canvasWidth = 700;
let drawHeight = 352;
let controlHeight = 128;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let checkButtons = [];
let hypSelect, submitButton, hintButton, newButton;
let lastWidth = 0;

// The six checks, in the same order as the chapter checklist.
// part = where the highlight ring goes on the robot drawing (local coordinates)
const CHECKS = [
  { label: 'Is it powered?', part: { x: 88, y: 100, r: 26 },
    fine: 'Green power LED is on. Power is fine.' },
  { label: 'Is the program uploaded?', part: { x: 160, y: 118, r: 34 },
    fine: 'The board\'s file list shows main.py. Looks fine.' },
  { label: 'Are all wires seated?', part: { x: 246, y: 142, r: 26 },
    fine: 'Every wire stays put when you tug it. Looks fine.' },
  { label: 'Is anything reversed?', part: { x: 160, y: 234, r: 46 },
    fine: 'Red goes to +, black goes to -. Looks fine.' },
  { label: 'Is the correct Grove port in use?', part: { x: 192, y: 58, r: 30 },
    fine: 'The sensor cable is in the GP16/GP17 port. Looks fine.' },
  { label: 'Do the onboard LEDs tell you anything?', part: { x: 160, y: 160, r: 30 },
    fine: 'The pin LEDs light up when the code sets them HIGH. Looks fine.' }
];

// The six faults. findBy = index of the check that finds it.
// clues = results other checks give for this fault (amber rings).
const FAULTS = [
  { name: 'USB cable not plugged in all the way', findBy: 0,
    symptom: 'Nothing happens when you plug the robot into the laptop.',
    found: 'The green power LED is off. The USB plug is only halfway in. Found it!',
    clues: { 1: 'Thonny cannot connect, so you cannot see the board\'s files. Hmm.',
             5: 'Every LED is dark, even the green power LED. Hmm.' },
    hint: 'When nothing at all lights up, start with the power.',
    fix: 'Push the USB plug all the way in, then look for the green power LED.' },
  { name: 'Program saved on the laptop, not the board', findBy: 1,
    symptom: 'The robot worked while plugged into Thonny, but after a restart it does nothing.',
    found: 'The board\'s file list has no main.py. It is only on the laptop. Found it!',
    clues: { 5: 'The pin LEDs never light up. No program seems to be running. Hmm.' },
    hint: 'Where does the board look for a program when it restarts?',
    fix: 'Save the program to the board as main.py, then restart the robot.' },
  { name: 'Motor wire loose in M2', findBy: 2,
    symptom: 'The robot spins in a circle instead of driving straight.',
    found: 'The right motor wire pulls out of the M2 terminal with a gentle tug. Found it!',
    clues: {},
    hint: 'A robot that circles usually has one wheel that is not getting power.',
    fix: 'Loosen the M2 screw, reinsert the wire, tighten, and tug to test.' },
  { name: 'Battery pack plugged in backward', findBy: 3,
    symptom: 'The robot works on USB power, but does nothing on battery power.',
    found: 'The red battery wire goes to the - terminal. The pack is reversed. Found it!',
    clues: { 0: 'The green LED is on with USB, but goes dark on batteries alone. Hmm.' },
    hint: 'USB works and batteries do not. What is different about the battery connection?',
    fix: 'Unplug the pack right away and reconnect it: red to +, black to -.' },
  { name: 'Sensor cable in the wrong Grove port', findBy: 4,
    symptom: 'The robot drives straight into the wall. The distance reading never changes.',
    found: 'The sensor cable is in the GP0/GP1 port, not GP16/GP17. Found it!',
    clues: {},
    hint: 'The code reads the sensor on two specific pins. Is the sensor on those pins?',
    fix: 'Move the Grove cable to the port labeled GP16/GP17.' },
  { name: 'Code never sets the LED pin HIGH', findBy: 5,
    symptom: 'The program runs with no errors, but the headlight LED never turns on.',
    found: 'The headlight pin\'s blue LED stays dark. The code never sets it HIGH. Found it!',
    clues: {},
    hint: 'The board has an LED for every pin. It shows what the code is doing.',
    fix: 'Add a line that sets the headlight pin to 1 (HIGH), then test again.' }
];

// game state
let fault = -1;          // index of the hidden fault
let caseNumber = 0;
let used = [];           // results per check: null, 'fine', 'clue', 'found'
let score = 100;
let checksUsed = 0;
let solved = false;
let streak = 0;          // robots solved in a row with a score of 60 or more
let log = [];            // { text, kind } newest first

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const mainEl = document.querySelector('main');
  canvas.parent(mainEl);
  textSize(defaultTextSize);

  CHECKS.forEach((c, i) => {
    const b = createButton(c.label);
    b.parent(mainEl);
    b.style('line-height', '1.1');
    b.style('padding', '2px 4px');
    b.mousePressed(() => runCheck(i));
    checkButtons.push(b);
  });

  hypSelect = createSelect();
  hypSelect.parent(mainEl);
  hypSelect.option('Not sure yet');
  for (const f of FAULTS) hypSelect.option(f.name);
  hypSelect.style('font-size', '14px');

  submitButton = createButton('Submit hypothesis');
  submitButton.parent(mainEl);
  submitButton.mousePressed(submitHypothesis);
  hintButton = createButton('Show hint (-10)');
  hintButton.parent(mainEl);
  hintButton.mousePressed(showHint);
  newButton = createButton('New broken robot');
  newButton.parent(mainEl);
  newButton.mousePressed(newRobot);
  for (const b of [submitButton, hintButton, newButton]) b.style('font-size', '14px');

  newRobot();
  positionControls();
  describe('A top view of a robot with a Cytron board, two motors, a battery pack, a Grove sensor cable, and a USB cable, next to a case panel with a symptom, a score, and a results log. Six check buttons inspect parts of the robot and draw green, amber, or red rings. Choose a hypothesis from the dropdown and submit it to solve the case.', LABEL);
}

// Rows 1-2: the six checks in three columns. Row 3: hypothesis tools.
function positionControls() {
  const narrow = canvasWidth < 560;
  const gap = 6;
  const colW = (canvasWidth - 20 - 2 * gap) / 3;
  checkButtons.forEach((b, i) => {
    const r = floor(i / 3), c = i % 3;
    b.position(10 + c * (colW + gap), drawHeight + 6 + r * 40);
    b.size(colW, 36);
    b.style('font-size', narrow ? '12px' : '14px');
  });
  submitButton.html(narrow ? 'Submit' : 'Submit hypothesis');
  hintButton.html(narrow ? 'Hint' : 'Show hint (-10)');
  newButton.html(narrow ? 'New robot' : 'New broken robot');
  const y = drawHeight + 92;
  const bw = [narrow ? 62 : 140, narrow ? 50 : 125, narrow ? 84 : 140];
  const selW = canvasWidth - 20 - bw[0] - bw[1] - bw[2] - 3 * gap;
  hypSelect.position(10, y + 3);
  hypSelect.size(selW, 28);
  submitButton.position(10 + selW + gap, y);
  submitButton.size(bw[0], 32);
  hintButton.position(10 + selW + bw[0] + 2 * gap, y);
  hintButton.size(bw[1], 32);
  newButton.position(10 + selW + bw[0] + bw[1] + 3 * gap, y);
  newButton.size(bw[2], 32);
}

// pick a new random fault, never the same one twice in a row
function newRobot() {
  let f;
  do { f = floor(random(FAULTS.length)); } while (f === fault);
  fault = f;
  caseNumber++;
  used = CHECKS.map(() => null);
  score = 100;
  checksUsed = 0;
  solved = false;
  log = [{ text: 'New case! Read the symptom, then pick the check that rules out the most.', kind: 'info' }];
  hypSelect.selected('Not sure yet');
  updateButtons();
}

function runCheck(i) {
  if (solved || used[i]) return;
  const F = FAULTS[fault];
  let text, kind;
  if (F.findBy === i) { text = F.found; kind = 'found'; }
  else if (F.clues[i]) { text = F.clues[i]; kind = 'clue'; }
  else { text = CHECKS[i].fine; kind = 'fine'; }
  used[i] = kind;
  checksUsed++;
  score = max(0, score - 10);
  log.unshift({ text: CHECKS[i].label + ' ' + text, kind: kind });
  updateButtons();
}

function submitHypothesis() {
  if (solved) return;
  const pick = hypSelect.value();
  if (pick === 'Not sure yet') {
    log.unshift({ text: 'Pick a hypothesis from the list first.', kind: 'info' });
    return;
  }
  if (pick === FAULTS[fault].name) {
    solved = true;
    if (score >= 60) streak++; else streak = 0;
    log.unshift({ text: 'Solved with a score of ' + score + '! Fix: ' + FAULTS[fault].fix, kind: 'solved' });
  } else {
    score = max(0, score - 20);
    log.unshift({ text: 'Not this one. What did the checks tell you?', kind: 'wrong' });
  }
  updateButtons();
}

function showHint() {
  if (solved) return;
  score = max(0, score - 10);
  log.unshift({ text: 'Hint: ' + FAULTS[fault].hint, kind: 'hint' });
}

function updateButtons() {
  checkButtons.forEach((b, i) => {
    if (solved || used[i]) b.attribute('disabled', ''); else b.removeAttribute('disabled');
  });
  for (const b of [submitButton, hintButton]) {
    if (solved) b.attribute('disabled', ''); else b.removeAttribute('disabled');
  }
}

// ---------------- drawing ----------------
function draw() {
  updateCanvasSize();
  stroke('silver'); strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  noStroke(); fill('black'); textAlign(CENTER, TOP); textSize(narrow ? 18 : 22);
  text('Hardware Troubleshooting Detective', canvasWidth / 2, 6);

  let R, P;
  if (!narrow) {
    R = { x: 0, y: 32, w: canvasWidth * 0.52, h: drawHeight - 36 };
    P = { x: canvasWidth * 0.52 + 4, y: 36, w: canvasWidth * 0.48 - 14, h: drawHeight - 44 };
  } else {
    R = { x: 0, y: 30, w: canvasWidth * 0.5, h: 196 };
    P = { x: 8, y: 230, w: canvasWidth - 16, h: drawHeight - 236 };
  }
  drawRobot(R);
  if (narrow) drawCaseNarrow(canvasWidth * 0.5, 34, canvasWidth * 0.5 - 8, 190);
  drawPanel(P, narrow);
}

// text size in the scaled drawing that is never smaller than 10 px on screen
let robotScale = 1;
function ts(px) { return max(10, px * robotScale) / robotScale; }

// Robot top view drawn in a 320 x 290 local box, scaled to fit region R
function drawRobot(R) {
  const s = min(R.w / 330, R.h / 292);
  robotScale = s;
  push();
  translate(R.x + (R.w - 320 * s) / 2, R.y);
  scale(s);

  const F = FAULTS[fault];
  const found = solved || used[F.findBy] === 'found';
  const reveal = i => found && F.findBy === i;

  // chassis and wheels
  stroke('gray'); strokeWeight(2); fill('whitesmoke');
  rect(40, 20, 240, 262, 18);
  noStroke(); fill('dimgray');
  rect(20, 150, 18, 80, 4); rect(282, 150, 18, 80, 4);

  // distance sensor at the front
  fill('black'); rect(138, 6, 44, 18, 3);
  fill('dimgray'); textSize(12); textAlign(CENTER, BOTTOM);
  noStroke();

  // Grove cable from the sensor to a port on the board
  const portX = reveal(4) ? 118 : 202;
  stroke('gold'); strokeWeight(5); noFill();
  bezier(160, 24, 160, 50, portX, 50, portX, 82);

  // Cytron board
  stroke('black'); strokeWeight(2); fill('teal');
  rect(95, 80, 130, 92, 6);
  // Grove ports along the top edge (GP0/GP1 left, GP16/GP17 right)
  noStroke(); fill('white');
  rect(110, 82, 16, 9, 1); rect(152, 82, 16, 9, 1); rect(194, 82, 16, 9, 1);

  // power LED (gray until inspected) and pin LEDs
  const powerKnown = used[0] !== null;
  const powerOff = (F.findBy === 0 && used[0]) || (fault === 3 && used[0] === 'clue');
  stroke('black'); strokeWeight(1);
  fill(!powerKnown ? 'gray' : (powerOff ? 'darkslategray' : 'lime'));
  circle(104, 148, 9);
  const ledKnown = used[5] !== null;
  const ledsDark = [0, 1, 5].includes(fault);
  for (let k = 0; k < 6; k++) {
    let c = 'gray';
    if (ledKnown) c = ledsDark ? 'darkslategray' : (k % 2 === 0 ? 'deepskyblue' : 'darkslategray');
    fill(c); circle(122 + k * 16, 162, 8);
  }

  // USB cable on the left, plug pulled out if that is the fault
  const plugX = reveal(0) ? 70 : 84;
  stroke('black'); strokeWeight(5);
  line(0, 70, plugX - 6, 98);
  noStroke(); fill('silver');
  rect(plugX - 8, 92, 14, 12, 2);

  // motors and motor wires (M1 left, M2 right)
  stroke('black'); strokeWeight(1.5); fill('gold');
  rect(46, 160, 36, 56, 4); rect(238, 160, 36, 56, 4);
  stroke('firebrick'); strokeWeight(3);
  line(95, 134, 64, 160);
  if (reveal(2)) line(225, 134, 238, 144); else line(225, 134, 256, 160);

  // battery pack and its wires to the power terminal
  stroke('black'); strokeWeight(1.5); fill('dimgray');
  rect(112, 206, 96, 56, 5);
  for (let k = 0; k < 4; k++) { fill('darkgray'); rect(118 + k * 22, 214, 18, 40, 3); }
  const swapped = reveal(3);
  strokeWeight(3);
  stroke(swapped ? 'black' : 'red'); line(150, 206, 150, 172);
  stroke(swapped ? 'red' : 'black'); line(170, 206, 170, 172);
  // highlight rings for the checks that have been run
  CHECKS.forEach((c, i) => {
    if (!used[i]) return;
    const col = used[i] === 'found' ? 'red' : (used[i] === 'clue' ? 'orange' : 'limegreen');
    noFill(); stroke(col); strokeWeight(4);
    circle(c.part.x, c.part.y, c.part.r * 2);
  });

  // labels last, so rings never cover them
  noStroke(); fill('white'); textAlign(CENTER, TOP);
  const tiny = robotScale < 0.8; // shorter silkscreen labels on small drawings
  textSize(ts(9));
  text(tiny ? '0/1' : 'GP0/1', 118, 93); text(tiny ? '16/17' : 'GP16/17', 202, 93);
  textSize(ts(11));
  if (tiny) text('RP2040', 160, 112);
  else { text('Maker Pi', 160, 106); text('RP2040', 160, 106 + ts(11) + 1); }
  textAlign(LEFT, CENTER); textSize(ts(9)); text('PWR', 112, 148);
  if (reveal(1)) { fill('mistyrose'); textAlign(CENTER, TOP); textSize(ts(10)); text('no main.py', 160, 132); }
  fill('black'); textSize(ts(12)); textAlign(CENTER, CENTER);
  text('M1', 64, 188); text('M2', 256, 188);
  textAlign(CENTER, BOTTOM);
  text('+', 143, 190); text('-', 177, 190);
  textAlign(LEFT, CENTER); text('Distance sensor', 186, 14);
  textAlign(CENTER, TOP); text('Battery pack', 160, 266);
  textAlign(LEFT, CENTER); text('USB', 4, 56);
  pop();
}

// on narrow screens the case card sits beside the robot drawing
function drawCaseNarrow(x, y, w, h) {
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, y, w, h, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP);
  textSize(13); textStyle(BOLD);
  text('Case #' + caseNumber + ' symptom:', x + 8, y + 6);
  textStyle(NORMAL); textSize(12);
  text(FAULTS[fault].symptom, x + 8, y + 24, w - 16, 70);
  textSize(13); textStyle(BOLD);
  text('Score: ' + score, x + 8, y + 98);
  textStyle(NORMAL); textSize(12);
  text('Checks used: ' + checksUsed + ' of 6', x + 8, y + 118);
  text('Solved in a row (60+): ' + streak, x + 8, y + 136, w - 16, 50);
}

function drawPanel(P, narrow) {
  stroke('silver'); strokeWeight(1); fill('white');
  rect(P.x, P.y, P.w, P.h, 8);
  noStroke(); textAlign(LEFT, TOP);
  let y = P.y + 8;
  const x = P.x + 10, w = P.w - 20;

  if (!narrow) {
    fill('black'); textSize(15); textStyle(BOLD);
    text('Case #' + caseNumber + ' symptom:', x, y); y += 20;
    textStyle(NORMAL); textSize(14); fill('midnightblue');
    const sl = wrapText(FAULTS[fault].symptom, w);
    for (const ln of sl) { text(ln, x, y); y += 17; }
    y += 6;
    fill('black'); textSize(14); textStyle(BOLD);
    text('Score: ' + score, x, y);
    textStyle(NORMAL);
    text('Checks used: ' + checksUsed + ' of 6', x + 100, y); y += 19;
    fill('dimgray'); textSize(13);
    text('Solved in a row with 60 or more: ' + streak, x, y); y += 20;
    stroke('gainsboro'); line(x, y, x + w, y); noStroke(); y += 6;
  }

  fill('black'); textSize(13); textStyle(BOLD);
  text('Results log (newest first)', x, y); y += 18;
  textStyle(NORMAL);
  const ts = narrow ? 12 : 13, lh = ts + 3;
  textSize(ts);
  for (let i = 0; i < log.length; i++) {
    const e = log[i];
    textStyle(e.kind === 'found' || e.kind === 'solved' ? BOLD : NORMAL);
    const lines = wrapText(e.text, w - 14);
    if (y + lines.length * lh > P.y + P.h - 4) break;
    const col = { fine: 'darkgreen', clue: 'darkorange', found: 'firebrick', solved: 'darkgreen',
      wrong: 'firebrick', hint: 'purple', info: 'dimgray' }[e.kind];
    fill(col);
    circle(x + 4, y + ts / 2 + 1, 7);
    for (const ln of lines) { text(ln, x + 14, y); y += lh; }
    y += 4;
  }
  textStyle(NORMAL);
}

// split text into lines that fit a width at the current text size
function wrapText(s, w) {
  const words = s.split(' ');
  const out = [];
  let cur = '';
  for (const word of words) {
    const t = cur ? cur + ' ' + word : word;
    if (textWidth(t) > w && cur) { out.push(cur); cur = word; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof newButton !== 'undefined' && canvasWidth !== lastWidth) {
    lastWidth = canvasWidth;
    positionControls();
  }
}
