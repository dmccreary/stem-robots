# Display face with eye with gaze movement

from machine import Pin
from utime import sleep
import ssd1306
import VL53L0X
from neopixel import NeoPixel

WIDTH = 128
HEIGHT = 64
SCK=Pin(2)
SDL=Pin(3)
# servo pins
RES = machine.Pin(13)
DC = machine.Pin(14)
CS = machine.Pin(15)

spi=machine.SPI(0,baudrate=100000,sck=SCK, mosi=SDL)
oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

HALF_HEIGHT = HEIGHT >> 1
QUARTER_HEIGHT = HALF_HEIGHT >> 1
HALF_WIDTH = WIDTH >> 1
QUARTER_WIDTH = HALF_WIDTH >> 1
ONE_THIRD_HEIGHT = int(HEIGHT/3)

# draw readability
ON = 1
OFF = 0
NO_FILL = 0
FILL = 1
phm = 18 # pupal horizontal movement range 
eye_dist_from_top = 21
eyeWidth = 27
eyeHeight = 10
mouth_vpos = 45
mouth_width = 40

def display_face_eye(i):
    oled.fill(0)

    # left eye
    oled.ellipse(32, eye_dist_from_top, eyeWidth, eyeHeight, ON, FILL)
    oled.ellipse(32+i, eye_dist_from_top, 5, 5, OFF, FILL)

    # right eye
    oled.ellipse(94, eye_dist_from_top, eyeWidth, eyeHeight, ON, FILL)
    oled.ellipse(94+i, eye_dist_from_top, 5, 5, OFF, FILL)

    # draw mouth
    # draw bottom half by doing a bitwise and of 8 and 4
    oled.ellipse(HALF_WIDTH, mouth_vpos, mouth_width, 10, ON, NO_FILL, 12)
    oled.show()

while True:
    display_face_eye(0)
    sleep(1)
    # look forward
    for i in range(0, 23):
        display_face_eye(i)
        sleep(0.05)
    # gaze to the right
    for i in range(23, -22, -1):
        display_face_eye(i)
        sleep(0.05)
    # gaze to the left
    for i in range(-22, 0):
        display_face_eye(i)
        sleep(0.05)