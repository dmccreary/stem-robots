---
title: Fetch vs. Form Page Reload
description: Two robot controller pages side by side, one with form buttons that reload the page and one with fetch(), so students can compare missed clicks, blank-page time, and robot response.
image: /sims/fetch-async-control/fetch-async-control.png
og:image: /sims/fetch-async-control/fetch-async-control.png
twitter:image: /sims/fetch-async-control/fetch-async-control.png
social:
   cards: false
quality_score: 100
---

# Fetch vs. Form Page Reload

<iframe src="main.html" height="549px" width="100%" scrolling="no"></iframe>

[Run the Fetch vs. Form Page Reload MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

There are two ways to send a command from a web page to your robot.

- **Form buttons** (left page) send a POST request, and the browser then **reloads the whole page**.
  While the new page loads, the buttons are gone, so a click at that moment is lost.
- **`fetch()` buttons** (right page) send the same POST request in the background with JavaScript.
  Only the "Status" text changes. The buttons never go away, so every click counts.

Each page drives its own small robot. A robot starts moving when the request reaches it, which takes half of the round-trip network delay.

The **timeline** at the bottom shows the last three seconds for both pages:

- a **blue** block is a request in flight (the round trip),
- a **white** block is time the form page is blank while it reloads,
- a **green** line is the moment the robot starts moving,
- a **red X** is a click that was missed.

The code panel shows the `sendCmd()` function from
[Chapter 11](../../chapters/11-wireless-networking-web-servers/index.md).
The highlighted lines follow the newest `fetch()`: first the request, then `await response.text()`, then the status update.

## How to Use

1. Click the buttons on either simulated page. Watch the tab spinner, the page, and the robot under it.
2. Pick a **Command** and press **Click both** to press the same button on both pages at once.
3. Move **Page size (KB)** up. Bigger pages take longer to reload, but a `fetch()` command stays tiny.
4. Move **Network delay (ms)** to see how a slow WiFi link affects both pages.
5. Press **Fast clicks** to press Forward, Left, Stop, Forward in about one second on both pages.
6. Press **Reset** to clear the counters and the timeline.

**Try this challenge:** Set the page size to 50 KB and press **Fast clicks**.
How many clicks does each page register? Which page would you rather use to drive a robot toward a wall?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/fetch-async-control/main.html"
        height="549px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Students will *compare* a form submission that reloads the whole page with a `fetch()` call that updates only the status text, and will *explain* how the difference affects missed commands and the responsiveness of robot control (Bloom's Taxonomy: Analyze).

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Prerequisites

- HTTP POST requests, HTML page generation, and the JavaScript Fetch API from [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md).
- Functions and events from [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md).

### Activities

1. **Single clicks (3 min).** With default settings, students click Forward on each page and describe every visible difference: tab spinner, blank page, page-load counter, and status flash.
2. **Controlled comparison (6 min).** Students fill in a table for page sizes 5, 25, and 50 KB at a 100 ms delay: time until the buttons come back on the form page, and whether that time depends on page size for `fetch()`. They should derive "delay + page size x 8 ms" for the form page.
3. **Stress test (4 min).** Students run Fast clicks at 50 KB, count registered and missed clicks on each page, and compare each robot's final command with the intended sequence.
4. **Read the code (4 min).** Students watch the highlighted lines of `sendCmd()` and explain what `await` means, why the page does not reload, and which single line changes the screen.
5. **Discussion (3 min).** "The robot's server code did not change at all. Why is the robot easier to control with `fetch()`?"

### Assessment

- **Formative:** During Activity 3, ask pairs to point at a red X on the timeline and explain why that click was lost.
- **Exit ticket:** "A classmate's controller page is 40 KB and uses form buttons. They say the Stop button 'sometimes does nothing.' Explain why, and describe the change that fixes it."
- **Rubric (4-point):** *Exemplary* — explains missed clicks using the reload window, derives how reload time grows with page size, and connects `fetch()` to both reliability and safety. *Proficient* — correctly compares missed clicks and reload behavior with data from the sim. *Developing* — notices that the form page flashes but does not connect it to lost commands. *Beginning* — describes the two pages as the same.

## References

1. [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md) — the form-based controller page and the `sendCmd()` fetch function.
2. [Fetch API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) — reference for `fetch()` and the Response object.
3. [Using the Fetch API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — guide to sending POST requests with `fetch()`.
4. [Sending form data (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Sending_and_retrieving_form_data) — how an HTML form submits and loads a new page.
5. [async function (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — what `async` and `await` do.
6. [Ajax (programming)](https://en.wikipedia.org/wiki/Ajax_(programming)) — Wikipedia article on updating part of a page without a full reload.
