# Introduction to STEM Robot Kits

## Base STEM Robot Bot

This is our low-cost entry-level robot.  It is an open architecture robot
with many ways to enhance it using additional sensors, displays and controls.

- Total cost: $18
- Cytron board: $11
- Chassis Kit: $4
- Time of Flight Distance Sensor: $3

[Base Robot Kit](./base-bot/index.md)

## Base Bot with 8-Element NeoPixel

- Total cost: $19
- Cytron board: $11
- Time of Flight Distance Sensor: $3
- 8 Element NeoPixel Strip

## Display Bot

The display bot is our most popular robot.  It adds a bright $13 OLED display
to the front of the robot so you can see the internal state of the robot
and display faces on the robot.  This does increase the price of the base
robot to around $32 per robot, which is still about 1/10th the price of many
other STEM robot kits such as the Lego Mindstorms robot kit.

[Display Robot](./display-bot/index.md)

## Adjusta Bot

This robot starts with the Display robot and adds three potentiometers so
the parameters of collision avoidance — motor power, distance threshold,
and turn time — can be tuned by turning a knob instead of editing code.
It's ideal for classrooms without a PC available for every robot.

[Adjusta Bot](./adjusta-bot/index.md)

## Bump Switch Bot

Although we love our low-cost $3 time-of-flight distance sensor, this retro
robot shows that sometimes a simple switch can be an effective signal
to the robot that it is time to turn.

[Bump Switch Bot](./bump-switch-bot/index.md)

## Line Follower Bot

This robot uses two low-cost IR sensors to follow a line on the floor,
teaching the concept of feedback control. It requires careful calibration
of sensor sensitivity and motor power balance, and it's a favorite
"aha" moment once students get it working.

[Line Follower Bot](./line-follower-bot/index.md)

## Ultrasonic Bot

This robot swaps the time-of-flight sensor for a low-cost HC-SR04P
ultrasonic distance sensor, giving students a second way to measure
distance for collision avoidance.

[Ultrasonic Bot](./ultrasonic-bot/index.md)

## WiFi Robot

Our low-cost Cytron Maker Pi RP2030 board does not have support for WiFi.
Now worries! Cytron has another version called the PICO ROBOT that
allows you to plug in ANY board from the Raspberry Pi Pico family including
the powerful Raspberry Pi Pico W that supports BOTH WiFi and bluetooth
wireless communication.  There are two variations, one with a display and
one without a display.  My advise?  Go with the display!

[WiFi Bot](./wifi-bot/index.md)
[WiFi Display Bot](./wifi-display-bot/index.md)

## Digital Compass Kit

This kit includes a low-cost digital compass to show how these fun
direction sensor work to help robots navigate the world.
Note that this kit is not a complete robot.  This $20 kit only needs
a Pico, a sensor and a display mounted on a breadboard.

[Digital Compass Kit](./compass-hmc5883l/index.md)

## Motion Sensor Kit

This kit demonstrates how sensitive accelerometers and gyroscopes work
together to detect motion in our robots.  The kit is now a complete robot,
it is just a simple pico, display and a MPU6050 sensor.  But our
students love this little but mighty kit!

[Motion Sensor Kit](./imu-mpu6050/index.md)

## 9-DOF IMU Kit

This kit wires up a full 9-axis motion sensor — a gyroscope plus a combined
accelerometer/magnetometer, on two separate chips sharing one I2C bus — to a
bare Pico on a breadboard. It's not a complete robot either; it's the bench
test that proves the sensor works before it becomes the compass for a
future swarm of robots.

[9-DOF IMU Kit](./9-dof-imu/index.md)

## Rainbow Bot

We add a colorful 8x8 NeoPixel matrix to the base robot for
one of our most colorful robots.  Kids love to change the
color and patterns created as the robot move and change direction.

[Rainbow Bot 8x8 NeoPixel Matrix](./rainbow-bot/index.md)

## Swarm Robot

This robot really rocks when you have two or more robots working together.
One is a "master" that tells the other "slave" robots what direction it
is going and how fast it is going there.  Although you will
need several WiFi Display robots retrofitted with sensors to demonstrate this capability, it
shows how both sensors and wireless communication can be added to our
robots to show new capabilities.

[Swarm Robot](./swarm-bot/plan.md)

Note - if you are not familiar with integrated motion units (IMUs) we
suggest you try the [Compass](./compass-hmc5883l/index.md) and [IMU](./imu-mpu6050/index.md) kits first.
