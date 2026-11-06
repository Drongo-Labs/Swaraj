import assert from "node:assert/strict";
import test from "node:test";
import { createServer, type Server } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  applyMigrations,
  enqueueProofJob,
  findReceipt,
  insertDecision,
  insertReceipt,
  openPool,
  type PoolHandle,
} from "@swaraj/database";
import { buildStatement, canonicalStatementText, reevaluateGround, RemoteProofSink, statementId, toWirePolicy } from "../dist/index.js";
import type { PolicyDoc } from "@swaraj/smt";

/** zkVerify submission flow against a local relay. No network access. */

interface RelayState {
  submissions: Array<{ statementId: string; evidenceDigest?: string }>;
  polls: number;
  /** Poll count at which the relay finalizes; Infinity keeps it pending forever. */
  finalAfterPolls: number;
  finalAttestation: string;
}

function startRelay(state: RelayState): Promise<Server> {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://relay.local");
    if (req.method === "POST" && url.pathname === "/submit") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const payload = JSON.parse(body) as { statementId: string; evidenceDigest?: string };
        state.submissions.push(payload);
        res.writeHead(201, { "content-type": "application/json" });
        res.end(JSON.stringify({ ref: `sub_${state.submissions.length}` }));
      });
      return;
    }
    const match = /^\/attestations\/(sub_\d+)$/.exec(url.pathname);
    if (req.method === "GET" && match) {
      state.polls += 1;
      res.writeHead(200, { "content-type": "application/json" });
      if (state.polls < state.finalAfterPolls) {
        res.end(JSON.stringify({ status: "pending" }));
      } else {
        res.end(JSON.stringify({ status: "finalized", attestation: state.finalAttestation }));
      }
      return;
    }
    res.writeHead(404);
    res.end("not found");
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function relayConfig(server: Server): { submitUrl: string; attestationUrl: (ref: string) => string } {
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  return {
    submitUrl: `${base}/submit`,
    attestationUrl: (ref) => `${base}/attestations/${ref}`,
  };
}

const demoPolicy: PolicyDoc = {
  policyId: "pol_submission_demo",
  revision: 1,
  fields: ["amountCents", "limitCents"],
  assumptions: [
    { ruleId: "limit.fixed", assertion: { kind: "compare", op: "eq", left: { kind: "field", name: "limitCents" }, right: { kind: "const", value: 100000n } } },
  ],
  rules: [
    { ruleId: "amount.positive", assertion: { kind: "compare", op: "gt", left: { kind: "field", name: "amountCents" }, right: { kind: "const", value: 0n } } },
    { ruleId: "amount.cap", assertion: { kind: "compare", op: "le", left: { kind: "field", name: "amountCents" }, right: { kind: "field", name: "limitCents" } } },
  ],
};

function demoBundle(evidenceDigest?: string) {
  const action = { values: { amountCents: "25000", limitCents: "100000" } };
  const decision = reevaluateGround(demoPolicy, action);
  const statement = buildStatement(demoPolicy, action, decision);
  return {
    statementId: statementId(statement),
    canonicalText: canonicalStatementText(statement),
    evidenceDigest,
    createdAt: "2026-10-18T00:00:00.000Z",
  };
}

test("remote sink submits once, polls through pending, and returns the finalized attestation", async () => {
  const state: RelayState = { submissions: [], polls: 0, finalAfterPolls: 2, finalAttestation: "zkv_test_att_1" };
  const server = await startRelay(state);
  try {
    const sink = new RemoteProofSink({ ...relayConfig(server), pollIntervalMs: 10, timeoutMs: 2_000 });
    const attestation = await sink.submit(demoBundle("deadbeef"));
    assert.equal(attestation.sink, "zkverify");
    assert.equal(attestation.ref, "zkv_test_att_1");
    assert.equal(state.submissions.length, 1);
    assert.equal(state.submissions[0]?.statementId, demoBundle().statementId);
    assert.equal(state.submissions[0]?.evidenceDigest, "deadbeef");
    assert.ok(state.polls >= 2, "at least one pending poll before finalization");
  } finally {
    await closeServer(server);
  }
});

test("remote sink surfaces attestation failure and timeout", async () => {
  const state: RelayState = { submissions: [], polls: 0, finalAfterPolls: Number.POSITIVE_INFINITY, finalAttestation: "unused" };
  const server = await startRelay(state);
  try {
    const sink = new RemoteProofSink({ ...relayConfig(server), pollIntervalMs: 5, timeoutMs: 30 });
    await assert.rejects(sink.submit(demoBundle()), /not finalized/);
  } finally {
    await closeServer(server);
  }
});

test("worker binds a remote-sink attestation to the receipt", async () => {
  const state: RelayState = { submissions: [], polls: 0, finalAfterPolls: 2, finalAttestation: "zkv_remote_ref_42" };
  const server = await startRelay(state);
  const pool: PoolHandle = openPool();
  const artifactRoot = await mkdtemp(join(tmpdir(), "swaraj-submit-"));
  try {
    await applyMigrations(pool);
    await pool.raw.query("DELETE FROM proof_jobs");
    const appId = `app_${randomUUID().slice(0, 8)}`;
    await pool.raw.query("INSERT INTO applications (app_id, display_name) VALUES ($1, $2)", [appId, "submission test"]);

    const suffix = randomUUID().slice(0, 6);
    const decision = await insertDecision(pool, {
      appId,
      intentDigest: `intent_${suffix}`,
      policyId: demoPolicy.policyId,
      policyRevision: demoPolicy.revision,
      outcome: "ALLOW",
      violatedRules: [],
      smtScript: "(check-sat)",
    });
    const receipt = await insertReceipt(pool, {
      receiptId: `rcpt_${suffix}`,
      appId,
      intentDigest: `intent_${suffix}`,
      decisionId: decision.decisionId,
      claim: { kind: "TRADE_EXECUTED" },
    });

    const action = { values: { amountCents: "25000", limitCents: "100000" } };
    await enqueueProofJob(pool, {
      receiptId: receipt.receiptId,
      payload: {
        policy: toWirePolicy(demoPolicy),
        action,
        expected: reevaluateGround(demoPolicy, action),
        evidence: { digest: "evidence_deadbeef" },
      },
    });

    const { runOneProofJob } = await import("../dist/index.js");
    const sink = new RemoteProofSink({ ...relayConfig(server), pollIntervalMs: 10, timeoutMs: 2_000 });
    const outcome = await runOneProofJob(pool, { artifactRoot, sink });
    assert.ok(outcome, "worker processed the job");
    assert.equal(outcome.proofRef, "zkv_remote_ref_42");
    assert.equal(outcome.receiptId, receipt.receiptId);

    const updated = await findReceipt(pool, receipt.receiptId);
    assert.equal(updated?.state, "PROVED");
    assert.equal(updated?.proofRef, "zkv_remote_ref_42");

    const artifact = JSON.parse(await readFile(outcome.artifactPath, "utf8")) as { evidenceDigest?: string };
    assert.equal(artifact.evidenceDigest, "evidence_deadbeef");
    assert.equal(state.submissions[0]?.evidenceDigest, "evidence_deadbeef");
  } finally {
    await closeServer(server);
    await pool.close();
    await rm(artifactRoot, { recursive: true, force: true });
  }
});

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}
