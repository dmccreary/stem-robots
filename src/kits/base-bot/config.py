# Hardware configuration for the Cytron Maker Pi RP2040
# Base Bot: motors, NeoPixels, speaker, and a VL53L0X time-of-flight sensor.
# Every lab in this folder imports this file instead of repeating pin
# numbers, so the whole kit only needs to be described in one place.

# ---------------------------------------------------------------------------
# Motor driver (H-bridge on GP8-GP11)
# ---------------------------------------------------------------------------
RIGHT_FORWARD_PIN = 9
RIGHT_REVERSE_PIN = 8
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11
MOTOR_PWM_FREQUENCY = 50
MAX_POWER_LEVEL = 65025

# ---------------------------------------------------------------------------
# NeoPixel LEDs
# ---------------------------------------------------------------------------
NEOPIXEL_PIN = 18
NUMBER_NEOPIXELS = 2

# ---------------------------------------------------------------------------
# Piezo speaker
# ---------------------------------------------------------------------------
SPEAKER_PIN = 22

# ---------------------------------------------------------------------------
# Servo (optional) - Maker Pi RP2040 servo header 1. The base-bot labs don't
# use a servo; this is the pin the textbook's servo examples expect.
# The board's four servo headers are GP12-GP15.
# ---------------------------------------------------------------------------
SERVO_PIN = 12

# ---------------------------------------------------------------------------
# I2C bus 0 - VL53L0X time-of-flight distance sensor
# ---------------------------------------------------------------------------
I2C_BUS = 0
I2C_SDA_PIN = 16
I2C_SCL_PIN = 17
TIME_OF_FLIGHT_I2C_ADDRESS = 41
