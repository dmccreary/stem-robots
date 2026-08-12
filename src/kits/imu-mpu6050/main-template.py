import machine
import struct
import time
import math
import config

# MPU6050 wiring (I2C1):
#   SDA -> GPIO10 (I2C1 SDA)
#   SCL -> GPIO11 (I2C1 SCL)
#
# OLED wiring (SPI0) is defined in config.py.
#
# This is a TEMPLATE for main.py, the program the Pico runs automatically
# on power-up/reset. It is named main-template.py on purpose so it won't
# silently replace anything already on the device - copy it over yourself
# when you're ready:
#   mpremote connect /dev/cu.usbmodem101 fs cp main-template.py :main.py
#
# A mode-based demo for anyone picking up the kit cold, no calibration
# required. Mode 0 (six bars) runs first so they can move each bar right
# away. SHAKE THE BOX and it flashes "Shake Detected / Changing Mode..."
# and advances to the next mode. It wraps back to mode 0 after the last one.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0  # LSB per g at the default +/-2g range
GYRO_SCALE = 131.0      # LSB per deg/s at the default +/-250 deg/s range

SHAKE_THRESHOLD_G = 0.5   # trigger when magnitude is more than this far from 1g
SHAKE_MESSAGE_MS = 1000    # how long the "Shake Detected" message stays up
MODE_COOLDOWN_MS = 1500    # ignore new shakes for this long right after switching

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
FILL = config.FILL
WIDTH = config.WIDTH
HEIGHT = config.HEIGHT


def read_motion():
    # 14 bytes starting at ACCEL_XOUT_H: accel x/y/z, temp, gyro x/y/z
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 14)
    ax, ay, az, _t, gx, gy, gz = struct.unpack(">hhhhhhh", data)
    return (ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE,
            gx / GYRO_SCALE, gy / GYRO_SCALE, gz / GYRO_SCALE)


def center_text(text, y, color):
    x = (WIDTH - len(text) * 8) // 2
    oled.text(text, x, y, color)


def clamp(value, lo, hi):
    if value < lo:
        return lo
    if value > hi:
        return hi
    return value


# ---------------------------------------------------------------------------
# Shared bar-drawing helper (used by modes 0, 2, and 3)
# ---------------------------------------------------------------------------
BAR_LEFT = 16
BAR_RIGHT = WIDTH - 1
BAR_CENTER = (BAR_LEFT + BAR_RIGHT) // 2
BAR_HALF_WIDTH = BAR_CENTER - BAR_LEFT


def draw_bar(y, value, max_value, height):
    length = int((value / max_value) * BAR_HALF_WIDTH)
    if length > BAR_HALF_WIDTH:
        length = BAR_HALF_WIDTH
    elif length < -BAR_HALF_WIDTH:
        length = -BAR_HALF_WIDTH
    if length >= 0:
        oled.fill_rect(BAR_CENTER, y, length, height, WHITE)
    else:
        oled.fill_rect(BAR_CENTER + length, y, -length, height, WHITE)


# ---------------------------------------------------------------------------
# Mode 0: six bars - AX/AY/AZ/GX/GY/GZ, one compact bar each. Move it or
# spin it - every bar reacts.
# ---------------------------------------------------------------------------
SIX_BAR_ROW_Y = (2, 12, 22, 32, 42, 52)
SIX_BAR_LABELS = ("AX", "AY", "AZ", "GX", "GY", "GZ")
SIX_BAR_MAX = (2.0, 2.0, 2.0, 250.0, 250.0, 250.0)
SIX_BAR_HEIGHT = 6


def mode_six_bars(ax, ay, az, gx, gy, gz, dt):
    values = (ax, ay, az, gx, gy, gz)
    for label, y, value, max_value in zip(SIX_BAR_LABELS, SIX_BAR_ROW_Y, values, SIX_BAR_MAX):
        oled.text(label, 0, y, WHITE)
        oled.vline(BAR_CENTER, y, SIX_BAR_HEIGHT, WHITE)
        draw_bar(y, value, max_value, SIX_BAR_HEIGHT)


# ---------------------------------------------------------------------------
# Mode 1: tilt/level - a dot drifts away from center as you tilt the board,
# and it says LEVEL when you get it flat.
# ---------------------------------------------------------------------------
LEVEL_CENTER_X = WIDTH // 2
LEVEL_CENTER_Y = HEIGHT // 2 - 6
LEVEL_RADIUS = LEVEL_CENTER_Y - 4
BUBBLE_RADIUS = 4
LEVEL_TOLERANCE_G = 0.06


def mode_tilt_level(ax, ay, az, gx, gy, gz, dt):
    oled.ellipse(LEVEL_CENTER_X, LEVEL_CENTER_Y, LEVEL_RADIUS, LEVEL_RADIUS, WHITE, NO_FILL)
    oled.hline(LEVEL_CENTER_X - 4, LEVEL_CENTER_Y, 9, WHITE)
    oled.vline(LEVEL_CENTER_X, LEVEL_CENTER_Y - 4, 9, WHITE)

    dx = clamp(ax, -1.0, 1.0)
    dy = clamp(ay, -1.0, 1.0)
    bubble_x = LEVEL_CENTER_X + int(dx * LEVEL_RADIUS)
    bubble_y = LEVEL_CENTER_Y - int(dy * LEVEL_RADIUS)
    oled.ellipse(bubble_x, bubble_y, BUBBLE_RADIUS, BUBBLE_RADIUS, WHITE, FILL)

    if abs(ax) < LEVEL_TOLERANCE_G and abs(ay) < LEVEL_TOLERANCE_G:
        label = "LEVEL"
    else:
        roll_deg = math.degrees(math.atan2(ay, az))
        pitch_deg = math.degrees(math.atan2(-ax, math.sqrt(ay * ay + az * az)))
        label = "R:{:+.0f} P:{:+.0f}".format(roll_deg, pitch_deg)
    center_text(label, HEIGHT - 10, WHITE)


# ---------------------------------------------------------------------------
# Mode 2: accel bars only - X/Y/Z acceleration, bigger bars than mode 0
# ---------------------------------------------------------------------------
XYZ_ROW_Y = (4, 26, 48)
XYZ_LABELS = ("X", "Y", "Z")
XYZ_BAR_HEIGHT = 10


def mode_accel_bars(ax, ay, az, gx, gy, gz, dt):
    for label, y, value in zip(XYZ_LABELS, XYZ_ROW_Y, (ax, ay, az)):
        oled.text(label, 0, y + 1, WHITE)
        oled.vline(BAR_CENTER, y, XYZ_BAR_HEIGHT, WHITE)
        draw_bar(y, value, 2.0, XYZ_BAR_HEIGHT)


# ---------------------------------------------------------------------------
# Mode 3: gyro bars only - X/Y/Z angular velocity, bigger bars than mode 0
# ---------------------------------------------------------------------------
def mode_gyro_bars(ax, ay, az, gx, gy, gz, dt):
    for label, y, value in zip(XYZ_LABELS, XYZ_ROW_Y, (gx, gy, gz)):
        oled.text(label, 0, y + 1, WHITE)
        oled.vline(BAR_CENTER, y, XYZ_BAR_HEIGHT, WHITE)
        draw_bar(y, value, 250.0, XYZ_BAR_HEIGHT)


# ---------------------------------------------------------------------------
# Mode 4: sensor fusion preview - three ways to estimate roll (tilt) at
# once: GYRO (integrated - responsive but drifts), ACC (from gravity -
# noisy but never drifts), and FILT (a blend of both).
# ---------------------------------------------------------------------------
FILTER_ALPHA = 0.98
comp_gyro_roll = 0.0
comp_filtered_roll = 0.0


def reset_complementary(ax, ay, az):
    global comp_gyro_roll, comp_filtered_roll
    start_roll = math.degrees(math.atan2(ay, az))
    comp_gyro_roll = start_roll
    comp_filtered_roll = start_roll


def mode_complementary(ax, ay, az, gx, gy, gz, dt):
    global comp_gyro_roll, comp_filtered_roll
    accel_roll = math.degrees(math.atan2(ay, az))
    comp_gyro_roll += gx * dt
    comp_filtered_roll = FILTER_ALPHA * (comp_filtered_roll + gx * dt) + (1 - FILTER_ALPHA) * accel_roll
    oled.text("GYRO {:+6.0f}".format(comp_gyro_roll), 0, 8, WHITE)
    oled.text("ACC  {:+6.0f}".format(accel_roll), 0, 28, WHITE)
    oled.text("FILT {:+6.0f}".format(comp_filtered_roll), 0, 48, WHITE)


# ---------------------------------------------------------------------------
# Mode table: (name, draw_function, on_enter_function_or_None)
# ---------------------------------------------------------------------------
MODES = (
    ("Six Bars", mode_six_bars, None),
    ("Tilt Level", mode_tilt_level, None),
    ("Accel Bars", mode_accel_bars, None),
    ("Gyro Bars", mode_gyro_bars, None),
    ("Sensor Fusion", mode_complementary, reset_complementary),
)

mode_index = 0
mode_changed_ms = time.ticks_ms()


def enter_mode(index, ax, ay, az):
    global mode_index, mode_changed_ms
    mode_index = index
    mode_changed_ms = time.ticks_ms()
    name, _draw, on_enter = MODES[mode_index]
    print("Mode {}: {}".format(mode_index, name))
    if on_enter is not None:
        on_enter(ax, ay, az)


ax, ay, az, gx, gy, gz = read_motion()
enter_mode(0, ax, ay, az)
last_ms = time.ticks_ms()

print("Shake the sensor to advance to the next mode. Ctrl-C to stop.")

try:
    while True:
        now_ms = time.ticks_ms()
        dt = time.ticks_diff(now_ms, last_ms) / 1000.0
        last_ms = now_ms

        ax, ay, az, gx, gy, gz = read_motion()
        magnitude = math.sqrt(ax * ax + ay * ay + az * az)
        shook = abs(magnitude - 1.0) > SHAKE_THRESHOLD_G
        cooling_down = time.ticks_diff(now_ms, mode_changed_ms) < MODE_COOLDOWN_MS

        if shook and not cooling_down:
            next_index = (mode_index + 1) % len(MODES)
            next_name, _draw, _on_enter = MODES[next_index]

            oled.fill(WHITE)
            center_text("Shake Detected", 8, BLACK)
            center_text("Changing Mode", 24, BLACK)
            center_text(next_name, 40, BLACK)
            oled.show()
            time.sleep_ms(SHAKE_MESSAGE_MS)

            ax, ay, az, gx, gy, gz = read_motion()
            enter_mode(next_index, ax, ay, az)
            last_ms = time.ticks_ms()
            continue

        oled.fill(BLACK)
        _name, draw, _on_enter = MODES[mode_index]
        draw(ax, ay, az, gx, gy, gz, dt)
        oled.show()
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
