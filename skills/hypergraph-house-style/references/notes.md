# Writing a step

A step is one sitting of learning: 3 to 8 hours including exercises. It lives in its own folder in the track repository.

```
track-probability-statistics/
  track.yaml
  notation.md
  06-limit-theorems/
    index.md                 the step: front matter + notes
    figures/                 SVG diagrams and plots, kebab-case names
      src/                   the scripts that generate plots
    sims/                    simulations, one HTML file each
    video/                   captions, description, animation sources (only if there is a video)
```

The folder name is `NN-slug`: a two-digit number that fixes the order, then the step's slug. The slug is permanent once published. It must match the slug in the track's outline.

## The track's outline: groups and planned steps

`track.yaml` holds the track's whole outline, so the website and its map read it from the repository. Two optional keys shape it:

```yaml
groups:                        # parts of a long track, in order
  - slug: univariate           # kebab-case, unique in the track
    title: Univariate calculus
    summary: Limits, derivatives, integrals and series for functions of one variable.   # optional, one line
    steps: [limits, derivatives, differentiation-rules, optimization, integrals, integration-techniques, series]
  - slug: multivariable
    title: Multivariable calculus
    steps: [partial-derivatives, gradients, multiple-integrals, vector-calculus]
planned:                       # steps in the outline that are not written yet
  - slug: vector-calculus
    title: Vector calculus
    summary: "Fields, flux and circulation: divergence, curl and the theorems of Green, Stokes and Gauss."
    topics: [Line and surface integrals, Divergence and curl, Stokes and Gauss]
    hours: 8
    uses: []                   # optional, as in front matter
    project: true              # optional, as in front matter
```

- **Group a track when it covers more than one sub-subject**, the way Calculus splits into univariate and multivariable, or when it runs past about 12 steps. A group holds three or more steps, and its title names the sub-subject, not a level ("Multivariable calculus", not "Part 2"). Short tracks have no groups.
- **Every step belongs to exactly one group** once `groups` exists, written or planned. Groups list their steps in order, and the groups one after another are the track's order.
- **Steps are numbered through the whole track**, not within a group: the multivariable group above starts at `08-partial-derivatives`. A step's number is its place in the outline, so URLs and links never depend on groups, and moving a step to another group changes nothing but `track.yaml`.
- **A planned step lives in `planned`** with the same title, summary, topics, hours, uses and project its front matter will have. When you write it, `new-step.mjs` starts the front matter from that entry; then delete the entry from `planned` (it stays in its group). A step is never in `planned` and in a folder at once.
- Without `groups`, the order is the step folders by number, then the planned steps in the order listed.

`check.mjs` checks all of this: unknown slugs, steps in no group or in two, a planned step that already has a folder, and folder numbers that disagree with the outline.

## Front matter

Every key below is checked. Keep the order.

```yaml
---
title: The law of large numbers and the central limit theorem
summary: Why averages settle down, and why the bell curve turns up everywhere.
topics: [Law of large numbers, Central limit theorem, Simulation]
hours: 4
uses:                          # steps in OTHER tracks this one relies on, as track/step
  - calculus/integrals
project: false                 # true only for the capstone
status: draft                  # draft | review | published (the maintainer sets published)
authors: [github-handle]
reviewers: []                  # filled in by reviewers, never by the author
last_reviewed:                 # set by the maintainer at merge, YYYY-MM-DD
assets:                        # every figure, plot and simulation, with who made it
  - file: figures/running-mean.svg
    kind: plot                 # diagram | plot | simulation | photo
    by: [github-handle]
    source: figures/src/running_mean.py
video:                         # leave out entirely if the step has no video
  youtube:                     # set by the project after it uploads; never by the author
  by: [github-handle]
  captions: video/captions.en.srt
---
```

- `summary` is one sentence that says what the learner will be able to do or understand. Under 120 characters.
- `topics` has three items, in the order the notes cover them.
- `hours` includes exercises. Be honest: a learner meeting the idea for the first time.
- `uses` is how the site draws links between tracks. List a step here only if this step genuinely relies on it. Steps earlier in the same track are assumed and never listed.

## Body

Four second-level headings, in this order, and no first-level heading (the title comes from the front matter):

1. `## The idea`
2. `## Worked example`
3. `## Exercises`
4. `## Further reading`

Third-level headings inside a section are fine. Extra second-level sections are allowed between The idea and Worked example when the step genuinely has two ideas (for example `## The central limit theorem`), but prefer splitting the step.

One extra section is common and encouraged: `## Summary`, placed after The idea and before Worked example. It collects the step's results as quick-reference tables (formula, meaning, when to use) and a short list of pitfalls, so a learner can revise without rereading. Everything in it must already be explained in The idea.

### The idea

- Open with the question the idea answers, in one or two sentences a learner would actually ask. Not "In this step we will".
- Intuition first: a picture, a small case, a physical situation. Then the definition. Then the notation.
- Define each symbol the first time it appears, in words, in the same sentence.
- State results precisely. A theorem gets its conditions. If a proof is long, give the idea of the proof and say where a full one can be found.
- One idea per paragraph. Short sentences when the maths is hard.
- Figures go where the text refers to them, never stacked at the end.
- 1,000 to 4,000 words is typical. If it runs past 4,500, the step is probably two steps; tell the maintainer.
- Short examples belong inside The idea, right after the idea they illustrate, under a bold label (`**Example 3.** ...`), numbered within the step.

### Worked example

- One main problem a learner could plausibly be given, solved in full, every step shown. Further solved problems may follow, each under its own `###` heading.
- Say why each step is taken, not just what it is.
- End by checking the answer: a sanity check, a limiting case, units, or a quick simulation.

### Exercises

- Three to six, easiest first.
- Mark each with its kind in bold at the start: **Check** (recall or a direct computation), **Apply** (use the idea on a new case), **Stretch** (combine with earlier steps or prove something).
- Every exercise has a hint, in a `<details>` block:

```markdown
1. **Apply.** A fair die is rolled 600 times. Roughly how far from 100 would you expect the count of sixes to be?

   <details><summary>Hint</summary>

   The count is a sum of 600 indicator variables. What are their mean and variance?

   </details>
```

- Answers go in `answers.md` in the same folder, numbered to match, with the working shown. The site shows them behind a reveal.
- Write new problems. Never copy exercises from a book, even with changed numbers.

### Further reading

- Two to five sources, free to read online with no account. Each is one list item: the link, then a colon, then one line on why it is worth the time.
- Prefer open textbooks, lecture notes published by their authors, and original papers on arXiv.
- Only sources you have actually seen. If you cannot confirm a link exists, do not include it; leave `<!-- CHECK: look for a free source on X -->` instead.

```markdown
- [Introduction to Probability, Grinstead and Snell, chapter 8](https://...): the clearest free treatment of the law of large numbers, with exercises.
```

## Maths

- KaTeX: `$...$` inline, `$$...$$` on its own lines for display. `aligned`, `cases` and `matrix` environments are fine; `\label`, `\ref` and custom packages are not.
- Macros the whole track uses go in `track.yaml` under `macros`, never in a step.
- Money goes outside the maths, with the dollar sign escaped: `a mean spend of \$20 ($\mu = 20$)`. A dollar sign inside `$...$` ends the maths, escaped or not; the checker flags it.
- Follow `notation.md`. Defaults if the track has none:

| Thing | Write | Example |
| --- | --- | --- |
| Scalars | italic lower case | $a$, $\lambda$ |
| Vectors | bold lower case | $\mathbf{v}$, $\mathbf{x}_i$ |
| Matrices | italic upper case | $A$, $Q^\top$ |
| Transpose | `^\top` | $A^\top$ |
| Sets of numbers | blackboard bold | $\mathbb{R}^n$ |
| Random variables | upper case; their values lower case | $X = x$ |
| Probability | `P` | $P(A \mid B)$ |
| Expectation, variance | `\mathbb{E}`, `\operatorname{Var}` | $\mathbb{E}[X]$, $\operatorname{Var}(X)$ |
| Estimators | hat | $\hat{\mu}$ |
| Sample mean | bar | $\bar{X}_n$ |
| Defined as | `:=` | $S_n := X_1 + \dots + X_n$ |

- Number only the equations the text refers back to, by writing the number in the text ("equation (2)") and `\tag{2}` in the display.
- Punctuate displayed equations as part of the sentence.

## Code

- Python by default (the language most learners have). Short blocks with a language tag. Every block must run as shown, with its imports.
- Use only the standard library, NumPy, SciPy and Matplotlib unless the track says otherwise.
- Fix random seeds: `rng = np.random.default_rng(6)`.

## Voice

- Write for someone clever who has not met the idea yet.
- Second person, present tense: "you roll the die", not "the student will roll".
- Never "simply", "obviously", "clearly", "just", "trivially" or "it is easy to see". If it were obvious, it would not need a step. The checker flags these.
- No jokes, emoji, exclamation marks, rhetorical build-ups or "let's dive in". No hype about the field.
- British or American spelling, but one per track; `notation.md` says which.
- Credit ideas to the people who had them when it helps understanding, not as decoration, and only when you are sure.

## Images in the notes

```markdown
![Five runs of 1,000 coin flips; each running mean wanders, then settles near one half.](figures/running-mean.svg "Running means of five runs of fair coin flips.")
```

- Alt text says what the figure shows and what to notice, in one or two sentences.
- The title in quotes is the caption shown under the figure.
- Link a simulation with an ordinary link on its own line; the site embeds it:

```markdown
[Simulation: flip coins and watch the running mean](sims/coin-flips.html)
```
