import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { keccak256 } from "viem";
import * as S from "@swaraj/schemas";
import { SELF_FIELDS, canonicalize, domainTag, hashList, hashObject, stripSelfFields, verifyObjectHash } from "../dist/index.js";

export const fixtures = {
  ACTION_INTENT: "action-intent", POLICY_PROFILE: "policy-profile", STATE_SNAPSHOT: "state-snapshot",
  EVIDENCE_BUNDLE: "evidence-bundle", RECEIPT: "receipt-unsigned",
};
const load = (name) => JSON.parse(readFileSync(new URL(`../../schemas/fixtures/valid/${name}.json`, import.meta.url), "utf8"));

/** Every way to change one leaf: alter it, or delete the key / array element. */
export function* mutations(value, path = []) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      for (const [p, m] of mutations(value[i], [...path, i])) yield [p, (root) => m(root)];
      yield [[...path, i, "(remove)"], (root) => (get(root, path).splice(i, 1), root)];
    }
    yield [[...path, "(append)"], (root) => (get(root, path).push("x"), root)];
  } else if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      yield* mutations(value[key], [...path, key]);
      yield [[...path, key, "(remove)"], (root) => (delete get(root, path)[key], root)];
    }
    yield [[...path, "(add)"], (root) => ((get(root, path).extra = 1), root)];
  } else {
    const alter = typeof value === "string" ? value + "0" : typeof value === "number" ? value + 1 : !value;
    yield [path, (root) => (path.length ? ((get(root, path.slice(0, -1))[path.at(-1)] = alter), root) : alter)];
  }
}
const get = (root, path) => path.reduce((node, key) => node[key], root);

test("same object, same hash; hash is 32-byte lowercase hex", () => {
  const a = load("action-intent");
  const reordered = Object.fromEntries(Object.entries(a).reverse());
  assert.equal(hashObject("ACTION_INTENT", a), hashObject("ACTION_INTENT", reordered));
  assert.match(hashObject("ACTION_INTENT", a), /^0x[0-9a-f]{64}$/);
});

test("hash layout is keccak256(tag || 0x00 || canonical bytes)", () => {
  const a = load("action-intent");
  const { intentHash, ...rest } = a;
  const bytes = canonicalize(rest);
  const expected = keccak256(new Uint8Array([...new TextEncoder().encode("swaraj.v1.ACTION_INTENT"), 0, ...bytes]));
  assert.equal(hashObject("ACTION_INTENT", a), expected);
  assert.equal(domainTag("RECEIPT"), "swaraj.v1.RECEIPT");
  assert.throws(() => hashObject("NOT_A_TYPE", a), /unknown object type/);
});

test("bigint-typed parsed objects hash the same as their JSON form", () => {
  assert.equal(hashObject("ACTION_INTENT", S.parseActionIntent(load("action-intent"))), hashObject("ACTION_INTENT", load("action-intent")));
  assert.equal(hashObject("POLICY_PROFILE", S.parsePolicyProfile(load("policy-profile"))), hashObject("POLICY_PROFILE", load("policy-profile")));
});

for (const [type, name] of Object.entries(fixtures)) {
  test(`${type}: any field change changes the hash, except self fields`, () => {
    const original = load(name);
    const base = hashObject(type, original);
    const ignored = SELF_FIELDS[type];
    let count = 0;
    for (const [path, apply] of mutations(original)) {
      const mutated = apply(structuredClone(original));
      const expectSame = ignored.includes(path[0]);
      assert.equal(hashObject(type, mutated) === base, expectSame, `${type} ${path.join(".")}`);
      count++;
    }
    assert.ok(count > 5);
  });

  test(`${type}: same object under any other type hashes differently`, () => {
    const obj = load(name);
    const hashes = Object.values(S.ObjectType).map((other) => hashObject(other, obj));
    assert.equal(new Set(hashes).size, hashes.length);
  });
}

test("self-referencing field is ignored, present or not", () => {
  const intent = load("action-intent");
  const { intentHash, ...without } = intent;
  assert.equal(hashObject("ACTION_INTENT", intent), hashObject("ACTION_INTENT", without));
  assert.deepEqual(stripSelfFields("RECEIPT", { a: 1, signature: "0x", receiptHash: "0x" }), { a: 1 });
  assert.deepEqual(stripSelfFields("ACTION_INTENT", { intentHash: 1, nested: { intentHash: 2 } }), { nested: { intentHash: 2 } }, "top level only");
  assert.throws(() => stripSelfFields("RECEIPT", [1]), /must be an object/);
});

test("verifyObjectHash", () => {
  const intent = load("action-intent");
  const hash = hashObject("ACTION_INTENT", intent);
  assert.ok(verifyObjectHash("ACTION_INTENT", intent, hash));
  assert.ok(verifyObjectHash("ACTION_INTENT", intent, hash.toUpperCase().replace("0X", "0x")));
  assert.equal(verifyObjectHash("ACTION_INTENT", { ...intent, amount: "1" }, hash), false);
  assert.equal(verifyObjectHash("POLICY_PROFILE", intent, hash), false);
  assert.equal(verifyObjectHash("ACTION_INTENT", { ...intent, amount: 1.5 }, hash), false, "uncanonicalizable input is not verified");
});

test("hashList: order matters, count matters, separate domain from hashObject", () => {
  const [a, b] = load("evidence-bundle").items;
  const root = hashList("EVIDENCE_BUNDLE", [a, b]);
  assert.notEqual(root, hashList("EVIDENCE_BUNDLE", [b, a]));
  assert.notEqual(root, hashList("EVIDENCE_BUNDLE", [a]));
  assert.notEqual(root, hashList("EVIDENCE_BUNDLE", [a, b, b]));
  assert.notEqual(root, hashList("RECEIPT", [a, b]));
  assert.notEqual(hashList("EVIDENCE_BUNDLE", []), hashList("EVIDENCE_BUNDLE", [{}]));
  assert.notEqual(hashList("EVIDENCE_BUNDLE", [a]), hashObject("EVIDENCE_BUNDLE", a));
  assert.equal(root, hashList("EVIDENCE_BUNDLE", [structuredClone(a), structuredClone(b)]));
});
