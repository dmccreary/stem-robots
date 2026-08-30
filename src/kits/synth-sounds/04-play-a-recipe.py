# Lesson 4: play the measured sounds.
#
# sounds.py holds one recipe per R2-D2 noise. A recipe is just a list of the
# glides from Lesson 2, one after another, with the numbers measured from
# the real recordings. Nothing new is happening here - only more of it.

import time
import r2d2
import sounds

r2d2.set_volume(80)

try:
    for name, recipe in sounds.ALL:
        # Each recipe is a list of segments, so len() tells us how many
        # glides it took to describe the whole sound.
        print("{:<22} {:2d} segments".format(name, len(recipe)))
        r2d2.play(recipe)
        time.sleep_ms(500)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
finally:
    r2d2.end()
    print("Done.")
