# Reviewing a step

The maintainer and one other reviewer check every step before it is published. Use this list as a reviewer, and as an author or agent before asking for review. `check.mjs` covers what a script can see; this covers the rest.

## Correct

- [ ] Every definition, theorem and its conditions are right. Every derivation follows line by line.
- [ ] Every number in the text, worked example and answers is right. Every code block runs as shown and prints what the text says.
- [ ] Plots match their scripts: re-run the script and compare.
- [ ] Simulations compute what they claim.
- [ ] Every Further reading link opens, is free to read, and is what the line says it is.
- [ ] No `<!-- CHECK -->` comment is left unresolved.

## Clear

- [ ] The step opens with a question a learner would ask.
- [ ] Intuition comes before formalism; every symbol is defined where it first appears.
- [ ] Notation matches `notation.md` and the neighbouring steps.
- [ ] The worked example shows every step and says why each is taken.
- [ ] Exercises run from easy to hard, each has a hint, and `answers.md` covers them all.
- [ ] A learner who finished the previous step could follow it without outside help.

## Fits the track

- [ ] It covers the topics in its front matter, in that order, and nothing that belongs to a later step.
- [ ] `uses` lists the steps from other tracks it relies on, and only those.
- [ ] Hours are honest.

## House style

- [ ] Figures follow figures.md and plots.md: monochrome, flat, one idea, labelled directly, no title in the image.
- [ ] Alt text says what each figure shows and what to notice.
- [ ] Simulations start still, use the seeded generator, work with a keyboard and at 320px wide.
- [ ] Voice: plain, second person, no "simply" or "obviously", no hype.

## Credit and licence

- [ ] Every asset is in `assets` with the people who made it.
- [ ] Anything from outside has `origin`, `licence` and `credit`, under an allowed licence.
- [ ] Nothing is copied from a book, course or slides, including exercises.
- [ ] The pull request says whether an AI agent helped.

## For a video, also

- [ ] Watched in full. It agrees with the notes and makes no claim the notes do not support.
- [ ] Title card, end card and thumbnail come from the templates, with the right names on the end card.
- [ ] Captions are edited and in sync.
- [ ] Audio is clear and level; no music under speech, no commercial music.
- [ ] Nothing on screen is in colour, too small (under 28px) or gone too fast to read.
