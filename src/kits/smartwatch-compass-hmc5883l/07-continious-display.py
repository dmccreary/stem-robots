import machine
import struct
import time
import config

# Lab 07: Continuous Display
# Same three numbers as lab 06, but streamed - the HMC5883L runs in
# continuous-measurement mode and the screen redraws on every sample.
# Watch what happens to a number as you move a magnet, a speaker, or a
# steel tool near the sensor.

# The HMC5883L's hardware I2C reads on this Pico return OSError 5 (EIO)
# even though a scan (lab 03) finds the chip fine - a clock-stretching
# quirk with this chip on the RP2040's hardware I2C peripheral.
# machine.SoftI2C (bit-banged) reads it reliably instead.
i2c = machine.SoftI2C(scl=machine.Pin(config.I2C_SCL_PIN),
                       sda=machine.Pin(config.I2C_SDA_PIN), freq=400000)

i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_A, bytes([0x70]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_B, bytes([0x20]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x00]))  # continuous
time.sleep_ms(100)

display = config.init_display()


def read_xyz():
    data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z


# Three rows of the big 16x32 font, stacked and centered on CENTER_Y.
#
# Unlike lab 06, this redraws 10 times a second - and there is no frame
# buffer on this driver, so a naive display.fill(BLACK) every frame was
# sending all 57,600 pixels down the wire before the text went back on
# top, which reads as a full-screen strobe. Clearing once, up front, and
# then always drawing each value into the SAME fixed-width field lets
# text()'s own background color overwrite the previous digits directly -
# no clear, no flicker, and no leftover digit if a number gets shorter.
LABELS = ("X:", "Y:", "Z:")
ROW_Y = (64, 104, 144)
FIELD_WIDTH = 6  # digits + sign; HMC5883L values stay well inside this
LINE_LEN = len("X: ") + FIELD_WIDTH
TEXT_X = config.CENTER_X - (LINE_LEN * 16) // 2

display.fill(config.BLACK)

try:
    while True:
        x, y, z = read_xyz()
        for label, value, row_y in zip(LABELS, (x, y, z), ROW_Y):
            text = "%s %6d" % (label, value)  # old-style % - safer than
            # str.format's nested width spec on this board's MicroPython
            display.text(config.BIG_FONT, text, TEXT_X, row_y, config.WHITE, config.BLACK)
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
