import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as S from "../dist/index.js";

const dir = new URL("../fixtures/", import.meta.url);
const load = (path) => JSON.parse(readFileSync(new URL(path, dir), "utf8"));

// name -> [schema, parse helper, optional top-level keys]
const objects = {
  "action-intent": [S.ActionIntentSchema, S.parseActionIntent, ["intentHash"]],
  "policy-profile": [S.MandatePolicySchema, S.parseMandatePolicy, ["policyHash"]],
  "state-snapshot": [S.StateSnapshotSchema, S.parseStateSnapshot, ["lastActionTime", "stateHash"]],
  "evidence-bundle": [S.EvidenceBundleSchema, S.parseEvidenceBundle, ["finalityResult"]],
  "receipt-unsigned": [S.ReceiptUnsignedSchema, S.parseReceiptUnsigned, ["proof"]],
};

const wrongType = (value) => (typeof value === "string" ? 12345 : typeof value === "number" ? "x" : { wrong: true });

for (const [name, [schema, parse, optional]] of Object.entries(objects)) {
  test(`${name}: valid fixture parses and every field is enforced`, () => {
    const valid = load(`valid/${name}.json`);
    assert.ok(schema.safeParse(valid).success, "valid fixture");
    for (const key of Object.keys(valid)) {
      const missing = { ...valid };
      delete missing[key];
      assert.equal(schema.safeParse(missing).success, optional.includes(key), `missing ${key}`);
      assert.equal(schema.safeParse({ ...valid, [key]: wrongType(valid[key]) }).success, false, `wrong type ${key}`);
      assert.equal(schema.safeParse({ ...valid, [key]: null }).success, false, `null ${key}`);
      if (typeof valid[key] === "number") {
        for (const bad of [1.5, -1, NaN, Number.MAX_SAFE_INTEGER + 2]) assert.equal(schema.safeParse({ ...valid, [key]: bad }).success, false, `${key}=${bad}`);
      }
      if (typeof valid[key] === "string") {
        assert.equal(schema.safeParse({ ...valid, [key]: valid[key] + "0".repeat(300) }).success, false, `oversized ${key}`);
      }
    }
    assert.equal(schema.safeParse({ ...valid, extra: 1 }).success, false, "unknown key");
    assert.throws(() => parse({ ...valid, extra: 1 }), /invalid/);
  });
}

test("invalid fixtures are all rejected, with errors that do not echo values", () => {
  const parsers = {
    "action-intent": S.parseActionIntent, "policy-profile": S.parseMandatePolicy, "state-snapshot": S.parseStateSnapshot,
    "evidence-bundle": S.parseEvidenceBundle, receipt: S.parseReceiptUnsigned,
  };
  for (const file of readdirSync(new URL("invalid/", dir))) {
    const parse = Object.entries(parsers).find(([prefix]) => file.startsWith(prefix))[1];
    assert.throws(() => parse(load(`invalid/${file}`)), /^Error: invalid /, file);
  }
  assert.throws(() => S.parseActionIntent({ ...load("valid/action-intent.json"), amount: "SECRET-VALUE" }), (e) => !e.message.includes("SECRET-VALUE"));
});

test("amounts parse to bigint and reject non-canonical forms", () => {
  const intent = S.parseActionIntent({ ...load("valid/action-intent.json"), amount: "115792089237316195423570985008687907853269984665640564039457584007913129639935" });
  assert.equal(typeof intent.amount, "bigint");
  const valid = load("valid/action-intent.json");
  for (const amount of ["-1", "01", "1.0", "1e3", " 1", "", 5, "115792089237316195423570985008687907853269984665640564039457584007913129639936"]) {
    assert.equal(S.ActionIntentSchema.safeParse({ ...valid, amount }).success, false, JSON.stringify(amount));
  }
});

test("addresses and hashes must be lowercase hex of exact length", () => {
  const valid = load("valid/action-intent.json");
  for (const assetIn of ["0x833589FCD6EDB6E08F4C7C32D4F71B54BDA02913", "0x1234", "833589fcd6edb6e08f4c7c32d4f71b54bda02913"]) {
    assert.equal(S.ActionIntentSchema.safeParse({ ...valid, assetIn }).success, false, assetIn);
  }
  assert.equal(S.ActionIntentSchema.safeParse({ ...valid, accountRef: "0x" + "A".repeat(64) }).success, false);
  assert.equal(S.ActionIntentSchema.safeParse({ ...valid, assetOut: valid.assetIn }).success, false, "same asset");
});

test("policy: bps bounds, sets sorted and unique, normalizer fixes raw input", () => {
  const valid = load("valid/policy-profile.json");
  for (const bps of [0, 10000]) assert.ok(S.MandatePolicySchema.safeParse({ ...valid, maxSlippageBps: bps }).success);
  for (const bps of [-1, 10001]) assert.equal(S.MandatePolicySchema.safeParse({ ...valid, maxSlippageBps: bps }).success, false);
  const [a, b] = valid.allowedAssets;
  assert.equal(S.MandatePolicySchema.safeParse({ ...valid, allowedAssets: [a, a] }).success, false);
  assert.equal(S.MandatePolicySchema.safeParse({ ...valid, allowedAssets: [] }).success, false);
  const messy = S.normalizeMandatePolicy({ ...valid, allowedAssets: [b, a, b], allowedVenues: ["UNISWAP_V3_BASE", "UNISWAP_V3_BASE"] });
  assert.deepEqual(messy.allowedAssets, [a, b]);
  assert.ok(S.MandatePolicySchema.safeParse(messy).success);
});

test("rule IDs are unique positive integers", () => {
  const ids = Object.values(S.RuleId);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every((id) => Number.isInteger(id) && id > 0));
});

test("state snapshot: one entry per asset, sorted", () => {
  const valid = load("valid/state-snapshot.json");
  assert.equal(S.StateSnapshotSchema.safeParse({ ...valid, balances: [...valid.balances].reverse() }).success, false);
  assert.equal(S.StateSnapshotSchema.safeParse({ ...valid, policyStatus: "OTHER" }).success, false);
  assert.equal(S.parseStateSnapshot(valid).balances[1].amount, 250000000n);
});

test("evidence bundle: source classes, sorted unique item ids, nested strictness", () => {
  const valid = load("valid/evidence-bundle.json");
  const [first, second] = valid.items;
  assert.equal(S.EvidenceBundleSchema.safeParse({ ...valid, items: [first, first] }).success, false, "duplicate");
  assert.equal(S.EvidenceBundleSchema.safeParse({ ...valid, items: [] }).success, false, "empty");
  assert.equal(S.EvidenceBundleSchema.safeParse({ ...valid, items: [{ ...first, sourceClass: "MY_OWN" }, second] }).success, false);
  assert.equal(S.EvidenceBundleSchema.safeParse({ ...valid, items: [{ ...first, extra: 1 }, second] }).success, false);
  for (const sourceClass of ["CANONICAL_CHAIN_STATE", "SIGNED_VENUE_ATTESTATION", "UNSIGNED_VENUE_API", "THIRD_PARTY_INDEXER", "AGENT_LOCAL_LOG"]) {
    assert.ok(S.EvidenceBundleSchema.safeParse({ ...valid, items: [{ ...first, sourceClass }, second] }).success, sourceClass);
  }
});

test("receipt: PROVED needs proof metadata, others must not carry it", () => {
  const unsigned = load("valid/receipt-unsigned.json");
  const proved = load("valid/receipt-proved.json");
  assert.ok(S.ReceiptUnsignedSchema.safeParse(proved).success);
  for (const key of Object.keys(proved.proof)) {
    const proof = { ...proved.proof };
    delete proof[key];
    assert.equal(S.ReceiptUnsignedSchema.safeParse({ ...proved, proof }).success, false, `proof.${key}`);
  }
  assert.equal(S.ReceiptUnsignedSchema.safeParse({ ...unsigned, proof: proved.proof }).success, false, "PENDING with proof");
  for (const status of ["PENDING", "NON_PROVABLE", "INVALIDATED", "DEV_UNVERIFIED"]) assert.ok(S.ReceiptUnsignedSchema.safeParse({ ...unsigned, status }).success, status);
  assert.equal(S.ReceiptUnsignedSchema.safeParse({ ...unsigned, status: "DONE" }).success, false);
  assert.equal(S.ReceiptUnsignedSchema.safeParse({ ...unsigned, intent: {} }).success, false, "no embedded objects");
  assert.equal(S.ReceiptUnsignedSchema.safeParse({ ...unsigned, signature: "0x" + "0".repeat(130) }).success, false, "unsigned has no signature");
});

test("ObjectType lists exactly the five object types", () => {
  assert.deepEqual(Object.keys(S.ObjectType).sort(), ["ACTION_INTENT", "EVIDENCE_BUNDLE", "POLICY_PROFILE", "RECEIPT", "STATE_SNAPSHOT"]);
});
