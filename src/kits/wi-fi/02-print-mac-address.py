import network
import ubinascii

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
mac = ubinascii.hexlify(network.WLAN().config('mac'),':').decode()
print("mac address:", mac)

# Other things you can query
print("channel:", wlan.config('channel'))
print("ssid:", wlan.config('essid'))
print("txpower:", wlan.config('txpower'))