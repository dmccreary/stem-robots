import machine
import struct
import time
import config

# Lab 04: Get Compass Values (One-Shot)
# Reads the HMC5883L once and prints X, Y, Z, then exits - no loop. Run
# this after the I2C scanner (lab 03) confirms the chip is on the bus.
# Later labs stream these same three numbers continuously; this one is
# about seeing the raw values just once, without text scrolling past.

# The HMC5883L's hardware I2C reads on this Pico return OSError 5 (EIO)
# even though a scan (lab 03) finds the chip fine - a clock-stretching
# quirk with this chip on the RP2040's hardware I2C peripheral.
# machine.SoftI2C (bit-banged) reads it reliably instead.
i2c = machine.SoftI2C(scl=machine.Pin(config.I2C_SCL_PIN),
                       sda=machine.Pin(config.I2C_SDA_PIN), freq=400000)

# 8-sample average, 15 Hz output rate, normal measurement
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_A, bytes([0x70]))
# Gain = 5 (default), +/-1.3 Ga range, 1090 LSB/Gauss
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.CONFIG_B, bytes([0x20]))
# Single-measurement mode: the chip takes one reading and goes back to
# idle on its own, which matches what this one-shot lab needs better
# than continuous mode does.
i2c.writeto_mem(config.HMC5883L_ADDRESS, config.MODE, bytes([0x01]))
time.sleep_ms(100)  # let the one measurement finish

# Data registers are ordered X, Z, Y (not X, Y, Z)
data = i2c.readfrom_mem(config.HMC5883L_ADDRESS, config.DATA_START, 6)
x, z, y = struct.unpack(">hhh", data)

print("X:", x)
print("Y:", y)
print("Z:", z)
