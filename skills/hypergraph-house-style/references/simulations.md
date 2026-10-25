# Simulations

A simulation lets the learner change something and see what happens: drag a vector, change a probability, run an orbit. It earns its place only when doing teaches more than reading. If a static figure says it, draw the figure.

## The file

- One self-contained HTML file in `sims/`, named for what it does: `sims/coin-flips.html`. Start from `assets/simulation.html`.
- Plain HTML, CSS and JavaScript in the one file. No external scripts, no frameworks, no build step, no network requests. Fonts from Google Fonts are the only outside link allowed, and the file must still work if they fail to load.
- Under 150 KB.
- The site embeds it in a sandboxed frame (scripts allowed, nothing else): no storage, cookies, pop-ups or network.
- Keep the template's last `<script>`, which tells the site the simulation's height so the frame fits without scrolling. It is the only message a simulation sends to `window.parent`.
- Record it in `assets` with `kind: simulation`.

## Look

- The tokens at the top of the template, unchanged. Ground `#F5F5F4`, panels white, ink drawing, construction grey for guides. No colour.
- Drawing follows the figure rules: 1.5px ink lines, `#EBEBEA` regions, filled ink for the one thing to watch.
- Canvas (or SVG) fills the width; the height keeps the template's aspect ratio. Works from 320px wide.
- Readouts of the numbers that matter in Geist Mono, next to the drawing.

## Behaviour

- **One idea, few controls.** Two or three controls is typical, five the most. Each control is a real, labelled HTML input (`<input type="range">`, `<button>`, `<select>`) that works with a keyboard and a thumb.
- **Reproducible.** Randomness comes from the seeded generator in the template (`mulberry32`). The seed is shown, and Reset returns to it, so a learner and the notes see the same run.
- **Starts still.** Nothing moves until the learner acts. Show a meaningful first state, not an empty canvas.
- **Reduced motion.** With `prefers-reduced-motion`, actions jump to their result instead of animating. The template does this through `animate()`.
- **Explains itself.** One sentence above the controls says what to try. The notes say what to notice.
- **Correct.** The numbers shown are computed, not faked to look right. If the simulation approximates, the notes say how.

## Accessibility

- `lang`, a `<title>`, labels on every control, and a live region (`aria-live="polite"`) for the main readout.
- The canvas has a text description (`role="img"` and `aria-label`) that updates with the state that matters.
- Focus styles stay visible.

## The fallback

Every simulation also has a still figure in the notes showing its key result, so the step works printed or without JavaScript.
