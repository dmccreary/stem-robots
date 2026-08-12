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
# already be copied onto the Pico's filesystem).
#
# At rest, total accelerometer magnitude reads ~1g no matter which way the
# sensor is oriented, since gravity is the only force acting on it. A tap,
# bump, or shake briefly pushes that magnitude well above (or below) 1g.
# This watches for that spike and flashes SHAKE! on the display - the same
# kind of event a real swarm robot would broadcast to its neighbors for
# collective obstacle avoidance (Chapter 13).
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0    # LSB per g at the default +/-2g range
SHAKE_THRESHOLD_G = 0.5   # trigger when magnitude is more than this far from 1g
SHAKE_HOLD_MS = 800        # how long SHAKE! stays on screen after a spike

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


def read_accel():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 6)
    ax, ay, az = struct.unpack(">hhh", data)
    return ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE


def center_text(text, y, color):
    x = (WIDTH - len(text) * 8) // 2
    oled.text(text, x, y, color)


shake_until = time.ticks_ms()
print("Watching for shakes/bumps. Ctrl-C to stop.")

try:
    while True:
        ax, ay, az = read_accel()
        magnitude = math.sqrt(ax * ax + ay * ay + az * az)
        now = time.ticks_ms()

        if abs(magnitude - 1.0) > SHAKE_THRESHOLD_G:
            shake_until = time.ticks_add(now, SHAKE_HOLD_MS)
            print("SHAKE detected - magnitude = {:.2f}g".format(magnitude))

        if time.ticks_diff(shake_until, now) > 0:
            oled.fill(WHITE)
            center_text("SHAKE!", 28, BLACK)
        else:
            oled.fill(BLACK)
            center_text("steady", 20, WHITE)
            center_text("{:.2f}g".format(magnitude), 36, WHITE)
        oled.show()
        time.sleep_ms(50)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
    oled.fill(BLACK)
    oled.show()
