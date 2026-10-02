---
title: Sensors and Data Input
description: Transform the robot into a sensing, responsive system — work with time-of-flight, ultrasonic, infrared, bump switch, and potentiometer sensors, then learn calibration, data filtering, sensor fusion, and the I2C scanner tool.
generated_by: claude skill chapter-content-generator
date: 2026-06-23 14:45:00
version: 0.08
---

# Sensors and Data Input

!!! mascot-welcome "Welcome, maker — let's give your robot eyes and ears!"
    ![Sparky waving](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    So far I can move, but I can't sense the world around me. This chapter adds perception. We'll wire up five different sensor types, learn how to clean up noisy readings, and combine multiple sensors into one smart decision. By the end, I'll know when a wall is approaching — before I hit it.

## Summary

This chapter transforms the robot from a motion machine into a sensing, responsive
system. Students work with every sensor in the course — the VL53L0X time-of-flight
sensor over I2C, ultrasonic trigger/echo sensors, infrared digital sensors, bump
switches, and a potentiometer — and learn calibration techniques (zero offset, scale
factor), data filtering to reduce noise, and sensor fusion to combine readings from
multiple inputs. The I2C scanner tool and SPI vs I2C comparison round out students'
understanding of hardware communication.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Sensor Types Overview
2. Time-of-Flight Sensor
3. VL53L0X Sensor
4. ToF Sensor I2C Setup
5. ToF Distance Reading
6. Zero Distance Calibration
7. Scale Factor Calibration
8. Max Distance Limit
9. Ultrasonic Sensor
10. Ultrasonic Trigger Echo
11. Infrared Sensor
12. IR Digital Output
13. IR Sensor Calibration
14. Bump Switch
15. Microswitch Wiring
16. Potentiometer Input
17. Sensor Calibration Process
18. Sensor Data Filtering
19. Sensor Fusion
20. I2C Scanner Tool
21. SPI vs I2C Comparison

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Hardware Platform and Robot Assembly](../02-hardware-platform-assembly/index.md)
- [Chapter 4: Control Flow, Functions, and Exception Handling](../04-control-flow-functions/index.md)
- [Chapter 5: Data Structures, Modular Programming, and Version Control](../05-data-structures-modular-code/index.md)
- [Chapter 6: Electronics, DC Motors, and Communication Protocols](../06-electronics-motors-protocols/index.md)

---

## Sensor Types Overview

A **sensor** converts a physical quantity — distance, light, heat, force — into an electrical signal your microcontroller can read. Sensors are the robot's inputs. Without them, the robot has no awareness of the world around it.

Every sensor in this course connects to the microcontroller in one of three ways:

- **Digital output** — the sensor reports one of two states: detected or not detected. Infrared sensors and bump switches work this way.
- **Analog output** — the sensor produces a smoothly varying voltage proportional to the measurement. Potentiometers and some light sensors work this way (read with ADC).
- **I2C or SPI** — the sensor communicates over a serial bus with a digital number. The VL53L0X distance sensor works this way.

The table below introduces all five sensor types you will use in this course.

Before the table, here is a key term you'll encounter for each: **range** is how far the sensor can measure. **Resolution** is the smallest change it can detect. **Accuracy** is how close the measurement is to the true value.

| Sensor | Measurement | Connection type | Typical range |
|--------|-------------|----------------|---------------|
| VL53L0X (ToF) | Distance | I2C | 3 – 200 cm |
| Ultrasonic (HC-SR04) | Distance | Digital (trigger/echo) | 2 – 400 cm |
| Infrared (IR) | Surface reflectivity | Digital | ~1 – 10 cm |
| Bump switch | Contact/collision | Digital | Contact only |
| Potentiometer | Rotation angle | Analog (ADC) | 0° – 270° |

---

## Time-of-Flight Sensor — VL53L0X

The **time-of-flight sensor** (ToF) is the primary distance sensor on this robot. It measures distance by emitting a brief pulse of infrared laser light and timing how long the pulse takes to bounce off an object and return. That elapsed time, divided by the speed of light, gives the distance.

The **VL53L0X** is the specific ToF sensor model used in this course. It is made by STMicroelectronics and communicates over I2C. Its key advantages over simpler sensors are accuracy (±3% at short range), speed (measurements up to 50 times per second), and a small beam angle (approximately 25°) that gives focused forward readings.

### ToF Sensor I2C Setup

Setting up the VL53L0X requires the `vl53l0x.py` driver library — a MicroPython module that handles the complex initialization sequence for this sensor. Copy `vl53l0x.py` to your robot's flash storage first. Then:

Before the code, here is what the parameters mean: `I2C(0, ...)` selects I2C bus 0, `scl=Pin(17)` sets the clock pin, `sda=Pin(16)` sets the data pin, and `freq=400000` sets 400 kHz Fast mode. `VL53L0X(i2c)` initializes the sensor on that bus.

```python
from machine import I2C, Pin
import vl53l0x
import config

i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN),
             freq=400000)

tof = vl53l0x.VL53L0X(i2c)
print("ToF sensor ready")
```

### ToF Distance Reading

To read a distance, call the sensor's `read()` method. It returns a raw value in millimeters:

```python
raw_mm = tof.read()
distance_cm = raw_mm / 10    # convert mm to cm
print(f"Distance: {distance_cm:.1f} cm")
```

### Zero Distance Calibration and Scale Factor

No sensor is perfect. The VL53L0X has two calibration sources of error: a **zero distance offset** and a **scale factor** error.

**Zero distance calibration** corrects for the sensor reporting a non-zero distance when an object is touching it. Place an object at exactly 0 cm, read the sensor, and subtract that reading from all future readings:

```python
zero_offset = tof.read()   # record reading at 0 cm
```

**Scale factor calibration** corrects for readings that scale incorrectly across distance. Place an object at a known distance (say 100 mm). If the sensor reports 92 mm instead of 100 mm, the scale factor is `100/92 = 1.087`. Multiply all future readings by this factor:

```python
scale_factor = 1.087   # measured calibration constant
corrected_mm = (raw_mm - zero_offset) * scale_factor
```

### Max Distance Limit

The VL53L0X has a **max distance limit** — about 200 cm under good conditions, less in bright ambient light. When the object is beyond range, the sensor returns a very large number (often 8190 or similar). Always check for out-of-range values:

```python
MAX_RANGE_MM = 1500   # treat anything over 150 cm as "out of range"

raw_mm = tof.read()
if raw_mm > MAX_RANGE_MM:
    print("Out of range")
else:
    print(f"Distance: {raw_mm / 10:.1f} cm")
```

---

## Ultrasonic Sensor

An **ultrasonic sensor** measures distance by emitting a burst of sound (above human hearing range) and timing the echo. The most common model is the **HC-SR04**, which has two elements: a transmitter and a receiver.

### Ultrasonic Trigger-Echo Operation

The **trigger-echo** protocol controls the HC-SR04. Before the code, here is what each step does: you send a brief HIGH pulse on the Trigger pin (10 microseconds). The sensor emits 8 sound pulses and sets the Echo pin HIGH. When the echo returns, the Echo pin goes back LOW. So the time Echo stays HIGH is the round-trip time: out to the object and back. You measure that time and convert it to distance.

```python
from machine import Pin
from time import sleep_us, ticks_us, ticks_diff
import config

trigger = Pin(config.TRIGGER_PIN, Pin.OUT)
echo    = Pin(config.ECHO_PIN,    Pin.IN)

def read_ultrasonic_cm():
    trigger.low()
    sleep_us(2)
    trigger.high()
    sleep_us(10)          # 10 µs trigger pulse
    trigger.low()

    while echo.value() == 0:   # wait for the sound to go out (Echo goes HIGH)
        pass
    start = ticks_us()

    while echo.value() == 1:   # wait for the echo to come back (Echo goes LOW)
        pass
    duration_us = ticks_diff(ticks_us(), start)

    distance_cm = duration_us / 58   # speed of sound constant
    return distance_cm
```

The constant 58 comes from: speed of sound ≈ 343 m/s = 0.0343 cm/µs. Round trip distance = duration × 0.0343, so one-way distance = duration / 58.

Sound is fast, but it is slow enough to time. The MicroSim below shows the trigger pulse, the sound burst, and the echo pin on one timeline. Move the obstacle and watch the echo pulse get longer or shorter.

#### Diagram: Ultrasonic Echo Timing Explorer

<iframe src="../../sims/ultrasonic-echo-timing-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>
[Run Ultrasonic Echo Timing Explorer Fullscreen](../../sims/ultrasonic-echo-timing-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim showing the trigger pulse, sound travel, echo pulse, and distance math</summary>
Type: microsim
**sim-id:** ultrasonic-echo-timing-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** learning-micropython / ultrasonic-ranging (https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/ultrasonic-ranging). Keep the trigger, echo, and distance idea. Add the pin-level timeline, the `duration_us / 58` math, and the out-of-range cases for the robot's HC-SR04.

Learning objective: Apply (Bloom L3) — the student can convert an echo pulse duration in microseconds into a distance in centimeters, and can explain why the constant 58 appears in `read_ultrasonic_cm()`.

Canvas layout: Width fills the page (up to 700 px). Height 480 px. The top 40% is a side view of the robot and an obstacle. The middle 35% is a timeline with two signal rows. The bottom 25% holds the controls and the math readout.

Visual elements:
- Side view: a small robot on the left with two round HC-SR04 "eyes". A wall on the right is dragged left or right. Curved blue arcs travel from the robot to the wall (outgoing) and orange arcs travel back (echo). The arcs animate in slow motion.
- Timeline row "Trigger pin": a 10 µs HIGH pulse at the start, labeled "10 µs trigger".
- Timeline row "Echo pin": goes HIGH when the sound burst is sent and drops LOW when the echo returns, so it stays HIGH for the round trip time, labeled "Echo HIGH: 1166 µs".
- Math readout, filled with real numbers: "duration_us = 1166", "distance_cm = 1166 / 58 = 20.1 cm".
- A note under the math: "58 comes from 2 x 1 / 0.0343 cm per µs".

Interactive controls:
- Distance slider, 2 to 450 cm, step 1, default 20. Dragging the wall changes it too.
- Dropdown "Air temperature": 0 C, 20 C, 30 C. It sets the speed of sound to 331 m/s, 343 m/s, and 349 m/s. Default 20 C.
- Checkbox "Soft surface (weak echo)". It makes the echo fade and can cause a missed echo.
- Button "Fire sensor" replays one full measurement.

Behavior:
- Round-trip time in µs = 2 x distance_cm / speed_cm_per_us. At 343 m/s, speed = 0.0343 cm/µs.
- The code always uses distance = duration_us / 58, so a second line shows "True distance" next to "Code says". At 30 C sound is faster, so the echo is shorter and the code underestimates by about 2 percent. At 0 C it overestimates by about 3 percent. The sim shows that difference.
- If the distance is under 2 cm or over 400 cm, the Echo row shows no HIGH pulse. The readout says "No valid echo - your code would wait forever! Add a timeout."
- With "Soft surface" checked and distance over 250 cm, the echo is lost in the same way.
- The animation slows the sound to a visible speed, and a label says "Slowed down about 1,000,000 times".

Default state: Wall at 20 cm, 20 C, soft surface off. The Echo pulse is about 1166 µs, and the readout says 20.1 cm.

Assessment/Challenge: The echo pin stays HIGH for 2900 µs. How far away is the wall? (Answer: 2900 / 58 = 50 cm.) Then move the wall to 500 cm. What happens, and what code would protect the robot? (Answer: No echo comes back. A timeout in the `while echo.value() == 0` loops stops the robot from hanging.)

Responsive: redraw on window resize.
</details>

The Trigger and Echo rows in the sim match the two GPIO pins in `config.py`. When the robot reads a distance, `read_ultrasonic_cm()` waits for the Echo row to go HIGH and times how long it stays HIGH. If the sim shows no echo, your real code needs a timeout too.

---

## Infrared Sensor

An **infrared sensor** (IR sensor) detects nearby surfaces by emitting infrared light and detecting the reflection. It outputs a digital signal: LOW when a surface is detected (within ~1–10 cm), HIGH when nothing is detected. A black surface soaks up most of the light, so the sensor reads it the same as "nothing there".

### IR Digital Output

The IR sensor connects to a regular GPIO input pin, not an I2C bus:

```python
from machine import Pin
import config

ir_left  = Pin(config.LEFT_SENSOR_PIN,  Pin.IN)
ir_right = Pin(config.RIGHT_SENSOR_PIN, Pin.IN)

left_value  = ir_left.value()   # 0 = detected (white), 1 = not detected (black or nothing)
right_value = ir_right.value()
```

Note: most IR sensors are **active LOW** — they output 0 (LOW) when detecting a surface, not 1. This is counterintuitive — check your sensor's datasheet. On a line-following robot, this means a sensor reads 0 over a white floor and 1 over a black line.

### IR Sensor Calibration

IR sensors are sensitive to surface color and ambient light. A white surface reflects more IR than a black surface. **IR calibration** means finding the threshold at which your specific sensor reliably switches state.

Test with the robot over a white surface, then a black surface. Note the ADC reading (if your module has an analog output) or the distance at which the digital output switches. Adjust the sensor's sensitivity trimmer potentiometer (the small dial on the sensor module) until it switches cleanly at the desired distance.

An IR sensor turns a smooth signal into a yes-or-no answer. The MicroSim below shows how. It draws how much light bounces back from different surfaces, and where the threshold line turns that into 0 or 1.

#### Diagram: IR Reflectance Threshold Explorer

<iframe src="../../sims/ir-reflectance-threshold-explorer/main.html" width="100%" height="472px" scrolling="no"></iframe>
[Run IR Reflectance Threshold Explorer Fullscreen](../../sims/ir-reflectance-threshold-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim showing how surface color, distance, and a threshold decide the IR digital output</summary>
Type: microsim
**sim-id:** ir-reflectance-threshold-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Predict (Bloom L3) — the student can predict whether an active-LOW IR sensor reads 0 or 1 for a given surface and distance, and can set the trimmer threshold so the sensor switches at a chosen distance.

Canvas layout: Width fills the page (up to 700 px). Height 470 px. The left 40% is a side view of the sensor above a surface. The right 60% is a graph. The bottom strip holds the controls and the output readout.

Visual elements:
- Side view: a small IR sensor module with an emitter (red dot) and a detector. Dotted red rays go down to the surface and bounce back. The surface is a rectangle whose color matches the choice (white, gray, black).
- Graph: the X axis is "Distance to surface (cm)" from 0 to 15. The Y axis is "Reflected IR (0 to 100)". One curve per surface: white (blue), gray (green), black (dark gray). The active surface curve is drawn thick.
- A horizontal orange line is the threshold. A dot on the active curve marks the current reading.
- Output box: "Sensor output: 0 (surface detected)" in green, or "Sensor output: 1 (nothing detected)" in red.
- The area of the graph above the threshold is shaded light green, labeled "Detected".

Interactive controls:
- Surface buttons: "White", "Gray", "Black". Default White.
- Distance slider, 0 to 15 cm, step 0.5, default 4.
- Threshold slider (the trimmer dial), 5 to 95, step 1, default 40.
- Checkbox "Bright room" adds 15 points of ambient IR to every reading, capped at 100.
- Button "Auto-calibrate" places the threshold halfway between the black reading and the white reading at the current distance.

Behavior:
- Reflected IR = peak x 100 / (1 + (distance / 4)^2), where peak is 1.0 for white, 0.55 for gray, and 0.15 for black. Add 15 in a bright room, then cap at 100.
- Output = 0 (LOW, detected) if reflected IR >= threshold. Otherwise output = 1. This matches the active-LOW rule.
- Show a "Reads" line with the matching MicroPython: `ir_left.value()` returns 0 or 1.
- Show a warning "Black and white give the same answer here" when the two surfaces produce the same output at the current distance. This teaches why calibration matters.

Default state: White surface, 4 cm, threshold 40. The reading is 50 and the output is 0 (detected).

Assessment/Challenge: With a white surface, find the largest distance where the sensor still reads 0 at threshold 40. (Answer: about 4.9 cm.) Then switch to black at 4 cm. What is the output, and what threshold would let you tell black from white at 4 cm? (Answer: Output 1 with reflected IR 7.5. Any threshold above 7.5 and up to 50 separates them, such as 30.)

Responsive: redraw on window resize.
</details>

The threshold slider is the small trimmer dial on your real IR module. When a line-following robot misbehaves on a new floor, this is the setting you turn. Try white and black at your robot's real sensor height, then set the threshold between them.

---

## Bump Switch

A **bump switch** (also called a tactile sensor or microswitch) detects physical contact. When the robot bumps into an object, the switch presses and sends a signal to the microcontroller.

### Microswitch Wiring

A microswitch has three terminals: Common (COM), Normally Open (NO), and Normally Closed (NC). The most common wiring for robot bumpers:

- Connect COM to a GPIO pin configured with internal pull-up (`Pin.PULL_UP`).
- Connect NO to Ground.

When the robot bumps something, NO connects to COM, pulling the GPIO pin LOW. With the pull-up, it reads HIGH normally and LOW on contact.

```python
bump = Pin(config.BUMP_PIN, Pin.IN, Pin.PULL_UP)

if bump.value() == 0:    # LOW = bumped
    print("Contact detected — reversing!")
```

!!! mascot-tip "Bump switches as a backup"
    ![Sparky pointing up](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The ToF sensor usually prevents collisions before they happen. But the bump switch catches the rare case where the ToF missed something — a transparent object, a low obstacle, or an unexpected side hit. Having both is good engineering: use the ToF for prevention, the bump switch for detection.

Each sensor sees the world in its own way. Some see far and narrow. Some see wide and short. The MicroSim below shows a top-down view of your robot with the sensing area of every distance sensor from this chapter. Place an obstacle and see which sensors notice it.

#### Diagram: Sensor Coverage Comparison

<iframe src="../../sims/sensor-coverage-comparison/main.html" width="100%" height="522px" scrolling="no"></iframe>
[Run Sensor Coverage Comparison Fullscreen](../../sims/sensor-coverage-comparison/main.html){ .md-button }

<details markdown="1">
<summary>Interactive top-down MicroSim comparing ToF, ultrasonic, IR, and bump switch coverage and blind spots</summary>
Type: microsim
**sim-id:** sensor-coverage-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Reuse:** linear-algebra / lidar-point-cloud (https://github.com/dmccreary/linear-algebra/tree/main/docs/sims/lidar-point-cloud). Borrow only the top-down "rays hit an object" drawing style. The sensor shapes and controls are new.

Learning objective: Compare (Bloom L4) — the student can compare the range, beam width, and blind spots of the ToF, ultrasonic, IR, and bump sensors, and can choose which sensors to combine for a task.

Canvas layout: Width fills the page (up to 700 px). Height 520 px. A top-down play area fills the top 80%, with the robot at the bottom center facing up. A control row fills the bottom 20%. Scale: 1 cm = 2 px, so the play area shows about 200 cm of depth.

Visual elements:
- Robot: a blue rounded rectangle about 12 cm wide, with wheels on the sides.
- ToF: a narrow green wedge, 25 degrees wide, reaching 200 cm. A dotted extension marks "3 cm minimum" near the robot.
- Ultrasonic: a wider purple cone, 30 degrees wide, reaching 400 cm (the play area edge is 200 cm, so the cone runs off the top). It has a small dead zone under 2 cm.
- IR (left and right): two tiny orange rectangles at the front corners, each reaching 10 cm straight ahead.
- Bump switch: a red bar across the front edge, reach 0 cm (contact only).
- A legend with the four colors and the ranges from the table above.
- A draggable obstacle: a gray circle, 12 cm across. Sensors that see it light up their wedge and show a distance label. Sensors that miss it stay pale.

Interactive controls:
- Drag the obstacle anywhere in the play area.
- Four checkboxes to turn each sensor on or off: "ToF", "Ultrasonic", "IR", "Bump". All on by default.
- Dropdown "Obstacle type": "Hard wall", "Soft cloth", "Thin table leg", "Glass". Default "Hard wall".
- Button "Drive forward": the robot moves up at 10 cm per second until the bump switch touches the obstacle, then stops.

Behavior:
- A sensor detects the obstacle when the obstacle center is inside its wedge or its range. Use circle-versus-wedge overlap.
- "Soft cloth" hides the obstacle from the ultrasonic sensor, because sound is absorbed. "Glass" hides it from the ToF sensor, because the laser passes through. "Thin table leg" can slip between the narrow ToF wedge and the IR sensors, and only the ultrasonic cone sees it if it is inside the cone.
- Each detecting sensor shows a label such as "ToF: 42 cm". Show "no reading" when nothing is detected.
- A status line says "Detected by N of 4 sensors". If the count is 0 while the obstacle is closer than 30 cm, show "Blind spot!".

Default state: Hard wall obstacle at 80 cm straight ahead. ToF and ultrasonic show a reading. IR and bump show nothing.

Assessment/Challenge: Place the obstacle 8 cm straight ahead of the left front corner, well outside the ToF and ultrasonic wedges. Which sensor notices it? (Answer: The left IR sensor.) Then choose "Glass". Which sensor still works at 50 cm? (Answer: The ultrasonic sensor.)

Responsive: redraw on window resize.
</details>

This is why the robot uses more than one sensor. The ToF sensor watches far ahead. The IR sensors and bump switch cover the short distance and the sides. Later in this chapter you will combine sensors, and this picture shows which combinations cover each other's blind spots.

---

## Potentiometer Input

A **potentiometer** (pot) is a manually adjustable resistor. As you turn the dial, the output voltage changes smoothly from 0 V to 3.3 V. Read it with the ADC.

```python
from machine import ADC, Pin

pot = ADC(Pin(config.POT_PIN))

raw = pot.read_u16()             # 0–65535
voltage = raw * 3.3 / 65535
angle_pct = raw / 65535 * 100   # convert to percentage

print(f"Pot: {angle_pct:.1f}% ({voltage:.2f} V)")
```

Potentiometers are useful for manually adjusting parameters — like setting the collision threshold distance without editing code, or controlling robot speed with a dial.

---

## Sensor Calibration Process

**Sensor calibration** is the process of adjusting sensor readings to match known physical values. All sensors have some error. Calibration reduces that error to an acceptable level.

The general calibration process:

1. **Zero calibration** — measure the sensor at a known reference (zero distance, flat surface). Record this baseline.
2. **Span calibration** — measure at a second known point (maximum range). Calculate the scale factor.
3. **Apply corrections** — subtract the zero offset, multiply by the scale factor, in every reading.

This two-point calibration (zero and span) works for most sensors. More precise calibration uses more reference points and fits a curve.

#### Diagram: Sensor Calibration Two-Point Process


<iframe src="../../sims/sensor-calibration-explorer/main.html" width="100%" height="402px" scrolling="no"></iframe>
[Run Sensor Calibration Two-Point Process Fullscreen](../../sims/sensor-calibration-explorer/main.html)

<details markdown="1">
<summary>Interactive MicroSim showing sensor zero and span calibration</summary>
Type: MicroSim
**sim-id:** sensor-calibration-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Create a p5.js MicroSim with a 700 × 400 canvas. Show a graph with:
- X-axis: "True distance (cm)" from 0 to 200.
- Y-axis: "Sensor reading (cm)" from 0 to 220.
- A diagonal "ideal" line (green) where sensor = true distance.
- A "raw sensor" line (orange) that is offset (starts at a non-zero Y intercept) and has a different slope.
- After clicking "Calibrate", the orange line transforms into a corrected line that overlaps the green ideal line.

Controls:
- "Zero offset" slider: adjusts the Y intercept of the raw sensor line (-20 to +20 cm).
- "Scale factor" slider: adjusts the slope of the raw sensor line (0.8 to 1.2).
- "Calibrate" button: applies the corrections and animates the orange line rotating/shifting to match the green line.
- A "Test point" slider moves a vertical cursor across the graph, showing "Raw: X cm, Corrected: Y cm, Error: Z cm."

Learning objective (Bloom's Taxonomy — Applying): students practice adjusting calibration parameters and observe how they reduce sensor error.

Responsive: redraw on window resize.
</details>

---

## Sensor Data Filtering

Raw sensor readings are noisy. Even with the robot sitting still, the ToF sensor might report 143 cm, then 145 cm, then 141 cm on successive reads. This noise can cause erratic robot behavior if used directly for decisions.

**Sensor data filtering** reduces noise by combining multiple readings. Two common approaches:

**Moving average** — keep the last N readings in a list and return their average:

```python
readings = []

def filtered_distance(new_reading, window=5):
    readings.append(new_reading)
    if len(readings) > window:
        readings.pop(0)        # remove oldest reading
    return sum(readings) / len(readings)
```

**Median filter** — take the median of the last N readings (eliminates spike outliers better than average):

```python
def median_distance(new_reading, window=5):
    readings.append(new_reading)
    if len(readings) > window:
        readings.pop(0)
    sorted_r = sorted(readings)
    return sorted_r[len(sorted_r) // 2]
```

The median filter is better for rejecting single bad readings (spikes). The moving average is smoother but reacts more slowly to real changes. Choose based on your application.

The best way to feel the difference is to try both filters on the same noisy data. The MicroSim below feeds a noisy distance signal into a moving average and a median filter. Change the window size and add spikes to see which filter copes better.

#### Diagram: Sensor Filter Lab

<iframe src="../../sims/sensor-filter-lab/main.html" width="100%" height="502px" scrolling="no"></iframe>
[Run Sensor Filter Lab Fullscreen](../../sims/sensor-filter-lab/main.html){ .md-button }

<details markdown="1">
<summary>Interactive MicroSim comparing raw, moving average, and median filtered ToF readings</summary>
Type: microsim
**sim-id:** sensor-filter-lab<br/>
**Library:** Chart.js<br/>
**Status:** Specified<br/>
**Reuse:** None — new design

Learning objective: Evaluate (Bloom L5) — the student can judge when a moving average or a median filter is the better choice, and can explain how window size trades smoothness against lag.

Canvas layout: Width fills the page (up to 700 px). Height 500 px. A line chart fills the top 70%. A control panel fills the bottom 30%. The chart shows the last 100 readings. The X axis is "Reading number" and the Y axis is "Distance (cm)" from 0 to 200.

Visual elements:
- Gray dots: raw ToF readings.
- Orange line: moving average output (`filtered_distance()`).
- Blue line: median filter output (`median_distance()`).
- A dashed green line: the true distance the sensor is measuring.
- A shaded band over the last N readings shows the current window.
- Legend and a live readout: "Raw noise: 3.1 cm", "Average error: 0.9 cm", "Median error: 0.7 cm", "Lag: 2 readings" for each filter. Error is the average distance from the true value over the last 100 readings.

Interactive controls:
- Slider "Window size", 1 to 15, step 2 (odd numbers only), default 5. It is `window` in the code.
- Slider "Noise", 0 to 10 cm, step 0.5, default 3. Each reading gets random noise within plus or minus this value.
- Slider "Spike chance", 0% to 20%, step 1, default 5. A spike is a reading that jumps 40 to 80 cm away from the true value, like the 8190 out-of-range reading.
- Buttons "Person walks in": the true distance drops from 150 cm to 40 cm in one step. "Reset".
- Checkbox "Show average", checkbox "Show median". Both on by default.

Behavior:
- The chart adds one new reading every 100 ms (10 readings a second).
- True distance starts at 150 cm and stays constant until "Person walks in" changes it to 40 cm.
- Moving average = mean of the last `window` readings. Median = the middle value of the sorted last `window` readings. Both match the chapter's code. With fewer readings than the window, use all readings so far.
- After "Person walks in", measure the number of readings until each filter output is within 10 cm of 40 and show it as "Lag: N readings".
- With window size 1, both filters equal the raw signal.

Default state: Window 5, noise 3 cm, spike chance 5%, true distance 150 cm. The median line stays flat when a spike appears. The average line jumps.

Assessment/Challenge: Set the spike chance to 15% and the window to 5. Which filter stays closer to 150 cm? (Answer: The median filter.) Now set the window to 15 and press "Person walks in". What happens to the lag? (Answer: The lag grows to about 8 readings, so the robot reacts more slowly.)

Responsive: redraw on window resize.
</details>

Your collision code reads the ToF sensor many times a second. A single spike can fool a robot into stopping for no reason. A long window makes it slow to notice a real obstacle. The sim helps you pick a window size that is smooth enough and quick enough for your robot's speed.

---

## Sensor Fusion

**Sensor fusion** means combining readings from multiple sensors to make a more reliable decision. No single sensor is perfect in all conditions. By combining sensors, you compensate for each one's weaknesses.

A simple example: use the ToF sensor for long-range detection (>30 cm) and an IR sensor for short-range confirmation (<10 cm). Both must agree before triggering an emergency stop:

```python
def obstacle_detected(tof_cm, ir_value):
    """Return True if an obstacle is confirmed by two sensors."""
    tof_close = tof_cm < 20        # ToF says close
    ir_detected = ir_value == 0    # IR says detected (active LOW)
    return tof_close and ir_detected
```

More advanced fusion (like a Kalman filter) combines sensor readings mathematically, weighting more reliable sensors higher. For this course, the simple `and` combination above is effective and understandable.

!!! mascot-thinking "Two sensors, one decision"
    ![Sparky thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Requiring two sensors to agree before taking action is called **fault tolerance** — a strategy to prevent false alarms. A single sensor can malfunction. Two sensors rarely fail the same way at the same time. In safety-critical systems, engineers often require three sensors and use a "voting" rule: take action only if at least 2 of 3 agree.

---

## I2C Scanner Tool

When wiring a new I2C sensor, it's helpful to confirm the sensor is connected and responding. The **I2C scanner tool** scans all 127 possible addresses and reports which ones have a device:

```python
from machine import I2C, Pin
import config

i2c = I2C(0, scl=Pin(config.I2C_SCL_PIN),
             sda=Pin(config.I2C_SDA_PIN),
             freq=400000)

devices = i2c.scan()
print(f"Found {len(devices)} I2C device(s):")
for addr in devices:
    print(f"  Address: {hex(addr)}")
```

Run this before using a new sensor. If the device doesn't show up:

1. Check the SDA and SCL wires are not swapped.
2. Check the power (3.3 V and GND) connections.
3. Try reducing the frequency to 100000 (100 kHz).
4. Check the sensor's datasheet for its I2C address.

---

## SPI vs. I2C Comparison

You encountered both I2C and SPI in Chapter 6. Here is a practical comparison focused on your work in this course:

| Feature | I2C | SPI |
|---------|-----|-----|
| Wires needed | 2 (SDA, SCL) | 4 (MOSI, MISO, SCK, CS) |
| Speed | 100–400 kHz | 1–10+ MHz |
| Multiple devices | Address-based (no extra pins) | CS pin per device |
| Which sensors use it | VL53L0X, OLED (mode selectable) | Some displays, SD cards |
| Scanner tool available | Yes (`i2c.scan()`) | No standard equivalent |

For this course: use I2C for all sensors and the OLED display. SPI shows up in library files for other display types but you will rarely write SPI code directly.

---

## Key Takeaways

- The **VL53L0X ToF sensor** measures distance over I2C with high accuracy — calibrate zero offset and scale factor
- **Ultrasonic sensors** use trigger/echo pulses — convert duration to distance with the speed-of-sound constant
- **IR sensors** output digital HIGH/LOW based on surface reflectivity — active LOW, calibrate the sensitivity trimmer
- **Bump switches** detect physical contact using a pull-up resistor and active-LOW wiring
- **Potentiometers** produce analog voltage — read with `ADC.read_u16()` and convert to percentage
- **Calibration** corrects zero offset and scale factor — always calibrate before trusting sensor data
- **Filtering** (moving average, median) smooths noisy readings — choose based on speed vs. outlier rejection
- **Sensor fusion** combines multiple sensors for more reliable decisions
- The **I2C scanner** (`i2c.scan()`) verifies sensor wiring before writing driver code

!!! mascot-celebration "Your robot can now sense its environment!"
    ![Sparky celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Double thumbs-up, maker! You wired up five sensors, learned to calibrate them, filtered their noise, and combined them into smarter decisions. The next chapter gives your robot a voice — a display to show what it's seeing. Then in Chapter 10, we wire sensing and motion together into fully autonomous behavior!

