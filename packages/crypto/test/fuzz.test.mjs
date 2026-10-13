import assert from "node:assert/strict";
import test from "node:test";
import { canonicalize, hashObject } from "../dist/index.js";

// Deterministic PRNG so failures reproduce.
let seed = 0x5eed;
const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const int = (n) => Math.floor(rand() * n);
const alphabet = ["a", "b", "Z", "0", "_", "é", "€", "\n", '"', "\\", "\u{10000}", "￿"];
const str = () => Array.from({ length: int(6) }, () => alphabet[int(alphabet.length)]).join("");

function randomValue(depth) {
  const kind = int(depth > 3 ? 3 : 5);
  if (kind === 0) return str();
  if (kind === 1) return int(2) ? int(2 ** 31) : -int(2 ** 31);
  if (kind === 2) return rand() < 0.5;
  if (kind === 3) return Array.from({ length: int(4) }, () => randomValue(depth + 1));
  return Object.fromEntries(Array.from({ length: int(5) }, () => [str(), randomValue(depth + 1)]));
}

const shuffleKeys = (value) => {
  if (Array.isArray(value)) return value.map(shuffleKeys);
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(([k, v]) => [k, shuffleKeys(v)]);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = int(i + 1);
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
  }
  return value;
};

test("1000 random objects hash identically across key orderings and reparsing", () => {
  for (let i = 0; i < 1000; i++) {
    const obj = { root: randomValue(0), n: i };
    const hash = hashObject("ACTION_INTENT", obj);
    assert.equal(hashObject("ACTION_INTENT", shuffleKeys(obj)), hash);
    assert.equal(hashObject("ACTION_INTENT", JSON.parse(JSON.stringify(shuffleKeys(obj)))), hash);
    assert.deepEqual(canonicalize(shuffleKeys(obj)), canonicalize(obj));
  }
});

test("distinct random objects do not collide", () => {
  const seen = new Map();
  for (let i = 0; i < 1000; i++) {
    const obj = { i, v: randomValue(0) };
    seen.set(hashObject("RECEIPT", obj), i);
  }
  assert.equal(seen.size, 1000);
});
