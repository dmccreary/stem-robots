# H-Bridge Lab

![A block diagram of an H-bridge with SW1 top-left, SW2 top-right, SW3 bottom-left, SW4 bottom-right, and the motor in the center bar between a red top wire and a gray bottom wire](../img/h-bridge.png)

The H-bridge circuit allows us to make a motor turn in opposite directions
if we close opposite switches.  We number the switches in reading order: left to right across the top, then left to right across the bottom.  To make the motor move one direction we close the upper left (Switch 1) and the lower right (Switch 4) switches.  To make the motor move in the opposite direction we close the upper right (Switch 2) and lower left (Switch 3) switches.

It is called an "H" bridge because the circuit forms the shape of the letter "H".

![A blue letter H next to an H-bridge circuit with Power on top, Ground on the bottom, and a motor in the center bar. Switch 1 is top-left, Switch 2 is top-right, Switch 3 is bottom-left, and Switch 4 is bottom-right.](../img/h-bridge-2.png)


In the figure above:

1. To move forward, close switches 1 and 4
2. To move in reverse, close switches 2 and 3

This circuit can also be demonstrated by using a single double-pole, double throw switch.

![](../img/dpdt-switch.png)


<iframe width="560" height="315" src="https://www.youtube.com/embed/rtaaIjR2qmY?si=UHTfZRQHnEzNux3i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

