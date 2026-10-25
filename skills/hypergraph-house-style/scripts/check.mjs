#!/usr/bin/env node
// Checks a Hypergraph track repository against the house style. Node 18 or later, no dependencies.
//
//   node check.mjs <track-repo>                     every step
//   node check.mjs <track-repo> --step 06-limit-theorems
//   node check.mjs <track-repo> --json              machine-readable findings
//
// Errors break the house style and fail CI. Warnings are for the author and reviewers to judge.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";
import { frontMatter, parseYaml } from "./yaml.mjs";

const PALETTE = new Set(["#0f0f0f", "#5c5c5c", "#8a8a88", "#dededc", "#ebebea", "#f5f5f4", "#ffffff"]);
const NO_COLOUR = new Set(["none", "transparent", "currentcolor", "inherit", "white"]);
const STEP_DIR = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const REF = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HANDLE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const SECTIONS = ["The idea", "Worked example", "Exercises", "Further reading"];
const TALKING_DOWN = /\b(simply|obviously|clearly|trivially|just|of course|it is easy to see|it's easy to see)\b/gi;
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TRACK_STATUS = ["wanted", "outline", "in-progress", "published"];
const STEP_STATUS = ["draft", "review", "published"];
const KINDS = ["diagram", "plot", "simulation", "photo"];
const LICENCES = /^(public domain|cc0( 1\.0)?|cc by( \d\.\d)?|cc by-sa( \d\.\d)?)$/i;
const IMAGE_EXT = [".svg", ".png", ".jpg", ".jpeg", ".webp"];
const TRACK_KEYS = ["title", "tagline", "summary", "field", "level", "status", "before", "maintainers", "style", "macros", "groups", "planned"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STEP_KEYS = ["title", "summary", "topics", "hours", "uses", "project", "status", "authors", "reviewers", "last_reviewed", "assets", "video"];
const TEMPLATE_TEXT = ["One sentence on what the learner", "First topic", "{{", "github-handle"];

const args = process.argv.slice(2);
const json = args.includes("--json");
const stepArg = args.includes("--step") ? args[args.indexOf("--step") + 1] : null;
const root = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--step");

const findings = [];
const report = (level, file, line, message) =>
  findings.push({ level, file: relative(process.cwd(), file).split(sep).join("/") || ".", line, message });
const error = (f, l, m) => report("error", f, l, m);
const warn = (f, l, m) => report("warn", f, l, m);

if (!root) {
  console.error("Usage: node check.mjs <track-repo> [--step NN-slug] [--json]");
  process.exit(2);
}
const repo = resolve(root);
if (!existsSync(repo) || !statSync(repo).isDirectory()) {
  console.error(`Not a folder: ${root}`);
  process.exit(2);
}

const read = (p) => readFileSync(p, "utf8");
const kb = (p) => statSync(p).size / 1024;
const isList = (v) => Array.isArray(v);
const nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const keyLine = (yaml, key, offset = 1) => {
  const idx = (yaml ?? "").split("\n").findIndex((l) => new RegExp(`^\\s*-?\\s*${key}:`).test(l));
  return idx === -1 ? offset : idx + offset + 1;
};
const lineWith = (yaml, needle, offset = 1) => {
  const idx = (yaml ?? "").split("\n").findIndex((l) => l.includes(needle));
  return idx === -1 ? offset : idx + offset + 1;
};
const hasTemplateText = (v) => TEMPLATE_TEXT.some((t) => JSON.stringify(v ?? "").includes(t));

function normaliseColour(raw) {
  const v = raw.trim().toLowerCase();
  if (NO_COLOUR.has(v)) return v === "white" ? "#ffffff" : null;
  if (v.startsWith("url(")) return null; // markers and clip paths; gradients are rejected separately
  let m = v.match(/^#([0-9a-f]{3})$/);
  if (m) return `#${[...m[1]].map((c) => c + c).join("")}`;
  m = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m) return `#${m[1]}`;
  m = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (m) return `#${m.slice(1, 4).map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
  return v; // a named colour: never in the palette
}

/* ---------------- track ---------------- */

function checkTrack() {
  const file = join(repo, "track.yaml");
  if (!existsSync(file)) {
    error(repo, 1, "track.yaml is missing: this does not look like a track repository");
    return null;
  }
  const text = read(file);
  let t;
  try {
    t = parseYaml(text);
  } catch (e) {
    error(file, e.line ?? 1, e.message);
    return null;
  }
  const at = (k) => keyLine(text, k, 0);
  for (const k of ["title", "tagline", "summary", "field"]) if (!nonEmptyString(t[k])) error(file, at(k), `"${k}" is required`);
  if (!LEVELS.includes(t.level)) error(file, at("level"), `"level" must be one of ${LEVELS.join(", ")}`);
  if (!TRACK_STATUS.includes(t.status)) error(file, at("status"), `"status" must be one of ${TRACK_STATUS.join(", ")}`);
  if (!isList(t.before)) error(file, at("before"), `"before" must be a list of track slugs (it can be empty: [])`);
  if (!isList(t.maintainers) || !t.maintainers.length) warn(file, at("maintainers"), "no maintainer listed yet");
  if (typeof t.style !== "number") error(file, at("style"), `"style" must be the house-style major version this track follows, e.g. 1`);
  for (const k of Object.keys(t)) if (!TRACK_KEYS.includes(k)) warn(file, at(k), `unknown key "${k}"`);
  if (!existsSync(join(repo, "notation.md"))) warn(repo, 1, "notation.md is missing: copy assets/notation.md and fill it in");
  return { t, text, file };
}

function stepFolders() {
  const dirs = readdirSync(repo, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("."));
  const steps = [];
  const seen = new Map();
  for (const d of dirs) {
    const m = d.name.match(STEP_DIR);
    if (!m) {
      if (/^\d/.test(d.name)) error(join(repo, d.name), 1, `step folders are named NN-slug in lower-case kebab-case, e.g. 03-distributions`);
      continue;
    }
    const n = Number(m[1]);
    if (seen.has(n)) error(join(repo, d.name), 1, `number ${m[1]} is also used by ${seen.get(n)}`);
    seen.set(n, d.name);
    steps.push({ name: d.name, n, slug: m[2] });
  }
  return steps.sort((a, b) => a.n - b.n);
}

/* ---------------- outline: groups and planned steps ---------------- */

const PLANNED_KEYS = ["slug", "title", "summary", "topics", "hours", "uses", "project"];
const GROUP_KEYS = ["slug", "title", "summary", "steps"];
/** The line of track.yaml that names this slug, e.g. "  - slug: univariate". */
const slugLine = (text, slug) =>
  text.split("\n").findIndex((l) => l.replace(/\s+#.*$/, "").trim().replace(/^-\s*/, "") === `slug: ${slug}`) + 1 || 1;

/** Steps outlined but not written yet: a step's front matter, minus the authorship. */
function checkPlanned(track, written) {
  const { t, text, file } = track;
  if (t.planned == null) return [];
  if (!isList(t.planned)) {
    error(file, keyLine(text, "planned", 0), `"planned" must be a list of steps, each with slug, title, summary, topics and hours`);
    return [];
  }
  const out = [];
  for (const p of t.planned) {
    if (!p || typeof p !== "object" || isList(p)) {
      error(file, keyLine(text, "planned", 0), "each planned step needs slug, title, summary, topics and hours");
      continue;
    }
    const line = slugLine(text, p.slug);
    if (!SLUG.test(String(p.slug ?? ""))) {
      error(file, line, `planned step "${p.slug ?? ""}": the slug must be lower-case kebab-case`);
      continue;
    }
    if (written.has(p.slug)) error(file, line, `${p.slug} is written (${written.get(p.slug).name}); remove it from "planned"`);
    if (out.includes(p.slug)) error(file, line, `${p.slug} is planned twice`);
    for (const k of ["title", "summary"]) if (!nonEmptyString(p[k])) error(file, line, `planned step ${p.slug}: "${k}" is required`);
    if (!isList(p.topics) || !p.topics.length) error(file, line, `planned step ${p.slug}: "topics" must list what it will cover`);
    if (typeof p.hours !== "number" || p.hours < 1 || p.hours > 12) error(file, line, `planned step ${p.slug}: "hours" must be a number from 1 to 12`);
    if (p.uses != null && !(isList(p.uses) && p.uses.every((u) => REF.test(String(u))))) {
      error(file, line, `planned step ${p.slug}: "uses" must list step references like track-slug/step-slug`);
    }
    if (p.project != null && typeof p.project !== "boolean") error(file, line, `planned step ${p.slug}: "project" must be true or false`);
    for (const k of Object.keys(p)) if (!PLANNED_KEYS.includes(k)) warn(file, line, `planned step ${p.slug}: unknown key "${k}"`);
    out.push(p.slug);
  }
  return out;
}

/**
 * The outline is every step in order: the groups' steps one after another, or, without groups, the written
 * steps by number and then the planned ones. A step's number is its place in the outline.
 */
function checkOutline(track, steps) {
  if (!track) return;
  const { t, text, file } = track;
  const written = new Map(steps.map((s) => [s.slug, s]));
  const planned = checkPlanned(track, written);
  let outline = [...steps.map((s) => s.slug), ...planned];

  if (t.groups != null) {
    const at = keyLine(text, "groups", 0);
    if (!isList(t.groups) || !t.groups.length) {
      error(file, at, `"groups" must be a list of groups, each with slug, title and steps`);
      return;
    }
    const groupSlugs = new Set();
    const placed = new Map();
    outline = [];
    for (const g of t.groups) {
      if (!g || typeof g !== "object" || isList(g)) {
        error(file, at, "each group needs slug, title and steps");
        continue;
      }
      const line = slugLine(text, g.slug);
      if (!SLUG.test(String(g.slug ?? ""))) error(file, line, `group "${g.slug ?? ""}": the slug must be lower-case kebab-case`);
      else if (groupSlugs.has(g.slug)) error(file, line, `group ${g.slug} appears twice`);
      groupSlugs.add(g.slug);
      if (!nonEmptyString(g.title)) error(file, line, `group ${g.slug}: "title" is required`);
      if (g.summary != null && !nonEmptyString(g.summary)) error(file, line, `group ${g.slug}: "summary" must be one line of text`);
      for (const k of Object.keys(g)) if (!GROUP_KEYS.includes(k)) warn(file, line, `group ${g.slug}: unknown key "${k}"`);
      if (!isList(g.steps) || !g.steps.length) {
        error(file, line, `group ${g.slug}: "steps" must list its step slugs, in order`);
        continue;
      }
      if (g.steps.length < 3) warn(file, line, `group ${g.slug} has ${g.steps.length} step${g.steps.length === 1 ? "" : "s"}; a group usually holds three or more`);
      for (const s of g.steps) {
        if (placed.has(s)) error(file, line, `${s} is in group ${placed.get(s)} and in group ${g.slug}; a step belongs to one group`);
        else if (!written.has(s) && !planned.includes(s)) error(file, line, `group ${g.slug} lists ${s}, which is neither a step folder nor in "planned"`);
        else {
          placed.set(s, g.slug);
          outline.push(s);
        }
      }
    }
    for (const s of [...written.keys(), ...planned]) {
      if (!placed.has(s)) error(file, at, `${written.has(s) ? written.get(s).name : `planned step ${s}`} is in no group; every step belongs to one`);
    }
  }

  // Folder numbers and the outline must agree.
  let previous = null;
  outline.forEach((slug, i) => {
    const s = written.get(slug);
    if (!s) return;
    const expected = `${String(i + 1).padStart(2, "0")}-${slug}`;
    if (previous && s.n < previous.n) error(join(repo, s.name), 1, `the outline puts ${s.name} after ${previous.name}; renumber the folders or reorder the outline`);
    else if (!stepArg && s.n !== i + 1) warn(join(repo, s.name), 1, `this is step ${i + 1} of the outline, so its folder should be ${expected}`);
    previous = s;
  });
}

/* ---------------- step ---------------- */

function checkFrontMatter(file, fm) {
  const d = fm.data;
  const at = (k) => keyLine(fm.yaml, k, 1);
  for (const k of ["title", "summary"]) if (!nonEmptyString(d[k])) error(file, at(k), `"${k}" is required`);
  if (nonEmptyString(d.summary) && d.summary.length > 120) warn(file, at("summary"), `summary is ${d.summary.length} characters; keep it under 120`);
  if (!isList(d.topics) || !d.topics.length) error(file, at("topics"), `"topics" must list what the step covers`);
  else if (d.topics.length !== 3) warn(file, at("topics"), `steps usually have three topics; this has ${d.topics.length}`);
  if (typeof d.hours !== "number" || d.hours < 1 || d.hours > 12) error(file, at("hours"), `"hours" must be a number from 1 to 12, exercises included`);
  else if (d.hours > 8) warn(file, at("hours"), `${d.hours} hours is long for one sitting; consider splitting the step`);
  if (!isList(d.uses)) error(file, at("uses"), `"uses" must be a list (empty is fine: [])`);
  else for (const u of d.uses) if (!REF.test(String(u))) error(file, at("uses"), `"${u}" is not a step reference like track-slug/step-slug`);
  if (typeof d.project !== "boolean") error(file, at("project"), `"project" must be true or false`);
  if (!STEP_STATUS.includes(d.status)) error(file, at("status"), `"status" must be one of ${STEP_STATUS.join(", ")}`);
  if (!isList(d.authors) || !d.authors.length) error(file, at("authors"), `"authors" must list at least one GitHub handle`);
  else for (const a of d.authors) if (!HANDLE.test(String(a))) error(file, at("authors"), `"${a}" is not a GitHub handle`);
  if (!isList(d.reviewers)) error(file, at("reviewers"), `"reviewers" must be a list (empty until review: [])`);
  if (d.last_reviewed != null && !DATE.test(String(d.last_reviewed))) error(file, at("last_reviewed"), `"last_reviewed" must be a date, YYYY-MM-DD`);
  if (d.status === "published") {
    if (!isList(d.reviewers) || d.reviewers.length < 2) error(file, at("reviewers"), "a published step needs two reviewers");
    if (d.last_reviewed == null) error(file, at("last_reviewed"), "a published step needs last_reviewed");
  }
  for (const k of Object.keys(d)) if (!STEP_KEYS.includes(k)) warn(file, at(k), `unknown key "${k}"`);
  for (const k of ["summary", "topics", "authors"]) if (hasTemplateText(d[k])) warn(file, at(k), `"${k}" still has template text`);
}

function checkAssets(file, fm, dir) {
  const d = fm.data;
  const listed = new Map();
  if (d.assets == null) return listed;
  const at = keyLine(fm.yaml, "assets", 1);
  if (!isList(d.assets)) {
    error(file, at, `"assets" must be a list of files with who made them`);
    return listed;
  }
  for (const a of d.assets) {
    if (!a || typeof a !== "object" || isList(a)) {
      error(file, at, "each asset needs file, kind and by");
      continue;
    }
    const line = lineWith(fm.yaml, `file: ${a.file}`);
    if (!nonEmptyString(a.file)) {
      error(file, at, "an asset is missing its file");
      continue;
    }
    listed.set(a.file, a);
    if (!existsSync(join(dir, a.file))) error(file, line, `asset ${a.file} does not exist`);
    if (!KINDS.includes(a.kind)) error(file, line, `asset ${a.file}: kind must be one of ${KINDS.join(", ")}`);
    if (!isList(a.by) || !a.by.length) error(file, line, `asset ${a.file}: "by" must list who made it`);
    if (a.kind === "plot") {
      if (!nonEmptyString(a.source)) error(file, line, `plot ${a.file} needs "source": the script that generates it`);
      else if (!existsSync(join(dir, a.source))) error(file, line, `plot source ${a.source} does not exist`);
    }
    const outside = a.origin || a.licence || a.credit || a.kind === "photo";
    if (outside) {
      if (!nonEmptyString(a.origin)) error(file, line, `${a.file}: material from outside needs "origin" (where it came from)`);
      if (!nonEmptyString(a.credit)) error(file, line, `${a.file}: material from outside needs "credit" (as its licence asks)`);
      if (!LICENCES.test(String(a.licence ?? ""))) error(file, line, `${a.file}: licence must be public domain, CC0, CC BY or CC BY-SA (got "${a.licence ?? ""}")`);
    }
  }
  return listed;
}

function checkVideo(file, fm, dir) {
  const v = fm.data.video;
  const hasFolder = existsSync(join(dir, "video"));
  if (v == null) {
    if (hasFolder) warn(join(dir, "video"), 1, `there is a video folder but no "video" in the front matter`);
    return;
  }
  const at = keyLine(fm.yaml, "video", 1);
  if (typeof v !== "object" || isList(v)) {
    error(file, at, `"video" must have youtube, by and captions (youtube is filled in by the project)`);
    return;
  }
  if (v.youtube != null && !YOUTUBE_ID.test(String(v.youtube))) error(file, at, `video.youtube must be an 11-character YouTube id, not a URL`);
  if (!isList(v.by) || !v.by.length) error(file, at, `video.by must list everyone who made the video`);
  const captions = nonEmptyString(v.captions) ? join(dir, v.captions) : null;
  if (!captions || !existsSync(captions)) (v.youtube ? error : warn)(file, at, "edited captions (video/captions.en.srt) are required before the video is published");
  if (!existsSync(join(dir, "video", "description.md"))) warn(file, at, "video/description.md is missing (template: assets/video-description.md)");
}

/** True if a line has \$ inside single-dollar inline maths, where Markdown ends the maths at it. */
function dollarInInlineMaths(line) {
  let inside = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\\" && line[i + 1] === "$") {
      if (inside) return true;
      i++;
    } else if (line[i] === "$") {
      if (line[i + 1] === "$") i++;
      else inside = !inside;
    }
  }
  return false;
}

function stripInline(line) {
  return line
    .replace(/`[^`]*`/g, "")
    .replace(/\$\$[^$]*\$\$/g, "")
    .replace(/(?<!\\)\$[^$]*?(?<!\\)\$/g, "")
    .replace(/<!--.*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\]\([^)]*\)/g, "]");
}

function checkBody(file, fm, dir, listed) {
  const lines = fm.body.split("\n");
  const L = (i) => fm.bodyLine + i;
  const h2 = [];
  const referenced = new Set();
  let fence = null;
  let inComment = false;
  let inMath = false;
  let dollars = 0;
  let section = null;
  const sectionText = {};

  lines.forEach((raw, i) => {
    const fenceMatch = raw.match(/^\s*(```|~~~)/);
    if (fence) {
      if (fenceMatch && raw.trim().startsWith(fence)) fence = null;
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      return;
    }
    if (raw.includes("<!--") && raw.includes("CHECK")) warn(file, L(i), `unresolved CHECK: ${raw.replace(/.*<!--\s*CHECK:?\s*/, "").replace(/\s*-->.*/, "")}`);
    if (inComment) {
      if (raw.includes("-->")) inComment = false;
      return;
    }
    if (raw.includes("<!--") && !raw.includes("-->")) inComment = true;

    // Display maths spread over several lines: count its $$ but check nothing inside it as prose.
    const fences = (raw.match(/\$\$/g) || []).length;
    if (inMath || (fences % 2 === 1 && /^\s*\$\$/.test(raw))) {
      dollars += fences * 2;
      if (fences % 2 === 1) inMath = !inMath;
      if (section) sectionText[section].push({ raw: "", line: L(i) });
      return;
    }

    if (/^#\s/.test(raw)) error(file, L(i), "no first-level headings: the title comes from the front matter");
    const h = raw.match(/^##\s+(.+?)\s*#*$/);
    if (h) {
      h2.push({ title: h[1], line: L(i) });
      section = h[1];
      sectionText[section] = [];
    } else if (section) sectionText[section].push({ raw, line: L(i) });

    dollars += (raw.replace(/`[^`]*`/g, "").replace(/\\\$/g, "").match(/\$/g) || []).length;
    if (dollarInInlineMaths(raw.replace(/`[^`]*`/g, ""))) {
      error(file, L(i), "a dollar sign inside $...$ ends the maths, escaped or not; write amounts of money outside it, as \\$20");
    }

    const prose = stripInline(raw);
    for (const m of prose.matchAll(TALKING_DOWN)) warn(file, L(i), `"${m[0]}" tells the reader it is easy; say why instead, or cut it`);
    // Maths is already stripped, so a factorial written outside $...$ is flagged too, which is right.
    if (/!(?!\[)/.test(prose.replace(/!=/g, ""))) warn(file, L(i), "no exclamation marks in notes (factorials belong inside $...$)");

    for (const m of raw.matchAll(/!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"([^"]*)")?\s*\)/g)) {
      const [, alt, src, caption] = m;
      referenced.add(src);
      if (!alt.trim()) error(file, L(i), `image ${src} has no alt text: say what it shows and what to notice`);
      if (/^[a-z]+:\/\//i.test(src) || src.startsWith("/")) error(file, L(i), `image ${src} must be a file in this step's folder`);
      else {
        if (!IMAGE_EXT.includes(extname(src).toLowerCase())) error(file, L(i), `image ${src}: use SVG for drawings, JPEG or WebP for photos`);
        if (!existsSync(join(dir, src))) error(file, L(i), `image ${src} does not exist`);
        if (!listed.has(src)) warn(file, L(i), `image ${src} is not in "assets", so nobody is credited for it`);
      }
      if (!caption) warn(file, L(i), `image ${src} has no caption: add one in quotes after the path`);
    }
    for (const m of raw.matchAll(/(?<!!)\[[^\]]+\]\(\s*([^)\s]+)[^)]*\)/g)) {
      const href = m[1];
      if (/^[a-z]+:/i.test(href) || href.startsWith("#") || href.startsWith("/")) continue;
      referenced.add(href);
      if (!existsSync(join(dir, href.split("#")[0]))) error(file, L(i), `link to ${href}, which does not exist`);
      if (href.startsWith("sims/") && !listed.has(href)) warn(file, L(i), `simulation ${href} is not in "assets"`);
    }
  });

  if (fence) error(file, L(lines.length - 1), "a code fence is never closed");
  if (dollars % 2) warn(file, fm.bodyLine, "an odd number of $ signs: a maths expression may not be closed");

  // Sections, in order.
  const titles = h2.map((h) => h.title);
  let last = -1;
  for (const s of SECTIONS) {
    const idx = titles.indexOf(s);
    if (idx === -1) error(file, fm.bodyLine, `missing section "## ${s}"`);
    else if (idx < last) error(file, h2[idx].line, `"## ${s}" is out of order; sections go ${SECTIONS.join(", ")}`);
    else last = idx;
  }
  const extra = h2.filter((h) => !SECTIONS.includes(h.title));
  const idea = titles.indexOf("The idea");
  const worked = titles.indexOf("Worked example");
  for (const h of extra) {
    const i = titles.indexOf(h.title);
    if (!(i > idea && i < worked)) warn(file, h.line, `"## ${h.title}": extra sections belong between The idea and Worked example`);
  }

  // The idea: length.
  const ideaWords = (sectionText["The idea"] || []).map((l) => stripInline(l.raw)).join(" ").split(/\s+/).filter(Boolean).length;
  if (ideaWords > 4500) warn(file, fm.bodyLine, `The idea runs to ${ideaWords} words; past 4,500 it is probably two steps`);

  // Exercises: count, kinds, hints, answers.
  const ex = sectionText["Exercises"];
  if (ex) {
    const items = ex.filter((l) => /^\d+\.\s/.test(l.raw));
    if (items.length < 3 || items.length > 6) warn(file, items[0]?.line ?? fm.bodyLine, `${items.length} exercises; aim for three to six`);
    for (const it of items) if (!/^\d+\.\s+\*\*(Check|Apply|Stretch)\.\*\*/.test(it.raw)) warn(file, it.line, "start each exercise with **Check.**, **Apply.** or **Stretch.**");
    const hints = ex.filter((l) => /<details>/.test(l.raw)).length;
    if (hints < items.length) warn(file, items[0]?.line ?? fm.bodyLine, `${items.length} exercises but ${hints} hints; every exercise gets a hint`);
    if (items.length && !existsSync(join(dir, "answers.md"))) warn(file, items[0].line, "answers.md is missing");
  }

  // Further reading: links with a reason.
  const fr = sectionText["Further reading"];
  if (fr) {
    const items = fr.filter((l) => /^\s*[-*]\s/.test(l.raw));
    if (items.length && (items.length < 2 || items.length > 5)) warn(file, items[0].line, `${items.length} sources; aim for two to five`);
    for (const it of items) {
      if (!/\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(it.raw)) warn(file, it.line, "each source needs a link");
      else if (!/\)\s*[:—-]\s*\S/.test(it.raw)) warn(file, it.line, "follow each link with a colon and one line on why it is worth reading");
    }
  }
  return referenced;
}

/* ---------------- assets on disk ---------------- */

function checkSvg(file, kind) {
  const s = read(file);
  const lineOf = (idx) => s.slice(0, idx).split("\n").length;
  for (const [re, what] of [
    [/<script\b/i, "scripts"],
    [/<image\b/i, "embedded raster images"],
    [/<(linear|radial)Gradient\b/i, "gradients"],
    [/<filter\b/i, "filters (shadows, blurs)"],
    [/<pattern\b/i, "patterns"],
    [/<foreignObject\b/i, "foreignObject"],
  ]) {
    const m = s.match(re);
    if (m) error(file, lineOf(m.index), `figures must not contain ${what}`);
  }
  if (!/viewBox=/.test(s)) warn(file, 1, "no viewBox: set it to the figure's size in pixels");
  const bad = new Map();
  for (const m of s.matchAll(/(?<![\w-])(fill|stroke|stop-color|color|flood-color)\s*(?:=\s*["']|:\s*)([^"';}<>]+)/gi)) {
    const value = m[2].trim().replace(/\s*!important$/, "");
    const c = normaliseColour(value);
    if (c && !PALETTE.has(c) && !bad.has(c)) bad.set(c, lineOf(m.index));
  }
  for (const [c, line] of bad) error(file, line, `colour ${c} is not in the house palette (ink, greys, white)`);
  for (const m of s.matchAll(/font-family\s*(?:=\s*"([^"]+)"|=\s*'([^']+)'|:\s*([^;}<]+))/gi)) {
    const family = (m[1] ?? m[2] ?? m[3]).trim();
    if (!/Geist|KaTeX/i.test(family)) warn(file, lineOf(m.index), `font ${family}: use Geist for labels, KaTeX_Math for maths`);
  }
  const limit = kind === "plot" ? 300 : 100;
  if (kb(file) > limit) warn(file, 1, `${Math.round(kb(file))} KB; keep ${kind ?? "figures"} under ${limit} KB`);
}

function checkRaster(file) {
  if (kb(file) > 300) warn(file, 1, `${Math.round(kb(file))} KB; photos should be under 300 KB (longest side 1600px)`);
}

function checkSimulation(file) {
  const s = read(file);
  const lineOf = (idx) => s.slice(0, idx).split("\n").length;
  const scriptSrc = s.match(/<script\b[^>]*\bsrc\s*=/i);
  if (scriptSrc) error(file, lineOf(scriptSrc.index), "no external scripts: a simulation is one self-contained file");
  for (const m of s.matchAll(/<link\b[^>]*rel=["']?stylesheet[^>]*>/gi)) {
    if (!/fonts\.googleapis\.com/.test(m[0])) error(file, lineOf(m.index), "only Google Fonts may be linked; put styles in the file");
  }
  for (const [re, what] of [
    [/\bfetch\s*\(/, "fetch"],
    [/XMLHttpRequest/, "XMLHttpRequest"],
    [/WebSocket/, "WebSocket"],
    [/localStorage|sessionStorage|indexedDB/, "browser storage"],
    [/document\.cookie/, "cookies"],
  ]) {
    const m = s.match(re);
    if (m) error(file, lineOf(m.index), `${what} is not available in the sandbox the site uses`);
  }
  const rnd = s.match(/Math\.random/);
  if (rnd) warn(file, lineOf(rnd.index), "use the seeded generator (mulberry32) so runs are reproducible");
  if (/requestAnimationFrame/.test(s) && !/prefers-reduced-motion/.test(s)) warn(file, 1, "animates without honouring prefers-reduced-motion");
  if (!/<html[^>]*\blang=/i.test(s)) warn(file, 1, "set lang on <html>");
  if (!/<title>[^<]+<\/title>/i.test(s)) warn(file, 1, "add a <title>");
  if (!/aria-live/.test(s)) warn(file, 1, "announce the main readout with aria-live");
  const bad = new Set();
  for (const m of s.matchAll(/(?:[:(,\s=]|["'])#([0-9a-f]{3}|[0-9a-f]{6})\b/gi)) {
    const c = normaliseColour(`#${m[1]}`);
    if (!PALETTE.has(c)) bad.add(c);
  }
  if (bad.size) warn(file, 1, `colours outside the palette: ${[...bad].join(", ")}`);
  if (kb(file) > 150) warn(file, 1, `${Math.round(kb(file))} KB; keep simulations under 150 KB`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
}

function checkStep(step) {
  const dir = join(repo, step.name);
  const file = join(dir, "index.md");
  if (!existsSync(file)) {
    error(dir, 1, "index.md is missing");
    return;
  }
  const fm = frontMatter(read(file));
  if (fm.error) {
    error(file, fm.errorLine ?? 1, fm.error);
    return;
  }
  checkFrontMatter(file, fm);
  const listed = checkAssets(file, fm, dir);
  checkVideo(file, fm, dir);
  const referenced = checkBody(file, fm, dir, listed);

  const posix = (p) => relative(dir, p).split(sep).join("/");
  for (const f of walk(join(dir, "figures"))) {
    const rel = posix(f);
    const ext = extname(f).toLowerCase();
    if (rel.startsWith("figures/src/")) continue;
    if (ext === ".svg") checkSvg(f, listed.get(rel)?.kind);
    else if (IMAGE_EXT.includes(ext)) checkRaster(f);
    else warn(f, 1, "only figures belong in figures/; scripts go in figures/src/");
    if (!referenced.has(rel) && !listed.has(rel)) warn(f, 1, "not used in the notes and not listed in assets");
  }
  for (const f of walk(join(dir, "sims"))) {
    if (extname(f).toLowerCase() === ".html") checkSimulation(f);
    else warn(f, 1, "sims/ holds one self-contained HTML file per simulation");
  }
  for (const f of walk(join(dir, "video"))) {
    if (/\.(mp4|mov|mkv|webm|avi|wav|aiff)$/i.test(f)) error(f, 1, "do not commit video or audio masters; attach a download link to the Video submission issue");
  }
}

/* ---------------- run ---------------- */

const track = checkTrack();
const allSteps = stepFolders();
checkOutline(track, allSteps);
const steps = allSteps.filter((s) => !stepArg || s.name === stepArg);
if (stepArg && !steps.length) error(repo, 1, `no step folder named ${stepArg}`);
for (const s of steps) checkStep(s);

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
const errors = findings.filter((f) => f.level === "error").length;
const warnings = findings.length - errors;

if (json) {
  console.log(JSON.stringify({ errors, warnings, findings }, null, 2));
} else {
  for (const f of findings) console.log(`${f.level === "error" ? "error" : "warn "}  ${f.file}:${f.line}  ${f.message}`);
  const scope = stepArg ? `step ${stepArg}` : `${steps.length} step${steps.length === 1 ? "" : "s"}`;
  console.log(`\n${basename(repo)}: ${scope} checked, ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}.`);
}
process.exit(errors ? 1 : 0);
