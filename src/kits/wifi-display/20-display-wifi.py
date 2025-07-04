# Display WiFi Stats
from machine import Pin
import network
import ssd1306
import secrets
from utime import sleep, ticks_ms, ticks_diff
import config

SCL=Pin(config.SCL_PIN)
SDA=Pin(config.SDA_PIN)
RES = Pin(config.RES_PIN)
DC = Pin(config.DC_PIN)
CS = Pin(config.CS_PIN)

spi=machine.SPI(config.SPI_BUS, baudrate=100000, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RES, CS)

oled.poweron()

def mac_address_fmt():
    mac_addess = wlan.config('mac')
    s=""
    for digit in range(0,5):
        s+=str(hex(mac_addess[digit]))[2:4] + ':'
    s+= hex(mac_addess[5])[2:4]
    return s

def display_startup(counter):
    oled.fill(0)
    oled.text('Running startup', 0, 10, 1)
    oled.text('Connecting to', 0, 20, 1)
    oled.text(secrets.SSID, 0, 30, 1)
    oled.text(str(counter), 0, 40, 1)
    oled.show()

def display_status(counter):
    oled.fill(0)
    # display the network name
    oled.text('n:' + secrets.SSID, 0, 0, 1)

    # display the connection time
    oled.text('t:', 0, 10, 1)
    oled.text(str(connection_time)+ ' ms', 15, 10, 1)

    # display the MAC address
    oled.text(mac_address_fmt(), 0, 20, 1)

    # display the IP address
    oled.text('ip:' + wlan.ifconfig()[0], 0, 30, 1)
    oled.text('c:' + str(counter), 0, 40, 1)
    oled.show()


# startup
led = Pin("LED", Pin.OUT)
led.on()

start = ticks_ms() # start a millisecond counter

print('Connecting to WiFi Network Name:', secrets.SSID)
wlan = network.WLAN(network.STA_IF)
wlan.active(True)

if not wlan.isconnected():
    # this should normally take 3-5 seconds...
    wlan.connect(secrets.SSID, secrets.PASSWORD)
    print("Waiting for connection...")
    counter = 0
    display_startup(counter)
    while not wlan.isconnected():
        sleep(1)
        counter += 1
        led.toggle()
        display_startup(counter)
        print(counter, '.', sep='', end='')

connection_time = ticks_diff(ticks_ms(), start)
mac_addess = wlan.config('mac')
print('Connected to', secrets.SSID)
print('Total connect milliseconds:', connection_time)

counter = 0
while True:
    led.toggle()
    counter += 1
    display_status(counter)
    sleep(1)
    print(counter, 'listening on', wlan.ifconfig()[0])