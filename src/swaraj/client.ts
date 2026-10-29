import type { AgentMandateWire } from "./mandateSchema.js";
import type { UnifiedIntent } from "../actions/intents.js";

export interface GatewayDecision {
  outcome: "ALLOW" | "BLOCK";
  violatedRuleIds: string[];
  decisionId?: string;
}

/**
 * Client for the Swaraj API surface the Zunno agent needs:
 * - `POST /v1/applications/:id/mandates`  (register the Agent Mandate)
 * - `POST /v1/applications/:id/unified-actions` (evaluate a typed intent)
 * - `GET  /v1/applications/:id/mandates/active` (fetch the active policyHash)
 */
export class SwarajClient {
  constructor(
    private readonly baseUrl: string,
    private readonly applicationId: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}/v1/applications/${encodeURIComponent(this.applicationId)}${path}`;
  }

  async registerMandate(mandate: AgentMandateWire): Promise<{ mandateId: string; version: number; policyHash: string; ruleCount: number }> {
    const response = await this.fetchImpl(this.url("/mandates"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mandate),
    });
    if (!response.ok) {
      throw new Error(`mandate registration failed: ${response.status} ${await safeText(response)}`);
    }
    return (await response.json()) as { mandateId: string; version: number; policyHash: string; ruleCount: number };
  }

  async activeMandate(): Promise<{ policyHash: string }> {
    const response = await this.fetchImpl(this.url("/mandates/active"), { method: "GET" });
    if (!response.ok) {
      throw new Error(`active mandate fetch failed: ${response.status} ${await safeText(response)}`);
    }
    return (await response.json()) as { policyHash: string };
  }

  async evaluateUnifiedAction(intent: UnifiedIntent): Promise<GatewayDecision> {
    let response: Response;
    try {
      response = await this.fetchImpl(this.url("/unified-actions"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(wireOf(intent)),
      });
    } catch (error) {
      // Fail closed: an unreachable gateway is a BLOCK, never a silent pass.
      throw new GatewayUnavailableError(error instanceof Error ? error.message : "gateway unreachable");
    }
    if (response.status === 400) {
      // Unknown action type / malformed intent: default deny by schema.
      return { outcome: "BLOCK", violatedRuleIds: ["schema.invalid"] };
    }
    if (!response.ok) {
      throw new Error(`gateway error: ${response.status} ${await safeText(response)}`);
    }
    const body = (await response.json()) as Partial<GatewayDecision> & { decision?: { outcome?: string; violatedRuleIds?: string[]; decisionId?: string } };
    const outcome = (body.outcome ?? body.decision?.outcome) === "ALLOW" ? "ALLOW" : "BLOCK";
    const decision: GatewayDecision = {
      outcome,
      violatedRuleIds: body.violatedRuleIds ?? body.decision?.violatedRuleIds ?? [],
    };
    const decisionId = body.decisionId ?? body.decision?.decisionId;
    if (decisionId !== undefined) decision.decisionId = decisionId;
    return decision;
  }
}

function wireOf(intent: UnifiedIntent): Record<string, unknown> {
  return {
    intentId: intent.common.intentId,
    agent: intent.common.agent,
    policyHash: intent.common.policyHash,
    timestamp: intent.common.timestamp,
    expiry: intent.common.expiry,
    idempotencyKey: intent.common.idempotencyKey,
    signature: intent.common.signature,
    action: intent.action,
    resource: intent.resource,
    context: intent.context,
  };
}

export class GatewayUnavailableError extends Error {}

async function safeText(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 200);
  } catch {
    return "";
  }
}
