# Turning existing notes into steps

Many tracks start from someone's own notes: lecture notes, a LaTeX file, a notebook, slides, scans of handwriting. This is how to bring them in without losing what made them good or carrying in what the library cannot publish.

Work in this order. Do not start converting before step 2 is agreed with the contributor.

## 1. Inventory

List every source file and what it covers. Then map each part to a step in the track's outline (`track.yaml`: its `groups`, the step folders and `planned`). Produce a table for the contributor:

| Step | Covered by | Coverage | Missing |
| --- | --- | --- | --- |
| 03-distributions | notes.pdf pp. 12–19 | full | worked example |
| 04-expectation | notes.pdf pp. 20–24, hw2.tex | partial | variance of sums |
| (none) | notes.pdf pp. 40–44, moment generating functions | n/a | propose as an extra section of 04, or drop |

Material that does not fit any step is not forced in. Raise it: it may belong in another track, or the outline may need a change, which is the maintainer's decision.

## 2. Check where things came from

Before converting anything, go through the sources with the contributor and mark each passage, figure and exercise:

- **Their own words, drawings or problems:** fine.
- **Copied or closely paraphrased from a book, course, slides or website:** cannot be published. Rewrite in new words from the idea, redraw the figure in the house style, write new exercises. Changing the numbers in a book's exercise is still copying.
- **From an openly licensed source** (CC0, CC BY, CC BY-SA, public domain): may be used with credit; record it as described in credits.md.
- **Unknown:** treat as copied.

Personal notes very often contain copied figures and textbook exercises. Ask. Do not guess.

## 3. Convert the format

- **LaTeX:** keep the maths, drop the document structure. `\section` becomes a `###` heading inside the right section of the step, `align` becomes `aligned` inside `$$`, `\label`/`\ref` become plain numbers with `\tag`. Theorem environments become a paragraph starting with the bold name: `**Theorem (law of large numbers).**`. Custom macros the track will reuse go into `track.yaml` `macros`; one-off macros are expanded.
- **Jupyter notebooks:** prose goes into the notes; code that produces a figure becomes a script in `figures/src/` using the house plot style; code the learner should run stays as a code block, trimmed to what matters.
- **Slides:** slides are prompts for a speaker, not notes. Use them as an outline and write full prose.
- **Scans and handwriting:** transcribe; redraw every figure.
- **Word, Notion, OneNote:** export to Markdown, then clean up.

## 4. Restructure into the house shape

Each step needs The idea, a Worked example, Exercises with hints and answers, and Further reading (see notes.md). Personal notes usually have the idea and little else. Write what is missing, and mark what you wrote so the contributor can check it: say so in your summary, step by step.

Do not change the contributor's explanations for the sake of style alone. Keep their order of ideas and their examples when they work; change wording only where it breaks a house rule (notation, voice, banned words) or is unclear.

## 5. Redraw every figure

Every figure, including the contributor's own, is redrawn or regenerated in the house style: diagrams by hand in SVG (figures.md), plots from a script (plots.md). Photos of whiteboards and screenshots of plots are not published.

## 6. One pull request per step

Convert and submit one step at a time, in track order. Reviewers can check a step in an hour; nobody can review a whole track at once. Run `check.mjs` before each one.
