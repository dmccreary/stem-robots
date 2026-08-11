import machine
import struct
import time
import math

# HMC5883L wiring:
#   VCC  -> Pico 3.3V OUT (pin 36)
#   GND  -> Pico GND (pin 13)
#   SDA  -> GPIO10 (I2C1 SDA)
#   SCL  -> GPIO11 (I2C1 SCL)
#
# Load this file onto the Pico with Thonny and run it (F5). When it
# prints "Calibrating...", slowly rotate the board through at least
# one full flat circle until the countdown ends. After that it prints
# a live, hard-iron-corrected heading (0 = north, clockwise to 359).
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

try:
    while True:
        x, y, z = read_xyz()
        print(heading_degrees(x - x_offset, y - y_offset))
        time.sleep_ms(SAMPLE_DELAY_MS)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
