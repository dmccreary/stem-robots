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
# Set the sensor down flat and DON'T touch it. This integrates gz over
# time into a running heading estimate two ways at once: RAW (no bias
# correction) and CAL (using calibration.json from 08-calibrate-gyro.py).
# Watch RAW wander away from 0 within seconds even though the sensor never
# moved - that's the uncorrected gyro bias accumulating. CAL should drift
# much more slowly, though not perfectly, since calibration only removes
# the *average* bias, not sensor noise - a preview of why real swarm
# robots (Chapter 13) still re-sync heading over WiFi rather than trusting
# a gyro alone forever.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS = 0x68
PWR_MGMT_1 = 0x6B
GYRO_XOUT_H = 0x43

GYRO_SCALE = 131.0  # LSB per deg/s at the default +/-250 deg/s range
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

try:
    with open(CALIBRATION_FILE) as f:
        cal = json.load(f)
    gz_offset = cal.get("gz_offset", 0.0)
    print("Loaded gz_offset = {:.2f} deg/s from {}".format(gz_offset, CALIBRATION_FILE))
except OSError:
    gz_offset = 0.0
    print("No {} found - run 08-calibrate-gyro.py first for a real CAL comparison.".format(CALIBRATION_FILE))
    print("Using gz_offset = 0.0 (RAW and CAL will match).")


def read_gz():
    data = i2c.readfrom_mem(MPU6050_ADDRESS, GYRO_XOUT_H, 6)
    _gx, _gy, gz = struct.unpack(">hhh", data)
    return gz / GYRO_SCALE


raw_heading = 0.0
cal_heading = 0.0
start_ms = time.ticks_ms()
last_ms = start_ms

print("Integrating heading - keep the sensor still and flat. Ctrl-C to stop.")

try:
    while True:
        now_ms = time.ticks_ms()
        dt = time.ticks_diff(now_ms, last_ms) / 1000.0
        last_ms = now_ms

        gz = read_gz()
        raw_heading = (raw_heading + gz * dt) % 360.0
        cal_heading = (cal_heading + (gz - gz_offset) * dt) % 360.0

        elapsed = time.ticks_diff(now_ms, start_ms) / 1000.0

        oled.fill(BLACK)
        oled.text("t = {:.0f}s".format(elapsed), 0, 4, WHITE)
        oled.text("RAW {:5.0f}".format(raw_heading), 0, 26, WHITE)
        oled.text("CAL {:5.0f}".format(cal_heading), 0, 44, WHITE)
        oled.show()

        print("t={:6.1f}s  raw={:6.1f}  cal={:6.1f}".format(elapsed, raw_heading, cal_heading))
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
