import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluateMandate } from "@swaraj/rules";
import { parseUnifiedAction, serializeUnifiedAction } from "@swaraj/schemas";
import { nearReceiptId, payoutAction, settleMatch, type SettleDeps } from "../src/swaraj/settle.js";

const zunno = {
  swarajApiUrl: "http://api.test",
  applicationId: "zunno",
  agentId: "zunno-agent",
  gameAddress: "0x82b2cce9a52c7e56838a5c46833067f9eb006911",
  buyInCapWei: "10000000000000000",
  signature: `0x${"00".repeat(65)}`,
};
const config = { escrow: "escrow.testnet", refereeAccountId: "ref.testnet", refereePrivateKey: "x", rpcUrl: "x", apiToken: "t".repeat(32) };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

/** A fake Swaraj API: allows the payout, answers 409 until the receipt is proved. */
function deps(opts: { decision?: string; pot?: string; pendingPolls?: number } = {}) {
  let submitted: Record<string, unknown> | undefined;
  let polls = 0;
  const paid: Parameters<SettleDeps["payout"]>[0][] = [];
  const d: SettleDeps = {
    pot: async () => opts.pot ?? "200",
    payout: async (args) => {
      paid.push(args);
      return "TXHASH";
    },
    sleep: async () => {},
    fetchImpl: (async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/unified-actions")) {
        submitted = (JSON.parse(String(init?.body)) as { action: Record<string, unknown> }).action;
        return json({ decision: opts.decision ?? "ALLOW", receiptId: "rcpt-1" });
      }
      if (url.endsWith("/receipts/rcpt-1/bundle")) {
        if (polls++ < (opts.pendingPolls ?? 1)) return json({ error: "receipt_not_proved" }, 409);
        return json({ statementId: "stmt_abc", statementText: "swaraj/statement/mandate/v1\ndecision=ALLOW", action: submitted });
      }
      throw new Error(`unexpected ${url}`);
    }) as typeof fetch,
  };
  return { d, paid, submitted: () => submitted };
}

test("a match settles only after the payout's receipt is proved, with the proved action", async () => {
  const { d, paid, submitted } = deps({ pendingPolls: 2 });
  const events: string[] = [];
  const result = await settleMatch(zunno, config, "winner.testnet", d, (e) => events.push(e.kind));
  assert.deepEqual(events, ["submitted", "paid"]);
  assert.equal(result.txHash, "TXHASH");
  assert.equal(paid.length, 1);
  const action = submitted()!;
  assert.deepEqual(action.context, { name: "payout", params: { winner: "winner.testnet", amount: "200" } });
  assert.deepEqual(action.resource, { app: "zunno", target: "escrow.testnet" });
  assert.deepEqual(paid[0], {
    winner: "winner.testnet",
    receipt_id: nearReceiptId("stmt_abc"),
    statement: "swaraj/statement/mandate/v1\ndecision=ALLOW",
    action_wire: serializeUnifiedAction(parseUnifiedAction(action)),
  });
});

test("a payout the mandate blocks pays nothing", async () => {
  const { d, paid } = deps({ decision: "BLOCK" });
  await assert.rejects(settleMatch(zunno, config, "winner.testnet", d), /did not allow the payout/);
  assert.equal(paid.length, 0);
});

test("an empty escrow submits nothing", async () => {
  const { d, submitted } = deps({ pot: "0" });
  await assert.rejects(settleMatch(zunno, config, "winner.testnet", d), /no wagers/);
  assert.equal(submitted(), undefined);
});

test("the Zunno mandate allows a payout, and still blocks anything else", () => {
  const mandate = JSON.parse(readFileSync(new URL("../mandate/zunno-mandate.json", import.meta.url), "utf8"));
  const now = mandate.validFrom + 1000;
  const payout = payoutAction(zunno, "escrow.testnet", "winner.testnet", "200", now);
  assert.equal(evaluateMandate(mandate, payout).decision, "ALLOW");
  const unknown = { ...payout, context: { name: "drain", params: { amount: "200" } } };
  assert.equal(evaluateMandate(mandate, unknown).decision, "BLOCK");
});
