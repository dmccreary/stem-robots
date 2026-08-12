import machine
import struct
import time
import math
import json
import config

# MPU6050 wiring (I2C1):
#   SDA -> GPIO10 (I2C1 SDA)
#   SCL -> GPIO11 (I2C1 SCL)
#
# OLED wiring (SPI0) is defined in config.py.
#
# Load this file onto the Pico with Thonny and run it (F5), or run
# headlessly with mpremote (requires config.py and lib/ssd1306.py to
# already be copied onto the Pico's filesystem).
#
# Draws a compass-style dial from a gyro-integrated heading (bias
# calibrated with calibration.json, same as 08/09). Run this SAME script
# on two (or more) Pico+MPU6050 boards side by side, starting them all at
# the same moment and pointing them the same way. Every needle starts in
# agreement, then slowly drifts apart the longer they run - each board is
# independently integrating its own slightly-imperfect gyro with no way to
# check itself against the others. That's exactly the problem Chapter 13
# solves: instead of trusting each robot's own drifting estimate forever,
# one robot broadcasts a shared heading over WiFi/UDP and the rest steer
# to match it.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
GYRO_XOUT_H = 0x43

GYRO_SCALE = 131.0  # LSB per deg/s at the default +/-250 deg/s range
CALIBRATION_FILE = "calibration.json"

sda = machine.Pin(I2C_SDA_PIN)
scl = machine.Pin(I2C_SCL_PIN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# Wake the sensor - it powers on in sleep mode
i2c.writeto_mem(MPU6050_ADDRESS, PWR_MGMT_1, bytes([0x00]))
time.sleep_ms(100)

oled = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK
NO_FILL = config.NO_FILL
WIDTH = config.WIDTH
HEIGHT = config.HEIGHT

CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2 - 6
RADIUS = CENTER_Y - 4

try:
    with open(CALIBRATION_FILE) as f:
        cal = json.load(f)
    gz_offset = cal.get("gz_offset", 0.0)
    print("Loaded gz_offset = {:.2f} deg/s from {}".format(gz_offset, CALIBRATION_FILE))
except OSError:
    gz_offset = 0.0
    print("No {} found - run 08-calibrate-gyro.py first for a slower-drifting comparison.".format(CALIBRATION_FILE))


def read_gz():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, GYRO_XOUT_H, 6)
    _gx, _gy, gz = struct.unpack(">hhh", data)
    return gz / GYRO_SCALE


def draw_dial(heading, elapsed):
    oled.fill(BLACK)
    oled.ellipse(CENTER_X, CENTER_Y, RADIUS, RADIUS, WHITE, NO_FILL)
    heading_rad = math.radians(heading)
    needle_x = CENTER_X + int(RADIUS * math.sin(heading_rad))
    needle_y = CENTER_Y - int(RADIUS * math.cos(heading_rad))
    oled.line(CENTER_X, CENTER_Y, needle_x, needle_y, WHITE)
    label = "{:.0f} deg t={:.0f}s".format(heading, elapsed)
    text_x = max(CENTER_X - (len(label) * 8) // 2, 0)
    oled.text(label, text_x, HEIGHT - 10, WHITE)
    oled.show()


heading = 0.0
start_ms = time.ticks_ms()
last_ms = start_ms

print("Gyro-integrated heading dial. Start this at the same moment on every board. Ctrl-C to stop.")

try:
    while True:
        now_ms = time.ticks_ms()
        dt = time.ticks_diff(now_ms, last_ms) / 1000.0
        last_ms = now_ms

        gz = read_gz()
        heading = (heading + (gz - gz_offset) * dt) % 360.0
        elapsed = time.ticks_diff(now_ms, start_ms) / 1000.0

        draw_dial(heading, elapsed)
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
