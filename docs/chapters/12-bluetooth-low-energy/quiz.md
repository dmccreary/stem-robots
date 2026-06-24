# Quiz: Bluetooth Low Energy Fundamentals

Test your understanding of BLE advertising, GATT protocol, central/peripheral roles, and multi-robot communication with these questions.

---

#### 1. What is the key advantage of BLE over WiFi for direct robot-to-robot communication in a classroom?

<div class="upper-alpha" markdown>
1. BLE supports higher data throughput — it transfers large sensor logs faster than WiFi
2. BLE connects devices directly without needing a router, uses less power, and has lower latency
3. BLE operates on a different frequency band that avoids interference with other classroom devices
4. BLE requires no code to set up — it pairs automatically when two robots are powered on
</div>

??? question "Show Answer"
    The correct answer is **B**. BLE connects two robots directly as a peer-to-peer link — no router is required. This is critical in environments where the school WiFi is restricted or unavailable for student devices. BLE also consumes far less power (~0.3 mA idle vs. ~80 mA for WiFi transmitting) and has lower latency (1–10 ms vs. 10–50 ms). BLE is slower than WiFi in data rate, which is fine for short command strings.

    **Concept Tested:** BLE vs WiFi Comparison

---

#### 2. How does BLE advertising work?

<div class="upper-alpha" markdown>
1. Advertising is a one-time handshake sent only when a connection is first requested
2. A BLE device in advertising mode repeatedly broadcasts small packets on special channels, announcing its presence and name
3. Advertising packets carry full motor command payloads directly to all nearby devices
4. Advertising only works indoors — outdoor environments require scanning mode
</div>

??? question "Show Answer"
    The correct answer is **B**. BLE advertising is a continuous broadcast: the device sends small packets (typically every 100–1000 ms) on three dedicated radio channels. These packets contain the device name and optionally a Service UUID. Any BLE scanner nearby can receive them without any pairing or prior agreement. Advertising is one-directional — the advertiser does not know who is listening. Actual data exchange requires a connection.

    **Concept Tested:** BLE Advertising

---

#### 3. In a two-robot BLE setup, which robot is the PERIPHERAL and what does it do?

<div class="upper-alpha" markdown>
1. The peripheral is the faster robot that initiates the connection and sends movement commands
2. The peripheral is the follower robot — it advertises, hosts the GATT services, and responds to commands from the central
3. The peripheral is the robot with the longer antenna range that scans for all other robots
4. The peripheral is whichever robot has a lower battery level at the time of connection
</div>

??? question "Show Answer"
    The correct answer is **B**. In BLE, the peripheral advertises its presence and hosts the GATT server containing Services and Characteristics. In the course's two-robot setup, the follower robot is the peripheral — it broadcasts "RobotFollower," accepts the leader's connection, and waits for commands written to its Command Characteristic. The central (leader) scans, initiates the connection, and writes commands.

    **Concept Tested:** BLE Peripheral Role

---

#### 4. What is GATT, and how does it organize data on a BLE device?

<div class="upper-alpha" markdown>
1. GATT is the radio frequency protocol that controls timing between BLE packets
2. GATT (Generic Attribute Profile) organizes data into Services (categories) that contain Characteristics (individual data slots)
3. GATT is the security layer that encrypts all BLE communication between paired devices
4. GATT is the scanning algorithm that selects the strongest signal from multiple nearby devices
</div>

??? question "Show Answer"
    The correct answer is **B**. GATT (Generic Attribute Profile) is the data model for BLE communication after two devices connect. It is a hierarchy: a GATT Service groups related data (like a "Robot Control Service"), and each Service contains one or more Characteristics (individual data values, like a "Command Characteristic"). The central reads from or writes to Characteristics to exchange data with the peripheral.

    **Concept Tested:** GATT Protocol / GATT Service Definition

---

#### 5. What is a UUID in the context of BLE GATT services?

<div class="upper-alpha" markdown>
1. A Universal User Interface Display — the screen shown during BLE pairing
2. A Universally Unique Identifier — a long number that uniquely identifies a specific Service or Characteristic type
3. A Unit Update Index Device — a counter that increments each time data is written
4. A shared security key that both robots must use to authenticate the connection
</div>

??? question "Show Answer"
    The correct answer is **B**. A UUID (Universally Unique Identifier) is a 128-bit number expressed as a hex string like `"12345678-1234-5678-1234-56789abcdef0"`. UUIDs ensure that custom Services and Characteristics are globally unique — your "Robot Command Service" UUID will not conflict with any standard Bluetooth service or any other custom service. Both the central and peripheral must use the same UUID to refer to the same Characteristic.

    **Concept Tested:** GATT Service Definition / GATT Characteristic

---

#### 6. In MicroPython's `bluetooth` module, what does `ble.irq(handler)` do?

<div class="upper-alpha" markdown>
1. It starts the BLE radio and begins advertising immediately
2. It registers a callback function that is automatically called when BLE events occur (connection, disconnection, data written)
3. It sets the interrupt priority level for the BLE radio hardware
4. It imports the IRQ event code constants needed for writing interrupt handlers
</div>

??? question "Show Answer"
    The correct answer is **B**. `ble.irq(handler)` registers a single callback function that MicroPython calls whenever a BLE event fires. The handler receives an `event` code and associated `data` for each event. Event codes distinguish between a central connecting (`_IRQ_CENTRAL_CONNECT`), a central disconnecting (`_IRQ_CENTRAL_DISCONNECT`), and data being written to a characteristic (`_IRQ_GATTS_WRITE`). All BLE events are routed through this one callback function.

    **Concept Tested:** bluetooth Module

---

#### 7. What should the peripheral robot do when it receives a `_IRQ_CENTRAL_DISCONNECT` event?

<div class="upper-alpha" markdown>
1. Power off the BLE radio to conserve battery
2. Send a final status message to the central before closing
3. Call `advertise()` again so a new central can discover and connect to it
4. Switch roles and begin scanning as a central to find the previous device
</div>

??? question "Show Answer"
    The correct answer is **C**. When the central disconnects (intentionally or due to range loss), the peripheral loses its connection and can no longer receive commands. Restarting advertising immediately makes the robot discoverable again so the leader can reconnect, or a new central can connect. Without this, the peripheral sits in a permanently disconnected state with no way to receive new connections.

    **Concept Tested:** BLE Connection Pairing / BLE Peripheral Role

---

#### 8. What is the primary cause of BLE reliability issues in a classroom, and what is the best mitigation?

<div class="upper-alpha" markdown>
1. BLE packets are too large — command strings must be under 5 characters
2. Too many robots advertising simultaneously creates address collisions on the bus
3. Physical obstacles and 2.4 GHz interference — keeping robots within 5 m provides near-perfect reliability
4. The MicroPython bluetooth module introduces delays that drop packets above 10 messages per second
</div>

??? question "Show Answer"
    The correct answer is **C**. BLE reliability drops with distance, physical obstructions (walls, metal shelving), and interference from other 2.4 GHz devices (WiFi, other robots). The chapter recommends staying under 5 m for classroom use, where you should get near-perfect reliability. Packet loss at short distances is rare. Command strings are short enough that BLE's 20-byte payload limit is not an issue.

    **Concept Tested:** BLE Reliability / BLE Range and Power

---

#### 9. How does BLE differ from Classic Bluetooth, and why is BLE the better choice for sending robot commands?

<div class="upper-alpha" markdown>
1. BLE has a longer maximum range than Classic Bluetooth but requires a router
2. BLE is designed for small, infrequent data bursts with very low power use; Classic Bluetooth is designed for continuous audio streaming with higher power draw
3. BLE supports encrypted communication; Classic Bluetooth transmits all data in plain text
4. BLE is a newer protocol that completely replaces Classic Bluetooth in all use cases
</div>

??? question "Show Answer"
    The correct answer is **B**. Classic Bluetooth (BR/EDR) was designed for continuous streaming — audio, file transfer — and uses significantly more power. BLE was designed for infrequent small packets (sensor readings, commands) with very low power consumption, allowing devices to run for months on a coin cell. For sending short command strings like "FORWARD" or "STOP" between robots, BLE's design matches the use case perfectly. Both variants are still used — BLE does not replace Classic for audio.

    **Concept Tested:** BLE vs Classic Bluetooth

---

#### 10. Analyze this BLE design: the leader robot's `send_command("FORWARD")` call succeeds only when `conn_handle is not None and value_handle is not None`. What does this condition prevent?

<div class="upper-alpha" markdown>
1. It prevents sending duplicate commands if the button is pressed twice quickly
2. It prevents attempting to write a command before a connection is established and the characteristic handle is discovered
3. It prevents sending commands with strings longer than 20 bytes to avoid BLE payload overflow
4. It prevents the leader from sending commands while the follower's motors are already running
</div>

??? question "Show Answer"
    The correct answer is **B**. `conn_handle` is `None` until the central successfully connects to the peripheral. `value_handle` is `None` until the central discovers the Command Characteristic's handle through service discovery. Calling `gattc_write()` with a `None` handle raises an exception and crashes the program. The guard condition ensures `send_command()` only executes when a valid, complete BLE connection exists — a defensive programming pattern for reliable wireless code.

    **Concept Tested:** BLE Message Sending / BLE Central Role

---
