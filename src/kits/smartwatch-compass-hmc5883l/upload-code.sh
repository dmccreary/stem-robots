#!/usr/bin/env bash
# Upload the smartwatch-compass-hmc5883l kit onto the Pico's flash
# filesystem: config.py, the GC9A01 driver + font + shapes helper in
# lib/, every numbered lab script, and main.py (a copy of lab 10 - the
# Pico runs main.py automatically on boot, with no computer attached).
#
# The fonts are not optional. Unlike framebuf, this driver has no
# built-in font, so config.py fails to import if lib/vga1_8x16.py is
# not on the board.
#
# IMPORTANT: Quit (or "Stop/Disconnect" from) Thonny before running this.
# Only one program can use the Pico's serial port at a time.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v mpremote >/dev/null 2>&1; then
    echo "Error: mpremote is not installed. Install with: pip install mpremote" >&2
    exit 1
fi

# macOS renames the Pico's serial port every time you plug it into a
# different USB jack (/dev/cu.usbmodem101, ...14101, ...14401 and so on),
# so find it instead of hard-coding it.  Override with:  PORT=/dev/... ./upload-code.sh
if [[ -n "${PORT:-}" ]]; then
    echo "Using device from PORT environment variable: $PORT"
else
    shopt -s nullglob
    serial_devs=( /dev/cu.usbmodem* /dev/tty.usbmodem* /dev/ttyACM* /dev/ttyUSB* )
    shopt -u nullglob
    if (( ${#serial_devs[@]} == 0 )); then
        echo "Error: No Pico detected (no usbmodem/ttyACM/ttyUSB device). Plug it in and try again." >&2
        exit 1
    fi
    PORT="${serial_devs[0]}"
    if (( ${#serial_devs[@]} > 1 )); then
        echo "Multiple serial devices found; using the first:"
        printf '  %s\n' "${serial_devs[@]}"
        echo "Override with: PORT=/dev/your-device ./upload-code.sh"
    fi
    echo "Using device: $PORT"
fi

# Interrupt any running program before copying files.
mpremote connect "$PORT" soft-reset >/dev/null 2>&1 || true

shopt -s nullglob
lab_files=( [0-9][0-9]-*.py )
lib_files=( lib/*.py )
shopt -u nullglob

if (( ${#lab_files[@]} == 0 && ${#lib_files[@]} == 0 )); then
    echo "No .py files found in $SCRIPT_DIR" >&2
    exit 1
fi

# Upload lib/ first (display driver + font + shapes helper, imported by
# config.py and by lab 10), then config.py (every lab imports it), then
# the numbered labs.
if (( ${#lib_files[@]} > 0 )); then
    echo "Uploading ${#lib_files[@]} file(s) to Pico :lib/ ..."
    mpremote connect "$PORT" fs mkdir :lib >/dev/null 2>&1 || true
    for f in "${lib_files[@]}"; do
        name="$(basename "$f")"
        echo "  -> lib/$name"
        mpremote connect "$PORT" fs cp "$f" ":lib/$name"
    done
fi

echo "  -> config.py"
mpremote connect "$PORT" fs cp config.py :config.py

echo "Uploading ${#lab_files[@]} lab file(s) to Pico..."
for f in "${lab_files[@]}"; do
    echo "  -> $f"
    mpremote connect "$PORT" fs cp "$f" ":$f"
done

if [[ -f main.py ]]; then
    echo "  -> main.py"
    mpremote connect "$PORT" fs cp main.py :main.py
fi

echo
echo "Done. Files now on device:"
mpremote connect "$PORT" fs ls
mpremote connect "$PORT" fs ls :lib
