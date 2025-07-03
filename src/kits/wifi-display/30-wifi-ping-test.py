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