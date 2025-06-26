import machine
I2C_SDA_PIN = 16
I2C_SCL_PIN = 17
I2C_BUS = 0

sda=machine.Pin(I2C_SDA_PIN)
scl=machine.Pin(I2C_SCL_PIN)
i2c=machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of devices that have been found
# i2c.scan()[0] is the first device found
device_id = i2c.scan()[0]
print("Device found at decimal", device_id)

if device_id == 41:
    print("TEST PASS - we found the time of flight scanner at 41")
else:
    print("No device found at decimal 41")
    print("TEST FAIL")