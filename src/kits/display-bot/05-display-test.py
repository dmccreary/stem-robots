import machine
import ssd1306

SCK=machine.Pin(2)
SDL=machine.Pin(3)
spi=machine.SPI(0,sck=SCK, mosi=SDL)
CS = machine.Pin(15)
DC = machine.Pin(14)
RES = machine.Pin(13)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

oled.fill(0)
oled.text('Hello World!', 0, 0)
oled.show()