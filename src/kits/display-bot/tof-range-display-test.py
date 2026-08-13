# Test program for VL53L0X
import time
from machine import Pin, I2C
import ssd1306
import VL53L0X
import config

sda=machine.Pin(config.I2C_SDA_PIN)
scl=machine.Pin(config.I2C_SCL_PIN)
i2c=machine.I2C(config.I2C_BUS,sda=sda, scl=scl, freq=400000)

WIDTH = config.DISPLAY_WIDTH
HEIGHT = config.DISPLAY_HEIGHT
SCK=machine.Pin(config.SCL_PIN)
SDL=machine.Pin(config.SDA_PIN)
spi=machine.SPI(config.SPI_BUS,baudrate=config.SPI_BAUDRATE,sck=SCK, mosi=SDL)
# servo pins
RES = machine.Pin(config.RES_PIN)
DC = machine.Pin(config.DC_PIN)
CS = machine.Pin(config.CS_PIN)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

tof = VL53L0X.VL53L0X(i2c)

tof.start()
minimum = 1000
maximum = 0
while True:
    dist = tof.read()
    
    # store max if under 8191
    if dist > maximum: 
        if dist < 8190:
            maximum = dist
            
    # store min
    if dist < minimum: 
        minimum = dist
    print(tof.read())
    oled.fill(0)
    oled.text("Time of Flight", 0, 0)
    oled.text("Sensor", 3, 10)
    oled.text("Raw:" + str(dist), 0, 20)
    oled.text("Max:" + str(maximum), 0, 30)
    oled.text("Min:" + str(minimum), 0, 40)
    oled.show()
    time.sleep(0.05)

# tof.stop()