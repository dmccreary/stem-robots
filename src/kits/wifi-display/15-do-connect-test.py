# From this: https://docs.micropython.org/en/latest/rp2/quickref.html#networking

import machine, network
import secrets

def do_connect():
    
    wlan = network.WLAN()
    wlan.active(True)
    # Disable power management for better ping responsiveness
    wlan.config(pm=0xa11140)  # Disable WiFi power management
    
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(secrets.SSID, secrets.PASSWORD)
        while not wlan.isconnected():
            machine.idle()
    print('IP Address:', wlan.ipconfig('addr4')[0])
    
print("Test of do_connect in low power mode where the network stack must be rebuilt for each ping")
do_connect()