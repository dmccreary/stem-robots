// Dance Beat Sequencer
// CANVAS_HEIGHT: 530
// Bloom L3 (Apply): convert a tempo in BPM into seconds per beat
// (seconds per beat = 60 / BPM) and arrange timed open-loop moves into an
// 8-beat robot dance. Each block on the timeline becomes one line of dance():
// a move function followed by sleep(beats x seconds per beat).

let canvasWidth = 800;
let drawHeight = 350;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let margin = 15;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

// ---------- moves ----------
const MOVES = {
  forward: { label: 'Forward', short: 'Fwd', code: 'go_forward()', color: 'seagreen' },
  back: { label: 'Back', short: 'Back', code: 'back()', color: 'darkorange' },
  spinL: { label: 'Spin left', short: 'Spin L', code: 'spin_left()', color: 'royalblue' },
  spinR: { label: 'Spin right', short: 'Spin R', code: 'spin_right()', color: 'darkorchid' },
  stop: { label: 'Stop motors', short: 'Stop', code: 'stop_motors()', color: 'gray' }
};
const MOVE_KEYS = ['forward', 'back', 'spinL', 'spinR', 'stop'];
const SLOTS = 16;                 // 8 beats, each split into two half-beat cells

// the 8-beat dance from Chapter 10 (start and length are in half-beat slots)
const CHAPTER_DANCE = [
  { move: 'forward', start: 0, len: 2 },   // beat 1
  { move: 'spinL', start: 2, len: 2 },     // beat 2
  { move: 'spinR', start: 4, len: 2 },     // beat 3
  { move: 'back', start: 6, len: 2 },      // beat 4
  { move: 'forward', start: 8, len: 4 },   // beats 5-6
  { move: 'spinL', start: 12, len: 1 },    // beat 7, first half
  { move: 'spinR', start: 13, len: 1 },    // beat 7, second half
  { move: 'stop', start: 14, len: 2 }      // beat 8
];

let blocks = [];
let selectedMove = 'forward';
let message = '';
let messageIsError = false;

// ---------- playback + stage ----------
let playing = false;
let beatPos = 0;                  // position of the playhead in beats (0 to 8)
let lastBeatShown = -1;
let flash = 0;
let timesPlayed = 0;
const STAGE_W = 300, STAGE_H = 150;
const HOME = { x: 40, y: 75, h: 0 };
let robot = { ...HOME };
let ideal = { ...HOME };          // where the robot would be with zero drift
let trail = [];
let audioCtx = null;

// ---------- layout ----------
let tl = { x: 10, y: 60, w: 780, h: 46 };  // timeline track
let stage = { x: 10, y: 170, w: 300, h: 150, s: 1 };
let codeBox = { x: 320, y: 170, w: 470, h: 160 };

// ---------- controls ----------
let moveButtons = {};
let playButton, stopButton, clearButton, loadButton, homeButton;
let lengthSelect, metroCheckbox, tempoSlider, driftSlider;
let lengthLabelX = 10;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mousePressed(timelineClick);
  textSize(defaultTextSize);

  for (const k of MOVE_KEYS) {
    const b = createButton(MOVES[k].label);
    b.parent(document.querySelector('main'));
    b.mousePressed(() => { selectedMove = k; styleMoveButtons(); showHint(); });
    moveButtons[k] = b;
  }
  styleMoveButtons();

  playButton = createButton('Play');
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(startPlay);
  stopButton = createButton('Stop');
  stopButton.parent(document.querySelector('main'));
  stopButton.mousePressed(stopPlay);
  clearButton = createButton('Clear');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(() => { stopPlay(); blocks = []; setMessage('Timeline cleared. Every empty cell is a rest (stop).', false); });
  loadButton = createButton('Load Chapter Dance');
  loadButton.parent(document.querySelector('main'));
  loadButton.mousePressed(loadChapterDance);
  homeButton = createButton('Home');
  homeButton.parent(document.querySelector('main'));
  homeButton.mousePressed(goHome);

  lengthSelect = createSelect();
  lengthSelect.parent(document.querySelector('main'));
  lengthSelect.option('half beat (0.5)', '1');
  lengthSelect.option('one beat (1)', '2');
  lengthSelect.option('two beats (2)', '4');
  lengthSelect.selected('2');

  metroCheckbox = createCheckbox(' Metronome click', true);
  metroCheckbox.parent(document.querySelector('main'));

  tempoSlider = createSlider(60, 180, 120, 5);
  tempoSlider.parent(document.querySelector('main'));
  driftSlider = createSlider(0, 10, 0, 1);
  driftSlider.parent(document.querySelector('main'));

  positionControls();
  loadChapterDance();

  describe('A robot dance sequencer. A timeline of 8 beats, each split into two half-beat cells, holds colored move ' +
    'blocks: Forward, Back, Spin left, Spin right, and Stop. A tempo slider sets beats per minute, and the sim shows ' +
    'seconds per beat = 60 divided by BPM and the total dance length. A stage shows a small robot performing the dance, ' +
    'and a code box shows the matching dance() function with sleep() times. A drift slider makes each move slightly off ' +
    'so repeated dances wander away from the expected spot.', LABEL);
}

function styleMoveButtons() {
  for (const k of MOVE_KEYS) {
    const b = moveButtons[k];
    const sel = (k === selectedMove);
    b.style('background-color', MOVES[k].color);
    b.style('color', 'white');
    b.style('border', sel ? '3px solid black' : '1px solid ' + MOVES[k].color);
    b.style('font-weight', sel ? 'bold' : 'normal');
    b.style('border-radius', '5px');
    b.style('padding', '2px 8px');
    b.style('font-size', '14px');
  }
}

function positionControls() {
  const y0 = drawHeight + 8;
  let x = 10;
  for (const k of MOVE_KEYS) {
    moveButtons[k].position(x, y0);
    x += (moveButtons[k].elt.offsetWidth || 70) + 6;
  }
  x = 10;
  for (const b of [playButton, stopButton, clearButton, loadButton, homeButton]) {
    b.position(x, y0 + 36);
    x += (b.elt.offsetWidth || 60) + 6;
  }
  textSize(defaultTextSize);
  lengthLabelX = 10;
  lengthSelect.position(10 + textWidth('Block length:') + 8, y0 + 70);
  metroCheckbox.position(10 + textWidth('Block length:') + 8 + (lengthSelect.elt.offsetWidth || 130) + 16, y0 + 72);
  tempoSlider.position(sliderLeftMargin, y0 + 106);
  tempoSlider.size(max(100, canvasWidth - sliderLeftMargin - margin));
  driftSlider.position(sliderLeftMargin, y0 + 140);
  driftSlider.size(max(100, canvasWidth - sliderLeftMargin - margin));
}

function computeLayout() {
  tl = { x: 10, y: 78, w: canvasWidth - 20, h: 46 };
  const labelY = tl.y + tl.h + 54;
  const top = labelY + 18;
  const availH = drawHeight - top - 8;
  const stageW = min(STAGE_W, (canvasWidth - 30) * 0.42);
  const sc = min(stageW / STAGE_W, availH / STAGE_H);
  stage = { x: 10, y: top, w: STAGE_W * sc, h: STAGE_H * sc, s: sc };
  codeBox = { x: stage.x + stage.w + 10, y: labelY, w: canvasWidth - (stage.x + stage.w + 10) - 10, h: drawHeight - labelY - 8 };
}

// ---------- timeline editing ----------
function slotAt(mx, my) {
  if (mx < tl.x || mx > tl.x + tl.w || my < tl.y || my > tl.y + tl.h) return -1;
  return constrain(floor((mx - tl.x) / (tl.w / SLOTS)), 0, SLOTS - 1);
}

function blockAtSlot(slot) {
  return blocks.findIndex(b => slot >= b.start && slot < b.start + b.len);
}

function timelineClick() {
  const slot = slotAt(mouseX, mouseY);
  if (slot < 0) return;
  if (playing) stopPlay();
  const idx = blockAtSlot(slot);
  if (idx >= 0) {
    const b = blocks[idx];
    blocks.splice(idx, 1);
    setMessage('Removed ' + MOVES[b.move].label + '. The gap becomes a rest (stop).', false);
    return;
  }
  const len = int(lengthSelect.value());
  if (slot + len > SLOTS) {
    setMessage('Too long for 8 beats! That block would end after beat 8.', true);
    return;
  }
  for (let k = slot; k < slot + len; k++) {
    if (blockAtSlot(k) >= 0) {
      setMessage('No room there. Click the block in the way to remove it first.', true);
      return;
    }
  }
  blocks.push({ move: selectedMove, start: slot, len: len });
  blocks.sort((a, b) => a.start - b.start);
  setMessage('Placed ' + MOVES[selectedMove].label + ' for ' + fmtBeats(len / 2) + ' beat' + (len === 2 ? '' : 's') + '.', false);
}

function setMessage(m, isError) {
  message = m;
  messageIsError = isError;
}

function showHint() {
  setMessage('Now click an empty cell to place ' + MOVES[selectedMove].label + '.', false);
}

function loadChapterDance() {
  stopPlay();
  blocks = CHAPTER_DANCE.map(b => ({ ...b }));
  setMessage('Loaded the 8-beat dance from Chapter 10. Press Play.', false);
}

// Blocks plus automatic Stop blocks that fill every gap, in time order.
function sequence() {
  const seq = [];
  let t = 0;
  for (const b of blocks) {
    if (b.start > t) seq.push({ move: 'stop', start: t, len: b.start - t, auto: true });
    seq.push({ ...b, auto: false });
    t = b.start + b.len;
  }
  if (t < SLOTS) seq.push({ move: 'stop', start: t, len: SLOTS - t, auto: true });
  return seq;
}

// ---------- playback ----------
function secondsPerBeat() {
  return 60 / tempoSlider.value();
}

function startPlay() {
  if (playing) return;
  playing = true;
  beatPos = 0;
  lastBeatShown = -1;
  if (metroCheckbox.checked()) ensureAudio();
}

function stopPlay() {
  playing = false;
  beatPos = 0;
  lastBeatShown = -1;
}

function goHome() {
  stopPlay();
  robot = { ...HOME };
  ideal = { ...HOME };
  trail = [];
  timesPlayed = 0;
}

function ensureAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {
    audioCtx = null;
  }
}

function metronomeClick(accent) {
  if (!metroCheckbox.checked()) return;
  ensureAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = accent ? 1500 : 1000;
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

// Move a pose by one move for a number of beats. Drift is a fraction (0 to 0.10):
// one motor is a little stronger, so straight moves curve and spins over- or under-turn.
function applyMove(p, move, dBeats, drift) {
  if (move === 'forward' || move === 'back') {
    const dir = (move === 'forward') ? 1 : -1;
    const dist = dir * 30 * dBeats * (1 + drift);          // 30 px per beat
    p.h -= drift * 0.4 * dBeats;                            // slow curve to the left
    p.x += cos(p.h) * dist;
    p.y += sin(p.h) * dist;
  } else if (move === 'spinL') {
    p.h -= PI * dBeats * (1 + drift / 2);                    // 90 degrees per half beat
  } else if (move === 'spinR') {
    p.h += PI * dBeats * (1 - drift / 2);
  }
  p.x = constrain(p.x, 10, STAGE_W - 10);
  p.y = constrain(p.y, 10, STAGE_H - 10);
}

function updatePlayback() {
  if (!playing) return;
  const dt = min(deltaTime, 50) / 1000;
  let dBeats = dt / secondsPerBeat();
  const seq = sequence();
  const drift = driftSlider.value() / 100;
  while (dBeats > 1e-9 && beatPos < 8) {
    const slot = beatPos * 2;
    const seg = seq.find(sg => slot >= sg.start - 1e-9 && slot < sg.start + sg.len - 1e-9) || seq[seq.length - 1];
    const segEndBeat = (seg.start + seg.len) / 2;
    const step = min(dBeats, segEndBeat - beatPos);
    applyMove(robot, seg.move, step, drift);
    applyMove(ideal, seg.move, step, 0);
    beatPos += step;
    dBeats -= step;
  }
  const beatIdx = floor(beatPos + 1e-9);
  if (beatIdx !== lastBeatShown && beatIdx < 8) {
    lastBeatShown = beatIdx;
    flash = 1;
    metronomeClick(beatIdx === 0);
  }
  trail.push({ x: robot.x, y: robot.y });
  if (trail.length > 3000) trail.shift();
  if (beatPos >= 8 - 1e-9) {
    playing = false;
    beatPos = 0;
    lastBeatShown = -1;
    timesPlayed++;
    setMessage('Done! Press Play again to repeat the dance from where the robot stopped.', false);
  }
}

// ---------- formatting ----------
function fmtSec(v) {
  let s = v.toFixed(2);
  if (s.endsWith('0')) s = s.slice(0, -1);
  return s;
}

function fmtBeats(b) {
  return (b % 1 === 0) ? '' + b : b.toFixed(1);
}

function beatComment(seg) {
  const startBeat = seg.start / 2 + 1;
  const endBeat = (seg.start + seg.len) / 2 + 1;
  if (seg.len === 1) {
    return 'beat ' + floor(startBeat) + (seg.start % 2 === 0 ? ' (1st half)' : ' (2nd half)');
  }
  if (seg.start % 2 === 0 && seg.len % 2 === 0) {
    const a = startBeat, b = endBeat - 1;
    return a === b ? 'beat ' + a : 'beats ' + a + '-' + b;
  }
  return 'beats ' + fmtBeats(startBeat) + '-' + fmtBeats(endBeat - 0.5);
}

// Each move function only starts the motors; the sleep() on the same line sets
// how long it lasts. Comments line up in one column, like the Chapter 10 code.
function codeLines() {
  const spb = secondsPerBeat();
  const seq = sequence();
  const calls = seq.map(seg => MOVES[seg.move].code + '; sleep(' + fmtSec(seg.len / 2 * spb) + ')');
  const width = max(calls.map(c => c.length));
  const lines = ['def dance():'];
  seq.forEach((seg, i) => {
    lines.push('    ' + calls[i].padEnd(width) + '  # ' + beatComment(seg) + (seg.auto ? ' rest' : ''));
  });
  return lines;
}

// ---------- drawing ----------
function draw() {
  updateCanvasSize();
  computeLayout();
  updatePlayback();
  if (flash > 0) flash = max(0, flash - deltaTime / 300);

  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawHeader();
  drawTimeline();
  drawStage();
  drawCode();
  drawControlLabels();
}

function drawHeader() {
  const spb = secondsPerBeat();
  const bpm = tempoSlider.value();
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(22);
  text('Dance Beat Sequencer', 10, 8);

  // metronome light
  const mx = canvasWidth - 30, my = 22;
  stroke('dimgray');
  fill(lerpColor(color('white'), color('crimson'), flash));
  circle(mx, my, 26);
  noStroke();
  fill('black');
  textSize(14);
  textAlign(RIGHT, CENTER);
  text('beat', mx - 18, my);

  textAlign(LEFT, TOP);
  textSize(16);
  fill('black');
  text('Seconds per beat = 60 / BPM = 60 / ' + bpm + ' = ' + spb.toFixed(2) + ' s', 10, 38);
}

function drawTimeline() {
  const cw = tl.w / SLOTS;
  const spb = secondsPerBeat();
  // beat ruler
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(15);
  for (let b = 0; b < 8; b++) {
    fill('black');
    text('' + (b + 1), tl.x + (b * 2 + 1) * cw, tl.y - 3);
  }
  // cells
  for (let k = 0; k < SLOTS; k++) {
    stroke(k % 2 === 0 ? 'darkgray' : 'gainsboro');
    fill('white');
    rect(tl.x + k * cw, tl.y, cw, tl.h);
  }
  // blocks (gaps are drawn as light gray automatic rests)
  const seq = sequence();
  const activeSlot = beatPos * 2;
  for (const seg of seq) {
    const x = tl.x + seg.start * cw, w = seg.len * cw;
    const isActive = playing && activeSlot >= seg.start && activeSlot < seg.start + seg.len;
    if (seg.auto) {
      stroke('silver');
      fill(isActive ? 'gainsboro' : 'whitesmoke');
      drawingContext.setLineDash([4, 3]);
      rect(x + 2, tl.y + 3, w - 4, tl.h - 6, 5);
      drawingContext.setLineDash([]);
    } else {
      stroke(isActive ? 'gold' : 'white');
      strokeWeight(isActive ? 3 : 1);
      fill(MOVES[seg.move].color);
      rect(x + 2, tl.y + 3, w - 4, tl.h - 6, 5);
      strokeWeight(1);
    }
    // block text: move name and its sleep time
    noStroke();
    fill(seg.auto ? 'gray' : 'white');
    textAlign(CENTER, CENTER);
    textSize(13);
    const name = seg.auto ? 'rest' : MOVES[seg.move].short;
    const secs = fmtSec(seg.len / 2 * spb) + ' s';
    if (textWidth(name) < w - 6) text(name, x + w / 2, tl.y + tl.h / 2 - 8);
    if (textWidth(secs) < w - 6) text(secs, x + w / 2, tl.y + tl.h / 2 + 9);
  }
  // playhead
  if (playing) {
    const px = tl.x + beatPos * 2 * cw;
    stroke('red');
    strokeWeight(3);
    line(px, tl.y - 6, px, tl.y + tl.h + 6);
    strokeWeight(1);
  }
  // dance length and messages
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  fill('black');
  text('Dance length: 8 beats x ' + spb.toFixed(2) + ' s = ' + (8 * spb).toFixed(2) + ' s', 10, tl.y + tl.h + 8);
  textSize(15);
  fill(messageIsError ? 'firebrick' : 'dimgray');
  text(message, 10, tl.y + tl.h + 30, canvasWidth - 20, 20);
}

function drawStage() {
  const st = stage;
  // floor
  stroke('dimgray');
  fill(245, 240, 225);
  rect(st.x, st.y, st.w, st.h, 4);
  push();
  translate(st.x, st.y);
  scale(st.s);
  // start mark
  noFill();
  stroke('gray');
  drawingContext.setLineDash([3, 3]);
  circle(HOME.x, HOME.y, 26);
  drawingContext.setLineDash([]);
  // trail
  stroke(30, 90, 220, 170);
  strokeWeight(2 / st.s);
  noFill();
  beginShape();
  for (const p of trail) vertex(p.x, p.y);
  endShape();
  // where the robot should be with zero drift
  if (driftSlider.value() > 0 && (timesPlayed > 0 || playing)) drawRobotShape(ideal, true);
  drawRobotShape(robot, false);
  pop();
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, TOP);
  text('Stage (top view)', st.x, st.y - 18);
  fill(90);
  textSize(13);
  text('Times played: ' + timesPlayed, st.x + 6, st.y + 5);
}

function drawRobotShape(p, ghost) {
  push();
  translate(p.x, p.y);
  rotate(p.h);
  if (ghost) {
    noFill();
    stroke('gray');
    drawingContext.setLineDash([3, 2]);
    rect(-10, -8, 20, 16, 3);
    drawingContext.setLineDash([]);
  } else {
    noStroke();
    fill(40);
    rect(-4, -10, 8, 3, 1);
    rect(-4, 7, 8, 3, 1);
    stroke('darkolivegreen');
    fill('olivedrab');
    rect(-10, -8, 20, 16, 3);
    noStroke();
    fill('white');
    triangle(7, 0, -3, -4.5, -3, 4.5);
  }
  pop();
}

function drawCode() {
  const cb = codeBox;
  const lines = codeLines();
  const seq = sequence();
  let active = -1;
  if (playing) {
    const slot = beatPos * 2;
    active = seq.findIndex(sg => slot >= sg.start && slot < sg.start + sg.len) + 1;
  }
  stroke('silver');
  fill(250);
  rect(cb.x, cb.y, cb.w, cb.h, 6);
  const lineH = 15.5;
  const maxLines = floor((cb.h - 10) / lineH);
  let first = 0;
  if (lines.length > maxLines) {
    first = constrain((active >= 0 ? active : 0) - 2, 0, lines.length - maxLines);
  }
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(cb.x + 1, cb.y + 1, cb.w - 2, cb.h - 2);
  drawingContext.clip();
  textFont('monospace');
  textSize(13);
  textAlign(LEFT, TOP);
  for (let i = first; i < min(lines.length, first + maxLines); i++) {
    const y = cb.y + 6 + (i - first) * lineH;
    if (i === active) {
      noStroke();
      fill(255, 225, 120);
      rect(cb.x + 3, y - 1, cb.w - 6, lineH, 3);
    }
    noStroke();
    fill(i === 0 ? 'navy' : 'black');
    text(lines[i], cb.x + 8, y);
  }
  drawingContext.restore();
  textFont('sans-serif');
  if (first > 0 || first + maxLines < lines.length) {
    noStroke();
    fill('gray');
    textSize(12);
    textAlign(RIGHT, BOTTOM);
    text('(scrolls with the playhead)', cb.x + cb.w - 6, cb.y + cb.h - 2);
  }
}

function drawControlLabels() {
  const y0 = drawHeight + 8;
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Block length:', lengthLabelX, y0 + 80);
  text('Tempo (BPM): ' + tempoSlider.value(), 10, y0 + 116);
  text('Drift (%): ' + driftSlider.value(), 10, y0 + 150);
}

// ---------- responsive ----------
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
