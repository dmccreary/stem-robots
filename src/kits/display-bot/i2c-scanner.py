import machine
import config
sda=machine.Pin(config.I2C_SDA_PIN)
scl=machine.Pin(config.I2C_SCL_PIN)
i2c=machine.I2C(config.I2C_BUS,sda=sda, scl=scl, freq=400000)
print(i2c.scan())