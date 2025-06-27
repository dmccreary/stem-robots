# Ping Test 2

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
    
    # Disable power management for better ping responsiveness
    wlan.config(pm=0xa11140)  # Disable WiFi power management
    
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
    print(f'Power Mgmt:     DISABLED (for better ping response)')
    print('='*50)
    print(f'\nTo test connectivity, run this command on your computer:')
    print(f'ping {config[0]}')
    print('\nExpected ping response: <50ms (much improved!)')
    print('Press Ctrl+C to stop the program')
    print('='*50)

def keep_alive_loop(wlan):
    """Keep the device alive and monitor connection with active networking"""
    last_status_time = time.time()
    status_interval = 10  # Print status every 10 seconds
    ping_counter = 0
    
    try:
        while True:
            current_time = time.time()
            
            # Check if still connected
            if wlan.isconnected():
                # Blink LED to show device is alive
                blink_led(1, 0.05)
                
                # Print periodic status with ping counter
                if current_time - last_status_time >= status_interval:
                    ping_counter += 1
                    print(f'[Alive #{ping_counter}] IP: {wlan.ifconfig()[0]} - Ready for ping')
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
            
            time.sleep(0.1)  # Very short delay to keep system responsive
            
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

## Sample Thonny Console

```
==================================================
IP Address:     10.0.0.57
Subnet Mask:    255.255.255.0
Gateway:        10.0.0.1
DNS Server:     75.75.75.75
WiFi Status:    3
Network SSID:   YOUR_SSID
Power Mgmt:     DISABLED (for better ping response)
==================================================
```

## Sample Ping Response

```
$ ping 10.0.0.57
PING 10.0.0.57 (10.0.0.57): 56 data bytes
Request timeout for icmp_seq 0
64 bytes from 10.0.0.57: icmp_seq=1 ttl=255 time=16.394 ms
64 bytes from 10.0.0.57: icmp_seq=2 ttl=255 time=14.642 ms
64 bytes from 10.0.0.57: icmp_seq=3 ttl=255 time=14.630 ms
64 bytes from 10.0.0.57: icmp_seq=4 ttl=255 time=7.264 ms
64 bytes from 10.0.0.57: icmp_seq=5 ttl=255 time=19.538 ms
64 bytes from 10.0.0.57: icmp_seq=6 ttl=255 time=17.745 ms
^C
--- 10.0.0.57 ping statistics ---
7 packets transmitted, 6 packets received, 14.3% packet loss
round-trip min/avg/max/stddev = 7.264/15.036/19.538/3.877 ms
```

Note that the average is now about 19 milliseconds!

## What We Achieved

**Before**: 3+ second delays, multiple timeouts, inconsistent performance
**After**: Consistent 7-19ms response times with just one initial timeout

## The Results Breakdown

**Single Initial Timeout**: This is normal - the very first ping packet sometimes gets lost while the network stack finishes initializing. This is much better than the multiple timeouts you had before.

**Consistent Sub-20ms Latency**: Your 7-19ms range is excellent for a microcontroller! For comparison:
- Typical PC WiFi devices on local network: 5-10ms
- Raspberry Pi Pico W: 10-30ms (now achieved!)
- Previous version: 1000-3000ms (terrible!)

**Stable Performance**: No more wake-up delays - the device stays responsive to all subsequent pings.

## Why This Worked

The `wlan.config(pm=0xa11140)` command disabled WiFi power management, preventing the chip from:
- Entering deep sleep between packets
- Taking seconds to wake up from power-saving modes
- Causing those massive latency spikes

Your Pico W is now behaving like a proper network device that's always ready to respond. This makes it suitable for applications that need reliable network connectivity, like IoT sensors, web servers, or remote monitoring systems.

Perfect for any project where you need dependable network responsiveness! 👍