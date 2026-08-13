import machine
import config

I2C_SDA_PIN = config.I2C_SDA_PIN
I2C_SCL_PIN = config.I2C_SCL_PIN
I2C_BUS = config.I2C_BUS

sda=machine.Pin(I2C_SDA_PIN)
scl=machine.Pin(I2C_SCL_PIN)
i2c=machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of devices that have been found
# i2c.scan()[0] is the first device found
device_id = i2c.scan()[0]
print("Device found at decimal", device_id)

if device_id == config.TIME_OF_FLIGHT_I2C_ADDRESS:
    print("TEST PASS - we found the time of flight scanner at 41")
else:
    print("No device found at decimal 41")
    print("TEST FAIL")