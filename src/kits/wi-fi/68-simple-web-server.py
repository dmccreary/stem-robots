import network
import socket
import secrets
import time
from machine import Pin

# Setup the onboard LED
led = Pin("LED", Pin.OUT)
led_state = False  # Track LED state

def connect_wifi():
    """Connect to WiFi network using credentials from secrets.py"""
    print(f'Connecting to WiFi: {secrets.SSID}')
    
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(secrets.SSID, secrets.PASSWORD)
    
    # Wait for connection
    while not wlan.isconnected():
        print('.', end='')
        time.sleep(1)
    
    print(f'\nConnected! IP: {wlan.ifconfig()[0]}')
    return wlan

def toggle_led():
    """Toggle the LED on/off and return current state"""
    global led_state
    led_state = not led_state
    
    if led_state:
        led.on()
        print("LED turned ON")
    else:
        led.off()
        print("LED turned OFF")
    
    return "ON" if led_state else "OFF"

def generate_html():
    """Create simple HTML page with LED toggle button"""
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>LED Control</title>
</head>
<body>
    <h1>Simple LED Control</h1>
    <p>LED Status: <strong>{toggle_led.__globals__['led_state'] and "ON" or "OFF"}</strong></p>
    <button onclick="toggleLED()">Toggle LED</button>
    
    <script>
        function toggleLED() {{
            fetch('/toggle', {{method: 'POST'}})
            .then(() => location.reload());
        }}
    </script>
</body>
</html>"""
    return html

def start_server(wlan):
    """Start web server and handle requests"""
    # Create socket and bind to port 80
    s = socket.socket()
    s.bind(('0.0.0.0', 80))
    s.listen(1)
    
    print(f'Web server running at: http://{wlan.ifconfig()[0]}')
    
    while True:
        # Accept incoming connection
        client, addr = s.accept()
        print(f'Client connected: {addr}')
        
        # Read the request
        request = client.recv(1024).decode('utf-8')
        
        if 'GET / ' in request:
            # Serve main page
            html = generate_html()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(html)
            
        elif 'POST /toggle' in request:
            # Toggle LED and send response
            state = toggle_led()
            client.send('HTTP/1.1 200 OK\r\n\r\n')
            client.send(f'LED is {state}')
        
        client.close()

def main():
    """Main program - connect to WiFi and start server"""
    print('Simple LED Web Server')
    print('====================')
    
    # Turn off LED initially
    led.off()
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    # Start web server
    start_server(wlan)

# Run the program
if __name__ == '__main__':
    main()