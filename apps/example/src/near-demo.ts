/**
 * NEAR demo: every scene goes through the running Swaraj API, so decisions,
 * capabilities, execution, evidence and receipts are all the real path.
 *
 *   pnpm --filter @swaraj/example near-demo -- --scene=all
 *
 * Needs a running API (SWARAJ_URL, SWARAJ_DEV_TOKEN) with DATABASE_URL set, or
 * no receipt is stored. Without NEAR credentials on the API the scenes use
 * fixtures, which end at cant_prove. `live.allow` / `live.block` need
 * NEAR_ACCOUNT_ID and NEAR_PRIVATE_KEY on the API; live.allow sends real funds.
 */
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = (process.env.SWARAJ_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const token = process.env.SWARAJ_DEV_TOKEN ?? "";
const recipient = process.env.NEAR_DEMO_RECIPIENT ?? "vendor.testnet";
const proofWaitMs = Number(process.env.NEAR_DEMO_PROOF_WAIT_MS ?? 30_000);
const fixtures = join(dirname(fileURLToPath(import.meta.url)), "../../../packages/contracts/fixtures");
const scene = process.argv.find((a) => a.startsWith("--scene="))?.slice("--scene=".length) ?? "all";
const ONE_MILLI_NEAR = "1000000000000000000000";
const OVER_LIVE_CAP = "10000000000000000000001";

type Result = {
  decision?: string;
  productStatus?: string;
  receiptId?: string;
  mandate?: { reason?: string; matchedRuleIds?: string[]; matchedPermitRuleIds?: string[] };
  execution?: { live?: boolean; nearTx?: string; reason?: string };
  error?: string;
};

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return (await response.json()) as T;
}

function common() {
  const now = Date.now();
  return {
    intentId: `intent_${randomUUID().slice(0, 12)}`,
    agent: "agent:near",
    policyHash: `0x${"3".repeat(64)}`,
    timestamp: now,
    expiry: now + 300_000,
    idempotencyKey: `near_${randomUUID()}`,
    signature: `0x${"22".repeat(65)}`,
  };
}

const trade = (amount: string) => ({
  ...common(),
  action: "SPOT_TRADE",
  resource: { venue: "REF_FINANCE_NEAR" },
  context: { amount, assetIn: "usdc.near", assetOut: "wrap.near", slippageBps: 50 },
});

const payment = (amount: string) => ({
  ...common(),
  action: "PAYMENT",
  resource: { service: "near_ft_transfer" },
  context: { amount, currency: "USDC", recipient },
});

const livePayment = (amount: string) => ({
  ...common(),
  action: "PAYMENT",
  resource: { service: "near_transfer" },
  context: { amount, currency: "NEAR", recipient },
});

async function registerMandate(applicationId: string, file: string): Promise<void> {
  const mandate = JSON.parse(readFileSync(join(fixtures, file), "utf8")) as unknown;
  await api("POST", `/v1/applications/${applicationId}/mandates`, mandate);
}

/** Waits for the proof worker; a receipt that stays allowed is reported as such. */
async function settledStatus(applicationId: string, result: Result): Promise<string | undefined> {
  if (result.receiptId === undefined || result.productStatus !== "allowed") return result.productStatus;
  const deadline = Date.now() + proofWaitMs;
  while (Date.now() < deadline) {
    const receipt = await api<Result>("GET", `/v1/applications/${applicationId}/receipts/${result.receiptId}`);
    if (receipt.productStatus !== "allowed") return receipt.productStatus;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return "allowed";
}

async function run(applicationId: string, label: string, action: unknown, expected: "ALLOW" | "BLOCK"): Promise<void> {
  console.log(`\n[near-agent] ${label}`);
  const result = await api<Result>("POST", `/v1/applications/${applicationId}/unified-actions`, { action });
  const productStatus = await settledStatus(applicationId, result);
  console.log({
    decision: result.decision,
    reason: result.mandate?.reason,
    rules: result.mandate?.matchedRuleIds ?? result.mandate?.matchedPermitRuleIds,
    receiptId: result.receiptId,
    live: result.execution?.live,
    nearTx: result.execution?.nearTx,
    executionNote: result.execution?.reason,
    productStatus,
  });
  if (result.decision !== expected) {
    console.error(`FAIL: expected ${expected}, got ${result.decision ?? result.error}`);
    process.exitCode = 1;
  }
}

const wants = (name: string) => scene === name || scene === "all";
const isLive = scene.startsWith("live.");

if (token.length === 0) throw new Error("SWARAJ_DEV_TOKEN must be set");
console.log(`NEAR DEMO via ${baseUrl} — scene=${scene}`);

if (isLive) {
  await registerMandate("app_near_live", "near-mandate-live.json");
  if (scene === "live.allow") {
    await run("app_near_live", `Send 0.001 NEAR to ${recipient}. Expect ALLOW.`, livePayment(ONE_MILLI_NEAR), "ALLOW");
  }
  if (scene === "live.block") {
    await run("app_near_live", "Send just over the 0.01 NEAR cap. Expect BLOCK.", livePayment(OVER_LIVE_CAP), "BLOCK");
  }
} else {
  await registerMandate("app_near_demo", "near-mandate-combined.json");
  if (wants("trade.allow")) await run("app_near_demo", "Within-policy trade (50e6). Expect ALLOW.", trade("50000000"), "ALLOW");
  if (wants("trade.block")) await run("app_near_demo", "Over-limit trade (100e6+1). Expect BLOCK.", trade("100000001"), "BLOCK");
  if (wants("payment.allow")) await run("app_near_demo", "Within-policy payment (1e6). Expect ALLOW.", payment("1000000"), "ALLOW");
  if (wants("payment.block")) await run("app_near_demo", "Over-limit payment (5e6+1). Expect BLOCK.", payment("5000001"), "BLOCK");
}

console.log(process.exitCode ? "\n[near-agent] One or more scenes failed." : "\n[near-agent] All requested scenes passed.");
