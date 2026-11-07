import type { GatewayDecision } from "./index.js";

/**
 * Only ALLOW executes. RETRY tries the next gated proposal; ABSTAIN never retries (money actions).
 * A gateway error counts as BLOCK. See `Gate.exec_needs_allow`.
 */

export type ActResult =
  | { status: "EXECUTED"; txHash: string; decision: GatewayDecision }
  | { status: "ABSTAINED"; reason: "BLOCKED" | "GATEWAY_UNAVAILABLE"; violatedRuleIds: string[] }
  | { status: "FORFEITED"; reason: "BLOCKED" | "GATEWAY_UNAVAILABLE"; violatedRuleIds: string[] };

export interface ActionExecutor<P> {
  /** Applies an ALLOWED proposal. Throwing here surfaces as a caller error —
   * the gateway has ALLOWed, the executor is the app's own trust boundary. */
  execute(proposal: P): Promise<{ txHash: string }>;
}

export interface GovernedActionSpec<P> {
  /** RETRY falls back on BLOCK; ABSTAIN gives up (money actions). */
  policy: "RETRY" | "ABSTAIN";
  /** Builds the typed intent (wire form) the gateway evaluates. */
  toWireAction: (proposal: P) => unknown;
  /** Next compliant proposal after a block, or null when exhausted (RETRY only). */
  fallback?: (blocked: P) => P | null;
}

export interface GovernedAgentDeps<P> {
  client: { evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> };
  executor: ActionExecutor<P>;
  /** Default spec; per-call spec may override (apps with heterogeneous actions). */
  spec: GovernedActionSpec<P>;
  /** Compliant retries before forfeiting (default 3). */
  maxFallbacks?: number;
}

export class GovernedAgent<P> {
  constructor(private readonly deps: GovernedAgentDeps<P>) {}

  async act(proposal: P, spec: GovernedActionSpec<P> = this.deps.spec): Promise<ActResult> {
    return this.attempt(proposal, this.deps.maxFallbacks ?? 3, spec);
  }

  private async attempt(proposal: P, remaining: number, spec: GovernedActionSpec<P>): Promise<ActResult> {
    let decision: GatewayDecision;
    try {
      decision = await this.deps.client.evaluateUnifiedAction(spec.toWireAction(proposal));
    } catch {
      // Fail closed: gateway unreachable is BLOCK semantics.
      return this.onBlock(proposal, { outcome: "BLOCK", violatedRuleIds: ["gateway.unreachable"] }, remaining, spec);
    }
    if (decision.outcome === "ALLOW") {
      const tx = await this.deps.executor.execute(proposal);
      return { status: "EXECUTED", txHash: tx.txHash, decision };
    }
    return this.onBlock(proposal, decision, remaining, spec);
  }

  private async onBlock(proposal: P, decision: GatewayDecision, remaining: number, spec: GovernedActionSpec<P>): Promise<ActResult> {
    if (spec.policy === "ABSTAIN") {
      return {
        status: "ABSTAINED",
        reason: decision.violatedRuleIds[0] === "gateway.unreachable" ? "GATEWAY_UNAVAILABLE" : "BLOCKED",
        violatedRuleIds: decision.violatedRuleIds,
      };
    }
    if (remaining <= 0 || !spec.fallback) {
      return {
        status: "FORFEITED",
        reason: decision.violatedRuleIds[0] === "gateway.unreachable" ? "GATEWAY_UNAVAILABLE" : "BLOCKED",
        violatedRuleIds: decision.violatedRuleIds,
      };
    }
    const next = spec.fallback(proposal);
    if (next === null) {
      return {
        status: "FORFEITED",
        reason: decision.violatedRuleIds[0] === "gateway.unreachable" ? "GATEWAY_UNAVAILABLE" : "BLOCKED",
        violatedRuleIds: decision.violatedRuleIds,
      };
    }
    const result = await this.attempt(next, remaining - 1, spec);
    if (result.status === "FORFEITED") {
      return { ...result, violatedRuleIds: [...decision.violatedRuleIds, ...result.violatedRuleIds] };
    }
    return result;
  }
}
