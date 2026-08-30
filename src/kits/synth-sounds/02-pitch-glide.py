# Lesson 2: a glide is what makes a beep sound like a robot.
#
# A note that holds one pitch sounds like a microwave oven. A note that
# slides while it plays sounds alive. Sliding up reads as a question or as
# excitement; sliding down reads as disappointment. That is most of what
# gives R2-D2 his personality.

import time
import r2d2

print("Up - sounds curious")
r2d2.glide(400, 1200, 300)

time.sleep_ms(300)

print("Down - sounds disappointed")
r2d2.glide(1200, 400, 300)

time.sleep_ms(300)

# The real recorded "sad" sound is almost exactly this: start near 460 Hz,
# lift slightly, then sag away to 380 Hz while fading out. We measured those
# numbers from the recording; you are hearing the measurement played back.
print("The measured sad sound")
r2d2.glide(458, 477, 130, 30, 58)
r2d2.glide(477, 380, 380, 58, 27)
r2d2.glide(380, 386, 105, 27, 7)

r2d2.end()
print("Done.")
