#!/usr/bin/env bash
# Run the MPU6050 I2C probe on the Pico and print its output.
PORT=/dev/cu.usbmodem101
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mpremote connect "$PORT" run "$SCRIPT_DIR/01-probe.py"
