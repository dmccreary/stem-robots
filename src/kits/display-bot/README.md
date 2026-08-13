# Display Bot

A Cytron Maker Pi RP2040 robot with an SSD1306 SPI OLED display added on top
of the base hardware: two DC motors, onboard NeoPixels, a piezo speaker, and
a VL53L0X time-of-flight distance sensor.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP8-GP11,
NeoPixels on GP18, speaker on GP22, the VL53L0X on I2C bus 1
(GP26 SDA / GP27 SCL), and the 128x64 SSD1306 display on SPI0
(GP2 clock / GP3 MOSI / GP13 reset / GP14 D-C / GP15 CS). `config.py` also
provides an `init_display()` helper that wires up the SPI bus and returns a
ready-to-use `ssd1306.SSD1306_SPI` object.

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, NeoPixel pin/count, speaker pin, I2C/ToF sensor pins, and SPI display pins plus `init_display()`. Every other script in this folder imports it. |
| `05-display-test.py` | Draws "Hello World!" on the OLED - confirms the SPI display wiring. |
| `i2c-scanner.py` | Scans the I2C bus and prints any device addresses found (used to confirm the VL53L0X responds). |
| `tof-range-display-test.py` | Streams raw time-of-flight readings to both the console and the OLED, tracking the min/max seen. |
| `display-dist-chart.py` | Draws a scrolling line chart of the normalized ToF distance on the OLED. |
| `display-face.py` | Animates a simple robot face with eyes that look left/right/forward on the OLED, independent of the sensor. |
| `main.py` | Full demo: collision avoidance driven by the ToF sensor, with NeoPixel color feedback, startup/turn sounds, and a face/status display on the OLED. MicroPython automatically runs `main.py` on boot. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run 05-display-test.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
