import time
import machine
import config
from l3gd20 import L3GD20
from lsm303dlhc import LSM303DLHC

# Same live readings as 02-test-stream.py, but on the GC9B72 round display
# instead of (or as well as) the console. See config.py for wiring - the
# display shares no pins with the sensor, so both halves of this kit can be
# wired up at once.
NAME = "04-display-imu.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

# Checkpoint prints below: if this script hangs or crashes, the last
# checkpoint printed tells you which stage failed instead of leaving you
# to guess from a blank screen. GC9B72.__init__() only turns the
# backlight on as its very last step, after ~50 register writes - a
# crash partway through that init looks identical to a backlight/wiring
# problem (screen stays fully dark) unless you can see where it stopped.
print("init I2C + sensors...")
i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)

gyro = L3GD20(i2c, config.GYRO_I2C_ADDRESS)
accel_mag = LSM303DLHC(i2c, config.ACCEL_I2C_ADDRESS, config.MAG_I2C_ADDRESS)
print("sensors OK")

print("init display...")
display = config.init_display()
print("display OK")
display.fill(config.BLACK)


def centered_x(text, font):
    return config.DISPLAY_CENTER_X - (len(text) * font.WIDTH) // 2


TITLE = "9-DOF IMU"
display.text(config.BIG_FONT, TITLE, centered_x(TITLE, config.BIG_FONT), 50,
             config.WHITE, config.BLACK)

UNITS = "gyro dps  accel g  mag G"
display.text(config.SMALL_FONT, UNITS, centered_x(UNITS, config.SMALL_FONT), 110,
             config.CYAN, config.BLACK)

GYRO_Y = 150
ACCEL_Y = 190
MAG_Y = 230
ROW_X = centered_x("GYR" + "-999.99" * 3, config.SMALL_FONT)

# Every formatted row is the same fixed width, so redrawing it each loop
# paints over the old digits in place (text() fills every glyph cell,
# on bits or not) - no separate erase step, and no full-screen fill()
# every frame, which would flicker on a driver with no frame buffer.
try:
    while True:
        gx, gy, gz = gyro.read_dps()
        ax, ay, az = accel_mag.read_accel_g()
        mx, my, mz = accel_mag.read_mag_gauss()

        display.text(config.SMALL_FONT, "GYR{:7.2f}{:7.2f}{:7.2f}".format(gx, gy, gz),
                     ROW_X, GYRO_Y, config.GREEN, config.BLACK)
        display.text(config.SMALL_FONT, "ACC{:7.2f}{:7.2f}{:7.2f}".format(ax, ay, az),
                     ROW_X, ACCEL_Y, config.YELLOW, config.BLACK)
        display.text(config.SMALL_FONT, "MAG{:7.2f}{:7.2f}{:7.2f}".format(mx, my, mz),
                     ROW_X, MAG_Y, config.MAGENTA, config.BLACK)

        time.sleep_ms(200)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
