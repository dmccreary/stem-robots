# Quiz: Wireless Networking and Web Servers

Test your understanding of WiFi connectivity, HTTP protocol, socket programming, and browser-based robot control with these questions.

---

#### 1. What does `network.STA_IF` mean when creating a WLAN object on the Pico W?

<div class="upper-alpha" markdown>
1. It creates a Static IP Address interface that never changes
2. It puts the Pico W into Station mode — connecting to an existing WiFi access point as a client
3. It enables the Serial Terminal Access Feature for debugging over WiFi
4. It activates the SPI radio interface instead of the standard WiFi interface
</div>

??? question "Show Answer"
    The correct answer is **B**. `STA_IF` stands for Station Interface. In Station mode, the Pico W connects to an existing router or hotspot (the "access point") as a client — just like your phone joining a WiFi network. The alternative, `AP_IF` (Access Point Interface), would make the Pico W create its own WiFi hotspot. For connecting to a school network, Station mode is the correct choice.

    **Concept Tested:** WLAN Object / Access Point Connection

---

#### 2. What does `wlan.ifconfig()[0]` return after a successful WiFi connection?

<div class="upper-alpha" markdown>
1. The name (SSID) of the WiFi network the robot is connected to
2. The signal strength of the current WiFi connection in dBm
3. The robot's IP address on the local network
4. The MAC address of the Pico W's wireless chip
</div>

??? question "Show Answer"
    The correct answer is **C**. `wlan.ifconfig()` returns a tuple of four values: `(ip_address, subnet_mask, gateway, dns_server)`. Index `[0]` retrieves just the IP address — something like `192.168.1.105`. This IP address is what you type into a browser to connect to the robot's web server. The SSID, signal strength, and MAC address are retrieved through different calls.

    **Concept Tested:** IP Address Retrieval

---

#### 3. What is the difference between an HTTP GET request and an HTTP POST request in robot control?

<div class="upper-alpha" markdown>
1. GET requests are faster; POST requests are more reliable for long distances
2. GET requests ask the server for a page; POST requests send data (like a motor command) to the server
3. GET requests work over WiFi; POST requests require a Bluetooth connection
4. GET requests use port 80; POST requests use port 443 for encryption
</div>

??? question "Show Answer"
    The correct answer is **B**. In HTTP, GET requests are designed to retrieve resources (web pages, images). POST requests are designed to send data to the server — form submissions, button clicks, and command payloads. For robot control, when you click "Forward" in the browser, the form sends a POST request with `cmd=forward` in the body. Both GET and POST use port 80 for standard HTTP.

    **Concept Tested:** HTTP GET Request / HTTP POST Request

---

#### 4. Why is port 80 used for the robot's web server?

<div class="upper-alpha" markdown>
1. Port 80 is the fastest port on the Pico W's network chip
2. Port 80 is the default HTTP port, so browsers connect to it automatically without requiring `:port` in the URL
3. Port 80 is required for Socket programming on MicroPython
4. Port 80 bypasses the school's network firewall
</div>

??? question "Show Answer"
    The correct answer is **B**. Port 80 is the universally agreed-upon default port for HTTP. When you type `http://192.168.1.105/` in a browser without specifying a port, the browser automatically connects to port 80. If you used port 8080, you would need to type `http://192.168.1.105:8080/`. Using port 80 makes the web server address simpler and more intuitive for users.

    **Concept Tested:** Port 80 HTTP Default

---

#### 5. In the web server loop, what does `s.accept()` do?

<div class="upper-alpha" markdown>
1. It checks whether the HTML page was accepted (approved) by the browser
2. It accepts motor commands by parsing the POST request body for a `cmd` value
3. It blocks (pauses) until a browser connects, then returns a client socket and the client's address
4. It accepts the IP address configuration from the WLAN object and applies it to the socket
</div>

??? question "Show Answer"
    The correct answer is **C**. `socket.accept()` is a blocking call — the program pauses at that line, waiting for an incoming connection. When a browser connects to the server's IP and port, `accept()` returns two values: a new client socket for that conversation, and the client's address (IP and port). The server reads the request from the client socket and sends a response back through it.

    **Concept Tested:** Socket Programming

---

#### 6. What is the IoT (Internet of Things) concept, and how does this chapter's project fit that definition?

<div class="upper-alpha" markdown>
1. IoT means the robot is programmed using an internet connection instead of a USB cable
2. IoT refers to connecting physical devices to a network so they can send and receive data — the robot with a web server is an IoT device
3. IoT is a standard that requires devices to use HTTPS (secure HTTP) rather than plain HTTP
4. IoT means multiple robots can communicate with each other without a router
</div>

??? question "Show Answer"
    The correct answer is **B**. The Internet of Things is the concept of connecting physical objects to a network so they can exchange data. The robot in this chapter has an IP address, accepts HTTP connections, and controls physical motors based on network commands — that is exactly an IoT device. The chapter notes this is the same technology used in smart thermostats, fitness trackers, and connected light bulbs.

    **Concept Tested:** IoT Internet of Things

---

#### 7. What advantage does the JavaScript Fetch API provide over the simple HTML form approach for robot control?

<div class="upper-alpha" markdown>
1. Fetch API commands are encrypted so students cannot see the motor command names
2. Fetch sends commands without reloading the entire page, enabling faster and smoother browser-based control
3. Fetch API works over Bluetooth instead of WiFi, reducing latency
4. Fetch API allows the robot to push status updates to the browser without being asked
</div>

??? question "Show Answer"
    The correct answer is **B**. With a plain HTML form, every button click triggers a full page reload — the browser sends the command, the robot responds with a new HTML page, and the browser re-renders everything. The JavaScript Fetch API sends the command asynchronously in the background and updates only the relevant part of the page (like a status label), resulting in much faster and smoother control with no visible page flash.

    **Concept Tested:** JavaScript Fetch API

---

#### 8. Where in the HTTP request does the robot's web server find the motor command sent by the browser form?

<div class="upper-alpha" markdown>
1. In the URL path — for example, `/cmd=forward` as part of the address
2. In the HTTP response headers sent back from the browser
3. In the body of the POST request, after the blank line separating headers and body
4. In the Content-Type header at the top of the request
</div>

??? question "Show Answer"
    The correct answer is **C**. An HTTP POST request consists of headers followed by a blank line, then the body. Form data like `cmd=forward` is placed in the body. In the server code, the robot splits the request string at `\r\n\r\n` (the blank line between headers and body) and reads everything after it to find the command. GET requests put parameters in the URL; POST requests put them in the body.

    **Concept Tested:** HTTP POST Request / HTML Page Generation

---

#### 9. Why must `secrets.py` be added to `.gitignore` before the first commit in a WiFi project?

<div class="upper-alpha" markdown>
1. MicroPython automatically reads `secrets.py` from `.gitignore` during WiFi connection setup
2. If `secrets.py` is committed to a public repository, anyone can read the WiFi password
3. Git cannot encrypt Python files, so sensitive files must be excluded to prevent data corruption
4. Including `secrets.py` in Git would prevent the board from reading it during startup
</div>

??? question "Show Answer"
    The correct answer is **B**. Once a file is committed to a public Git repository (or even a private one that could later be made public), it is accessible to anyone with repository access. WiFi passwords in `secrets.py` must be kept secret. The `.gitignore` file tells Git to never track `secrets.py`, preventing accidental exposure. If credentials are accidentally committed, they should be treated as compromised and changed immediately.

    **Concept Tested:** Secrets File for WiFi

---

#### 10. A student builds the web server but the browser shows "page not found" when entering the robot's IP address. Which is the BEST first troubleshooting step?

<div class="upper-alpha" markdown>
1. Reflash the MicroPython firmware on the robot board
2. Verify the robot is connected to WiFi and print the IP address from `wlan.ifconfig()[0]` in Thonny
3. Change the HTML page to use a different CSS stylesheet
4. Switch from HTTP POST to HTTP GET in the form tag
</div>

??? question "Show Answer"
    The correct answer is **B**. The most common cause of "page not found" is that either the WiFi connection failed, or the student is typing a different IP address than the robot actually received. Printing the IP address from `wlan.ifconfig()[0]` in Thonny's shell confirms the actual address the robot was assigned. Only after confirming connectivity and the correct IP should deeper issues (code bugs, port problems) be investigated.

    **Concept Tested:** WiFi isConnected Check / Web Server Concept

---
