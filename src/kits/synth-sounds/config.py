# Hardware configuration for the Synth Sounds kit.
# This kit makes R2-D2 style robot sounds with no audio chip at all - just
# one PWM pin, a two-part filter, and a small mono amplifier board.
# Every lesson in this folder imports this file instead of repeating pin
# numbers, so the whole kit only needs to be described in one place.

# ---------------------------------------------------------------------------
# Audio output
# ---------------------------------------------------------------------------
# One GPIO pin carries the whole sound. The Pico switches it on and off
# thousands of times a second; the resistor and capacitor below average
# those switches back into a smooth wave the amplifier can use.
#
# Reference amplifier: a small XPT8871 mono module, 5 V in, no volume knob.
# synth-sounds-input-filter.svg is the drawn version of this.
#
#   GPIO 0 ---[ R1 1k ohm ]---+---[ C2 10 uF ]---> module IN
#                             |
#                  +----------+----------+
#                  |                     |
#            [ R2 100 ohm ]        [ C1 470 nF ]
#                  |                     |
#                 GND                   GND -----> module GND
#
# R1 and R2 divide the Pico's 3.3 V swing down to about 0.30 V peak to peak.
# That division is required, not a refinement: these modules have no volume
# knob, they expect a line-level input of roughly 0.2-0.3 V, and they amplify
# by about twenty. Fed a raw 3.3 V logic swing, the amplifier clips against
# its supply rails on most of the waveform, which you hear as a harsh buzz
# laid over the top of the sound.
#
# C1 then rounds off the square edges, cutting in from about 3.7 kHz. Note
# that it works against R1 and R2 in PARALLEL - only 91 ohms - not against R1
# on its own. Change either resistor and C1 has to change with it, or the
# filter quietly disappears.
#
# C2 blocks the steady voltage so only the changing part - the sound -
# reaches the amp. The module has an input capacitor of its own, so this one
# is belt and braces; leaving it in does no harm.
#
# WARNING - the speaker output is bridge-tied (BTL). Both speaker terminals
# swing and NEITHER one is ground. Do not wire either speaker terminal to
# GND, and do not clip a grounded scope probe onto one: that shorts half the
# bridge and can destroy the amplifier chip. The speaker connects across the
# two output terminals and to nothing else.
AUDIO_PIN = 0

# On a Cytron Maker Pi RP2040 you can skip the amplifier and the filter
# entirely: set AUDIO_PIN = 22 to drive the piezo buzzer already soldered to
# the board. Quieter and thinner, but it costs nothing and needs no wiring.
# CYTRON_BUZZER_PIN = 22

# ---------------------------------------------------------------------------
# Push button
# ---------------------------------------------------------------------------
# One leg to GP16, the other leg to GND. The Pico's internal pull-up holds
# the pin HIGH, so a press reads 0.
BUTTON_PIN = 15
DEBOUNCE_MS = 20

# ---------------------------------------------------------------------------
# Volume knob (optional)
# ---------------------------------------------------------------------------
# A potentiometer with its outer legs on 3V3 and GND and its wiper on GP26.
# Leave USE_VOLUME_KNOB False if you did not fit one; the kit then plays at
# FIXED_VOLUME instead.
USE_VOLUME_KNOB = False
VOLUME_POT_PIN = 26

# Full volume by default. The amplifier has no knob, so the divider on the
# audio pin sets how loud the speaker gets; running the software wide open
# then feeds the amplifier the largest clean signal it can have, which keeps
# the hiss of the amplifier itself as far below the sound as possible.
FIXED_VOLUME = 100

# ---------------------------------------------------------------------------
# Synth engine
# ---------------------------------------------------------------------------
# How often the pitch and volume are nudged during a glide. Smaller is
# smoother but leaves the Pico less time for anything else; 4 ms is well
# below what an ear can pick out as a step.
STEP_MS = 4

# The RP2040's PWM hardware cannot go arbitrarily low, and a tiny speaker
# cannot reproduce it anyway, so clamp anything below this.
MIN_FREQUENCY = 30
