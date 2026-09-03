#!/usr/bin/env python3
"""Render the Synth Sounds kit's audio output network.

Prompt:
    Draw the interface between a Raspberry Pi Pico PWM audio pin and a small
    fixed-gain XPT8871 mono amplifier module, laid out left to right.

    Starting at a labelled input terminal "GPIO 0 (Pico PWM)", a series
    resistor R1 = 1 kΩ runs right to node A. Two shunt branches drop from
    node A to ground: R2 = 100 Ω, then C1 = 470 nF a little further right.
    Together R1 and R2 attenuate the Pico's 3.3 V logic swing to about
    0.30 V peak-to-peak, and R1 in parallel with R2 working against C1 forms
    a low-pass filter cornering near 3.7 kHz.

    From node A a series capacitor C2 = 10 µF (DC blocking) runs right into
    the IN pin of U1, an XPT8871 mono amplifier module. U1 has +5V on top
    (fed from the Pico's VBUS, not 3V3), GND on the bottom, and OUT+ and
    OUT- on the right. Loudspeaker LS1 (4-8 Ω) connects directly across
    OUT+ and OUT- and to nothing else.

    Annotate node A with its measured level, mark the +5V pin as coming from
    VBUS, and add a warning note beside the speaker stating that the output
    is bridge-tied and that neither speaker terminal may be grounded.

Topology:
    GPIO0: input terminal - R1.1
    NODE_A: R1.2 - R2.1 - C1.1 - C2.1   (single net, drawn as two dots)
    GND: R2.2 - C1.2 - U1.GND
    IN: C2.2 - U1.IN
    V5: U1.+5V - VBUS terminal
    SPK: U1.OUT+ - LS1.1 ; U1.OUT- - LS1.2   (floating, no ground)

Assumptions:
    The amplifier module is treated as a black box with five external
    connections; its internal input capacitor, gain-setting resistor and
    220 uF bulk supply capacitor are on the module and are not drawn.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import schemdraw
import schemdraw.elements as elm

schemdraw.use("matplotlib")

WARNING = "Bridge-tied output.\nNeither terminal is ground -\nnever wire either one to GND."


def build_drawing() -> schemdraw.Drawing:
    drawing = schemdraw.Drawing(show=False)
    drawing.config(unit=2.6, fontsize=11, lw=1.8)

    # ---- Pico side: the PWM pin feeds the series resistor -----------------
    source = drawing.add(elm.Dot(open=True).label("GPIO 0\n(Pico PWM)", loc="left"))
    r1 = drawing.add(elm.Resistor().right().at(source.center).label("R1\n1 kΩ"))

    # ---- Node A: the divider tap and the filter node ---------------------
    # R2 and C1 are two branches off one electrical node, drawn as two dots
    # joined by a wire so their symbols and labels have room to breathe.
    node_a = drawing.add(elm.Dot().at(r1.end))

    # R2 sets the attenuation: 100 / (1000 + 100) drops 3.3 V to about 0.3 V
    with drawing.hold():
        r2 = drawing.add(elm.Resistor().down().at(node_a.center))
        drawing += elm.Ground()

    # C1 works against R1 || R2 = 91 ohms, cornering near 3.7 kHz
    drawing += elm.Line().right().length(2.5).at(node_a.center)
    node_b = drawing.add(elm.Dot())
    with drawing.hold():
        c1 = drawing.add(elm.Capacitor().down().at(node_b.center))
        drawing += elm.Ground()

    # Label the two vertical branches by hand. Their symbols sit close
    # together, so the offset goes on the horizontal axis - across the
    # symbol, not along it - to keep text clear of the zigzag and plates.
    r2_mid = (r2.absanchors["start"][1] + r2.absanchors["end"][1]) / 2
    c1_mid = (c1.absanchors["start"][1] + c1.absanchors["end"][1]) / 2
    drawing += elm.Label().at((node_a.center[0] - 1.05, r2_mid)).label("R2\n100 Ω")
    drawing += elm.Label().at((node_b.center[0] + 1.05, c1_mid)).label("C1\n470 nF")

    drawing += elm.Line().right().length(0.8).at(node_b.center)
    drawing += elm.Capacitor().right().label("C2\n10 µF")
    drawing += elm.Line().right().length(2.0).label(
        "≈0.30 V p-p", loc="top", ofst=0.35
    )

    # ---- The amplifier module -------------------------------------------
    # The output pins sit in the middle two slots of four so their names
    # cannot collide with the +5V and GND names at the top and bottom.
    amp = drawing.add(
        elm.Ic(
            pins=[
                elm.IcPin(name="IN", side="left"),
                elm.IcPin(name="+5V", side="top"),
                elm.IcPin(name="GND", side="bottom"),
                elm.IcPin(name="OUT+", side="right", slot="3/4"),
                elm.IcPin(name="OUT-", side="right", slot="2/4"),
            ],
            size=(4.0, 4.2),
            label="U1\nXPT8871\nmodule",
        ).anchor("IN")
    )

    # Supply comes from VBUS: a 3.3 V rail browns out under speaker load
    drawing += elm.Line().up().length(1.0).at(amp.absanchors["+5V"])
    drawing += elm.Vdd().label("+5 V\n(VBUS)")

    drawing += elm.Line().down().length(1.0).at(amp.absanchors["GND"])
    drawing += elm.Ground()

    # ---- Speaker: floating across both outputs, grounded at neither ------
    # OUT+ and OUT- must reach the two speaker terminals by separate paths.
    # Nothing may join them: a wire between these pins would short the
    # bridge and destroy the amplifier.
    out_p = amp.absanchors["OUT+"]
    out_n = amp.absanchors["OUT-"]
    mid_y = (out_p[1] + out_n[1]) / 2
    spk_x = out_p[0] + 3.0

    # The explicit .right() is required, not cosmetic. Without it the
    # Speaker inherits the previous element's .down() direction, which
    # rotates the symbol so its two terminals sit side by side at the same
    # height instead of stacked - and the routing below silently shorts
    # OUT+ to OUT-. Schemdraw gives no warning when this happens.
    speaker = drawing.add(
        elm.Speaker().right().at((spk_x, mid_y + 0.25)).anchor("in1")
    )
    # Verify the orientation rather than trusting a glance at the image: a
    # rotated speaker still renders plausibly, but its terminals would be
    # wired wrongly.
    in1, in2 = speaker.absanchors["in1"], speaker.absanchors["in2"]
    assert abs(in1[0] - in2[0]) < 1e-6, "speaker terminals must share an x"
    assert in1[1] > in2[1], "in1 must sit above in2"

    drawing += elm.Label().at((spk_x + 1.0, mid_y - 1.6)).label("LS1\n4-8 Ω")

    # OUT+ runs out, drops to the upper terminal, then across
    drawing += elm.Line().right().at(out_p).tox(spk_x - 1.5)
    drawing += elm.Line().toy(speaker.absanchors["in1"][1])
    drawing += elm.Line().tox(speaker.absanchors["in1"][0])

    # OUT- runs out on a different column, rises to the lower terminal
    drawing += elm.Line().right().at(out_n).tox(spk_x - 0.7)
    drawing += elm.Line().toy(speaker.absanchors["in2"][1])
    drawing += elm.Line().tox(speaker.absanchors["in2"][0])

    drawing += elm.Annotate().at((spk_x + 0.4, mid_y - 0.9)).delta(
        dx=1.1, dy=-1.7
    ).label(WARNING, halign="left", color="firebrick")

    return drawing


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="Output .svg or .png path")
    args = parser.parse_args()
    if args.output.suffix.lower() not in {".svg", ".png"}:
        parser.error("output must end in .svg or .png")
    args.output.parent.mkdir(parents=True, exist_ok=True)

    drawing = build_drawing()
    drawing.save(
        args.output,
        transparent=args.output.suffix.lower() == ".svg",
        dpi=180,
    )


if __name__ == "__main__":
    main()
