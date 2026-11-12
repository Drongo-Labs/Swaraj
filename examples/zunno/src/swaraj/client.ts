import type { AgentMandateWire } from "./mandateSchema.js";

export interface GatewayDecision {
  outcome: "ALLOW" | "BLOCK";
  violatedRuleIds: string[];
  matchedPermitRuleIds?: string[];
  decisionId?: string;
  /** Live gateway only: the receipt the proof worker will prove on NEAR. */
  receiptId?: string;
}

/**
 * Client for the Swaraj API surface the Zunno agent needs:
 * - `POST /v1/applications/:id/mandates`       (register the Agent Mandate)
 * - `POST /v1/applications/:id/unified-actions` (evaluate a typed intent)
 *
 * Wire shape: the action travels under `{"action": {...}}`. The API requires
 * a bearer token (SWARAJ_DEV_TOKEN). HTTP errors fail closed to BLOCK; only
 * a network failure throws (the bridge maps that to BLOCK semantics too).
 */
export class SwarajClient {
  constructor(
    private readonly baseUrl: string,
    private readonly applicationId: string,
    private readonly token: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}/v1/applications/${encodeURIComponent(this.applicationId)}${path}`;
  }

  private async post(path: string, body: unknown, auth = this.token): Promise<{ status: number; json: Record<string, unknown> }> {
    const response = await this.fetchImpl(this.url(path), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(body),
    });
    let json: Record<string, unknown> = {};
    try {
      json = (await response.json()) as Record<string, unknown>;
    } catch {
      // Non-JSON error body: status alone decides.
    }
    return { status: response.status, json };
  }

  async registerMandate(mandate: AgentMandateWire): Promise<{ mandateId: string; version: number; policyHash: string; ruleCount: number }> {
    // Mandates are the owner's to set: use the approver token when the API has one.
    const { status, json } = await this.post("/mandates", mandate, process.env.SWARAJ_APPROVER_TOKEN || this.token);
    if (status !== 201) {
      throw new Error(`mandate registration failed: ${status} ${JSON.stringify(json).slice(0, 300)}`);
    }
    return {
      mandateId: String(json.mandateId),
      version: Number(json.version),
      policyHash: String(json.policyHash),
      ruleCount: Number(json.ruleCount),
    };
  }

  /** The gateway boundary speaks the unified-action wire form. */
  async evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> {
    let status: number;
    let json: Record<string, unknown>;
    try {
      ({ status, json } = await this.post("/unified-actions", { action: wireAction }));
    } catch (error) {
      // Fail closed: an unreachable gateway is a BLOCK, never a silent pass.
      throw new GatewayUnavailableError(error instanceof Error ? error.message : "gateway unreachable");
    }
    if (status === 400) {
      // Unknown action type / malformed intent: default deny by schema.
      return { outcome: "BLOCK", violatedRuleIds: ["schema.invalid"] };
    }
    if (status === 404) {
      return { outcome: "BLOCK", violatedRuleIds: ["mandate.not_found"] };
    }
    if (status !== 200) {
      return { outcome: "BLOCK", violatedRuleIds: [`http.${status}`] };
    }
    const outcome = json.decision === "ALLOW" ? "ALLOW" : "BLOCK";
    const mandate = (json.mandate ?? {}) as { reason?: string; matchedRuleIds?: string[]; matchedPermitRuleIds?: string[] };
    const result: GatewayDecision = {
      outcome,
      violatedRuleIds: outcome === "BLOCK" ? (mandate.matchedRuleIds ?? []) : [],
    };
    if (outcome === "ALLOW" && mandate.matchedPermitRuleIds) {
      result.matchedPermitRuleIds = mandate.matchedPermitRuleIds;
    }
    if (typeof json.activityId === "string") result.decisionId = json.activityId;
    if (typeof json.receiptId === "string") result.receiptId = json.receiptId;
    return result;
  }

  /** A receipt's proof state: PENDING until its proof settles on NEAR. */
  async receiptStatus(receiptId: string): Promise<{ status: string; reference?: string }> {
    const response = await this.fetchImpl(this.url(`/receipts/${encodeURIComponent(receiptId)}`), {
      headers: { authorization: `Bearer ${this.token}` },
    });
    const json = (await response.json()) as { status?: string; proof?: { reference?: string } };
    return { status: json.status ?? "UNKNOWN", ...(json.proof?.reference ? { reference: json.proof.reference } : {}) };
  }
}


export class GatewayUnavailableError extends Error {}
