# Credits, licences and AI use

## Where credit comes from

Credit is taken from the record, so the record must be complete.

| Who | Recorded in | Shown |
| --- | --- | --- |
| Authors of the notes | `authors` in front matter, checked against Git history | At the end of the step, on the contributors page |
| Reviewers | `reviewers`, checked against the approving pull-request reviews | At the end of the step |
| Makers of figures, plots, simulations | `by` on each item in `assets` | Under each figure and simulation |
| Makers of a video | `by` under `video` | Video description, end card, step page |
| Maintainers | `maintainers` in `track.yaml` | Track page |

Use GitHub handles everywhere. Display names and optional city-level locations come from each person's profile file in the catalogue repository, never from the step.

## The `assets` list

Every file under `figures/`, `sims/` and `video/cards/` that appears in the step is listed once:

```yaml
assets:
  - file: figures/sampling.svg
    kind: diagram
    by: [github-handle]
  - file: figures/running-mean.svg
    kind: plot
    by: [github-handle]
    source: figures/src/running_mean.py
  - file: figures/galton-board.jpg
    kind: photo
    by: [github-handle]          # who prepared it for the step
    origin: https://commons.wikimedia.org/wiki/File:...
    licence: CC BY-SA 4.0
    credit: Photograph by Jane Doe        # exactly as the licence asks
```

`origin`, `licence` and `credit` are required for anything the contributors did not make themselves.

## Licences

- Notes, figures, simulations and videos: **CC BY-SA 4.0**.
- Code (code blocks in steps, plot scripts, simulation code): **MIT**.
- By opening a pull request, a contributor confirms they have the right to submit the work and license it this way. The pull request template asks.

Outside material is allowed only under:

- public domain or CC0;
- CC BY (any version);
- CC BY-SA (any version).

Never NC (non-commercial) or ND (no derivatives) licences, never "free for educational use", never anything with no stated licence. "I found it on Google Images" is no licence.

## AI assistance

AI agents may help write notes, draw diagrams, write plot and simulation code, and prepare videos. The rules:

1. **The contributor is the author** and is responsible for every claim, derivation, number and link, exactly as if they had typed it.
2. **Disclose it.** The pull request template asks whether an AI agent helped and with what. Say yes when it did.
3. **Verify it.** Work through every derivation and run every piece of code before submitting. Open every link.
4. **No generated images.** Figures are drawn as SVG or generated from code, so they are exact and reproducible. AI image generators are not used for figures, photos, thumbnails or video frames.
5. **No generated voices** in videos. Narration is a real person.
6. **No invented sources.** An agent must never produce a citation or link it has not seen.
