// Sensor Filter Lab - Chart.js
// CANVAS_HEIGHT: 500
// Bloom L5 (Evaluate): judge when a moving average or a median filter is the
// better choice, and how the window size trades smoothness against lag.
// The filters match filtered_distance() and median_distance() in Chapter 8.
// Each reading keeps its own random numbers, so moving the Noise, Spike, or
// Window slider re-filters the SAME data. That keeps the comparison fair.

document.addEventListener('DOMContentLoaded', function () {
  const SHOWN = 100;          // readings on the chart
  const EXTRA = 16;           // older readings kept so every window is full
  const FAR = 150, NEAR = 40; // true distances (cm)

  // ---------- page layout (built here so main.html stays a plain shell) ----------
  const style = document.createElement('style');
  style.textContent = `
    main { box-sizing: border-box; height: 500px; display: flex; flex-direction: column;
           border: 1px solid silver; background: white; overflow: hidden; }
    #chart-wrap { position: relative; flex: 1 1 auto; min-height: 220px; background: aliceblue;
                  border-bottom: 1px solid silver; padding: 4px 8px 2px 4px; box-sizing: border-box; }
    #readout { display: flex; flex-wrap: wrap; gap: 4px 18px; padding: 6px 10px; font-size: 15px;
               background: aliceblue; border-bottom: 1px solid silver; }
    #readout b { font-weight: bold; }
    #controls { padding: 6px 10px 4px 10px; font-size: 16px; }
    .row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; margin-bottom: 6px; }
    .row label { white-space: nowrap; }
    .slider-group { display: flex; align-items: center; gap: 8px; flex: 1 1 240px; }
    .slider-group span { white-space: nowrap; min-width: 150px; }
    .slider-group input { flex: 1 1 auto; min-width: 80px; }
    button { font-size: 14px; }
  `;
  document.head.appendChild(style);

  const main = document.querySelector('main');
  main.innerHTML = `
    <div id="chart-wrap"><canvas id="filter-chart"
      aria-label="Line chart of raw ToF readings with moving average and median filter outputs"></canvas></div>
    <div id="readout"></div>
    <div id="controls">
      <div class="row">
        <button id="run">Start</button>
        <button id="walk">Person walks in</button>
        <button id="reset">Reset</button>
        <label><input type="checkbox" id="show-avg" checked> Show average</label>
        <label><input type="checkbox" id="show-med" checked> Show median</label>
      </div>
      <div class="row">
        <div class="slider-group"><span id="win-label"></span>
          <input type="range" id="win" min="1" max="15" step="2" value="5"></div>
        <div class="slider-group"><span id="noise-label"></span>
          <input type="range" id="noise" min="0" max="10" step="0.5" value="3"></div>
      </div>
      <div class="row">
        <div class="slider-group"><span id="spike-label"></span>
          <input type="range" id="spike" min="0" max="20" step="1" value="5"></div>
      </div>
    </div>`;

  const $ = id => document.getElementById(id);

  // ---------- data ----------
  let hist = [];          // { n, trueD, un, us, um, sg }
  let count = 0;          // reading number of the newest reading
  let trueD = FAR;
  let step = null;        // { n, target } for the latest "walks in / away"
  let timer = null;

  function newReading() {
    count += 1;
    hist.push({
      n: count, trueD,
      un: Math.random() * 2 - 1,          // noise draw in -1..1
      us: Math.random(),                   // spike draw: spike if us < chance
      um: Math.random(),                   // spike size draw
      sg: Math.random() < 0.5 ? -1 : 1     // spike direction
    });
    if (hist.length > SHOWN + EXTRA) hist.shift();
  }

  function fill() {
    hist = []; count = 0; trueD = FAR; step = null;
    for (let i = 0; i < SHOWN + EXTRA; i++) newReading();
  }

  const noise = () => parseFloat($('noise').value);
  const spike = () => parseInt($('spike').value, 10) / 100;
  const win = () => parseInt($('win').value, 10);

  // a spike jumps 40 to 80 cm away from the true value; a ToF never reads below 0
  function raw(h) {
    let v = h.trueD + h.un * noise();
    if (h.us < spike()) v += h.sg * (40 + 40 * h.um);
    return Math.max(0, v);
  }

  // the same logic as filtered_distance() and median_distance()
  function filters() {
    const r = hist.map(raw);
    const w = win();
    const avg = [], med = [];
    for (let i = 0; i < r.length; i++) {
      const part = r.slice(Math.max(0, i - w + 1), i + 1);   // fewer than w at the very start
      avg.push(part.reduce((a, b) => a + b, 0) / part.length);
      const s = part.slice().sort((a, b) => a - b);
      med.push(s[Math.floor(s.length / 2)]);
    }
    return { r, avg, med };
  }

  // ---------- chart ----------
  // shaded band over the last `window` readings, the data the filters are using now
  const windowBand = {
    id: 'windowBand',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const x0 = scales.x.getPixelForValue(count - win() + 0.5);
      const x1 = scales.x.getPixelForValue(count + 0.5);
      ctx.save();
      ctx.fillStyle = 'rgba(255, 165, 0, 0.16)';
      ctx.fillRect(x0, chartArea.top, Math.min(x1, chartArea.right) - x0, chartArea.bottom - chartArea.top);
      ctx.fillStyle = 'chocolate';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('window = ' + win(), Math.min(x1, chartArea.right) - 3, chartArea.top + 13);
      ctx.restore();
    }
  };

  const chart = new Chart($('filter-chart'), {
    type: 'line',
    data: {
      datasets: [
        { label: 'Raw ToF reading', data: [], showLine: false, pointRadius: 2.5,
          pointBackgroundColor: 'gray', borderColor: 'gray', order: 4 },
        { label: 'Moving average', data: [], borderColor: 'darkorange', borderWidth: 2.5,
          pointRadius: 0, order: 2 },
        { label: 'Median filter', data: [], borderColor: 'royalblue', borderWidth: 2.5,
          pointRadius: 0, order: 1 },
        { label: 'True distance', data: [], borderColor: 'seagreen', borderDash: [6, 5],
          borderWidth: 2, pointRadius: 0, stepped: true, order: 3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        title: { display: true, text: 'Sensor Filter Lab: raw vs. moving average vs. median',
                 font: { size: 17, weight: 'bold' }, color: 'black', padding: { top: 2, bottom: 2 } },
        legend: { position: 'top',
                  labels: { usePointStyle: true, boxHeight: 8, font: { size: 13 },
                            sort: (a, b) => a.datasetIndex - b.datasetIndex } },
        tooltip: {
          callbacks: {
            title: items => 'Reading ' + items[0].parsed.x,
            label: item => item.dataset.label + ': ' + item.parsed.y.toFixed(1) + ' cm'
          }
        }
      },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Reading number' },
             ticks: { stepSize: 10, precision: 0 },
             // label only multiples of 10 so the moving ends do not crowd the axis
             afterBuildTicks: axis => { axis.ticks = axis.ticks.filter(t => t.value % 10 === 0); } },
        y: { min: 0, max: 250, title: { display: true, text: 'Distance (cm)' },
             ticks: { stepSize: 50 } }
      }
    },
    plugins: [windowBand]
  });

  // ---------- metrics ----------
  const meanAbs = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

  function lagOf(out, first) {
    if (!step || step.n < first) return null;
    for (let i = 0; i < hist.length; i++) {
      if (hist[i].n < step.n) continue;
      if (Math.abs(out[i] - step.target) <= 10) return hist[i].n - step.n;
    }
    return 'waiting';
  }

  function lagText(l) {
    if (l === null) return 'lag: not measured yet';
    if (l === 'waiting') return 'lag: still catching up';
    return 'lag: ' + l + (l === 1 ? ' reading' : ' readings');
  }

  function render() {
    const { r, avg, med } = filters();
    const start = hist.length - SHOWN;           // only the last 100 are drawn and scored
    const idx = [...Array(SHOWN).keys()].map(k => k + start);
    const xy = arr => idx.map(i => ({ x: hist[i].n, y: arr[i] }));
    const tr = idx.map(i => hist[i].trueD);

    chart.data.datasets[0].data = xy(r);
    chart.data.datasets[1].data = xy(avg);
    chart.data.datasets[2].data = xy(med);
    chart.data.datasets[3].data = idx.map(i => ({ x: hist[i].n, y: hist[i].trueD }));
    chart.data.datasets[1].hidden = !$('show-avg').checked;
    chart.data.datasets[2].hidden = !$('show-med').checked;
    chart.options.scales.x.min = hist[start].n;
    chart.options.scales.x.max = count;
    chart.update('none');

    const first = hist[start].n;
    const rawErr = meanAbs(idx.map(i => r[i]), tr);
    const avgErr = meanAbs(idx.map(i => avg[i]), tr);
    const medErr = meanAbs(idx.map(i => med[i]), tr);
    $('readout').innerHTML =
      `<span style="color:dimgray">Raw noise: <b>${rawErr.toFixed(1)} cm</b></span>` +
      `<span style="color:chocolate">Average error: <b>${avgErr.toFixed(1)} cm</b>, ${lagText(lagOf(avg, first))}</span>` +
      `<span style="color:royalblue">Median error: <b>${medErr.toFixed(1)} cm</b>, ${lagText(lagOf(med, first))}</span>`;

    $('win-label').textContent = 'Window size: ' + win();
    $('noise-label').textContent = 'Noise: ±' + noise().toFixed(1) + ' cm';
    $('spike-label').textContent = 'Spike chance: ' + $('spike').value + '%';
  }

  // ---------- controls ----------
  function setRunning(on) {
    if (on && !timer) {
      timer = setInterval(() => { newReading(); render(); }, 100);   // 10 readings a second
    } else if (!on && timer) {
      clearInterval(timer); timer = null;
    }
    $('run').textContent = timer ? 'Pause' : 'Start';
  }

  $('run').addEventListener('click', () => setRunning(!timer));

  $('walk').addEventListener('click', () => {
    trueD = trueD === FAR ? NEAR : FAR;
    step = { n: count + 1, target: trueD };
    $('walk').textContent = trueD === NEAR ? 'Person walks away' : 'Person walks in';
    setRunning(true);                      // new readings are needed to see the change
  });

  $('reset').addEventListener('click', () => {
    setRunning(false);
    fill();
    $('walk').textContent = 'Person walks in';
    render();
  });

  for (const id of ['win', 'noise', 'spike', 'show-avg', 'show-med']) {
    $(id).addEventListener('input', render);
  }

  fill();
  render();
});
