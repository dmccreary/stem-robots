import network
import socket
import secrets
import time
from machine import Pin, PWM, SPI
import neopixel
import config

# display
import ssd1306
SCL=Pin(config.SCL_PIN)
SDA=Pin(config.SDA_PIN)
RES = Pin(config.RES_PIN)
DC = Pin(config.DC_PIN)
CS = Pin(config.CS_PIN)

spi=SPI(config.SPI_BUS, sck=SCL, mosi=SDA)
display = ssd1306.SSD1306_SPI(config.DISPLAY_WIDTH, config.DISPLAY_HEIGHT, spi, DC, RES, CS)

# Hardware setup based on config.py
led = Pin("LED", Pin.OUT)

# Motor PWM setup
right_forward = PWM(Pin(config.RIGHT_FORWARD_PIN))
right_reverse = PWM(Pin(config.RIGHT_REVERSE_PIN))
left_forward = PWM(Pin(config.LEFT_FORWARD_PIN))
left_reverse = PWM(Pin(config.LEFT_REVERSE_PIN))

# Set PWM frequency for motors (1000 Hz is good for motors)
right_forward.freq(1000)
right_reverse.freq(1000)
left_forward.freq(1000)
left_reverse.freq(1000)

# NeoPixel setup
np = neopixel.NeoPixel(Pin(config.NEOPIXEL_PIN), config.NUMBER_NEOPIXELS)

# Speaker setup
speaker = PWM(Pin(config.SPEAKER_PIN))

# Global variables for state tracking
led_state = False
current_neopixel_color = "off"

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
    
    # Disable power management for better responsiveness
    wlan.config(pm=0xa11140)
    
    print('Powering up WiFi chip...')
    time.sleep(3)
    
    retry_count = 0
    while retry_count < max_retries:
        try:
            print(f'Connection attempt {retry_count + 1}/{max_retries}')
            wlan.connect(secrets.SSID, secrets.PASSWORD)
            
            timeout = 15
            start_time = time.time()
            
            while not wlan.isconnected() and (time.time() - start_time) < timeout:
                time.sleep(1)
                print('.', end='')
            
            print()
            
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

def stop_motors():
    """Stop all motors"""
    right_forward.duty_u16(0)
    right_reverse.duty_u16(0)
    left_forward.duty_u16(0)
    left_reverse.duty_u16(0)

def move_forward():
    """Move robot forward"""
    stop_motors()
    time.sleep(0.1)
    right_forward.duty_u16(32000)  # About 50% power
    left_forward.duty_u16(32000)
    print("Moving forward")

def move_reverse():
    """Move robot in reverse"""
    stop_motors()
    time.sleep(0.1)
    right_reverse.duty_u16(32000)
    left_reverse.duty_u16(32000)
    print("Moving reverse")

def turn_right():
    """Turn robot right"""
    stop_motors()
    time.sleep(0.1)
    left_forward.duty_u16(32000)   # Left wheel forward
    right_reverse.duty_u16(32000)  # Right wheel reverse
    print("Turning right")

def turn_left():
    """Turn robot left"""
    stop_motors()
    time.sleep(0.1)
    right_forward.duty_u16(32000)  # Right wheel forward
    left_reverse.duty_u16(32000)   # Left wheel reverse
    print("Turning left")

def set_neopixels(color):
    """Set NeoPixels to specified color"""
    global current_neopixel_color
    current_neopixel_color = color
    
    if color == "red":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (255, 0, 0)
    elif color == "green":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 255, 0)
    elif color == "blue":
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 0, 255)
    else:  # off
        for i in range(config.NUMBER_NEOPIXELS):
            np[i] = (0, 0, 0)
    
    np.write()
    print(f"NeoPixels set to {color}")

def play_tone(frequency=1000, duration=0.5):
    """Play a tone on the speaker"""
    speaker.freq(frequency)
    speaker.duty_u16(32768)  # 50% duty cycle
    time.sleep(duration)
    speaker.duty_u16(0)  # Turn off
    print(f"Played tone: {frequency}Hz for {duration}s")

def toggle_led():
    """Toggle the onboard LED"""
    global led_state
    led_state = not led_state
    if led_state:
        led.on()
        print("LED turned ON")
    else:
        led.off()
        print("LED turned OFF")

def generate_html():
    """Generate the HTML page for robot control"""
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Robot Test Interface</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0f0f0;
        }}
        .container {{
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            text-align: center;
        }}
        .section {{
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }}
        .section h3 {{
            margin-top: 0;
            color: #555;
        }}
        button {{
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }}
        button:hover {{
            background-color: #45a049;
        }}
        .motor-btn {{
            background-color: #2196F3;
        }}
        .motor-btn:hover {{
            background-color: #1976D2;
        }}
        .stop-btn {{
            background-color: #f44336;
        }}
        .stop-btn:hover {{
            background-color: #d32f2f;
        }}
        .status {{
            margin-top: 20px;
            padding: 10px;
            background-color: #e8f5e8;
            border-radius: 5px;
        }}
        .color-buttons {{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }}
        .red-btn {{ background-color: #f44336; }}
        .green-btn {{ background-color: #4CAF50; }}
        .blue-btn {{ background-color: #2196F3; }}
        .off-btn {{ background-color: #757575; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Robot Test Interface v2</h1>
        
        <div class="section">
            <h3>Onboard LED</h3>
            <button onclick="sendCommand('toggle_led')">Toggle LED</button>
            <p>Current state: <span id="led-status">{'ON' if led_state else 'OFF'}</span></p>
        </div>
        
        <div class="section">
            <h3>NeoPixels</h3>
            <div class="color-buttons">
                <button class="red-btn" onclick="sendCommand('neopixel_red')">Red</button>
                <button class="green-btn" onclick="sendCommand('neopixel_green')">Green</button>
                <button class="blue-btn" onclick="sendCommand('neopixel_blue')">Blue</button>
                <button class="off-btn" onclick="sendCommand('neopixel_off')">Off</button>
            </div>
            <p>Current color: <span id="neopixel-status">{current_neopixel_color}</span></p>
        </div>
        
        <div class="section">
            <h3>Speaker</h3>
            <button onclick="sendCommand('play_tone')">Play Tone (1000Hz)</button>
            <button onclick="sendCommand('play_tone_low')">Low Tone (500Hz)</button>
            <button onclick="sendCommand('play_tone_high')">High Tone (1500Hz)</button>
        </div>
        
        <div class="section">
            <h3>Motor Control</h3>
            <div>
                <button class="motor-btn" onclick="sendCommand('move_forward')">Forward</button>
                <button class="motor-btn" onclick="sendCommand('move_reverse')">Reverse</button>
            </div>
            <div>
                <button class="motor-btn" onclick="sendCommand('turn_left')">Turn Left</button>
                <button class="motor-btn" onclick="sendCommand('turn_right')">Turn Right</button>
            </div>
            <div>
                <button class="stop-btn" onclick="sendCommand('stop_motors')">STOP</button>
            </div>
            <p><em>Note: Motors will run for 2 seconds then auto-stop</em></p>
        </div>
        
        <div class="status">
            <h3>System Status</h3>
            <p>WiFi: Connected</p>
            <p>Last command: <span id="last-command">None</span></p>
        </div>
    </div>

    <script>
        function sendCommand(command) {{
            console.log('Sending command:', command);
            document.getElementById('last-command').textContent = 'Sending: ' + command;
            
            fetch('/command', {{
                method: 'POST',
                headers: {{
                    'Content-Type': 'application/x-www-form-urlencoded',
                }},
                body: 'cmd=' + encodeURIComponent(command)
            }})
            .then(response => {{
                console.log('Response status:', response.status);
                return response.text();
            }})
            .then(data => {{
                console.log('Response data:', data);
                document.getElementById('last-command').textContent = command + ' (' + data + ')';
                
                // Update status displays based on command
                if (command === 'toggle_led') {{
                    // Will be updated on next page load or we can toggle the display
                    setTimeout(() => location.reload(), 500);
                }}
                if (command.startsWith('neopixel_')) {{
                    const color = command.replace('neopixel_', '');
                    document.getElementById('neopixel-status').textContent = color;
                }}
            }})
            .catch(error => {{
                console.error('Error:', error);
                document.getElementById('last-command').textContent = 'Error: ' + command + ' - ' + error.message;
            }});
        }}
        
        // Add some debug info
        console.log('Robot control interface loaded');
    </script>
</body>
</html>
"""
    return html

def handle_command(command):
    """Handle robot commands from web interface"""
    try:
        if command == "toggle_led":
            toggle_led()
        elif command == "neopixel_red":
            set_neopixels("red")
        elif command == "neopixel_green":
            set_neopixels("green")
        elif command == "neopixel_blue":
            set_neopixels("blue")
        elif command == "neopixel_off":
            set_neopixels("off")
        elif command == "play_tone":
            play_tone(1000, 0.5)
        elif command == "play_tone_low":
            play_tone(500, 0.5)
        elif command == "play_tone_high":
            play_tone(1500, 0.5)
        elif command == "move_forward":
            move_forward()
            time.sleep(2)  # Run for 2 seconds
            stop_motors()
        elif command == "move_reverse":
            move_reverse()
            time.sleep(2)
            stop_motors()
        elif command == "turn_left":
            turn_left()
            time.sleep(2)
            stop_motors()
        elif command == "turn_right":
            turn_right()
            time.sleep(2)
            stop_motors()
        elif command == "stop_motors":
            stop_motors()
        else:
            print(f"Unknown command: {command}")
            return False
        return True
    except Exception as e:
        print(f"Error executing command {command}: {e}")
        return False

def start_web_server(wlan):
    """Start the web server"""
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(addr)
    s.listen(1)
    
    ip = wlan.ifconfig()[0]
    print(f'\nWeb server started!')
    print(f'Open your browser and go to: http://{ip}')
    print(f'Robot control interface ready!')
    print('='*50)
    display_status(wlan)
    
    while True:
        try:
            cl, addr = s.accept()
            print(f'Client connected from {addr}')
            
            # Set a timeout for receiving data
            cl.settimeout(2.0)
            
            # Read the request in chunks to ensure we get it all
            request = b''
            try:
                while True:
                    chunk = cl.recv(1024)
                    if not chunk:
                        break
                    request += chunk
                    # Check if we have the complete request
                    if b'\r\n\r\n' in request:
                        break
            except:
                # Timeout or error reading - proceed with what we have
                pass
            
            request = request.decode('utf-8')
            print(f"Full request received ({len(request)} bytes)")
            
            # Parse the request
            if 'GET / ' in request:
                # Serve the main page
                response = generate_html()
                cl.send('HTTP/1.1 200 OK\r\n')
                cl.send('Content-Type: text/html\r\n')
                cl.send(f'Content-Length: {len(response)}\r\n')
                cl.send('\r\n')
                cl.send(response)
                
            elif 'POST /command' in request:
                # Handle command - improved parsing with debugging
                print(f"POST request received, length: {len(request)}")
                
                # Find the body of the request
                body_start = request.find('\r\n\r\n')
                if body_start != -1:
                    body = request[body_start + 4:]
                    print(f"Request body: '{body}'")
                    
                    # Parse URL-encoded data
                    if body.startswith('cmd='):
                        command = body[4:].strip()  # Remove 'cmd=' prefix and whitespace
                        print(f"Executing command: '{command}'")
                        success = handle_command(command)
                        
                        if success:
                            response = "OK"
                            print(f"Command '{command}' executed successfully")
                        else:
                            response = "ERROR"
                            print(f"Command '{command}' failed")
                        
                        cl.send('HTTP/1.1 200 OK\r\n')
                        cl.send('Content-Type: text/plain\r\n')
                        cl.send('Access-Control-Allow-Origin: *\r\n')
                        cl.send(f'Content-Length: {len(response)}\r\n')
                        cl.send('\r\n')
                        cl.send(response)
                    else:
                        print(f"Invalid body format: '{body}'")
                        cl.send('HTTP/1.1 400 Bad Request\r\n\r\n')
                else:
                    print("No body found in POST request")
                    cl.send('HTTP/1.1 400 Bad Request\r\n\r\n')
            else:
                # 404 for other requests
                print(f"Unknown request: {request[:100]}...")
                cl.send('HTTP/1.1 404 Not Found\r\n\r\n')
                
        except Exception as e:
            print(f'Web server error: {e}')
        finally:
            try:
                cl.close()
            except:
                pass

def display_status(wlan):
    config = wlan.ifconfig()
    display.fill(0)
    display.text("Server running", 0, 0)   
    display.text("Go to web page", 0, 10)
    display.text("http://" + str(config[0]), 0, 20)
    display.show()

def main():
    """Main program function"""
    print('Robot Web Server Test Interface')
    print('===================================')
    
    display.fill(0)
    display.text("Starting web", 0, 0)   
    display.text("   server", 0, 10)
    display.show()
    
    # Initialize hardware
    stop_motors()
    set_neopixels("off")
    led.off()
    
    # Initial LED indication
    blink_led(2, 0.5)
    
    # Connect to WiFi
    wlan = connect_wifi()
    
    if wlan:
        config = wlan.ifconfig()
        print('\n' + '='*50)
        print('WIFI CONNECTION SUCCESSFUL!')
        print('='*50)
        print(f'IP Address: {config[0]}')
        print(f'Network: {secrets.SSID}')
        print('='*50)
        
        blink_led(3, 0.2)  # Success indication
        
        # Start the web server
        start_web_server(wlan)
        display_status(wlan)
    else:
        print('\nFAILED TO CONNECT!')
        print('Check your secrets.py file for correct SSID and PASSWORD')
        blink_led(10, 0.1)  # Error indication

if __name__ == '__main__':
    main()