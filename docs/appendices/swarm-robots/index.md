# Swarm Robotics Cluster — Design Report

**Platform:** Raspberry Pi Pico W (WiFi + Bluetooth)
**Concept:** One master robot broadcasts its heading; follower robots independently steer to match it.

## 1. Core Concept

Rather than tracking the master's *position* (which requires localization and is hard to get right), each follower matches the master's **heading**. The master broadcasts its current heading over the network at a fixed rate. Each follower reads its own gyroscope + magnetometer, computes its own heading, and runs a closed-loop controller to steer toward the broadcast target. This makes "follow the leader's turns" a heading-synchronization problem rather than a full swarm-positioning problem — much easier to build and debug in a classroom setting.

## 2. Hardware Per Robot

- Raspberry Pi Pico W (RP2040 + CYW43439 radio)
- 9-DOF IMU (see comparison below)
- Motor driver: TB6612FNG (preferred over L298N — more efficient, cleaner PWM)
- Two DC gear motors + wheels + caster, simple chassis
- LiPo battery + buck/boost regulator for the 5V logic rail

Note: the Pico W's WiFi and Bluetooth both run on the CYW43439 chip, but Bluetooth (BLE) support depends on the SDK/firmware build in use — confirm the `.uf2` build supports BLE if the class wants to experiment with it later.

## 3. Communication: WiFi UDP Broadcast

Simplest approach for a first swarm project:

- Master Pico W runs in **Access Point mode**, creating its own local WiFi network.
- Master broadcasts small UDP packets (e.g. `{"heading": 137.4, "speed": 0.6}`) at a fixed rate — 20–50 Hz is plenty.
- Followers join the AP, open a UDP socket, and just listen — no handshaking or reconnect logic needed.
- Dropped packets don't break anything — the next one arrives 20–50 ms later.

BLE advertising (broadcast-only, no pairing) is a reasonable alternative to compare later, but UDP is easier to get working first.

## 4. Control Loop (same code on every robot)

1. Read gyro + magnetometer, fuse them into a stable heading estimate (a complementary filter is enough — gyro for short-term smoothness, magnetometer to correct long-term drift).
2. Master: broadcast its own heading + desired speed over UDP.
3. Follower: receive target heading, compute error = target − own heading, run a small PID (a proportional term alone often works to start) to set differential motor speeds.
4. Loop at ~20–50 Hz.

Because every robot computes its *own* heading from its *own* sensors, small calibration differences between robots just show up as slightly different turning delays — a useful teaching point about sensor variance.

## 5. Calibration

- Magnetometers need per-robot hard/soft-iron calibration (spin the robot slowly in place, record min/max readings, compute an offset). Skipping this is the most common reason heading-following demos fail.
- Mount IMUs away from motors — motor magnets distort magnetometer readings, a subtle bug students will hit if the IMU sits too close to a DC motor.

## 6. Suggested Build Order

1. Get one robot reading a stable fused heading (calibrate mag, tune complementary filter) — a good first milestone on its own.
2. Get master → single follower UDP link working with a fixed test heading.
3. Add live master heading broadcast + follower PID steering.
4. Scale to 3+ followers (UDP broadcast makes this free — no code changes needed).
5. Extension ideas: forward speed matching, obstacle avoidance, loose formation offsets.

## 7. IMU Comparison

The class solders their own sensor boards regularly, so solderless connectors are not a deciding factor here — cost and library support matter more.

| Sensor | Price (each) | Sensor fusion | Connector | MicroPython support | Notes |
|---|---|---|---|---|---|
| ICM-20948 | $14.95 (Adafruit) / ~$18–20 (SparkFun) | Raw data + onboard DMP (optional) | STEMMA QT / Qwiic, solderless | Good — several community libraries | Successor to the discontinued MPU-9250; accel/gyro + AK09916 magnetometer in one package. Best balance of price and teachability. |
| BNO085 | $19.95 (Adafruit) | Built-in — outputs orientation directly | STEMMA QT / Qwiic, solderless | Thin — mostly Arduino/CircuitPython | Fastest path to a working demo since sensor fusion is done onboard. |
| BNO055 | $34.95 (Adafruit) | Built-in | STEMMA QT / Qwiic, solderless | Thin — mostly Arduino/CircuitPython | Same idea as BNO085 at a higher price — no real upside over it. |
| LSM9DS1 | ~$19.95 (Adafruit) | Raw data only | STEMMA QT / Qwiic, solderless | Reasonable | Solid raw-data option if students are building their own filter. |
| L3GD20 + LSM303D | ~$4 (clone boards) | Raw data only | Pin header, solder required | Community libraries for each chip separately | Two separate chips (gyro + accel/mag), so two libraries instead of one. At this price, a strong pick for outfitting a full class of robots. |
| MPU-9250 / GY-91 clone | ~$6–10 (generic) | Raw data only | Pin header, solder required | Widely used, many tutorials | Cheap, but inconsistent QC and a known-finicky magnetometer (AK8963). |

### Recommendation

Given the class already solders sensor boards, the **L3GD20 + LSM303D** is a strong choice: roughly a quarter of the price of the STEMMA QT options, with comparable sensing capability for this project. The main added cost is software — two separate I2C devices and two libraries to fuse into one heading estimate, which doubles as a useful lesson in combining multi-chip sensor data.

If the priority shifts toward getting a demo running fastest (e.g., a single student prototype under time pressure), the **BNO085 ($19.95)** remains the quickest path, since it outputs a ready-to-use heading with no filter-writing required.

!!! note "Update: the purchased board uses an LSM303DLHC"
    The comparison above follows the seller's listing, which named the accel/mag chip as an LSM303D. The board that arrived actually carries the older **LSM303DLHC**, confirmed on real hardware by an I2C scan and identity checks (`src/kits/9-dof-imu/01-probe.py`). The two parts are not interchangeable: the LSM303D answers at a single I2C address (`0x1D`), while the LSM303DLHC exposes its accelerometer (`0x19`) and magnetometer (`0x1E`) as separate sub-devices with a different register map. The gyroscope is an L3GD20 at `0x6B` as expected, and the board also carries a bonus BMP180 pressure sensor at `0x77` that this project does not use. The recommendation still holds — two chips, two libraries (`src/lib/l3gd20.py` and `src/lib/lsm303dlhc.py`) — but use the [LSM303DLHC datasheet](https://www.st.com/resource/en/datasheet/lsm303dlhc.pdf), not LSM303D references. See [Section 2 of the swarm robot build plan](../../kits/swarm-bot/plan.md#2-imu-identification-and-pinout) and the [9-DOF IMU kit](../../kits/9-dof-imu/index.md) for the confirmed wiring.
