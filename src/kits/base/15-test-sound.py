from machine import Pin, PWM
from utime import sleep

SPEAKER_PIN = 22

speaker = PWM(SPEAKER_PIN)

def playnote(frequency, time):
    speaker.duty_u16(1000)
    setfreq(frequency)
    sleep(time)

def play_no_signal():
    playnote(100, 0.1)
    sound_off()

def play_turn():
    playnote(500, .1)
    sound_off()

def setfreq(frequency):
    speaker.freq(frequency)

def sound_off():
    speaker.duty_u16(0)

def rest(time):
    speaker.duty_u16(0)
    sleep(time)

def play_startup():
    playnote(600, .1)
    rest(.05)
    playnote(600, .1)
    rest(.05)
    playnote(600, .1)
    rest(.1)
    playnote(800, .5)
    sound_off()

play_startup()