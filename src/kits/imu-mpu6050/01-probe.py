import sys
import os
import gc
import machine

# MPU6050 (InvenSense) wiring under test:
#   VCC  -> Pico 3.3V OUT
#   GND  -> Pico GND
#   SDA  -> GPIO10 (I2C1 SDA)
#   SCL  -> GPIO11 (I2C1 SCL)
#   XDA  -> GPIO12 (aux I2C data, master pass-through - usually NC on GY-521 boards)
#   XCL  -> GPIO13 (aux I2C clock, usually NC on GY-521 boards)
#   AD0  -> GPIO14 (address select: low/floating = 0x68, high = 0x69)
#   INT  -> GPIO15 (interrupt, only active once configured - idle level varies)
#
# NOTE: GPIO10/GPIO11 were originally described as SCL/SDA (in that order).
# The RP2040's I2C1 hardware block fixes GPIO10 as SDA and GPIO11 as SCL -
# machine.I2C(1, ...) raises "bad SCL pin" if you try it the other way
# around. So the roles below are pinned to what the silicon actually
# supports, not the original label order. If your MPU6050 board's SCL wire
# is physically on GPIO10, swap it to GPIO11 on the breadboard (and SDA to
# GPIO10) so the electrical roles line up with what's driven below.
#
# Pull-ups: the raw pin level check below always enables the RP2040's
# internal weak pull-up (~50-80 kOhm) on purpose - it needs a known "1" idle
# reference so a stuck-low reading actually means something (a short, a
# miswired pin, or a dead module), rather than a floating, meaningless value.
#
# The I2C scan itself does NOT enable the internal pull-up, so it reflects
# whatever pull-ups (if any) live on the breakout board itself. Most GY-521
# boards carry their own onboard pull-ups. If the scan comes up empty, add
# machine.Pin.PULL_UP back to the sda/scl Pin() calls just before the scan.
I2C_SDA_PIN = 10
I2C_SCL_PIN = 11
I2C_BUS = 1
XDA_PIN = 12
XCL_PIN = 13
AD0_PIN = 14
INT_PIN = 15
MPU6050_ADDRESS_LOW = 0x68   # AD0 tied low (or floating with internal pull-down)
MPU6050_ADDRESS_HIGH = 0x69  # AD0 tied high
WHO_AM_I_REG = 0x75
WHO_AM_I_EXPECTED = 0x68     # MPU6050 always reports 0x68 here, regardless of AD0

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
print("AD0 pin check (GPIO{}) - selects I2C address".format(AD0_PIN))
print("=" * 50)
ad0 = machine.Pin(AD0_PIN, machine.Pin.IN)
ad0_level = ad0.value()
expected_address = MPU6050_ADDRESS_HIGH if ad0_level else MPU6050_ADDRESS_LOW
print("AD0 level:", ad0_level, "-> expected address: 0x{:02X}".format(expected_address))

print()
print("=" * 50)
print("INT pin check (GPIO{})".format(INT_PIN))
print("=" * 50)
intr = machine.Pin(INT_PIN, machine.Pin.IN)
print("INT level:", intr.value(), "(idle level before any interrupt config; MPU6050 default is active-high pulse)")

print()
print("=" * 50)
print("XDA/XCL pin check (GPIO{}/GPIO{}) - aux I2C bus, usually unconnected".format(XDA_PIN, XCL_PIN))
print("=" * 50)
xda = machine.Pin(XDA_PIN, machine.Pin.IN)
xcl = machine.Pin(XCL_PIN, machine.Pin.IN)
print("XDA level:", xda.value(), " XCL level:", xcl.value())
print("(These float on most GY-521 breakouts - a random 0 or 1 here is normal,")
print("not a fault, unless your board specifically wires them out.)")

print()
print("=" * 50)
print("Raw pin level check (SCL=GPIO{}, SDA=GPIO{}, internal pull-ups enabled)".format(I2C_SCL_PIN, I2C_SDA_PIN))
print("=" * 50)
scl_raw = machine.Pin(I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
sda_raw = machine.Pin(I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
print("SCL idle level:", scl_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
print("SDA idle level:", sda_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
if scl_raw.value() == 0 or sda_raw.value() == 0:
    print("WARNING: a line is stuck low. With only the Pico's internal pull-up")
    print("in the circuit, this points to a short, a reversed/miswired pin,")
    print("or a dead/backwards module pulling the line down - not a missing")
    print("external pull-up.")

def find_mpu6050(devices):
    if expected_address in devices:
        return expected_address
    if MPU6050_ADDRESS_LOW in devices:
        return MPU6050_ADDRESS_LOW
    if MPU6050_ADDRESS_HIGH in devices:
        return MPU6050_ADDRESS_HIGH
    return None


def report_devices(devices):
    print("Found {} device(s):".format(len(devices)))
    for addr in devices:
        marker = ""
        if addr == MPU6050_ADDRESS_LOW:
            marker = "  <-- MPU6050 (AD0 low)"
        elif addr == MPU6050_ADDRESS_HIGH:
            marker = "  <-- MPU6050 (AD0 high)"
        print("  decimal {:3d}  hex 0x{:02X}{}".format(addr, addr, marker))


def check_who_am_i(i2c, found_address):
    print()
    print("=" * 50)
    print("WHO_AM_I check (register 0x{:02X} at device 0x{:02X})".format(WHO_AM_I_REG, found_address))
    print("=" * 50)
    try:
        who_am_i = i2c.readfrom_mem(found_address, WHO_AM_I_REG, 1)[0]
        print("WHO_AM_I returned: 0x{:02X}".format(who_am_i))
        if who_am_i == WHO_AM_I_EXPECTED:
            print()
            print("TEST PASS - MPU6050 found at 0x{:02X}, WHO_AM_I confirms 0x68".format(found_address))
        else:
            print()
            print("TEST FAIL - device answered at 0x{:02X} but WHO_AM_I was 0x{:02X}, not 0x68".format(found_address, who_am_i))
            print("(could be an MPU6500/MPU9250 or similar variant with a different ID)")
    except OSError as e:
        print("WHO_AM_I read failed:", e)
        print()
        print("TEST FAIL - device acked its address but did not respond to a register read")


print()
print("=" * 50)
print("I2C{} scan (SDA=GPIO{}, SCL=GPIO{}, no internal pull-ups - testing board's own pull-ups)".format(I2C_BUS, I2C_SDA_PIN, I2C_SCL_PIN))
print("=" * 50)
scl = machine.Pin(I2C_SCL_PIN, machine.Pin.IN)
sda = machine.Pin(I2C_SDA_PIN, machine.Pin.IN)
i2c = machine.I2C(I2C_BUS, sda=sda, scl=scl, freq=400000)

devices = i2c.scan()

if devices:
    report_devices(devices)
    found_address = find_mpu6050(devices)
    if found_address is None:
        print()
        print("TEST FAIL - no device at 0x68 or 0x69 (the MPU6050's possible addresses)")
    else:
        check_who_am_i(i2c, found_address)
else:
    print("No I2C devices found on the hardware I2C{} pins as wired.".format(I2C_BUS))
    print()
    print("=" * 50)
    print("Fallback: bit-banged scan with SDA/SCL swapped (GPIO{}=SCL, GPIO{}=SDA)".format(I2C_SDA_PIN, I2C_SCL_PIN))
    print("=" * 50)
    print("This checks for the MPU6050's SCL/SDA wires landing on the opposite")
    print("pins from what the RP2040's I2C{} hardware block requires.".format(I2C_BUS))
    swapped_i2c = machine.SoftI2C(
        scl=machine.Pin(I2C_SDA_PIN, machine.Pin.IN),
        sda=machine.Pin(I2C_SCL_PIN, machine.Pin.IN),
        freq=100000,
    )
    swapped_devices = swapped_i2c.scan()
    if not swapped_devices:
        print("No I2C devices found either way.")
        print("Check wiring: VCC->3.3V OUT, GND->GND, and SDA/SCL to GPIO{}/GPIO{} (either order)".format(I2C_SDA_PIN, I2C_SCL_PIN))
        print("TEST FAIL")
    else:
        report_devices(swapped_devices)
        found_address = find_mpu6050(swapped_devices)
        if found_address is None:
            print()
            print("TEST FAIL - a device responded, but not at 0x68 or 0x69")
        else:
            print()
            print("DIAGNOSIS: the MPU6050 IS present and wired correctly point-to-point,")
            print("but its SCL wire lands on GPIO{} and its SDA wire lands on GPIO{} -".format(I2C_SDA_PIN, I2C_SCL_PIN))
            print("the opposite of what the RP2040's I2C{} hardware block requires".format(I2C_BUS))
            print("(GPIO{}=SDA, GPIO{}=SCL). Swap the two wires on the breadboard, or".format(I2C_SDA_PIN, I2C_SCL_PIN))
            print("keep using machine.SoftI2C(scl=Pin({}), sda=Pin({})) in your own code.".format(I2C_SDA_PIN, I2C_SCL_PIN))
            check_who_am_i(swapped_i2c, found_address)
