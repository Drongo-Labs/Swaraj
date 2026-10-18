import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import type { Pool } from "pg";
import {
  createDecisionProofJobQueue,
  createDecisionReceiptStore,
  createPostgresDecisionStore,
  createProofInputStore,
  getAuthorizationDecision,
  type DecisionProofJob,
  type DecisionReceiptRecord,
} from "@swaraj/database";
import type { ReceiptRecord } from "@swaraj/receipts";
import type { AuthorizationDecisionToStore, DecisionStore } from "@swaraj/smt";
import type { PipelineBlockResult, ProveContext } from "./pipeline/index.js";

type GuestBundle = Record<string, unknown> & { referenceTime: number };
type GuestOutput = { decisionAllow: boolean; claimType: string; violatedRuleIds: number[]; publicValues: string };
type DecisionPlan =
  | { provable: true; receipt: Omit<DecisionReceiptRecord, "id" | "status" | "createdAt" | "updatedAt">; smtViolatedRuleIds: number[] }
  | { provable: false; reasonCode: string; detail?: string; guestRuleIds?: number[] };

const require = createRequire(import.meta.url);
const { buildTradeProofBundle, buildDecisionProofBundle, planDecisionReceipt } = require("@swaraj/proofs/proof-bundles") as {
  buildTradeProofBundle(input: ProveContext & { receipt: unknown }): GuestBundle;
  buildDecisionProofBundle(input: { intent: unknown; policy: unknown; state: unknown; decisionLogEntryHash: string }): GuestBundle;
  planDecisionReceipt(input: { bundle: GuestBundle; decision: unknown; decisionLogEntryHash: string }): DecisionPlan;
};
const { deriveGuestOutput } = require("@swaraj/proofs/public-values") as { deriveGuestOutput(bundle: GuestBundle): GuestOutput };

/** Proof eligibility of a trade receipt, decided once from the evidence it was created with. */
export type TradeProofStatus =
  | { status: "AWAITING_PROOF"; claimScope: "TRADE_RECEIPT_V1" }
  | { status: "NOT_PROVABLE"; reason: string; guestRuleIds?: number[] };

export type DecisionReceiptView =
  | { status: "PENDING" | "PROVED" | "NON_PROVABLE"; id: string; violatedRuleIds: number[]; smtViolatedRuleIds?: number[]; reasonCode?: string }
  | { status: "NON_PROVABLE"; reasonCode: string; id?: string; detail?: string; guestRuleIds?: number[] };

/** Decision log with entry hashes, the anchor a Phase 9 Decision Receipt is bound to. */
export type DecisionLog = { store: DecisionStore; entryHash(decisionId: string): Promise<string | undefined> };

/** Hash-chained in-memory decision log for development runs without Postgres. */
export function createMemoryDecisionLog(): DecisionLog {
  const hashes = new Map<string, string>();
  let previous: string | null = null;
  return {
    store: {
      async save(decision: AuthorizationDecisionToStore) {
        const id = randomUUID();
        const payload = JSON.stringify({
          intentHash: decision.intentHash, policyHash: decision.policyHash, stateHash: decision.stateHash,
          policyVersion: decision.policyVersion, decision: decision.decision, solverStatus: decision.solverStatus,
          violatedRuleIds: [...decision.violatedRuleIds].sort((a, b) => a - b), previousDecisionHash: previous,
        });
        previous = createHash("sha256").update(payload).digest("hex");
        hashes.set(id, `0x${previous}`);
        return id;
      },
    },
    async entryHash(decisionId) {
      return hashes.get(decisionId);
    },
  };
}

/** The append-only authorization_decisions table (Phase 4) as the decision log. */
export function createPostgresDecisionLog(pool: Pool): DecisionLog {
  return {
    store: createPostgresDecisionStore(pool),
    async entryHash(decisionId) {
      const row = await getAuthorizationDecision(pool, decisionId);
      return row?.decisionHash ? `0x${row.decisionHash}` : undefined;
    },
  };
}

type Backend = {
  putBundle(kind: "TRADE_RECEIPT" | "DECISION_RECEIPT", applicationId: string, subjectId: string, bundle: GuestBundle): Promise<void>;
  getBundle(kind: "TRADE_RECEIPT" | "DECISION_RECEIPT", applicationId: string, subjectId: string): Promise<GuestBundle | undefined>;
  createDecisionReceipt(record: Omit<DecisionReceiptRecord, "status" | "createdAt" | "updatedAt">): Promise<DecisionReceiptRecord>;
  createNonProvable(record: Omit<DecisionReceiptRecord, "status" | "createdAt" | "updatedAt" | "reasonCode"> & { reasonCode: string }): Promise<DecisionReceiptRecord>;
  getDecisionReceipt(id: string): Promise<DecisionReceiptRecord | undefined>;
  getDecisionProofJob(id: string): Promise<DecisionProofJob | undefined>;
};

function memoryBackend(): Backend {
  const bundles = new Map<string, GuestBundle>();
  const decisionReceipts = new Map<string, DecisionReceiptRecord>();
  return {
    async putBundle(kind, applicationId, subjectId, bundle) { bundles.set(`${kind}:${applicationId}:${subjectId}`, bundle); },
    async getBundle(kind, applicationId, subjectId) { return bundles.get(`${kind}:${applicationId}:${subjectId}`); },
    async createDecisionReceipt(record) {
      const now = new Date();
      const created: DecisionReceiptRecord = { ...record, status: "PENDING", createdAt: now, updatedAt: now };
      decisionReceipts.set(record.id, created);
      return created;
    },
    async createNonProvable(record) {
      const now = new Date();
      const created: DecisionReceiptRecord = { ...record, status: "NON_PROVABLE", createdAt: now, updatedAt: now };
      decisionReceipts.set(record.id, created);
      return created;
    },
    async getDecisionReceipt(id) { return decisionReceipts.get(id); },
    async getDecisionProofJob() { return undefined; },
  };
}

function postgresBackend(pool: Pool): Backend {
  const inputs = createProofInputStore(pool);
  const receipts = createDecisionReceiptStore(pool);
  const jobs = createDecisionProofJobQueue(pool);
  return {
    async putBundle(kind, applicationId, subjectId, bundle) { await inputs.put({ subjectKind: kind, applicationId, subjectId, guestBundle: bundle }); },
    async getBundle(kind, applicationId, subjectId) { return (await inputs.get(kind, applicationId, subjectId))?.guestBundle as GuestBundle | undefined; },
    createDecisionReceipt: (record) => receipts.create(record),
    createNonProvable: (record) => receipts.createNonProvable(record),
    getDecisionReceipt: (id) => receipts.get(id),
    getDecisionProofJob: (id) => jobs.getByDecisionReceipt(id),
  };
}

/**
 * Records what the Phase 8/9 provers need: the receipt-bound trade bundle for a provable ALLOW, and a
 * Decision Receipt plus its decision bundle for a provable BLOCK. Nothing here marks anything PROVED.
 */
export function createProofRecorder(options: { pool?: Pool; decisionLog: DecisionLog }) {
  const backend = options.pool ? postgresBackend(options.pool) : memoryBackend();
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  return {
    durable: options.pool !== undefined,

    async recordTradeReceipt(applicationId: string, record: ReceiptRecord, context: ProveContext): Promise<TradeProofStatus> {
      if (record.status !== "PENDING") return { status: "NOT_PROVABLE", reason: `receipt is ${record.status}` };
      let bundle: GuestBundle;
      let output: GuestOutput;
      try {
        bundle = buildTradeProofBundle({ ...context, receipt: record.signedReceipt });
        output = deriveGuestOutput(bundle);
      } catch (error) {
        return { status: "NOT_PROVABLE", reason: error instanceof Error ? error.message : "guest bundle could not be built" };
      }
      if (!output.decisionAllow || output.claimType !== "TRADE_EXECUTED") {
        // e.g. finality still PENDING ([14]) or evidence without chain-state proofs.
        return { status: "NOT_PROVABLE", reason: "guest verifier would not produce TRADE_RECEIPT_V1", guestRuleIds: output.violatedRuleIds };
      }
      await backend.putBundle("TRADE_RECEIPT", applicationId, record.receiptId, bundle);
      return { status: "AWAITING_PROOF", claimScope: "TRADE_RECEIPT_V1" };
    },

    async recordBlockDecision(applicationId: string, block: PipelineBlockResult): Promise<DecisionReceiptView> {
      if (!block.decisionId) return { status: "NON_PROVABLE", reasonCode: "DECISION_NOT_LOGGED" };
      const decisionLogEntryHash = await options.decisionLog.entryHash(block.decisionId);
      if (!decisionLogEntryHash) return { status: "NON_PROVABLE", reasonCode: "DECISION_NOT_LOGGED" };
      const id = randomUUID();
      // Unprovable BLOCKs are still recorded (NON_PROVABLE with a reason) as an audit trail.
      const recordNonProvable = async (reasonCode: string, extra: { detail?: string; guestRuleIds?: number[] }, referenceTime: number): Promise<DecisionReceiptView> => {
        const hashes = [block.intentHash, block.policyHash, block.stateHash];
        if (hashes.every((value) => typeof value === "string" && /^0x[0-9a-f]{64}$/.test(value))) {
          await backend.createNonProvable({
            id, applicationId, decisionLogEntryHash, intentHash: block.intentHash!, policyHash: block.policyHash!, stateHash: block.stateHash!,
            decision: "BLOCK", violatedRuleIds: block.violatedRuleIds, referenceTime, verifierVersion: "0.1.0",
            solverStatus: block.solverStatus, reasonCode,
          });
          return { status: "NON_PROVABLE", reasonCode, id, ...extra };
        }
        return { status: "NON_PROVABLE", reasonCode, ...extra };
      };
      const state = block.proveContext.state as { timestamp?: unknown } | undefined;
      const snapshotTime = typeof state?.timestamp === "number" && Number.isSafeInteger(state.timestamp) && state.timestamp >= 0 ? state.timestamp : 0;
      let bundle: GuestBundle;
      try {
        bundle = buildDecisionProofBundle({ ...block.proveContext, decisionLogEntryHash });
      } catch (error) {
        return recordNonProvable("GUEST_INPUT_INVALID", { detail: error instanceof Error ? error.message : String(error) }, snapshotTime);
      }
      const plan = planDecisionReceipt({ bundle, decisionLogEntryHash, decision: block });
      if (!plan.provable) {
        return recordNonProvable(plan.reasonCode, {
          ...(plan.detail ? { detail: plan.detail } : {}),
          ...(plan.guestRuleIds ? { guestRuleIds: plan.guestRuleIds } : {}),
        }, bundle.referenceTime);
      }
      const created = await backend.createDecisionReceipt({ id, applicationId, ...plan.receipt });
      await backend.putBundle("DECISION_RECEIPT", applicationId, id, bundle);
      return { status: created.status, id, violatedRuleIds: created.violatedRuleIds, smtViolatedRuleIds: plan.smtViolatedRuleIds };
    },

    getTradeBundle: (applicationId: string, receiptId: string) => backend.getBundle("TRADE_RECEIPT", applicationId, receiptId),

    async getDecisionReceipt(applicationId: string, id: string) {
      if (!UUID.test(id)) return undefined;
      const receipt = await backend.getDecisionReceipt(id);
      if (!receipt || receipt.applicationId !== applicationId) return undefined;
      return { receipt, job: await backend.getDecisionProofJob(id), bundle: await backend.getBundle("DECISION_RECEIPT", applicationId, id) };
    },
  };
}

export type ProofRecorder = ReturnType<typeof createProofRecorder>;
