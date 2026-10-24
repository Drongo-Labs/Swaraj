import assert from "node:assert/strict";
import test from "node:test";
import { canonicalize, parseStrictJson, toCanonicalValue } from "../dist/index.js";

const text = (value) => new TextDecoder().decode(canonicalize(value));

test("key order and whitespace do not matter; arrays keep order", () => {
  const a = parseStrictJson('{ "b": 1,\n "a": [3, 2, 1], "c": {"z": 1, "y": 2} }');
  const b = { c: { y: 2, z: 1 }, a: [3, 2, 1], b: 1 };
  assert.equal(text(a), '{"a":[3,2,1],"b":1,"c":{"y":2,"z":1}}');
  assert.deepEqual(canonicalize(a), canonicalize(b));
  assert.notEqual(text([1, 2]), text([2, 1]));
});

test("keys sort by code point, not UTF-16 code unit", () => {
  // U+FFFF < U+10000 by code point; UTF-16 order would reverse them.
  assert.equal(text({ "\u{10000}": 1, "￿": 2 }), '{"￿":2,"\u{10000}":1}');
});

test("string escaping is fixed", () => {
  assert.equal(text('a"b\\c\n\u0007\u007f é'), '"a\\"b\\\\c\\n\\u0007\u007f é"');
  assert.deepEqual(canonicalize("é"), new Uint8Array([0x22, 0xc3, 0xa9, 0x22]));
  assert.equal(text(parseStrictJson('"\\u00e9"')), text("é"), "escaped and literal forms agree");
});

test("rejections", () => {
  const bad = {
    float: 1.5, NaN, Infinity, "-Infinity": -Infinity, undefined, null: null, bigint: 1n, unsafe: 2 ** 53, negZero: -0,
    date: new Date(0), map: new Map(), set: new Set(), fn: () => 1, symbol: Symbol("x"),
    instance: new (class Foo {})(), loneSurrogate: "\ud800", sparse: new Array(2),
  };
  for (const [name, value] of Object.entries(bad)) {
    assert.throws(() => canonicalize(value), /cannot canonicalize/, name);
    assert.throws(() => canonicalize({ nested: [{ value }] }), /cannot canonicalize/, `nested ${name}`);
  }
  assert.throws(() => canonicalize({ "\ud800": 1 }), /lone surrogate/);
  assert.throws(() => canonicalize({ get a() { return 1; } }), /accessor/);
  assert.throws(() => canonicalize({ [Symbol("k")]: 1 }), /symbol/);
  const cycle = {};
  cycle.self = cycle;
  assert.throws(() => canonicalize(cycle), /too deep/);
  assert.equal(text(2 ** 53 - 1), "9007199254740991");
});

test("null-prototype objects are fine, __proto__ is a normal key", () => {
  assert.equal(text(Object.assign(Object.create(null), { a: 1 })), '{"a":1}');
  assert.equal(text(parseStrictJson('{"__proto__":1}')), '{"__proto__":1}');
});

test("strict JSON parser rejects duplicates, floats, null and unsafe integers", () => {
  for (const bad of ['{"a":1,"a":2}', '{"a":{"b":1,"b":1}}', "1.5", "1e3", "1E3", "-0", "null", '{"a":null}', "9007199254740993", "[1,]", "{,}", '{"a":1} x', "", '"unterminated', "NaN"]) {
    assert.throws(() => parseStrictJson(bad), /invalid canonical JSON|JSON/, bad);
  }
  assert.deepEqual(parseStrictJson('{"a":[1,-2,true,"x"]}'), { a: [1, -2, true, "x"] });
});

test("toCanonicalValue converts bigint to decimal strings, recursively", () => {
  const value = toCanonicalValue({ a: 10n ** 30n, list: [{ b: 0n }], keep: 5 });
  assert.deepEqual(value, { a: "1000000000000000000000000000000", list: [{ b: "0" }], keep: 5 });
  assert.equal(text(value), '{"a":"1000000000000000000000000000000","keep":5,"list":[{"b":"0"}]}');
  assert.throws(() => canonicalize(toCanonicalValue({ a: new Date(0) })), /plain objects/);
});
