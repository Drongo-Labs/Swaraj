/** One-time live.trade setup: registers the account and wraps 0.1 NEAR. Spends about 0.475 NEAR. */
import { prepareNearSwapAccount } from "../execution.js";

const accountId = process.env.NEAR_ACCOUNT_ID;
const privateKey = process.env.NEAR_PRIVATE_KEY;
if (!accountId || !privateKey) throw new Error("NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY must be set");

await prepareNearSwapAccount({
  rpcUrl: process.env.NEAR_RPC_URL ?? "https://test.rpc.fastnear.com",
  accountId,
  privateKey,
  tokens: ["wrap.testnet", "ref.fakes.testnet"],
  refContract: process.env.NEAR_REF_CONTRACT ?? "ref-finance-101.testnet",
  wrapContract: "wrap.testnet",
  wrapAmount: 100_000_000_000_000_000_000_000n,
});
console.log(`${accountId} is ready to swap`);
