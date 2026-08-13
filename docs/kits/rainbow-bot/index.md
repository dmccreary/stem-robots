# Rainbow Bot

The Rainbow bot takes our base robot and adds a colorful 8x8 NeoPixel
matrix to the top of the robot.  The colors and pattern will
change as the robot moves direction.

Sample code is located in on the github site:

[https://github.com/dmccreary/stem-robots/tree/main/src/kits/rainbow-bot](https://github.com/dmccreary/stem-robots/tree/main/src/kits/rainbow-bot)

## Uploading the Code

To copy the whole kit — `config.py` and every script — onto the Pico in one
step, run
[`upload-code.sh`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/rainbow-bot/upload-code.sh)
from a terminal:

```bash
./upload-code.sh
```

Any single script can also be run directly from Thonny, or headlessly with:

```bash
mpremote connect /dev/cu.usbmodem101 run collision-avoidance-config.py
```

(Your port name may differ — check what shows up when you plug in the Pico.)