# Smartwatch Compass Kit (HMC5883L + GC9A01)

A HMC5883L 3-axis digital magnetometer paired with a round 240x240 GC9A01
SPI display — the same "smartwatch" display used in the `robot-faces`
project's smartwatch kit — wired to a bare Raspberry Pi Pico on a
breadboard, so the round screen doubles as a compass dial.

This kit is a display-equipped sibling of
[`compass-hmc5883l`](../compass-hmc5883l/README.md): same sensor, same
heading math, but the compass moves off I2C1 (GPIO10/11) onto I2C0
(GPIO12/13) to make room for the display's SPI pins on GPIO2-6.

## Wiring

### HMC5883L (I2C0)

| HMC5883L pin | Pico pin | Notes                     |
|--------------|----------|----------------------------|
| VCC          | 3.3V OUT | Wire directly to this pin |
| GND          | GND      | Wire directly to this pin |
| SDA          | GPIO12   | I2C0 SDA                  |
| SCL          | GPIO13   | I2C0 SCL                  |

No external pull-up resistors are required if your breakout has its own
(common on GY-271/273-style HMC5883L boards) — but every script in this kit
enables the RP2040's internal weak pull-ups anyway. That is harmless if your
board already has its own pull-ups, and required if it does not.

Reads also need `machine.SoftI2C` rather than hardware `machine.I2C` — a scan
finds the chip fine either way, but real `readfrom_mem()` calls throw
`OSError 5` (EIO) on hardware I2C on this board. Every lab from 04 onward
already uses `SoftI2C`; this is just here so it isn't a surprise if you're
reading the code.

### GC9A01 round display (SPI0)

| GC9A01 pin | Pico pin | Notes                                     |
|------------|----------|---------------------------------------------|
| SCL / CLK  | GPIO2    | SPI0 SCK                                     |
| SDA / MOSI | GPIO3    | SPI0 MOSI (data)                             |
| DC         | GPIO4    |                                               |
| CS         | GPIO5    |                                               |
| RST        | GPIO6    |                                               |
| VCC        | 3V3      |                                               |
| GND        | GND      |                                               |
| BL         | 3V3      | most bare modules tie the backlight on permanently |

These are the same pins as the `robot-faces` project's smartwatch kit and
this repo's [`max98357a-amp`](../max98357a-amp/config.py) kit, so wiring
habits carry over if you have built either of those already.

## Files

| File | Purpose |
|------|---------|
| `01-probe-pico.py` | Board/system info — MicroPython version, RAM free/used, flash free/used. No wiring required. |
| `02-blink-onboard-led.py` | Blinks the onboard LED (GPIO25). Confirms code runs on the board at all, before any breadboard wiring. |
| `03-i2c-scanner.py` | Scans I2C0 (GPIO12/13) for the HMC5883L at address `0x1E`. |
| `04-get-compass-values.py` | One-shot read: prints X, Y, Z once and exits. |
| `05-display-hello.py` | Draws "Hello World!" on the GC9A01. No compass needed. |
| `06-display-compass-values.py` | One-shot read, displayed as three integers on the screen. |
| `07-continious-display.py` | Continuous read + redraw loop — watch the numbers change live. |
| `08-drawing-lines.py` | Times a rectangular grid (`hline`/`vline`) against a circular spoke pattern (`line()`) and displays the microsecond draw time for each. |
| `09-draw-bars.py` | Three live bar graphs, one per axis, growing up/down from a center baseline. |
| `10-draw-compass.py` | The capstone: a live compass dial (ring + needle + heading) with a short startup calibration pass. |
| `config.py` | Shared pin assignments and `init_display()` for both the compass and the display. |
| `lib/gc9a01.py`, `lib/vga1_8x16.py` | GC9A01 driver and its font — this driver has no built-in font. |
| `lib/shapes.py` | Ellipse/ring helpers the driver does not provide natively; used by lab 10 to draw the compass ring. |

## Buy a Few Spare HMC5883L Modules

During bring-up, one HMC5883L breakout worked correctly through several
labs and then went completely silent mid-session — not intermittent,
just gone, and it did not come back even after a full power cycle.
Swapping in a second module on the exact same wiring fixed it instantly,
which isolates the failure to that specific part, not the wiring or the
code in this kit.

These are ~$2 breakout boards, and a dead-on-arrival or short-lived unit
is a well-known, fairly common occurrence at that price point — cheap
unbranded HMC5883L/GY-271 modules have thin quality control and minimal
ESD protection on their I2C pins. If you're outfitting a classroom, buy a
few extras per kit so one dead sensor doesn't stall a lesson, and
bench-test each module with [`03-i2c-scanner.py`](03-i2c-scanner.py)
before handing it out.

## Calibration

The HMC5883L is subject to hard-iron bias from nearby components, so a raw
`atan2(y, x)` heading is rarely usable without correction — see
[`compass-hmc5883l`'s calibration notes](../compass-hmc5883l/README.md#calibration)
for background. `10-draw-compass.py` runs a 15-second calibration pass on
every boot (rotate the board flat through a full circle when it says
"Calibrating") rather than persisting the result to flash, to keep this lab
self-contained.

## Running

Any script can be run directly from Thonny (open the file, press F5), or
headlessly from this repo:

```bash
mpremote connect /dev/cu.usbmodem14401 run 10-draw-compass.py
```

To copy the whole kit onto the Pico's flash filesystem so it can run without
Thonny attached:

```bash
./upload-code.sh
```
