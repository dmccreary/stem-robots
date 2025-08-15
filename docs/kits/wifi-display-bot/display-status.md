# Display Status

We can modify the wifi-bot to also display the the internal status of the robot.

## Display Startup Status

We can add the following function which will display only during
the connecting to the access point.  It will also show a counter
that shows how many times the connection has been started.

```python
def display_startup(counter):
    oled.fill(0)
    oled.text('Running startup', 0, 10, 1)
    oled.text('Connecting to', 0, 20, 1)
    oled.text(secrets.SSID, 0, 30, 1)
    oled.text(str(counter), 0, 40, 1)
    oled.show()
```

## Display Web Server Status

The following function can be used after the web server starts up.

```python
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

```