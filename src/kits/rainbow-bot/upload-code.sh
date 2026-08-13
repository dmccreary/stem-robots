#!/usr/bin/env bash
# Upload the whole Rainbow Bot kit onto the Pico's flash filesystem:
# config.py and every script in this folder.
set -e

PORT=/dev/cu.usbmodem101
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Uploading to $PORT ..."

echo "  config.py"
mpremote connect "$PORT" fs cp "$SCRIPT_DIR/config.py" :config.py

for f in "$SCRIPT_DIR"/*.py; do
    name="$(basename "$f")"
    [ "$name" = "config.py" ] && continue
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
