# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a STEM robotics educational repository containing resources for teaching computational thinking using low-cost robots. The project uses MkDocs to generate a static website from Markdown documentation and includes MicroPython code for various robot configurations.

## Common Development Commands

### Documentation Site
- **Build and serve documentation locally**: `mkdocs serve`
- **Build static site**: `mkdocs build`
- **Deploy to GitHub Pages**: `mkdocs gh-deploy`

### Content Generation
- **Generate MkDocs template files**: `./mkdocs-gen.sh`

## Architecture Overview

### Directory Structure
- `docs/` - Markdown documentation organized by educational modules
- `src/` - MicroPython source code for different robot configurations
- `site/` - Generated static website (auto-generated, do not edit)
- `slides/` - PowerPoint presentations for teaching

### Key Components

#### Documentation Structure (`docs/`)
- **Lessons** (`lessons/`) - Core educational content covering motors, sensors, programming concepts
- **Kits** (`kits/`) - Specific robot configurations with step-by-step labs
- **Setup** (`setup/`) - Hardware assembly and software installation guides
- **Sims** (`sims/`) - Interactive web-based simulations (HTML/JS)
- **Learning Graphs** (`learning-graphs/`) - Curriculum dependency tracking

#### Robot Code Structure (`src/`)
- **Base Kit** (`src/kits/base/`) - Core robot with time-of-flight sensor and collision avoidance
- **WiFi Bots** (`src/kits/wi-fi/`) - Wireless-enabled robots with web server capability
- **Display Bots** (`src/kits/wifi-display/`) - Robots with OLED displays
- **Libraries** (`src/lib/`) - Shared MicroPython modules (VL53L0X sensor, SSD1306 display)

### Hardware Platform
- Primary platform: **Cytron Maker Pi RP2040** (Raspberry Pi Pico-based)
- Programming language: **MicroPython**
- Key sensors: Time-of-Flight (VL53L0X), ultrasonic, infrared
- Actuators: DC motors via H-bridge, servo motors, NeoPixel LEDs, buzzer

### Configuration Pattern
Each robot kit uses a `config.py` file defining hardware pin assignments and constants:
- Motor control pins (PWM-based H-bridge)
- I2C bus configuration for sensors
- NeoPixel LED configuration
- Speaker/buzzer pin

### Code Architecture
- **Hardware abstraction**: Pin definitions in `config.py` files
- **Modular design**: Separate libraries for sensors and displays
- **Educational progression**: Code complexity increases from basic motor control to collision avoidance
- **Error handling**: Try/catch blocks for graceful shutdown on KeyboardInterrupt

## Development Notes

### MkDocs Configuration
- Theme: Material Design
- Features: Code copying, navigation expansion, search
- Analytics: Google Analytics enabled
- Custom CSS: `docs/css/extra.css`

### Content Organization
- Navigation structure defined in `mkdocs.yml`
- Educational content follows a dependency-based learning progression
- Each kit/lesson includes both theory and hands-on labs
- Simulations provide interactive learning without hardware requirements

### MicroPython Conventions
- Hardware configuration centralized in `config.py` files
- Consistent naming: `RIGHT_FORWARD_PIN`, `LEFT_REVERSE_PIN`, etc.
- PWM frequency typically set to 50Hz for motors
- I2C typically uses pins 16 (SDA) and 17 (SCL)
- Error handling includes motor shutdown and sensor cleanup