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
# already be copied onto the Pico's filesystem). All six MPU6050 channels
# at once - AX/AY/AZ acceleration and GX/GY/GZ angular velocity - each as
# its own horizontal bar growing left or right from a center line.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0  # LSB per g at the default +/-2g range
GYRO_SCALE = 131.0      # LSB per deg/s at the default +/-250 deg/s range
MAX_G = 2.0             # accel value at full bar deflection
MAX_DPS = 250.0         # gyro value at full bar deflection

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
BAR_HEIGHT = 6
ROW_Y = (2, 12, 22, 32, 42, 52)
LABELS = ("AX", "AY", "AZ", "GX", "GY", "GZ")
MAX_VALUES = (MAX_G, MAX_G, MAX_G, MAX_DPS, MAX_DPS, MAX_DPS)


def read_motion():
    # 14 bytes starting at ACCEL_XOUT_H: accel x/y/z, temp, gyro x/y/z
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 14)
    ax, ay, az, _temp, gx, gy, gz = struct.unpack(">hhhhhhh", data)
    return (ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE,
            gx / GYRO_SCALE, gy / GYRO_SCALE, gz / GYRO_SCALE)


def draw_bar(y, value, max_value):
    length = int((value / max_value) * BAR_HALF_WIDTH)
    if length > BAR_HALF_WIDTH:
        length = BAR_HALF_WIDTH
    elif length < -BAR_HALF_WIDTH:
        length = -BAR_HALF_WIDTH
    if length >= 0:
        oled.fill_rect(BAR_CENTER, y, length, BAR_HEIGHT, WHITE)
    else:
        oled.fill_rect(BAR_CENTER + length, y, -length, BAR_HEIGHT, WHITE)


def draw_frame(values):
    oled.fill(BLACK)
    for label, y, value, max_value in zip(LABELS, ROW_Y, values, MAX_VALUES):
        oled.text(label, 0, y, WHITE)
        oled.vline(BAR_CENTER, y, BAR_HEIGHT, WHITE)
        draw_bar(y, value, max_value)
    oled.show()


try:
    while True:
        draw_frame(read_motion())
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
