"""The Hypergraph Project house style for Manim Community Edition (0.18 or later), version 1.0.0.

Copy this file into the step's video/src/ folder, then:

    from hypergraph_manim import *

    class Running(HypergraphScene):
        def construct(self):
            ...

Render at the delivery spec (1920x1080, 30 fps):

    manim -qh --fps 30 video/src/scenes.py Running

Rules: references/video.md. Install the Geist font so Text() renders in it.
"""

from manim import (
    Arrow,
    Axes,
    Circle,
    DashedVMobject,
    Dot,
    Line,
    ManimColor,
    MathTex,
    NumberPlane,
    Rectangle,
    Scene,
    Tex,
    Text,
    Underline,
    VGroup,
    config,
)

__all__ = [
    "INK",
    "MUTED",
    "CONSTRUCTION",
    "LINE",
    "FILL",
    "GROUND",
    "WHITE_",
    "SANS",
    "MONO",
    "STROKE",
    "THIN",
    "HypergraphScene",
    "label",
    "code",
    "guide",
    "hypothetical",
    "region",
    "emphasise",
    "hypergraph_axes",
]

# Palette. Nothing else is allowed on screen.
INK = ManimColor("#0F0F0F")
MUTED = ManimColor("#5C5C5C")
CONSTRUCTION = ManimColor("#8A8A88")
LINE = ManimColor("#DEDEDC")
FILL = ManimColor("#EBEBEA")
GROUND = ManimColor("#F5F5F4")
WHITE_ = ManimColor("#FFFFFF")

SANS = "Geist"
MONO = "Geist Mono"

# Manim stroke widths are not pixels. At 1080p these read as the figures' 1.5px and 1px lines,
# scaled for viewing a full screen from a distance.
STROKE = 3
THIN = 2

# Delivery spec.
config.pixel_width = 1920
config.pixel_height = 1080
config.frame_rate = 30
config.background_color = GROUND

# Defaults, so a plain Line(), Dot() or MathTex() is already in the house style.
Text.set_default(font=SANS, color=INK)
MathTex.set_default(color=INK)
Tex.set_default(color=INK)
Line.set_default(color=INK, stroke_width=STROKE)
Arrow.set_default(color=INK, stroke_width=STROKE)
Dot.set_default(color=INK, radius=0.06)
Circle.set_default(color=INK, stroke_width=STROKE)
Rectangle.set_default(color=INK, stroke_width=STROKE)


class HypergraphScene(Scene):
    """A scene on the ground colour. Everything in it should come from this module's palette."""

    def setup(self):
        self.camera.background_color = GROUND


def label(text, size=32, muted=False):
    """A label in Geist. 32 is the smallest size that stays readable at 1080p (28px on screen)."""
    return Text(text, font=SANS, font_size=size, color=MUTED if muted else INK)


def code(text, size=30):
    """Code or data in Geist Mono."""
    return Text(text, font=MONO, font_size=size, color=INK)


def guide(mobject):
    """Construction style: thin grey lines for axes, guides and leader lines."""
    return mobject.set_stroke(color=CONSTRUCTION, width=THIN)


def hypothetical(mobject, dashes=40):
    """Dashed: for anything hypothetical, future or 'not this'."""
    return DashedVMobject(mobject.set_stroke(color=INK, width=STROKE), num_dashes=dashes)


def region(mobject):
    """A filled region: grey fill with an ink outline."""
    return mobject.set_fill(FILL, opacity=1).set_stroke(INK, width=STROKE)


def emphasise(mobject):
    """Emphasis by underline, never by colour."""
    return VGroup(mobject, Underline(mobject, color=INK, stroke_width=STROKE))


def hypergraph_axes(x_range, y_range, x_length=10, y_length=5.5, **kwargs):
    """Axes in the construction style, with numbers in muted Geist."""
    axes = Axes(
        x_range=x_range,
        y_range=y_range,
        x_length=x_length,
        y_length=y_length,
        axis_config={"color": INK, "stroke_width": THIN, "include_tip": False, "font_size": 28},
        **kwargs,
    )
    for axis in (axes.x_axis, axes.y_axis):
        if hasattr(axis, "numbers"):
            axis.numbers.set_color(MUTED)
    return axes


# NumberPlane background lines in the construction grey, axes in ink.
NumberPlane.set_default(
    background_line_style={"stroke_color": LINE, "stroke_width": 1},
    axis_config={"color": CONSTRUCTION, "stroke_width": THIN},
)
