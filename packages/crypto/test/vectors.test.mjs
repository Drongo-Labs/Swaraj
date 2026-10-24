import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildVectors } from "../scripts/build-vectors.mjs";

test("committed golden vectors match the implementation (run `pnpm --filter @swaraj/crypto vectors` to regenerate)", async () => {
  const committed = JSON.parse(readFileSync(new URL("./vectors.json", import.meta.url), "utf8"));
  assert.deepEqual(committed, JSON.parse(JSON.stringify(await buildVectors())));
});

test("vectors carry the expected fixture coverage", () => {
  const committed = JSON.parse(readFileSync(new URL("./vectors.json", import.meta.url), "utf8"));
  assert.equal(committed.hashFunction, "keccak256");
  assert.deepEqual([...new Set(committed.objects.map((o) => o.type))].sort(), ["ACTION_INTENT", "EVIDENCE_BUNDLE", "POLICY_PROFILE", "RECEIPT", "STATE_SNAPSHOT"]);
});
