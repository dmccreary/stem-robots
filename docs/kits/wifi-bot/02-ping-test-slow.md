# Ping Test

Here is a more detailed program that will give use feedback.

## Source Code

```python
import network
import secrets
import time
from machine import Pin

# Optional: Use onboard LED for status indication
led = Pin("LED", Pin.OUT)

def blink_led(times=1, delay=0.2):
    """Blink the onboard LED for status indication"""
    for _ in range(times):
        led.on()
        time.sleep(delay)
        led.off()
        time.sleep(delay)

def connect_wifi(max_retries=10):
    """Connect to WiFi with retry logic"""
    print(f'Connecting to WiFi Network: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    print('Powering up WiFi chip...')
    time.sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            # Wait for connection with timeout
            timeout = 15  # seconds
            start_time = time.time()
            
            while not wlan.isconnected() and (time.time() - start_time) < timeout:
                time.sleep(1)
                print('.', end='')
            
            print()  # New line after dots
            
            if wlan.isconnected():
                return wlan
            else:
                print(f'Timeout on attempt {retry_count + 1}')
                retry_count += 1
                time.sleep(2)
                
        except Exception as e:
            print(f'Error on attempt {retry_count + 1}: {e}')
            retry_count += 1
            time.sleep(2)
    
    return None

def display_network_info(wlan):
    """Display detailed network information"""
    config = wlan.ifconfig()
    status = wlan.status()
    
    print('\n' + '='*50)
    print('NETWORK CONNECTION SUCCESSFUL!')
    print('='*50)
    print(f'IP Address:     {config[0]}')
    print(f'Subnet Mask:    {config[1]}')
    print(f'Gateway:        {config[2]}')
    print(f'DNS Server:     {config[3]}')
    print(f'WiFi Status:    {status}')
    print(f'Network SSID:   {secrets.SSID}')
    print('='*50)
    print(f'\nTo test connectivity, run this command on your computer:')
    print(f'ping {config[0]}')
    print('\nPress Ctrl+C to stop the program')
    print('='*50)

def keep_alive_loop(wlan):
    """Keep the device alive and monitor connection"""
    last_status_time = time.time()
    status_interval = 30  # Print status every 30 seconds
    
    try:
        while True:
            current_time = time.time()
            
            # Check if still connected
            if wlan.isconnected():
                # Blink LED to show device is alive
                blink_led(1, 0.1)
                
                # Print periodic status
                if current_time - last_status_time >= status_interval:
                    print(f'[{time.ticks_ms()}ms] Device alive - IP: {wlan.ifconfig()[0]}')
                    last_status_time = current_time
                    
            else:
                print('WiFi connection lost! Attempting to reconnect...')
                blink_led(3, 0.2)  # Fast blinks for error
                wlan = connect_wifi()
                if wlan:
                    display_network_info(wlan)
                else:
                    print('Failed to reconnect. Restarting in 10 seconds...')
                    time.sleep(10)
                    continue
            
            time.sleep(1)  # Short delay to prevent excessive CPU usage
            
    except KeyboardInterrupt:
        print('\nProgram stopped by user')
        led.off()
    except Exception as e:
        print(f'Unexpected error: {e}')
        blink_led(5, 0.1)  # Error indication

def main():
    """Main program function"""
    print('Raspberry Pi Pico W - Enhanced Ping Test')
    print('========================================')
    
    # Initial LED indication
    blink_led(2, 0.5)
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    if wlan:
        display_network_info(wlan)
        blink_led(3, 0.2)  # Success indication
        keep_alive_loop(wlan)
    else:
        print('\nFAILED TO CONNECT!')
        print('Check your secrets.py file for correct SSID and PASSWORD')
        print('Ensure your WiFi network is available and credentials are correct')
        blink_led(10, 0.1)  # Error indication

if __name__ == '__main__':
    main()
```

## Thonny Console

```
To test connectivity, run this command on your computer:
ping 10.0.0.57

Press Ctrl+C to stop the program
==================================================
[905892ms] Device alive - IP: 10.0.0.57
[935923ms] Device alive - IP: 10.0.0.57
[965953ms] Device alive - IP: 10.0.0.57
[995982ms] Device alive - IP: 10.0.0.57
```

## UNIX Ping

```
$ ping 10.0.0.57
PING 10.0.0.57 (10.0.0.57): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
64 bytes from 10.0.0.57: icmp_seq=1 ttl=255 time=2741.073 ms
64 bytes from 10.0.0.57: icmp_seq=2 ttl=255 time=1740.994 ms
64 bytes from 10.0.0.57: icmp_seq=3 ttl=255 time=740.691 ms
Request timeout for icmp_seq 6
64 bytes from 10.0.0.57: icmp_seq=4 ttl=255 time=3689.621 ms
64 bytes from 10.0.0.57: icmp_seq=5 ttl=255 time=2688.303 ms
64 bytes from 10.0.0.57: icmp_seq=6 ttl=255 time=1685.861 ms
64 bytes from 10.0.0.57: icmp_seq=7 ttl=255 time=683.353 ms
64 bytes from 10.0.0.57: icmp_seq=8 ttl=255 time=3668.818 ms
64 bytes from 10.0.0.57: icmp_seq=9 ttl=255 time=2670.315 ms
64 bytes from 10.0.0.57: icmp_seq=10 ttl=255 time=1670.126 ms
64 bytes from 10.0.0.57: icmp_seq=11 ttl=255 time=668.585 ms
64 bytes from 10.0.0.57: icmp_seq=12 ttl=255 time=3698.265 ms
64 bytes from 10.0.0.57: icmp_seq=13 ttl=255 time=2697.344 ms
64 bytes from 10.0.0.57: icmp_seq=14 ttl=255 time=1696.499 ms
64 bytes from 10.0.0.57: icmp_seq=15 ttl=255 time=693.715 ms
64 bytes from 10.0.0.57: icmp_seq=16 ttl=255 time=3641.492 ms
64 bytes from 10.0.0.57: icmp_seq=17 ttl=255 time=2640.483 ms
64 bytes from 10.0.0.57: icmp_seq=18 ttl=255 time=1637.462 ms
64 bytes from 10.0.0.57: icmp_seq=19 ttl=255 time=636.293 ms
^C
--- 10.0.0.57 ping statistics ---
24 packets transmitted, 19 packets received, 20.8% packet loss
round-trip min/avg/max/stddev = 636.293/2104.700/3698.265/1089.064 ms
```

No, this is not ideal since the average respons time is 3600 millisecond (3.6) seconds.
However, it's common for microcontrollers like the Pico W which by default goes into "deep sleep" between pings.

What you're seeing indicates the device is entering power-saving modes between network activity. Here's what's happening:

What Those Results Mean

1. **Initial Timeouts:** The Pico W was likely in a deep sleep or power-saving mode and took time to "wake up" to network requests.
2. **High Initial Latency:** The extremely high response times (3+ seconds) show the WiFi chip and network stack were initializing/waking up.

In our next lab we will Disable WiFi Power Management to get under 20 millisecond response times.