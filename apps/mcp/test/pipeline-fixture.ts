import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import {
  applyMigrations,
  claimIdempotencyKey,
  enqueueProofJob,
  findReceipt,
  findReceiptByIdempotencyKey,
  insertDecision,
  insertReceipt,
  openPool,
  type PoolHandle,
} from "@swaraj/database";
import { decide, policyDigest, type PolicyDoc } from "@swaraj/smt";
import { fromWirePolicy, toWirePolicy } from "@swaraj/proofs";
import type { PolicyView, ReceiptView, SubmitActionResponse } from "../dist/index.js";

/**
 * Test fixture implementing the documented Swaraj API contract
 * (POST /actions, GET /receipts/:id, GET /policies/:id) directly on top of
 * the real packages: policy decisions through the SMT gateway, receipt
 * persistence in Postgres, proof jobs on the queue. The production
 * apps/api owns orchestration; this fixture exists so the MCP bridge and
 * package integrations can be verified before it lands.
 */

export interface FixtureHandle {
  server: Server;
  port: number;
  pool: PoolHandle;
  policies: Map<string, PolicyDoc>;
  appId: string;
  token: string;
  close(): Promise<void>;
}

export async function startPipelineFixture(): Promise<FixtureHandle> {
  const pool = openPool();
  await applyMigrations(pool);

  const appId = `app_${randomUUID().slice(0, 8)}`;
  const token = `fixture-token-${randomUUID().slice(0, 8)}`;
  await pool.raw.query("INSERT INTO applications (app_id, display_name) VALUES ($1, $2)", [
    appId,
    "fixture app",
  ]);

  const policies = new Map<string, PolicyDoc>();

  const server = createServer((req, res) => {
    void handle(req, res).catch((err: unknown) => {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end(err instanceof Error ? err.message : String(err));
    });
  });

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", "http://fixture.local");
    const body = await readBody(req);

    if (req.headers.authorization !== `Bearer ${token}`) {
      res.writeHead(401, { "content-type": "text/plain" });
      res.end("invalid token");
      return;
    }

    if (req.method === "POST" && url.pathname === "/actions") {
      await handleSubmitAction(body, res);
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/receipts/")) {
      await handleGetReceipt(url.pathname.slice("/receipts/".length), res);
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/policies/")) {
      handleGetPolicy(decodeURIComponent(url.pathname.slice("/policies/".length)), res);
      return;
    }
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  }

  async function handleSubmitAction(body: unknown, res: ServerResponse): Promise<void> {
    const request = body as {
      applicationId?: string;
      policyId?: string;
      input?: Record<string, string>;
      idempotencyKey?: string;
    };
    if (request.applicationId !== appId || typeof request.policyId !== "string" || typeof request.input !== "object") {
      res.writeHead(400, { "content-type": "text/plain" });
      res.end("bad request");
      return;
    }
    const policy = policies.get(request.policyId);
    if (!policy) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("unknown policy");
      return;
    }

    const action = { values: request.input ?? {} };
    const gateway = await decide(policy, action);

    if (request.idempotencyKey !== undefined) {
      const existing = await findReceiptByIdempotencyKey(pool, appId, request.idempotencyKey);
      if (existing) {
        const response: SubmitActionResponse = {
          decision: gateway.outcome,
          receiptId: existing.receiptId,
          violatedRuleIds: gateway.violatedRuleIds,
          policyDigest: gateway.policyDigest,
        };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(response));
        return;
      }
    }

    const decision = await insertDecision(pool, {
      appId,
      intentDigest: gateway.policyDigest,
      policyId: policy.policyId,
      policyRevision: policy.revision,
      outcome: gateway.outcome,
      violatedRules: gateway.violatedRuleIds,
      smtScript: gateway.smtScript,
    });

    if (gateway.outcome === "BLOCK") {
      const response: SubmitActionResponse = {
        decision: "BLOCK",
        violatedRuleIds: gateway.violatedRuleIds,
        policyDigest: gateway.policyDigest,
      };
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
      return;
    }

    const receiptId = `rcpt_${randomUUID().slice(0, 12)}`;
    await insertReceipt(pool, {
      receiptId,
      appId,
      intentDigest: gateway.policyDigest,
      decisionId: decision.decisionId,
      claim: { kind: "TRADE_EXECUTED", policyId: policy.policyId },
    });
    if (request.idempotencyKey !== undefined) {
      await claimIdempotencyKey(pool, {
        appId,
        idemKey: request.idempotencyKey,
        intentDigest: gateway.policyDigest,
        receiptId,
      });
    }
    await enqueueProofJob(pool, {
      receiptId,
      payload: {
        policy: toWirePolicy(policy),
        action,
        expected: {
          outcome: gateway.outcome,
          violatedRuleIds: gateway.violatedRuleIds,
        },
      },
    });

    const response: SubmitActionResponse = {
      decision: "ALLOW",
      receiptId,
      violatedRuleIds: [],
      policyDigest: gateway.policyDigest,
    };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(response));
  }

  async function handleGetReceipt(receiptId: string, res: ServerResponse): Promise<void> {
    const receipt = await findReceipt(pool, receiptId);
    if (!receipt) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("unknown receipt");
      return;
    }
    const view: ReceiptView = {
      receiptId: receipt.receiptId,
      state: receipt.state,
      proofRef: receipt.proofRef ?? undefined,
      claim: receipt.claim,
    };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(view));
  }

  function handleGetPolicy(policyId: string, res: ServerResponse): void {
    const policy = policies.get(policyId);
    if (!policy) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("unknown policy");
      return;
    }
    const view: PolicyView = {
      policyId: policy.policyId,
      revision: policy.revision,
      digest: policyDigest(policy),
      ruleIds: policy.rules.map((rule) => rule.ruleId),
    };
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(view));
  }

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string") throw new Error("no server address");

  return {
    server,
    port: address.port,
    pool,
    policies,
    appId,
    token,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await pool.close();
    },
  };
}

/** Register a wire-form policy in the fixture and return the revived AST. */
export function registerPolicy(handle: FixtureHandle, wirePolicy: PolicyDoc): PolicyDoc {
  const policy = fromWirePolicy(wirePolicy);
  handle.policies.set(policy.policyId, policy);
  return policy;
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => {
      data += chunk.toString("utf8");
    });
    req.on("end", () => {
      if (data.length === 0) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}
