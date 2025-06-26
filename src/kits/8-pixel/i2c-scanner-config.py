import machine
import config

sda=machine.Pin(config.TOF_SDA_PIN) # row one on our standard Pico breadboard
scl=machine.Pin(config.TOF_SCL_PIN) # row two on our standard Pico breadboard
i2c=machine.I2C(config.TOF_I2C_BUS, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of devices that have been found
# i2c.scan()[0] is the first device found
device_id_list = i2c.scan()
first_i2c_device = device_id_list[0]

print('I2C bus 0 found device at: ', first_i2c_device)

if first_i2c_device == 41:
    print('PASS')
    print('hex:',hex(first_i2c_device))
else:
    print('FAIL')