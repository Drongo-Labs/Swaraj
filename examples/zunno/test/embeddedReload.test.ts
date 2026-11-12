import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEmbeddedMandate } from "../src/swaraj/embeddedGateway.js";

const source = readFileSync(fileURLToPath(new URL("../mandate/zunno-mandate.json", import.meta.url)), "utf8");
const threshold = (path: string) =>
  String((loadEmbeddedMandate(path).rules.find((rule) => rule.ruleId === "a_forbid_wild_draw_four")!.predicates[1] as { value?: unknown }).value);

test("a mandate saved to disk is picked up without a restart, and a broken one fails closed", () => {
  const path = join(mkdtempSync(join(tmpdir(), "zunno-mandate-")), "mandate.json");
  writeFileSync(path, source);
  assert.equal(threshold(path), "104");

  writeFileSync(path, source.replace('"104"', '"106"'));
  utimesSync(path, new Date(), new Date(Date.now() + 5000)); // same-millisecond writes would share an mtime
  assert.equal(threshold(path), "106");

  writeFileSync(path, "{ not json");
  utimesSync(path, new Date(), new Date(Date.now() + 10000));
  assert.throws(() => loadEmbeddedMandate(path)); // the gateway maps a throw to BLOCK
});
