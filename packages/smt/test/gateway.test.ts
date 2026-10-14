import assert from "node:assert/strict";
import test from "node:test";
import {
  bindAction,
  checkPolicy,
  decide,
  policyDigest,
  renderSmtScript,
  type BoolTerm,
  type PolicyDoc,
} from "../dist/index.js";

const int = (value: bigint) => ({ kind: "const", value }) as const;
const ref = (name: string) => ({ kind: "field", name }) as const;

function le(left: BoolTerm | object, right: object): BoolTerm {
  return { kind: "compare", op: "le", left: left as never, right: right as never };
}

const samplePolicy: PolicyDoc = {
  policyId: "pol_trade_demo",
  revision: 3,
  fields: ["amountCents", "limitCents", "dailyUsedCents", "dailyCapCents"],
  assumptions: [
    {
      ruleId: "limit.fixed",
      assertion: { kind: "compare", op: "eq", left: ref("limitCents"), right: int(100000n) },
    },
    {
      ruleId: "dailyCap.fixed",
      assertion: { kind: "compare", op: "eq", left: ref("dailyCapCents"), right: int(500000n) },
    },
  ],
  rules: [
    {
      ruleId: "amount.positive",
      assertion: { kind: "compare", op: "gt", left: ref("amountCents"), right: int(0n) },
    },
    {
      ruleId: "amount.cap",
      assertion: le(ref("amountCents"), ref("limitCents")),
    },
    {
      ruleId: "daily.budget",
      assertion: {
        kind: "compare",
        op: "le",
        left: { kind: "sum", parts: [ref("dailyUsedCents"), ref("amountCents")] },
        right: ref("dailyCapCents"),
      },
    },
  ],
};

const sampleAction = (amountCents: string, dailyUsedCents = "0") => ({
  values: {
    amountCents,
    dailyUsedCents,
    limitCents: "100000",
    dailyCapCents: "500000",
  },
});

test("in-policy action is ALLOWed and the stored script is replayable text", async () => {
  const result = await decide(samplePolicy, sampleAction("25000"));
  assert.equal(result.outcome, "ALLOW");
  assert.equal(result.cause, undefined);
  assert.deepEqual(result.violatedRuleIds, []);
  assert.ok(result.smtScript.includes("(declare-const amountCents Int)"));
  assert.ok(result.smtScript.includes("(assert (= amountCents 25000))"));
  assert.ok(result.smtScript.includes("(check-sat)"));
});

test("over-cap action is BLOCKed and attributes exactly the violated rules", async () => {
  const result = await decide(samplePolicy, sampleAction("250000"));
  assert.equal(result.outcome, "BLOCK");
  assert.equal(result.cause, "RULE_VIOLATION");
  assert.deepEqual(result.violatedRuleIds, ["amount.cap"]);
});

test("negative amount violates only the positivity rule", async () => {
  const result = await decide(samplePolicy, sampleAction("-5"));
  assert.equal(result.outcome, "BLOCK");
  assert.deepEqual(result.violatedRuleIds, ["amount.positive"]);
});

test("daily budget rule fires when used + amount exceeds the cap", async () => {
  const result = await decide(samplePolicy, sampleAction("20000", "490000"));
  assert.equal(result.outcome, "BLOCK");
  assert.deepEqual(result.violatedRuleIds, ["daily.budget"]);
});

test("compound terms: all/any/implies behave as expected", async () => {
  const doc: PolicyDoc = {
    policyId: "pol_compound",
    revision: 1,
    fields: ["x", "y"],
    assumptions: [],
    rules: [
      {
        ruleId: "shape",
        assertion: {
          kind: "all",
          parts: [
            { kind: "compare", op: "ge", left: ref("x"), right: int(0n) },
            {
              kind: "implies",
              when: { kind: "compare", op: "gt", left: ref("x"), right: int(10n) },
              then: { kind: "compare", op: "eq", left: ref("y"), right: int(1n) },
            },
            {
              kind: "any",
              parts: [
                { kind: "compare", op: "eq", left: ref("y"), right: int(0n) },
                { kind: "compare", op: "eq", left: ref("y"), right: int(1n) },
              ],
            },
          ],
        },
      },
    ],
  };

  assert.equal((await decide(doc, { values: { x: "5", y: "0" } })).outcome, "ALLOW");
  assert.equal((await decide(doc, { values: { x: "50", y: "1" } })).outcome, "ALLOW");

  const broken = await decide(doc, { values: { x: "50", y: "0" } });
  assert.equal(broken.outcome, "BLOCK");
  assert.deepEqual(broken.violatedRuleIds, ["shape"]);
});

test("fail-closed: unknown field, missing field, and non-integer values all BLOCK", async () => {
  const unknown = await decide(samplePolicy, { values: { amountCents: "1", dailyUsedCents: "0", extra: "3" } });
  assert.equal(unknown.outcome, "BLOCK");
  assert.equal(unknown.cause, "MALFORMED_ACTION");

  const missing = await decide(samplePolicy, { values: { amountCents: "1" } });
  assert.equal(missing.outcome, "BLOCK");
  assert.equal(missing.cause, "MALFORMED_ACTION");
  assert.ok(missing.detail?.includes("limitCents"));

  const floaty = await decide(samplePolicy, { values: { amountCents: "1.5", dailyUsedCents: "0" } });
  assert.equal(floaty.outcome, "BLOCK");
  assert.equal(floaty.cause, "MALFORMED_ACTION");
});

test("invalid policy documents are refused before the solver runs", () => {
  const broken = { ...samplePolicy, rules: [...samplePolicy.rules, { ruleId: "oops", assertion: { kind: "compare", op: "gt", left: { kind: "field", name: "nope" }, right: int(0n) } }] };
  const problems = checkPolicy(broken);
  assert.ok(problems.some((p) => p.code === "UNDECLARED_FIELD"));
});

test("binding helper normalizes numbers and rejects garbage", () => {
  const ok = bindAction(samplePolicy, { values: { amountCents: 42, dailyUsedCents: "0", limitCents: "100000", dailyCapCents: "500000" } });
  assert.ok("binding" in ok && ok.binding.get("amountCents") === 42n);
  assert.ok("reject" in bindAction(samplePolicy, { values: { amountCents: "12abc", dailyUsedCents: "0", limitCents: "1", dailyCapCents: "1" } }));
});

test("policy digest is stable across field order and key order", () => {
  const reordered: PolicyDoc = {
    ...samplePolicy,
    fields: [...samplePolicy.fields].reverse(),
  };
  assert.equal(policyDigest(reordered), policyDigest(samplePolicy));
  const bumped: PolicyDoc = { ...samplePolicy, revision: 4 };
  assert.notEqual(policyDigest(bumped), policyDigest(samplePolicy));
});

test("rendered script declares every field and comments every rule id", () => {
  const script = renderSmtScript(samplePolicy);
  for (const field of samplePolicy.fields) {
    assert.ok(script.includes(`(declare-const ${field} Int)`));
  }
  for (const rule of samplePolicy.rules) {
    assert.ok(script.includes(`rule ${rule.ruleId}`));
  }
  assert.ok(script.includes("(set-logic QF_NIA)"));
});
