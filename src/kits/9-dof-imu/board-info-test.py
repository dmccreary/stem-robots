import sys
import os
import gc
import machine
import binascii


def list_files(path="/", indent=0):
    for entry in os.ilistdir(path):
        name = entry[0]
        entry_type = entry[1]
        size = entry[3] if len(entry) > 3 else None
        full_path = path.rstrip("/") + "/" + name
        if entry_type == 0x4000:  # directory
            print("  " * indent + name + "/")
            list_files(full_path, indent + 1)
        else:
            size_str = "{} bytes".format(size) if size is not None else "size unknown"
            print("  " * indent + "{} ({})".format(name, size_str))


print("=" * 50)
print("Processor")
print("=" * 50)
u = os.uname()
print("sysname :", u.sysname)
print("nodename:", u.nodename)
print("release :", u.release)
print("version :", u.version)
print("machine :", u.machine)
print("platform:", sys.platform)
print("CPU freq:", machine.freq(), "Hz ({:.0f} MHz)".format(machine.freq() / 1000000))

print()
print("=" * 50)
print("MicroPython version")
print("=" * 50)
print("implementation:", sys.implementation.name)
print("version       :", ".".join(str(v) for v in sys.implementation.version))
print("full version  :", sys.version)

print()
print("=" * 50)
print("Unique ID (closest thing this chip has to a serial number)")
print("=" * 50)
uid = machine.unique_id()
print("unique_id: {} ({} bytes)".format(binascii.hexlify(uid).decode(), len(uid)))

print()
print("=" * 50)
print("RAM")
print("=" * 50)
gc.collect()
free = gc.mem_free()
alloc = gc.mem_alloc()
print("RAM free : {} bytes ({:.1f} KB)".format(free, free / 1024))
print("RAM used : {} bytes ({:.1f} KB)".format(alloc, alloc / 1024))
print("RAM total: {} bytes ({:.1f} KB)".format(free + alloc, (free + alloc) / 1024))

print()
print("=" * 50)
print("Flash")
print("=" * 50)
try:
    fs = os.statvfs("/")
    block_size = fs[0]
    total_blocks = fs[2]
    free_blocks = fs[3]
    flash_total = block_size * total_blocks
    flash_free = block_size * free_blocks
    print("Flash total: {} bytes ({:.1f} KB)".format(flash_total, flash_total / 1024))
    print("Flash free : {} bytes ({:.1f} KB)".format(flash_free, flash_free / 1024))
    print("Flash used : {} bytes ({:.1f} KB)".format(flash_total - flash_free, (flash_total - flash_free) / 1024))
except OSError as e:
    print("Flash info unavailable:", e)

print()
print("=" * 50)
print("Files on flash")
print("=" * 50)
list_files("/")
