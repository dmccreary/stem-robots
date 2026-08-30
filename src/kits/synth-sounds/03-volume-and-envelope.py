# Lesson 3: getting volume out of a pin that only knows on and off.
#
# The pin has two states, so it cannot be "half on". Instead we change how
# much of each cycle it spends switched on - the duty cycle. A pin that is
# on for half of every cycle delivers the most power and sounds loudest. A
# pin on for only a sliver of each cycle delivers little and sounds quiet.
# The pitch never changes, because the switching rate never changes.
#
# The shape of a sound's volume over time is called its envelope, and it
# matters as much as pitch. The same 800 Hz tone can be a knock, a chirp,
# or an alarm depending only on how its volume rises and falls.

import time
import r2d2

print("Same pitch, six volumes")
for volume in (100, 80, 60, 40, 20, 10):
    r2d2.tone(800, 180, volume)
    time.sleep_ms(60)

time.sleep_ms(400)

print("Same pitch, three envelopes")

# Sharp attack, long fade: a pluck.
r2d2.glide(800, 800, 400, 100, 0)
time.sleep_ms(250)

# Slow swell, sharp cut: a warning.
r2d2.glide(800, 800, 400, 0, 100)
time.sleep_ms(250)

# Fade in and back out: a passing hum.
r2d2.glide(800, 800, 200, 0, 100)
r2d2.glide(800, 800, 200, 100, 0)

r2d2.end()
print("Done.")
