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

The **trigger-echo** protocol controls the HC-SR04. Before the code, here is what each step does: you send a brief HIGH pulse on the Trigger pin (10 microseconds). The sensor emits 8 sound pulses. When the echo returns, the Echo pin goes HIGH for a duration proportional to the distance. You measure that duration and convert it to distance.

```python
from machine import Pin
from time import sleep_us, ticks_us, ticks_diff

trigger = Pin(config.ULTRASONIC_TRIGGER_PIN, Pin.OUT)
echo    = Pin(config.ULTRASONIC_ECHO_PIN,    Pin.IN)

def read_ultrasonic_cm():
    trigger.low()
    sleep_us(2)
    trigger.high()
    sleep_us(10)          # 10 µs trigger pulse
    trigger.low()

    while echo.value() == 0:   # wait for echo to start
        pass
    start = ticks_us()

    while echo.value() == 1:   # wait for echo to end
        pass
    duration_us = ticks_diff(ticks_us(), start)

    distance_cm = duration_us / 58   # speed of sound constant
    return distance_cm
```

The constant 58 comes from: speed of sound ≈ 343 m/s = 0.0343 cm/µs. Round trip distance = duration × 0.0343, so one-way distance = duration / 58.

---

## Infrared Sensor

An **infrared sensor** (IR sensor) detects nearby surfaces by emitting infrared light and detecting the reflection. It outputs a digital signal: LOW when a surface is detected (within ~1–10 cm), HIGH when nothing is detected.

### IR Digital Output

The IR sensor connects to a regular GPIO input pin, not an I2C bus:

```python
ir_left  = Pin(config.IR_LEFT_PIN,  Pin.IN)
ir_right = Pin(config.IR_RIGHT_PIN, Pin.IN)

left_detected  = ir_left.value()   # 0 = detected, 1 = not detected
right_detected = ir_right.value()
```

Note: most IR sensors are **active LOW** — they output 0 (LOW) when detecting a surface, not 1. This is counterintuitive — check your sensor's datasheet.

### IR Sensor Calibration

IR sensors are sensitive to surface color and ambient light. A white surface reflects more IR than a black surface. **IR calibration** means finding the threshold at which your specific sensor reliably switches state.

Test with the robot over a white surface, then a black surface. Note the ADC reading (if your module has an analog output) or the distance at which the digital output switches. Adjust the sensor's sensitivity trimmer potentiometer (the small dial on the sensor module) until it switches cleanly at the desired distance.

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

