# Wifi Display Bot

A Cytron Maker Pi RP2040 robot built on a Pico W board that combines the
Wi-Fi Bot's web-controlled driving with an SSD1306 SPI OLED display for
on-robot status - two DC motors, onboard NeoPixels, a piezo speaker, and the
display, all reachable over the robot's own Wi-Fi web server.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP8-GP11,
NeoPixels on GP18, speaker on GP22, and the 128x64 SSD1306 display on SPI0
(GP2 clock / GP3 MOSI / GP4 reset / GP5 D-C / GP6 CS). `config.py` also
provides an `init_display()` helper that wires up the SPI bus and returns a
ready-to-use `ssd1306.SSD1306_SPI` object.

## Wi-Fi credentials

Network credentials live in [`secrets.py`](secrets.py), kept separate from
`config.py` so hardware pin assignments and network secrets don't mix. Edit
`SSID` and `PASSWORD` there before uploading.

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, NeoPixel pin/count, speaker pin, and SPI display pins plus `init_display()`. |
| `secrets.py` | Your Wi-Fi network name and password. |
| `lib/ssd1306.py` | SSD1306 OLED display driver. |
| `02-print-mac-address.py` | Print the board's MAC address and current Wi-Fi settings. |
| `15-do-connect-test.py` | Connect test using low-power mode, where the network stack is rebuilt for each connection attempt. |
| `18-display-hello-world.py` | Draws "Hello World!" on the OLED with pins hardcoded inline - confirms the SPI display wiring independent of `config.py`. |
| `19-display-hello-world-config.py` | Same "Hello World!" display test, but reading its pins from `config.py`. |
| `20-display-wifi.py` | Connects to Wi-Fi and shows live connection status (network name, connect time, MAC/IP address) on the OLED. |
| `30-wifi-ping-test.py` | Connects to Wi-Fi with retry logic and keeps the connection alive, printing status to the console - no display. |
| `32-wifi-ping-display.py` | Same Wi-Fi keep-alive test as `30-wifi-ping-test.py`, with live status shown on the OLED as well. |
| `main.py` | Full robot control web server with an OLED status screen - toggle the onboard LED, set NeoPixel colors, play speaker tones, and drive the motors from a browser page, while the OLED shows the server's IP address. MicroPython automatically runs `main.py` on boot. |

## Uploading

To copy the whole kit onto the Pico W's flash filesystem in one step:

```bash
./upload-code.sh
```

This also uploads `secrets.py` as-is, so edit it with your own SSID and
password first. After that, any script can be run directly from Thonny
(open the file, press F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run 20-display-wifi.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
