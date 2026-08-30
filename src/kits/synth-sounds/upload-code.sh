#!/usr/bin/env bash
# Upload the whole Synth Sounds kit onto the Pico's flash filesystem:
# config.py, r2d2.py, sounds.py, main.py and every numbered lesson.
# Nothing else is needed - there are no .wav files to copy.
set -e

PORT=/dev/cu.usbmodem14401
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Uploading to $PORT ..."

for name in config.py r2d2.py sounds.py main.py; do
    echo "  $name"
    mpremote connect "$PORT" fs cp "$SCRIPT_DIR/$name" ":$name"
done

for f in "$SCRIPT_DIR"/[0-9][0-9]-*.py; do
    name="$(basename "$f")"
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
