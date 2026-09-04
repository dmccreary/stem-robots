import time
import machine
import config
from l3gd20 import L3GD20
from lsm303dlhc import LSM303DLHC

# 9 horizontal bars, one per gyro/accel/mag axis, each growing left (negative)
# or right (positive) from a shared centerline - a way to see all 9 channels'
# sign and rough magnitude at a glance instead of reading numbers. See
# 04-display-imu.py for the same 9 channels as text.
NAME = "05-display-bars.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

print("init I2C + sensors...")
i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)
gyro = L3GD20(i2c, config.GYRO_I2C_ADDRESS)
accel_mag = LSM303DLHC(i2c, config.ACCEL_I2C_ADDRESS, config.MAG_I2C_ADDRESS)
print("sensors OK")

print("init display...")
display = config.init_display()
print("display OK")
display.fill(config.BLACK)

# Each channel is clamped to its own full-scale range before scaling to a
# bar length in pixels - a 250 dps gyro reading and a 0.5 gauss mag reading
# are both "as big as this axis gets," so each type needs its own scale
# instead of one shared number. GYRO_FULL_SCALE matches the +/-250 dps
# range CTRL_REG4 configures in l3gd20.py.
LABELS = ("GX", "GY", "GZ", "AX", "AY", "AZ", "MX", "MY", "MZ")
FULL_SCALE = (250, 250, 250, 2.0, 2.0, 2.0, 1.0, 1.0, 1.0)
BAR_COLOR = (config.GREEN, config.GREEN, config.GREEN,
             config.YELLOW, config.YELLOW, config.YELLOW,
             config.MAGENTA, config.MAGENTA, config.MAGENTA)

# Kept deliberately conservative: DISPLAY_SAFE_RADIUS is an estimate, not
# yet measured on this panel (see config.py), so rows stay close to
# vertical center and bars stay short enough that a label + full-length
# bar can't run under the bezel even if that estimate is a bit optimistic.
BAR_HEIGHT = 16
ROW_SPACING = 22
MAX_BAR_PX = 90
LABEL_GAP = 6

TITLE = "9-DOF IMU BARS"
title_x = config.DISPLAY_CENTER_X - (len(TITLE) * config.SMALL_FONT.WIDTH) // 2
display.text(config.SMALL_FONT, TITLE, title_x, 50, config.WHITE, config.BLACK)

# Row centers spread symmetrically above/below screen center so the
# outermost rows (index 0 and 8) are the ones closest to the bezel.
row_y = [config.DISPLAY_CENTER_Y + (i - 4) * ROW_SPACING - BAR_HEIGHT // 2 for i in range(9)]
label_x = config.DISPLAY_CENTER_X - MAX_BAR_PX - LABEL_GAP - len("GX") * config.SMALL_FONT.WIDTH

for i, label in enumerate(LABELS):
    display.text(config.SMALL_FONT, label, label_x, row_y[i], config.WHITE, config.BLACK)

centerline_top = row_y[0] - 4
centerline_bottom = row_y[8] + BAR_HEIGHT + 4
display.vline(config.DISPLAY_CENTER_X, centerline_top, centerline_bottom - centerline_top, config.WHITE)

prev_left = [0] * 9
prev_right = [0] * 9


def draw_bar(i, value):
    frac = min(abs(value) / FULL_SCALE[i], 1.0)
    length = int(frac * MAX_BAR_PX)
    y = row_y[i]

    # Erase only the previous bar's own rectangle, not the whole row -
    # same "redraw only what changed" reasoning as 04-display-imu.py.
    if prev_left[i]:
        display.fill_rect(config.DISPLAY_CENTER_X - prev_left[i], y, prev_left[i], BAR_HEIGHT, config.BLACK)
    if prev_right[i]:
        display.fill_rect(config.DISPLAY_CENTER_X + 1, y, prev_right[i], BAR_HEIGHT, config.BLACK)

    new_left = length if value < 0 else 0
    new_right = length if value > 0 else 0
    if new_left:
        display.fill_rect(config.DISPLAY_CENTER_X - new_left, y, new_left, BAR_HEIGHT, BAR_COLOR[i])
    if new_right:
        display.fill_rect(config.DISPLAY_CENTER_X + 1, y, new_right, BAR_HEIGHT, BAR_COLOR[i])

    # A bar that reaches the centerline erases/overdraws it - redraw this
    # row's sliver every frame so the line stays continuous even when a
    # bar shrinks to zero length.
    display.vline(config.DISPLAY_CENTER_X, y, BAR_HEIGHT, config.WHITE)

    prev_left[i] = new_left
    prev_right[i] = new_right


try:
    while True:
        gx, gy, gz = gyro.read_dps()
        ax, ay, az = accel_mag.read_accel_g()
        mx, my, mz = accel_mag.read_mag_gauss()

        for i, value in enumerate((gx, gy, gz, ax, ay, az, mx, my, mz)):
            draw_bar(i, value)

        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
