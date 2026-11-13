export interface ZunnoAgentConfig {
  /** Swaraj API base URL, e.g. http://localhost:3000 */
  swarajApiUrl: string;
  /** Swaraj application id under which the mandate is registered. */
  applicationId: string;
  /** Zunno agent identifier as it appears in intents (`agent` field). */
  agentId: string;
  /** Game address the agent's stakes are pinned to (mandate resource target). */
  gameAddress: string;
  /** Mandate buy-in cap in wei (atomic decimal string). Must match the mandate fixture. */
  buyInCapWei: string;
  /** Signature hex over the intent; key registration is out of scope (see Swaraj 2.1 note). */
  signature: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ZunnoAgentConfig {
  return {
    swarajApiUrl: env.SWARAJ_API_URL ?? "http://localhost:3000",
    applicationId: env.SWARAJ_APPLICATION_ID ?? "zunno",
    agentId: env.ZUNNO_AGENT_ID ?? "zunno-agent",
    gameAddress: (env.ZUNNO_GAME_ADDRESS ?? "0x82b2cce9a52c7e56838a5c46833067f9eb006911").toLowerCase(),
    buyInCapWei: env.ZUNNO_BUY_IN_CAP_WEI ?? "10000000000000000",
    // Placeholder until agent key registration exists in Swaraj; 65 zero bytes.
    signature: env.ZUNNO_AGENT_SIGNATURE ?? `0x${"00".repeat(65)}`,
  };
}
