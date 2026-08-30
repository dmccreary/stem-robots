import math
import time
from machine import ADC, Pin
import config

# 20K potentiometer wiring: wiper -> GP26 (ADC0), outer legs -> 3V3 and GND.
#
# Confirms the pot is wired correctly by drawing a blue ring around the
# edge of the round display, like an analog gauge: how far around the
# 360-degree ring the blue reaches tracks the pot position. Fully
# counter-clockwise (or clockwise, depending on which outer leg is on
# 3V3) should read near 0 and draw almost nothing; fully the other way
# should read near max and draw a complete ring.
#
# PERFORMANCE NOTES (three rounds of this):
#  1. display.line() calls pixel() in a loop, and every pixel() re-sends
#     a full SPI window-set command. Redrawing the whole ring on every
#     poll (v1) meant ~1800 tiny SPI transactions per update.
#  2. v2 only redrew the STEPS that changed since the last reading
#     instead of the whole ring - much less work per update, but each
#     spoke was still ~10 separate pixel() calls (~10 window-resets).
#  3. This version (v3) fills each spoke's bounding box with ONE
#     fill_rect() call instead of drawing it point-by-point. fill_rect()
#     sets the SPI window once and streams every pixel in the box in a
#     single batched write - the same trick vline()/hline() use
#     internally - so one spoke drops from ~10 window-resets to 1.
#     Tradeoff: a diagonal spoke's bounding box is a few pixels wider
#     than the exact 1px line would be, so on a shrink (erasing a spoke
#     back to black) it can shave 1-2px off the very edge of the
#     still-lit neighboring spoke. Not visible in practice at this size,
#     and it only happens right at the boundary of the current update.
pot = ADC(Pin(config.POT_PIN))

display = config.init_display()
display.fill(config.DISPLAY_BLACK)

CENTER_X = config.DISPLAY_WIDTH // 2
CENTER_Y = config.DISPLAY_HEIGHT // 2
RADIUS_OUTER = 116   # close to the bezel edge (screen radius is 120)
RADIUS_INNER = 106   # ring thickness = RADIUS_OUTER - RADIUS_INNER
ANGLE_STEP_DEG = 1
TOTAL_STEPS = 360 // ANGLE_STEP_DEG

# Precompute every spoke's fill_rect bounding box once at startup instead
# of redoing trig (and min/max) on every update.
SPOKE_RECTS = []
for step in range(TOTAL_STEPS):
    # -90 so step 0 points straight up (12 o'clock); increasing step
    # sweeps clockwise, like a speedometer.
    rad = math.radians(step * ANGLE_STEP_DEG - 90)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    x0 = CENTER_X + int(RADIUS_INNER * cos_a)
    y0 = CENTER_Y + int(RADIUS_INNER * sin_a)
    x1 = CENTER_X + int(RADIUS_OUTER * cos_a)
    y1 = CENTER_Y + int(RADIUS_OUTER * sin_a)
    rect_x = min(x0, x1)
    rect_y = min(y0, y1)
    rect_w = abs(x1 - x0) + 1
    rect_h = abs(y1 - y0) + 1
    SPOKE_RECTS.append((rect_x, rect_y, rect_w, rect_h))


def draw_spokes(start_step, end_step, color):
    for step in range(start_step, end_step):
        rect_x, rect_y, rect_w, rect_h = SPOKE_RECTS[step]
        display.fill_rect(rect_x, rect_y, rect_w, rect_h, color)


print("Turn the pot - the blue ring should grow and shrink smoothly.")
print("Ctrl-C to stop.")

current_step = 0
last_print_ms = time.ticks_ms()

try:
    while True:
        raw = pot.read_u16()  # 0-65535
        percent = raw / 65535
        target_step = int(percent * TOTAL_STEPS)

        if target_step > current_step:
            draw_spokes(current_step, target_step, config.DISPLAY_BLUE)
            current_step = target_step
        elif target_step < current_step:
            draw_spokes(target_step, current_step, config.DISPLAY_BLACK)
            current_step = target_step

        # Printing every update competes with display updates for time -
        # throttle it to a few times a second regardless of how often the
        # pot value actually changes.
        now = time.ticks_ms()
        if time.ticks_diff(now, last_print_ms) >= 150:
            print("raw={:5d}  percent={:5.1f}%".format(raw, percent * 100))
            last_print_ms = now
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
