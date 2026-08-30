# Hardware configuration for the Synth Sounds kit.
# This kit makes R2-D2 style robot sounds with no audio chip at all - just
# one PWM pin, a two-part filter, and a small class-D amplifier board.
# Every lesson in this folder imports this file instead of repeating pin
# numbers, so the whole kit only needs to be described in one place.

# ---------------------------------------------------------------------------
# Audio output
# ---------------------------------------------------------------------------
# One GPIO pin carries the whole sound. The Pico switches it on and off
# thousands of times a second; the resistor and capacitor below average
# those switches back into a smooth wave the amplifier can use.
#
#   GPIO 0 ---[ 1k ohm ]---+---[ 10 uF ]---> PAM8403 L input
#                       |
#                   [ 33 nF ]
#                       |
#                      GND
#
# The 1k + 33 nF pair is a low-pass filter that rounds off the square edges
# (it starts cutting at about 4.8 kHz). The 10 uF capacitor blocks the
# steady voltage so only the changing part - the sound - reaches the amp.
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
FIXED_VOLUME = 80

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
