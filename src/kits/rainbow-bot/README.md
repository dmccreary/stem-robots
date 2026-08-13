# Rainbow Bot

A Cytron Maker Pi RP2040 robot fitted with a 64-pixel NeoPixel ring in place
of the base kit's two onboard NeoPixels, plus a piezo speaker and a VL53L0X
time-of-flight distance sensor for collision avoidance with a color-wheel
light show.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP8-GP11,
the 64-pixel NeoPixel ring on GP6, speaker on GP22, and the VL53L0X on I2C
bus 0 (GP16 SDA / GP17 SCL).

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, NeoPixel ring pin/count, speaker pin, and I2C/ToF sensor pins. Every other script in this folder imports it. |
| `05-motor-direction-lab-config.py` | Cycles the motors forward and reverse so you can confirm wiring and direction. |
| `10-blink-config.py` | Blinks the first pixel on the ring red on and off - a minimal NeoPixel wiring check. |
| `20-tof-test-config.py` | Scans the I2C bus and streams raw time-of-flight distance readings to the console. |
| `collision-avoidance-config.py` | Full collision-avoidance demo: drives forward, backs up and turns away from obstacles, with a color-wheel animation on the NeoPixel ring and startup/turn sounds. There is no separate `main.py` in this kit - run this file directly (or copy it to `main.py` on the device) to have it run on boot. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run collision-avoidance-config.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
