---
title: Web Server Request-Response Flow
description: Type: diagram **sim-id:** http-request-response-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid sequence diagram (sequenceDiagram) showing:  Participants: Browser, WiFi Network, Robot (Pico W)  Sequence: 1.
image: /sims/http-request-response-flow/http-request-response-flow.png
og:image: /sims/http-request-response-flow/http-request-response-flow.png
twitter:image: /sims/http-request-response-flow/http-request-response-flow.png
social:
   cards: false
status: implemented
library: Mermaid
bloom_level: TBD
---

# Web Server Request-Response Flow

<iframe src="main.html" width="100%" height="720" scrolling="no"></iframe>

[Run the Web Server Request-Response Flow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

## About this MicroSim

Type: diagram **sim-id:** http-request-response-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid sequence diagram (sequenceDiagram) showing:  Participants: Browser, WiFi Network, Robot (Pico W)  Sequence: 1.

**Bloom's Taxonomy level:** TBD

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/http-request-response-flow/main.html" width="100%" height="720" scrolling="no"></iframe>
```

## Lesson Plan

**Learning objective:** Type: diagram **sim-id:** http-request-response-flow<br/> **Library:** Mermaid<br/> **Status:** Specified  Create a Mermaid sequence diagram (sequenceDiagram) showing:  Participants: Browser, WiFi Network, Robot (Pico W)  Sequence: 1.

**Suggested use (5-15 minutes):**

1. **Predict first.** Before touching the controls, ask students to predict what they expect to see.
2. **Explore.** Have students interact with every control and observe how the display responds.
3. **Explain.** Ask students to describe, in their own words, the relationship the MicroSim demonstrates.

**Discussion questions:**

- What changed on screen when you interacted with the MicroSim, and why?
- How does this idea show up when you program the real robot?

## References

- [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md)
- [Hypertext Transfer Protocol (Wikipedia)](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)
- [HTTP request methods (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

## Specification

The full specification below is extracted from [Chapter 11: Wireless Networking and Web Servers](../../chapters/11-wireless-networking-web-servers/index.md).

```text
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
```

