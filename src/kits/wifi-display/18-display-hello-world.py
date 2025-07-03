from machine import Pin, SPI
import ssd1306

SCL=Pin(2)
SDA=Pin(3)
RES = Pin(4)
DC = Pin(5)
CS = Pin(6)

spi=machine.SPI(0, baudrate=100000, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# drawing code from here down
oled.fill(0)
oled.text("Hello World!", 0, 0)
oled.show()
print('Done')