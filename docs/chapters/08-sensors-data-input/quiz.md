# Quiz: Sensors and Data Input

Test your understanding of sensor types, calibration, data filtering, sensor fusion, and I2C communication with these questions.

---

#### 1. How does the VL53L0X time-of-flight sensor measure distance?

<div class="upper-alpha" markdown>
1. It measures the voltage drop across a variable resistor that changes with proximity
2. It emits a burst of sound and measures how long the echo takes to return
3. It emits a brief infrared laser pulse and times how long it takes to bounce back
4. It detects changes in the magnetic field caused by approaching metal objects
</div>

??? question "Show Answer"
    The correct answer is **C**. The VL53L0X is a time-of-flight sensor that fires a brief pulse of infrared laser light. The sensor measures the round-trip time for that light to reflect off an object and return. Dividing by the speed of light gives the distance. Option B describes an ultrasonic sensor. Option A describes a potentiometer. Option D describes a Hall effect magnetic sensor.

    **Concept Tested:** Time-of-Flight Sensor / VL53L0X Sensor

---

#### 2. What is the purpose of zero distance calibration on the VL53L0X sensor?

<div class="upper-alpha" markdown>
1. It verifies that the sensor reads 0 when it is powered off
2. It corrects for a non-zero baseline reading the sensor reports even when an object is touching it
3. It sets the maximum measurable distance to zero for short-range operation
4. It recalibrates the I2C address if two sensors are connected simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. No sensor is perfect. The VL53L0X may report a small positive distance even when an object is in contact with it. Zero calibration records this offset at a known zero-distance reference and subtracts it from all future readings. This removes the systematic error. Option A describes behavior when powered off (not a calibration). Options C and D do not describe this calibration step.

    **Concept Tested:** Zero Distance Calibration

---

#### 3. An ultrasonic sensor's Echo pin stays HIGH for 870 microseconds after a trigger pulse. Approximately how far away is the obstacle in centimeters?

<div class="upper-alpha" markdown>
1. Approximately 5 cm
2. Approximately 15 cm
3. Approximately 30 cm
4. Approximately 50 cm
</div>

??? question "Show Answer"
    The correct answer is **B**. The distance formula for ultrasonic sensors is `distance_cm = duration_us / 58`. For 870 µs: `870 / 58 ≈ 15 cm`. The constant 58 comes from the speed of sound (~343 m/s or ~0.0343 cm/µs); the round-trip distance halved gives the one-way distance. A result of 30 cm would require about 1740 µs; 5 cm would be about 290 µs.

    **Concept Tested:** Ultrasonic Trigger Echo

---

#### 4. An infrared sensor outputs a LOW (0) signal when the robot is over a black line. What does this design pattern mean for reading the sensor?

<div class="upper-alpha" markdown>
1. LOW means the sensor is malfunctioning and needs to be replaced
2. The sensor is active HIGH — 0 is the idle state when no surface is present
3. The sensor is active LOW — a 0 reading means a surface IS detected
4. LOW output means the robot must slow down to avoid IR interference
</div>

??? question "Show Answer"
    The correct answer is **C**. Most infrared sensors are "active LOW" — they output 0 (LOW) when they detect a surface and 1 (HIGH) when they don't. This is counterintuitive to beginners who expect "detected = 1." Understanding this convention is critical for writing correct line-following logic. The note in the chapter specifically warns: "0 = detected, 1 = not detected" — check your sensor's datasheet to confirm.

    **Concept Tested:** IR Digital Output

---

#### 5. What does a moving average filter do to sensor data?

<div class="upper-alpha" markdown>
1. It removes the oldest sensor readings from the list and replaces them with zeros
2. It averages the last N readings together to smooth out random noise
3. It predicts future sensor values based on the current rate of change
4. It amplifies small sensor differences to make the data more responsive
</div>

??? question "Show Answer"
    The correct answer is **B**. A moving average filter maintains a window of the last N readings and returns their average. This smooths random noise because individual spike readings are diluted by the surrounding normal values. The tradeoff is that the filter introduces lag — it responds more slowly to real sudden changes. The median filter is better at rejecting single outlier spikes.

    **Concept Tested:** Sensor Data Filtering

---

#### 6. What is sensor fusion, and why is it more reliable than using a single sensor alone?

<div class="upper-alpha" markdown>
1. Sensor fusion averages the readings from identical sensors to improve accuracy
2. Sensor fusion combines readings from different sensor types so each compensates for the other's weaknesses
3. Sensor fusion merges sensor data into a single compressed file for faster transmission
4. Sensor fusion synchronizes multiple sensors to update at the same time
</div>

??? question "Show Answer"
    The correct answer is **B**. Sensor fusion combines data from multiple sensor types — such as using a ToF sensor for long-range detection and an IR sensor for close-range confirmation. Each sensor has conditions where it can fail (transparent objects confuse ToF; IR is sensitive to ambient light). Requiring both to agree before triggering a decision compensates for individual failures. Simple averaging of identical sensors (A) is not fusion.

    **Concept Tested:** Sensor Fusion

---

#### 7. What does the `i2c.scan()` function return?

<div class="upper-alpha" markdown>
1. A list of all GPIO pins that are currently configured as I2C
2. A list of hexadecimal addresses for all I2C devices currently connected and responding
3. The current frequency in kHz at which the I2C bus is operating
4. A diagnostic string explaining any wiring errors detected on the bus
</div>

??? question "Show Answer"
    The correct answer is **B**. `i2c.scan()` sends an address probe to each of the 127 possible I2C addresses and records which ones respond. It returns a list of the responding addresses as integers. For example, if the VL53L0X (0x29) and OLED (0x3C) are connected, you get `[41, 60]` (decimal). Converting with `hex()` gives `['0x29', '0x3c']`. This is the first debugging step when an I2C sensor doesn't respond.

    **Concept Tested:** I2C Scanner Tool

---

#### 8. How does a bump switch detect a collision, and what wiring pattern is used?

<div class="upper-alpha" markdown>
1. The switch connects the GPIO pin to 5 V when pressed, triggering a HIGH signal
2. The switch uses I2C to report contact force as a digital reading
3. The switch connects the GPIO pin to ground when pressed; a pull-up resistor holds it HIGH normally
4. The switch breaks the motor power circuit when an obstacle is hit, stopping the robot immediately
</div>

??? question "Show Answer"
    The correct answer is **C**. A microswitch (bump sensor) is wired with an internal pull-up resistor holding the GPIO pin HIGH when nothing is pressed. When the robot contacts an obstacle, the switch's Normally Open contact closes, connecting the pin directly to ground — pulling it LOW. Code reads `0` (LOW) as "bumped." This active-LOW wiring with pull-up is the standard pattern for buttons and bumpers.

    **Concept Tested:** Bump Switch / Microswitch Wiring

---

#### 9. A potentiometer is connected to ADC pin GP26 and returns `read_u16()` value of 32768. What voltage is at the pin, and what percentage of full rotation is that?

<div class="upper-alpha" markdown>
1. 1.65 V, approximately 50%
2. 3.3 V, approximately 100%
3. 0.82 V, approximately 25%
4. 2.48 V, approximately 75%
</div>

??? question "Show Answer"
    The correct answer is **A**. `read_u16()` returns values from 0 to 65535 mapping to 0 V to 3.3 V. A value of 32768 is approximately halfway through the range. Voltage: `32768 / 65535 × 3.3 ≈ 1.65 V`. Percentage: `32768 / 65535 × 100 ≈ 50%`. This midpoint reading (half of 65535) represents the potentiometer dial turned to the center of its rotation range.

    **Concept Tested:** Potentiometer Input

---

#### 10. Why should you always check for out-of-range readings from the VL53L0X sensor?

<div class="upper-alpha" markdown>
1. Out-of-range readings indicate the sensor's I2C address has changed and needs rescanning
2. When the object is beyond the sensor's maximum range, it returns a very large number that would be misinterpreted as a valid close reading without a check
3. Out-of-range readings cause the sensor to enter a low-power sleep mode that must be manually reset
4. The VL53L0X only reports out-of-range errors when the motor is running and creating electrical interference
</div>

??? question "Show Answer"
    The correct answer is **B**. When the VL53L0X cannot detect an object within range (typically because it is too far away or the surface absorbs the laser), it returns a very large number such as 8190. If your code compares this to the `STOP_DIST_CM` threshold without a range check, the robot may behave incorrectly — thinking nothing is close when in reality the sensor simply didn't get a valid reading. Always filter out values above `MAX_RANGE_MM` before using the data.

    **Concept Tested:** Max Distance Limit / ToF Distance Reading

---
