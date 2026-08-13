# Ultrasonic Bot

A Cytron Maker Pi RP2040 robot using an HC-SR04 ultrasonic distance sensor
(instead of the VL53L0X time-of-flight sensor used by the other kits) for
collision avoidance, plus an SSD1306 SPI OLED display.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP18-GP21,
the HC-SR04 trigger/echo pins on GP16/GP17, and the 128x64 SSD1306 display
on SPI0 (GP2 clock / GP3 MOSI / GP5 reset / GP4 D-C / GP1 CS). `config.py`
also provides an `init_display()` helper that wires up the SPI bus and
returns a ready-to-use `ssd1306.SSD1306_SPI` object.

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, HC-SR04 trigger/echo pins, and SPI display pins plus `init_display()`. Every other script in this folder imports it. |
| `stop-motors.py` | Stops all four motors - a quick safety script to run if the robot is left driving. |
| `test-drive-all.py` | Drives forward, reverse, right, and left in turn while showing the current move on the OLED - confirms motor wiring/direction and display wiring together. |
| `display-logo-ping.py` | Shows a startup logo and live distance readings on the OLED, driven by the HC-SR04 sensor. |
| `main.py` | Full collision-avoidance demo: pings the HC-SR04 sensor, backs up and turns away from obstacles, with NeoPixel-free, sensor-driven driving logic. MicroPython automatically runs `main.py` on boot. |

## Uploading

To copy the whole kit onto the Pico's flash filesystem in one step:

```bash
./upload-code.sh
```

After that, any script can be run directly from Thonny (open the file, press
F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run test-drive-all.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
