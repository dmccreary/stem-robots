#!/usr/bin/env bash
# Upload the whole Synth Sounds kit onto the Pico's flash filesystem:
# config.py, r2d2.py, sounds.py, main.py and every numbered lesson.
# Nothing else is needed - there are no .wav files to copy.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
