import { randomBytes } from "node:crypto";
import { checkAttestation, type Attestation } from "../enclave/attestation.js";
import { GameSession } from "../game/session.js";
import type { AgentTable, AgentView } from "../game/table.js";
import type { ZunnoProposal } from "../actions/intents.js";
import type { ZunnoAgentConfig } from "../config.js";

/**
 * The agent process: checks where the rules engine runs, then plays its own
 * seat whenever it is its turn. With `requireTee` it refuses an engine that
 * is not in a TEE.
 */

export async function checkEnclave(enclave: URL, requireTee: boolean, fetchImpl: typeof fetch = fetch): Promise<Attestation> {
  const nonce = randomBytes(32).toString("hex");
  const response = await fetchImpl(new URL(`/attestation?nonce=${nonce}`, enclave));
  if (!response.ok) throw new Error(`attestation request failed: ${response.status}`);
  const answer = (await response.json()) as Attestation;
  const problem = checkAttestation(answer, nonce, requireTee);
  if (problem) throw new Error(problem);
  return answer;
}

export function runAgent(
  config: ZunnoAgentConfig,
  table: AgentTable,
  pickMove?: (view: AgentView) => Promise<ZunnoProposal | undefined>,
  pollMs = 300,
  policyHash?: string,
): () => Promise<void> {
  const session = new GameSession(config, table, pickMove, policyHash);
  let stopped = false;
  const done = (async () => {
    while (!stopped) {
      await session.agentTick().catch((error: unknown) => console.error("[agent]", error));
      await new Promise((resolve) => setTimeout(resolve, pollMs));
    }
  })();
  return async () => {
    stopped = true;
    await done;
  };
}
