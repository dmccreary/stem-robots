#!/usr/bin/env bash
# Upload the whole MPU6050 kit onto the Pico's flash filesystem: the
# shared ssd1306 driver in lib/, config.py, every numbered script, and a
# local calibration.json if one exists.
set -e

# macOS renames the Pico's serial port every time you plug it into a
# different USB jack (/dev/cu.usbmodem101, ...14101, ...14401 and so on),
# so find it instead of hard-coding it.  Override with:  PORT=/dev/... ./upload-code.sh
if [ -z "$PORT" ]; then
    PORT="$(ls /dev/cu.usbmodem* 2>/dev/null | head -n 1)"
fi

if [ -z "$PORT" ] || [ ! -e "$PORT" ]; then
    echo "No Pico found."
    echo "Plug the Pico into USB, then check that it shows up:"
    echo "    ls /dev/cu.usbmodem*"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Uploading to $PORT ..."

mpremote connect "$PORT" fs mkdir :lib >/dev/null 2>&1 || true

for f in "$SCRIPT_DIR"/lib/*.py; do
    name="$(basename "$f")"
    echo "  lib/$name"
    mpremote connect "$PORT" fs cp "$f" ":lib/$name"
done

echo "  config.py"
mpremote connect "$PORT" fs cp "$SCRIPT_DIR/config.py" :config.py

for f in "$SCRIPT_DIR"/[0-9][0-9]-*.py; do
    name="$(basename "$f")"
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

if [ -f "$SCRIPT_DIR/calibration.json" ]; then
    echo "  calibration.json"
    mpremote connect "$PORT" fs cp "$SCRIPT_DIR/calibration.json" :calibration.json
else
    echo "  (no local calibration.json - run 08-calibrate-gyro.py on the Pico to create one)"
fi

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
