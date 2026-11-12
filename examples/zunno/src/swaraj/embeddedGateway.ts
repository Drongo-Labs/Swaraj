import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { AgentMandateSchema, UnifiedActionSchema, type AgentMandate } from "@swaraj/schemas";
import { crossCheckMandateDecision, evaluateParsedMandate } from "@swaraj/rules";
import type { GatewayDecision } from "./client.js";

/**
 * Embedded Swaraj gateway: the vendored mandate engine runs in-process against
 * the mandate fixture — same default-deny, forbid-wins, fail-closed semantics
 * as the HTTP gateway, with zero external services. Any parse or evaluation
 * error is a BLOCK (fail closed), never a silent pass. Z3 independently
 * confirms every decision (off only with SWARAJ_Z3_CROSSCHECK=0); a
 * disagreement or solver failure is a BLOCK too.
 *
 * The SwarajClient (src/swaraj/client.ts) is the remote drop-in: the agent
 * bridge works against either.
 */

const MANDATE_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "mandate", "zunno-mandate.json");
let cachedMandate: AgentMandate | undefined;
let cachedKey = "";

/**
 * The mandate on disk, re-read whenever the file changes, so a rule saved from
 * the dashboard applies to the next move without a restart. A file that no
 * longer parses throws, and the gateway turns that into a BLOCK.
 */
export function loadEmbeddedMandate(path = MANDATE_PATH): AgentMandate {
  const key = `${path}:${statSync(path).mtimeMs}`;
  if (!cachedMandate || key !== cachedKey) {
    cachedMandate = undefined;
    cachedMandate = AgentMandateSchema.parse(JSON.parse(readFileSync(path, "utf-8")));
    cachedKey = key;
  }
  return cachedMandate;
}

export class EmbeddedGateway {
  /** A mandate passed in is fixed (tests); otherwise the file on disk is followed. */
  constructor(private readonly fixed?: AgentMandate) {}

  /** The gateway boundary speaks the unified-action wire form. */
  async evaluateUnifiedAction(wireAction: unknown): Promise<GatewayDecision> {
    let decision;
    let action;
    let mandate;
    try {
      action = UnifiedActionSchema.parse(wireAction);
      mandate = this.fixed ?? loadEmbeddedMandate();
    } catch {
      return { outcome: "BLOCK", violatedRuleIds: ["invalid.action"] };
    }
    try {
      if (process.env.SWARAJ_Z3_CROSSCHECK === "0") {
        decision = evaluateParsedMandate(mandate, action);
      } else {
        const checked = await crossCheckMandateDecision(mandate, action);
        if (!checked.agree) return { outcome: "BLOCK", violatedRuleIds: ["engine.disagreement"] };
        decision = checked.decision;
      }
    } catch {
      return { outcome: "BLOCK", violatedRuleIds: ["engine.disagreement"] };
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
