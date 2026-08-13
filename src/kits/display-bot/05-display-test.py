import machine
import ssd1306
import config

SCK=machine.Pin(config.SCL_PIN)
SDL=machine.Pin(config.SDA_PIN)
spi=machine.SPI(config.SPI_BUS,sck=SCK, mosi=SDL)
CS = machine.Pin(config.CS_PIN)
DC = machine.Pin(config.DC_PIN)
RES = machine.Pin(config.RES_PIN)
oled = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RES, CS)

oled.fill(0)
oled.text('Hello World!', 0, 0)
oled.show()