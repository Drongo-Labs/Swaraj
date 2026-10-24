import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildStatement,
  canonicalStatementText,
  openArtifactStore,
  reevaluateGround,
  statementId,
  LocalProofSink,
} from "../dist/index.js";
import { decide, policyDigest, type PolicyDoc } from "@swaraj/smt";

const int = (value: bigint) => ({ kind: "const", value }) as const;
const ref = (name: string) => ({ kind: "field", name }) as const;
const cmp = (op: "eq" | "ne" | "lt" | "le" | "gt" | "ge", left: object, right: object) =>
  ({ kind: "compare", op, left, right }) as const;

const demoPolicy: PolicyDoc = {
  policyId: "pol_trade_demo",
  revision: 3,
  fields: ["amountCents", "limitCents", "dailyUsedCents", "dailyCapCents"],
  assumptions: [
    { ruleId: "limit.fixed", assertion: cmp("eq", ref("limitCents"), int(100000n)) },
  ],
  rules: [
    { ruleId: "amount.positive", assertion: cmp("gt", ref("amountCents"), int(0n)) },
    { ruleId: "amount.cap", assertion: cmp("le", ref("amountCents"), ref("limitCents")) },
    {
      ruleId: "daily.budget",
      assertion: cmp(
        "le",
        { kind: "sum", parts: [ref("dailyUsedCents"), ref("amountCents")] },
        ref("dailyCapCents"),
      ),
    },
  ],
};

const demoAction = (amountCents: string, dailyUsedCents = "0") => ({
  values: {
    amountCents,
    dailyUsedCents,
    limitCents: "100000",
    dailyCapCents: "500000",
  },
});

test("ground re-evaluation agrees with the Z3 gateway on ALLOW and BLOCK cases", async () => {
  for (const [amount, used] of [["25000", "0"], ["250000", "0"], ["-5", "0"], ["20000", "490000"]] as const) {
    const gateway = await decide(demoPolicy, demoAction(amount, used));
    const ground = reevaluateGround(demoPolicy, demoAction(amount, used));
    assert.equal(ground.outcome, gateway.outcome, `outcome mismatch for ${amount}`);
    assert.deepEqual(
      ground.violatedRuleIds.slice().sort(),
      gateway.violatedRuleIds.slice().sort(),
      `rule attribution mismatch for ${amount}`,
    );
  }
});

test("statement canonical text and id are pinned", () => {
  const decision = reevaluateGround(demoPolicy, demoAction("25000"));
  const statement = buildStatement(demoPolicy, demoAction("25000"), decision);
  assert.equal(statement.policyDocDigest, policyDigest(demoPolicy));
  const text = canonicalStatementText(statement);
  const expectedLines = [
    "swaraj/statement/v1",
    "policy=pol_trade_demo",
    "revision=3",
    `digest=${statement.policyDocDigest}`,
    "binding=amountCents:25000;dailyCapCents:500000;dailyUsedCents:0;limitCents:100000",
    "outcome=ALLOW",
    "violated=-",
  ];
  assert.deepEqual(text.split("\n"), expectedLines);
  assert.equal(statementId(statement), "stmt_9d38c1995da6b1b38fb119e7eb71e266e5e6127d7cc51255d2d6293331d2fcbe");
});

test("artifact store writes one JSON bundle per receipt and sink references it deterministically", async () => {
  const root = await mkdtemp(join(tmpdir(), "swaraj-artifacts-"));
  try {
    const decision = reevaluateGround(demoPolicy, demoAction("25000"));
    const statement = buildStatement(demoPolicy, demoAction("25000"), decision);
    const bundle = {
      statementId: statementId(statement),
      canonicalText: canonicalStatementText(statement),
      createdAt: "2026-10-18T00:00:00.000Z",
    };
    const store = openArtifactStore(root);
    const path = await store.writeBundle("rcpt_demo", bundle);
    const written = JSON.parse(await readFile(path, "utf8")) as { statementId: string };
    assert.equal(written.statementId, bundle.statementId);

    const sink = new LocalProofSink();
    const first = await sink.submit(bundle);
    const second = await sink.submit(bundle);
    assert.equal(first.ref, second.ref);
    assert.match(first.ref, /^zkv_local_[0-9a-f]{32}$/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("ground re-evaluation is fail-closed on malformed actions", () => {
  assert.throws(() => reevaluateGround(demoPolicy, { values: { amountCents: "1", dailyUsedCents: "0", limitCents: "100000", dailyCapCents: "500000", extra: "1" } }));
  assert.throws(() => reevaluateGround(demoPolicy, { values: { amountCents: "1.5", dailyUsedCents: "0", limitCents: "100000", dailyCapCents: "500000" } }));
  assert.throws(() => reevaluateGround(demoPolicy, { values: { amountCents: "1" } }));
});
