# Maintaining the house style

This repository is the house style itself. If you were asked to write or review track content, you are in the wrong place: read `skills/hypergraph-house-style/SKILL.md` and work in the track repository.

When changing the house style:

- `assets/tokens.json` is the single source for colours, type and sizes. Change it first, then every file that repeats a value: `tokens.css`, `figure.svg`, `hypergraph.mplstyle`, `hypergraph_manim.py`, `simulation.html`, the card templates, `scripts/check.mjs` (its `PALETTE`), and the references.
- Every rule in the references that a script can check should be checked in `scripts/check.mjs`. Keep checks dependency-free (Node 18+).
- The example step must pass the checker with no errors and no warnings: `node skills/hypergraph-house-style/scripts/check.mjs skills/hypergraph-house-style/examples/track-probability-statistics --step 06-limit-theorems`.
- Regenerate the example plot after touching the Matplotlib style: `python skills/hypergraph-house-style/examples/track-probability-statistics/06-limit-theorems/figures/src/running_mean.py`.
- Keep `SKILL.md` short: rules for everything, and pointers. Detail belongs in `references/`.
- Bump the version in `SKILL.md`, `.claude-plugin/plugin.json` and `tokens.json`, and add a `CHANGELOG.md` entry. A change that makes existing steps fail is a major version.
