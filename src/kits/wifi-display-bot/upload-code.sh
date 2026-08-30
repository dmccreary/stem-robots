#!/usr/bin/env bash
# Upload the whole Wifi Display Bot kit onto the Pico W's flash filesystem:
# the shared ssd1306 driver in lib/, config.py, secrets.py, and every script
# in this folder.
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

echo "  secrets.py"
mpremote connect "$PORT" fs cp "$SCRIPT_DIR/secrets.py" :secrets.py

for f in "$SCRIPT_DIR"/*.py; do
    name="$(basename "$f")"
    [ "$name" = "config.py" ] && continue
    [ "$name" = "secrets.py" ] && continue
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
echo
echo "Reminder: edit secrets.py with your own SSID/PASSWORD before uploading"
echo "if you haven't already - this script uploads it as-is."
