# Lesson 5: press the button, hear the next sound.
#
# This is the capstone for the kit. Every press steps to the next R2-D2
# sound and plays it, then wraps around to the start. If you fitted the
# optional volume knob, it is read just before each sound plays.

from machine import ADC, Pin
import time
import config
import r2d2
import sounds

button = Pin(config.BUTTON_PIN, Pin.IN, Pin.PULL_UP)

pot = ADC(config.VOLUME_POT_PIN) if config.USE_VOLUME_KNOB else None


def read_volume():
    """Volume 0-100, either from the knob or the fixed setting in config."""
    if pot is None:
        return config.FIXED_VOLUME
    # read_u16() gives 0-65535. Halving the fraction's square root spreads
    # the knob's travel more evenly across what the ear actually hears -
    # without it, almost all of the useful range sits in the last quarter.
    fraction = pot.read_u16() / 65535
    return int(100 * (fraction ** 0.5))


index = 0
print("Ready. Press the button on GP{} to play a sound.".format(config.BUTTON_PIN))
print("{} sounds loaded. Ctrl-C to stop.".format(len(sounds.ALL)))

try:
    while True:
        if button.value() == 0:
            time.sleep_ms(config.DEBOUNCE_MS)
            if button.value() == 0:          # still down, so it was a real press
                name, recipe = sounds.ALL[index]
                index = (index + 1) % len(sounds.ALL)

                r2d2.set_volume(read_volume())
                print("{:2d}/{}  {}".format(index or len(sounds.ALL),
                                            len(sounds.ALL), name))
                r2d2.play(recipe)

                while button.value() == 0:   # wait for release before re-arming
                    time.sleep_ms(10)
        time.sleep_ms(10)
except KeyboardInterrupt:
    print("Got ctrl-c, stopping")
finally:
    r2d2.end()
    print("Done - audio pin released.")
