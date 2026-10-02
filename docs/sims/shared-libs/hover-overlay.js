// hover-overlay.js - hover-to-explore infographic overlay engine
//
// Used by MicroSims that put invisible hotspots over an image that already has
// printed labels, such as a board pinout diagram. Each sim supplies its own
// main.html (markup below) and data.json; this file and hover-overlay.css are
// shared. Each sim's height lives in its metadata.json "canvasHeight".
//
// data.json defines "zones". A zone is one part of the board and may own
// several rectangles (for example, all seven Grove ports, plus the printed
// label in the margin). Hovering any rectangle lights up every rectangle in
// its zone and describes the part in the info panel below the image.
//
// Modes: explore (hover or tap) | quiz (click the part that answers the
// question) | edit (?edit=true - Shift-drag on the image to measure a
// rectangle). ?part=<zone id> opens straight to one part.
//
// Rectangle coordinates are percentages of the image (0-100), so the overlay
// scales with the image at any width.

class BoardOverlay {
  constructor() {
    this.data = null;
    this.mode = 'explore';
    this.editMode = false;
    this.rectEls = [];        // every hotspot <div>
    this.zoneRects = new Map(); // zone id -> [hotspot <div>, ...]
    this.activeZone = null;

    this.quizQueue = [];
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizMisses = 0;      // wrong clicks on the current question
    this.quizWaiting = false; // true after a correct answer, until "Next"
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    this.editMode = params.get('edit') === 'true';

    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.data = await res.json();
    } catch (err) {
      document.body.innerHTML =
        '<p style="color:#b00;padding:20px;font-family:monospace">Could not load data.json: ' +
        err.message + '</p>';
      return;
    }

    this.cacheElements();
    this.titleEl.textContent = this.data.title;
    // The embedding page already shows the title as its heading, so only
    // show ours when the sim runs fullscreen.
    if (window.self !== window.top) this.titleEl.style.display = 'none';
    this.imgEl.alt = this.data.alt || this.data.title;
    this.imgEl.src = this.data.image;
    await new Promise(resolve => {
      if (this.imgEl.complete && this.imgEl.naturalWidth > 0) resolve();
      else this.imgEl.addEventListener('load', resolve, { once: true });
    });

    this.renderHotspots();
    this.renderChips();
    this.bindControls();
    this.setMode('explore');
    if (this.editMode) this.startEditMode();

    // ?part=<zone id> opens straight to one part, so other pages can link
    // to it (for example main.html?part=grove-ports).
    const start = this.data.zones.find(z => z.id === params.get('part'));
    if (start) this.showZone(start, -1);

    // Reserve room for the tallest description so the page never jumps
    // (and the embedding iframe never clips) as the student hovers around.
    this.reserveInfoHeight();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.reserveInfoHeight(), 150);
    });
  }

  cacheElements() {
    const $ = id => document.getElementById(id);
    this.titleEl = $('sim-title');
    this.imgEl = $('board-img');
    this.overlayEl = $('hotspot-layer');
    this.btnExplore = $('btn-explore');
    this.btnQuiz = $('btn-quiz');
    this.chkHotspots = $('chk-hotspots');
    this.scoreEl = $('quiz-score');
    this.infoEl = $('info-panel');
    this.promptEl = $('info-prompt');
    this.promptTextEl = $('prompt-text');
    this.chipsEl = $('part-chips');
    this.contentEl = $('info-content');
    this.quizEl = $('quiz-box');
  }

  // ── Hotspots ─────────────────────────────────────────────────────────────

  renderHotspots() {
    for (const zone of this.data.zones) {
      const els = [];
      zone.rects.forEach((rect, i) => {
        const el = document.createElement('div');
        el.className = 'hotspot' + (rect.kind === 'label' ? ' is-label' : '');
        el.style.left = rect.x1 + '%';
        el.style.top = rect.y1 + '%';
        el.style.width = (rect.x2 - rect.x1) + '%';
        el.style.height = (rect.y2 - rect.y1) + '%';
        el.style.setProperty('--zone-color', zone.color);
        el.dataset.zone = zone.id;
        el.dataset.rect = i;

        // The first rectangle of each zone is the keyboard stop for that part.
        if (i === 0) {
          el.tabIndex = 0;
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', zone.label);
        }

        el.addEventListener('pointerenter', () => this.onHover(zone, i));
        el.addEventListener('focus', () => this.onHover(zone, i));
        el.addEventListener('click', () => this.onPick(zone, i));
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onPick(zone, i); }
        });

        this.overlayEl.appendChild(el);
        this.rectEls.push(el);
        els.push(el);
      });
      this.zoneRects.set(zone.id, els);
    }
  }

  // One button per part, shown while nothing is selected. They give touch and
  // keyboard users a second way in, and double as a list of what to explore.
  renderChips() {
    for (const zone of this.data.zones) {
      const chip = document.createElement('button');
      chip.className = 'part-chip';
      chip.style.setProperty('--zone-color', zone.color);
      chip.textContent = zone.label;
      chip.addEventListener('pointerenter', () => this.highlight(zone.id, 0, 'zone-lit'));
      chip.addEventListener('pointerleave', () => {
        if (!this.activeZone) this.highlight(null, 0, 'zone-lit');
      });
      // -1: the whole part is selected, not one particular rectangle.
      chip.addEventListener('click', () => this.showZone(zone, -1));
      this.chipsEl.appendChild(chip);
    }
  }

  highlight(zoneId, rectIndex, cls) {
    for (const el of this.rectEls) el.classList.remove(cls, 'rect-hot');
    if (!zoneId) return;
    for (const el of this.zoneRects.get(zoneId)) el.classList.add(cls);
    const hot = this.zoneRects.get(zoneId)[rectIndex];
    if (hot) hot.classList.add('rect-hot');
  }

  onHover(zone, rectIndex) {
    if (this.editMode && this.dragging) return;
    if (this.mode === 'explore') {
      this.showZone(zone, rectIndex);
    } else if (!this.quizWaiting) {
      // In quiz mode, hovering only outlines the part you are about to pick.
      this.highlight(zone.id, rectIndex, 'zone-aim');
    }
  }

  onPick(zone, rectIndex) {
    if (this.mode === 'explore') this.showZone(zone, rectIndex);
    else this.checkAnswer(zone);
  }

  // ── Info panel ───────────────────────────────────────────────────────────

  fillContent(zone, rectIndex) {
    const rect = zone.rects[rectIndex] || {};
    const c = this.contentEl;
    c.style.setProperty('--zone-color', zone.color);
    c.querySelector('#info-label').textContent = zone.label;

    const note = c.querySelector('#info-note');
    const noteText = rect.kind === 'label' ? '' : (rect.note || '');
    note.textContent = noteText;
    note.title = noteText ? 'The part under your pointer' : '';
    note.style.display = noteText ? 'inline-block' : 'none';

    c.querySelector('#info-summary').textContent = zone.summary;

    const facts = c.querySelector('#info-facts');
    facts.innerHTML = '';
    for (const fact of zone.facts || []) {
      const li = document.createElement('li');
      li.textContent = fact;
      facts.appendChild(li);
    }

    // Zones with a reference table get a second column on wide screens.
    c.classList.toggle('has-table', !!zone.table);
    const table = c.querySelector('#info-table');
    table.innerHTML = '';
    if (zone.table) {
      const cap = table.createCaption();
      cap.textContent = zone.table.caption || '';
      const head = table.createTHead().insertRow();
      for (const h of zone.table.headers) {
        const th = document.createElement('th');
        th.textContent = h;
        head.appendChild(th);
      }
      const body = table.createTBody();
      for (const row of zone.table.rows) {
        const tr = body.insertRow();
        for (const cell of row) tr.insertCell().textContent = cell;
      }
    }

    // With a table, the tip moves under it so the two columns stay balanced.
    const tip = c.querySelector('#info-tip');
    tip.textContent = zone.tip || '';
    tip.style.display = zone.tip ? 'block' : 'none';
    c.querySelector(zone.table ? '#info-side' : '#info-text').appendChild(tip);
  }

  showZone(zone, rectIndex) {
    this.activeZone = zone.id;
    this.activeRect = rectIndex;
    this.highlight(zone.id, rectIndex, 'zone-lit');
    this.fillContent(zone, rectIndex);
    this.promptEl.style.display = 'none';
    this.contentEl.style.display = 'block';
  }

  showPrompt(text) {
    this.activeZone = null;
    this.highlight(null, 0, 'zone-lit');
    this.promptTextEl.textContent = text;
    this.promptEl.style.display = 'block';
    this.contentEl.style.display = 'none';
  }

  // Measure every zone's description at the current width and reserve the
  // tallest one as the panel's minimum height.
  reserveInfoHeight() {
    const wasShowing = this.contentEl.style.display;
    const promptShowing = this.promptEl.style.display;
    const quizShowing = this.quizEl.style.display;
    const active = this.activeZone && this.data.zones.find(z => z.id === this.activeZone);

    this.infoEl.style.minHeight = '0px';
    this.promptEl.style.display = 'none';
    this.quizEl.style.display = 'none';
    this.contentEl.style.display = 'block';
    let tallest = 0;
    for (const zone of this.data.zones) {
      zone.rects.forEach((rect, i) => {
        if (!rect.note) return;
        this.fillContent(zone, i);
        tallest = Math.max(tallest, this.infoEl.offsetHeight);
      });
      this.fillContent(zone, 0);
      tallest = Math.max(tallest, this.infoEl.offsetHeight);
    }
    this.infoEl.style.minHeight = tallest + 'px';

    // Restore whatever the student was looking at.
    this.contentEl.style.display = wasShowing;
    this.promptEl.style.display = promptShowing;
    this.quizEl.style.display = quizShowing;
    if (active) this.fillContent(active, this.activeRect);
    this.reportHeight();
  }

  reportHeight() {
    if (window.self === window.top) return;
    window.parent.postMessage(
      { type: 'microsim-resize', height: document.body.scrollHeight + 10 }, '*');
  }

  // ── Modes ────────────────────────────────────────────────────────────────

  bindControls() {
    this.btnExplore.addEventListener('click', () => this.setMode('explore'));
    this.btnQuiz.addEventListener('click', () => this.setMode('quiz'));
    this.chkHotspots.addEventListener('change', () => {
      this.overlayEl.classList.toggle('show-all', this.chkHotspots.checked);
    });
  }

  setMode(mode) {
    this.mode = mode;
    this.btnExplore.classList.toggle('active', mode === 'explore');
    this.btnQuiz.classList.toggle('active', mode === 'quiz');
    this.btnExplore.setAttribute('aria-pressed', mode === 'explore');
    this.btnQuiz.setAttribute('aria-pressed', mode === 'quiz');
    for (const el of this.rectEls) el.classList.remove('zone-aim', 'zone-right', 'zone-wrong');

    if (mode === 'explore') {
      this.scoreEl.style.display = 'none';
      this.quizEl.style.display = 'none';
      this.showPrompt(this.data.prompt);
    } else {
      this.startQuiz();
    }
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────

  startQuiz() {
    const pool = [...this.data.quiz];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.quizQueue = pool.slice(0, this.data.quizLength || pool.length);
    this.quizIndex = 0;
    this.quizScore = 0;
    this.scoreEl.style.display = 'inline';
    this.updateScore();
    this.showPrompt('');
    this.promptEl.style.display = 'none';
    this.quizEl.style.display = 'block';
    this.askQuestion();
  }

  updateScore() {
    this.scoreEl.innerHTML = 'First-try score: <strong>' + this.quizScore +
      '</strong> / ' + this.quizQueue.length;
  }

  askQuestion() {
    this.quizMisses = 0;
    this.quizWaiting = false;
    this.contentEl.style.display = 'none';
    for (const el of this.rectEls) el.classList.remove('zone-aim', 'zone-right', 'zone-wrong');

    if (this.quizIndex >= this.quizQueue.length) {
      const n = this.quizQueue.length;
      this.quizEl.innerHTML =
        '<div class="quiz-done"><strong>Quiz complete!</strong> You found ' + this.quizScore +
        ' of ' + n + ' parts on your first try. ' +
        (this.quizScore === n ? 'Perfect score, engineer!' : 'Try again to beat your score.') +
        '</div><button class="mode-btn" id="quiz-again">Try Again</button>';
      document.getElementById('quiz-again').addEventListener('click', () => this.startQuiz());
      return;
    }

    const q = this.quizQueue[this.quizIndex];
    this.quizEl.innerHTML =
      '<div class="quiz-q"><span class="quiz-num">Question ' + (this.quizIndex + 1) + ' of ' +
      this.quizQueue.length + '</span>' + this.esc(q.question) + '</div>' +
      '<div class="quiz-hint">Click the part on the board that answers the question.</div>' +
      '<div id="quiz-feedback" aria-live="polite"></div>';
  }

  checkAnswer(zone) {
    if (this.quizWaiting || this.quizIndex >= this.quizQueue.length) return;
    const q = this.quizQueue[this.quizIndex];
    const feedback = document.getElementById('quiz-feedback');

    if (zone.id === q.correct_zone) {
      if (this.quizMisses === 0) this.quizScore++;
      this.updateScore();
      this.quizWaiting = true;
      for (const el of this.rectEls) el.classList.remove('zone-aim', 'zone-wrong');
      for (const el of this.zoneRects.get(zone.id)) el.classList.add('zone-right');
      feedback.className = 'right';
      feedback.innerHTML = '<strong>Correct! That\'s the ' + this.esc(zone.label) + '.</strong> ' +
        this.esc(q.explanation) +
        ' <button class="mode-btn" id="quiz-next">Next Question</button>';
      const next = document.getElementById('quiz-next');
      next.addEventListener('click', () => { this.quizIndex++; this.askQuestion(); });
      next.focus();
    } else {
      this.quizMisses++;
      for (const el of this.zoneRects.get(zone.id)) {
        el.classList.remove('zone-wrong');
        void el.offsetWidth; // restart the shake animation
        el.classList.add('zone-wrong');
      }
      feedback.className = 'wrong';
      let msg = 'That\'s the <strong>' + this.esc(zone.label) + '</strong>. Try again!';
      if (this.quizMisses >= 3) {
        // After three misses, flash the answer so nobody gets stuck.
        for (const el of this.zoneRects.get(q.correct_zone)) el.classList.add('zone-aim');
        msg += ' Hint: look at the outlined part.';
      }
      feedback.innerHTML = msg;
    }
  }

  // ── Edit mode: drag on the image to measure a rectangle ──────────────────

  startEditMode() {
    this.chkHotspots.checked = true;
    this.overlayEl.classList.add('show-all');
    const panel = document.getElementById('edit-panel');
    const out = document.getElementById('edit-output');
    const coords = document.getElementById('edit-coords');
    panel.style.display = 'block';

    const box = document.createElement('div');
    box.id = 'edit-box';
    this.overlayEl.appendChild(box);

    const pct = e => {
      const r = this.imgEl.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)),
        y: Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)),
      };
    };
    let start = null;

    this.overlayEl.addEventListener('pointermove', e => {
      const p = pct(e);
      coords.textContent = 'x: ' + p.x.toFixed(2) + '%   y: ' + p.y.toFixed(2) + '%';
      if (!start) return;
      box.style.left = Math.min(start.x, p.x) + '%';
      box.style.top = Math.min(start.y, p.y) + '%';
      box.style.width = Math.abs(p.x - start.x) + '%';
      box.style.height = Math.abs(p.y - start.y) + '%';
    });
    this.overlayEl.addEventListener('pointerdown', e => {
      if (!e.shiftKey) return; // hold Shift and drag to draw
      e.preventDefault();
      start = pct(e);
      this.dragging = true;
      box.style.display = 'block';
    });
    window.addEventListener('pointerup', e => {
      if (!start) return;
      const p = pct(e);
      const rect = {
        x1: +Math.min(start.x, p.x).toFixed(2), y1: +Math.min(start.y, p.y).toFixed(2),
        x2: +Math.max(start.x, p.x).toFixed(2), y2: +Math.max(start.y, p.y).toFixed(2),
      };
      out.value = JSON.stringify(rect);
      start = null;
      this.dragging = false;
    });
  }

  esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

const sim = new BoardOverlay();
document.addEventListener('DOMContentLoaded', () => sim.init());
