# Base Bot

The core Cytron Maker Pi RP2040 robot: two DC motors, onboard NeoPixels, a
piezo speaker, and a VL53L0X time-of-flight distance sensor for collision
avoidance.

## Wiring

All pin assignments live in [`config.py`](config.py) - motors on GP8-GP11,
NeoPixels on GP18, speaker on GP22, and the VL53L0X on I2C bus 0
(GP16 SDA / GP17 SCL).

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, NeoPixel pin/count, speaker pin, and I2C/ToF sensor pins. Every other script in this folder imports it. |
| `03-color-wheel.py` | Cycles both NeoPixels smoothly through the color wheel. |
| `03-neopixel-blink-test.py` | Blinks the first NeoPixel red on and off. |
| `03-neopixel-color-test.py` | Lights the two NeoPixels in different colors at once. |
| `neopixel-test.py` | Simple red on/off blink test, same idea as `03-neopixel-blink-test.py`. |
| `04-motor-test.py` | Spins each of the four motor directions (right forward/reverse, left forward/reverse) in turn so you can confirm wiring and direction. |
| `09-i2c-scanner-test.py` | Scans the I2C bus and checks that the VL53L0X answers at its expected address. |
| `10-tof-print.py` | Streams raw and normalized time-of-flight distance readings to the console. |
| `15-test-sound.py` | Plays a short startup jingle on the piezo speaker. |
| `50-collision-avoidance-tof.py` | Full collision-avoidance demo: drives forward, backs up and turns away from obstacles detected by the ToF sensor, with NeoPixel color feedback and sound. |
| `main.py` | Same program as `50-collision-avoidance-tof.py` - MicroPython automatically runs `main.py` on boot, so this is the file that ends up driving the robot when it's powered on standalone. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run 04-motor-test.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
