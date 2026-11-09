import { ShadeClient } from "@neardefi/shade-agent-js";

/**
 * Makes the Zunno agent a Shade Agent: its own NEAR account, registered on the
 * agent contract. In local mode the contract (`requires_tee = false`) accepts
 * a mock attestation from an agent its owner has whitelisted, so this proves
 * the on-chain identity, not that the agent runs in a TEE.
 */

export interface ShadeConfig {
  contractId: string;
  sponsorAccountId: string;
  sponsorPrivateKey: string;
  /** A secret that fixes the agent's account across runs, so it is whitelisted and funded once. */
  derivationPath: string;
}

export function shadeConfigFromEnv(env: NodeJS.ProcessEnv = process.env): ShadeConfig | undefined {
  const { SHADE_AGENT_CONTRACT_ID, SHADE_SPONSOR_ACCOUNT_ID, SHADE_SPONSOR_PRIVATE_KEY, SHADE_DERIVATION_PATH } = env;
  if (!SHADE_AGENT_CONTRACT_ID || !SHADE_SPONSOR_ACCOUNT_ID || !SHADE_SPONSOR_PRIVATE_KEY || !SHADE_DERIVATION_PATH) {
    return undefined;
  }
  return {
    contractId: SHADE_AGENT_CONTRACT_ID,
    sponsorAccountId: SHADE_SPONSOR_ACCOUNT_ID,
    sponsorPrivateKey: SHADE_SPONSOR_PRIVATE_KEY,
    derivationPath: SHADE_DERIVATION_PATH,
  };
}

export async function shadeClient(config: ShadeConfig): Promise<ShadeClient> {
  return ShadeClient.create({
    networkId: "testnet",
    agentContractId: config.contractId,
    sponsor: { accountId: config.sponsorAccountId, privateKey: config.sponsorPrivateKey },
    derivationPath: config.derivationPath,
    // ponytail: shade-agent-js 2.2.0 throws with a derivation path and one key, because
    // `[].every()` marks zero extra keys as random. One extra key avoids it; drop this once fixed upstream.
    numKeys: 2,
  });
}

/** Funds the agent if needed and registers it. Returns its account ID. */
export async function registerShadeAgent(config: ShadeConfig): Promise<string> {
  const agent = await shadeClient(config);
  const accountId = agent.accountId();
  if ((await agent.balance()) < 0.5) await agent.fund(1);
  // Local mode only: the owner approves this agent once (see the README).
  if ((await agent.isWhitelisted()) === false) {
    throw new Error(`agent ${accountId} is not whitelisted on ${config.contractId}`);
  }
  await agent.register();
  return accountId;
}
