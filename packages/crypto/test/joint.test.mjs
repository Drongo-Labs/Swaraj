import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as S from "@swaraj/schemas";
import { hashObject } from "../dist/index.js";

// Joint checks J.1-J.4 live in vectors/hash/signing tests; this file ties every schema fixture to the crypto package.
const fixtureDir = new URL("../../schemas/fixtures/valid/", import.meta.url);
const parsers = {
  "action-intent": [S.ObjectType.ACTION_INTENT, S.parseActionIntent], "policy-profile": [S.ObjectType.POLICY_PROFILE, S.parseMandatePolicy],
  "state-snapshot": [S.ObjectType.STATE_SNAPSHOT, S.parseStateSnapshot], "evidence-bundle": [S.ObjectType.EVIDENCE_BUNDLE, S.parseEvidenceBundle],
  "receipt-unsigned": [S.ObjectType.RECEIPT, S.parseReceiptUnsigned], "receipt-proved": [S.ObjectType.RECEIPT, S.parseReceiptUnsigned],
  "agent-mandate": [S.ObjectType.POLICY_PROFILE, S.parseAgentMandate], "unified-action-trade": [S.ObjectType.ACTION_INTENT, S.parseUnifiedAction],
  "unified-action-payment": [S.ObjectType.ACTION_INTENT, S.parseUnifiedAction],
};

test("every valid schema fixture parses, hashes stably (typed and raw), and is covered by a vector", () => {
  const vectors = JSON.parse(readFileSync(new URL("./vectors.json", import.meta.url), "utf8"));
  const files = readdirSync(fixtureDir).map((f) => f.replace(".json", "")).sort();
  assert.deepEqual(files, Object.keys(parsers).sort(), "add new fixtures to the parser table and vectors");
  for (const name of files) {
    const [type, parse] = parsers[name];
    const raw = JSON.parse(readFileSync(new URL(`${name}.json`, fixtureDir), "utf8"));
    const hash = hashObject(type, raw);
    assert.equal(hashObject(type, parse(raw)), hash, name);
    assert.equal(vectors.objects.find((o) => o.name === name).hash, hash, name);
  }
});
