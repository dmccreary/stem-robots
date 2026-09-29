// Swarm Robot State Machine - Mermaid
// CANVAS_HEIGHT: 470
// Bloom L2 (Understand - classify): a state machine organizes a swarm robot's
// competing behaviors (SEARCH, FOLLOW, DANCE, AVOID) into one clear structure,
// and the AVOID transition can interrupt any other state.
// Explore mode: send events and watch the current state (gold outline) follow
// the arrows, or see that a state ignores an event it has no arrow for.
// Classify quiz: read a robot situation and click the state it belongs to.

(function () {
  'use strict';

  const COLORS = { SEARCH: 'gray', FOLLOW: 'olivedrab', AVOID: 'crimson', DANCE: 'mediumpurple' };

  const STATE_INFO = {
    SEARCH: '<b>SEARCH:</b> the robot is scanning for the leader\'s advertising signal. Its motors are idle.',
    FOLLOW: '<b>FOLLOW:</b> the robot is connected to the leader and running its convoy or command logic.',
    AVOID: '<b>AVOID:</b> the robot\'s own time-of-flight sensor reported an obstacle. This state can interrupt any other state.',
    DANCE: '<b>DANCE:</b> the robot is doing a timed dance step, synced to the leader\'s beat.'
  };

  // events -> transitions. "from" lists every state that has an arrow for the event.
  const EVENTS = [
    { id: 'found', label: 'leader signal found', from: ['SEARCH'], to: 'FOLLOW',
      info: '<b>SEARCH → FOLLOW</b> when the robot hears the leader\'s advertising signal and connects to it.' },
    { id: 'lost', label: 'signal lost', from: ['FOLLOW'], to: 'SEARCH',
      info: '<b>FOLLOW → SEARCH</b> when the connection to the leader drops, for example because the leader drove out of range.' },
    { id: 'beat', label: 'dance beat received', from: ['FOLLOW'], to: 'DANCE',
      info: '<b>FOLLOW → DANCE</b> when the leader sends the shared dance beat.' },
    { id: 'finished', label: 'routine finished', from: ['DANCE'], to: 'FOLLOW',
      info: '<b>DANCE → FOLLOW</b> when the last step of the dance routine is done.' },
    { id: 'obstacle', label: 'obstacle too close', from: ['SEARCH', 'FOLLOW', 'DANCE'], to: 'AVOID', danger: true,
      info: '<b>Any state → AVOID</b> when the robot\'s own distance sensor reads too close. A safety behavior must be able to interrupt everything, so every state has this dashed arrow.' },
    { id: 'clear', label: 'path clear', from: ['AVOID'], to: 'FOLLOW',
      info: '<b>AVOID → FOLLOW</b> when the sensor reports that the path is clear again. If the leader is gone by then, the next event will be "signal lost".' }
  ];

  // Mermaid edge id (L_FROM_TO_0) for each event and starting state
  function edgeId(from, to) { return 'L_' + from + '_' + to + '_0'; }

  const SCENARIOS = [
    ['Motors are idle. The robot is listening for the leader\'s advertising packets.', 'SEARCH'],
    ['It is connected to the leader and keeping 30 cm behind the robot ahead.', 'FOLLOW'],
    ['Its own time-of-flight sensor reads 8 cm, so it is turning away.', 'AVOID'],
    ['It is spinning in place on the leader\'s beat, step 3 of 8.', 'DANCE'],
    ['It was dancing, but a chair leg just appeared 10 cm ahead.', 'AVOID'],
    ['The leader drove out of range, so the connection dropped.', 'SEARCH'],
    ['The obstacle is gone, so it rejoins the convoy.', 'FOLLOW'],
    ['The dance routine just ended, and it goes back to its convoy job.', 'FOLLOW'],
    ['It just powered on and has not heard any leader yet.', 'SEARCH'],
    ['While searching, it rolled toward a wall that is 5 cm away.', 'AVOID']
  ];

  const MERMAID = [
    'flowchart TD',
    '  SEARCH("SEARCH"):::search',
    '  FOLLOW("FOLLOW"):::follow',
    '  DANCE("DANCE"):::dance',
    '  AVOID("AVOID"):::avoid',
    '  SEARCH -->|"leader signal found"| FOLLOW',
    '  FOLLOW -->|"signal lost"| SEARCH',
    '  FOLLOW -->|"dance beat received"| DANCE',
    '  DANCE -->|"routine finished"| FOLLOW',
    '  SEARCH -.->|"obstacle too close"| AVOID',
    '  FOLLOW -.->|"obstacle too close"| AVOID',
    '  DANCE -.->|"obstacle too close"| AVOID',
    '  AVOID -.->|"path clear"| FOLLOW',
    '  classDef search fill:#808080,stroke:#333,stroke-width:2px,color:#fff,font-size:18px,font-weight:bold',
    '  classDef follow fill:#6B8E23,stroke:#333,stroke-width:2px,color:#fff,font-size:18px,font-weight:bold',
    '  classDef dance fill:#9370DB,stroke:#333,stroke-width:2px,color:#fff,font-size:18px,font-weight:bold',
    '  classDef avoid fill:#DC143C,stroke:#333,stroke-width:2px,color:#fff,font-size:18px,font-weight:bold',
    '  linkStyle default stroke:#555,stroke-width:2px',
    '  linkStyle 4,5,6,7 stroke:#DC143C,stroke-width:2px'
  ].join('\n');

  let current = 'SEARCH';
  let mode = 'explore';
  let quizIdx = -1, quizRight = 0, quizTries = 0, quizAnswered = false;
  let order = [];
  const els = {};
  let nodeEls = {}, edgeEls = {};
  // highlights (Mermaid puts classDef styles inline, so we repaint inline styles)
  const marks = { current: null, picked: null, fired: null, pickedEdge: null };
  const MARK_STYLE = {
    current: ['gold', '7px'], picked: ['black', '4px'], fired: ['gold', '6px'], pickedEdge: ['black', '4px']
  };

  function shapesOf(el) {
    return el.tagName.toLowerCase() === 'path' ? [el] : Array.from(el.querySelectorAll('rect, path, polygon, circle'));
  }

  function paint() {
    els.diagram.querySelectorAll('[data-orig-style]').forEach(sh => {
      sh.setAttribute('style', sh.dataset.origStyle);
    });
    for (const key of ['current', 'picked', 'fired', 'pickedEdge']) {
      const el = marks[key];
      if (!el) continue;
      for (const sh of shapesOf(el)) {
        if (sh.dataset.origStyle === undefined) sh.dataset.origStyle = sh.getAttribute('style') || '';
        sh.style.setProperty('stroke', MARK_STYLE[key][0], 'important');
        sh.style.setProperty('stroke-width', MARK_STYLE[key][1], 'important');
      }
    }
  }

  // ---------------------------------------------------------------- layout
  function buildLayout() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="toolbar">
        <span class="lbl">Mode:</span>
        <button data-mode="explore">Explore events</button>
        <button data-mode="quiz">Classify quiz</button>
        <button id="restart">Restart</button>
        <span class="state" id="stateBox"></span>
      </div>
      <div class="row">
        <div class="diagram-panel" id="diagram"></div>
        <div class="info-panel">
          <div class="card" id="eventCard"><h3>Send an event to the robot</h3><div class="events" id="events"></div></div>
          <div class="card" id="quizCard" style="display:none"><h3>Which state is this?</h3><div id="quiz"></div></div>
          <div class="card"><h3>Details</h3><div id="details"></div></div>
        </div>
      </div>`;
    els.diagram = document.getElementById('diagram');
    els.details = document.getElementById('details');
    els.stateBox = document.getElementById('stateBox');
    els.eventCard = document.getElementById('eventCard');
    els.quizCard = document.getElementById('quizCard');
    els.quiz = document.getElementById('quiz');
    const evBox = document.getElementById('events');
    for (const ev of EVENTS) {
      const b = document.createElement('button');
      b.textContent = ev.label;
      b.dataset.ev = ev.id;
      if (ev.danger) b.classList.add('danger');
      b.addEventListener('click', () => fireEvent(ev));
      evBox.appendChild(b);
    }
    main.querySelectorAll('button[data-mode]').forEach(b =>
      b.addEventListener('click', () => setMode(b.dataset.mode)));
    document.getElementById('restart').addEventListener('click', restart);
  }

  function setMode(m) {
    mode = m;
    document.querySelectorAll('button[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    els.eventCard.style.display = m === 'explore' ? '' : 'none';
    els.quizCard.style.display = m === 'quiz' ? '' : 'none';
    els.stateBox.style.visibility = m === 'explore' ? 'visible' : 'hidden';
    clearMarks();
    if (m === 'quiz') {
      order = shuffle(SCENARIOS.map((_, i) => i));
      quizIdx = -1; quizRight = 0; quizTries = 0;
      nextScenario();
      setDetails('Read the situation, then click the state box it belongs to.');
    } else {
      showCurrent();
      setDetails('The gold outline shows the current state. Send an event, or hover over any box or arrow label.');
    }
  }

  function restart() {
    current = 'SEARCH';
    setMode(mode);
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function setDetails(html) { els.details.innerHTML = html; }

  function clearMarks() {
    marks.current = marks.picked = marks.fired = marks.pickedEdge = null;
    paint();
  }

  function showCurrent() {
    marks.current = (mode === 'explore' && nodeEls[current]) ? nodeEls[current] : null;
    paint();
    els.stateBox.innerHTML = 'Current state: <b style="background:' + COLORS[current] + '">' + current + '</b>';
    // hint which events have an arrow out of the current state
    document.querySelectorAll('.events button').forEach(b => {
      const ev = EVENTS.find(e => e.id === b.dataset.ev);
      b.classList.toggle('hint', ev.from.includes(current));
    });
  }

  // ---------------------------------------------------------------- explore
  function fireEvent(ev) {
    marks.fired = null; marks.pickedEdge = null; marks.picked = null;
    if (ev.from.includes(current)) {
      const from = current;
      marks.fired = edgeEls[edgeId(from, ev.to)] || null;
      current = ev.to;
      setDetails('<b>' + from + '</b> + "' + ev.label + '" → <b>' + ev.to + '</b>. This happens ' + ev.info.replace(/^<b>[^<]*<\/b> /, ''));
    } else {
      setDetails('<b>' + current + '</b> has no arrow for "' + ev.label + '", so the robot ignores that event and stays in <b>' +
        current + '</b>. Only the arrows leaving the current state matter.');
    }
    showCurrent();
  }

  // ---------------------------------------------------------------- quiz
  function nextScenario() {
    quizIdx = (quizIdx + 1) % order.length;
    quizAnswered = false;
    const [text] = SCENARIOS[order[quizIdx]];
    els.quiz.innerHTML = '<div class="scenario">"' + text + '"</div>' +
      '<div>Score: ' + quizRight + ' of ' + quizTries + '</div>';
    clearMarks();
  }

  function answer(state) {
    if (quizAnswered) return;
    const [text, right] = SCENARIOS[order[quizIdx]];
    quizTries++;
    quizAnswered = true;
    marks.picked = nodeEls[state] || null;
    marks.current = nodeEls[right] || null;
    marks.fired = marks.pickedEdge = null;
    paint();
    let msg;
    if (state === right) { quizRight++; msg = '<span class="ok">Correct: ' + right + '.</span> '; }
    else msg = '<span class="no">Not quite. It is ' + right + '.</span> ';
    els.quiz.innerHTML = '<div class="scenario">"' + text + '"</div>' + msg +
      '<div>Score: ' + quizRight + ' of ' + quizTries + '</div><button id="nextQ">Next situation</button>';
    document.getElementById('nextQ').addEventListener('click', nextScenario);
    setDetails(STATE_INFO[right]);
  }

  // ---------------------------------------------------------------- render
  async function render() {
    const { svg, bindFunctions } = await mermaid.render('fsm1', MERMAID);
    els.diagram.innerHTML = svg;
    if (bindFunctions) bindFunctions(els.diagram);
    const svgEl = els.diagram.querySelector('svg');
    svgEl.removeAttribute('height');
    svgEl.style.maxWidth = '100%';
    svgEl.style.maxHeight = '100%';

    nodeEls = {};
    els.diagram.querySelectorAll('.node').forEach(node => {
      const m = node.id.match(/flowchart-(.+)-\d+$/);
      if (!m || !STATE_INFO[m[1]]) return;
      const key = m[1];
      nodeEls[key] = node;
      node.addEventListener('mouseenter', () => { if (mode === 'explore') setDetails(STATE_INFO[key]); });
      node.addEventListener('click', () => {
        if (mode === 'quiz') answer(key);
        else setDetails(STATE_INFO[key]);
      });
    });

    const labelById = {};
    els.diagram.querySelectorAll('g.edgeLabel').forEach(g => {
      const inner = g.querySelector('[data-id]');
      if (inner) labelById[inner.getAttribute('data-id')] = g;
    });
    edgeEls = {};
    els.diagram.querySelectorAll('.flowchart-link').forEach(p => {
      const m = p.id.match(/(L_.+)$/);
      if (!m) return;
      const id = m[1];
      edgeEls[id] = p;
      const ev = EVENTS.find(e => e.from.some(f => edgeId(f, e.to) === id));
      if (!ev) return;
      const show = () => {
        if (mode !== 'explore') return;
        marks.pickedEdge = p;
        paint();
        setDetails(ev.info);
      };
      p.addEventListener('mouseenter', show);
      p.addEventListener('click', show);
      if (labelById[id]) {
        labelById[id].addEventListener('mouseenter', show);
        labelById[id].addEventListener('click', show);
      }
    });
    setMode('explore');
  }

  function start() {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 40,
        rankSpacing: 55,
        subGraphTitleMargin: { top: 10, bottom: 14 }
      },
      themeVariables: { fontSize: '16px', fontFamily: 'Arial, Helvetica, sans-serif' }
    });
    buildLayout();
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
