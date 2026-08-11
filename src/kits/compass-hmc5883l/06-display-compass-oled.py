import machine
import struct
import time
import math
import json
import config

# HMC5883L wiring (I2C1):
#   VCC  -> Pico 3.3V OUT (pin 36)
#   GND  -> Pico GND (pin 13)
#   SDA  -> GPIO10 (I2C1 SDA)
#   SCL  -> GPIO11 (I2C1 SCL)
#
# OLED and button wiring (SPI0 / GPIO14, GPIO15) is defined in config.py.
#
# Load this file onto the Pico with Thonny and run it (F5). On first
# run (no calibration.json yet) it calibrates automatically. After
# that it loads the saved calibration on boot and skips straight to
# the compass display - hold Button A to recalibrate on demand.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
HMC5883L_ADDRESS = 0x1E

CONFIG_A = 0x00
CONFIG_B = 0x01
MODE = 0x02
DATA_START = 0x03

CALIBRATION_SECONDS = 15
SAMPLE_DELAY_MS = 100
CALIBRATION_FILE = "calibration.json"

sda = machine.Pin(I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl = machine.Pin(I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# 8-sample average, 15 Hz output rate, normal measurement
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_A, bytes([0x70]))
# Gain = 5 (default), +/-1.3 Ga range, 1090 LSB/Gauss
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_B, bytes([0x20]))
# Continuous-measurement mode
i2c.writeto_mem(HMC5883L_ADDRESS, MODE, bytes([0x00]))
time.sleep_ms(100)

oled = config.init_display()
button_a, button_b = config.init_buttons()
WHITE = config.WHITE
BLACK = config.BLACK
NO_FILL = config.NO_FILL
FILL = config.FILL
WIDTH = config.WIDTH
HEIGHT = config.HEIGHT

CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2 - 6
RADIUS = CENTER_Y - 4

CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

# Data registers are ordered X, Z, Y (not X, Y, Z)
def read_xyz():
    data = i2c.readfrom_mem(HMC5883L_ADDRESS, DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z

# Heading in whole degrees from magnetic north: 0 = north, increasing
# clockwise up to 359. Assumes the board is held flat - no tilt
# compensation.
def heading_degrees(x, y):
    heading_rad = math.atan2(y, x)
    if heading_rad < 0:
        heading_rad += 2 * math.pi
    return int(heading_rad * 180 / math.pi) % 360

def cardinal_direction(heading):
    index = int((heading + 22.5) // 45) % 8
    return CARDINALS[index]

def show_message(*lines):
    oled.fill(BLACK)
    for row, line in enumerate(lines):
        oled.text(line, 0, row * 10, WHITE)
    oled.show()

def draw_compass(heading):
    oled.fill(BLACK)
    oled.ellipse(CENTER_X, CENTER_Y, RADIUS, RADIUS, WHITE, NO_FILL)
    heading_rad = math.radians(heading)
    needle_x = CENTER_X + int(RADIUS * math.sin(heading_rad))
    needle_y = CENTER_Y - int(RADIUS * math.cos(heading_rad))
    oled.line(CENTER_X, CENTER_Y, needle_x, needle_y, WHITE)
    label = "{} {}".format(heading, cardinal_direction(heading))
    text_x = CENTER_X - (len(label) * 8) // 2
    oled.text(label, text_x, HEIGHT - 10, WHITE)
    oled.show()

def load_calibration():
    try:
        with open(CALIBRATION_FILE) as f:
            data = json.load(f)
        return data["x_offset"], data["y_offset"]
    except (OSError, KeyError, ValueError):
        return None

def save_calibration(x_offset, y_offset):
    with open(CALIBRATION_FILE, "w") as f:
        json.dump({"x_offset": x_offset, "y_offset": y_offset}, f)

def calibrate():
    show_message("Calibrating", "Rotate the board", "flat, full circle")
    print("Calibrating for {} seconds - slowly rotate the board flat through a full circle".format(CALIBRATION_SECONDS))
    x, y, z = read_xyz()
    min_x = max_x = x
    min_y = max_y = y
    samples = CALIBRATION_SECONDS * 1000 // SAMPLE_DELAY_MS
    for i in range(samples):
        x, y, z = read_xyz()
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)
        time.sleep_ms(SAMPLE_DELAY_MS)
    x_offset = (min_x + max_x) // 2
    y_offset = (min_y + max_y) // 2
    print("Calibration complete. x_offset={} y_offset={}".format(x_offset, y_offset))
    save_calibration(x_offset, y_offset)
    return x_offset, y_offset

saved = load_calibration()
if saved is None:
    x_offset, y_offset = calibrate()
else:
    x_offset, y_offset = saved
    print("Loaded saved calibration. x_offset={} y_offset={}".format(x_offset, y_offset))
    show_message("Calibration loaded", "x={} y={}".format(x_offset, y_offset), "Hold A to redo")
    time.sleep(2)

try:
    while True:
        if button_a.value() == 0:
            x_offset, y_offset = calibrate()
        x, y, z = read_xyz()
        heading = heading_degrees(x - x_offset, y - y_offset)
        draw_compass(heading)
        time.sleep_ms(SAMPLE_DELAY_MS)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
    show_message("Stopped")
