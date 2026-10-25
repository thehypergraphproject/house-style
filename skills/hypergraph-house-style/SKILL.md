---
name: hypergraph-house-style
description: House style for The Hypergraph Project, a free open library of learning tracks. Use it whenever you write, convert, restyle or review anything for a Hypergraph track repository - a step's notes, exercises, an SVG diagram, a matplotlib plot, an interactive simulation, a video title card, end card, captions or a Manim animation - or when you turn someone's existing notes into Hypergraph steps. It fixes the file layout, front matter, section order, voice, maths notation, monochrome palette, type, figure and video specs, credits and licence rules, and includes scripts that scaffold a step and check a track before a pull request.
license: MIT
metadata:
  version: "1.2.0"
  project: The Hypergraph Project
---

# Hypergraph house style

The Hypergraph Project publishes free learning tracks: a track is a sequence of ordered **steps** (usually 6 to 12; broad foundation tracks run to about 20), each one sitting of study, ending in a capstone. Many people write them, and the library must read as one book. This skill is how every contributor, and every AI agent helping one, produces the same notes, figures, simulations and videos.

The contributor is the author. You assist. Everything you produce is reviewed by two people before it is published, and the contributor answers for it, so never present a guess as a fact.

## First, find your bearings

1. Find the track repository root: the folder with `track.yaml`. Read `track.yaml`, `notation.md` and the front matter of the steps either side of the one you are working on. A step must use the notation and vocabulary its neighbours already use. `track.yaml` holds the whole outline: the steps not written yet under `planned`, and, in a long track, the `groups` it is split into (univariate and multivariable calculus, say). Steps are numbered through the whole track; the rules are in [references/notes.md](references/notes.md).
2. Work out which job you have been given, then read only the reference it needs:

| Job | Read |
| --- | --- |
| Write or edit a step's notes or exercises | [references/notes.md](references/notes.md) |
| Turn existing notes, slides or LaTeX into steps | [references/importing.md](references/importing.md), then notes.md |
| Draw a diagram | [references/figures.md](references/figures.md) |
| Make a plot from data or a function | [references/plots.md](references/plots.md) |
| Build an interactive simulation | [references/simulations.md](references/simulations.md) |
| Anything for a video: script, animation, cards, captions | [references/video.md](references/video.md) |
| Credit an asset, use outside material, licences, AI use | [references/credits.md](references/credits.md) |
| Review a step, or check your own work before finishing | [references/review.md](references/review.md) |

`examples/track-probability-statistics/06-limit-theorems/` is a finished step in the house style, with a diagram, a plot and its script, and a simulation. When in doubt, match it.

## Rules for everything

1. **Monochrome.** Ink `#0F0F0F`, muted `#5C5C5C`, construction grey `#8A8A88`, line `#DEDEDC`, fill grey `#EBEBEA`, ground `#F5F5F4`, white. No other colour, anywhere: not in figures, plots, simulations or videos. Emphasis comes from weight, a filled shape or a dashed line. The full token set is `assets/tokens.json`.
2. **Type.** Geist for words, Geist Mono for code and data, maths in KaTeX (Computer Modern). Geist Pixel only for track codes on cards.
3. **Flat.** No gradients, shadows, glows, 3D effects, textures or stock imagery. Ever.
4. **One idea per asset.** A diagram, plot or simulation shows one thing. If it needs a legend, it is two figures.
5. **Plain words first, notation second.** Define every symbol where it first appears, using the track's `notation.md`.
6. **Nothing invented.** No made-up facts, numbers, quotations, historical claims or references. Every link in Further reading must be one you have actually seen. If you are unsure whether something is true or exists, say so to the contributor and leave a `<!-- CHECK: ... -->` comment rather than writing it as fact.
7. **Nothing copied.** No text, figures or exercises lifted from books, courses or slides. Explain in new words, redraw, write new problems. Outside material is only allowed under the licences in credits.md, and must be credited.
8. **Reproducible.** Every plot comes from a script in the repository with a fixed random seed. Every simulation is one self-contained HTML file. Every video card comes from the templates here. Someone else must be able to rebuild any asset from the repository alone.
9. **Credited.** Every asset is listed in the step's `assets` front matter with the people who made it.
10. **Published by the project.** Repositories and videos belong to The Hypergraph Project's GitHub organisation and YouTube channel. Never tell a contributor to publish a video on their own channel or to create a repository; they submit, the project publishes and credits them.

## Scripts

Node 18 or later, no dependencies. Paths are relative to this skill's folder.

```sh
# Create a step folder with its index.md filled from the template (and its planned entry, if any)
node scripts/new-step.mjs <track-repo> <number> <slug> ["<Title>"]

# Check a whole track, or one step, before opening a pull request
node scripts/check.mjs <track-repo>
node scripts/check.mjs <track-repo> --step 06-limit-theorems
```

`check.mjs` checks the track's outline (groups, planned steps, folder numbers), front matter, section order, headings, images and alt text, credits, maths delimiters, words that talk down to the reader, the SVG palette and features, simulation files and video files. Errors fail CI; warnings are for the reviewer. Fix every error, and fix or explain every warning.

## Templates

| File | Use |
| --- | --- |
| `assets/step.md` | A step's `index.md`. `new-step.mjs` fills it in. |
| `assets/notation.md` | A track's notation table, for a new track. |
| `assets/figure.svg` | Starting point for a hand-drawn diagram: canvas, styles, arrowhead. |
| `assets/hypergraph.mplstyle` | Matplotlib style for every plot. |
| `assets/simulation.html` | Starting point for a simulation. |
| `assets/hypergraph_manim.py` | Palette, type and helpers for Manim animations. |
| `assets/title-card.html`, `assets/end-card.html` | Video title card, thumbnail and credits card, rendered to PNG. |
| `assets/video-description.md` | The YouTube description the project publishes with a video. |

## Finishing a task

1. Run `check.mjs` on the step and fix what it reports.
2. Read [references/review.md](references/review.md) and go through it as the reviewer would.
3. Tell the contributor, briefly: what you made, which files changed, what you could not verify (each `CHECK` comment), and anything they must do themselves, such as recording a voice-over or confirming a source.
4. Remind them that the pull request asks whether an AI agent helped, and that they should say yes.
