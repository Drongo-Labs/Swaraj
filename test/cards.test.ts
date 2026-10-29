import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeCard, isPlayable, isWild, firstLegalCard } from "../src/zunno/cards.js";

test("card codec matches UnoCards.sol (port of zunno-inco bot)", () => {
  // value 1 → id 0 → red 0
  assert.deepEqual(decodeCard(1), { color: 0, kind: 0, number: 0 });
  // value 26 → id 25 → w=0 of color 1 → green 0
  assert.deepEqual(decodeCard(26), { color: 1, kind: 0, number: 0 });
  // value 2 → id 1 → w=1 → number 1 red
  assert.deepEqual(decodeCard(2), { color: 0, kind: 0, number: 1 });
  // value 21 → id 20 → w=20 → red skip (w<=20)
  assert.deepEqual(decodeCard(21), { color: 0, kind: 1, number: -1 });
  // wilds: 101..104, wild-draw-four: 105..108
  assert.equal(isWild(101), true);
  assert.equal(isWild(100), false);
  assert.equal(isWild(105), true);
  assert.equal(decodeCard(105).kind, 5);
});

test("isPlayable: color match, number match, kind match, wild", () => {
  const red = 0, green = 1;
  const redFive = 11; // id 10 → w=10 → number 5 wait: w<=18 → number = floor(11/2)=5 ✓
  const greenFive = 36; // id 35 → color 1, w=10 → number 5
  assert.equal(isPlayable(greenFive, redFive, red), true); // same number
  assert.equal(isPlayable(1, redFive, red), true); // color matches active
  assert.equal(isPlayable(3, 5, green), false); // red card, green active, different number
  assert.equal(isPlayable(101, 5, green), true); // wild always playable
});

test("firstLegalCard picks first legal card in hand order, else null", () => {
  // top: value 5 → red 2. Card 3 (red 1) unplayable; card 4 (red 2) matches number.
  assert.equal(firstLegalCard([3, 4, 101], 5, 1), 4);
  // Wild always playable.
  assert.equal(firstLegalCard([3, 101], 5, 1), 101);
  assert.equal(firstLegalCard([3, 7], 5, 1), null);
});
