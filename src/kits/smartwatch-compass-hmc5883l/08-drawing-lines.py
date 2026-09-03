import config
from math import sin, cos, radians
from utime import ticks_us, ticks_diff, sleep_ms

# Lab 08: Drawing Lines - Rectangular vs. Circular
# Two ways to fill this round screen with lines, timed against each
# other:
#
#   GRID    a rectangular pattern of axis-aligned lines, drawn with
#           hline()/vline(). Each call sends one straight run of pixels.
#   SPOKES  a circular pattern of lines radiating from the center,
#           drawn with line(). Every spoke is a general diagonal line,
#           which this driver has to walk one step at a time - there is
#           no "run" to send in one piece.
#
# Same number of lines (24 each), drawn two different ways. Cycles
# between the two patterns forever, showing the measured draw time in
# microseconds after each one.

display = config.init_display()
WHITE = config.WHITE
BLACK = config.BLACK

GRID_SPACING = 20   # 240 / 20 = 12 vlines + 12 hlines = 24 lines
SPOKE_COUNT = 24
REPEATS = 3


def draw_grid():
    display.fill(BLACK)
    for x in range(0, config.WIDTH, GRID_SPACING):
        display.vline(x, 0, config.HEIGHT, WHITE)
    for y in range(0, config.HEIGHT, GRID_SPACING):
        display.hline(0, y, config.WIDTH, WHITE)


def draw_spokes():
    display.fill(BLACK)
    cx, cy, r = config.CENTER_X, config.CENTER_Y, config.SAFE_RADIUS
    for i in range(SPOKE_COUNT):
        angle = radians(360 * i / SPOKE_COUNT)
        x = cx + int(r * sin(angle))
        y = cy - int(r * cos(angle))
        display.line(cx, cy, x, y, WHITE)


def time_drawing(draw, repeats):
    draw()  # warm-up, not counted
    started = ticks_us()
    for _ in range(repeats):
        draw()
    return ticks_diff(ticks_us(), started) // repeats


def show_result(label, microseconds):
    display.fill(BLACK)
    display.text(config.FONT, label, 60, 96, WHITE, BLACK)
    display.text(config.FONT, "{} us".format(microseconds), 52, 128, WHITE, BLACK)


try:
    while True:
        draw_grid()
        sleep_ms(1000)
        grid_us = time_drawing(draw_grid, REPEATS)
        show_result("GRID", grid_us)
        print("grid  :", grid_us, "us")
        sleep_ms(2000)

        draw_spokes()
        sleep_ms(1000)
        spokes_us = time_drawing(draw_spokes, REPEATS)
        show_result("SPOKES", spokes_us)
        print("spokes:", spokes_us, "us")
        sleep_ms(2000)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")

# Things to try:
#
# 1. Predict which pattern wins before you run it, then check the
#    numbers on the display.
#
# 2. Change GRID_SPACING to 10 (48 lines) and SPOKE_COUNT to 48 to keep
#    the comparison fair, and see whether the ratio between them stays
#    about the same.
