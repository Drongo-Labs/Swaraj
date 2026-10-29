import { test } from "node:test";
import assert from "node:assert/strict";
import { signaturesFromHand, type DecryptedCard } from "../src/executor/incoAttestationProvider.js";

const hand: DecryptedCard[] = [
  { handle: "0x01", value: 11n, signatures: ["0xaa", "0xab"] },
  { handle: "0x02", value: 108n, signatures: ["0xcc"] },
];

test("signatures resolve for a card the agent holds", () => {
  assert.deepEqual(signaturesFromHand(hand, 11), ["0xaa", "0xab"]);
  assert.deepEqual(signaturesFromHand(hand, 108), ["0xcc"]);
});

test("a card the agent does not hold never attests — fail closed", () => {
  assert.throws(() => signaturesFromHand(hand, 42), /not in the agent's hand/);
});
