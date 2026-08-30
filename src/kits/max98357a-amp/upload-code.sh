#!/usr/bin/env bash
# Upload the max98357a-amp kit onto the Pico's flash filesystem: config.py,
# the GC9A01 display driver + font in lib/, every numbered script, and the
# R2D2 sound clips used by 03-play-sounds-on-button.py.
#
# The .wav files live in the separate robot-media repo, not in
# stem-robots - SOUND_SOURCE_DIR below points at a local checkout of it.
set -e

PORT=/dev/cu.usbmodem14201
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOUND_SOURCE_DIR="/Users/dan/Documents/ws/robot-media/wav-8k"

echo "Uploading to $PORT ..."

echo "  config.py"
mpremote connect "$PORT" fs cp "$SCRIPT_DIR/config.py" :config.py

mpremote connect "$PORT" fs mkdir :lib >/dev/null 2>&1 || true
for f in "$SCRIPT_DIR"/lib/*.py; do
    name="$(basename "$f")"
    echo "  lib/$name"
    mpremote connect "$PORT" fs cp "$f" ":lib/$name"
done

for f in "$SCRIPT_DIR"/[0-9][0-9]-*.py; do
    name="$(basename "$f")"
    echo "  $name"
    mpremote connect "$PORT" fs cp "$f" ":$name"
done

if [ -d "$SOUND_SOURCE_DIR" ]; then
    mpremote connect "$PORT" fs mkdir :sounds >/dev/null 2>&1 || true
    for f in "$SOUND_SOURCE_DIR"/*.wav; do
        name="$(basename "$f")"
        echo "  sounds/$name"
        mpremote connect "$PORT" fs cp "$f" ":sounds/$name"
    done
else
    echo "  (SOUND_SOURCE_DIR not found - skipping sound upload: $SOUND_SOURCE_DIR)"
fi

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
mpremote connect "$PORT" fs ls :sounds
