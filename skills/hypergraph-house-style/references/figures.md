# Diagrams

A diagram explains a structure, a process or a geometric idea. It is drawn by hand as SVG, starting from `assets/figure.svg`. For anything plotted from numbers or a function, use plots.md instead.

## Canvas

- Width 720 (the notes column) or 1080 (a wide figure, used rarely). Height whatever the idea needs, ideally between 240 and 480.
- The `viewBox` is in pixels at the size the figure is shown: `viewBox="0 0 720 320"`, with `width` and `height` set to the same numbers.
- 24px of empty margin inside the edge on every side.
- Background: none (transparent). The site places figures on white.

## Lines and shapes

| Element | Spec |
| --- | --- |
| Main lines and outlines | `#0F0F0F`, 1.5px, round joins and caps |
| Construction lines, guides, axes behind the idea | `#8A8A88`, 1px |
| Hypothetical, future, or "not this" | dashed, `stroke-dasharray="6 4"` |
| Filled emphasis (the one thing to look at) | fill `#0F0F0F` |
| Regions, areas, sets | fill `#EBEBEA`, outline `#0F0F0F` 1.5px |
| Points | circles, r = 4, filled `#0F0F0F`; an open point is white fill with an ink outline |
| Arrows | the `arrow` marker in the template; never thicker than the line it ends |
| Corners on boxes | `rx="4"` |

Only the colours above, plus white and `none`. No gradients, filters, shadows, opacity tricks for depth, patterns standing in for colour, or embedded raster images. The checker rejects them.

## Labels

- Geist, 14px, `#0F0F0F`; secondary labels `#5C5C5C`. Set with the template's classes, not inline fonts.
- Maths variables in labels: the `math` class (KaTeX's maths italic, falling back to a serif italic). Keep maths in labels short: $x$, $\bar{X}_n$, $\theta$. Anything longer belongs in the notes.
- Labels sit outside shapes and next to what they name. Leader lines only when a label cannot sit next to its object; use the construction style.
- Sentence case, no full stops, no all caps.
- No title inside the figure. The caption carries it.

## Composition

- One idea per figure. If it needs a legend, it is two figures.
- Read left to right, or top to bottom, in the order the text explains it.
- Align to a 24px grid. Equal gaps between equal things.
- Show the general case, not a lucky special one (a triangle that is not accidentally isosceles, vectors that are not accidentally perpendicular), unless the special case is the point.

## Files

- `figures/<what-it-shows>.svg`, kebab-case: `sampling-distribution.svg`, not `fig3.svg`.
- Hand-written SVG stays readable: indented, grouped with `<g>` by meaning, no editor metadata. If you draw in a tool (Inkscape, Figma, Excalidraw), export plain SVG, then run the checker and fix what it reports.
- Under 100 KB.
- Add the figure to the step's `assets` list with `kind: diagram`.

## Photos

Photographs are rare: a real instrument, a historical document, a physical experiment. Only from the contributor's own camera or under an allowed licence (credits.md), converted to greyscale, JPEG or WebP under 300 KB, longest side 1600px, `kind: photo` with `origin` and `licence` in `assets`. AI-generated images are never used as figures.
