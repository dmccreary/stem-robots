# Hardware configuration for the Cytron Maker Pi RP2040
# Line Follower Bot: motors, a speaker, and two digital IR line sensors.

# ---------------------------------------------------------------------------
# Motor driver (H-bridge on GP8-GP11)
# ---------------------------------------------------------------------------
RIGHT_FORWARD_PIN = 11
RIGHT_REVERSE_PIN = 10
LEFT_FORWARD_PIN = 8
LEFT_REVERSE_PIN = 9
MAX_POWER_LEVEL = 65025

# ---------------------------------------------------------------------------
# Piezo speaker
# ---------------------------------------------------------------------------
SPEAKER_PIN = 22

# ---------------------------------------------------------------------------
# IR line sensors (digital, active LOW: 0 = over a light/white surface that
# reflects the IR back, 1 = over a dark/black line that absorbs it)
# ---------------------------------------------------------------------------
RIGHT_SENSOR_PIN = 2
LEFT_SENSOR_PIN = 4
