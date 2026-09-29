// Piezo Tone Frequency Explorer
// CANVAS_HEIGHT: 475
// Bloom L2 (Understand - relate): the PWM frequency passed to buzzer.freq()
// sets the pitch, and a 50% duty cycle gives the loudest tone.
// Adapted from learning-micropython/piano-tone-generator (same author).
// Audio uses the p5.sound oscillator and starts only after a click.

let canvasWidth = 700;
let drawHeight = 360;
let controlHeight = 115;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 180;
let defaultTextSize = 16;

// one octave, C4 to C5, with the whole-number frequencies used by buzzer.freq()
const whiteNotes = [
  { n: 'C4', f: 262 }, { n: 'D4', f: 294 }, { n: 'E4', f: 330 }, { n: 'F4', f: 349 },
  { n: 'G4', f: 392 }, { n: 'A4', f: 440 }, { n: 'B4', f: 494 }, { n: 'C5', f: 523 }
];
const blackNotes = [
  { n: 'C#4', f: 277, after: 0 }, { n: 'D#4', f: 311, after: 1 },
  { n: 'F#4', f: 370, after: 3 }, { n: 'G#4', f: 415, after: 4 },
  { n: 'A#4', f: 466, after: 5 }
];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// the startup melody from the chapter: play_tone(440, 0.2), (523, 0.2), (659, 0.3)
const MELODY = [{ f: 440, ms: 200 }, { f: 523, ms: 200 }, { f: 659, ms: 300 }];

// layout
const KB_TOP = 40, KB_H = 100;
const WAVE_TOP = 148, WAVE_H = 134;
const BOTTOM_TOP = 290;

// controls
let playButton, melodyButton, freqSlider, dutySlider;

// sound state
const BASE_AMP = 0.15;   // square waves are loud, so keep the level gentle
let osc = null;
let audioOK = true;
let audioStarted = false;
let soundOn = false;     // Play / Stop toggle
let noteUntil = 0;       // a clicked key plays a short note
let melodyStart = -1;
let lastAmp = -1, lastFreq = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(togglePlay);

  melodyButton = createButton('Startup melody');
  melodyButton.parent(document.querySelector('main'));
  melodyButton.mousePressed(startMelody);

  freqSlider = createSlider(100, 2000, 440, 1);
  freqSlider.parent(document.querySelector('main'));

  dutySlider = createSlider(0, 100, 50, 5);
  dutySlider.parent(document.querySelector('main'));

  positionControls();

  // the oscillator is built now but stays silent until the first click
  try {
    if (typeof p5.Oscillator === 'undefined') throw new Error('no p5.sound');
    osc = new p5.Oscillator('square');
    osc.amp(0);
  } catch (e) {
    audioOK = false;
  }

  describe('A one-octave piano keyboard from C4 to C5 above a square-wave view. The wave view shows the PWM signal at the chosen frequency with its period labeled. Below it, a MicroPython code box shows buzzer.freq and buzzer.duty_u16 with the current values, next to a loudness meter that is fullest at 50 percent duty. Sliders set the frequency and duty, a Play button starts the tone, and a Startup melody button plays 440, 523, and 659 hertz.', LABEL);
}

function positionControls() {
  playButton.position(10, drawHeight + 8);
  melodyButton.position(20 + playButton.elt.offsetWidth, drawHeight + 8);
  freqSlider.position(sliderLeftMargin, drawHeight + 44);
  freqSlider.size(canvasWidth - sliderLeftMargin - margin);
  dutySlider.position(sliderLeftMargin, drawHeight + 80);
  dutySlider.size(canvasWidth - sliderLeftMargin - margin);
}

// ---------- sound ----------

function ensureAudio() {
  if (!audioOK) return false;
  try {
    userStartAudio();              // browsers only allow audio after a click
    if (!audioStarted) { osc.start(); osc.amp(0); audioStarted = true; }
    return true;
  } catch (e) {
    audioOK = false;
    return false;
  }
}

function togglePlay() {
  melodyStart = -1;
  soundOn = !soundOn;
  playButton.html(soundOn ? 'Stop' : 'Play');
  if (soundOn) ensureAudio();
}

function startMelody() {
  soundOn = false;
  playButton.html('Play');
  dutySlider.value(50);            // play_tone() always uses duty_u16(32767)
  melodyStart = millis();
  ensureAudio();
}

// loudness from the spec: 1 at 50% duty, 0 at 0% or 100% (the pin never switches)
function volume() {
  return 1 - abs(dutySlider.value() - 50) / 50;
}

function isSounding() {
  return soundOn || millis() < noteUntil || melodyStart >= 0;
}

function updateMelody() {
  if (melodyStart < 0) return;
  let t = millis() - melodyStart;
  for (const note of MELODY) {
    if (t < note.ms) { freqSlider.value(note.f); return; }
    t -= note.ms;
  }
  melodyStart = -1;               // done: duty_u16(0) silences the buzzer
}

function updateAudio() {
  if (!audioOK || !audioStarted) return;
  const want = isSounding() ? BASE_AMP * volume() : 0;
  if (abs(want - lastAmp) > 0.001) { osc.amp(want, 0.03); lastAmp = want; }
  const f = freqSlider.value();
  if (f !== lastFreq) { osc.freq(f); lastFreq = f; }
}

// ---------- helpers ----------

function nearestNote(f) {
  const midi = Math.round(69 + 12 * Math.log2(f / 440));
  return NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

function dutyU16() {
  return Math.floor(dutySlider.value() / 100 * 65535);   // 50% -> 32767
}

function whiteW() { return (canvasWidth - 2 * margin) / whiteNotes.length; }

// ---------- drawing ----------

function draw() {
  updateCanvasSize();
  updateMelody();
  updateAudio();

  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke(); fill('black'); textStyle(BOLD); textAlign(LEFT, TOP);
  textSize(canvasWidth < 560 ? 18 : 22);
  text('Piezo Tone Frequency Explorer', 10, 9);
  textStyle(NORMAL);

  drawSpeaker();
  drawKeyboard();
  drawWave();
  drawCode();
  drawLoudness();
  drawControlLabels();
}

function drawSpeaker() {
  const cx = canvasWidth - 34, cy = 21;
  const v = volume();
  const on = audioOK && isSounding() && v > 0;
  const shade = on ? 'darkorange' : 'gray';
  const c = color(shade);
  c.setAlpha(on ? 90 + 165 * v : 255);   // dimmer at low duty
  noStroke(); fill(c);
  rect(cx - 12, cy - 5, 7, 10);                         // magnet
  quad(cx - 5, cy - 5, cx + 4, cy - 12, cx + 4, cy + 12, cx - 5, cy + 5); // cone
  if (on) {
    // sound waves pulse while the tone plays
    noFill(); stroke(c); strokeWeight(2);
    const r = 6 + 3 * (0.5 + 0.5 * sin(millis() * 0.02));
    arc(cx + 6, cy, r * 1.4, r * 1.8, -QUARTER_PI, QUARTER_PI);
    arc(cx + 6, cy, r * 2.6, r * 3.2, -QUARTER_PI, QUARTER_PI);
  }
  if (canvasWidth >= 560) {
    noStroke(); textSize(14); textAlign(RIGHT, CENTER);
    if (!audioOK) { fill('crimson'); text('Sound is off in this browser', cx - 18, cy); }
    else if (isSounding()) { fill('darkorange'); text(v > 0 ? 'Playing' : 'Playing (silent)', cx - 18, cy); }
    else { fill('dimgray'); text('Sound stopped', cx - 18, cy); }
  }
}

function keyState(f) {
  const cur = freqSlider.value();
  if (abs(cur - f) < 1) return 'exact';
  return '';
}

function drawKeyboard() {
  const w = whiteW();
  const cur = freqSlider.value();
  const near = nearestNote(cur);
  // white keys
  whiteNotes.forEach((k, i) => {
    const x = margin + i * w;
    const exact = keyState(k.f) === 'exact';
    stroke('black'); strokeWeight(1);
    fill(exact ? 'darkorange' : (k.n === near ? 'moccasin' : 'white'));
    rect(x, KB_TOP, w, KB_H, 0, 0, 5, 5);
    noStroke(); textAlign(CENTER, BOTTOM);
    fill(exact ? 'white' : 'black'); textSize(14); textStyle(BOLD);
    text(k.n, x + w / 2, KB_TOP + KB_H - 5);
    textStyle(NORMAL); textSize(12); fill(exact ? 'white' : 'dimgray');
    text(w < 60 ? k.f : k.f + ' Hz', x + w / 2, KB_TOP + KB_H - 22);
  });
  // black keys sit between the white keys
  const bw = w * 0.58, bh = KB_H * 0.56;
  blackNotes.forEach(k => {
    const x = margin + (k.after + 1) * w - bw / 2;
    const exact = keyState(k.f) === 'exact';
    stroke('black'); strokeWeight(1);
    fill(exact ? 'darkorange' : (k.n === near ? 'peru' : 'black'));
    rect(x, KB_TOP, bw, bh, 0, 0, 3, 3);
    noStroke(); fill('white'); textSize(bw > 30 ? 12 : 10); textAlign(CENTER, BOTTOM);
    text(k.n, x + bw / 2, KB_TOP + bh - 4);
  });
}

function drawWave() {
  const x = margin, w = canvasWidth - 2 * margin;
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, WAVE_TOP, w, WAVE_H, 6);

  const f = freqSlider.value();
  const duty = dutySlider.value() / 100;
  const periodMs = 1000 / f;

  // readouts across the top of the wave view
  noStroke(); textAlign(LEFT, TOP); textSize(16); textStyle(BOLD); fill('black');
  text('Frequency: ' + f + ' Hz', x + 10, WAVE_TOP + 6);
  textStyle(NORMAL); textAlign(RIGHT, TOP); fill('navy');
  text('Nearest note: ' + nearestNote(f), x + w - 10, WAVE_TOP + 6);

  // voltage labels
  const hiY = WAVE_TOP + 40, loY = WAVE_TOP + 94;
  fill('black'); textSize(13); textAlign(RIGHT, CENTER);
  text('3.3 V', x + 44, hiY);
  text('0 V', x + 44, loY);

  // higher frequencies show more cycles: 3 cycles at 100 Hz up to 12 at 2000 Hz
  const cycles = 3 + 9 * Math.log(f / 100) / Math.log(20);
  const x0 = x + 52, x1 = x + w - 12;
  const cycleW = (x1 - x0) / cycles;

  // shade the HIGH part of each cycle, then draw the signal on top
  for (let k = 0; k < cycles; k++) {
    const xs = x0 + k * cycleW;
    const xh = min(xs + duty * cycleW, x1);
    if (xh > xs) { noStroke(); fill('bisque'); rect(xs, hiY, xh - xs, loY - hiY); }
  }
  for (let k = 0; k < cycles; k++) {
    const xs = x0 + k * cycleW;
    const xh = min(xs + duty * cycleW, x1);
    const xe = min(xs + cycleW, x1);
    strokeWeight(3);
    if (xh > xs) { stroke('darkorange'); line(xs, hiY, xh, hiY); }
    if (xe > xh) { stroke('darkgray'); line(xh, loY, xe, loY); }
    strokeWeight(1.5); stroke('gray');
    if (duty > 0 && duty < 1) {
      if (xh < x1) line(xh, hiY, xh, loY);          // falling edge
      if (xe < x1) line(xe, hiY, xe, loY);          // next rising edge
    }
  }

  // one period, marked with a double arrow under the first cycle
  const by = loY + 12;
  stroke('navy'); strokeWeight(1.5);
  line(x0, by, x0 + cycleW, by);
  line(x0, by - 5, x0, by + 5);
  line(x0 + cycleW, by - 5, x0 + cycleW, by + 5);
  noStroke(); fill('navy');
  triangle(x0 + 1, by, x0 + 7, by - 4, x0 + 7, by + 4);
  triangle(x0 + cycleW - 1, by, x0 + cycleW - 7, by - 4, x0 + cycleW - 7, by + 4);
  textSize(14); textAlign(LEFT, TOP);
  const plabel = 'Period: ' + periodMs.toFixed(2) + ' ms';
  const lx = cycleW > textWidth(plabel) + 8 ? x0 + cycleW / 2 - textWidth(plabel) / 2 : x0;
  text(plabel, lx, by + 5);

  // how much time the wave view covers
  fill('dimgray'); textSize(13); textAlign(RIGHT, TOP);
  text('showing ' + (cycles * periodMs).toFixed(1) + ' ms', x1, by + 6);
}

function drawCode() {
  const narrow = canvasWidth < 560;
  const lines = [];
  if (!narrow) lines.push('buzzer = PWM(Pin(config.BUZZER_PIN))');
  lines.push('buzzer.freq(' + freqSlider.value() + ')');
  lines.push('buzzer.duty_u16(' + dutyU16() + ')' + (narrow ? '' : '  # ' + dutySlider.value() + '%'));
  const fs = narrow ? 12 : 14, lh = fs + 5;
  textFont('monospace'); textSize(fs);
  // size the box for the widest possible line so it never jumps around
  const widest = narrow ? 'buzzer.duty_u16(65535)' : 'buzzer = PWM(Pin(config.BUZZER_PIN))';
  const w = textWidth(widest) + 18;
  const h = lines.length * lh + 14;
  const y = BOTTOM_TOP + (narrow ? 8 : 0);
  stroke('silver'); strokeWeight(1); fill('whitesmoke');
  rect(margin, y, w, h, 6);
  noStroke(); textAlign(LEFT, TOP);
  lines.forEach((s, i) => {
    fill(i === lines.length - 1 || i === lines.length - 2 ? 'navy' : 'black');
    text(s, margin + 9, y + 8 + i * lh);
  });
  textFont('sans-serif');
  codeRight = margin + w;
}
let codeRight = 360;

function drawLoudness() {
  const x = codeRight + 20;
  const w = canvasWidth - margin - x;
  if (w < 80) return;
  const v = volume();
  noStroke(); fill('black'); textAlign(LEFT, TOP);
  textSize(canvasWidth < 560 ? 14 : 16); textStyle(BOLD);
  text('Loudness: ' + round(v * 100) + '%', x, BOTTOM_TOP + 2);
  textStyle(NORMAL);
  // meter bar
  stroke('silver'); strokeWeight(1); fill('white');
  rect(x, BOTTOM_TOP + 26, w, 16, 4);
  noStroke(); fill('darkorange');
  if (v > 0) rect(x, BOTTOM_TOP + 26, w * v, 16, 4);
  fill('dimgray'); textSize(13);
  text(canvasWidth < 560 ? 'Loudest at 50% duty' : 'Loudest at 50% duty. Silent at 0% and 100%.', x, BOTTOM_TOP + 48, w);
}

function drawControlLabels() {
  noStroke(); fill('black'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Frequency: ' + freqSlider.value() + ' Hz', 10, drawHeight + 54);
  text('Duty: ' + dutySlider.value() + '% = ' + dutyU16(), 10, drawHeight + 90);
}

// ---------- clicking a piano key ----------

function mousePressed() {
  if (mouseY < KB_TOP || mouseY > KB_TOP + KB_H) return;
  const w = whiteW(), bw = w * 0.58, bh = KB_H * 0.56;
  let hit = null;
  // black keys are on top, so test them first
  for (const k of blackNotes) {
    const x = margin + (k.after + 1) * w - bw / 2;
    if (mouseX > x && mouseX < x + bw && mouseY < KB_TOP + bh) { hit = k; break; }
  }
  if (!hit) {
    const i = floor((mouseX - margin) / w);
    if (i >= 0 && i < whiteNotes.length) hit = whiteNotes[i];
  }
  if (!hit) return;
  melodyStart = -1;
  freqSlider.value(hit.f);
  if (!soundOn) noteUntil = millis() + 400;   // a short note, like a real piano key
  ensureAudio();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = Math.floor(container.getBoundingClientRect().width);
  if (typeof freqSlider !== 'undefined') {
    freqSlider.size(canvasWidth - sliderLeftMargin - margin);
    dutySlider.size(canvasWidth - sliderLeftMargin - margin);
  }
}
