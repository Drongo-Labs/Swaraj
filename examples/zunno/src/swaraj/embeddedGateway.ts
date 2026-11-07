import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AgentMandateSchema, UnifiedActionSchema, type AgentMandate } from "../vendor/schemas/index.js";
import { evaluateParsedMandate } from "../vendor/rules/index.js";
import type { GatewayDecision } from "./client.js";

/**
 * Embedded Swaraj gateway: the vendored mandate engine runs in-process against
 * the mandate fixture — same default-deny, forbid-wins, fail-closed semantics
 * as the HTTP gateway, with zero external services. Any parse or evaluation
 * error is a BLOCK (fail closed), never a silent pass.
 *
 * The SwarajClient (src/swaraj/client.ts) is the remote drop-in: the agent
 * bridge works against either.
 */

let cachedMandate: AgentMandate | undefined;

export function loadEmbeddedMandate(): AgentMandate {
  if (!cachedMandate) {
    const path = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "mandate", "zunno-mandate.json");
    cachedMandate = AgentMandateSchema.parse(JSON.parse(readFileSync(path, "utf-8")));
  }
  return cachedMandate;
}

export class EmbeddedGateway {
  constructor(private readonly mandate: AgentMandate = loadEmbeddedMandate()) {}

  /** The gateway boundary speaks the unified-action wire form. */
  async evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> {
    let decision;
    try {
      const action = UnifiedActionSchema.parse(wireAction);
      decision = evaluateParsedMandate(this.mandate, action);
    } catch {
      return { outcome: "BLOCK", violatedRuleIds: ["invalid.action"] };
    }
    if (decision.decision === "ALLOW") {
      return {
        outcome: "ALLOW",
        violatedRuleIds: [],
        matchedPermitRuleIds: decision.matchedPermitRuleIds,
      };
    }
    const violated = decision.matchedRuleIds.length > 0 ? decision.matchedRuleIds : ["default.deny"];
    return { outcome: "BLOCK", violatedRuleIds: violated };
  }
}
