import machine
import struct
import time
import config

# Lab 09: Draw Bars
# Turns X, Y, Z into three vertical bar graphs instead of three numbers -
# a bar you can read at a glance, without having to parse a number
# first. Each bar grows up from a center baseline for a positive
# reading, and down for a negative one, so the zero line itself carries
# information.
#
# Like lab 07, this redraws several times a second with no frame buffer
# to fall back on, so it never clears the whole screen. Only each bar's
# own column - value label, bar, and baseline tick - gets erased and
# redrawn every frame; the background, the outer baseline, and the
# static "X"/"Y"/"Z" letters are drawn once before the loop and never
# touched again.

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

# Raw HMC5883L readings at this gain typically run a few hundred counts
# indoors. FULL_SCALE sets what counts as "the bar is maxed out" -
# readings past it just clip at the top/bottom of the bar.
FULL_SCALE = 800
BASELINE_Y = config.CENTER_Y
MAX_BAR_HEIGHT = 70
BAR_WIDTH = 24
BAR_GAP = 16
BAR_SPACING = BAR_WIDTH + BAR_GAP  # 40 - center-to-center distance
FIRST_BAR_X = config.CENTER_X - (3 * BAR_WIDTH + 2 * BAR_GAP) // 2

AXES = [("X", config.RED), ("Y", config.GREEN), ("Z", config.BLUE)]
CENTERS = [FIRST_BAR_X + i * BAR_SPACING + BAR_WIDTH // 2 for i in range(3)]

# The per-frame clear/redraw column: exactly BAR_SPACING wide, so the
# three columns tile edge-to-edge with no gap and no overlap.
COLUMN_WIDTH = BAR_SPACING
VALUE_Y = BASELINE_Y - MAX_BAR_HEIGHT - 20   # value label sits above the bar
LABEL_Y = BASELINE_Y + MAX_BAR_HEIGHT + 8    # "X"/"Y"/"Z" sits below it
COLUMN_TOP = VALUE_Y
COLUMN_HEIGHT = (BASELINE_Y + MAX_BAR_HEIGHT) - COLUMN_TOP


def read_xyz():
    data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z


def bar_height(value):
    scaled = int(abs(value) * MAX_BAR_HEIGHT / FULL_SCALE)
    return min(scaled, MAX_BAR_HEIGHT)


def setup_static():
    """Draw everything that never changes, once, before the loop starts:
    the black background, the outer baseline, and the axis letters."""
    display.fill(BLACK)
    baseline_width = 3 * BAR_WIDTH + 2 * BAR_GAP + 16
    display.hline(FIRST_BAR_X - 8, BASELINE_Y, baseline_width, WHITE)
    for (label, _color), cx in zip(AXES, CENTERS):
        display.text(config.FONT, label, cx - 4, LABEL_Y, WHITE, BLACK)


def draw_bars(values):
    for (_label, color), value, cx in zip(AXES, values, CENTERS):
        bar_x = cx - BAR_WIDTH // 2
        column_x = cx - COLUMN_WIDTH // 2

        # Erase only this bar's own column, not the whole screen.
        display.fill_rect(column_x, COLUMN_TOP, COLUMN_WIDTH, COLUMN_HEIGHT, BLACK)

        display.hline(bar_x, BASELINE_Y, BAR_WIDTH, WHITE)
        height = bar_height(value)
        if value >= 0:
            display.fill_rect(bar_x, BASELINE_Y - height, BAR_WIDTH, height, color)
        else:
            display.fill_rect(bar_x, BASELINE_Y + 1, BAR_WIDTH, height, color)

        text = str(value)
        text_x = cx - (len(text) * 8) // 2
        display.text(config.FONT, text, text_x, VALUE_Y, WHITE, BLACK)


setup_static()

try:
    while True:
        x, y, z = read_xyz()
        draw_bars((x, y, z))
        time.sleep_ms(150)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
