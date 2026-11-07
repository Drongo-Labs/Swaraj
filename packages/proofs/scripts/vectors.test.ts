import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { decide, type PolicyDoc } from "@swaraj/smt";
import {
  buildStatement,
  fromWirePolicy,
  reevaluateGround,
  statementId,
  toWirePolicy,
} from "../dist/index.js";

/** Shared vectors keep the SMT gateway, TS evaluator, Rust engine and Lean suite consistent. */

interface VectorCase {
  name: string;
  policy: string;
  action: { values: Record<string, string> };
  expect: { outcome: "ALLOW" | "BLOCK"; violated: string[] };
}

interface VectorFile {
  domain: string;
  policies: Record<string, unknown>;
  cases: VectorCase[];
}

const vectorsUrl = new URL("../vectors/gate-vectors.json", import.meta.url);

test("shared vectors: gateway and ground evaluator agree with every expectation", async () => {
  const file = JSON.parse(await readFile(fileURLToPath(vectorsUrl), "utf8")) as VectorFile;
  assert.equal(file.domain, "swaraj/gate-vectors/v1");
  assert.ok(file.cases.length >= 5, "expected a meaningful vector set");

  for (const vectorCase of file.cases) {
    const wirePolicy = file.policies[vectorCase.policy];
    assert.ok(wirePolicy, `case ${vectorCase.name}: unknown policy ${vectorCase.policy}`);
    const policy = fromWirePolicy(wirePolicy as PolicyDoc);

    // Round-trip: reviving the wire form and re-serializing is lossless.
    assert.deepEqual(toWirePolicy(policy), wirePolicy, `case ${vectorCase.name}: wire round-trip`);

    const gateway = await decide(policy, vectorCase.action);
    assert.equal(gateway.outcome, vectorCase.expect.outcome, `case ${vectorCase.name}: gateway outcome`);
    assert.deepEqual(
      gateway.violatedRuleIds.slice().sort(),
      vectorCase.expect.violated.slice().sort(),
      `case ${vectorCase.name}: gateway rule attribution`,
    );

    const ground = reevaluateGround(policy, vectorCase.action);
    assert.equal(ground.outcome, vectorCase.expect.outcome, `case ${vectorCase.name}: ground outcome`);
    assert.deepEqual(
      ground.violatedRuleIds.slice().sort(),
      vectorCase.expect.violated.slice().sort(),
      `case ${vectorCase.name}: ground rule attribution`,
    );

    const statement = buildStatement(policy, vectorCase.action, ground);
    assert.match(statementId(statement), /^stmt_[0-9a-f]{64}$/, `case ${vectorCase.name}: statement id`);
  }
});
