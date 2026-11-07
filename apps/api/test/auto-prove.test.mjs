import assert from "node:assert/strict";
import test from "node:test";
import { embeddedProofServiceEnabled, startProofLoop } from "../dist/auto-prove.js";

test("the proof loop drains jobs, survives a failure and stops cleanly", async () => {
  const jobs = ["a", new Error("sink down"), "b", undefined];
  const seen = [];
  const stop = startProofLoop(async () => {
    const next = jobs.shift();
    if (next instanceof Error) throw next;
    if (next !== undefined) seen.push(next);
    return next;
  }, 1);
  while (jobs.length > 0) await new Promise((resolve) => setTimeout(resolve, 1));
  await stop();
  assert.deepEqual(seen, ["a", "b"]);
});

test("the embedded proof service needs a database and can be turned off", () => {
  const DATABASE_URL = "postgres://x";
  assert.equal(embeddedProofServiceEnabled({ DATABASE_URL }), true);
  assert.equal(embeddedProofServiceEnabled({}), false);
  assert.equal(embeddedProofServiceEnabled({ DATABASE_URL, SWARAJ_AUTO_PROVE: "0" }), false);
  assert.equal(embeddedProofServiceEnabled({ DATABASE_URL, SWARAJ_PROOF_SERVICE: "external" }), false);
});
