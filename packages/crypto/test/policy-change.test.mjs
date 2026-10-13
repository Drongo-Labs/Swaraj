import test from "node:test";
import assert from "node:assert/strict";
import { LocalKeySigner, KeyRegistry, deriveKeyId, hashObject, signPolicyChange, verifyPolicyChange } from "../dist/index.js";

const privateKey = "0x" + "11".repeat(32);
function policy(version) {
  return {
    policyVersion: version,
    allowedVenues: ["UNISWAP_V3_BASE"],
    allowedAssets: ["0x4200000000000000000000000000000000000006", "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"],
    maxAmountPerAction: "100000000",
    positionCap: "1000000000",
    dailyTurnoverCap: "500000000",
    maxSlippageBps: 100,
    reserveRequirement: "10000000",
    quoteFreshnessSeconds: 30,
    cooldownSeconds: 60,
    finalityRule: "BASE_CONFIRMATIONS_12",
    policyExpiry: 1800000000,
    paused: false,
  };
}

test("owner authorization signs and verifies an exact policy transition", async () => {
  const signer = new LocalKeySigner(privateKey);
  const registry = new KeyRegistry([{ keyId: deriveKeyId(signer.address), address: signer.address, validFrom: 0 }]);
  const previous = hashObject("POLICY_PROFILE", policy(1));
  const next = hashObject("POLICY_PROFILE", { ...policy(2), maxAmountPerAction: "90000000" });
  const auth = await signPolicyChange({ previousPolicyHash: previous, previousPolicyVersion: 1, newPolicyHash: next, newPolicyVersion: 2, authorizedAt: 100 }, signer);
  assert.equal(await verifyPolicyChange(auth, registry), true);

  const tampered = { ...auth, newPolicyVersion: 3 };
  assert.equal(await verifyPolicyChange(tampered, registry), false);
});

test("owner authorization rejects an unknown or revoked owner", async () => {
  const signer = new LocalKeySigner(privateKey);
  const registry = new KeyRegistry([{ keyId: deriveKeyId(signer.address), address: signer.address, validFrom: 0, revokedAt: 50 }]);
  const auth = await signPolicyChange({ previousPolicyHash: hashObject("POLICY_PROFILE", policy(1)), previousPolicyVersion: 1, newPolicyHash: hashObject("POLICY_PROFILE", policy(2)), newPolicyVersion: 2, authorizedAt: 100 }, signer);
  assert.equal(await verifyPolicyChange(auth, registry), false);
});
