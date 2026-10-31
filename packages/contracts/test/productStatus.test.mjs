import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productStatusFromDecision,
  productStatusFromReceipt,
  PRODUCT_STATUS_GLOSSARY,
} from "../dist/index.js";

test("BLOCK maps to blocked", () => {
  assert.equal(productStatusFromDecision("BLOCK"), "blocked");
});

test("ALLOW without receipt maps to allowed", () => {
  assert.equal(productStatusFromDecision("ALLOW"), "allowed");
});

test("receipt statuses map honestly", () => {
  assert.equal(productStatusFromReceipt("PENDING"), "allowed");
  assert.equal(productStatusFromReceipt("PROVED"), "proved");
  assert.equal(productStatusFromReceipt("NON_PROVABLE"), "cant_prove");
  assert.equal(productStatusFromReceipt("INVALIDATED"), "cant_prove");
  assert.equal(productStatusFromReceipt("DEV_UNVERIFIED"), "cant_prove");
  assert.equal(productStatusFromDecision("ALLOW", "NON_PROVABLE"), "cant_prove");
  assert.equal(productStatusFromDecision("ALLOW", "PROVED"), "proved");
});

test("glossary covers all four product statuses", () => {
  assert.ok(PRODUCT_STATUS_GLOSSARY.allowed);
  assert.ok(PRODUCT_STATUS_GLOSSARY.blocked);
  assert.ok(PRODUCT_STATUS_GLOSSARY.proved);
  assert.ok(PRODUCT_STATUS_GLOSSARY.cant_prove);
});
