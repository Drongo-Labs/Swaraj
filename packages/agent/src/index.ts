/** Gateway decision as the governed agent consumes it (fail-closed shape). */
export interface GatewayDecision {
  outcome: "ALLOW" | "BLOCK";
  violatedRuleIds: string[];
  matchedPermitRuleIds?: string[];
  decisionId?: string;
}

export * from "./agent.js";
