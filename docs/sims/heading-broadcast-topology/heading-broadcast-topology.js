// Heading Broadcast Network Topology - Mermaid
// CANVAS_HEIGHT: 440
// Bloom L4 (Analyze - differentiate): compare the one-to-many UDP broadcast
// topology of the heading swarm with Chapter 12's one-to-one BLE pairing and
// Chapter 11's router-hosted WiFi. Hover or click any node, arrow label, or the
// dashed network box to read what it does. The toolbar switches topologies and
// adds a 4th follower so students can see what the sender must change.

(function () {
  'use strict';

  const PURPLE = '#9932CC';   // DarkOrchid - NET taxonomy color

  // ---------------------------------------------------------------- views
  const VIEWS = {
    udp: {
      button: 'UDP broadcast',
      code(n) {
        let s = 'flowchart TD\n';
        s += '  subgraph NET["Same WiFi network, master-hosted — no internet router"]\n';
        s += '    direction TB\n';
        s += '    Master["Master Robot<br/>(hosts WiFi AP +<br/>broadcasts UDP)"]:::master\n';
        for (let i = 1; i <= n; i++) s += `    F${i}["Follower ${i}"]:::follower\n`;
        for (let i = 1; i <= n; i++) s += `    Master -->|"UDP heading<br/>packet"| F${i}\n`;
        s += '  end\n';
        s += '  classDef master fill:#9932CC,stroke:#4B0082,stroke-width:2px,color:#fff,font-size:16px\n';
        s += '  classDef follower fill:#E6C8F5,stroke:#9932CC,stroke-width:2px,color:#222,font-size:16px\n';
        s += '  style NET fill:#FFFFFF,stroke:#808080,stroke-width:2px,stroke-dasharray:6 4,color:#444\n';
        s += `  linkStyle default stroke:${PURPLE},stroke-width:2px\n`;
        return s;
      },
      summary(n) {
        return {
          title: 'UDP broadcast',
          rows: [
            ['Network host', 'The master robot'],
            ['Links', '1 sender, ' + n + ' listeners'],
            ['Sends per update', '1 packet to 192.168.4.255'],
            ['To add a follower', 'No master code change']
          ]
        };
      },
      nodes: {
        Master: 'The <b>master robot</b> does two jobs. It hosts its own WiFi access point, and it sends the heading broadcast 50 times a second. In Chapter 11 the Pico W joined someone else\'s router instead.',
        F: 'This <b>follower</b> only listens. It never sends anything back. If one packet is lost, that is not a failure: the next one arrives 20 ms later.',
        NET: 'The <b>dashed box</b> is one WiFi network that the master hosts. Every robot joins it. There is no internet router in the middle.'
      },
      edge: 'Every <b>UDP heading packet</b> arrow is the same. The master sends ONE packet to the broadcast address, and each follower gets a copy. So a 4th follower needs no change to the master\'s code.'
    },
    ble: {
      button: 'BLE pairing',
      code(n) {
        let s = 'flowchart TD\n';
        s += '  Leader["Leader Robot<br/>(BLE central)"]:::leader\n';
        for (let i = 1; i <= n; i++) s += `  F${i}["Follower ${i}"]:::follower\n`;
        for (let i = 1; i <= n; i++) s += `  Leader <-->|"connection ${i}"| F${i}\n`;
        s += '  classDef leader fill:#1E5AA8,stroke:#0B2E59,stroke-width:2px,color:#fff,font-size:16px\n';
        s += '  classDef follower fill:#CFE2F7,stroke:#1E5AA8,stroke-width:2px,color:#222,font-size:16px\n';
        s += '  linkStyle default stroke:#1E5AA8,stroke-width:2px\n';
        return s;
      },
      summary(n) {
        return {
          title: 'BLE pairing (Ch. 12)',
          rows: [
            ['Network host', 'None (' + n + ' separate links)'],
            ['Links', n + ' one-to-one connections'],
            ['Sends per update', n + ' writes, one per follower'],
            ['To add a follower', 'Scan and connect again']
          ]
        };
      },
      nodes: {
        Leader: 'The <b>BLE leader</b> (the central) must scan for each follower by name and connect to it, one at a time. It keeps a separate connection for every follower.',
        F: 'Each <b>BLE follower</b> (a peripheral) advertises its own name, such as follower-2, and accepts one connection. It only hears commands written to its own connection.'
      },
      edge: 'This is its <b>own one-to-one connection</b>. To reach every follower, the leader writes the same command once per connection. One more follower means one more connection to manage.'
    },
    router: {
      button: 'Router WiFi',
      code() {
        let s = 'flowchart TD\n';
        s += '  subgraph HOME["Existing WiFi network, router-hosted (Chapter 11)"]\n';
        s += '    direction TB\n';
        s += '    Router["WiFi Router<br/>(hosts the network)"]:::router\n';
        s += '    Laptop["Laptop browser<br/>(joins as a station)"]:::station\n';
        s += '    Pico["Pico W web server<br/>(joins as a station)"]:::station\n';
        s += '    Router <-->|"TCP connection"| Laptop\n';
        s += '    Router <-->|"TCP connection"| Pico\n';
        s += '  end\n';
        s += '  Internet(("Internet")):::internet\n';
        s += '  Router -.-|"optional"| Internet\n';
        s += '  classDef router fill:#2E7D32,stroke:#1B4D1E,stroke-width:2px,color:#fff,font-size:16px\n';
        s += '  classDef station fill:#D7EFD8,stroke:#2E7D32,stroke-width:2px,color:#222,font-size:16px\n';
        s += '  classDef internet fill:#EEEEEE,stroke:#888,stroke-width:1px,color:#333,font-size:14px\n';
        s += '  style HOME fill:#FFFFFF,stroke:#808080,stroke-width:2px,color:#444\n';
        s += '  linkStyle default stroke:#2E7D32,stroke-width:2px\n';
        return s;
      },
      summary() {
        return {
          title: 'Router WiFi (Ch. 11)',
          rows: [
            ['Network host', 'A router someone else set up'],
            ['Links', 'TCP, one-to-one'],
            ['Sends per update', 'One per connection'],
            ['To add a robot', 'One more connection']
          ]
        };
      },
      nodes: {
        Router: 'In Chapter 11, a <b>WiFi router</b> you did not set up hosts the network. Every packet between devices passes through it.',
        Laptop: 'The <b>laptop browser</b> opens a TCP connection to the Pico W\'s IP address. TCP links exactly two devices.',
        Pico: 'The <b>Pico W</b> joins the router\'s network as a station and runs a web server. It needs the network name and password from someone else.',
        Internet: 'The router may also connect to the <b>internet</b>. The robot swarm does not need it at all.',
        HOME: 'This box is a <b>router-hosted network</b>. It must already exist before any robot can join it.'
      },
      edge: 'A <b>TCP connection</b> is one-to-one: it links exactly two devices, and the router passes packets along. It is reliable, but reaching many robots means many connections.'
    }
  };

  const DEFAULT_TEXT = 'Hover over or click any box, arrow label, or the dashed network outline to learn what it does.';

  let view = 'udp';
  let fourth = false;
  let renderCount = 0;
  let els = {};

  // ---------------------------------------------------------------- layout
  function buildLayout() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="toolbar">
        <span class="lbl">Topology:</span>
        <button data-view="udp"></button>
        <button data-view="ble"></button>
        <button data-view="router"></button>
        <label><input type="checkbox" id="fourth"> Add Follower 4</label>
      </div>
      <div class="row">
        <div class="diagram-panel" id="diagram"></div>
        <div class="info-panel">
          <div class="card" id="summary"></div>
          <div class="card"><h3>Details</h3><div id="details"></div></div>
        </div>
      </div>`;
    els.diagram = document.getElementById('diagram');
    els.summary = document.getElementById('summary');
    els.details = document.getElementById('details');
    els.fourth = document.getElementById('fourth');
    main.querySelectorAll('button[data-view]').forEach(b => {
      b.textContent = VIEWS[b.dataset.view].button;
      b.addEventListener('click', () => { view = b.dataset.view; render(); });
    });
    els.fourth.addEventListener('change', () => { fourth = els.fourth.checked; render(); });
  }

  function showSummary() {
    const n = fourth ? 4 : 3;
    const s = VIEWS[view].summary(n);
    let html = `<h3>Compare: ${s.title}</h3><table>`;
    for (const r of s.rows) html += `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`;
    els.summary.innerHTML = html + '</table>';
  }

  function setDetails(html) { els.details.innerHTML = html; }

  function clearPicked() {
    els.diagram.querySelectorAll('.picked').forEach(e => e.classList.remove('picked'));
  }

  // ---------------------------------------------------------------- render
  async function render() {
    document.querySelectorAll('.toolbar button').forEach(b =>
      b.classList.toggle('active', b.dataset.view === view));
    els.fourth.disabled = (view === 'router');
    els.fourth.parentElement.style.opacity = view === 'router' ? 0.45 : 1;
    showSummary();
    setDetails(view === 'router' ? DEFAULT_TEXT + ' (Follower 4 applies to the robot swarms only.)' : DEFAULT_TEXT);
    const n = (fourth && view !== 'router') ? 4 : 3;
    const code = VIEWS[view].code(n);
    renderCount += 1;
    const { svg, bindFunctions } = await mermaid.render('topo' + renderCount, code);
    els.diagram.innerHTML = svg;
    if (bindFunctions) bindFunctions(els.diagram);
    const svgEl = els.diagram.querySelector('svg');
    svgEl.removeAttribute('height');
    svgEl.style.maxWidth = '100%';
    svgEl.style.maxHeight = '100%';
    attachInteractions();
  }

  function nodeKey(id) {
    const m = id.match(/flowchart-(.+)-\d+$/);
    return m ? m[1] : null;
  }

  function infoForNode(key) {
    const v = VIEWS[view];
    if (v.nodes[key]) return v.nodes[key];
    if (/^F\d$/.test(key) && v.nodes.F) return v.nodes.F.replace('<b>follower</b>', '<b>' + key.replace('F', 'Follower ') + '</b>');
    return null;
  }

  function attachInteractions() {
    const v = VIEWS[view];
    els.diagram.querySelectorAll('.node').forEach(node => {
      const key = nodeKey(node.id);
      const info = key && infoForNode(key);
      if (!info) return;
      const show = () => { clearPicked(); node.classList.add('picked'); setDetails(info); };
      node.addEventListener('mouseenter', show);
      node.addEventListener('click', show);
    });
    // edges: both the arrow path and its label show the edge explanation
    // Each edge label's inner <g class="label" data-id="L_A_B_0"> names its arrow path.
    const labelById = {};
    els.diagram.querySelectorAll('g.edgeLabel').forEach(g => {
      const inner = g.querySelector('[data-id]');
      if (inner) labelById[inner.getAttribute('data-id')] = g;
    });
    els.diagram.querySelectorAll('.flowchart-link').forEach(p => {
      const m = p.id.match(/(L_.+)$/);
      const label = m ? labelById[m[1]] : null;
      const toInternet = /Internet/.test(p.id);
      const info = toInternet ? v.nodes.Internet : v.edge;
      const show = () => { clearPicked(); p.classList.add('picked'); setDetails(info); };
      p.addEventListener('mouseenter', show);
      p.addEventListener('click', show);
      if (label) {
        label.addEventListener('mouseenter', show);
        label.addEventListener('click', show);
      }
    });
    // the dashed network box (subgraph)
    els.diagram.querySelectorAll('.cluster').forEach(c => {
      const key = c.id.includes('HOME') ? 'HOME' : (c.id.includes('NET') ? 'NET' : null);
      if (!key || !v.nodes[key]) return;
      const rect = c.querySelector('rect');
      const show = (e) => {
        if (e.target.closest('.node')) return;
        clearPicked(); setDetails(v.nodes[key]);
      };
      (rect || c).addEventListener('click', show);
      c.querySelectorAll('.cluster-label').forEach(l => {
        l.addEventListener('mouseenter', show);
        l.addEventListener('click', show);
      });
    });
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
        nodeSpacing: 22,
        rankSpacing: 60,
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
