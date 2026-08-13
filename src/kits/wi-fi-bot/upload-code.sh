#!/usr/bin/env bash
# Upload the whole Wi-Fi Bot kit onto the Pico W's flash filesystem:
# config.py, secrets.py, and every script in this folder.
set -e

PORT=/dev/cu.usbmodem101
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Uploading to $PORT ..."

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
