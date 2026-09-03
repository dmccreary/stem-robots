import machine
import struct
import time
import math
import config
import shapes

# Lab 10: Draw a Compass
# The capstone: a live compass dial on the round screen - a ring at the
# rim, a needle pointing toward magnetic north, and the heading in
# degrees plus its nearest cardinal direction. Assumes the board is held
# flat, so only X and Y are used for the heading; Z (which points
# straight up through a flat board) does not enter the calculation.
#
# This does not tilt-compensate: tip the board off level and the
# heading drifts. Startup runs two calibration passes, back to back:
#
#   1. Rotate the board flat through a full circle ("Calibrating") -
#      finds the hard-iron offset, same idea as compass-hmc5883l.
#   2. Point the board due north and hold still ("Point the board...") -
#      finds the mounting offset: the HMC5883L die is rotated relative
#      to the "top" of this breadboard build, so pass 1 alone is not
#      enough to make 0 degrees mean "north". This is a fixed mechanical
#      offset, not a magnetic one, but it still has to be re-measured
#      every run, because it is measured FROM the hard-iron-corrected
#      reading - a slightly different pass-1 result shifts it too.
#
# Unlike compass-hmc5883l's calibrated lab, neither result is saved to
# flash - both are redone every run, to keep this lab self-contained.
#
# Like labs 07 and 09, the live dial never clears the whole screen. The
# ring is drawn once - it never moves. Each frame just erases the
# PREVIOUS needle (a black line redrawn over its old path) before
# drawing the new one, and the heading label is a fixed-width field so
# text() overwrites the old digits directly with no clear needed.

# The HMC5883L's hardware I2C reads on this Pico return OSError 5 (EIO)
# even though a scan (lab 03) finds the chip fine - a clock-stretching
# quirk with this chip on the RP2040's hardware I2C peripheral.
# machine.SoftI2C (bit-banged) reads it reliably instead.
i2c = machine.SoftI2C(scl=machine.Pin(config.I2C_SCL_PIN),
                       sda=machine.Pin(config.I2C_SDA_PIN), freq=400000)

i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_A, bytes([0x70]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_B, bytes([0x20]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x00]))  # continuous
time.sleep_ms(100)

display = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK

CENTER_X = config.CENTER_X
CENTER_Y = config.CENTER_Y
DIAL_RADIUS = config.SAFE_RADIUS
NEEDLE_LENGTH = DIAL_RADIUS - 20

CALIBRATION_SECONDS = 15
SAMPLE_DELAY_MS = 100

CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

# Fixed-width heading label - "359 NW" is the longest it ever gets - so
# it always lands on the exact same pixels and never needs a clear.
LABEL_X = CENTER_X - (6 * 8) // 2
LABEL_Y = CENTER_Y + DIAL_RADIUS - 30

prev_needle_x = None
prev_needle_y = None


def read_xyz():
    data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z


# Set fresh by the "point north" calibration pass at the bottom of this
# file, before the main loop ever calls heading_degrees(). 0 here is just
# a harmless placeholder.
MOUNTING_OFFSET_DEGREES = 0


# Heading in degrees from the sensor's own zero point - 0 does NOT mean
# north yet. heading_degrees() below subtracts MOUNTING_OFFSET_DEGREES
# to correct that; this raw version is also what the mounting-offset
# calibration pass itself uses to measure that correction in the first
# place.
def raw_heading_degrees(x, y):
    heading_rad = math.atan2(y, x)
    if heading_rad < 0:
        heading_rad += 2 * math.pi
    return int(heading_rad * 180 / math.pi) % 360


# Heading in whole degrees from true north: 0 = north, increasing
# clockwise up to 359.
def heading_degrees(x, y):
    return (raw_heading_degrees(x, y) - MOUNTING_OFFSET_DEGREES) % 360


def cardinal_direction(heading):
    index = int((heading + 22.5) // 45) % 8
    return CARDINALS[index]


def show_message(*lines):
    display.fill(BLACK)
    for row, line in enumerate(lines):
        display.text(config.FONT, line, 40, 90 + row * 20, WHITE, BLACK)


def draw_needle(heading):
    global prev_needle_x, prev_needle_y
    heading_rad = math.radians(heading)
    needle_x = CENTER_X + int(NEEDLE_LENGTH * math.sin(heading_rad))
    needle_y = CENTER_Y - int(NEEDLE_LENGTH * math.cos(heading_rad))
    if prev_needle_x is not None:
        display.line(CENTER_X, CENTER_Y, prev_needle_x, prev_needle_y, BLACK)
    display.line(CENTER_X, CENTER_Y, needle_x, needle_y, WHITE)
    prev_needle_x, prev_needle_y = needle_x, needle_y


def draw_heading_label(heading):
    text = "%3d %-2s" % (heading, cardinal_direction(heading))
    display.text(config.FONT, text, LABEL_X, LABEL_Y, WHITE, BLACK)


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

# Pass 2: point the board due north and hold still. Average several
# samples as a circular mean - via each sample's sin/cos, not the raw
# degree numbers - so readings that happen to straddle the 359/0
# wraparound (e.g. 358, 1, 359) average correctly to ~0 instead of a
# plain average dragging them toward 180.
MOUNTING_CAL_SECONDS = 3
show_message("Point the board", "due north,", "hold still")
print("Point the board due north and hold still - measuring mounting offset...")
time.sleep_ms(1500)  # time to get in position after reading the message
sin_sum = 0.0
cos_sum = 0.0
mount_samples = MOUNTING_CAL_SECONDS * 1000 // SAMPLE_DELAY_MS
for i in range(mount_samples):
    x, y, z = read_xyz()
    raw = raw_heading_degrees(x - x_offset, y - y_offset)
    sin_sum += math.sin(math.radians(raw))
    cos_sum += math.cos(math.radians(raw))
    time.sleep_ms(SAMPLE_DELAY_MS)

MOUNTING_OFFSET_DEGREES = int(math.degrees(math.atan2(sin_sum, cos_sum))) % 360
print("Mounting offset measured: {} degrees".format(MOUNTING_OFFSET_DEGREES))

display.fill(BLACK)
shapes.ring(display, CENTER_X, CENTER_Y, DIAL_RADIUS, WHITE, 2)

try:
    while True:
        x, y, z = read_xyz()
        heading = heading_degrees(x - x_offset, y - y_offset)
        draw_needle(heading)
        draw_heading_label(heading)
        time.sleep_ms(SAMPLE_DELAY_MS)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
    show_message("Stopped")
