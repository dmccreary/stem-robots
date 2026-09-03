import time
import machine
import config
from l3gd20 import L3GD20
from lsm303dlhc import LSM303DLHC

# Copy src/lib/l3gd20.py and src/lib/lsm303dlhc.py onto the Pico alongside
# this script (or into /lib) before running it - see the 9-DOF IMU kit guide.
NAME = "02-test-stream.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

# SoftI2C, not the hardware I2C(0, ...) peripheral - see config.py for why.
i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)

gyro = L3GD20(i2c, config.GYRO_I2C_ADDRESS)
accel_mag = LSM303DLHC(i2c, config.ACCEL_I2C_ADDRESS, config.MAG_I2C_ADDRESS)

try:
    while True:
        gx, gy, gz = gyro.read_dps()
        ax, ay, az = accel_mag.read_accel_g()
        mx, my, mz = accel_mag.read_mag_gauss()
        print("gyro dps: {:7.2f} {:7.2f} {:7.2f}  accel g: {:5.2f} {:5.2f} {:5.2f}  mag gauss: {:6.3f} {:6.3f} {:6.3f}".format(
            gx, gy, gz, ax, ay, az, mx, my, mz))
        time.sleep_ms(200)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
