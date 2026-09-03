import machine
import config

NAME = "i2c-scanner-test.py"
VERSION = "0.1"
print("{} v{}".format(NAME, VERSION))

# SoftI2C, not the hardware I2C(0, ...) peripheral - see config.py for why.
i2c = machine.SoftI2C(sda=machine.Pin(config.I2C_SDA_PIN), scl=machine.Pin(config.I2C_SCL_PIN), freq=100000)

devices = i2c.scan()

if not devices:
    print("No I2C devices found on SDA=GPIO{}, SCL=GPIO{}".format(
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
    print("TEST PASS")
