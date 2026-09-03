import time
import machine
import config
from l3gd20 import L3GD20
from lsm303dlhc import LSM303DLHC

# Streams all 9 IMU axes (gyro x/y/z, accel x/y/z, mag x/y/z) to the Thonny
# Plotter. Each channel is independently rescaled to 0-100 using its own
# running min/max, so a small-range signal (mag, in gauss) stays visible on
# the same graph as a large-range one (gyro, in dps) instead of looking flat.
#
# Load this file onto the Pico with Thonny and run it (F5), then open
# View > Plotter to see all nine channels graphed live. Rotate and tilt the
# board to make every channel move at least once.
NAME = "03-plot-test-stream.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)

gyro = L3GD20(i2c, config.GYRO_I2C_ADDRESS)
accel_mag = LSM303DLHC(i2c, config.ACCEL_I2C_ADDRESS, config.MAG_I2C_ADDRESS)

NUM_CHANNELS = 9
channel_mins = [None] * NUM_CHANNELS
channel_maxs = [None] * NUM_CHANNELS


def autoscale(values):
    scaled = []
    for i, v in enumerate(values):
        if channel_mins[i] is None or v < channel_mins[i]:
            channel_mins[i] = v
        if channel_maxs[i] is None or v > channel_maxs[i]:
            channel_maxs[i] = v
        span = channel_maxs[i] - channel_mins[i]
        # A channel that hasn't moved yet has zero span - park it at the
        # midpoint instead of dividing by zero.
        scaled.append(50.0 if span == 0 else (v - channel_mins[i]) / span * 100)
    return scaled


try:
    while True:
        gx, gy, gz = gyro.read_dps()
        ax, ay, az = accel_mag.read_accel_g()
        mx, my, mz = accel_mag.read_mag_gauss()
        scaled = autoscale((gx, gy, gz, ax, ay, az, mx, my, mz))
        print("{:.1f} {:.1f} {:.1f} {:.1f} {:.1f} {:.1f} {:.1f} {:.1f} {:.1f}".format(*scaled))
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
