import assert from "node:assert/strict";
import test from "node:test";
import { LocalKeySigner } from "@swaraj/crypto";
import {
  CapabilityError,
  computeAmountOutMinimum,
  createBaseUniswapExecutionAdapter,
  createCapabilityService,
  createMemoryCapabilityStore,
  createMemoryReservationStore,
} from "../dist/index.js";

const HASH = (n) => "0x" + String(n).repeat(64);
const KEY = "0x" + "11".repeat(32);
const ASSET_IN = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const ASSET_OUT = "0x4200000000000000000000000000000000000006";
const ROUTER = "0x2626664c2603336e57b271c5c0b26f421741e481";
const WALLET = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const SWAP_TX = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const APPROVE_TX = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

test("computeAmountOutMinimum applies limitPrice and slippage", () => {
  // 50e6 in * 4e14 out-per-1e18-in / 1e18 = 20_000 expected; 50 bps → 19_900
  assert.equal(computeAmountOutMinimum("50000000", "400000000000000", 50), 19_900n);
  assert.throws(() => computeAmountOutMinimum("01", "1", 0), CapabilityError);
});

test("Base Uniswap adapter swaps after capability verify and approve", async () => {
  const svc = createCapabilityService({
    capabilities: createMemoryCapabilityStore(),
    reservations: createMemoryReservationStore(),
  });
  const signer = new LocalKeySigner(KEY);
  const issued = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(1),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_base_1",
      amount: "50000000",
      budgetLimit: "100000000",
      now: 1_000,
    },
    signer,
  );

  const calls = [];
  const publicClient = {
    readContract: async ({ functionName }) => {
      calls.push(`read:${functionName}`);
      if (functionName === "allowance") return 0n;
      throw new Error(`unexpected read ${functionName}`);
    },
    waitForTransactionReceipt: async ({ hash }) => {
      calls.push(`wait:${hash}`);
      return { status: "success", transactionHash: hash };
    },
  };

  const walletClient = {
    account: { address: WALLET, type: "json-rpc" },
    writeContract: async ({ functionName }) => {
      calls.push(`write:${functionName}`);
      assert.equal(functionName, "approve");
      return APPROVE_TX;
    },
    sendTransaction: async ({ to, data }) => {
      calls.push("sendTransaction");
      assert.equal(to, ROUTER);
      assert.match(data, /^0x/);
      return SWAP_TX;
    },
  };

  const adapter = createBaseUniswapExecutionAdapter(svc, {
    publicClient,
    walletClient,
    routerAddress: ROUTER,
    feeTier: 500,
  });

  const exec = await adapter.execute({
    token: issued.token,
    intentHash: HASH(1),
    policyHash: HASH(2),
    accountRef: HASH("a"),
    now: 1_010,
    trade: {
      assetIn: ASSET_IN,
      assetOut: ASSET_OUT,
      amount: "50000000",
      maxSlippageBps: 50,
      limitPrice: "400000000000000",
    },
  });

  assert.equal(exec.txHash, SWAP_TX);
  assert.equal(exec.venue, "UNISWAP_V3_BASE");
  assert.deepEqual(calls, [
    "read:allowance",
    "write:approve",
    `wait:${APPROVE_TX}`,
    "sendTransaction",
    `wait:${SWAP_TX}`,
  ]);

  await assert.rejects(
    () =>
      adapter.execute({
        token: issued.token,
        intentHash: HASH(1),
        policyHash: HASH(2),
        accountRef: HASH("a"),
        now: 1_020,
        trade: {
          assetIn: ASSET_IN,
          assetOut: ASSET_OUT,
          amount: "50000000",
          maxSlippageBps: 50,
          limitPrice: "400000000000000",
        },
      }),
    CapabilityError,
  );
});

test("Base Uniswap adapter requires trade fields", async () => {
  const svc = createCapabilityService({
    capabilities: createMemoryCapabilityStore(),
    reservations: createMemoryReservationStore(),
  });
  const signer = new LocalKeySigner(KEY);
  const issued = await svc.issue(
    {
      applicationId: "app_demo",
      intentHash: HASH(1),
      policyHash: HASH(2),
      accountRef: HASH("a"),
      idempotencyKey: "idem_base_2",
      amount: "10",
      budgetLimit: "100",
      now: 1_000,
    },
    signer,
  );

  const adapter = createBaseUniswapExecutionAdapter(svc, {
    publicClient: {
      readContract: async () => 0n,
      waitForTransactionReceipt: async () => ({ status: "success" }),
    },
    walletClient: {
      account: { address: WALLET, type: "json-rpc" },
      writeContract: async () => APPROVE_TX,
      sendTransaction: async () => SWAP_TX,
    },
  });

  await assert.rejects(
    () =>
      adapter.execute({
        token: issued.token,
        intentHash: HASH(1),
        policyHash: HASH(2),
        accountRef: HASH("a"),
      }),
    /requires trade fields/,
  );
});
