import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { registerPolicy, startPipelineFixture, type FixtureHandle } from "./pipeline-fixture.ts";
import { runOneProofJob } from "@swaraj/proofs";
import type { PolicyDoc } from "@swaraj/smt";

/**
 * Integration of the owned packages behind the API contract: every
 * submitted action goes through the SMT gateway, decisions and receipts
 * persist in Postgres, and proof generation is triggered on the queue.
 */

let fixture: FixtureHandle;
const wirePolicy: PolicyDoc = {
  policyId: "pol_api_demo",
  revision: 1,
  fields: ["amountCents", "limitCents"],
  assumptions: [
    {
      ruleId: "limit.fixed",
      assertion: {
        kind: "compare",
        op: "eq",
        left: { kind: "field", name: "limitCents" },
        right: { kind: "const", value: 100000 },
      },
    },
  ],
  rules: [
    {
      ruleId: "amount.positive",
      assertion: {
        kind: "compare",
        op: "gt",
        left: { kind: "field", name: "amountCents" },
        right: { kind: "const", value: 0 },
      },
    },
    {
      ruleId: "amount.cap",
      assertion: {
        kind: "compare",
        op: "le",
        left: { kind: "field", name: "amountCents" },
        right: { kind: "field", name: "limitCents" },
      },
    },
  ],
};

const inPolicy = { amountCents: "25000", limitCents: "100000" };
const overCap = { amountCents: "250000", limitCents: "100000" };

test.before(async () => {
  fixture = await startPipelineFixture();
  await registerPolicy(fixture, wirePolicy);
  await fixture.pool.raw.query("DELETE FROM proof_jobs");
});

test.after(async () => {
  await fixture?.close();
});

function postAction(input: Record<string, string>, idempotencyKey?: string): Promise<Response> {
  return fetch(`http://127.0.0.1:${fixture.port}/actions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${fixture.token}`,
    },
    body: JSON.stringify({
      applicationId: fixture.appId,
      policyId: wirePolicy.policyId,
      input,
      ...(idempotencyKey !== undefined ? { idempotencyKey } : {}),
    }),
  });
}

test("smt in the pipeline: in-policy action allows, over-cap blocks with rule attribution", async () => {
  const allowed = await postAction(inPolicy);
  assert.equal(allowed.status, 200);
  const allowedBody = (await allowed.json()) as { decision: string; receiptId: string; violatedRuleIds: string[] };
  assert.equal(allowedBody.decision, "ALLOW");
  assert.ok(allowedBody.receiptId);
  assert.deepEqual(allowedBody.violatedRuleIds, []);

  const blocked = await postAction(overCap);
  const blockedBody = (await blocked.json()) as { decision: string; receiptId?: string; violatedRuleIds: string[] };
  assert.equal(blockedBody.decision, "BLOCK");
  assert.equal(blockedBody.receiptId, undefined);
  assert.deepEqual(blockedBody.violatedRuleIds, ["amount.cap"]);
});

test("database in the pipeline: ALLOW persists decision + receipt, BLOCK persists decision only", async () => {
  const before = await fixture.pool.raw.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM receipts",
  );

  const allowed = (await (await postAction(inPolicy)).json()) as { receiptId: string };
  const receiptRow = await fixture.pool.raw.query<{ state: string; app_id: string }>(
    "SELECT state, app_id FROM receipts WHERE receipt_id = $1",
    [allowed.receiptId],
  );
  assert.equal(receiptRow.rows[0]?.state, "PENDING");
  assert.equal(receiptRow.rows[0]?.app_id, fixture.appId);

  const decisionRow = await fixture.pool.raw.query<{ outcome: string; violated_rules: string[] }>(
    "SELECT outcome, violated_rules FROM authz_decisions WHERE decision_id = (SELECT decision_id FROM receipts WHERE receipt_id = $1)",
    [allowed.receiptId],
  );
  assert.equal(decisionRow.rows[0]?.outcome, "ALLOW");

  const blocked = (await (await postAction(overCap)).json()) as { decision: string };
  assert.equal(blocked.decision, "BLOCK");
  const after = await fixture.pool.raw.query<{ count: string }>(
    "SELECT count(*)::text AS count FROM receipts",
  );
  assert.equal(Number(after.rows[0]?.count), Number(before.rows[0]?.count) + 1);
});

test("proofs in the pipeline: submission enqueues a job the worker proves", async () => {
  await fixture.pool.raw.query("DELETE FROM proof_jobs");
  const allowed = (await (await postAction(inPolicy)).json()) as { receiptId: string };
  const queued = await fixture.pool.raw.query<{ phase: string }>(
    "SELECT phase FROM proof_jobs WHERE receipt_id = $1",
    [allowed.receiptId],
  );
  assert.equal(queued.rows[0]?.phase, "QUEUED");

  const outcome = await runOneProofJob(fixture.pool, {
    artifactRoot: `/tmp/swaraj-mcp-artifacts-${randomUUID().slice(0, 8)}`,
  });
  assert.ok(outcome, "worker processed the job");
  assert.equal(outcome.receiptId, allowed.receiptId);

  const receipt = await fetch(`http://127.0.0.1:${fixture.port}/receipts/${allowed.receiptId}`, {
    headers: { authorization: `Bearer ${fixture.token}` },
  });
  const receiptBody = (await receipt.json()) as { state: string; proofRef?: string };
  assert.equal(receiptBody.state, "PROVED");
  assert.match(receiptBody.proofRef ?? "", /^zkv_local_[0-9a-f]{32}$/);
});

test("idempotency: the same key returns the original receipt", async () => {
  const key = `idem_${randomUUID().slice(0, 8)}`;
  const first = (await (await postAction(inPolicy, key)).json()) as { receiptId: string };
  const second = (await (await postAction(inPolicy, key)).json()) as { receiptId: string };
  assert.equal(second.receiptId, first.receiptId);
});

test("auth: a bad token is rejected before any pipeline work", async () => {
  const response = await fetch(`http://127.0.0.1:${fixture.port}/actions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer wrong" },
    body: JSON.stringify({ applicationId: fixture.appId, policyId: wirePolicy.policyId, input: inPolicy }),
  });
  assert.equal(response.status, 401);
});

test("policy view exposes digest and rule ids", async () => {
  const response = await fetch(`http://127.0.0.1:${fixture.port}/policies/${wirePolicy.policyId}`, {
    headers: { authorization: `Bearer ${fixture.token}` },
  });
  assert.equal(response.status, 200);
  const body = (await response.json()) as { policyId: string; revision: number; digest: string; ruleIds: string[] };
  assert.equal(body.policyId, wirePolicy.policyId);
  assert.equal(body.revision, 1);
  assert.match(body.digest, /^pol_[0-9a-f]{64}$/);
  assert.deepEqual(body.ruleIds, ["amount.positive", "amount.cap"]);
});
