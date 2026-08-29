# 9-DOF IMU Kit

A "10 DOF" breakout board — L3GD20 gyroscope + LSM303DLHC accelerometer/
magnetometer + a bonus BMP180 temp/pressure chip, unused here — wired to a
bare Raspberry Pi Pico on a breadboard. No display, no chassis: this kit's
only job is to prove the sensor works before it becomes the compass for the
[swarm robot build plan](../../../docs/kits/swarm-bot/plan.md).

## Wiring

| Module pin | Pico pin | Notes |
|------------|----------|-------|
| VIN | 3.3V OUT | Power in — **not** `3Vo` (see below) |
| GND | GND | |
| SDA | GPIO0 | I2C data |
| SCL | GPIO1 | I2C clock |
| GINT | GPIO11 | Gyro interrupt — wired, not read by these lessons yet |
| GRDY | GPIO12 | Gyro data-ready — wired, not read by these lessons yet |
| LIN1 | GPIO13 | Accel/mag interrupt 1 — wired, not read by these lessons yet |
| LIN2 | GPIO14 | Accel/mag interrupt 2 — wired, not read by these lessons yet |
| LRDY | GPIO15 | Accel/mag data-ready — wired, not read by these lessons yet |
| 3Vo | *(not connected)* | A regulated 3.3V **output** from the board's own regulator, not a power input |

I2C addresses (in `config.py`, confirmed by `01-probe.py` on real hardware):
gyro `0x6B`, accelerometer `0x19`, magnetometer `0x1E`, BMP180 `0x77`.

## A Real Bug We Hit Bringing This Up

**A hardware I2C peripheral bug.** With the module wired up, a plain
scan found all four chips — but every real register read threw
`OSError: [Errno 5] EIO`, at every clock speed from 400kHz down to 100kHz,
with or without the Pico's internal pull-ups explicitly enabled. Swapping
`machine.I2C(0, ...)` (the hardware peripheral) for `machine.SoftI2C(...)`
(bit-banged, same pins, same pull-ups) fixed it instantly at every frequency
tested. **Do not add external pull-up resistors for this symptom** — the
proof it isn't a pull-up problem is that `SoftI2C` uses the identical
resistors and succeeded anyway. This project never uses external I2C
resistors; when a bus scans but won't read, try `SoftI2C` before anything
else.

## Files

| File | Purpose |
|------|---------|
| `01-probe.py` | Board diagnostics, an I2C scan, and an identity check for every chip (gyro WHO_AM_I, accel register readback, magnetometer ID bytes, BMP180 chip-id). Run this first. |
| `i2c-scanner-test.py` | A bare scan with no identity checks — faster to re-run while you're actively rewiring something. |
| `02-test-stream.py` | Streams live gyro (deg/s), accelerometer (g), and magnetometer (gauss) readings using the shared drivers below. |
| `03-plot-test-stream.py` | Same 9 axes, rescaled to 0-100 per channel (each with its own running min/max) so every signal stays visible on one graph — feed it to the Thonny Plotter. |
| `board-info-test.py` | General Pico diagnostics unrelated to the sensor — processor, MicroPython version, unique ID, RAM, flash, and a full file listing. Useful any time you want to sanity-check the board itself. |
| `config.py` | Every pin assignment, I2C address, and identity-register constant, in one place. |
| `../../lib/l3gd20.py`, `../../lib/lsm303dlhc.py` | Shared gyro and accel/mag drivers (register constants, init, and `read_dps()`/`read_accel_g()`/`read_mag_gauss()`). `upload-code.sh` copies these into `lib/` on the device. |

`01-probe.py`, `02-test-stream.py`, and `03-plot-test-stream.py` carry
numeric prefixes — they're the graduated sequence (confirm wiring, trust the
data, then visualize it). `i2c-scanner-test.py` and `board-info-test.py` are
standalone diagnostic tools you can reach for at any point, not lesson steps
in order, so they're deliberately left unnumbered. There's no combined
`main.py`: with no display/motors to combine, `03-plot-test-stream.py`
already *is* the combined program.

## Running

Any script can be run directly from Thonny (open the file, press F5), or
headlessly from this repo:

```bash
mpremote connect /dev/cu.usbmodem14401 run 01-probe.py
```

To copy the whole kit — `config.py`, both numbered lessons, the two
standalone test tools, and the shared drivers from `src/lib/` — onto the
Pico in one step:

```bash
./upload-code.sh
```

## For Instructors and Mentors

Budget about 20-30 minutes for a student to solder the header, wire the
module, and get a clean `TEST PASS` from `01-probe.py` — longer if their
particular board turns out to be dead, which is a real possibility with
inexpensive clone hardware, not a sign the student did anything wrong.

Troubleshooting checklist, in the order we'd actually check them:

| Symptom | Likely cause |
|---|---|
| Scan finds nothing at all | Check the header is actually soldered (this module ships with a loose header), then VIN/GND wiring. If wiring looks right and it's still empty, suspect a dead board and try swapping it. |
| Scan finds devices, but every read throws `EIO` | Not a pull-up problem — see "A Real Bug We Hit" above. Switch to `machine.SoftI2C` on the same pins. |
| One address missing, others found | Re-check that chip's specific solder joints; the other chips' identity checks passing rules out a wiring/power problem for the whole board. |
| Gyro reads a large, steady non-zero value at rest | Expected — a real zero-rate bias, not a bug. A future calibration lesson (like `08-calibrate-gyro.py` in the IMU/MPU6050 kit) is how you'd remove it. |
| Accelerometer magnitude noticeably below 1g at rest | The board isn't sitting level — this isn't a code problem. |
