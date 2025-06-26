import machine
import VL53L0X
from time import sleep
import config

sda=machine.Pin(config.TOF_SDA_PIN) # row one on our standard Pico breadboard
scl=machine.Pin(config.TOF_SCL_PIN) # row two on our standard Pico breadboard
i2c=machine.I2C(config.TOF_I2C_BUS, sda=sda, scl=scl, freq=400000)

# i2c.scan() returns a list of devices that have been found
# i2c.scan()[0] is the first device found
device_id = i2c.scan()[0]
print("Device found at decimal", device_id)

if device_id == 41:
    print("TEST PASS")
    print("Device found at decimal 41")
    print('hex:',hex(device_id))
else:
    print("No device found at decimal 41")
    print("TEST FAIL")
    
# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c, address=0x29)
tof.start()

while True:
    tof.read()
    print(tof.read())
    sleep(0.2)
