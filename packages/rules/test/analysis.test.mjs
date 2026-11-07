import assert from "node:assert/strict";
import test from "node:test";
import { parseAgentMandate } from "@swaraj/schemas";
import { diffMandates, lintMandate } from "../dist/index.js";

const mandate = (rules, extra = {}) =>
  parseAgentMandate({ mandateId: "m", version: 1, agent: "*", defaultEffect: "DENY", validFrom: 0, validUntil: 4102444800000, rules: [...rules].sort((a, b) => (a.ruleId < b.ruleId ? -1 : 1)), ...extra });

const amount = (operator, value) => ({ field: "context.amount", operator, value });
const permit = (ruleId, predicates = [], action = "PAYMENT") => ({ ruleId, effect: "PERMIT", action, predicates });
const forbid = (ruleId, predicates = [], action = "PAYMENT") => ({ ruleId, effect: "FORBID", action, predicates });
const service = (value) => ({ field: "resource.service", operator: "EQ", value });
const codes = (m) => lintMandate(m).map((issue) => `${issue.code}:${issue.ruleId ?? ""}`).sort();

test("a clean mandate has no issues", () => {
  assert.deepEqual(codes(mandate([forbid("cap", [amount("GT", "100")]), permit("pay")])), []);
});

test("lint flags a mandate that can permit nothing", () => {
  assert.deepEqual(codes(mandate([forbid("all")])), ["NO_PERMIT:"]);
  assert.deepEqual(codes(mandate([])), ["NO_PERMIT:"]);
});

test("lint flags predicates that can never all hold", () => {
  const cases = [
    [amount("GT", "10"), amount("LT", "5")],
    [amount("GT", "10"), amount("LTE", "10")],
    [amount("EQ", "1"), amount("EQ", "2")],
    [service("a"), service("b")],
    [service("a"), { field: "resource.service", operator: "IN", values: ["b", "c"] }],
  ];
  for (const predicates of cases) {
    assert.ok(codes(mandate([permit("bad", predicates), permit("ok")])).includes("CONTRADICTORY_RULE:bad"), JSON.stringify(predicates));
  }
  assert.deepEqual(codes(mandate([permit("range", [amount("GT", "10"), amount("LT", "12")])])), []);
  assert.deepEqual(codes(mandate([permit("gap", [service("a"), { field: "resource.service", operator: "IN", values: ["a", "b"] }])])), []);
});

test("lint flags duplicates whatever the predicate order, and shadowed permits", () => {
  const a = amount("GT", "1");
  const b = service("x");
  assert.ok(codes(mandate([permit("one", [a, b]), permit("two", [b, a])])).includes("DUPLICATE_RULE:two"));
  assert.ok(codes(mandate([permit("pay"), forbid("all")])).includes("SHADOWED_PERMIT:pay"));
});

test("diff finds exactly what raising a cap newly allows", () => {
  const before = mandate([forbid("cap", [amount("GT", "100")]), permit("pay")]);
  const after = mandate([forbid("cap", [amount("GT", "200")]), permit("pay")]);
  const diff = diffMandates(before, after);
  assert.equal(diff.complete, true);
  assert.deepEqual(diff.rulesChanged, ["cap"]);
  assert.ok(diff.newlyAllowed.some((a) => a.context.amount === "200"));
  assert.ok(diff.newlyAllowed.every((a) => BigInt(a.context.amount) > 100n && BigInt(a.context.amount) <= 200n));
  assert.deepEqual(diff.newlyBlocked, []);
});

test("diff reports what removing a permit blocks and adding a forbid blocks", () => {
  const base = mandate([permit("pay"), permit("deploy", [], "DEPLOY")]);
  const removed = diffMandates(base, mandate([permit("pay")]));
  assert.deepEqual(removed.rulesRemoved, ["deploy"]);
  assert.equal(removed.newlyBlocked[0].action, "DEPLOY");
  const narrowed = diffMandates(base, mandate([permit("pay"), permit("deploy", [], "DEPLOY"), forbid("no_x", [service("x")])]));
  assert.ok(narrowed.newlyBlocked.some((a) => a.resource.service === "x"));
  assert.deepEqual(narrowed.newlyAllowed, []);
});

test("an edit with no behavioural effect shows no newly allowed or blocked action", () => {
  const before = mandate([forbid("cap", [amount("GT", "100")]), permit("pay")]);
  const after = mandate([forbid("cap_renamed", [amount("GTE", "101")]), permit("pay")]);
  const diff = diffMandates(before, after);
  assert.deepEqual([diff.newlyAllowed, diff.newlyBlocked], [[], []]);
  assert.deepEqual(diff.rulesAdded, ["cap_renamed"]);
});

test("diff covers APP_ACTION params and flags scope changes", () => {
  const param = (value) => ({ field: "context.paramString", name: "path", operator: "EQ", value });
  const before = mandate([permit("read", [], "APP_ACTION")]);
  const after = mandate([forbid("secrets", [param(".env")], "APP_ACTION"), permit("read", [], "APP_ACTION")], { agent: "agent:one" });
  const diff = diffMandates(before, after);
  assert.ok(diff.newlyBlocked.some((a) => a.context.params.path === ".env"));
  assert.deepEqual(diff.scopeChanged, ["agent"]);
});

test("a search too large to finish says so instead of claiming completeness", () => {
  const fields = ["resource.service", "context.currency", "context.recipient"];
  const predicates = (n) => fields.map((field) => ({ field, operator: "IN", values: Array.from({ length: n }, (_, i) => `V${String(i).padStart(3, "0")}`) }));
  const before = mandate([permit("a", predicates(40))]);
  assert.equal(diffMandates(before, mandate([permit("a")])).complete, false);
});
