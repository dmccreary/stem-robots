import config

# Display-only smoke test: no I2C, no sensor drivers, nothing but the
# GC9B72. If this doesn't show "Hello World!" on screen, the problem is in
# the display wiring/driver, not the sensor half of this kit - run this
# before chasing anything in 04-display-imu.py.
NAME = "display-hello-test.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

print("init display...")
display = config.init_display()
print("display OK")

display.fill(config.BLACK)

TEXT = "Hello World!"
x = config.DISPLAY_CENTER_X - (len(TEXT) * config.BIG_FONT.WIDTH) // 2
y = config.DISPLAY_CENTER_Y - config.BIG_FONT.HEIGHT // 2
display.text(config.BIG_FONT, TEXT, x, y, config.WHITE, config.BLACK)

print("Drew \"{}\" - check the display.".format(TEXT))
print("TEST PASS - if you don't see it, see the Troubleshooting section in README.md")
