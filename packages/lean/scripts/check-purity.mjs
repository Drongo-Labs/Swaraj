#!/usr/bin/env node
// Fails if Gate/ code uses sorry, axiom, native_decide or admit. Comments are stripped first.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const GATE_DIR = join(ROOT, "Gate");
const FORBIDDEN = /\b(sorry|axiom|native_decide|admit)\b/;

/** Strip Lean comments: nested `/- ... -/` blocks and `-- ...` lines. */
function stripComments(source) {
  let out = "";
  let i = 0;
  let depth = 0;
  while (i < source.length) {
    if (depth > 0) {
      if (source.startsWith("/-", i)) {
        depth += 1;
        i += 2;
      } else if (source.startsWith("-/", i)) {
        depth -= 1;
        i += 2;
      } else {
        i += 1;
      }
      continue;
    }
    if (source.startsWith("/-", i)) {
      depth = 1;
      i += 2;
      continue;
    }
    if (source.startsWith("--", i)) {
      const nl = source.indexOf("\n", i);
      i = nl === -1 ? source.length : nl;
      continue;
    }
    out += source[i];
    i += 1;
  }
  return out;
}

const files = readdirSync(GATE_DIR).filter((f) => f.endsWith(".lean")).sort();
const offenders = [];
for (const file of files) {
  const source = stripComments(readFileSync(join(GATE_DIR, file), "utf8"));
  const lines = source.split("\n");
  lines.forEach((line, idx) => {
    const match = line.match(FORBIDDEN);
    if (match) offenders.push(`Gate/${file}:${idx + 1}: found '${match[1]}'`);
  });
}

if (offenders.length > 0) {
  console.error("FAIL: proof-escape tokens present in the Gate suite:");
  for (const o of offenders) console.error(`  ${o}`);
  process.exit(1);
}

console.log(`OK: ${files.length} Gate sources clean of proof-escape tokens.`);
