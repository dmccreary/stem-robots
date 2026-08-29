import sys
import os
import gc
import machine
import config

# 9-DOF IMU (L3GD20 gyro + LSM303DLHC accel/mag) wiring under test:
#   VCC  -> Pico 3.3V OUT
#   GND  -> Pico GND
#   SDA  -> GPIO0 (I2C0 SDA)
#   SCL  -> GPIO1 (I2C0 SCL)
#   GINT -> GPIO11 (gyro interrupt, not read by these lessons yet)
#   GRDY -> GPIO12 (gyro data-ready, not read by these lessons yet)
#   LIN1 -> GPIO13 (accel/mag interrupt 1, not read by these lessons yet)
#   LIN2 -> GPIO14 (accel/mag interrupt 2, not read by these lessons yet)
#   LRDY -> GPIO15 (accel/mag data-ready, not read by these lessons yet)

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

print()
print("=" * 50)
print("Interrupt / data-ready pin levels (unused by this kit's lessons)")
print("=" * 50)
for name, pin_num in (
    ("GINT", config.GYRO_INT_PIN),
    ("GRDY", config.GYRO_DRDY_PIN),
    ("LIN1", config.ACCEL_MAG_INT1_PIN),
    ("LIN2", config.ACCEL_MAG_INT2_PIN),
    ("LRDY", config.ACCEL_MAG_DRDY_PIN),
):
    level = machine.Pin(pin_num, machine.Pin.IN).value()
    print("{} (GPIO{}): {}".format(name, pin_num, level))

print()
print("=" * 50)
print("Raw pin level check (SDA=GPIO{}, SCL=GPIO{}, internal pull-ups enabled)".format(
    config.I2C_SDA_PIN, config.I2C_SCL_PIN))
print("=" * 50)
sda_raw = machine.Pin(config.I2C_SDA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
scl_raw = machine.Pin(config.I2C_SCL_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
print("SDA idle level:", sda_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
print("SCL idle level:", scl_raw.value(), "(1 = pulled high as expected, 0 = stuck low / shorted / no pull-up reaching this net)")
if sda_raw.value() == 0 or scl_raw.value() == 0:
    print("WARNING: a line is stuck low. With only the Pico's internal pull-up")
    print("in the circuit, this points to a short, a reversed/miswired pin,")
    print("or a dead/backwards module pulling the line down - not a missing")
    print("external pull-up.")

print()
print("=" * 50)
print("I2C scan (SDA=GPIO{}, SCL=GPIO{}, bit-banged SoftI2C)".format(config.I2C_SDA_PIN, config.I2C_SCL_PIN))
print("=" * 50)
# SoftI2C, not the hardware I2C(0, ...) peripheral: on this board/firmware,
# hardware I2C0 could scan but threw EIO on every real read/write. SoftI2C
# performs the identical transactions over the same pins/pull-ups with no
# failures - see config.py for the full story.
i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)

devices = i2c.scan()

if not devices:
    print("No I2C devices found.")
    print("Check wiring: VCC->3.3V OUT, GND->GND, SDA->GPIO{}, SCL->GPIO{}".format(
        config.I2C_SDA_PIN, config.I2C_SCL_PIN))
    print("TEST FAIL")
else:
    print("Found {} device(s):".format(len(devices)))
    for addr in devices:
        marker = ""
        if addr == config.GYRO_I2C_ADDRESS:
            marker = "  <-- L3GD20 gyroscope"
        elif addr == config.ACCEL_I2C_ADDRESS:
            marker = "  <-- LSM303DLHC accelerometer"
        elif addr == config.MAG_I2C_ADDRESS:
            marker = "  <-- LSM303DLHC magnetometer"
        elif addr == config.BMP180_I2C_ADDRESS:
            marker = "  <-- BMP180 temp/pressure (bonus chip, unused by this kit)"
        print("  decimal {:3d}  hex 0x{:02X}{}".format(addr, addr, marker))

    print()
    print("=" * 50)
    print("Identity checks")
    print("=" * 50)

    if config.GYRO_I2C_ADDRESS in devices:
        who = i2c.readfrom_mem(config.GYRO_I2C_ADDRESS, config.WHO_AM_I_REGISTER, 1)[0]
        if who in (config.GYRO_WHO_AM_I_L3GD20, config.GYRO_WHO_AM_I_L3GD20H):
            chip = "L3GD20" if who == config.GYRO_WHO_AM_I_L3GD20 else "L3GD20H"
            print("Gyro WHO_AM_I: 0x{:02X} - confirmed {}".format(who, chip))
        else:
            print("Gyro WHO_AM_I: 0x{:02X} - unexpected value".format(who))
    else:
        print("No device at gyro address 0x{:02X}".format(config.GYRO_I2C_ADDRESS))

    if config.ACCEL_I2C_ADDRESS in devices:
        # This chip has no WHO_AM_I register for the accelerometer - write a
        # setting and read it back as the closest thing to an identity check.
        i2c.writeto_mem(config.ACCEL_I2C_ADDRESS, 0x20, b'\x57')
        readback = i2c.readfrom_mem(config.ACCEL_I2C_ADDRESS, 0x20, 1)[0]
        if readback == 0x57:
            print("Accel CTRL_REG1_A readback: 0x{:02X} - register write/read confirmed".format(readback))
        else:
            print("Accel CTRL_REG1_A readback: 0x{:02X} - unexpected, expected 0x57".format(readback))
    else:
        print("No device at accelerometer address 0x{:02X}".format(config.ACCEL_I2C_ADDRESS))

    if config.MAG_I2C_ADDRESS in devices:
        ida, idb, idc = i2c.readfrom_mem(config.MAG_I2C_ADDRESS, 0x0A, 3)
        if (ida, idb, idc) == (0x48, 0x34, 0x33):
            print("Mag identification bytes: 'H43' - confirmed LSM303DLHC magnetometer")
        else:
            print("Mag identification bytes: 0x{:02X} 0x{:02X} 0x{:02X} - unexpected".format(ida, idb, idc))
    else:
        print("No device at magnetometer address 0x{:02X}".format(config.MAG_I2C_ADDRESS))

    if config.BMP180_I2C_ADDRESS in devices:
        chip_id = i2c.readfrom_mem(config.BMP180_I2C_ADDRESS, config.BMP180_CHIP_ID_REGISTER, 1)[0]
        if chip_id == config.BMP180_CHIP_ID:
            print("BMP180 chip-id: 0x{:02X} - confirmed (not used by this kit's lessons)".format(chip_id))
        else:
            print("BMP180 chip-id: 0x{:02X} - unexpected, expected 0x55".format(chip_id))

    print()
    if (config.GYRO_I2C_ADDRESS in devices
            and config.ACCEL_I2C_ADDRESS in devices
            and config.MAG_I2C_ADDRESS in devices):
        print("TEST PASS - gyroscope, accelerometer, and magnetometer all found and identified")
    else:
        print("TEST FAIL - expected devices at 0x{:02X} (gyro), 0x{:02X} (accel), and 0x{:02X} (mag)".format(
            config.GYRO_I2C_ADDRESS, config.ACCEL_I2C_ADDRESS, config.MAG_I2C_ADDRESS))
