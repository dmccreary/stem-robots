# Wi-Fi Bot

A Cytron Maker Pi RP2040 robot built on a Pico W board, controlled over its
own Wi-Fi web server instead of running a fixed program - two DC motors,
onboard NeoPixels, a piezo speaker, and a VL53L0X time-of-flight sensor.

## Wiring

All pin assignments live in [`config.py`](config.py): motors on GP8-GP11,
NeoPixels on GP18, speaker on GP22, and the VL53L0X on I2C bus 0
(GP16 SDA / GP17 SCL).

## Wi-Fi credentials

Network credentials live in [`secrets.py`](secrets.py), kept separate from
`config.py` so hardware pin assignments and network secrets don't mix. Edit
`SSID` and `PASSWORD` there before uploading.

## Files

| File | Purpose |
|------|---------|
| `config.py` | Shared hardware configuration - motor pins, NeoPixel pin/count, speaker pin, and I2C/ToF sensor pins. |
| `secrets.py` | Your Wi-Fi network name and password. |
| `01-wi-fi-test.py` | Simplest possible connect test - joins the network and prints the assigned IP address. |
| `02-print-mac-address.py` / `print-mac-address.py` | Print the board's MAC address and current Wi-Fi settings (channel, SSID, TX power). |
| `62-wi-fi-connect-test-v3.py` | Connect test with retry logic and onboard-LED status blinks - no web server or robot hardware involved. |
| `68-simple-web-server.py` | Minimal web server that serves a page with a single "toggle LED" button - the smallest working example of controlling hardware from a browser. |
| `10-web-server-test.py` | Full robot control web server - toggle the onboard LED, set NeoPixel colors, play speaker tones, and drive the motors from a browser page. |
| `70-web-server-test.py` | Same robot control web server as `10-web-server-test.py`, with hardened HTTP request parsing and error handling - the more robust of the two. |

## Uploading

To copy the whole kit onto the Pico W's flash filesystem in one step:

```bash
./upload-code.sh
```

This also uploads `secrets.py` as-is, so edit it with your own SSID and
password first. After that, any script can be run directly from Thonny
(open the file, press F5), or headlessly:

```bash
mpremote connect /dev/cu.usbmodem101 run 70-web-server-test.py
```

Edit the `PORT` variable at the top of `upload-code.sh` (and in the
`mpremote connect` command above) if your board enumerates on a different
serial port.
