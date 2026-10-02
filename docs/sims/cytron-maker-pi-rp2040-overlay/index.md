---
title: "Cytron Maker Pi RP2040 Board Explorer"
description: "Hover over any part of the Cytron Maker Pi RP2040 robotics board to learn what it does, then take a quiz that asks you to find each part by its job."
image: /sims/cytron-maker-pi-rp2040-overlay/cytron-maker-pi-rp2040-overlay.png
og:image: /sims/cytron-maker-pi-rp2040-overlay/cytron-maker-pi-rp2040-overlay.png
twitter:image: /sims/cytron-maker-pi-rp2040-overlay/cytron-maker-pi-rp2040-overlay.png
social:
   cards: false
status: implemented
library: custom (hover overlay)
hide: toc
bloom_level: Understand (L2) — Explain what each part of the Cytron Maker Pi RP2040 board does in a robot.
---

# Cytron Maker Pi RP2040 Board Explorer

<iframe src="main.html" height="902px" width="100%" scrolling="no"></iframe>

[Run the Cytron Maker Pi RP2040 Board Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/cytron-maker-pi-rp2040-overlay/main.html"
        height="902px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

The **Cytron Maker Pi RP2040** is the robot controller board used in most of
our kits, including the [Base Bot](../../kits/base-bot/index.md), the
[Line Follower Bot](../../kits/line-follower-bot/index.md), and the
[Ultrasonic Bot](../../kits/ultrasonic-bot/index.md). Its brain is an RP2040
microcontroller, the same chip that is on a Raspberry Pi Pico. The board adds
everything a small robot needs: a motor driver for two wheels, servo ports, a
buzzer, colored lights, buttons, and seven Grove ports for sensors.

This MicroSim is an **interactive overlay** on the Maker Pi RP2040 pinout
diagram. Every part of the board has an invisible hotspot. So does every
printed label in the margin. Move your pointer over a part, and a description
appears below the drawing. It tells you what the part does, which GPIO pins it
uses, and a practical tip for using it on your robot.

Some parts come in groups, like the seven Grove ports or the four motor test
buttons. When you point at one of them, the whole group lights up. A small tag
next to the name tells you exactly which one you are pointing at. You can even
point at a single light in the **DIGITAL IO STATUS** row to see which pin and
Grove port it belongs to.

## How to Use

1. **Explore.** Hover over any part of the board or any printed label. On a
   phone or tablet, tap the part instead.
2. **Show hotspots.** Check this box to outline every part you can explore.
   It helps you find small parts like the status LEDs and the crystal.
3. **Quiz Me.** The quiz asks you to find a part by its job, not its name. For
   example: "You need to install MicroPython. Which button do you hold?" Click
   the part that answers the question. Your score counts the parts you found on
   your first try.

## Parts You Can Explore

1. **Vin Terminal**: green screw terminal for a 3.6–6 V battery pack
2. **LiPo Battery Connector**: plug for a single-cell rechargeable battery
3. **Power LED**: glows whenever the board has power
4. **On/Off Switch**: turns the board's power on and off
5. **Micro USB Port**: uploads programs and powers the board
6. **Debug Port**: three pins for professional debugging tools
7. **RP2040 Microcontroller**: the brain that runs your program
8. **Crystal**: keeps time for the RP2040 at 12 million ticks per second
9. **DC Motor Terminals**: Motor 1 (GP8, GP9) and Motor 2 (GP10, GP11)
10. **Motor Status LEDs**: show which way each motor is being driven
11. **Motor Test Buttons**: spin a motor at full speed with no code
12. **Motor Driver Chip**: the two H-bridges that power the motors
13. **Servo Ports**: four RC servos on GP12–GP15
14. **GPIO Status Indicator LEDs**: 13 lights that show HIGH or LOW on the Grove pins
15. **Grove Ports**: seven plug-in sensor ports
16. **Piezo Buzzer**: beeps and tones on GP22
17. **Buzzer Mute Switch**: silences the buzzer without changing code
18. **RGB LEDs**: two NeoPixel color lights on GP18
19. **Programmable Buttons**: two buttons your code reads on GP20 and GP21
20. **Reset Button**: restarts your program
21. **Boot Button**: puts the board in firmware-loading mode

## Maker Pi RP2040 or Robo Pico?

Some of our kits use the [Cytron Robo Pico](../cytron-robo-pico-overlay/index.md)
instead. The two boards are close cousins. They use the same pins for the
motors, servos, buzzer, RGB LEDs, buttons, and Grove ports, so the same
`config.py` pin names work on both.

| | Maker Pi RP2040 | Robo Pico |
|---|---|---|
| Brain | RP2040 chip built into the board | A Pico, Pico W, Pico 2, or Pico 2 W that you plug in |
| WiFi and Bluetooth | No | Yes, with a Pico W or Pico 2 W |
| USB port | On the board | On the plugged-in Pico |
| Extras | Boot button, Debug port | Maker Port, GPIO breakout headers |

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- What a GPIO pin is, and the pin names in `config.py`
- The difference between a digital input and a digital output
- [Chapter 2: Hardware Platform and Assembly](../../chapters/02-hardware-platform-assembly/index.md), which introduces the RP2040 and the Maker Pi RP2040 board

### Learning Objective

Students will be able to **explain** (Bloom's Taxonomy: Understand) what each
part of the Cytron Maker Pi RP2040 board does in a robot and identify the GPIO
pins it uses.

### Activities

1. **Predict first (3 min).** Before hovering, students pick three parts from
   the printed labels and write one sentence guessing what each part does.
2. **Explore (6 min).** Students hover every part and check their predictions.
   Ask them to record the GPIO pins for the motors, servos, buzzer, and RGB LEDs,
   and compare them with the pin names in their kit's `config.py`.
3. **Find the brain (3 min).** Students find the two unlabeled parts, the
   RP2040 and the crystal, and explain why a robot needs each one.
4. **Quiz (5 min).** Students run Quiz Me and try for a perfect first-try score.
   The quiz asks about jobs, not names, so it checks understanding rather than
   label reading.

### Assessment

- **Exit ticket:** "Your robot's wheels don't move when your program runs. List
  three parts on the board you would check, in order, and say why."
  *Strong answers* mention the power LED or on/off switch, the motor status LEDs
  (to see if the code is driving the motor), and the motor test buttons (to see
  if the motor and its wiring work).
- **Rubric (4-point):** *Exemplary* explains the job of every part, connects
  each to its GPIO pins, and uses the status LEDs and test buttons as debugging
  tools. *Proficient* explains the job of most parts and names the motor and
  sensor pins. *Developing* names parts but confuses their jobs, such as mixing
  up the Reset and Boot buttons. *Beginning* can find parts only by reading the
  printed labels.

### Calibrating the Hotspots

Instructors who swap in a new board image can open `main.html?edit=true`. Every
hotspot is outlined, and holding **Shift** while dragging on the image measures
a new rectangle in image percentages. Copy the result into `data.json`. Other
pages can link straight to one part with `main.html?part=<id>`, for example
`main.html?part=boot-button`.

## References

1. [Cytron Maker Pi RP2040 Datasheet (Rev 1.2)](https://www.farnell.com/datasheets/3685790.pdf) - board functions, Grove port pin table, motor driver ratings, and the motor truth table used in this MicroSim.
2. [Maker Pi RP2040 product page (Cytron)](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) - overview of the board's features.
3. [RP2040 datasheet (Raspberry Pi)](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf) - details of the RP2040 microcontroller, its clocks, and its debug port.
4. [Chapter 3: MicroPython and Development Environment Setup](../../chapters/03-micropython-dev-environment/index.md) - flashing MicroPython with a UF2 file.
5. [Cytron Robo Pico Board Explorer](../cytron-robo-pico-overlay/index.md) - the matching overlay for the Robo Pico board.
