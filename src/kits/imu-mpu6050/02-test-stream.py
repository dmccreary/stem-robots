import machine
import struct
import time

# MPU6050 wiring:
#   VCC -> Pico 3.3V OUT (pin 36)
#   GND -> Pico GND (pin 13)
#   SDA -> GPIO10 (I2C1 SDA)
#   SCL -> GPIO11 (I2C1 SCL)
#
# Self-contained on purpose (pins inlined, not imported from config.py) so
# it can be run standalone from Thonny or `mpremote run` without also
# copying config.py onto the Pico first.
#
# Load this file onto the Pico with Thonny and run it (F5), or run
# headlessly with mpremote. Rotate/tilt/shake the sensor and watch the
# accel/gyro numbers change - that confirms a live, valid data stream even
# with no display attached.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
MPU6050_ADDRESS_LOW = 0x68
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B

# Default full-scale ranges: accel +/-2g, gyro +/-250 deg/s
ACCEL_SCALE = 16384.0  # LSB per g
GYRO_SCALE = 131.0     # LSB per deg/s

sda = machine.Pin(I2C_SDA_PIN)
scl = machine.Pin(I2C_SCL_PIN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# Wake the sensor - it powers on in sleep mode
i2c.writeto_mem(MPU6050_ADDRESS_LOW, PWR_MGMT_1, bytes([0x00]))
time.sleep_ms(100)


def read_motion():
    # 14 bytes starting at ACCEL_XOUT_H: accel x/y/z, temp, gyro x/y/z
    data = i2c.readfrom_mem(MPU6050_ADDRESS_LOW, ACCEL_XOUT_H, 14)
    ax, ay, az, _temp, gx, gy, gz = struct.unpack(">hhhhhhh", data)
    return (ax / ACCEL_SCALE, ay / ACCEL_SCALE, az / ACCEL_SCALE,
            gx / GYRO_SCALE, gy / GYRO_SCALE, gz / GYRO_SCALE)


print("Streaming MPU6050 data - rotate/tilt the sensor and watch the values change.")
print("Ctrl-C to stop.")
print("ax(g)   ay(g)   az(g)   gx(dps)  gy(dps)  gz(dps)")

try:
    while True:
        ax, ay, az, gx, gy, gz = read_motion()
        print("{:6.2f}  {:6.2f}  {:6.2f}  {:7.1f}  {:7.1f}  {:7.1f}".format(ax, ay, az, gx, gy, gz))
        time.sleep_ms(200)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
