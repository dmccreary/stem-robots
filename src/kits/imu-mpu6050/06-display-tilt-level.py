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
# Load this file onto the Pico with Thonny and run it (F5), or run
# headlessly with mpremote (requires config.py and lib/ssd1306.py to
# already be copied onto the Pico's filesystem). Draws a bubble-level
# style circle: a dot that drifts away from center as you tilt the board
# and settles back to the middle - with a "LEVEL" readout - when it's flat.
#
# Which direction the dot moves for a given tilt depends on which way your
# board's X/Y axis arrows point (silkscreened on most breakouts). If it
# feels backwards, flip the sign on ax/ay below.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0  # LSB per g at the default +/-2g range
LEVEL_TOLERANCE_G = 0.06  # ~3-4 degrees of tilt

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

CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2 - 6
RADIUS = CENTER_Y - 4
BUBBLE_RADIUS = 4


def read_accel():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 6)
    ax, ay, az = struct.unpack(">hhh", data)
    return ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE


def clamp(value, lo, hi):
    if value < lo:
        return lo
    if value > hi:
        return hi
    return value


def draw_level(ax, ay, az):
    oled.fill(BLACK)
    oled.ellipse(CENTER_X, CENTER_Y, RADIUS, RADIUS, WHITE, NO_FILL)
    oled.hline(CENTER_X - 4, CENTER_Y, 9, WHITE)
    oled.vline(CENTER_X, CENTER_Y - 4, 9, WHITE)

    dx = clamp(ax, -1.0, 1.0)
    dy = clamp(ay, -1.0, 1.0)
    bubble_x = CENTER_X + int(dx * RADIUS)
    bubble_y = CENTER_Y - int(dy * RADIUS)
    oled.ellipse(bubble_x, bubble_y, BUBBLE_RADIUS, BUBBLE_RADIUS, WHITE, FILL)

    if abs(ax) < LEVEL_TOLERANCE_G and abs(ay) < LEVEL_TOLERANCE_G:
        label = "LEVEL"
    else:
        roll_deg = math.degrees(math.atan2(ay, az))
        pitch_deg = math.degrees(math.atan2(-ax, math.sqrt(ay * ay + az * az)))
        label = "R:{:+.0f} P:{:+.0f}".format(roll_deg, pitch_deg)
    text_x = CENTER_X - (len(label) * 8) // 2
    oled.text(label, text_x, HEIGHT - 10, WHITE)
    oled.show()


try:
    while True:
        ax, ay, az = read_accel()
        draw_level(ax, ay, az)
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
