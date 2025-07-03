from machine import Pin, SPI
import ssd1306
import config

SCL=Pin(config.SCL_PIN)
SDA=Pin(config.SDA_PIN)
RES = Pin(config.RES_PIN)
DC = Pin(config.DC_PIN)
CS = Pin(config.CS_PIN)

spi=machine.SPI(config.SPI_BUS, baudrate=100000, sck=SCL, mosi=SDA)
display = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RES, CS)


display.fill(0)
display.text("Hello World!", 0, 0)
display.show()
print('Done')