from machine import Pin, SPI
import ssd1306

# from OLED display bottom to top
SCL = Pin(2)
SDA = Pin(3)
RES = Pin(4)
DC  = Pin(5)
CS  = Pin(6)

# Hardware SPI
spi=machine.SPI(0, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

oled.fill(0)
oled.text("Hello World!", 0, 0)
oled.show()
print('Done')