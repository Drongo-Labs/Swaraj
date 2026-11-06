/**
 * One-time setup for the live.trade scene: registers the account with the
 * token and Ref Finance contracts and wraps 0.1 NEAR. Spends real funds from
 * NEAR_ACCOUNT_ID, about 0.475 NEAR on testnet including storage deposits.
 */
import { prepareNearSwapAccount } from "@swaraj/capability";

const accountId = process.env.NEAR_ACCOUNT_ID;
const privateKey = process.env.NEAR_PRIVATE_KEY;
if (!accountId || !privateKey) throw new Error("NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY must be set");

await prepareNearSwapAccount({
  rpcUrl: process.env.NEAR_RPC_URL ?? "https://rpc.testnet.near.org",
  accountId,
  privateKey,
  tokens: ["wrap.testnet", "ref.fakes.testnet"],
  refContract: process.env.NEAR_REF_CONTRACT ?? "ref-finance-101.testnet",
  wrapContract: "wrap.testnet",
  wrapAmount: 100_000_000_000_000_000_000_000n,
});
console.log(`${accountId} is ready to swap`);
