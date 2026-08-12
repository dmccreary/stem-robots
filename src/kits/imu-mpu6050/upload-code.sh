#!/usr/bin/env bash
# Upload the whole MPU6050 kit onto the Pico's flash filesystem: the
# shared ssd1306 driver in lib/, config.py, every numbered script, and a
# local calibration.json if one exists.
set -e

PORT=/dev/cu.usbmodem101
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
