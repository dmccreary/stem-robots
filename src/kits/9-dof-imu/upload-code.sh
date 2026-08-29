#!/usr/bin/env bash
# Upload the whole 9-DOF IMU kit onto the Pico's flash filesystem: the
# shared l3gd20/lsm303dlhc drivers from src/lib/, config.py, both numbered
# lessons, and the two standalone diagnostic tools.
set -e

PORT=/dev/cu.usbmodem14401
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
