import sys
import os
import gc
import machine

# HMC5883L wiring under test:
#   VCC  -> Pico 3.3V OUT
#   GND  -> Pico GND
#   SDA  -> GPIO10 (I2C1 SDA)
#   SCL  -> GPIO11 (I2C1 SCL)
#   DRDY -> GPIO12 (data-ready, digital input)
#
# Pull-ups: the raw pin level check below always enables the RP2040's
# internal weak pull-up (~50-80 kOhm) on purpose - it needs a known "1" idle
# reference so a stuck-low reading actually means something (a short, a
# miswired pin, or a dead module), rather than a floating, meaningless value.
#
# The I2C scan itself does NOT enable the internal pull-up. This breakout
# board was tested both ways and scanned successfully without it, meaning it
# has its own onboard pull-ups (common on GY-271/273-style HMC5883L boards).
# If you swap in a bare module with no onboard pull-ups, the scan may come up
# empty - in that case add machine.Pin.PULL_UP back to the sda/scl Pin()
# calls just before the I2C scan.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
DRDY_PIN = 12
HMC5883L_ADDRESS = 0x1E  # 30 decimal

print("=" * 50)
print("Board / system info")
print("=" * 50)
u = os.uname()
print("sysname :", u.sysname)
print("nodename:", u.nodename)
print("release :", u.release)
print("version :", u.version)
print("machine :", u.machine)
print("platform:", sys.platform)

gc.collect()
free = gc.mem_free()
alloc = gc.mem_alloc()
print()
print("RAM free : {} bytes ({:.1f} KB)".format(free, free / 1024))
print("RAM used : {} bytes ({:.1f} KB)".format(alloc, alloc / 1024))
print("RAM total: {} bytes ({:.1f} KB)".format(free + alloc, (free + alloc) / 1024))

try:
    fs = os.statvfs("/")
    block_size = fs[0]
    total_blocks = fs[2]
    free_blocks = fs[3]
    flash_total = block_size * total_blocks
    flash_free = block_size * free_blocks
    print()
    print("Flash total: {} bytes ({:.1f} KB)".format(flash_total, flash_total / 1024))
    print("Flash free : {} bytes ({:.1f} KB)".format(flash_free, flash_free / 1024))
    print("Flash used : {} bytes ({:.1f} KB)".format(flash_total - flash_free, (flash_total - flash_free) / 1024))
except OSError as e:
    print("Flash info unavailable:", e)

print()
print("=" * 50)
print("DRDY pin check (GPIO{})".format(DRDY_PIN))
print("=" * 50)
drdy = machine.Pin(DRDY_PIN, machine.Pin.IN)
print("DRDY level:", drdy.value(), "(idle level before any measurement is requested)")

print()
print("=" * 50)
print("Raw pin level check (SDA=GPIO{}, SCL=GPIO{}, internal pull-ups enabled)".format(I2C_SDA_PIN, I2C_SCL_PIN))
print("=" * 50)
sda_raw = machine.Pin(I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl_raw = machine.Pin(I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
print("SDA idle level:", sda_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
print("SCL idle level:", scl_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
if sda_raw.value() == 0 or scl_raw.value() == 0:
    print("WARNING: a line is stuck low. With only the Pico's internal pull-up")
    print("in the circuit, this points to a short, a reversed/miswired pin,")
    print("or a dead/backwards module pulling the line down - not a missing")
    print("external pull-up.")

print()
print("=" * 50)
print("I2C{} scan (SDA=GPIO{}, SCL=GPIO{}, no internal pull-ups - testing board's own pull-ups)".format(I2C_BUS, I2C_SDA_PIN, I2C_SCL_PIN))
print("=" * 50)
sda = machine.Pin(I2C_SDA_PIN, machine.Pin.IN)
scl = machine.Pin(I2C_SCL_PIN, machine.Pin.IN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

devices = i2c.scan()

if not devices:
    print("No I2C devices found.")
    print("Check wiring: VCC->3.3V OUT, GND->GND, SDA->GPIO10, SCL->GPIO11")
    print("TEST FAIL")
else:
    print("Found {} device(s):".format(len(devices)))
    for addr in devices:
        marker = "  <-- HMC5883L" if addr == HMC5883L_ADDRESS else ""
        print("  decimal {:3d}  hex 0x{:02X}{}".format(addr, addr, marker))

    if HMC5883L_ADDRESS in devices:
        print()
        print("TEST PASS - HMC5883L found at 0x1E (decimal 30)")
    else:
        print()
        print("TEST FAIL - no device at 0x1E (decimal 30), the HMC5883L's fixed address")
