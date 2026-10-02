// 9-DOF IMU Chip Layout - Mermaid
// CANVAS_HEIGHT: 420
// Bloom L2 (Understand - explain): a "9-DOF IMU module" is really two separate
// sensor chips (L3GD20 gyroscope at 0x6B, LSM303DLHC accelerometer at 0x19 +
// magnetometer at 0x1E) sharing one bus on Pico W GPIO16/17 (I2C0). The board
// also carries a bonus BMP180 (0x77) that is not used but shows up in every scan.
// Hover or click any box or arrow label for an explanation. The scenario buttons
// show what i2c.scan() prints when every chip answers, or when one chip's wiring
// has failed. Addresses match src/kits/9-dof-imu/config.py (probe-confirmed).

(function () {
  'use strict';

  const INFO = {
    Bus: 'Pico W <b>GPIO16 (SDA)</b> and <b>GPIO17 (SCL)</b> form I2C bus 0: one shared pair of wires, the same bus the time-of-flight sensor and OLED display used earlier. Many devices can share it, as long as each address is different.',
    Gyro: 'The <b>L3GD20</b> gyroscope chip measures how fast the robot turns. It answers at address <b>0x6B</b> (0x6A if its SDO pin is grounded). Its WHO_AM_I register reads 0xD4 (0xD7 on the L3GD20H). Gyroscopes drift slowly, so we calibrate at startup.',
    AccMag: 'The <b>LSM303DLHC</b> is ONE chip with TWO sensors inside, and each sensor has its own address: the accelerometer answers at <b>0x19</b> and the magnetometer at <b>0x1E</b>. The accelerometer feels gravity, so it senses tilt. The magnetometer is a compass, and nearby motors bend its reading.',
    Bmp: 'The <b>BMP180</b> is a bonus temperature and air-pressure chip on the same board (that is why its label says "10 DOF"). It answers at <b>0x77</b>. We never use it, but it still shows up in every scan.',
    Rate: '<b>Rotation rate</b> in degrees per second (deg/s) around X, Y, and Z. For steering we use Z: how fast the robot spins left or right. That is 3 of the 9 degrees of freedom.',
    Accel: '<b>Acceleration</b> in g on X, Y, and Z. Sitting still, the total is about 1.0 g, which is gravity pulling down. It is used to sense tilt and bumps. That is 3 more degrees of freedom.',
    Mag: '<b>Magnetic field</b> in gauss on X, Y, and Z. Earth\'s field is only about 0.25 to 0.65 gauss. We use X and Y with atan2() to get a compass heading. That is the last 3 of the 9 degrees of freedom.',
    EdgeGyro: 'Both chips share the same two wires. The Pico W puts the address <b>0x6B</b> at the start of a message, and only the L3GD20 answers it.',
    EdgeAcc: 'Same two wires, two more addresses. A message that starts with <b>0x19</b> reaches the accelerometer half of the LSM303DLHC. A message that starts with <b>0x1E</b> reaches the magnetometer half.',
    EdgeBmp: 'Same two wires again. Only the BMP180 answers <b>0x77</b>. Our code never sends it a message, but i2c.scan() still finds it.',
    EdgeAccel: 'The acceleration readings live in registers at address <b>0x19</b>. The Pico W reads them with readfrom_mem(0x19, register, 6).',
    EdgeMag: 'The magnetic field readings live in registers at address <b>0x1E</b>. The Pico W reads them with readfrom_mem(0x1E, register, 6).',
    EdgeData: 'Each chip keeps its readings in its own registers. The Pico W reads them with readfrom_mem(address, register, count).'
  };

  const SCENARIOS = {
    both: { button: 'All chips answer', gyro: true, acc: true },
    nogyro: { button: 'Gyro not answering', gyro: false, acc: true },
    noacc: { button: 'Accel/Mag not answering', gyro: true, acc: false }
  };

  const DEFAULT_TEXT = 'Hover over or click any box or arrow label to learn what it does.';
  let scenario = 'both';
  let renderCount = 0;
  const els = {};

  function code(sc) {
    const s = SCENARIOS[sc];
    let m = 'flowchart LR\n';
    m += '  Bus["Pico W GPIO16/17<br/>(I2C0)"]:::bus\n';
    m += '  Gyro["L3GD20<br/>Gyroscope<br/>(addr 0x6B)"]:::' + (s.gyro ? 'chip' : 'dead') + '\n';
    m += '  AccMag["LSM303DLHC<br/>Accel + Mag<br/>(0x19 + 0x1E)"]:::' + (s.acc ? 'chip' : 'dead') + '\n';
    m += '  Bmp["BMP180<br/>bonus chip<br/>(not used)"]:::extra\n';
    m += '  Rate["3-axis rotation<br/>rate (deg/s)"]:::leaf\n';
    m += '  Accel["3-axis<br/>acceleration (g)"]:::leaf\n';
    m += '  Mag["3-axis magnetic<br/>field (gauss)"]:::leaf\n';
    m += '  Bus ' + (s.gyro ? '-->' : '-.->') + '|"' + (s.gyro ? 'addr 0x6B' : 'no reply') + '"| Gyro\n';
    m += '  Bus ' + (s.acc ? '-->' : '-.->') + '|"' + (s.acc ? 'addr 0x19 + 0x1E' : 'no reply') + '"| AccMag\n';
    m += '  Bus -.->|"addr 0x77"| Bmp\n';
    m += '  Gyro --> Rate\n';
    m += '  AccMag -->|"0x19"| Accel\n';
    m += '  AccMag -->|"0x1E"| Mag\n';
    m += '  classDef bus fill:#1E90FF,stroke:#0B4F99,stroke-width:2px,color:#fff,font-size:16px\n';
    m += '  classDef chip fill:#FFFFFF,stroke:#000000,stroke-width:2px,color:#000,font-size:16px\n';
    m += '  classDef dead fill:#FFF0F0,stroke:#DC143C,stroke-width:2px,stroke-dasharray:6 4,color:#8B0000,font-size:16px\n';
    m += '  classDef extra fill:#F4F4F4,stroke:#9E9E9E,stroke-width:1px,stroke-dasharray:4 3,color:#555,font-size:14px\n';
    m += '  classDef leaf fill:#E6E6E6,stroke:#9E9E9E,stroke-width:1px,color:#222,font-size:15px\n';
    m += '  linkStyle default stroke:#555,stroke-width:2px\n';
    if (!s.gyro) m += '  linkStyle 0 stroke:#DC143C,stroke-width:2px\n';
    if (!s.acc) m += '  linkStyle 1 stroke:#DC143C,stroke-width:2px\n';
    return m;
  }

  function buildLayout() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="toolbar">
        <span class="lbl">Try:</span>
        <button data-sc="both"></button>
        <button data-sc="nogyro"></button>
        <button data-sc="noacc"></button>
      </div>
      <div class="row">
        <div class="diagram-panel" id="diagram"></div>
        <div class="info-panel">
          <div class="card"><h3>What i2c.scan() prints</h3>
            <div class="scan" id="scan"></div><div id="scanNote"></div></div>
          <div class="card"><h3>Details</h3><div id="details"></div></div>
        </div>
      </div>`;
    els.diagram = document.getElementById('diagram');
    els.scan = document.getElementById('scan');
    els.scanNote = document.getElementById('scanNote');
    els.details = document.getElementById('details');
    main.querySelectorAll('button[data-sc]').forEach(b => {
      b.textContent = SCENARIOS[b.dataset.sc].button;
      b.addEventListener('click', () => { scenario = b.dataset.sc; render(); });
    });
  }

  function showScan() {
    const s = SCENARIOS[scenario];
    const found = [];
    if (s.acc) found.push("'0x19'", "'0x1e'");
    if (s.gyro) found.push("'0x6b'");
    found.push("'0x77'");
    const allFound = s.gyro && s.acc;
    els.scan.innerHTML = '&gt;&gt;&gt; i2c.scan()<br/>Devices found: <span class="' +
      (allFound ? 'ok' : 'bad') + '">[' + found.join(', ') + ']</span>';
    if (allFound) {
      els.scanNote.innerHTML = '<b>Four addresses, not one:</b> the gyro (0x6B), the two halves of the LSM303DLHC (0x19, 0x1E), and the unused BMP180 (0x77), all on one bus.';
      els.scanNote.style.color = 'darkgreen';
    } else {
      const missing = s.gyro ? 'LSM303DLHC (0x19 and 0x1E are' : 'L3GD20 (0x6B is';
      els.scanNote.innerHTML = '<b>Something is missing.</b> The ' + missing + ' gone). Check that chip\'s wiring or solder joints.';
      els.scanNote.style.color = 'crimson';
    }
  }

  function setDetails(html) { els.details.innerHTML = html; }
  function clearPicked() { els.diagram.querySelectorAll('.picked').forEach(e => e.classList.remove('picked')); }

  async function render() {
    document.querySelectorAll('.toolbar button').forEach(b => b.classList.toggle('active', b.dataset.sc === scenario));
    showScan();
    setDetails(DEFAULT_TEXT);
    renderCount += 1;
    const { svg, bindFunctions } = await mermaid.render('imu' + renderCount, code(scenario));
    els.diagram.innerHTML = svg;
    if (bindFunctions) bindFunctions(els.diagram);
    const svgEl = els.diagram.querySelector('svg');
    svgEl.removeAttribute('height');
    svgEl.style.maxWidth = '100%';
    svgEl.style.maxHeight = '100%';
    attachInteractions();
  }

  function attachInteractions() {
    const s = SCENARIOS[scenario];
    els.diagram.querySelectorAll('.node').forEach(node => {
      const m = node.id.match(/flowchart-(.+)-\d+$/);
      const key = m ? m[1] : null;
      if (!key || !INFO[key]) return;
      let info = INFO[key];
      if ((key === 'Gyro' && !s.gyro) || (key === 'AccMag' && !s.acc)) {
        info = '<b style="color:crimson">Not answering in this scenario.</b> ' + info;
      }
      const show = () => { clearPicked(); node.classList.add('picked'); setDetails(info); };
      node.addEventListener('mouseenter', show);
      node.addEventListener('click', show);
    });
    const labelById = {};
    els.diagram.querySelectorAll('g.edgeLabel').forEach(g => {
      const inner = g.querySelector('[data-id]');
      if (inner) labelById[inner.getAttribute('data-id')] = g;
    });
    els.diagram.querySelectorAll('.flowchart-link').forEach(p => {
      const m = p.id.match(/(L_.+)$/);
      const id = m ? m[1] : '';
      let info = INFO.EdgeData;
      if (id.startsWith('L_Bus_Gyro')) info = s.gyro ? INFO.EdgeGyro : 'No chip answers at <b>0x6B</b>, so the scan is missing the gyroscope. Reseat the wires or reflow the solder on the gyroscope side.';
      if (id.startsWith('L_Bus_AccMag')) info = s.acc ? INFO.EdgeAcc : 'No chip answers at <b>0x19</b> or <b>0x1E</b>, so the scan is missing both halves of the LSM303DLHC. Reseat the wires or reflow the solder on the accel/mag side.';
      if (id.startsWith('L_Bus_Bmp')) info = INFO.EdgeBmp;
      if (id.startsWith('L_AccMag_Accel')) info = INFO.EdgeAccel;
      if (id.startsWith('L_AccMag_Mag')) info = INFO.EdgeMag;
      const show = () => { clearPicked(); p.classList.add('picked'); setDetails(info); };
      p.addEventListener('mouseenter', show);
      p.addEventListener('click', show);
      const label = labelById[id];
      if (label) { label.addEventListener('mouseenter', show); label.addEventListener('click', show); }
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
        nodeSpacing: 26,
        rankSpacing: 34,
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
