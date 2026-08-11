import machine
import struct
import time

# HMC5883L wiring:
#   VCC  -> Pico 3.3V OUT (pin 36)
#   GND  -> Pico GND (pin 13)
#   SDA  -> GPIO10 (I2C1 SDA)
#   SCL  -> GPIO11 (I2C1 SCL)
#
# Load this file onto the Pico with Thonny and run it (F5). Open
# View > Plotter in Thonny to see the X/Y/Z readings graphed live as
# three separate lines.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
HMC5883L_ADDRESS = 0x1E

CONFIG_A = 0x00
CONFIG_B = 0x01
MODE = 0x02
DATA_START = 0x03

sda = machine.Pin(I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl = machine.Pin(I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# 8-sample average, 15 Hz output rate, normal measurement
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_A, bytes([0x70]))
# Gain = 5 (default), +/-1.3 Ga range, 1090 LSB/Gauss
i2c.writeto_mem(HMC5883L_ADDRESS, CONFIG_B, bytes([0x20]))
# Continuous-measurement mode
i2c.writeto_mem(HMC5883L_ADDRESS, MODE, bytes([0x00]))
time.sleep_ms(100)

# Data registers are ordered X, Z, Y (not X, Y, Z)
def read_xyz():
    data = i2c.readfrom_mem(HMC5883L_ADDRESS, DATA_START, 6)
    x, z, y = struct.unpack(">hhh", data)
    return x, y, z

try:
    while True:
        x, y, z = read_xyz()
        print(x, y, z)
        time.sleep_ms(100)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
