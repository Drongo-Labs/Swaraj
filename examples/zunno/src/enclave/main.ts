import { startServer } from "../server/http.js";

/**
 * The rules engine process. Locally `pnpm play` starts it; on a TDX VM it runs
 * alone. Env: ZUNNO_AGENT_TOKEN (32+ chars), PORT, ZUNNO_HOST.
 */

const agentToken = process.env.ZUNNO_AGENT_TOKEN ?? "";
const { url } = await startServer({
  port: Number(process.env.PORT ?? 3002),
  agentToken,
  ...(process.env.ZUNNO_HOST ? { host: process.env.ZUNNO_HOST } : {}),
});
console.log(`enclave ready ${url}`);
