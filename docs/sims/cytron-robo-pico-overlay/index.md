---
title: "Cytron Robo Pico Board Explorer"
description: "Hover over any part of the Cytron Robo Pico robotics board to learn what it does, then take a quiz that asks you to find each part by its job."
image: /sims/cytron-robo-pico-overlay/cytron-robo-pico-overlay.png
og:image: /sims/cytron-robo-pico-overlay/cytron-robo-pico-overlay.png
twitter:image: /sims/cytron-robo-pico-overlay/cytron-robo-pico-overlay.png
social:
   cards: false
status: implemented
library: custom (hover overlay)
hide: toc
bloom_level: Understand (L2) — Explain what each part of the Cytron Robo Pico board does in a robot.
---

# Cytron Robo Pico Board Explorer

<iframe src="main.html" height="962px" width="100%" scrolling="no"></iframe>

[Run the Cytron Robo Pico Board Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/cytron-robo-pico-overlay/main.html"
        height="962px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

The **Cytron Robo Pico** is a robotics board that your Raspberry Pi Pico plugs
into. It adds everything a small robot needs: a motor driver for two wheels,
servo ports, a buzzer, colored lights, buttons, and seven Grove ports for
sensors. Some of our kits, like the [Wi-Fi Bot](../../kits/wifi-bot/index.md),
are built on this board.

This MicroSim is an **interactive overlay** on the Robo Pico pinout diagram.
Every part of the board has an invisible hotspot. So does every printed label
in the margin. Move your pointer over a part, and a description appears below
the drawing. It tells you what the part does, which GPIO pins it uses, and a
practical tip for using it on your robot.

Some parts come in groups, like the seven Grove ports or the four motor test
buttons. When you point at one of them, the whole group lights up. A small tag
next to the name tells you exactly which one you are pointing at, such as
"Grove 4: GP16 and GP17."

## How to Use

1. **Explore.** Hover over any part of the board or any printed label. On a
   phone or tablet, tap the part instead.
2. **Show hotspots.** Check this box to outline every part you can explore.
   It helps you find small parts like the status LEDs.
3. **Quiz Me.** The quiz asks you to find a part by its job, not its name. For
   example: "Your code plays a tone, but the room stays silent. Which part
   should you check first?" Click the part that answers the question. Your
   score counts the parts you found on your first try.

## Parts You Can Explore

1. **Vin Terminal**: green screw terminal for a 3.6–6 V battery pack
2. **LiPo Battery Connector**: plug for a single-cell rechargeable battery
3. **Power LED**: glows whenever the board has power
4. **On/Off Switch**: powers the whole board, including the Pico
5. **DC Motor Terminals**: Motor 1 (GP8, GP9) and Motor 2 (GP10, GP11)
6. **Motor Status LEDs**: show which way each motor is being driven
7. **Motor Test Buttons**: spin a motor at full speed with no code
8. **Motor Driver Chip**: the two H-bridges that power the motors
9. **Servo Ports**: four RC servos on GP12–GP15
10. **Pi Pico Socket**: fits a Pico, Pico W, Pico 2, or Pico 2 W
11. **GPIO Breakout**: female headers that reach every Pico pin
12. **GPIO Status Indicator LEDs**: 13 lights that show HIGH or LOW on the Grove pins
13. **Grove Ports**: seven plug-in sensor ports
14. **Maker Port**: Qwiic and STEMMA QT sensors on GP2 and GP3
15. **Piezo Buzzer**: beeps and tones on GP22
16. **Buzzer Mute Switch**: silences the buzzer without changing code
17. **RGB LEDs**: two NeoPixel color lights on GP18
18. **Programmable Buttons**: two buttons your code reads on GP20 and GP21
19. **Reset Button**: restarts your program

## Which Pico Should You Use?

The Robo Pico socket accepts four different Raspberry Pi boards. They all have
the same size and the same 40-pin layout, so you can pick the one that fits
your project.

| Board | Chip (RAM) | Wireless | Good for |
|-------|------------|----------|----------|
| Pico | RP2040 (264 KB) | None | Low-cost basic robots |
| Pico W | RP2040 (264 KB) | WiFi, Bluetooth | Remote control, web pages |
| Pico 2 | RP2350 (520 KB) | None | Bigger, faster programs |
| Pico 2 W | RP2350 (520 KB) | WiFi, Bluetooth | Speed plus wireless |

Each board needs the MicroPython firmware made for it. When you download the
UF2 file, pick the one with your exact board's name.

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- What a GPIO pin is, and the pin names in `config.py`
- The difference between a digital input and a digital output
- [Chapter 2: Hardware Platform and Assembly](../../chapters/02-hardware-platform-assembly/index.md), which introduces the Pico and a robot controller board

### Learning Objective

Students will be able to **explain** (Bloom's Taxonomy: Understand) what each
part of the Cytron Robo Pico board does in a robot and identify the GPIO pins
it uses.

### Activities

1. **Predict first (3 min).** Before hovering, students pick three parts from
   the printed labels and write one sentence guessing what each part does.
2. **Explore (6 min).** Students hover every part and check their predictions.
   Ask them to record the GPIO pins for the motors, servos, buzzer, and RGB LEDs,
   and compare them with the pin names in their kit's `config.py`.
3. **Choose a Pico (3 min).** Using the Pi Pico Socket table, students pick a
   board for a robot that must be driven from a phone and justify the choice.
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
  up the Grove ports and the servo ports. *Beginning* can find parts only by
  reading the printed labels.

### Calibrating the Hotspots

Instructors who swap in a new board image can open `main.html?edit=true`. Every
hotspot is outlined, and holding **Shift** while dragging on the image measures
a new rectangle in image percentages. Copy the result into `data.json`.

## References

1. [Cytron Robo Pico Datasheet (Rev 1.0)](https://www.farnell.com/datasheets/4248509.pdf) - board functions, Grove port pin table, motor driver ratings, and the motor truth table used in this MicroSim.
2. [Robo Pico product page (Cytron)](https://www.cytron.io/p-robo-pico-simplifying-robotics-with-raspberry-pi-pico) - overview of the board's features.
3. [Raspberry Pi Pico-series documentation](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html) - specifications for the Pico, Pico W, Pico 2, and Pico 2 W.
4. [MicroPython downloads for the Raspberry Pi Pico family](https://micropython.org/download/?vendor=Raspberry%20Pi) - the correct UF2 firmware for each board.
5. [Wi-Fi Bot kit](../../kits/wifi-bot/index.md) - a robot in this course built on the Robo Pico and a Pico W.
