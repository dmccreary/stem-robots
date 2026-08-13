from machine import Pin
from utime import sleep
import config

RIGHT_SENSOR_PIN = config.RIGHT_SENSOR_PIN
LEFT_SENSOR_PIN = config.LEFT_SENSOR_PIN

right_sensor = Pin(RIGHT_SENSOR_PIN)
left_sensor = Pin(LEFT_SENSOR_PIN)

while True:
    r = right_sensor.value()
    l = left_sensor.value()
    print("r", r, "l=", l)
    if r == 0:
        print("right over white")
    if l == 0:
        print("left over white")
    sleep(.2)
