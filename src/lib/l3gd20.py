# Driver for the L3GD20 / L3GD20H 3-axis MEMS gyroscope, the gyro half of
# the 9-DOF IMU module used by the 9-dof-imu bench kit and the
# swarm-bot build plan (docs/kits/swarm-bot/plan.md).
from micropython import const
import ustruct

WHO_AM_I = const(0x0F)
CTRL_REG1 = const(0x20)
CTRL_REG4 = const(0x23)
OUT_X_L = const(0x28 | 0x80)  # 0x80 bit auto-increments the read across X/Y/Z

WHO_AM_I_L3GD20 = const(0xD4)
WHO_AM_I_L3GD20H = const(0xD7)

_DPS_PER_LSB_250 = 0.00875  # sensitivity at the +/-250 dps full-scale setting below


class L3GD20:
    def __init__(self, i2c, address=0x6B):
        self.i2c = i2c
        self.address = address
        self.i2c.writeto_mem(self.address, CTRL_REG1, b'\x0F')  # normal mode, X/Y/Z on, 95 Hz
        self.i2c.writeto_mem(self.address, CTRL_REG4, b'\x00')  # +/-250 dps full scale

    def who_am_i(self):
        return self.i2c.readfrom_mem(self.address, WHO_AM_I, 1)[0]

    def read_dps(self):
        data = self.i2c.readfrom_mem(self.address, OUT_X_L, 6)
        x, y, z = ustruct.unpack('<hhh', data)
        return (x * _DPS_PER_LSB_250, y * _DPS_PER_LSB_250, z * _DPS_PER_LSB_250)
