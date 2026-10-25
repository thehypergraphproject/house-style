// A small YAML reader for Hypergraph front matter and track.yaml, with no dependencies.
// It reads the subset the templates use: maps, lists, lists of maps, inline lists,
// quoted and plain scalars, and folded (>) or literal (|) blocks. Anchors, tags,
// flow maps and multi-document files are not supported and are reported as errors.

export class YamlError extends Error {
  constructor(message, line) {
    super(`line ${line}: ${message}`);
    this.line = line;
  }
}

function stripComment(raw) {
  let quote = null;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if ((c === '"' || c === "'") && (i === 0 || /[\s:,[]/.test(raw[i - 1]))) {
      quote = c; // a quote opens a quoted scalar only at the start of a value, not inside a word like Bayes' or it's
    } else if (c === "#" && (i === 0 || /\s/.test(raw[i - 1]))) {
      return raw.slice(0, i).trimEnd();
    }
  }
  return raw.trimEnd();
}

function splitInline(body, line) {
  const parts = [];
  let quote = null;
  let cur = "";
  for (const c of body) {
    if (quote) {
      cur += c;
      if (c === quote) quote = null;
    } else if ((c === '"' || c === "'") && cur.trim() === "") {
      quote = c;
      cur += c;
    } else if (c === "[" || c === "{") {
      throw new YamlError("nested lists or maps inside [ ] are not supported", line);
    } else if (c === ",") {
      parts.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function scalar(s, line) {
  if (s === "" || s === "~" || s === "null") return null;
  if (s.startsWith('"')) {
    if (!s.endsWith('"') || s.length < 2) throw new YamlError(`unclosed quote: ${s}`, line);
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (s.startsWith("'")) {
    if (!s.endsWith("'") || s.length < 2) throw new YamlError(`unclosed quote: ${s}`, line);
    return s.slice(1, -1).replace(/''/g, "'");
  }
  if (s.startsWith("[")) {
    if (!s.endsWith("]")) throw new YamlError(`unclosed list: ${s}`, line);
    return splitInline(s.slice(1, -1), line).map((p) => scalar(p, line));
  }
  if (s.startsWith("{")) throw new YamlError("inline maps { } are not supported; use indented keys", line);
  if (s.startsWith("&") || s.startsWith("*") || s.startsWith("!")) {
    throw new YamlError("anchors, aliases and tags are not supported", line);
  }
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  // Standard YAML parsers reject ": " inside an unquoted value, so the site's build would fail on it.
  if (/:\s/.test(s)) throw new YamlError(`a value containing ": " must be quoted: ${s}`, line);
  return s;
}

export function parseYaml(text) {
  const rows = text.replace(/\r\n?/g, "\n").split("\n");
  const items = rows.map((raw, i) => {
    const s = stripComment(raw);
    if (!s.trim()) return { blank: true, raw, n: i + 1 };
    if (/^\t/.test(raw)) throw new YamlError("indent with spaces, not tabs", i + 1);
    return { indent: s.length - s.trimStart().length, text: s.trim(), raw, n: i + 1 };
  });
  let i = 0;

  const peek = () => {
    while (i < items.length && items[i].blank) i++;
    return items[i];
  };
  const isListItem = (it) => it.text === "-" || it.text.startsWith("- ");
  const keyMatch = (t) => t.match(/^([^\s"'#\-[{][^:]*?|"[^"]+"|'[^']+'):(?:\s+(.*))?$/);

  function block(indent, parentLine) {
    const it = peek();
    if (!it || it.indent < indent) return null;
    if (isListItem(it)) return list(it.indent);
    if (keyMatch(it.text)) return map(it.indent);
    throw new YamlError(`expected "key: value" or "- item", found: ${it.text}`, it.n ?? parentLine);
  }

  function blockScalar(style, parentIndent) {
    const lines = [];
    let base = null;
    while (i < items.length) {
      const it = items[i];
      if (!it.blank) {
        const ind = it.raw.length - it.raw.trimStart().length;
        if (ind <= parentIndent) break;
        if (base === null) base = ind;
        lines.push(it.raw.slice(base));
      } else lines.push("");
      i++;
    }
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    if (style.startsWith("|")) return lines.join("\n");
    return lines.reduce((acc, l) => (l === "" ? acc + "\n" : acc && !acc.endsWith("\n") ? `${acc} ${l}` : acc + l), "");
  }

  function value(rest, indent, line) {
    if (rest === undefined || rest === "") {
      const next = peek();
      if (next && (next.indent > indent || (next.indent === indent && isListItem(next)))) return block(next.indent, line);
      return null;
    }
    if (/^[|>][+-]?$/.test(rest)) return blockScalar(rest, indent);
    return scalar(rest, line);
  }

  function map(indent) {
    const out = {};
    for (let it = peek(); it && it.indent === indent && !isListItem(it); it = peek()) {
      const m = keyMatch(it.text);
      if (!m) throw new YamlError(`expected "key: value", found: ${it.text}`, it.n);
      const key = m[1].replace(/^["']|["']$/g, "");
      if (Object.hasOwn(out, key)) throw new YamlError(`"${key}" appears twice`, it.n);
      i++;
      out[key] = value(m[2], indent, it.n);
    }
    const after = peek();
    if (after && after.indent > indent) throw new YamlError(`unexpected indentation: ${after.text}`, after.n);
    return out;
  }

  function list(indent) {
    const out = [];
    for (let it = peek(); it && it.indent === indent && isListItem(it); it = peek()) {
      const content = it.text === "-" ? "" : it.text.slice(2).trim();
      if (content === "") {
        i++;
        out.push(value("", indent, it.n));
      } else if (keyMatch(content) && !content.startsWith('"') && !content.startsWith("'")) {
        // A map inside a list: re-read this row as the map's first key, at the column it starts.
        const col = it.indent + it.text.indexOf(content);
        items[i] = { indent: col, text: content, raw: " ".repeat(col) + content, n: it.n };
        out.push(map(col));
      } else {
        i++;
        out.push(scalar(content, it.n));
      }
    }
    return out;
  }

  const first = peek();
  if (!first) return {};
  const result = block(first.indent, first.n);
  const rest = peek();
  if (rest) throw new YamlError(`unexpected content: ${rest.text}`, rest.n);
  return result;
}

/** Splits a Markdown file into its front matter (parsed) and body. */
export function frontMatter(text) {
  const src = text.replace(/\r\n?/g, "\n");
  if (!src.startsWith("---\n")) return { data: null, body: src, bodyLine: 1, error: "no front matter: the file must start with ---" };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { data: null, body: src, bodyLine: 1, error: "front matter is not closed with ---" };
  const yaml = src.slice(4, end);
  const afterFence = src.indexOf("\n", end + 1);
  const body = afterFence === -1 ? "" : src.slice(afterFence + 1);
  const bodyLine = yaml.split("\n").length + 3;
  try {
    return { data: parseYaml(yaml), yaml, body, bodyLine, error: null };
  } catch (e) {
    const line = e instanceof YamlError ? e.line + 1 : 1;
    return { data: null, yaml, body, bodyLine, error: e.message, errorLine: line };
  }
}
