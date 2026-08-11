# HMC5883L Compass Kit

A standalone HMC5883L 3-axis digital magnetometer wired to a bare Raspberry Pi
Pico on a breadboard, with an SPI OLED display for a live compass-heading
readout.

## Wiring

### HMC5883L (I2C1)

| HMC5883L pin | Pico pin           | Notes                          |
|--------------|---------------------|---------------------------------|
| VCC          | 3.3V OUT (pin 36)   | Wire directly to this pin — a bad breadboard power rail was the cause of an earlier "no I2C devices found" failure |
| GND          | GND (pin 13)        | Wire directly to this pin      |
| SDA          | GPIO10              | I2C1 SDA                       |
| SCL          | GPIO11              | I2C1 SCL                       |
| DRDY         | GPIO12              | Data-ready, only read by `01-probe.py` |

### OLED display and buttons (SPI0)

Pin assignments live in [`config.py`](config.py): `SCL_PIN` (SPI clock),
`SDA_PIN` (MOSI), `RES_PIN`, `DC_PIN`, `CS_PIN` for a 128x64 SSD1306/SSD1309
display, plus `BUTTON_A_PIN`/`BUTTON_B_PIN` for two momentary push buttons
(other leg to GND, internal pull-up).

## Files

| File | Purpose |
|------|---------|
| `01-probe.py` | I2C scanner and board diagnostics — processor/RAM/flash info, DRDY level, raw SDA/SCL idle levels, and a scan for the HMC5883L at address `0x1E`. |
| `run-probe.sh` | Runs `01-probe.py` headlessly over `mpremote` against `/dev/cu.usbmodem14401`. |
| `02-test-compass.py` | Streams raw X/Y/Z readings to the console, one line per sample — feed it to the Thonny Plotter to watch all three axes live. |
| `03-test-heading.py` | Computes an uncalibrated 0-359° heading from `atan2(y, x)`. Prints one heading value per line. |
| `04-test-heading-calibrated.py` | Same heading calculation, but starts with a 15-second calibration pass — rotate the board flat through a full circle — that finds the hard-iron offset for X/Y before streaming corrected headings. |
| `config.py` / `lib/ssd1306.py` | Shared OLED + button hardware setup (SPI SSD1306 driver, `init_display()`, `init_buttons()`), same pattern used by the other kits in this repo. |
| `05-display-compass-oled.py` | Draws a live compass dial (ring, needle, heading + cardinal label) on the OLED. Recalibrates on every run. |
| `06-display-compass-oled.py` | Same OLED compass dial, but loads/saves calibration to `calibration.json` on the Pico so it skips the rotate step on boot. Hold Button A at any time to force a fresh recalibration. |

## Calibration

The HMC5883L on this breadboard reads a strong hard-iron bias from nearby
components — bench-tested offsets around -600 on one axis — so a raw
`atan2(y, x)` heading is unusable without correction. Calibration rotates the
sensor through a full flat circle, tracks the min/max of X and Y, and uses
the midpoint of each as the offset to subtract from every future reading.
None of these scripts tilt-compensate, so keep the board level while
rotating.

`06-display-compass-oled.py` persists the result to `calibration.json` on the
Pico so recalibration is only needed when the sensor's surroundings change —
delete that file, or hold Button A, to redo it.

## Running

Any script can be run directly from Thonny (open the file, press F5), or
headlessly from this repo:

```bash
mpremote connect /dev/cu.usbmodem14401 run 06-display-compass-oled.py
```
