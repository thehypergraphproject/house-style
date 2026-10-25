# The Hypergraph Project house style

The house style for [The Hypergraph Project](https://thehypergraphproject.org), a free, open library of learning tracks. It is written as an **agent skill**, so an AI agent helping a contributor produces notes, diagrams, plots, simulations and video assets that match every other track, and as plain Markdown, templates and scripts, so a person working without an agent can follow exactly the same rules.

```
skills/hypergraph-house-style/
  SKILL.md              the entry point: rules for everything, and which reference to read for which job
  references/           notes, importing existing notes, figures, plots, simulations, video, credits, review
  assets/               tokens, step and notation templates, SVG figure, Matplotlib style, simulation,
                        Manim style, video title card, end card and description
  scripts/              new-step.mjs (scaffold a step), check.mjs (check a track before a pull request)
  examples/             a finished step in the house style, with every kind of asset
```

## Use it with your agent

The skill follows the open [Agent Skills](https://agentskills.io) format: a folder with a `SKILL.md`. Any agent that reads skills can use it.

**Claude Code**

```
/plugin marketplace add thehypergraphproject/house-style
/plugin install hypergraph-house-style@hypergraph
```

Or copy the folder in by hand: `skills/hypergraph-house-style` to `~/.claude/skills/` (for you) or to `.claude/skills/` in a track repository (for everyone working in it).

**Codex, Cursor, Gemini CLI, GitHub Copilot and other agents that read skills**

Copy `skills/hypergraph-house-style` into the skills folder your agent reads (each tool documents its own location), or install it with the open `skills` installer:

```
npx skills add thehypergraphproject/house-style
```

**Any other agent, or none**

Every track repository has an `AGENTS.md` that tells an agent to read this skill before writing anything, and how to fetch it:

```
git clone --depth 1 --branch v1 https://github.com/thehypergraphproject/house-style .house-style
```

`.house-style/` is ignored by Git in track repositories. A person without an agent reads `SKILL.md` and the references the same way.

## Check your work

Node 18 or later; nothing to install.

```
node .house-style/skills/hypergraph-house-style/scripts/check.mjs .                  # the whole track
node .house-style/skills/hypergraph-house-style/scripts/check.mjs . --step 03-distributions
```

The same check runs in every track repository's CI on each pull request, against the house-style version named in `track.yaml`.

## Change the house style

Open an issue first: a change here changes every track. See [AGENTS.md](AGENTS.md) for how the skill is maintained and [CHANGELOG.md](CHANGELOG.md) for versioning.

## Licence

MIT. The fonts it names, Geist, Geist Mono and Geist Pixel, are under the SIL Open Font License.
