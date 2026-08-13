# Line Follower Bot

A Cytron Maker Pi RP2040 robot fitted with two downward-facing digital IR
line sensors, for following a dark line on a light floor (or vice versa),
plus a piezo speaker for audio feedback.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP8-GP11
(right forward on GP11, right reverse on GP10, left forward on GP8, left
reverse on GP9 - a different pin layout than the other kits' chassis), the
speaker on GP22, and the two IR line sensors on GP2 (right) and GP4 (left).
Each sensor reads `0` when it's over a dark/black line and `1` over a light
surface.

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, speaker pin, and line sensor pins. Every other script in this folder imports it. |
| `read-sensors-print.py` | Prints raw left/right sensor readings to the console - the first check when wiring up the sensors. |
| `read-sensors-sound.py` | Same sensor readings, but plays a different speaker tone depending on which sensor sees the line. |
| `play-tone.py` | Plays a single one-second tone on the speaker - a minimal speaker wiring check. |
| `motor-drive-test.py` | Spins each of the four motor directions in turn at full power so you can confirm wiring and direction. |
| `drive-test.py` | Same motor direction test as `motor-drive-test.py`, at a reduced (slower) power level. |
| `follow-line.py` | Basic line-following loop: steers toward whichever sensor is still over the line. |
| `main.py` | Full line-following demo with speaker tones on each turn. MicroPython automatically runs `main.py` on boot. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run follow-line.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
