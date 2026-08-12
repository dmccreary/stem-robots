import machine
import struct
import time
import config

# MPU6050 wiring (I2C1):
#   SDA -> GPIO10 (I2C1 SDA)
#   SCL -> GPIO11 (I2C1 SCL)
#
# OLED wiring (SPI0) is defined in config.py.
#
# Load this file onto the Pico with Thonny and run it (F5), or run
# headlessly with mpremote (requires config.py and lib/ssd1306.py to
# already be copied onto the Pico's filesystem). Three horizontal bars -
# X, Y, Z acceleration - grow left or right from a center line as you
# tilt/move the sensor.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0  # LSB per g at the default +/-2g range
MAX_G = 2.0             # acceleration at full bar deflection

sda = machine.Pin(I2C_SDA_PIN)
scl = machine.Pin(I2C_SCL_PIN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# Wake the sensor - it powers on in sleep mode
i2c.writeto_mem(MPU6050_ADDRESS, PWR_MGMT_1, bytes([0x00]))
time.sleep_ms(100)

oled = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK
WIDTH = config.WIDTH
HEIGHT = config.HEIGHT

BAR_LEFT = 16
BAR_RIGHT = WIDTH - 1
BAR_CENTER = (BAR_LEFT + BAR_RIGHT) // 2
BAR_HALF_WIDTH = BAR_CENTER - BAR_LEFT
BAR_HEIGHT = 10
ROW_Y = (4, 26, 48)
LABELS = ("X", "Y", "Z")


def read_accel():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 6)
    ax, ay, az = struct.unpack(">hhh", data)
    return ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE


def draw_bar(y, value):
    length = int((value / MAX_G) * BAR_HALF_WIDTH)
    if length > BAR_HALF_WIDTH:
        length = BAR_HALF_WIDTH
    elif length < -BAR_HALF_WIDTH:
        length = -BAR_HALF_WIDTH
    if length >= 0:
        oled.fill_rect(BAR_CENTER, y, length, BAR_HEIGHT, WHITE)
    else:
        oled.fill_rect(BAR_CENTER + length, y, -length, BAR_HEIGHT, WHITE)


def draw_frame(ax, ay, az):
    oled.fill(BLACK)
    for label, y, value in zip(LABELS, ROW_Y, (ax, ay, az)):
        oled.text(label, 0, y + 1, WHITE)
        oled.vline(BAR_CENTER, y, BAR_HEIGHT, WHITE)
        draw_bar(y, value)
    oled.show()


try:
    while True:
        ax, ay, az = read_accel()
        draw_frame(ax, ay, az)
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
