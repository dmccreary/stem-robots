from machine import Pin, I2C
import time
import VL53L0X

# Define I2C pins
sda = Pin(16)
scl = Pin(17)

# Initialize I2C
i2c = I2C(0, sda=sda, scl=scl)
print("I2C devices found:", i2c.scan())

# Check if the device is found at the expected address
device_address = 41  # Decimal address for the sensor
if device_address in i2c.scan():
    print(f"Device found at address: {device_address}")

    # Create a VL53L0X object
    try:
        tof = VL53L0X.VL53L0X(i2c)
        tof.start()
        print("Sensor initialized successfully")

        # Read distance
        distance = tof.read()
        print("Distance: {} mm".format(distance))

    except Exception as e:
        print(f"Failed to initialize the VL53L0X sensor: {e}")
else:
    print(f"Device not found at address {device_address}. Please check the wiring and address.")
