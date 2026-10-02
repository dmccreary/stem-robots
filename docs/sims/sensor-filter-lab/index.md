---
title: "Sensor Filter Lab"
description: "Compare a moving average and a median filter on the same noisy ToF readings, with spikes and a sudden change, and judge which filter is better and how window size trades smoothness against lag."
image: /sims/sensor-filter-lab/sensor-filter-lab.png
og:image: /sims/sensor-filter-lab/sensor-filter-lab.png
twitter:image: /sims/sensor-filter-lab/sensor-filter-lab.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Sensor Filter Lab

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Sensor Filter Lab MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Real sensors are noisy. Even when your robot sits still, the ToF sensor might
read 143 cm, then 145 cm, then 141 cm. Now and then it gives a wild reading, a
**spike**, that is far from the truth. A **filter** combines several readings
to get a better answer.

This lab runs the two filters from
[Chapter 8](../../chapters/08-sensors-data-input/index.md#sensor-data-filtering)
on the same stream of readings:

- The **moving average** (orange) adds up the last few readings and divides by
  how many there are. This is `filtered_distance()`.
- The **median filter** (blue) sorts the last few readings and picks the middle
  one. This is `median_distance()`.

The gray dots are the raw readings. The dashed green line is the true distance.
The shaded band on the right shows the **window**, which is the group of
readings each filter is using right now.

The readout under the chart scores each filter. **Error** is how far, on
average, the output is from the true distance over the last 100 readings.
**Lag** is how many readings a filter needs to get within 10 cm of a new
distance after the person walks in.

## How to Use

1. Look at the chart before you press anything. Find a spike. What does the
   orange line do there? What does the blue line do?
2. Click **Start** to stream new readings, 10 per second. Click **Pause** any
   time to study the chart.
3. Raise **Spike chance** to 15%. Compare the average error and the median
   error.
4. Change **Window size**. The filters instantly recompute on the same readings,
   so you can compare fairly.
5. Click **Person walks in**. The true distance drops from 150 cm to 40 cm.
   Read the lag for each filter. Try again with a window of 3 and a window of 15.
6. Use **Show average** and **Show median** to look at one filter at a time.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/sensor-filter-lab/main.html"
        height="502px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Grades 8–12

### Duration

20–25 minutes

### Learning Objective

Students will *evaluate* when a moving average or a median filter is the better
choice for a robot's distance readings, and will *justify* a window size by
explaining how it trades smoothness (low error) against lag (slow reaction).

### Prerequisites

- Lists, `append()`, `pop()`, `sum()`, and `sorted()` from
  [Chapter 5: Data Structures, Modular Programming, and Version Control](../../chapters/05-data-structures-modular-code/index.md)
- Writing functions with parameters from
  [Chapter 4: Control Flow, Functions, and Exception Handling](../../chapters/04-control-flow-functions/index.md)
- ToF distance readings and the out-of-range value from the
  [Time-of-Flight section of Chapter 8](../../chapters/08-sensors-data-input/index.md#time-of-flight-sensor-vl53l0x)
- Mean and median from middle-school math

### Activities

1. **Warm-up by hand (4 min).** Give students five readings: 148, 151, 149,
   230, 150. They compute the mean (165.6) and the median (150) and discuss
   which one better describes the real distance.
2. **Spikes (5 min).** With window 5, students raise the spike chance from 0%
   to 15% in steps of 5% and record both errors. They should find that the
   median barely changes while the average error grows.
3. **Lag (6 min).** Students press **Person walks in** with windows 3, 7, and
   15 and record the lag for each filter. They should find that lag grows with
   the window, and that the median reacts faster than the average for the same
   window.
4. **Noise without spikes (3 min).** With spike chance 0% and noise 8 cm,
   students compare the two filters again. The moving average is often a little
   smoother here, so neither filter wins every case.
5. **Decide and defend (5 min).** Each pair writes a recommendation for a
   robot that drives at 20 cm per second and must stop 30 cm from a wall:
   which filter and which window, with evidence from the lab.

### Assessment

- **Challenge:** "Set the spike chance to 15% and the window to 5. Which filter
  stays closer to 150 cm?" (The median filter.) "Set the window to 15 and press
  Person walks in. What happens to the lag?" (It grows to about 7 readings for
  the median and about 13 for the average, so the robot reacts later.)
- **Evaluate in writing:** "A robot's ToF sometimes returns 8190 when it loses
  the target. Which filter would you use, and what window? Explain the cost of
  your choice."
- **Rubric (4-point):** *Exemplary* — recommends a filter and window using
  measured error and lag values, and names the trade-off and a case where the
  other filter wins. *Proficient* — picks the median for spiky data and explains
  that bigger windows add lag. *Developing* — picks a filter with evidence from
  only one measurement. *Beginning* — believes a bigger window is always better.

### Simplifications to Mention

- Noise is spread evenly between plus and minus the noise setting. Real sensor
  noise is often bell-shaped.
- Real out-of-range readings such as 8190 are much larger than the 40 to 80 cm
  spikes used here; a median filter rejects them the same way.

## References

1. [Chapter 8: Sensors and Data Input — Sensor Data Filtering](../../chapters/08-sensors-data-input/index.md#sensor-data-filtering) — the `filtered_distance()` and `median_distance()` functions used here.
2. [Moving average (Wikipedia)](https://en.wikipedia.org/wiki/Moving_average) — how a simple moving average smooths data and why it lags.
3. [Median filter (Wikipedia)](https://en.wikipedia.org/wiki/Median_filter) — why the median removes spikes while keeping sharp edges.
4. [Steven W. Smith, *The Scientist and Engineer's Guide to Digital Signal Processing*, Chapter 15: Moving Average Filters](https://www.dspguide.com/ch15.htm) — a free textbook chapter on noise reduction and step response.
5. [Noise (signal processing) (Wikipedia)](https://en.wikipedia.org/wiki/Noise_(signal_processing)) — where sensor noise comes from.
6. [Chart.js line chart documentation](https://www.chartjs.org/docs/latest/charts/line.html) — the charting library used to draw this MicroSim.
