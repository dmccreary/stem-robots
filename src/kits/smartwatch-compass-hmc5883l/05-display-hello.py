import config

# Lab 05: Display Hello World
# Confirms the GC9A01 is wired correctly and MicroPython can draw on it.
# No compass needed for this one - it is purely about getting text onto
# the round screen.
#
# There is no frame buffer on this driver - text() writes straight to
# the glass, so there is no show() to call afterwards.

display = config.init_display()
display.fill(config.BLACK)

# The big 16x32 font is 16px wide, so "Hello World!" (12 chars) is 192px
# wide - offset from the left edge to center it on the 240px screen, and
# from the top to center it vertically (font is 32px tall).
display.text(config.BIG_FONT, "Hello World!", 24, 104, config.WHITE, config.BLACK)

print("Done - check the display.")
