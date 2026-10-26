import { readFileSync } from "node:fs";
import * as S from "@swaraj/schemas";
import { LocalKeySigner, canonicalize, deriveKeyId, hashList, hashObject, parseStrictJson, signReceipt, stripSelfFields, toCanonicalValue } from "../dist/index.js";

const hex = (bytes) => "0x" + Buffer.from(bytes).toString("hex");
const fixture = (name) => JSON.parse(readFileSync(new URL(`../../schemas/fixtures/valid/${name}.json`, import.meta.url), "utf8"));

/** Test-only key. Never use outside tests. */
export const TEST_PRIVATE_KEY = "0x0000000000000000000000000000000000000000000000000000000000000001";

const canonicalInputs = [
  ["empty-object", "{}"],
  ["key-order-and-whitespace", '{ "b": 1, "a": [3, 2, 1], "c": { "z": true, "y": false } }'],
  ["escapes", '{"s":"quote\\" backslash\\\\ tab\\t newline\\n bell\\u0007 del\\u007f"}'],
  ["unicode", '{"k":"é €","𐀀":1,"\\uffff":2}'],
  ["negative-and-zero", '{"n":-5,"z":0}'],
  ["max-safe-integer", '{"n":9007199254740991}'],
  ["nested-arrays", '[[],[1,[2,[3]]],{"a":[]}]'],
];

const objectFixtures = [
  [S.ObjectType.ACTION_INTENT, "action-intent"],
  [S.ObjectType.POLICY_PROFILE, "policy-profile"],
  [S.ObjectType.STATE_SNAPSHOT, "state-snapshot"],
  [S.ObjectType.EVIDENCE_BUNDLE, "evidence-bundle"],
  [S.ObjectType.RECEIPT, "receipt-unsigned"],
  [S.ObjectType.POLICY_PROFILE, "agent-mandate"],
  [S.ObjectType.ACTION_INTENT, "unified-action-trade"],
  [S.ObjectType.ACTION_INTENT, "unified-action-payment"],
  [S.ObjectType.RECEIPT, "receipt-proved"],
];

export async function buildVectors() {
  const canonical = canonicalInputs.map(([name, json]) => ({ name, inputJson: json, canonicalHex: hex(canonicalize(parseStrictJson(json))) }));
  const objects = objectFixtures.map(([type, name]) => {
    const input = fixture(name);
    return { name, type, input, canonicalHex: hex(canonicalize(stripSelfFields(type, input))), hash: hashObject(type, input) };
  });
  const bundle = fixture("evidence-bundle");
  const lists = [{ name: "evidence-bundle-items", type: S.ObjectType.EVIDENCE_BUNDLE, items: bundle.items, root: hashList(S.ObjectType.EVIDENCE_BUNDLE, bundle.items) }];
  const signer = new LocalKeySigner(TEST_PRIVATE_KEY);
  const signed = await signReceipt(S.parseReceiptUnsigned(fixture("receipt-unsigned")), signer);
  const sameBigints = toCanonicalValue({ amount: 5n }); // documents bigint -> decimal string
  return {
    version: "swaraj.v1",
    hashFunction: "keccak256",
    layout: "keccak256(utf8('swaraj.v1.' + TYPE) || 0x00 || canonicalBytes)",
    listLayout: "keccak256(utf8('swaraj.v1.' + TYPE + '.list') || 0x00 || uint32_be(count) || leaf_1 || ... || leaf_n), leaf = hashObject(TYPE, item)",
    keyIdLayout: "keccak256(utf8('swaraj.v1.KEY_ID') || 0x00 || address20)",
    canonical,
    objects,
    lists,
    bigint: { input: "{amount: 5n}", output: sameBigints },
    receiptSignature: { privateKey: TEST_PRIVATE_KEY, address: signer.address, keyId: deriveKeyId(signer.address), signed },
  };
}
