# Lesson 1: make one sound with one pin.
#
# A speaker makes noise when its cone moves back and forth. To move it, we
# switch one GPIO pin between 3.3 volts and 0 volts over and over. Switch it
# 440 times a second and you hear the note A. That is the whole idea.

import time
import r2d2

print("Playing three notes...")

r2d2.tone(440, 400)   # 440 Hz is the A that orchestras tune to
time.sleep_ms(150)

r2d2.tone(880, 400)   # twice the frequency sounds one octave higher
time.sleep_ms(150)

r2d2.tone(220, 400)   # half the frequency sounds one octave lower

r2d2.end()            # release the pin so the next script can use it
print("Done.")
