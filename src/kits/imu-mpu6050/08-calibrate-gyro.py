import machine
import struct
import time
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
# A stationary gyroscope should read 0 deg/s on every axis, but every
# MPU6050 has a small constant bias baked in from manufacturing - often
# a few deg/s per axis. Left uncorrected, integrating that bias over time
# (as any heading estimate has to) produces drift: the reported heading
# wanders even though the sensor never moved. This script measures that
# bias by averaging gyro readings while the sensor sits still, then saves
# the per-axis offset to calibration.json on the Pico so other scripts can
# subtract it out. Set the sensor down flat and don't touch it once
# calibration starts.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
GYRO_XOUT_H = 0x43

GYRO_SCALE = 131.0  # LSB per deg/s at the default +/-250 deg/s range
CALIBRATION_SECONDS = 5
SAMPLE_DELAY_MS = 20
CALIBRATION_FILE = "calibration.json"

sda = machine.Pin(I2C_SDA_PIN)
scl = machine.Pin(I2C_SCL_PIN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# Wake the sensor - it powers on in sleep mode
i2c.writeto_mem(MPU6050_ADDRESS, PWR_MGMT_1, bytes([0x00]))
time.sleep_ms(100)

oled = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK


def show_message(*lines):
    oled.fill(BLACK)
    for row, line in enumerate(lines):
        oled.text(line, 0, row * 10, WHITE)
    oled.show()


def read_gyro_raw():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, GYRO_XOUT_H, 6)
    return struct.unpack(">hhh", data)


show_message("Calibrating gyro", "Keep sensor", "still and flat")
print("Calibrating gyro bias for {} seconds - keep the sensor still and flat".format(CALIBRATION_SECONDS))

sum_x = sum_y = sum_z = 0
samples = CALIBRATION_SECONDS * 1000 // SAMPLE_DELAY_MS
for i in range(samples):
    raw_x, raw_y, raw_z = read_gyro_raw()
    sum_x += raw_x
    sum_y += raw_y
    sum_z += raw_z
    time.sleep_ms(SAMPLE_DELAY_MS)

gx_offset = sum_x / samples / GYRO_SCALE
gy_offset = sum_y / samples / GYRO_SCALE
gz_offset = sum_z / samples / GYRO_SCALE

calibration = {"gx_offset": gx_offset, "gy_offset": gy_offset, "gz_offset": gz_offset}
with open(CALIBRATION_FILE, "w") as f:
    json.dump(calibration, f)

print("Calibration complete:")
print("  gx_offset = {:.2f} deg/s".format(gx_offset))
print("  gy_offset = {:.2f} deg/s".format(gy_offset))
print("  gz_offset = {:.2f} deg/s".format(gz_offset))
print("Saved to {}".format(CALIBRATION_FILE))

show_message("Calibration done", "gx:{:+.1f} gy:{:+.1f}".format(gx_offset, gy_offset), "gz:{:+.1f}".format(gz_offset))
