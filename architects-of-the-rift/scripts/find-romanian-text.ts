// Caută text cu diacritice românești în codul jocului, în afara comentariilor (FEEDBACK_FIXES §4.1).
//
//   npx tsx scripts/find-romanian-text.ts [--data]      (--data include și app/data/champions)
//
// Elimină comentariile (// și /* */) cu un mic parser care ține cont de stringuri și template-uri,
// apoi raportează liniile rămase cu ă â î ș ț (și variantele cu sedilă).

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = join(__dirname, "..");
const includeData = process.argv.includes("--data");
const DIACRITICS = /[ăâîșțşţĂÂÎȘȚŞŢ]/;

function walk(dir: string, out: string[]) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
}

/** Codul fără comentarii; liniile își păstrează numerotarea (comentariile devin spații). */
function stripComments(source: string): string {
  let out = "";
  let index = 0;
  let quote: string | null = null;
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];
    if (quote) {
      out += char;
      if (char === "\\") {
        out += next ?? "";
        index += 2;
        continue;
      }
      if (char === quote) quote = null;
      index += 1;
      continue;
    }
    if (char === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      index += 2;
      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        out += source[index] === "\n" ? "\n" : " ";
        index += 1;
      }
      index += 2;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    out += char;
    index += 1;
  }
  return out;
}

const files: string[] = [];
walk(join(ROOT, "app"), files);
walk(join(ROOT, "components"), files);
let total = 0;
const perFile: Record<string, number> = {};
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (!includeData && rel.startsWith("app/data/champions/")) continue;
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");
  lines.forEach((line, index) => {
    if (!DIACRITICS.test(line)) return;
    total += 1;
    perFile[rel] = (perFile[rel] ?? 0) + 1;
    if (process.argv.includes("--lines")) console.log(`${rel}:${index + 1}: ${line.trim().slice(0, 160)}`);
  });
}
for (const [file, count] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) console.log(`${String(count).padStart(4)}  ${file}`);
console.log(`\n${total} linii cu text românesc în afara comentariilor`);
