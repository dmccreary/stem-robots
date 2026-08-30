#!/usr/bin/env bash
# Upload the whole 9-DOF IMU kit onto the Pico's flash filesystem: the
# shared l3gd20/lsm303dlhc drivers from src/lib/, config.py, both numbered
# lessons, and the two standalone diagnostic tools.
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
LIB_DIR="$SCRIPT_DIR/../../lib"

echo "Uploading to $PORT ..."

mpremote connect "$PORT" fs mkdir :lib >/dev/null 2>&1 || true

for name in l3gd20.py lsm303dlhc.py; do
    echo "  lib/$name"
    mpremote connect "$PORT" fs cp "$LIB_DIR/$name" ":lib/$name"
done

echo "  config.py"
mpremote connect "$PORT" fs cp "$SCRIPT_DIR/config.py" :config.py

for f in "$SCRIPT_DIR"/[0-9][0-9]-*.py; do
    name="$(basename "$f")"
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

for name in i2c-scanner-test.py board-info-test.py; do
    echo "  $name"
    mpremote connect "$PORT" fs cp "$SCRIPT_DIR/$name" ":$name"
done

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
