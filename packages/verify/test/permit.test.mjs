import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import { parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import { checkPermit, decodePermit, encodePermit, permitDigest, requirePermit } from "../dist/index.js";

const issuer = new LocalKeySigner("0x" + "11".repeat(32));
const sha = (t) => createHash("sha256").update(t).digest("hex");
const now = 1790000100000;
const action = {
  intentId: "i", agent: "agent:a", action: "PAYMENT", resource: { service: "near_transfer" },
  context: { amount: "5", currency: "NEAR", recipient: "shop.testnet" },
  policyHash: "0x" + "9".repeat(64), timestamp: 1790000000000, expiry: 1790000300000,
  idempotencyKey: "k", signature: "0x" + "00".repeat(65),
};

async function permit(overrides = {}, signer = issuer) {
  const p = {
    version: "swaraj/permit/v1", applicationId: "app_shop", action,
    intentHash: `0x${sha(serializeUnifiedAction(parseUnifiedAction(action)))}`,
    mandateHash: "0x" + "ab".repeat(32), decision: "ALLOW", matchedRuleIds: ["permit_pay"],
    expiresAt: now + 60_000, issuer: issuer.address, ...overrides,
  };
  p.signature = await signer.signDigest(permitDigest(p));
  return p;
}
// The shop only accepts a 5 NEAR payment to itself.
const matches = (a) => a.context.recipient === "shop.testnet" && a.context.amount === 5n;
const check = (p, extra = {}) => checkPermit(p, { issuer: issuer.address, matches, now, claim: () => true, ...extra });

test("a valid permit for this exact request is accepted", async () => {
  const result = await check(await permit());
  assert.equal(result.ok, true);
  assert.equal(result.action.context.amount, 5n);
});

test("forged, tampered, expired, mismatched and missing permits are refused", async () => {
  const reason = async (p, extra) => (await check(p, extra)).reason;
  assert.equal(await reason(undefined), "permit_missing");
  assert.equal(await reason(await permit({}, new LocalKeySigner("0x" + "22".repeat(32)))), "bad_signature");
  assert.equal(await reason({ ...(await permit()), matchedRuleIds: ["other"] }), "bad_signature");
  assert.equal(await reason({ ...(await permit()), action: { ...action, context: { ...action.context, amount: "500" } } }), "intent_mismatch");
  assert.equal(await reason(await permit({ expiresAt: now - 1 })), "permit_expired");
  assert.equal(await reason(await permit({ decision: "BLOCK" })), "not_allowed");
  assert.equal(await reason(await permit(), { matches: () => false }), "request_mismatch");
  assert.equal(await reason(await permit(), { applicationId: "app_other" }), "wrong_application");
});

test("a permit can be used once, and a rejected request does not burn it", async () => {
  const p = await permit();
  const opts = { claim: undefined };
  assert.equal((await check(p, { ...opts, matches: () => false })).reason, "request_mismatch");
  assert.equal((await check(p, opts)).ok, true);
  assert.equal((await check(p, opts)).reason, "permit_reused");
});

test("middleware passes a permitted request and refuses one without a permit", async () => {
  const mw = requirePermit({ issuer: issuer.address, now, claim: () => true, matches: (a, req) => a.context.recipient === req.shop });
  const run = (headers) =>
    new Promise((resolve) => {
      const res = { statusCode: 200, setHeader() {}, end: (body) => resolve({ status: res.statusCode, body }) };
      const req = { headers, shop: "shop.testnet" };
      mw(req, res, () => resolve({ status: 200, action: req.swarajAction }));
    });
  const good = await run({ "swaraj-permit": encodePermit(await permit()) });
  assert.equal(good.status, 200);
  assert.equal(good.action.action, "PAYMENT");
  const bad = await run({});
  assert.equal(bad.status, 403);
  assert.match(bad.body, /permit_missing/);
  assert.equal(decodePermit("not base64 json"), undefined);
});
