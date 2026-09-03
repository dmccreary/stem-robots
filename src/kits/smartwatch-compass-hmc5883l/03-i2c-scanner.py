import machine
import config

# Lab 03: I2C Scanner
# Scans I2C0 (SDA=GPIO12, SCL=GPIO13) for the HMC5883L compass at its
# fixed address 0x1E. Run this after wiring the compass but before
# trying to read any values from it - it only tells you whether the
# chip answers on the bus, not whether the readings make sense.
#
# HMC5883L wiring:
#   VCC -> Pico 3.3V OUT
#   GND -> Pico GND
#   SDA -> GPIO12 (I2C0 SDA)
#   SCL -> GPIO13 (I2C0 SCL)
#
# This wiring is fresh and not yet bench-tested the way the standalone
# compass-hmc5883l kit's is, so the pull-ups here are always enabled -
# harmless if your breakout already has its own onboard pull-ups, and
# required if it does not.

sda = machine.Pin(config.I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl = machine.Pin(config.I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
i2c = machine.I2C(config.I2C_BUS, sda=sda, scl=scl, freq=400000)

print("=" * 50)
print("I2C{} scan (SDA=GPIO{}, SCL=GPIO{})".format(
    config.I2C_BUS, config.I2C_SDA_PIN, config.I2C_SCL_PIN))
print("=" * 50)

devices = i2c.scan()

if not devices:
    print("No I2C devices found.")
    print("Check wiring: VCC->3.3V OUT, GND->GND, SDA->GPIO12, SCL->GPIO13")
    print("TEST FAIL")
else:
    print("Found {} device(s):".format(len(devices)))
    for addr in devices:
        marker = "  <-- HMC5883L" if addr == config.HMC5883L_ADDRESS else ""
        print("  decimal {:3d}  hex 0x{:02X}{}".format(addr, addr, marker))

    if config.HMC5883L_ADDRESS in devices:
        print()
        print("TEST PASS - HMC5883L found at 0x1E (decimal 30)")
    else:
        print()
        print("TEST FAIL - no device at 0x1E (decimal 30), the HMC5883L's fixed address")
