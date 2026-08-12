# MPU6050 IMU Kit

A standalone InvenSense MPU6050 6-axis accelerometer/gyroscope wired to a bare
Raspberry Pi Pico on a breadboard, with an SPI OLED display for live readouts
and a set of demos connecting IMU behavior to swarm-robotics concepts from
[Chapter 13](../../../docs/chapters/13-swarm-robotics-advanced-patterns/index.md).

## Wiring

### MPU6050 (I2C1)

| MPU6050 pin | Pico pin          | Notes                                                            |
|-------------|--------------------|-------------------------------------------------------------------|
| VCC         | 3.3V OUT (pin 36)  | Wire directly to this pin                                        |
| GND         | GND (pin 13)       | Wire directly to this pin                                        |
| SDA         | GPIO10             | I2C1 SDA (see note below)                                         |
| SCL         | GPIO11             | I2C1 SCL (see note below)                                         |
| XDA         | GPIO12             | Aux I2C data (master pass-through) - usually unconnected on GY-521 boards |
| XCL         | GPIO13             | Aux I2C clock - usually unconnected on GY-521 boards              |
| AD0         | GPIO14             | Address select: low/floating = `0x68`, high = `0x69`              |
| INT         | GPIO15             | Interrupt output, only active once configured in the driver       |

**GPIO10/GPIO11 role note:** the RP2040's I2C1 hardware block fixes GPIO10 as
SDA and GPIO11 as SCL — `machine.I2C(1, ...)` raises `bad SCL pin` if you try
it the other way around. On the breadboard this kit was probed against, the
MPU6050's SCL wire was actually landing on GPIO10 and SDA on GPIO11 (the
opposite of what I2C1 wants). `01-probe.py` detects this automatically: if
the hardware I2C1 scan comes up empty, it falls back to a bit-banged
`machine.SoftI2C` scan with the roles swapped, and reports a clear diagnosis
if that's what's going on. Either swap the two wires on the breadboard so
SDA→GPIO10 / SCL→GPIO11 (recommended — enables full-speed hardware I2C), or
keep wiring it the other way and always talk to the sensor with
`machine.SoftI2C(scl=Pin(10), sda=Pin(11))` instead of `machine.I2C(1, ...)`.

No external pull-up resistors are used on SDA/SCL. Both the hardware I2C1
scan and the SoftI2C fallback run without enabling the RP2040's internal
pull-ups, so a successful scan confirms the breakout board supplies its own
(common on GY-521-style boards). If both scans come up empty, re-enable
`machine.Pin.PULL_UP` on the pins in the script.

## Files

| File | Purpose |
|------|---------|
| `01-probe.py` | I2C scanner and board diagnostics - processor/RAM/flash info, AD0/INT/XDA/XCL pin levels, raw SDA/SCL idle levels, a hardware I2C1 scan for the MPU6050 at `0x68`/`0x69` with a bit-banged SoftI2C fallback (swapped SDA/SCL) if that comes up empty, and a `WHO_AM_I` register read (expects `0x68`) to confirm the chip is really an MPU6050. |
| `02-test-stream.py` | Streams calibrated-free raw accel (g) and gyro (deg/s) readings to the console, one line per sample - no OLED required. Self-contained (pins inlined, not imported from `config.py`) so it runs standalone. |
| `03-test-oled-hello.py` | Draws "Hello World!" on the OLED - confirms the SPI display wiring independent of the MPU6050. |
| `04-display-accel-bars.py` | Three horizontal bars (X/Y/Z acceleration) that grow left/right from a center line as you tilt/move the sensor. |
| `05-display-gyro-bars.py` | Same layout as `04`, driven by angular velocity (deg/s) instead - bars swing out when you spin the sensor and relax back to center when it's still. |
| `06-display-tilt-level.py` | Bubble-level style dot in a circle, plus a roll/pitch readout in degrees, with a "LEVEL" readout when the board is flat. |
| `07-display-six-bars.py` | All six channels (AX/AY/AZ/GX/GY/GZ) at once, one compact bar each. |
| `08-calibrate-gyro.py` | Averages 5 seconds of gyro readings with the sensor held still and flat to measure each axis's resting bias, then saves the offsets to `calibration.json` on the Pico. Re-run any time the sensor was moved during a prior calibration, or if bias seems to have drifted (it does, with temperature/handling). |
| `09-demo-gyro-drift.py` | Integrates gyro-Z into a heading estimate two ways at once - RAW (uncorrected) and CAL (using `calibration.json`) - so you can watch RAW wander away from 0 while the sensor sits still. Motivates why swarm robots need calibration and periodic re-sync rather than trusting a gyro alone. |
| `10-demo-complementary-filter.py` | Shows GYRO-only, ACC-only, and a complementary-filtered roll estimate side by side - a hands-on preview of the sensor fusion technique used (with a magnetometer added) in Chapter 13. |
| `11-demo-shake-detector.py` | Flashes "SHAKE!" on the OLED when total accel magnitude spikes away from the resting ~1g - the kind of event a real swarm robot would broadcast for collective obstacle avoidance. |
| `12-demo-swarm-compare.py` | A compass-style dial driven by calibrated gyro integration. Meant to run identically on two or more boards side by side, started at the same moment - each needle slowly drifts apart, making the "every robot's own estimate disagrees" problem tangible before Chapter 13 solves it with WiFi heading sync. |
| `config.py` / `lib/ssd1306.py` | Shared hardware setup: OLED display constants and `init_display()` at the top, MPU6050 pins/addresses below. Only the display half is imported by other scripts - the I2C/sensor scripts are self-contained. |
| `calibration.json` | Written by `08-calibrate-gyro.py` on the Pico; read by `09` and `12`. Device-specific (each MPU6050's bias is a little different), so it normally only exists on-device - see `upload-code.sh` below. |
| `run-probe.sh` | Runs `01-probe.py` headlessly over `mpremote` against `/dev/cu.usbmodem101`. |
| `upload-code.sh` | Uploads everything - `lib/`, `config.py`, every numbered script, and a local `calibration.json` if one exists - onto the Pico's flash in one pass. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run 01-probe.py
```

or, for the probe specifically:

```bash
./run-probe.sh
```
