// Clean Shutdown Flow - Mermaid flowchart + robot scene + console
// CANVAS_HEIGHT: 520
// Bloom L3 (Apply) - Trace: the student traces the path through try, except,
// and finally for Ctrl+C and for a sensor error, and sees why the motor
// shutdown code belongs in finally. Each event walks the highlight through
// the flowchart one node at a time (about 0.5 s per node).

// ---------- Flowchart definitions ----------
// Two versions of the same program: with and without the finally block.
const CLASS_DEFS = `
    classDef endNode fill:#607d8b,stroke:#263238,stroke-width:2px,color:#fff,font-size:16px
    classDef tryNode fill:#1e88e5,stroke:#0d47a1,stroke-width:2px,color:#fff,font-size:16px
    classDef exceptNode fill:#fb8c00,stroke:#e65100,stroke-width:2px,color:#000,font-size:16px
    classDef finallyNode fill:#43a047,stroke:#1b5e20,stroke-width:2px,color:#fff,font-size:16px
    linkStyle default stroke:#546e7a,stroke-width:2px,font-size:14px`;

const FLOW_WITH_FINALLY = `flowchart TD
    Start(["Start"]):::endNode
    Try["try:<br/>while True:<br/>robot logic"]:::tryNode
    Except["except KeyboardInterrupt:<br/>print Stopping"]:::exceptNode
    Finally["finally:<br/>motors off"]:::finallyNode
    Done(["Program ends"]):::endNode
    Start --> Try
    Try -->|"Ctrl+C"| Except
    Try -->|"any other exit or error"| Finally
    Except --> Finally
    Finally --> Done
` + CLASS_DEFS;

const FLOW_NO_FINALLY = `flowchart TD
    Start(["Start"]):::endNode
    Try["try:<br/>while True:<br/>robot logic"]:::tryNode
    Except["except KeyboardInterrupt:<br/>print Stopping"]:::exceptNode
    Done(["Program ends"]):::endNode
    Start --> Try
    Try -->|"Ctrl+C"| Except
    Try -->|"error: crash"| Done
    Except --> Done
` + CLASS_DEFS;

// Plain-language description of each box (shown on hover)
const NODE_INFO = {
  Start: '<b>Start</b> - Python begins running the program from the top.',
  Try: '<b>try block</b> - holds the main loop. The robot reads its sensor and drives the motors here, over and over.',
  Except: '<b>except KeyboardInterrupt</b> - runs only when Ctrl+C is pressed. It prints "Stopping." It does NOT turn the motors off.',
  Finally: '<b>finally block</b> - runs no matter how the try block ends: Ctrl+C, an error, or a normal exit. This is where we turn the motors off.',
  Done: '<b>Program ends</b> - no more code runs. A motor that never got a stop command can keep spinning.'
};

// ---------- State ----------
let phase = 'idle';          // idle, running, animating, ended
let motorsOn = false;
let includeFinally = true;
let visited = new Set();
let activeNode = null;
let warnBanner = false;
let eventMessage = '';
let hovering = false;
let stripeOffset = 0;
let timers = [];
let renderCount = 0;
let nodeEls = {};            // node id -> <g> element

const STEP_MS = 500;         // time between highlight steps

// ---------- DOM ----------
const flowPanel = document.getElementById('flowPanel');
const canvas = document.getElementById('robotCanvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');
const consoleDiv = document.getElementById('console');
const startBtn = document.getElementById('startBtn');
const ctrlcBtn = document.getElementById('ctrlcBtn');
const errorBtn = document.getElementById('errorBtn');
const finallyBox = document.getElementById('finallyBox');
const resetBtn = document.getElementById('resetBtn');

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  // extra diagram padding leaves room for the check marks on edge nodes
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', diagramPadding: 26 }
});

// ---------- Flowchart rendering and highlighting ----------
async function renderFlow() {
  const code = includeFinally ? FLOW_WITH_FINALLY : FLOW_NO_FINALLY;
  renderCount++;
  const { svg } = await mermaid.render('shutdownFlow' + renderCount, code);
  flowPanel.innerHTML = svg;
  nodeEls = {};
  flowPanel.querySelectorAll('.node').forEach(g => {
    const m = g.id.match(/flowchart-(.+)-\d+$/);
    if (!m) return;
    const id = m[1];
    nodeEls[id] = g;
    g.addEventListener('mouseenter', () => { hovering = true; showMessage(NODE_INFO[id]); });
    g.addEventListener('mouseleave', () => { hovering = false; showMessage(eventMessage); });
  });
  updateNodeStyles();
}

function updateNodeStyles() {
  for (const id in nodeEls) {
    const g = nodeEls[id];
    g.classList.toggle('pending', !visited.has(id) && activeNode !== id);
    g.classList.toggle('active', activeNode === id);
    // check mark on visited nodes that are no longer active
    const old = g.querySelector('.checkmark-group');
    if (old) old.remove();
    if (visited.has(id) && activeNode !== id) {
      const box = g.getBBox();
      // Wrap in a <g>: Mermaid's classDef styles every direct child of a
      // node with fill !important, which would recolor a bare <text>.
      const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wrap.setAttribute('class', 'checkmark-group');
      g.appendChild(wrap);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('class', 'checkmark');
      t.setAttribute('x', box.x + box.width + 3);
      t.setAttribute('y', box.y + box.height / 2 + 8);
      t.setAttribute('style', 'fill:#2e7d32;stroke:none;font-size:24px;font-weight:bold;');
      t.textContent = '✓';
      wrap.appendChild(t);
    }
  }
}

function setActive(id) {
  if (activeNode) visited.add(activeNode);
  activeNode = id;
  if (id) visited.add(id);
  updateNodeStyles();
}

// ---------- Console and message helpers ----------
function printLine(text, cls) {
  const div = document.createElement('div');
  if (cls) div.className = cls;
  div.textContent = text;
  consoleDiv.appendChild(div);
  // keep only the newest lines that fit in the panel
  while (consoleDiv.children.length > 8) consoleDiv.removeChild(consoleDiv.firstChild);
}

function showMessage(html) { messageDiv.innerHTML = html; }

function setEventMessage(html) {
  eventMessage = html;
  if (!hovering) showMessage(html);
}

function updateButtons() {
  startBtn.disabled = phase !== 'idle';
  ctrlcBtn.disabled = phase !== 'running';
  errorBtn.disabled = phase !== 'running';
  finallyBox.disabled = phase !== 'idle';
}

// Run a list of steps, one every STEP_MS. Each step is a function.
function runSequence(steps) {
  phase = 'animating';
  updateButtons();
  steps.forEach((fn, i) => {
    timers.push(setTimeout(fn, (i + 1) * STEP_MS));
  });
}

// ---------- Events ----------
function startRobot() {
  if (phase !== 'idle') return;
  consoleDiv.innerHTML = '';
  printLine('>>> %Run main.py', 'prompt');
  setActive('Start');
  setEventMessage('The program starts at the top.');
  runSequence([
    () => {
      setActive('Try');
      motorsOn = true;
      printLine('Robot started. Press Ctrl+C to stop.');
      phase = 'running';
      updateButtons();
      setEventMessage('The <b>try</b> block is running the main loop. The motors are on. Now press Ctrl+C or cause a sensor error.');
    }
  ]);
}

function pressCtrlC() {
  if (phase !== 'running') return;
  printLine('^C', 'prompt');
  if (includeFinally) {
    runSequence([
      () => { setActive('Except'); printLine('Stopping.'); setEventMessage('Ctrl+C raised <b>KeyboardInterrupt</b>. The except block caught it.'); },
      () => { setActive('Finally'); motorsOn = false; printLine('Motors off. Goodbye!'); setEventMessage('Next, the <b>finally</b> block ran and turned the motors off.'); },
      () => { setActive('Done'); endProgram('Ctrl+C: <b>try</b> → <b>except</b> → <b>finally</b> → end. The motors stopped because <b>finally</b> ran.'); }
    ]);
  } else {
    runSequence([
      () => { setActive('Except'); printLine('Stopping.'); setEventMessage('Ctrl+C raised <b>KeyboardInterrupt</b>. The except block printed "Stopping."'); },
      () => { setActive('Done'); warnBanner = true; endProgram('The except block only printed a message. With no <b>finally</b> block, nothing turned the motors off!'); }
    ]);
  }
}

function causeError() {
  if (phase !== 'running') return;
  if (includeFinally) {
    runSequence([
      () => { setActive('Finally'); motorsOn = false; printLine('Motors off. Goodbye!'); setEventMessage('A ValueError is not a KeyboardInterrupt, so <b>except</b> skipped it. <b>finally</b> still ran.'); },
      () => {
        setActive('Done');
        printLine('Traceback (most recent call last):', 'err');
        printLine('ValueError: bad sensor reading', 'err');
        endProgram('Error: <b>try</b> → <b>finally</b> → end. Python reported the error, but <b>finally</b> had already stopped the motors.');
      }
    ]);
  } else {
    runSequence([
      () => {
        setActive('Done');
        printLine('Traceback (most recent call last):', 'err');
        printLine('ValueError: bad sensor reading', 'err');
        warnBanner = true;
        endProgram('No block caught the ValueError, so the program crashed. With no <b>finally</b> block, nothing turned the motors off!');
      }
    ]);
  }
}

function endProgram(msg) {
  phase = 'ended';
  updateButtons();
  setEventMessage(msg);
  // leave the last node shown as visited after a short pause
  timers.push(setTimeout(() => { setActive(null); }, STEP_MS * 2));
}

async function resetSim() {
  timers.forEach(t => clearTimeout(t));
  timers = [];
  phase = 'idle';
  motorsOn = false;
  warnBanner = false;
  visited = new Set();
  activeNode = null;
  includeFinally = finallyBox.checked;
  consoleDiv.innerHTML = '';
  printLine('>>> ', 'prompt');
  setEventMessage('Press <b>Start robot</b>. Then press Ctrl+C or cause a sensor error, and watch which blocks run. Hover any box to learn what it does.');
  updateButtons();
  await renderFlow();
}

// ---------- Robot scene (plain canvas 2D) ----------
function resizeCanvas() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWheel(x, y, w, h) {
  ctx.save();
  roundRect(x, y, w, h, 4);
  ctx.fillStyle = '#212121';
  ctx.fill();
  ctx.clip();
  // tread stripes: they slide while the motors are on
  ctx.strokeStyle = '#9e9e9e';
  ctx.lineWidth = 3;
  const gap = 10;
  for (let sy = y - gap + (stripeOffset % gap); sy < y + h + gap; sy += gap) {
    ctx.beginPath();
    ctx.moveTo(x + 2, sy);
    ctx.lineTo(x + w - 2, sy);
    ctx.stroke();
  }
  ctx.restore();
}

function drawScene() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'aliceblue';
  ctx.fillRect(0, 0, w, h);

  // title
  ctx.fillStyle = 'black';
  ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Robot (top view)', w / 2, 8);

  // robot body
  const cx = w / 2, cy = 102;
  const bw = 110, bh = 84;
  drawWheel(cx - bw / 2 - 20, cy - 28, 18, 56);
  drawWheel(cx + bw / 2 + 2, cy - 28, 18, 56);
  roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12);
  ctx.fillStyle = '#455a64';
  ctx.fill();
  // front NeoPixels (top of the drawing is the front)
  ctx.fillStyle = motorsOn ? '#76ff03' : '#263238';
  ctx.beginPath(); ctx.arc(cx - 24, cy - bh / 2 + 14, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 24, cy - bh / 2 + 14, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '13px Arial, Helvetica, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Maker Pi', cx, cy + 10);

  // motor status tag
  let tagText = 'MOTORS OFF', tagColor = '#78909c';
  if (motorsOn) { tagText = 'MOTORS ON'; tagColor = '#2e7d32'; }
  else if (phase !== 'idle') { tagColor = '#c62828'; }
  ctx.font = 'bold 16px Arial, Helvetica, sans-serif';
  const tw = ctx.measureText(tagText).width + 24;
  roundRect(cx - tw / 2, 158, tw, 28, 14);
  ctx.fillStyle = tagColor;
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.fillText(tagText, cx, 172);

  // warning banner when the program ended with the motors still on
  if (warnBanner && motorsOn) {
    const text = 'The motors never got the stop command.';
    ctx.font = 'bold 15px Arial, Helvetica, sans-serif';
    const bwid = Math.min(w - 12, ctx.measureText(text).width + 20);
    roundRect(cx - bwid / 2, 32, bwid, 26, 6);
    ctx.fillStyle = '#d32f2f';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(text, cx, 45, bwid - 10);
  }
}

function animate() {
  if (motorsOn) stripeOffset += 1.2;
  drawScene();
  requestAnimationFrame(animate);
}

// ---------- Wire up ----------
startBtn.addEventListener('click', startRobot);
ctrlcBtn.addEventListener('click', pressCtrlC);
errorBtn.addEventListener('click', causeError);
resetBtn.addEventListener('click', resetSim);
finallyBox.addEventListener('change', resetSim);
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
resetSim();
requestAnimationFrame(animate);
