// I2C vs SPI Wiring Comparison
// CANVAS_HEIGHT: 500
// Bloom L4 (Analyze) - Compare: wire the same devices to an I2C bus and to an
// SPI bus. I2C always uses 2 wires (SDA, SCL) and picks devices by address.
// SPI uses 3 shared wires (MOSI, MISO, SCK) plus one chip-select (CS) wire per
// device, but moves data about 25 times faster. A device that cannot use a
// bus (for example the VL53L0X on SPI) is shown dashed and does not count.
// Layout idea from learning-micropython/protocol-comparison.

let canvasWidth = 700;
let drawHeight = 430;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;
let defaultTextSize = 16;

let devBoxes = [], taskSelect, sendButton, resetButton;

const DEVICES = [
  { name: 'VL53L0X sensor', i2c: true, spi: false, addr: '0x29', col: 'teal' },
  { name: 'SSD1306 OLED', i2c: true, spi: true, addr: '0x3C', col: 'slateblue' },
  { name: 'SD card', i2c: false, spi: true, col: 'saddlebrown' },
  { name: 'Fast color display', i2c: false, spi: true, col: 'crimson' }
];
const TASKS = {
  'Read distance 10 times per second': 'Read distance: I2C is fine. Only a few bytes move, 10 times a second.',
  'Update OLED text': 'Update OLED text: I2C works well. A full 1 KB screen takes about 23 ms on I2C and under 1 ms on SPI.',
  'Write a sensor log to SD card': 'SD card log: use SPI. SD cards cannot use I2C at all.',
  'Refresh a full-color screen': 'Full-color screen: SPI is much better. Lots of data moves: a 240 x 240 frame is 115 KB, about 2.6 s on I2C but about 92 ms on SPI.'
};
const I2C_HZ = 400000, SPI_HZ = 10000000;

let sendStart = -99999;
const SEND_MS = 3500;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  const main = document.querySelector('main');

  const defaults = [true, true, false, false];
  for (let k = 0; k < DEVICES.length; k++) {
    const cb = createCheckbox(' ' + DEVICES[k].name.replace(' sensor', ''), defaults[k]);
    cb.parent(main);
    devBoxes.push(cb);
  }
  taskSelect = createSelect();
  taskSelect.parent(main);
  for (const t in TASKS) taskSelect.option(t);
  taskSelect.selected('Read distance 10 times per second');
  sendButton = createButton('Send data');
  sendButton.parent(main);
  sendButton.mousePressed(() => sendStart = millis());
  resetButton = createButton('Reset');
  resetButton.parent(main);
  resetButton.mousePressed(resetSim);

  positionControls();
  describe('Two panels compare the same robot devices wired to an I2C bus and to an SPI bus. The I2C panel uses two shared wires, SDA and SCL. The SPI panel uses three shared wires, MOSI, MISO, and SCK, plus one chip-select wire per device. Badges count the GPIO pins used, speed bars compare 400 kHz with 10 MHz, and a summary table updates as devices are added.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8, y2 = drawHeight + 40;
  const narrow = canvasWidth < 600;
  const xs = narrow ? [10, 104, 180, 240] : [10, 118, 262, 360];
  for (let k = 0; k < devBoxes.length; k++) devBoxes[k].position(xs[k], y1);
  // shorter checkbox text on narrow screens (p5 keeps the text in a <span>)
  const labels = narrow ? [' VL53L0X', ' OLED', ' SD', ' Color'] : [' VL53L0X', ' SSD1306 OLED', ' SD card', ' Fast color display'];
  for (let k = 0; k < devBoxes.length; k++) {
    const span = devBoxes[k].elt.querySelector('span');
    if (span) span.textContent = labels[k];
  }
  taskSelect.position(52, y2);
  taskSelect.size(narrow ? 180 : AUTO);
  sendButton.position(narrow ? 240 : 330, y2);
  resetButton.position(narrow ? 330 : 420, y2);
}

function resetSim() {
  const defaults = [true, true, false, false];
  for (let k = 0; k < devBoxes.length; k++) devBoxes[k].checked(defaults[k]);
  taskSelect.selected('Read distance 10 times per second');
  sendStart = -99999;
}

// Devices that are checked and that the bus supports
function busDevices(bus) {
  return DEVICES.filter((d, k) => devBoxes[k].checked() && d[bus]);
}
function counts() {
  const i2cN = busDevices('i2c').length;
  const spiN = busDevices('spi').length;
  return {
    i2cN, spiN,
    i2cWires: i2cN ? 2 : 0,
    spiWires: spiN ? 3 + spiN : 0
  };
}

function draw() {
  updateCanvasSize();
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textSize(20);
  textAlign(CENTER, TOP);
  text('I2C vs SPI Wiring Comparison', canvasWidth / 2, 6);

  const c = counts();
  const pw = (canvasWidth - 3 * margin) / 2;
  drawPanel(margin, 34, pw, 222, 'i2c', c);
  drawPanel(2 * margin + pw, 34, pw, 222, 'spi', c);
  drawTable(margin, 262, canvasWidth - 2 * margin, 104, c);
  drawVerdict(margin, 372, canvasWidth - 2 * margin, drawHeight - 380);

  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Task:', 12, drawHeight + 52);

  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
}

// ---------- One bus panel ----------
function drawPanel(x, y, w, h, bus, c) {
  const isI2C = bus === 'i2c';
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(isI2C ? 'I2C bus' : 'SPI bus', x + 10, y + 7);
  textStyle(NORMAL);
  // GPIO badge
  const pins = isI2C ? c.i2cWires : c.spiWires;
  const narrowPanel = w < 300;
  const badge = (narrowPanel ? 'GPIO: ' : 'GPIO used: ') + pins;
  textSize(13);
  const bw = textWidth(badge) + 16;
  fill(isI2C ? 'seagreen' : 'darkorange');
  rect(x + w - bw - 10, y + 6, bw, 22, 11);
  fill('white');
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(badge, x + w - bw / 2 - 10, y + 17);
  textStyle(NORMAL);

  // microcontroller box
  const mx = x + 10, my = y + 34, mw = narrowPanel ? 40 : 60, mh = 138;
  noStroke();
  fill('midnightblue');
  rect(mx, my, mw, mh, 6);
  fill('white');
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(narrowPanel ? 9 : 12);
  text('RP2040', mx + mw / 2, my + mh / 2);
  textStyle(NORMAL);

  // device column on the right
  const dw = narrowPanel ? max(70, w - 110) : min(128, w - 150), dx = x + w - dw - 10;
  const rows = [];
  let k = 0;
  for (let i = 0; i < DEVICES.length; i++) {
    if (!devBoxes[i].checked()) continue;
    rows.push({ d: DEVICES[i], y: my + k * 36 });
    k++;
  }

  // shared wires leave the RP2040 at the first device's tap height, then a
  // vertical bus line carries each one down to the other devices
  const wires = isI2C ?
    [{ name: 'SDA', col: 'royalblue', off: 9 }, { name: 'SCL', col: 'green', off: 20 }] :
    [{ name: 'MOSI', col: 'darkorange', off: 6 }, { name: 'MISO', col: 'purple', off: 13 }, { name: 'SCK', col: 'green', off: 20 }];
  const active = rows.filter(r => r.d[bus]);
  const busStart = mx + mw + 18, busGap = min(14, (dx - busStart - 20) / (wires.length + 1));
  if (active.length) {
    for (let wi = 0; wi < wires.length; wi++) {
      const wv = wires[wi];
      const bx = busStart + wi * busGap;
      const yTop = active[0].y + wv.off;
      const yBot = active[active.length - 1].y + wv.off;
      stroke(wv.col);
      strokeWeight(2.5);
      line(mx + mw, yTop, dx, yTop);                            // RP2040 pin to first device
      line(bx, yTop, bx, yBot);                                 // shared bus line
      for (const r of active) line(bx, r.y + wv.off, dx, r.y + wv.off);   // tap to each device
      noStroke();
      fill(wv.col);
      if (active.length > 1) for (const r of active) circle(bx, r.y + wv.off, 5);
    }
    // one chip-select wire per SPI device, straight from its own RP2040 pin
    if (!isI2C) {
      stroke('red');
      strokeWeight(2.5);
      for (const r of active) line(mx + mw, r.y + 27, dx, r.y + 27);
    }
    strokeWeight(1);
  }

  // color key for the wires
  const lx0 = x + 10, ly = y + h - 44;
  let lx = lx0;
  const key = isI2C ? wires : wires.concat([{ name: narrowPanel ? 'CS' : 'CS (one per device)', col: 'red' }]);
  textSize(narrowPanel ? 9 : 11);
  textAlign(LEFT, CENTER);
  for (const kv of key) {
    stroke(kv.col);
    strokeWeight(3);
    line(lx, ly, lx + 14, ly);
    strokeWeight(1);
    noStroke();
    fill('black');
    text(kv.name, lx + 18, ly);
    lx += textWidth(kv.name) + (narrowPanel ? 22 : 30);
  }

  // moving data dots during Send data (SPI about 5 times faster on screen)
  const t = millis() - sendStart;
  if (t < SEND_MS && active.length) {
    const speed = isI2C ? 0.18 : 0.9;
    stroke('white');
    strokeWeight(2);
    fill(isI2C ? 'royalblue' : 'darkorange');
    for (const r of active) {
      for (let q = 0; q < 3; q++) {
        const f = (t / 1000 * speed + q / 3) % 1;
        circle(lerp(mx + mw, dx, f), r.y + (isI2C ? 9 : 6), 11);
      }
    }
    strokeWeight(1);
    noStroke();
  }

  // device boxes
  for (const r of rows) {
    const ok = r.d[bus];
    if (ok) {
      stroke(r.d.col);
      strokeWeight(1.5);
      fill('white');
    } else {
      stroke('silver');
      strokeWeight(1.5);
      drawingContext.setLineDash([4, 3]);
      fill('whitesmoke');
    }
    rect(dx, r.y, dw, 30, 4);
    drawingContext.setLineDash([]);
    strokeWeight(1);
    noStroke();
    if (ok) {
      fill(r.d.col);
      rect(dx, r.y, 6, 30, 4, 0, 0, 4);
    }
    fill(ok ? 'black' : 'gray');
    textSize(narrowPanel ? 10 : 11);
    textStyle(ok ? BOLD : NORMAL);
    textAlign(LEFT, TOP);
    text(narrowPanel ? r.d.name.split(' ')[0] : r.d.name, dx + 10, r.y + 2, dw - 12);
    textStyle(NORMAL);
    fill(ok ? 'dimgray' : 'gray');
    textSize(10);
    const sub = ok ? (isI2C ? 'address ' + r.d.addr : 'own CS pin') : (narrowPanel ? 'not on ' : 'not available on ') + (isI2C ? 'I2C' : 'SPI');
    text(sub, dx + 10, r.y + 16);
  }
  if (!rows.length) {
    fill('gray');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('Check a device below to add it.', dx + dw / 2 - 30, my + mh / 2);
  }

  // speed bar: 400 kHz vs 10 MHz (25 times longer)
  const sy = y + h - 26;
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, CENTER);
  text(isI2C ? (narrowPanel ? '400 kHz' : 'Speed: 100-400 kHz') : (narrowPanel ? '10 MHz' : 'Speed: 1-10+ MHz'), x + 10, sy + 7);
  const barX = x + (narrowPanel ? 64 : 130), barW = x + w - 10 - barX;
  fill('whitesmoke');
  rect(barX, sy, barW, 14, 3);
  fill(isI2C ? 'royalblue' : 'darkorange');
  rect(barX, sy, isI2C ? max(3, barW * I2C_HZ / SPI_HZ) : barW, 14, 3);
}

// ---------- Summary table ----------
function drawTable(x, y, w, h, c) {
  const c1 = x + w * 0.34, c2 = x + w * 0.67;
  const rowH = (h - 20) / 4;
  const rows = [
    ['Wires', c.i2cWires, c.spiWires, c.i2cWires < c.spiWires ? 1 : (c.spiWires < c.i2cWires ? 2 : 0)],
    ['GPIO pins used', c.i2cWires, c.spiWires, c.i2cWires < c.spiWires ? 1 : (c.spiWires < c.i2cWires ? 2 : 0)],
    ['Speed', '100-400 kHz', '1-10+ MHz', 2],
    [w < 560 ? 'Choose device' : 'How a device is chosen', w < 560 ? 'address' : 'address (no extra wire)', w < 560 ? 'CS wire each' : 'CS wire per device', 1]
  ];
  stroke('silver');
  fill('white');
  rect(x, y, w, h, 6);
  noStroke();
  fill('gainsboro');
  rect(x + 1, y + 1, w - 2, 19, 6, 6, 0, 0);
  fill('black');
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text('Summary', x + 8, y + 10);
  text('I2C', c1 + 8, y + 10);
  text('SPI', c2 + 8, y + 10);
  textStyle(NORMAL);
  for (let r = 0; r < rows.length; r++) {
    const ry = y + 20 + r * rowH;
    const row = rows[r];
    // green cell for the winner of this row
    if (row[3] === 1) { fill('palegreen'); rect(c1, ry + 1, c2 - c1, rowH - 2); }
    if (row[3] === 2) { fill('palegreen'); rect(c2, ry + 1, x + w - c2 - 1, rowH - 2); }
    stroke('gainsboro');
    line(x, ry, x + w, ry);
    noStroke();
    fill('black');
    textSize(13);
    textAlign(LEFT, CENTER);
    text(row[0], x + 8, ry + rowH / 2);
    text(String(row[1]), c1 + 8, ry + rowH / 2);
    text(String(row[2]), c2 + 8, ry + rowH / 2);
  }
}

function drawVerdict(x, y, w, h) {
  const task = taskSelect.value();
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  const i2cMs = 8192 * 9 / 8 / I2C_HZ * 1000;
  const spiMs = 8192 / SPI_HZ * 1000;
  const kb = w < 560 ? '1 KB: I2C ≈ ' + nf(i2cMs, 1, 0) + ' ms, SPI ≈ ' + nf(spiMs, 1, 1) + ' ms' :
    'Time to move 1 KB:  I2C at 400 kHz ≈ ' + nf(i2cMs, 1, 0) + ' ms (8192 bits x 9/8 for ACKs)     SPI at 10 MHz ≈ ' + nf(spiMs, 1, 1) + ' ms';
  text(kb, x + 2, y, w - 4);
  fill('midnightblue');
  textSize(w < 560 ? 12 : 15);
  textStyle(BOLD);
  text(TASKS[task], x + 2, y + 20, w - 4);
  textStyle(NORMAL);
}

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
