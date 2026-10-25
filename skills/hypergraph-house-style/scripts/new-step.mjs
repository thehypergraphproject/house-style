#!/usr/bin/env node
// Creates a step folder in a Hypergraph track repository, with index.md from the house template.
// If the step is listed under "planned" in track.yaml, its front matter starts from that entry.
//
//   node new-step.mjs <track-repo> <number> <slug> ["<Title>"] [--author <github-handle>]
//   node new-step.mjs ../track-linear-algebra 4 determinants "Determinants" --author ada-example

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYaml } from "./yaml.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const authorAt = args.indexOf("--author");
const author = authorAt === -1 ? "github-handle" : args[authorAt + 1];
const [repoArg, numArg, slug, titleArg] = authorAt === -1 ? args : args.filter((_, i) => i !== authorAt && i !== authorAt + 1);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!repoArg || !numArg || !slug) {
  fail('Usage: node new-step.mjs <track-repo> <number> <slug> ["<Title>"] [--author <github-handle>]');
}
const repo = resolve(repoArg);
if (!existsSync(join(repo, "track.yaml"))) fail(`${repoArg} has no track.yaml; point at the track repository root.`);
const n = Number(numArg);
if (!Number.isInteger(n) || n < 1 || n > 99) fail("The number must be a whole number from 1 to 99.");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("The slug must be lower-case kebab-case, e.g. law-of-large-numbers.");
if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(author)) fail(`"${author}" is not a GitHub handle.`);

const folder = `${String(n).padStart(2, "0")}-${slug}`;
const dir = join(repo, folder);
if (existsSync(dir)) fail(`${folder} already exists.`);

let track = {};
try {
  track = parseYaml(readFileSync(join(repo, "track.yaml"), "utf8")) ?? {};
} catch (e) {
  fail(`track.yaml does not parse (${e.message}); fix it first.`);
}
const planned = Array.isArray(track.planned) ? track.planned.find((p) => p?.slug === slug) : undefined;
const title = titleArg ?? planned?.title;
if (!title) fail(`${slug} is not under "planned" in track.yaml, so give its title: node new-step.mjs ${repoArg} ${numArg} ${slug} "<Title>"`);

// Quote a value only when plain YAML would misread it; inside [ ] a comma also needs quotes.
const plainUnsafe = (s) => /:\s|\s#|^[-?:,[\]{}#&*!|>'"%@`]|^\s|\s$|:$/.test(s);
const yamlText = (s) => (plainUnsafe(String(s)) ? JSON.stringify(String(s)) : String(s));
const yamlList = (xs) => `[${xs.map((x) => (/[,[\]{}]/.test(String(x)) ? JSON.stringify(String(x)) : yamlText(x))).join(", ")}]`;

let body = readFileSync(join(here, "..", "assets", "step.md"), "utf8")
  .replaceAll("{{TITLE}}", yamlText(title))
  .replaceAll("{{AUTHOR}}", author);
if (planned) {
  const fill = {
    summary: planned.summary && yamlText(planned.summary),
    topics: Array.isArray(planned.topics) && yamlList(planned.topics),
    hours: typeof planned.hours === "number" && String(planned.hours),
    uses: Array.isArray(planned.uses) && yamlList(planned.uses),
    project: typeof planned.project === "boolean" && String(planned.project),
  };
  for (const [key, value] of Object.entries(fill)) if (value) body = body.replace(new RegExp(`^${key}: .*$`, "m"), `${key}: ${value}`);
}
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.md"), body);

console.log(`Created ${folder}/index.md`);
if (planned) console.log(`Its front matter starts from the planned entry. Now delete "${slug}" from "planned" in track.yaml; it stays in its group.`);
console.log("Next: fill in the front matter and the four sections, add figures/ and sims/ as needed,");
console.log(`then run: node ${join(here, "check.mjs")} ${repoArg} --step ${folder}`);
