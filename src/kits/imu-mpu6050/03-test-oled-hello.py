import config

# OLED wiring (SPI0), same pins as the compass-hmc5883l kit:
#   SCL (clock) -> GPIO2
#   SDA (MOSI)  -> GPIO3
#   RES         -> GPIO4
#   DC          -> GPIO5
#   CS          -> GPIO6
#
# Load this file onto the Pico with Thonny and run it (F5), or run
# headlessly with mpremote (requires config.py and lib/ssd1306.py to
# already be copied onto the Pico's filesystem, since mpremote run only
# transfers the one file you point it at). If wiring and SPI settings are
# correct, the display lights up with "Hello World".
oled = config.init_display()
oled.fill(config.BLACK)
oled.text("Hello World!", 15, 28, config.WHITE)
oled.show()
print('TEST PASS - if the OLED shows "Hello World!", wiring is correct')
