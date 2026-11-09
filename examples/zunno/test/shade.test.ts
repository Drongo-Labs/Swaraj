import { test } from "node:test";
import assert from "node:assert/strict";
import { shadeConfigFromEnv } from "../src/agent/shade.js";

const full = {
  SHADE_AGENT_CONTRACT_ID: "agent-contract.testnet",
  SHADE_SPONSOR_ACCOUNT_ID: "sponsor.testnet",
  SHADE_SPONSOR_PRIVATE_KEY: "ed25519:not-a-real-key",
  SHADE_DERIVATION_PATH: "a".repeat(64),
};

test("the agent registers as a Shade Agent only when every setting is present", () => {
  assert.deepEqual(shadeConfigFromEnv(full), {
    contractId: "agent-contract.testnet",
    sponsorAccountId: "sponsor.testnet",
    sponsorPrivateKey: "ed25519:not-a-real-key",
    derivationPath: "a".repeat(64),
  });
  for (const key of Object.keys(full)) {
    assert.equal(shadeConfigFromEnv({ ...full, [key]: undefined }), undefined, key);
  }
});
