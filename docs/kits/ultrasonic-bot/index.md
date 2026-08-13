# Ultrasonic Bot



[Ultrasonic Robot on the MicroPython for Kids Site](https://dmccreary.github.io/micropython/kits/maker-pi-rp2040-robot/11-ping-lab/)

## Uploading the Code

The source code for this kit, plus a shared `config.py`, lives in
[`src/kits/ultrasonic-bot/`](https://github.com/dmccreary/stem-robots/tree/main/src/kits/ultrasonic-bot).
To copy the whole kit onto the Pico in one step, run
[`upload-code.sh`](https://github.com/dmccreary/stem-robots/blob/main/src/kits/ultrasonic-bot/upload-code.sh)
from a terminal:

```bash
./upload-code.sh
```

Any single script can also be run directly from Thonny, or headlessly with:

```bash
mpremote connect /dev/cu.usbmodem101 run test-drive-all.py
```

(Your port name may differ — check what shows up when you plug in the Pico.)