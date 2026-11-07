import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  githubDeploymentMatches,
  githubSignatureValid,
  stripeEventMatches,
  stripeSignatureValid,
} from "../dist/index.js";

const secret = "whsec_test";
const body = '{"id":"evt_1"}';
const now = 1790000000;
const stripeHeader = (t, payload = body, key = secret) =>
  `t=${t},v1=${createHmac("sha256", key).update(`${t}.${payload}`).digest("hex")}`;

test("Stripe signatures must be genuine, for this body, and recent", () => {
  assert.equal(stripeSignatureValid(body, stripeHeader(now), secret, now), true);
  assert.equal(stripeSignatureValid(`${body} `, stripeHeader(now), secret, now), false);
  assert.equal(stripeSignatureValid(body, stripeHeader(now, body, "other"), secret, now), false);
  assert.equal(stripeSignatureValid(body, stripeHeader(now - 301), secret, now), false);
  assert.equal(stripeSignatureValid(body, undefined, secret, now), false);
  assert.equal(stripeSignatureValid(body, "garbage", secret, now), false);
});

test("Stripe accepts any of several v1 signatures during secret rotation", () => {
  const header = `${stripeHeader(now)},v1=${"0".repeat(64)}`;
  assert.equal(stripeSignatureValid(body, header, secret, now), true);
});

test("GitHub signatures must be genuine and for this body", () => {
  const good = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  assert.equal(githubSignatureValid(body, good, secret), true);
  assert.equal(githubSignatureValid(`${body} `, good, secret), false);
  assert.equal(githubSignatureValid(body, undefined, secret), false);
});

const payment = (overrides = {}) => ({
  type: "payment_intent.succeeded",
  data: { object: { amount: 500, currency: "usd", transfer_data: { destination: "acct_vendor" }, metadata: { swaraj_receipt_id: "r1" }, ...overrides } },
});
const terms = { amount: "500", currency: "USD", recipient: "acct_vendor" };

test("a Stripe event must match the approved payment exactly", () => {
  assert.equal(stripeEventMatches(payment(), terms), true);
  assert.equal(stripeEventMatches(payment({ amount: 501 }), terms), false);
  assert.equal(stripeEventMatches(payment({ currency: "eur" }), terms), false);
  assert.equal(stripeEventMatches(payment({ transfer_data: { destination: "acct_evil" } }), terms), false);
  assert.equal(stripeEventMatches({ ...payment(), type: "payment_intent.payment_failed" }, terms), false);
});

test("a GitHub deployment must match the approved deploy exactly", () => {
  const deploy = { repo: "org/app", commitHash: "a".repeat(40), environment: "PRODUCTION" };
  const event = (state, sha = deploy.commitHash, environment = "production", repo = "org/app") => ({
    deployment_status: { state },
    deployment: { sha, environment },
    repository: { full_name: repo },
  });
  assert.equal(githubDeploymentMatches(event("success"), deploy), true);
  assert.equal(githubDeploymentMatches(event("failure"), deploy), false);
  assert.equal(githubDeploymentMatches(event("success", "b".repeat(40)), deploy), false);
  assert.equal(githubDeploymentMatches(event("success", deploy.commitHash, "staging"), deploy), false);
  assert.equal(githubDeploymentMatches(event("success", deploy.commitHash, "production", "org/other"), deploy), false);
});
