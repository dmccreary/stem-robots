# Hardware Configuration File

This file defines all the hardware in a robot and the pin 
assignments of the motors, sensors, speakers, and displays.

Because most of our robots use the Cytron board, the
pins are standardized for most of our kits.

Using a configuration file has tradeoffs.  The pros
is that it allows you to change a single file when
you change the wiring in your robot.  All the
example programs that use the config file
 will be automatically updated.

 The disadvantage is that it makes your programs
 a little more abstract.  New users will take
 some time to learn how to see how the configuration
 file is used to map a variable to the underlying
 hardware pins.