# Line Follower Bot

* [Line Follower Robot on the Learning MicroPython Site](https://dmccreary.github.io/micropython/kits/maker-pi-rp2040-robot/25-line-follower/)

## Uploading the Code

The source code for this kit, plus a shared `config.py`, lives in
[`src/kits/line-follower-bot/`](https://github.com/dmccreary/stem-robots/tree/main/src/kits/line-follower-bot).
To copy the whole kit onto the Pico in one step, run
[`upload-code.sh`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/line-follower-bot/upload-code.sh)
from a terminal:

```bash
./upload-code.sh
```

Any single script can also be run directly from Thonny, or headlessly with:

```bash
mpremote connect /dev/cu.usbmodem101 run follow-line.py
```

(Your port name may differ — check what shows up when you plug in the Pico.)