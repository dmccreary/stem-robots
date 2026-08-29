# Driver for the LSM303DLHC accelerometer + magnetometer - the chip actually
# printed on the 9-DOF IMU module's silkscreen (an earlier plan assumed the
# newer, differently-addressed LSM303D before the part arrived - see
# docs/kits/swarm-bot/plan.md). Two separate I2C sub-devices, each with its
# own address, unlike the single-address LSM303D.
from micropython import const
import ustruct

# ---- Accelerometer (address 0x19) ----
CTRL_REG1_A = const(0x20)
CTRL_REG4_A = const(0x23)
OUT_X_L_A = const(0x28 | 0x80)  # 0x80 bit auto-increments the read across X/Y/Z

# This chip has no WHO_AM_I register for the accelerometer sub-device -
# reading back a register we just wrote is the closest thing to an identity
# check (see 01-probe.py).

_G_PER_LSB_2G = 0.001  # sensitivity at +/-2g, high-resolution mode (1 mg/LSB)

# ---- Magnetometer (address 0x1E) ----
CRA_REG_M = const(0x00)
CRB_REG_M = const(0x01)
MR_REG_M = const(0x02)
OUT_X_H_M = const(0x03)  # registers come out in X, Z, Y order - see read_mag_gauss()

IRA_REG_M = const(0x0A)  # IRA/IRB/IRC together spell "H43" - the closest
IRB_REG_M = const(0x0B)  # thing this chip has to a WHO_AM_I for the
IRC_REG_M = const(0x0C)  # magnetometer sub-device

# X/Y and Z have different sensitivities at this gain setting (+/-1.3 gauss) -
# a documented LSM303DLHC quirk, not a bug in this driver.
_GAUSS_PER_LSB_XY_1_3 = 1.0 / 1100
_GAUSS_PER_LSB_Z_1_3 = 1.0 / 980


class LSM303DLHC:
    def __init__(self, i2c, accel_address=0x19, mag_address=0x1E):
        self.i2c = i2c
        self.accel_address = accel_address
        self.mag_address = mag_address
        self.i2c.writeto_mem(self.accel_address, CTRL_REG1_A, b'\x57')  # 100 Hz, X/Y/Z on
        self.i2c.writeto_mem(self.accel_address, CTRL_REG4_A, b'\x08')  # high-res, +/-2g
        self.i2c.writeto_mem(self.mag_address, CRA_REG_M, b'\x10')      # 15 Hz output rate
        self.i2c.writeto_mem(self.mag_address, CRB_REG_M, b'\x20')      # +/-1.3 gauss gain
        self.i2c.writeto_mem(self.mag_address, MR_REG_M, b'\x00')       # continuous-conversion mode

    def mag_id(self):
        return self.i2c.readfrom_mem(self.mag_address, IRA_REG_M, 3)

    def read_accel_g(self):
        data = self.i2c.readfrom_mem(self.accel_address, OUT_X_L_A, 6)
        raw_x, raw_y, raw_z = ustruct.unpack('<hhh', data)
        x, y, z = raw_x >> 4, raw_y >> 4, raw_z >> 4  # 12-bit data, left-justified
        return (x * _G_PER_LSB_2G, y * _G_PER_LSB_2G, z * _G_PER_LSB_2G)

    def read_mag_gauss(self):
        data = self.i2c.readfrom_mem(self.mag_address, OUT_X_H_M, 6)
        x, z, y = ustruct.unpack('>hhh', data)  # registers are ordered X, Z, Y
        return (x * _GAUSS_PER_LSB_XY_1_3, y * _GAUSS_PER_LSB_XY_1_3, z * _GAUSS_PER_LSB_Z_1_3)
