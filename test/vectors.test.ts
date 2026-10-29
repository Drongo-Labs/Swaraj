import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { isPlayable } from "../src/zunno/cards.js";

/** Drift guard: the committed Lean vectors must match what the real engine computes. */
const here = dirname(fileURLToPath(import.meta.url));

test("committed engine vectors match the real engine (kept honest for the Lean suite)", () => {
  const file = JSON.parse(readFileSync(join(here, "..", "vectors", "engine-vectors.json"), "utf-8"));
  assert.equal(file.domain, "zunno/engine-vectors/v1");
  assert.ok(file.playable.length >= 10 && file.plays.length >= 9 && file.draws.length >= 3);
  for (const c of file.playable) {
    assert.equal(
      isPlayable(c.card, c.top, c.activeColor),
      c.expected,
      `vector drift: card=${c.card} top=${c.top} color=${c.activeColor} — regenerate with pnpm vectors`,
    );
  }
});
