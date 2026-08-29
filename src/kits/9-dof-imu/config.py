# Hardware configuration for the 9-DOF IMU bench test (L3GD20 gyro +
# LSM303DLHC accel/mag). The board also carries a bonus BMP180 temp/pressure
# chip, printed "10 DOF" on its silkscreen - not used by these lessons.
# VCC -> Pico 3.3V OUT, GND -> Pico GND.
#
# Use machine.SoftI2C (bit-banged), not machine.I2C (the hardware
# peripheral): on this board/firmware, the hardware I2C0 block could scan
# and find all four chips but threw OSError EIO on every real read/write -
# SoftI2C performs the identical transactions over the same pins and pull-ups
# with no failures at any frequency tested (400Hz-100kHz), so this is a
# peripheral-driver quirk, not a wiring or pull-up problem. No external
# pull-up resistors are used or needed - the Pico's internal ones are enough.

I2C_SDA_PIN = 0
I2C_SCL_PIN = 1

# Interrupt / data-ready pins - wired up but not read by these lessons yet.
# Interrupt-driven reads are a stretch goal (see swarm-bot plan.md Phase 12).
GYRO_INT_PIN = 11         # GINT (gyro interrupt)
GYRO_DRDY_PIN = 12        # GRDY (gyro data-ready)
ACCEL_MAG_INT1_PIN = 13   # LIN1 (accel/mag interrupt 1)
ACCEL_MAG_INT2_PIN = 14   # LIN2 (accel/mag interrupt 2)
ACCEL_MAG_DRDY_PIN = 15   # LRDY (accel/mag data-ready)

# I2C addresses - confirmed by 01-probe.py. Clone boards vary depending on
# how the SA0/SDO address-select pin is tied, so don't assume these without
# running the scan.
GYRO_I2C_ADDRESS = 0x6B         # L3GD20 / L3GD20H, SA0 pulled high
ACCEL_I2C_ADDRESS = 0x19        # LSM303DLHC accelerometer sub-device
MAG_I2C_ADDRESS = 0x1E          # LSM303DLHC magnetometer sub-device
BMP180_I2C_ADDRESS = 0x77       # bonus temp/pressure chip, not used by these lessons

# Gyro identity check (WHO_AM_I register, same address on many ST parts)
WHO_AM_I_REGISTER = 0x0F
GYRO_WHO_AM_I_L3GD20 = 0xD4
GYRO_WHO_AM_I_L3GD20H = 0xD7

# BMP180 identity check (chip-id register - always reads 0x55)
BMP180_CHIP_ID_REGISTER = 0xD0
BMP180_CHIP_ID = 0x55
