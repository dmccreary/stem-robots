import machine
import struct
import time
import math
import json
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
# Shows three independent estimates of roll (tilt about the long axis)
# side by side: GYRO (integrated gyro rate - responsive but drifts, like
# the 09 demo), ACC (angle computed straight from gravity via the
# accelerometer - noisy but never drifts), and FILT (a complementary
# filter blending both - fast like the gyro, stable like the
# accelerometer). Tilt the sensor slowly, then quickly, and watch how
# differently each row reacts. This is the same sensor-fusion technique
# Chapter 13 uses (with a magnetometer added) to get a stable heading.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

ACCEL_SCALE = 16384.0  # LSB per g at the default +/-2g range
GYRO_SCALE = 131.0      # LSB per deg/s at the default +/-250 deg/s range
CALIBRATION_FILE = "calibration.json"
FILTER_ALPHA = 0.98      # weight given to the gyro term each step

sda = machine.Pin(I2C_SDA_PIN)
scl = machine.Pin(I2C_SCL_PIN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# Wake the sensor - it powers on in sleep mode
i2c.writeto_mem(MPU6050_ADDRESS, PWR_MGMT_1, bytes([0x00]))
time.sleep_ms(100)

oled = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK

try:
    with open(CALIBRATION_FILE) as f:
        cal = json.load(f)
    gx_offset = cal.get("gx_offset", 0.0)
    print("Loaded gx_offset = {:.2f} deg/s from {}".format(gx_offset, CALIBRATION_FILE))
except OSError:
    gx_offset = 0.0
    print("No {} found - run 08-calibrate-gyro.py first. Using gx_offset = 0.0.".format(CALIBRATION_FILE))


def read_motion():
    # 14 bytes starting at ACCEL_XOUT_H: accel x/y/z, temp, gyro x/y/z
    data = i2c.readfrom_mem(MPU6050_ADDRESS, ACCEL_XOUT_H, 14)
    ax, ay, az, _t, gx, _gy, _gz = struct.unpack(">hhhhhhh", data)
    return ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE, gx / GYRO_SCALE


ax, ay, az, gx = read_motion()
gyro_roll = math.degrees(math.atan2(ay, az))
filtered_roll = gyro_roll

last_ms = time.ticks_ms()

print("Comparing gyro-only, accel-only, and filtered roll. Ctrl-C to stop.")

try:
    while True:
        now_ms = time.ticks_ms()
        dt = time.ticks_diff(now_ms, last_ms) / 1000.0
        last_ms = now_ms

        ax, ay, az, gx = read_motion()
        accel_roll = math.degrees(math.atan2(ay, az))
        gyro_roll += (gx - gx_offset) * dt
        filtered_roll = FILTER_ALPHA * (filtered_roll + (gx - gx_offset) * dt) + (1 - FILTER_ALPHA) * accel_roll

        oled.fill(BLACK)
        oled.text("GYRO {:+6.0f}".format(gyro_roll), 0, 8, WHITE)
        oled.text("ACC  {:+6.0f}".format(accel_roll), 0, 28, WHITE)
        oled.text("FILT {:+6.0f}".format(filtered_roll), 0, 48, WHITE)
        oled.show()

        print("gyro={:+7.1f}  acc={:+7.1f}  filt={:+7.1f}".format(gyro_roll, accel_roll, filtered_roll))
        time.sleep_ms(50)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
