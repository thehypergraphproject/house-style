# Changelog

The house style is versioned so that every track can say which rules it follows (`style` in `track.yaml`) and CI checks it against exactly those rules.

- **Major** (2.0.0): a rule changes so that existing steps may fail the checker. Tracks move up deliberately.
- **Minor** (1.1.0): a new template, reference or check that only warns.
- **Patch** (1.0.1): wording and fixes.

Each release is tagged `vX.Y.Z`, and the moving tag `v1` always points at the latest 1.x release. Track CI checks out `v<style>`.

## 1.2.0

A track's whole outline now lives in its repository, and long tracks can be split into groups.

- `track.yaml` takes two optional keys: `groups` (parts of a long track, such as univariate and multivariable calculus, each listing its steps in order) and `planned` (steps in the outline that are not written yet, with the fields their front matter will have). The website, its track pages and its map read both.
- Steps are numbered through the whole track, never within a group, so URLs and links do not depend on groups.
- `check.mjs` checks the outline: every step in exactly one group, no unknown slugs, no step both planned and written, folder numbers that agree with the outline. Tracks that use neither key are checked as before.
- `new-step.mjs` starts a step's front matter from its `planned` entry, and the title argument is optional for a planned step.
- The track template's `track.yaml` shows both keys, and its README's step table has a group column.

## 1.1.0

Learned from the first real track, MA-3 Probability & Statistics.

- Tracks may run to about 20 steps when the subject is broad.
- `## Summary` is a recognised section for quick-reference tables, between The idea and Worked example.
- The idea may run to 4,000 words; the checker warns past 4,500 (was 3,000).
- Worked example may hold further solved problems under `###` headings; short examples sit inside The idea under bold labels.
- The checker flags a dollar sign inside inline maths, which Markdown reads as the end of the maths.
- The simulation template reports its height to the page that embeds it (`hypergraph:sim-height`), so the site sizes the frame to fit.
- Renamed for The Hypergraph Project: the skill is `hypergraph-house-style`, the Matplotlib style `hypergraph.mplstyle`, the Manim module `hypergraph_manim.py`.

## 1.0.0

- The skill: notes, importing existing notes, diagrams, plots, simulations, video, credits and licences, review.
- Templates: step, notation table, SVG figure, Matplotlib style, simulation, Manim style, title card, end card, video description.
- Scripts: `new-step.mjs`, `check.mjs`.
- Example: a finished step, Probability & Statistics 06, with a diagram, a plot and its script, a simulation, and answers.
