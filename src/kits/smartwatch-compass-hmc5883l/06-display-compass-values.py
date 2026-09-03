import machine
import struct
import time
import config

# Lab 06: Display Compass Values (One-Shot)
# Combines labs 04 and 05: reads the HMC5883L once and shows X, Y, Z as
# three integers on the round display, then stops. Both the I2C wiring
# (GPIO12/13) and the display wiring (GPIO2-6) have to be correct for
# this one to work.

# The HMC5883L's hardware I2C reads on this Pico return OSError 5 (EIO)
# even though a scan (lab 03) finds the chip fine - a clock-stretching
# quirk with this chip on the RP2040's hardware I2C peripheral.
# machine.SoftI2C (bit-banged) reads it reliably instead.
i2c = machine.SoftI2C(scl=machine.Pin(config.I2C_SCL_PIN),
                       sda=machine.Pin(config.I2C_SDA_PIN), freq=400000)

i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_A, bytes([0x70]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_B, bytes([0x20]))
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x01]))  # single-shot
time.sleep_ms(100)

data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
x, z, y = struct.unpack(">hhh", data)

display = config.init_display()
display.fill(config.BLACK)
# Three rows of the big 16x32 font, stacked and centered on CENTER_Y.
ROW_Y = (64, 104, 144)
lines = ("X: {}".format(x), "Y: {}".format(y), "Z: {}".format(z))
for text, row_y in zip(lines, ROW_Y):
    text_x = config.CENTER_X - (len(text) * 16) // 2
    display.text(config.BIG_FONT, text, text_x, row_y, config.WHITE, config.BLACK)

print("X:", x, "Y:", y, "Z:", z)
print("Done - check the display.")
