import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { nearDeps, settleConfigFromEnv, settleMatch } from "./settle.js";

/** `pnpm settle -- <winner.testnet>`: pay the escrow's pot to the winner through a proved receipt. */

for (const file of ["../../.env", ".env"]) if (existsSync(file)) process.loadEnvFile(file);
const winner = process.argv.slice(2).find((arg) => arg !== "--");
const settle = settleConfigFromEnv();
if (!winner || !settle) {
  console.error("usage: pnpm settle -- <winner.testnet>  (needs ZUNNO_WAGER_ESCROW, ZUNNO_REFEREE_ACCOUNT_ID, ZUNNO_REFEREE_PRIVATE_KEY, SWARAJ_DEV_TOKEN)");
  process.exit(2);
}
const result = await settleMatch(loadConfig(), settle, winner, {
  ...nearDeps(settle),
  fetchImpl: fetch,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}, (event) => console.log(event.kind === "submitted"
  ? `payout allowed, receipt ${event.receiptId}; waiting for its proof on NEAR…`
  : `paid ${event.amount} yoctoNEAR to ${winner}: https://testnet.nearblocks.io/txns/${event.txHash}`));
console.log(`done: ${result.txHash}`);
