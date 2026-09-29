---
title: Wireless Networking and Web Servers
description: Upgrade your robot to a WiFi-connected device — connect the Raspberry Pi Pico W to a network, retrieve an IP address, and build a socket-based HTTP web server that serves an HTML control page and responds to GET and POST requests for browser-based robot control.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 15:15:00
version: 0.08
---

# Wireless Networking and Web Servers

!!! mascot-welcome "Welcome, maker — your robot is going online!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    So far you've controlled me with Thonny over a USB cable. This chapter cuts the cord. The Raspberry Pi Pico W has a built-in WiFi chip, and we're about to use it to serve a control webpage — meaning you'll drive me from any browser, on any device, connected to the same network. That's IoT: the Internet of Things.

## Summary

This chapter upgrades the robot to a wireless, internet-connected device. Students
connect the Raspberry Pi Pico W to a WiFi access point using the WLAN object, retrieve
an IP address, and run ping tests to verify connectivity. They then build a socket-based
HTTP web server that generates an HTML control page and responds to GET and POST
requests — enabling browser-based control of motors and LEDs. The chapter closes with
the JavaScript Fetch API for asynchronous control and the secrets file pattern for
protecting WiFi credentials.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. WiFi Overview
2. Raspberry Pi Pico W WiFi
3. WLAN Object
4. Access Point Connection
5. WiFi isConnected Check
6. IP Address Retrieval
7. Ping Test Slow Mode
8. Ping Test Fast Mode
9. Web Server Concept
10. Socket Programming
11. HTTP Protocol
12. HTTP GET Request
13. HTTP POST Request
14. HTML Page Generation
15. JavaScript Fetch API
16. Port 80 HTTP Default
17. IoT Internet of Things
18. Secrets File for WiFi

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Hardware Platform and Robot Assembly](../02-hardware-platform-assembly/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 5: Data Structures, Modular Programming, and Version Control](../05-data-structures-modular-code/index.md)
- [Chapter 10: Robot Behaviors and Autonomous Navigation](../10-robot-behaviors-navigation/index.md)

---

## WiFi Overview and the Internet of Things

**WiFi** (Wireless Fidelity) is a wireless communication technology that lets devices connect to a local network and (optionally) the internet without cables. Your phone, laptop, and smart TV all use WiFi. Now your robot can too.

Before we connect, let's understand the concept of **IoT — the Internet of Things**. The IoT is the idea of connecting physical objects (things) to the internet so they can send and receive data. A smart thermostat, a fitness tracker, a connected light bulb — these are all IoT devices. Your robot, running a web server, is an IoT device. It has a network address, and anything on the network can communicate with it.

This matters beyond this course: IoT is a major part of modern engineering, manufacturing, agriculture, and healthcare. The skills you learn in this chapter — networking, HTTP, web servers — are the same skills engineers use to build real IoT products.

### The Raspberry Pi Pico W

The **Raspberry Pi Pico W** is the WiFi-capable version of the Pico microcontroller board. It adds a CYW43439 wireless chip alongside the RP2040 processor. This chip supports:

- **2.4 GHz WiFi** (802.11n) — standard home and school wireless
- **Bluetooth 5.2** (covered in Chapter 12)

The WiFi chip connects to the RP2040 over SPI. MicroPython's `network` module handles all the complexity — from your perspective, connecting to WiFi is just a few lines of code.

---

## Connecting to WiFi

### The WLAN Object

The **WLAN object** is MicroPython's interface to the wireless chip. Before the code, here is what the parameter means: `network.STA_IF` selects "station mode" — connecting to an existing access point as a client. The alternative, `AP_IF`, would make the board *create* its own hotspot.

```python
import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)   # power on the WiFi chip
```

### Access Point Connection

An **access point** (AP) is the router or WiFi hotspot the robot connects to. Your school's WiFi network is an access point. To connect, call `wlan.connect()` with the network name (SSID) and password:

```python
from secrets import WIFI_SSID, WIFI_PASSWORD

wlan.connect(WIFI_SSID, WIFI_PASSWORD)
```

We import the credentials from `secrets.py` rather than writing them directly in the code. (You set up `secrets.py` in Chapter 5.)

### WiFi isConnected Check and IP Address Retrieval

Connecting to WiFi takes a few seconds. We need to wait until the connection is established before using the network. The **`isConnected()`** method returns `True` once the connection succeeds.

Before the code, here is what `ticks_ms()` and `ticks_diff()` do: they measure elapsed time without pausing the program (you learned these in Chapter 4). This gives us a timeout — if the connection doesn't succeed within 10 seconds, we stop waiting and report an error.

```python
from time import ticks_ms, ticks_diff, sleep

start = ticks_ms()
while not wlan.isconnected():
    if ticks_diff(ticks_ms(), start) > 10000:   # 10 second timeout
        print("WiFi connection failed!")
        break
    sleep(0.1)

if wlan.isconnected():
    ip = wlan.ifconfig()[0]
    print(f"Connected! IP address: {ip}")
```

The **IP address retrieval** uses `wlan.ifconfig()`, which returns a tuple of four values: `(ip, subnet_mask, gateway, dns_server)`. We take index `[0]` for the IP address — something like `192.168.1.105`.

### Ping Test

Before building a web server, verify connectivity with a ping test. A **ping** sends a small network packet to a known server and measures the round-trip time. If the ping succeeds, the WiFi connection is working.

MicroPython doesn't have a built-in `ping` command, but you can test connectivity by attempting a simple DNS lookup or using the `uping` module if available on your firmware. Alternatively, use the **Thonny slow mode ping test**: open Thonny's network tools and enter the board's IP address in a browser — if the web server is running, the page loads.

**Fast mode ping test** uses the Arduino/MicroPython `network.ping()` function (firmware-dependent). Check whether your firmware version includes it:

```python
# Simple connectivity test — try connecting to a known address
import socket
try:
    addr = socket.getaddrinfo("google.com", 80)[0][-1]
    print("DNS working — network is connected:", addr)
except Exception as e:
    print("Network issue:", e)
```

#### Diagram: WiFi Connect Sequence

This simulation walks through the steps your robot takes to join a WiFi network, one call at a time. You can make the connection succeed or fail and see what the code prints in each case.

<iframe src="../../sims/wifi-connect-sequence/main.html" width="100%" height="582px" scrolling="no"></iframe>
[Run WiFi Connect Sequence Fullscreen](../../sims/wifi-connect-sequence/main.html){ .md-button }

<details markdown="1">
<summary>Step through the WLAN connect calls, with a 10 second timeout and failure paths</summary>
Type: microsim
**sim-id:** wifi-connect-sequence<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design. A Mermaid sequence diagram would also work, but p5.js lets the timeout clock run.

Learning objective: Sequence (Bloom L3) — put the WiFi connection calls in the right order and explain what the robot does when the network is missing, the password is wrong, or the timeout runs out.

Canvas layout: total width responsive (max 800 px), height 580 px. Left 480 px is a sequence diagram with two lifelines: "Robot (MicroPython)" and "Access Point (router)". A 100 px strip at the bottom shows the code. The right 320 px shows a status panel with a timeout bar.

Visual elements:
- Two vertical lifelines. Arrows between them for each step: `WLAN(STA_IF)`, `active(True)`, `connect(SSID, PASSWORD)`, "Authentication", "IP address (DHCP)", `isconnected()`, `ifconfig()`. Arrows for the robot-only calls (`WLAN`, `active`) loop back on the robot's lifeline.
- Active step is highlighted gold. Finished steps are green. A failed step is red.
- Code strip: the chapter's `while not wlan.isconnected()` loop with the current line highlighted.
- Status panel: "wlan.status()" text, the elapsed-time bar from 0 to 10 s (the `ticks_diff() > 10000` check), and a serial console box that prints exactly what the robot would print, such as `Connected! IP address: 192.168.1.105` or `WiFi connection failed!`.
- A small robot icon whose NeoPixel-style LED is amber while connecting, green when connected, and red on failure.

Interactive controls:
- Button "Next Step" and button "Auto Play" (one step per 1.2 s). Button "Reset".
- Dropdown "Scenario": "Success" (default), "Wrong password", "Network out of range", "Slow router (connects at 8 s)", "Slow router (connects at 12 s)".
- Slider "Timeout (s)": 2 to 20, default 10.
- Toggle "Use secrets.py" (default on). When off, the code strip shows the SSID and password typed directly in main.py, with a red tag "Would be committed to git!".

Behavior: the order is fixed. Steps 1 and 2 finish at once. Step 3 (`connect`) returns immediately and does not wait. Then the loop polls `isconnected()` every 0.1 s and the bar fills. Success: connects at 3 s, the DHCP arrow appears, `ifconfig()` returns a 4-tuple `('192.168.1.105', '255.255.255.0', '192.168.1.1', '192.168.1.1')`, and the console prints the IP. Wrong password: the authentication arrow returns a red X, `isconnected()` stays False until the timeout, then the console prints `WiFi connection failed!`. Out of range: no reply arrow at all, same timeout. Slow router: connects at the given time. It succeeds only if that time is below the timeout slider. After a failure, show a hint box: "Check the SSID, the password in secrets.py, and that the network is 2.4 GHz."

Default state: scenario Success, timeout 10 s, step 0, empty console.

Assessment/Challenge: Choose "Slow router (connects at 12 s)" with the default timeout. The robot reports a failure even though the router would have worked. Fix it using only the timeout slider. (Answer: set the timeout to 15 s or more.)

Responsive: redraw on window resize.
</details>

The connect call does not wait for the router. That is why our code polls `isconnected()` in a loop with a timeout. If you see `WiFi connection failed!`, use the scenarios in the sim to check the usual causes before you change your code.

---

## Building a Web Server

Now let's build the web server. Before diving into the code, we need to understand two key concepts: the HTTP protocol and socket programming.

### HTTP Protocol

**HTTP** (HyperText Transfer Protocol) is the language of the web. When you type a URL in your browser, it sends an HTTP request to a web server. The server reads the request and sends back an HTTP response with the content (an HTML page, an image, a JSON object, etc.).

Every HTTP conversation has two sides:

- **Client** (your browser) — sends a request
- **Server** (your robot) — receives the request and sends a response

### HTTP GET and POST Requests

Two types of HTTP requests matter for robot control:

An **HTTP GET request** asks for a resource. When you type `http://192.168.1.105/` in your browser, the browser sends a GET request for the root page. GET requests carry parameters in the URL: `http://192.168.1.105/action?cmd=forward`.

An **HTTP POST request** sends data to the server. When you click a form button that submits a motor command, the browser sends a POST request with the command in the request body. POST is more appropriate than GET for actions that change the robot's state.

For simplicity in this course, we handle both GET and POST. Many simple robot controllers use GET with URL parameters.

### Socket Programming

A **socket** is a software endpoint for sending and receiving data over a network. Your robot's web server listens on a socket. When a browser connects, it gets a client socket for that conversation.

Before the code, here is the flow: `socket.socket()` creates a socket object. `bind()` assigns it an address and port. `listen(1)` tells it to accept connections (up to 1 queued at a time). `accept()` blocks (waits) until a client connects, then returns a new socket and the client's address.

**Port 80** is the default port for HTTP. When you type a URL without a port number, the browser automatically uses port 80. This is why we bind to port 80 — no need to type `:8080` in the URL.

#### Diagram: Socket Server Lifecycle

This simulation shows the life of your robot's web server socket, from `socket()` to `close()`. You watch a browser connect and see which calls wait and which return right away.

<iframe src="../../sims/socket-server-lifecycle/main.html" width="100%" height="602px" scrolling="no"></iframe>
[Run Socket Server Lifecycle Fullscreen](../../sims/socket-server-lifecycle/main.html){ .md-button }

<details markdown="1">
<summary>Follow the server socket calls bind, listen, accept, recv, send, and close</summary>
Type: microsim
**sim-id:** socket-server-lifecycle<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** dmccreary/networking `socket-lifecycle-diagram` — https://github.com/dmccreary/networking/tree/main/docs/sims/socket-lifecycle-diagram. Keep its two-column client/server lifecycle layout. Change the server column to the Pico W web server calls in this chapter, rename the client column "Browser", and add the blocking indicator and the "second browser" button.

Learning objective: Sequence (Bloom L3) — order the socket calls a web server makes and explain which call blocks and why the robot handles one browser at a time.

Canvas layout: total width responsive (max 800 px), height 600 px. Two columns of 340 px: "Browser (client)" on the left and "Robot (server, Pico W)" on the right. A 60 px bar at the bottom shows the code line for the current step. A 100 px strip at the bottom shows a queue.

Visual elements:
- Server column, top to bottom: `s = socket.socket()`, `s.bind(addr)` (port 80), `s.listen(1)`, then a loop box containing `conn, client = s.accept()`, `request = conn.recv(1024)`, `conn.send(html_page())`, `conn.close()`. An arrow returns from `close()` to `accept()`.
- Browser column: "connect to 192.168.1.105:80", "send GET / or POST cmd=forward", "receive HTML", "close".
- Horizontal arrows between the columns for the network messages. Active step is gold, finished steps are green.
- Blocking indicator: when the server sits at `accept()` waiting, show a pulsing red "WAITING (blocked)" tag and a stopwatch. This shows that `accept()` blocks until someone connects.
- Queue strip: a box holding up to 1 waiting browser (from `listen(1)`), drawn as a small browser icon.
- Motors panel: a small robot that spins its wheels while `go_forward()` runs after a POST with `cmd=forward`.

Interactive controls:
- Button "Next Step". Button "Auto Play". Button "Reset".
- Button "Browser A connects" and button "Browser B connects". Both can be pressed at any time.
- Dropdown "Request type": GET / (default), POST cmd=forward, POST cmd=stop.
- Toggle "Add s.close() at the end" (default on). When off, the port shows "Address already in use" on the next restart.

Behavior: the server always starts at `socket()` and ends the setup part at `listen(1)`. After that it sits at `accept()` until a browser connects. When A connects, `accept()` returns a NEW socket `conn` and the client address, and the server moves to `recv`. If B connects during that time, it goes into the queue strip (one slot). A second waiting browser beyond that is refused, drawn with a red X and "Connection refused". When the server finishes `close()` and returns to `accept()`, it takes B from the queue. For "POST cmd=forward" the server calls `go_forward()` before `send`. For "GET /" it only sends the page. The step counter shows "Step n of 9".

Default state: server at the top of the list before `socket()`, no browsers, queue empty, request type GET.

Assessment/Challenge: Press "Browser A connects" and "Browser B connects" and "Browser B connects" again before the server finishes. What happens to the second B, and what number in the code controls this? (Answer: it is refused, because `listen(1)` queues only one waiting browser.)

Responsive: redraw on window resize.
</details>

Every line in the diagram is a line in the complete web server program. Because `accept()` blocks and the loop handles one browser at a time, your robot cannot do other work while it waits. That is why the controller page must be small and quick.

### HTML Page Generation

**HTML page generation** means building an HTML string in Python and sending it as the HTTP response. The robot doesn't serve static files from disk — it builds the page dynamically.

Before the code below, here is what the HTML does: the `<form>` sends a POST request back to the robot with the button value as form data. Each button sends a different `cmd` value: `forward`, `back`, `left`, `right`, or `stop`.

```python
def html_page(status="Ready"):
    return f"""HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
<head><title>Robot Control</title></head>
<body>
<h1>Sparky Robot Control</h1>
<p>Status: {status}</p>
<form method="POST">
  <button name="cmd" value="forward">Forward</button>
  <button name="cmd" value="back">Back</button><br>
  <button name="cmd" value="left">Left</button>
  <button name="cmd" value="right">Right</button><br>
  <button name="cmd" value="stop">Stop</button>
</form>
</body>
</html>
"""
```

#### Diagram: Web Server Request-Response Flow


<iframe src="../../sims/http-request-response-flow/main.html" width="100%" height="720px" scrolling="no"></iframe>
[Run Web Server Request-Response Flow Fullscreen](../../sims/http-request-response-flow/main.html)

<details markdown="1">
<summary>Interactive diagram showing how the browser and robot exchange HTTP messages</summary>
Type: diagram
**sim-id:** http-request-response-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Create a Mermaid sequence diagram (sequenceDiagram) showing:

Participants: Browser, WiFi Network, Robot (Pico W)

Sequence:
1. Browser ->> WiFi Network: HTTP GET / (request root page)
2. WiFi Network ->> Robot: Forward the request
3. Robot ->> Robot: Build HTML response
4. Robot ->> WiFi Network: HTTP 200 OK + HTML page
5. WiFi Network ->> Browser: Deliver response
6. Browser ->> Browser: Render the HTML control page
7. User clicks "Forward" button
8. Browser ->> WiFi Network: HTTP POST /action?cmd=forward
9. WiFi Network ->> Robot: Forward the POST
10. Robot ->> Robot: Parse cmd, call go_forward()
11. Robot ->> WiFi Network: HTTP 200 OK (updated status page)
12. WiFi Network ->> Browser: Deliver new page

Every step has a click directive opening an infobox explaining what that step does and the relevant MicroPython code.

Canvas: 700 × 500 px. Responsive on window resize.
</details>

---

## The Complete Web Server

Now let's put everything together. This is the complete web-controlled robot program. Before the code, here is the structure: the server loop calls `accept()` to wait for a connection, reads the HTTP request to find the command, calls the appropriate motor function, and sends back an updated HTML page.

```python
import network, socket
from machine import PWM, Pin
from time import sleep
from secrets import WIFI_SSID, WIFI_PASSWORD
import config

# WiFi setup
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASSWORD)

while not wlan.isconnected():
    sleep(0.1)

ip = wlan.ifconfig()[0]
print(f"Server running at http://{ip}/")

# Motor setup (from Chapter 7)
right_fwd = PWM(Pin(config.RIGHT_FORWARD_PIN), freq=50)
right_rev = PWM(Pin(config.RIGHT_REVERSE_PIN), freq=50)
left_fwd  = PWM(Pin(config.LEFT_FORWARD_PIN),  freq=50)
left_rev  = PWM(Pin(config.LEFT_REVERSE_PIN),  freq=50)

FULL = 65535

def set_speed(pf, pr, speed):
    if speed > 0:   pf.duty_u16(speed); pr.duty_u16(0)
    elif speed < 0: pf.duty_u16(0);     pr.duty_u16(-speed)
    else:           pf.duty_u16(0);     pr.duty_u16(0)

def go_forward():
    set_speed(right_fwd, right_rev, FULL)
    set_speed(left_fwd,  left_rev,  FULL)

def stop_motors():
    set_speed(right_fwd, right_rev, 0)
    set_speed(left_fwd,  left_rev,  0)

def handle_cmd(cmd):
    if cmd == "forward": go_forward()
    elif cmd == "stop":  stop_motors()
    # add back, left, right as needed

# Socket server
addr = socket.getaddrinfo("0.0.0.0", 80)[0][-1]
s = socket.socket()
s.bind(addr)
s.listen(1)

status = "Ready"

try:
    while True:
        conn, client = s.accept()
        request = conn.recv(1024).decode()

        # Parse cmd from POST body: "cmd=forward"
        cmd = ""
        if "\r\n\r\n" in request:
            body = request.split("\r\n\r\n", 1)[1]
            if body.startswith("cmd="):
                cmd = body[4:].strip()
                handle_cmd(cmd)
                status = cmd.upper()

        conn.send(html_page(status).encode())
        conn.close()

except KeyboardInterrupt:
    pass

finally:
    stop_motors()
    s.close()
    print("Server stopped.")
```

---

## JavaScript Fetch API — Asynchronous Control

The button-form approach above works, but it reloads the page with every click — not ideal for driving a robot. A smoother approach uses the **JavaScript Fetch API** to send commands without reloading the page.

Before the code snippet, here is the idea: instead of a form that navigates away, JavaScript intercepts the button click, sends a POST request in the background, and updates just the status text on the page — no full reload.

```javascript
// JavaScript inside the HTML page (inside <script> tags)
async function sendCmd(cmd) {
    const response = await fetch('/action', {
        method: 'POST',
        body: 'cmd=' + cmd
    });
    const text = await response.text();
    document.getElementById('status').innerText = text;
}
```

This turns the robot controller into a real-time interface — press Forward, robot starts moving immediately. Press Stop, it stops. No page reload between commands.

#### Diagram: Fetch vs. Form Page Reload

This simulation puts two controller pages side by side. The left page uses the form buttons from earlier in the chapter. The right page uses `fetch()`. You click the same buttons on both and watch what the browser does.

<iframe src="../../sims/fetch-async-control/main.html" width="100%" height="562px" scrolling="no"></iframe>
[Run Fetch vs. Form Page Reload Fullscreen](../../sims/fetch-async-control/main.html){ .md-button }

<details markdown="1">
<summary>Compare a form POST that reloads the page with a fetch() call that only updates the status text</summary>
Type: microsim
**sim-id:** fetch-async-control<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Compare (Bloom L4) — describe why a `fetch()` call updates only part of a page while a form submit reloads the whole page, and how that makes robot control smoother.

Canvas layout: total width responsive (max 800 px), height 560 px. Two browser windows side by side, each 380 px wide and 300 px tall: "Form buttons (page reload)" and "fetch() buttons (no reload)". Under them, a 160 px timeline strip and a 60 px robot row.

Visual elements:
- Each browser window has a title bar, a heading "Sparky Robot Control", a line "Status: __", and five buttons: Forward, Back, Left, Right, Stop.
- Form window: on click, the whole window goes white for 400 ms with a spinning wheel in the tab, and the page contents redraw. A "Page loads: n" counter goes up.
- Fetch window: on click, the pressed button stays in place and only the status text flashes yellow and changes. The counter stays at 1.
- Timeline strip: for each window, a horizontal bar that shows time. A blue block is "request in flight" (round trip time), a white block is "page blank while reloading", a green tick is "robot starts moving". The form bar has both blue and white blocks. The fetch bar has only a small blue block.
- Robot row: a small robot with wheels that turn after the command arrives at the robot. Two robots, one under each window.
- Code panel (right of the timeline): the 8 lines of `sendCmd(cmd)` with the active line highlighted (`fetch`, `await response.text()`, `innerText = text`).

Interactive controls:
- Click any of the five buttons in either window (or press the "Click both" button to press the same button in both).
- Slider "Network delay (ms)": 20 to 500, step 10, default 100.
- Slider "Page size (KB)": 1 to 50, default 5. Bigger pages take longer to reload.
- Button "Fast clicks" — presses Forward, Left, Stop, Forward in 1 s in both windows.
- Button "Reset".

Behavior: the form window time per click = network delay + page size x 8 ms (reload). A click during the reload is lost, which shows a red "Click missed" tag. The fetch window time per click = network delay + about 5 ms for the status text. Each command is a small message (about 10 bytes), so page size does not matter. The robot starts moving when the request arrives (after half the network delay). Show the "Status" text update in the fetch window after the full round trip. Also show that the button press to robot motion is faster on the fetch side, especially for a large page.

Default state: both windows show "Status: Ready", counters at 1, delay 100 ms, page size 5 KB.

Assessment/Challenge: Set page size to 50 KB and press "Fast clicks". How many clicks does each window register? Which one would you rather use to drive a robot toward a wall? (Answer: the form window misses clicks, and the fetch window registers all 4, so fetch is safer.)

Responsive: redraw on window resize.
</details>

The `sendCmd()` function runs in the browser, not on the robot. The robot still sees a normal POST request and answers it the same way. The only change is that the page stays put, so the Stop button is always ready when you need it.

!!! mascot-thinking "Your robot is now a web server"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think about what just happened: a $35 microcontroller is accepting HTTP connections from browsers, parsing requests, controlling motors, and sending back HTML responses. That's exactly what production web servers do — just at a much larger scale. The concepts are identical. You're learning real web server architecture.

---

## Secrets File for WiFi

We covered this in Chapter 5, but it deserves emphasis here because WiFi credentials are more sensitive than other config values.

The `secrets.py` file stores network credentials:

```python
# secrets.py — NEVER commit to version control
WIFI_SSID     = "SchoolRobotics"
WIFI_PASSWORD = "your-password-here"
```

Your `.gitignore` must include `secrets.py`:

```
secrets.py
```

If your school has a guest network, use that for robot WiFi rather than the main school network — it keeps the robot isolated and simplifies access. Ask your IT administrator which network is appropriate for student projects.

!!! mascot-warning "Separate networks for robots"
    ![Sparky warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A robot running a web server on port 80 is accepting connections from any device on the same network. On a home network, that's fine. On a shared school network with hundreds of students, make sure you're on an appropriate VLAN or guest network. Never run an open, unprotected web server on a network you don't control.

---

## Key Takeaways

- **WiFi Overview:** the Pico W adds a 2.4 GHz WiFi chip — enabling IoT (Internet of Things) connectivity
- **WLAN object** with `STA_IF` (station mode) connects the robot to an existing access point
- **`isconnected()`** and `ifconfig()[0]` verify connection and retrieve the IP address
- **HTTP protocol** — GET requests ask for pages; POST requests submit data to the server
- **Socket programming** — `bind()` port 80, `listen()`, `accept()` in a loop to handle browser connections
- **HTML page generation** — build HTML strings in Python and send them as HTTP responses
- **JavaScript Fetch API** — enables asynchronous commands (no page reload) for smoother robot control
- **secrets.py** keeps WiFi credentials out of version control — always list it in `.gitignore`

!!! mascot-celebration "Your robot is online — and browser-controlled!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, maker! You built a real web server on a microcontroller, served HTML to a browser, and controlled a robot over WiFi. That is genuinely impressive engineering. The next chapter adds Bluetooth — robot-to-robot communication that doesn't need a router at all. The robots are about to talk to each other!

