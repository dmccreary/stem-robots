---
title: "Battery Runtime Estimator"
description: "Estimate how long your robot runs on one battery pack by dividing usable capacity by total current, and see how motor duty, the display, NeoPixels, and battery health change the answer."
image: /sims/battery-runtime-estimator/battery-runtime-estimator.png
og:image: /sims/battery-runtime-estimator/battery-runtime-estimator.png
twitter:image: /sims/battery-runtime-estimator/battery-runtime-estimator.png
social:
   cards: false
quality_score: 100
status: implemented
---

# Battery Runtime Estimator

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Battery Runtime Estimator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/stem-robots/sims/battery-runtime-estimator/main.html"
        height="472px"
        width="100%"
        scrolling="no"></iframe>
```

## About This MicroSim

How long will your robot run before the batteries go flat? You can estimate
it with one division:

**runtime (hours) = usable capacity (mAh) ÷ total current (mA)**

**Capacity** is how much charge a battery holds, measured in milliamp-hours
(mAh). **Current** is how fast the robot uses that charge, measured in
milliamps (mA). This MicroSim adds up the robot's loads for you:

| Load | Current |
|------|---------|
| RP2040 microcontroller and sensors | 60 mA |
| OLED display (when on) | 20 mA |
| Two NeoPixels at half brightness (when on) | 30 mA |
| Two motors | 2 × (motor duty ÷ 100) × 250 mA |

Two real-world rules change the usable capacity:

- **Alkaline AA cells** deliver less of their rated capacity at high current.
  Above 300 mA the sim multiplies capacity by 0.7.
- **LiPo packs** must stop at about 3.0 V per cell to avoid damage, so the sim
  uses only 80 percent of the rated capacity. The dashed red line on the gauge
  marks that cutoff.

**Battery health** scales the rated capacity for older, worn batteries. The
formula strip at the bottom shows every number in the calculation, so you can
check your own work. The pack voltage is an approximate value that falls as
the battery drains.

## How to Use

1. Choose a **Battery**: the 4 × AA alkaline pack, or a 2S LiPo pack with
   1000 mAh or 2000 mAh.
2. Set the **Motor duty** (how hard the motors work, 0 to 100 percent) and the
   **Battery health**.
3. Turn the **OLED display** and **NeoPixels** on or off.
4. Read the **Estimated runtime** and the formula strip.
5. Press **Run** to drain the gauge at 1 simulated hour per second. A LiPo pack
   stops at 20 percent with a red **LOW - shut down!** tag. Press **Reset** to
   refill the gauge.

This MicroSim goes with the power management section of
[Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md).

## Lesson Plan

### Grade Level

Grades 8–12 (introductory electronics with a physical robot)

### Duration

15–20 minutes

### Prerequisites

- Battery packs, LiPo cells, and the AA vs. LiPo comparison table (Chapter 6, "Power Management")
- Multiplying and dividing decimals, and converting hours to minutes
- Motors and GPIO pins from [Chapter 2: Hardware Platform and Robot Assembly](../../chapters/02-hardware-platform-assembly/index.md)

### Learning Objective

Students will be able to **calculate** (Bloom's Taxonomy: Apply) battery
runtime by dividing usable capacity by total current, and explain how motor
use changes the answer.

### Activities

1. **Check the default by hand (4 min).** With the default settings, students
   add the loads (60 + 20 + 300 = 380 mA), apply the alkaline rule
   (2000 × 0.7 = 1400 mAh), and divide (1400 ÷ 380 ≈ 3.7 h). They compare
   with the sim.
2. **Change one thing at a time (5 min).** Students record the runtime at
   motor duty 0, 30, 60, and 100 percent, and describe the pattern.
3. **Compare packs (4 min).** At 100 percent duty, students compare the AA
   pack and the 1000 mAh LiPo and explain why the answer surprises many people.
4. **Plan a class session (4 min).** Given a 45-minute lab, students choose a
   pack and a motor duty that leaves at least a 50 percent safety margin.

### Assessment

- **Challenge:** Set motor duty to 100 percent with the OLED on and the
  NeoPixels off. Which lasts longer, the 4 × AA pack or the 2S LiPo 1000 mAh
  pack? *Answer:* the AA pack. It runs about 2.4 hours (2000 × 0.7 ÷ 580 mA)
  and the LiPo runs about 1.4 hours (800 ÷ 580 mA). Then find a pack that would
  last 3 hours at this duty. *Answer:* none of the three, so lower the motor
  duty.
- **Exit ticket:** "Your robot draws 250 mA from a 2000 mAh LiPo at 100 percent
  health. Estimate the runtime." *Answer:* 2000 × 0.8 ÷ 250 = 6.4 hours.
- **Rubric (4-point):** *Exemplary* computes runtime by hand, including the
  derating factor, and explains why motors dominate the current budget.
  *Proficient* computes runtime correctly with the sim's help. *Developing*
  divides capacity by current but forgets the derating or health factor.
  *Beginning* multiplies instead of dividing, or confuses mA with mAh.

## References

1. [Chapter 6: Electronics, DC Motors, and Communication Protocols](../../chapters/06-electronics-motors-protocols/index.md) - battery packs, LiPo safety, and the AA vs. LiPo comparison.
2. [Ampere hour (Wikipedia)](https://en.wikipedia.org/wiki/Ampere_hour) - what milliamp-hours measure and how capacity relates to current and time.
3. [Lithium polymer battery (Wikipedia)](https://en.wikipedia.org/wiki/Lithium_polymer_battery) - LiPo cell voltages and safe discharge limits.
4. [Alkaline battery (Wikipedia)](https://en.wikipedia.org/wiki/Alkaline_battery) - how alkaline capacity drops at high current draw.
5. [Battery Life Calculator (Moving Rainbow)](https://github.com/dmccreary/moving-rainbow/tree/main/docs/sims/battery-life-calculator) - the earlier capacity-over-current MicroSim this one adapts.
