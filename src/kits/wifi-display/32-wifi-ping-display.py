from machine import Pin, SPI
import network
import secrets
from time import sleep, time
import config

import ssd1306
SCL=Pin(config.SCL_PIN)
SDA=Pin(config.SDA_PIN)
RES = Pin(config.RES_PIN)
DC = Pin(config.DC_PIN)
CS = Pin(config.CS_PIN)

spi=SPI(config.SPI_BUS, baudrate=100000, sck=SCL, mosi=SDA)
display = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RES, CS)

# Optional: Use onboard LED for status indication
led = Pin("LED", Pin.OUT)

def blink_led(times=1, delay=0.2):
    """Blink the onboard LED for status indication"""
    for _ in range(times):
        led.on()
        sleep(delay)
        led.off()
        sleep(delay)

def connect_wifi(max_retries=10):
    """Connect to WiFi with retry logic"""
    print(f'Connecting to WiFi Network: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    # Disable power management for better ping responsiveness
    wlan.config(pm=0xa11140)  # Disable WiFi power management
    
    print('Powering up WiFi chip...')
    sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            # Wait for connection with timeout
            timeout = 15  # seconds
            start_time = time()
            
            while not wlan.isconnected() and (time() - start_time) < timeout:
                sleep(1)
                print('.', end='')
            
            print()  # New line after dots
            
            if wlan.isconnected():
                return wlan
            else:
                print(f'Timeout on attempt {retry_count + 1}')
                retry_count += 1
                sleep(2)
                
        except Exception as e:
            print(f'Error on attempt {retry_count + 1}: {e}')
            retry_count += 1
            sleep(2)
    
    return None

def display_network_info(wlan):
    """Display detailed network information"""
    config = wlan.ifconfig()
    status = wlan.status()
    
    print('\n' + '='*50)
    print('NETWORK CONNECTION SUCCESSFUL!')
    # print 50 "=" chars
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
    print('\nExpected ping response: <50ms in high-power mode')
    print('Press Ctrl+C to stop the program')
    print('='*50)

def keep_alive_loop(wlan):
    """Keep the device alive and monitor connection with active networking"""
    last_status_time = time()
    status_interval = 10  # Print status every 10 seconds
    ping_counter = 0
    
    try:
        while True:
            current_time = time()
            
            # Check if still connected
            if wlan.isconnected():
                # Blink LED to show device is alive
                blink_led(1, 0.05)
                # send to the OLED display
                display_wifi_stats(wlan, ping_counter)
   
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
                    sleep(10)
                    continue
            
            sleep(0.1)  # Very short delay to keep system responsive
            
    except KeyboardInterrupt:
        print('\nProgram stopped by user')
        led.off()
    except Exception as e:
        print(f'Unexpected error: {e}')
        blink_led(5, 0.1)  # Error indication

def display_wifi_stats(wlan, ping_counter):
    config = wlan.ifconfig()
    status = wlan.status()
    display.fill(0)
    display.text("Running server", 0, 0)
    display.text("Net: " + secrets.SSID, 0, 10)
    display.text("Status:" + str(status), 0, 20)
    display.text("IP: " + str(config[0]), 0, 30)
    display.text("Power: High", 0, 40)
    
    display.text(str(ping_counter), 0, 50)
    display.show()

def main():
    """Main program function"""
    print('Raspberry Pi Pico W - Enhanced Ping Test')
    print('========================================')
    display.fill(0)
    display.text("WiFi Ping Test", 0, 0)
    display.text("Powering Up WiFi", 0, 10)
    display.show()
    
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