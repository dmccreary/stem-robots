# STEM Robots

**Educational robotics curriculum using low-cost components and MicroPython**

🌐 **Website**: [https://dmccreary.github.io/stem-robots/](https://dmccreary.github.io/stem-robots/)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](docs/license.md)
[![MkDocs](https://img.shields.io/badge/docs-MkDocs-blue)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/theme-Material-blue)](https://squidfunk.github.io/mkdocs-material/)
[![MicroPython](https://img.shields.io/badge/code-MicroPython-green)](https://micropython.org/)
[![GitHub Pages](https://img.shields.io/badge/deployment-GitHub%20Pages-brightgreen)](https://pages.github.com/)
[![Raspberry Pi Pico](https://img.shields.io/badge/hardware-Raspberry%20Pi%20Pico-red)](https://www.raspberrypi.org/products/raspberry-pi-pico/)
[![Cytron Maker Pi](https://img.shields.io/badge/board-Cytron%20Maker%20Pi%20RP2040-orange)](https://www.cytron.io/p-maker-pi-rp2040)

## Overview

STEM Robots is a comprehensive fully customizable educational curriculum designed to teach 
computational thinking through hands-on robotics projects using affordable components. 
At just $19 per robot, this curriculum makes robotics education accessible to schools 
with any budget while providing engaging, standards-aligned learning experiences.

The curriculum progressively introduces students to programming concepts, sensors, 
actuators, and problem-solving skills using MicroPython and the Raspberry Pi Pico microcontroller platform
and the low-cost but powerful $12 [Cytron Maker Pi RP2030](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) robotics board.

## 🌟 Our Mission

We believe that every student deserves access to high-quality STEM education regardless of their school's budget. By combining:
- **Affordable hardware** (under $19 per robot)
- **Open-source curriculum** (freely available and customizable)  
- **Modern tools** (MicroPython, generative AI)
- **Proven pedagogy** (computational thinking, constructionist learning)

## 🚀 Quick Start

### Prerequisites for Building Robot

- [Thonny](http://thonny.com) IDE (for MicroPython programming) installed on PC, Mac or Linux
- [Cytron Maker Pi RP2030](https://www.cytron.io/p-maker-pi-rp2040-simplifying-robotics-with-raspberry-pi-rp2040) board or compatible
- SmartCar chassis or similar

### Prerequisites for Teachers Building Their Own Custom Site

- Access to GitHub
- Access to AI Chatbot (ChatGPT, Anthropic Claude etc.)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dmccreary/stem-robots.git
   cd stem-robots
   ```

2. **Install MkDocs:**
   ```bash
   pip install mkdocs mkdocs-material
   ```

3. **Serve the documentation locally:**
   ```bash
   mkdocs serve
   ```

4. **View the site:**
   Open [http://localhost:8000](http://localhost:8000) in your browser

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

## 📚 Curriculum Structure

### Core Components

- **📖 Lessons** (`docs/lessons/`) - Progressive curriculum covering motors, sensors, and programming concepts
- **🤖 Kits** (`docs/kits/`) - Specific robot configurations with step-by-step laboratories
- **⚙️ Setup** (`docs/setup/`) - Hardware assembly and software installation guides
- **🎮 Simulations (MicroSims)** (`docs/sims/`) - Interactive web-based learning tools (MicroSims)
- **👨‍🏫 Instructor's Guide** (`docs/instructors-guide/`) - Teaching resources and computational thinking guides
- **📊 Learning Graphs** (`docs/learning-graphs/`) - Curriculum dependency tracking using Concept Graph - used by AI to generate custom lesson plans

### Sample Robot Configurations

- **Base Kit** - Core collision-avoidance robot with time-of-flight sensor ($19)
- **WiFi Bots** - Network-enabled robots with web server capabilities
- **Display Bots** - Robots with OLED displays for visual feedback
- **Sensor Bots** - Various sensor integration projects (ultrasonic, IR, bump switches)
- **Line Followers** - Robots that follow lines using sensors

## 🛠️ Hardware Platform

- **Primary Board**: [Cytron Maker Pi RP2040](https://www.cytron.io/p-maker-pi-rp2040) ($12) - Raspberry Pi Pico-based
- **Programming Language**: MicroPython
- **Key Sensors**: VL53L0X Time-of-Flight ($3), HC-SR04 Ultrasonic, IR sensors, bump switches
- **Actuators and Displays**: DC motors, servo motors, NeoPixel LEDs, onboard buzzer
- **Total Cost**: Under $19 per complete robot kit (without OLED display) - the OLED adds $13 to the kit cost

### Why This Hardware?

- **No Soldering Required** - All connections use Grove connectors or breadboard
- **Sustainable Design** - No vendor lock-in - all parts are replaceable and upgradable - rechargeable battery options
- **Durable Design** - Cable ties and heat shrink prevent wire breakage
- **Low-Cost Parts** - Standard components available from multiple suppliers
- **Extensible** - Easy to add new sensors and actuators
- **Open Source** - No vendor lock-in or proprietary components

## 💻 Software Architecture

### Code Organization
```
src/
├── kits/                 # Robot-specific code
│   ├── base/            # Basic collision avoidance
│   ├── wifi-bot/        # Network-enabled robots
│   ├── display/         # OLED display integration
│   └── wifi-display/    # Combined WiFi and display
└── lib/                 # Shared MicroPython libraries
    ├── vl53l0x.py      # Time-of-flight sensor driver
    └── ssd1306.py      # OLED display driver
```

### Standardized Hardware Configuration File
Each robot kit uses a standardized `config.py` file.  You just change this file and all the labs will work!

```python
# Motor control pins (H-bridge)
RIGHT_FORWARD_PIN = 8
RIGHT_REVERSE_PIN = 9
LEFT_FORWARD_PIN = 10
LEFT_REVERSE_PIN = 11

# I2C configuration for sensors
SDA_PIN = 16
SCL_PIN = 17

# NeoPixel LEDs
NEOPIXEL_PIN = 18
NUMBER_PIXELS = 2
```

## 🎯 Educational Objectives

- **Computational Thinking**: Problem decomposition, pattern recognition, abstraction, algorithms
- **Programming Fundamentals**: Variables, loops, conditionals, functions, error handling
- **Hardware Integration**: Sensors, actuators, I2C communication, PWM control
- **Debugging Skills**: Systematic troubleshooting and testing methodologies
- **Project Management**: Planning, iteration, documentation, version control
- **STEM Integration**: Physics concepts, mathematics applications, engineering design

## 🎮 Interactive Learning Tools

### MicroSims

MicroSims are web-based simulations that run in any browser:

- **PWM Visualization** - Understanding pulse-width modulation
- **H-Bridge Control** - Motor direction control concepts
- **Collision Avoidance** - Algorithm visualization
- **Learning Graphs** - Curriculum dependency visualization

## 📖 Fantastic Documentation

The complete curriculum is available at [https://dmccreary.github.io/stem-robots/](https://dmccreary.github.io/stem-robots/)

### Key Sections
- [Getting Started Guide](https://dmccreary.github.io/stem-robots/setup/)
- [Progressive Lessons](https://dmccreary.github.io/stem-robots/lessons/)
- [Robot Kits](https://dmccreary.github.io/stem-robots/kits/)
- [Interactive Simulations](https://dmccreary.github.io/stem-robots/sims/)
- [Instructor's Guide](https://dmccreary.github.io/stem-robots/instructors-guide/)

## 🤝 Contributing

We welcome contributions! Please consider:
- Submitting bug reports and feature requests via GitHub Issues
- Contributing lesson content and improvements
- Adding new robot configurations and sensor integrations
- Improving documentation and translations
- Sharing your classroom experiences and adaptations
- Use [GitHub Issues](https://github.com/dmccreary/stem-robots/issues) and [GitHub Projects](https://github.com/users/dmccreary/projects/6) to provide feedback: 

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License - see the [license file](docs/license.md) for details.

## 🙏 Acknowledgments

This project builds upon the excellent work of many open-source projects, educational initiatives, and hardware innovators:

### Core Technologies
- **[MicroPython](https://micropython.org/)** - Python implementation for microcontrollers, enabling accessible programming
- **[MkDocs](https://www.mkdocs.org/)** - Static site generator for beautiful documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Modern, responsive documentation theme
- **[Python](https://www.python.org/)** - The base programming language that MicroPython is built around

### Hardware Platforms and Partners
- **[Raspberry Pi Foundation](https://www.raspberrypi.org/)** - RP2040 microcontroller and educational mission
- **[Cytron Technologies](https://www.cytron.io/)** - Maker Pi RP2040 board that revolutionized our robots

### Sensor and Component Libraries
- **[VL53L0X Library](https://github.com/kevinmcaleer/vl53l0x)** - Time-of-flight sensor driver for MicroPython
- **[SSD1306 Library](https://github.com/micropython/micropython/tree/master/drivers/display)** - OLED display driver
- **[NeoPixel Library](https://docs.micropython.org/en/latest/esp8266/tutorial/neopixel.html)** - RGB LED control for visual feedback
- **[MicroPython Builtin Machine Library](https://docs.micropython.org/en/latest/library/machine.html)** - Hardware abstraction in MicroPython

### Educational Frameworks and Resources
- **[Computational Thinking](https://www.iste.org/explore/computational-thinking)** concepts from ISTE
- **[Physical Computing](https://itp.nyu.edu/physcomp/)** curriculum framework from NYU ITP

### Development and Deployment Tools
- **[GitHub Pages](https://pages.github.com/)** - Free static site hosting for educational content
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation for documentation
- **[Thonny](https://thonny.org/)** - Beginner-friendly Python IDE perfect for MicroPython
- **[Git](https://git-scm.com/)** - Version control enabling collaborative curriculum development

### Generative AI Tools
- **[OpenAI ChatGPT](https://chat.openai.com/)** - Revolutionizing personalized lesson plan generation
- **[GitHub Copilot](https://github.com/features/copilot)** - AI-assisted coding for educational examples
- **[Claude Code](https://claude.ai/)** - Advanced AI for curriculum content generation and holistic understanding of the website

### Community and Inspiration
- **[MicroPython Community](https://micropython.org/community/)** - Supportive community of educators and developers

### Special Recognition
- **Doug Blanding** - Contributor to Pico MicroPython smart car implementations
- **Kevin McAleer** - MicroPython educator and MicroPython promoter
- **Teachers and Students** - Worldwide educators and students who have tested these materials and provided invaluable feedback
- **Open Source Hardware Movement** - Community that makes affordable, accessible electronics possible

### Design Philosophy Influences
- **[Seymour Papert](https://www.papert.org/)** - Constructionist learning theory that guides our hands-on approach
- **[Alan Kay](https://www.vpri.org/alan_kay.html)** - Vision of personal computing and learning tools

We aim to democratize robotics education and inspire the next generation of makers, programmers, and problem-solvers.

## 🔗 Related Projects

- [MicroPython for Kids](https://dmccreary.github.io/micropython/) - Broader MicroPython educational resources
- [CircuitPython](https://circuitpython.org/) - Alternative Python for microcontrollers
- [MicroPython Libraries](https://github.com/micropython/micropython-lib) - Additional libraries and drivers

## 📞 Contact

- **Author**: Dan McCreary
- **GitHub**: [@dmccreary](https://github.com/dmccreary)
- **Website**: [dmccreary.com](https://dmccreary.com)
- **Medium**: [@dmccreary](https://dmccreary.medium.com/)

---

**Made with ❤️ for accessible STEM education**