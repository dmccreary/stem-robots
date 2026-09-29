---
title: Socket Server Lifecycle
description: A step-by-step view of the robot web server's socket calls, showing that accept() blocks, that listen(1) queues one browser, and why the robot serves one browser at a time.
image: /sims/socket-server-lifecycle/socket-server-lifecycle.png
og:image: /sims/socket-server-lifecycle/socket-server-lifecycle.png
twitter:image: /sims/socket-server-lifecycle/socket-server-lifecycle.png
social:
   cards: false
quality_score: 100
---

# Socket Server Lifecycle

<iframe src="main.html" height="547px" width="100%" scrolling="no"></iframe>

[Run the Socket Server Lifecycle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A **socket** is a software endpoint for sending and receiving data over a network.
Your robot's web server uses one socket to wait for browsers, and a new socket for each browser that connects.

The right column shows the server calls from the complete web server in
[Chapter 11](../../chapters/11-wireless-networking-web-servers/index.md), top to bottom:

1. `s = socket.socket()` creates the server socket.
2. `s.bind(addr)` claims port 80, the standard web port.
3. `s.listen(1)` starts listening. One browser may wait in line.
4. Inside the `while True` loop, `s.accept()` **blocks**. That means the program stops and waits right there until a browser connects.
5. `accept()` returns a *new* socket, `conn`, for just that browser.
6. `conn.recv(1024)` reads the browser's request.
7. `handle_cmd(cmd)` runs a motor command, but only for a POST with `cmd=`.
8. `conn.send(html_page())` sends the page back.
9. `conn.close()` hangs up, and the loop goes back to `accept()`.

The left column shows the same conversation from the browser's side, with arrows for each network message.
The **listen(1) queue** at the bottom holds one waiting browser. Any more are refused.

## How to Use

1. Press **Next Step** three times to run `socket()`, `bind()`, and `listen()`.
2. Press **Next Step** again. The server is now stuck in `accept()`: watch the red **WAITING (blocked)** tag and the stopwatch.
3. Press **Browser A connects**. `accept()` returns right away and the server moves on.
4. Pick **POST cmd=forward** in **Request type** before the `recv()` step, then keep stepping. The robot's wheels start to turn.
5. While the server is busy with Browser A, press **Browser B connects** twice. Where does each one go?
6. Uncheck **Add s.close() at the end**, step past `bind()`, press **Reset**, and run the server again. What happens at `bind()`?

**Try this challenge:** Press "Browser A connects", "Browser B connects", and "Browser B connects" again before the server finishes with A.
What happens to the second B, and which number in the code controls this?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/socket-server-lifecycle/main.html"
        height="547px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *sequence* the socket calls a web server makes (`socket`, `bind`, `listen`, `accept`, `recv`, `send`, `close`), and will *explain* which call blocks and why a single-threaded robot server handles one browser at a time (Bloom's Taxonomy: Apply).

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- HTTP GET and POST requests and socket programming from [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md).
- `while True` loops and `try`/`finally` from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).
- Motor functions such as `go_forward()` from [Chapter 7: PWM, Motor Speed Control, and Actuators](../../chapters/07-pwm-motor-speed-actuators/index.md).

### Activities

1. **Predict the order (3 min).** Students list the server calls in the order they expect them to run, then step through the sim to check. Ask which calls run once and which run on every loop.
2. **Blocking (4 min).** Students stop at `accept()` and watch the stopwatch. Discuss: "While the robot waits here, can it read its distance sensor?" This motivates why the controller page must be small and fast, and previews non-blocking designs.
3. **One browser at a time (5 min).** Students connect Browser A, then press Browser B twice while A is being served. They record where each B goes and connect the result to `listen(1)`.
4. **Request types (3 min).** Students serve one GET and two POST requests and note that only a POST with `cmd=` calls a motor function, and that the motor keeps running after the connection closes.
5. **Cleanup (3 min).** Students run the `s.close()` experiment and explain why the `finally` block matters when you restart a program during development.

### Assessment

- **Formative:** Point at the stopwatch during Activity 2 and ask, "Which line of code is running right now, and what is it waiting for?"
- **Exit ticket:** "Two classmates open the robot's page at the same moment, and a third opens it a second later. Describe what happens to each browser, and name the line of code that decides it."
- **Rubric (4-point):** *Exemplary* — correct order for all nine steps, accurate explanation of blocking in `accept()`, the role of `listen(1)`, and why `s.close()` belongs in `finally`. *Proficient* — correct order and a correct explanation of blocking and the queue. *Developing* — correct setup order but confusion between the server socket `s` and the connection socket `conn`. *Beginning* — cannot order the calls or identify the blocking call.

## References

1. [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md) — the complete web server program this sim follows.
2. [Socket Lifecycle Diagram (Networking course)](https://github.com/dmccreary/networking/tree/main/docs/sims/socket-lifecycle-diagram) — the two-column client/server lifecycle layout this sim is based on.
3. [MicroPython `socket` module](https://docs.micropython.org/en/latest/library/socket.html) — documentation for `bind()`, `listen()`, `accept()`, `recv()`, `send()`, and `close()`.
4. [Socket Programming HOWTO](https://docs.python.org/3/howto/sockets.html) — Python's guide to server sockets and blocking calls.
5. [Berkeley sockets](https://en.wikipedia.org/wiki/Berkeley_sockets) — Wikipedia article on the socket interface used by almost every network program.
6. [Port (computer networking)](https://en.wikipedia.org/wiki/Port_(computer_networking)) — Wikipedia article on ports, including port 80 for HTTP.
