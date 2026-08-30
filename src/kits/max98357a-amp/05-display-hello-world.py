import config

# GC9A01 round display wiring (see config.py):
#   SCK/CLK -> GPIO2, MOSI/Data -> GPIO3, DC -> GPIO4, CS -> GPIO5,
#   RST -> GPIO6, VCC -> Pico 3V3, GND -> Pico GND.
#
# Confirms the display is wired correctly and MicroPython can draw on it.
# There is no frame buffer on this driver - text() writes straight to the
# glass, so there is no show() to call afterwards.
display = config.init_display()

display.fill(config.DISPLAY_BLACK)

# Center-ish: the 8x16 font is 8px wide, so 12 characters is 96px - offset
# from the left edge to roughly center it on the 240px-wide screen.
display.text(config.DISPLAY_FONT, "Hello World!", 72, 112,
             config.DISPLAY_WHITE, config.DISPLAY_BLACK)

print("Done - check the display.")
