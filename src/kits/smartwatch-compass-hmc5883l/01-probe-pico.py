import sys
import os
import gc

# Lab 01: Probe the Pico
# Run this first, before wiring anything up. It needs no sensor, no
# display, no breadboard - just the Pico and a USB cable. If this prints
# clean output, Thonny (or mpremote) can talk to the board and the
# MicroPython runtime is alive; anything that goes wrong later is in the
# wiring or the code, not the board itself.

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
print("TEST PASS - board is alive and MicroPython is running")
