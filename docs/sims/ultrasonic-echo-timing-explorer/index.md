---
title: "Ultrasonic Echo Timing Explorer"
description: "See the HC-SR04 trigger pulse, the sound's round trip, and the Echo pin on one timeline, and convert the echo time in microseconds to centimeters with duration / 58."
image: /sims/ultrasonic-echo-timing-explorer/ultrasonic-echo-timing-explorer.png
og:image: /sims/ultrasonic-echo-timing-explorer/ultrasonic-echo-timing-explorer.png
twitter:image: /sims/ultrasonic-echo-timing-explorer/ultrasonic-echo-timing-explorer.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Ultrasonic Echo Timing Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Ultrasonic Echo Timing Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

An HC-SR04 **ultrasonic sensor** measures distance with sound, much like a bat.
Your code sends a 10 µs pulse on the **Trigger pin**. The sensor then sends
8 quick pulses of sound that are too high for people to hear. It raises the
**Echo pin** to HIGH and keeps it HIGH until the echo comes back.
So the time the Echo pin stays HIGH is the time the sound took to go to the
wall **and back**.

The `read_ultrasonic_cm()` function in
[Chapter 8](../../chapters/08-sensors-data-input/index.md#ultrasonic-trigger-echo-operation)
times that HIGH pulse in microseconds (µs) and divides by 58. Why 58? Sound
moves about 0.0343 cm every microsecond. It travels the distance twice, so one
centimeter of distance takes 2 ÷ 0.0343 ≈ 58 µs.

This MicroSim shows three views that stay in sync:

- The **side view** shows the robot, the wall, and the sound going there and back.
- The **timeline** shows the Trigger pin and the Echo pin, measured in µs.
- The **math box** fills in `distance_cm = duration_us / 58` with real numbers.

Sound is very fast, so the animation slows it down. The label shows how many
times slower it is. Real sound would finish the trip before you could blink.

## How to Use

1. Look at the default: the wall is 20 cm away. Find the Echo HIGH time on the
   timeline (1166 µs). Check the math: 1166 ÷ 58 = 20.1 cm.
2. Click **Fire sensor** to watch one measurement in slow motion. The Echo pin
   stays HIGH while the sound is flying.
3. Move the **Distance** slider, or drag the wall. Before you look at the math
   box, predict the echo time. Then check.
4. Change the **Air temperature**. Sound is faster in warm air, so the echo gets
   shorter. The code still divides by 58, so its answer is a little off. Compare
   "Code says" with "True distance".
5. Move the wall past 400 cm, or check **Soft surface** and move it past 250 cm.
   No echo comes back. What would your code do?

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/ultrasonic-echo-timing-explorer/main.html"
        height="482px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

15–20 minutes

### Learning Objective

Students will *apply* `distance_cm = duration_us / 58` to convert an echo pulse
duration into a distance, and will *explain* why the constant 58 appears in
`read_ultrasonic_cm()` (a round trip at 0.0343 cm/µs).

### Prerequisites

- `while` loops and `ticks_us()`/`ticks_diff()` timing from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- GPIO input and output pins from
  [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md)
- Unit conversion: 1 m = 100 cm and 1 s = 1,000,000 µs

### Activities

1. **Hook (2 min).** Clap once in a large room or gym and ask students how a
   bat or a submarine uses echoes. Introduce the idea of timing an echo.
2. **Read the timeline (4 min).** With the default 20 cm wall, students find
   the Echo HIGH time and do the division by hand. Then they fire the sensor
   and describe, in order, what the Trigger pin, the sound, and the Echo pin do.
3. **Derive 58 (4 min).** Give students the speed of sound, 343 m/s. In pairs
   they convert it to cm/µs (0.0343) and explain why the formula divides by
   2 × (1 / 0.0343) instead of 1 / 0.0343.
4. **Predict and check (4 min).** Students set three distances of their choice,
   predict each echo time with `distance × 58`, and check against the sim.
5. **Break it (3 min).** Students find the two ways to lose the echo (too far,
   and far with a soft surface). Discuss what happens to the `while echo.value() == 1`
   loop, and introduce a timeout such as `machine.time_pulse_us(echo, 1, 30000)`.

### Assessment

- **Challenge:** "The Echo pin stays HIGH for 2900 µs. How far away is the
  wall?" (2900 / 58 = 50 cm.) "Move the wall to 450 cm. What happens, and what
  code would protect the robot?" (No echo; add a timeout to the wait loops.)
- **Explain:** "Why is the answer about 4% too large at 0 °C?" (Sound is slower
  in cold air, so the echo takes longer, but the code still divides by 58.)
- **Rubric (4-point):** *Exemplary* — converts in both directions, derives 58
  from the round trip and 0.0343 cm/µs, and proposes a timeout. *Proficient* —
  converts echo time to distance and explains the round trip. *Developing* —
  converts correctly but cannot explain 58. *Beginning* — divides by 29 or by
  the speed of sound without accounting for units or the round trip.

### Simplifications to Mention

- The Echo pin rises after the 200 µs sound burst, as on the HC-SR04. Some
  modules give up and drop Echo LOW after about 38 ms with no echo; the sim
  keeps it HIGH to show why a timeout matters.
- Real echo strength depends on the wall's angle and size, not only on its
  surface and distance.

## References

1. [Chapter 8: Sensors and Data Input — Ultrasonic Sensor](../../chapters/08-sensors-data-input/index.md#ultrasonic-sensor) — the `read_ultrasonic_cm()` function this MicroSim models.
2. [HC-SR04 Ultrasonic Ranging Module datasheet (SparkFun)](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf) — trigger timing, the 8-cycle 40 kHz burst, and the "uS / 58 = centimeters" formula.
3. [Speed of sound (Wikipedia)](https://en.wikipedia.org/wiki/Speed_of_sound) — why sound moves faster in warm air.
4. [MicroPython `machine.time_pulse_us()`](https://docs.micropython.org/en/latest/library/machine.html) — a built-in way to time the Echo pulse with a timeout.
5. [MicroPython `time` module — `ticks_us()` and `ticks_diff()`](https://docs.micropython.org/en/latest/library/time.html) — the timing functions used in the chapter code.
6. [Ultrasonic Ranging MicroSim (learning-micropython)](https://github.com/dmccreary/learning-micropython/tree/main/docs/sims/ultrasonic-ranging) — the earlier MicroSim this one was adapted from.
