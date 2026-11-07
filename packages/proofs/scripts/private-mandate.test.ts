import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { evaluateMandate } from "@swaraj/rules";
import { mandateCommitment, privateStatement, runPrivateMandate } from "../dist/private-mandate.js";

/** Keeps the Rust guest and @swaraj/rules in agreement. Opt-in: set SWARAJ_SP1_HOST_BIN and SWARAJ_SP1_PRIVATE_ELF. */

const hostBin = process.env.SWARAJ_SP1_HOST_BIN ?? "";
const elfPath = process.env.SWARAJ_SP1_PRIVATE_ELF ?? "";
const skip = hostBin && elfPath ? false : "set SWARAJ_SP1_HOST_BIN and SWARAJ_SP1_PRIVATE_ELF";

const rule = (ruleId: string, effect: string, action: string, predicates: unknown[] = []) => ({ ruleId, effect, action, predicates });
const amount = (operator: string, value: string) => ({ field: "context.amount", operator, value });
const mandate = (rules: unknown[], extra: Record<string, unknown> = {}) => ({
  mandateId: "hidden",
  version: 1,
  agent: "*",
  defaultEffect: "DENY",
  validFrom: 0,
  validUntil: 4102444800000,
  rules,
  ...extra,
});
const common = {
  intentId: "i",
  agent: "agent:a",
  policyHash: `0x${"9".repeat(64)}`,
  timestamp: 1790000000000,
  expiry: 1790000300000,
  idempotencyKey: "k",
  signature: `0x${"00".repeat(65)}`,
};
const payment = (value: string) => ({
  ...common,
  action: "PAYMENT",
  resource: { service: "near_transfer" },
  context: { amount: value, currency: "NEAR", recipient: "v.testnet" },
});
const appAction = (params: Record<string, unknown>) => ({
  ...common,
  action: "APP_ACTION",
  resource: { app: "defi", target: "pool" },
  context: { name: "swap", params },
});
const HUGE = "340282366920938463463374607431768211456";

const cases: Array<[string, unknown, unknown]> = [
  ["permit", mandate([rule("a", "PERMIT", "PAYMENT")]), payment("5")],
  ["no permit", mandate([]), payment("5")],
  ["wrong action", mandate([rule("a", "PERMIT", "DEPLOY")]), payment("5")],
  ["forbid wins", mandate([rule("a", "FORBID", "PAYMENT"), rule("b", "PERMIT", "PAYMENT")]), payment("5")],
  ["approval stops it", mandate([rule("a", "PERMIT", "PAYMENT"), rule("b", "REQUIRE_APPROVAL", "PAYMENT")]), payment("5")],
  ["at the cap", mandate([rule("a", "FORBID", "PAYMENT", [amount("GT", "100")]), rule("b", "PERMIT", "PAYMENT")]), payment("100")],
  ["over the cap", mandate([rule("a", "FORBID", "PAYMENT", [amount("GT", "100")]), rule("b", "PERMIT", "PAYMENT")]), payment("101")],
  ["over 64 bits", mandate([rule("a", "FORBID", "PAYMENT", [amount("GT", "18446744073709551616")]), rule("b", "PERMIT", "PAYMENT")]), payment(HUGE)],
  ["under 64 bits", mandate([rule("a", "PERMIT", "PAYMENT", [amount("LT", HUGE)])]), payment("9")],
  ["in list", mandate([rule("a", "PERMIT", "PAYMENT", [{ field: "context.currency", operator: "IN", values: ["NEAR", "USDC"] }])]), payment("1")],
  ["not in list", mandate([rule("a", "PERMIT", "PAYMENT", [{ field: "context.currency", operator: "IN", values: ["USD"] }])]), payment("1")],
  ["outside the window", mandate([rule("a", "PERMIT", "PAYMENT")], { validUntil: 1000 }), payment("1")],
  ["wrong agent", mandate([rule("a", "PERMIT", "PAYMENT")], { agent: "agent:other" }), payment("1")],
  ["integer param", mandate([rule("a", "PERMIT", "APP_ACTION", [{ field: "context.param", name: "n", operator: "LTE", value: "5" }])]), appAction({ n: "5" })],
  ["param type mismatch", mandate([rule("a", "PERMIT", "APP_ACTION", [{ field: "context.param", name: "n", operator: "EQ", value: "5" }])]), appAction({ n: "five" })],
  ["string param", mandate([rule("a", "PERMIT", "APP_ACTION", [{ field: "context.paramString", name: "s", operator: "EQ", value: "x" }])]), appAction({ s: "x" })],
  ["bool param", mandate([rule("a", "PERMIT", "APP_ACTION", [{ field: "context.paramBool", name: "b", operator: "EQ", value: true }])]), appAction({ b: true })],
  ["missing param", mandate([rule("a", "PERMIT", "APP_ACTION", [{ field: "context.paramString", name: "s", operator: "EQ", value: "x" }])]), appAction({})],
];

test("the Rust guest and the rules engine agree, and only ALLOW yields a statement", { skip }, async () => {
  for (const [name, mandateValue, action] of cases) {
    const allowed = evaluateMandate(mandateValue, action).decision === "ALLOW";
    const input = { mandateJson: JSON.stringify(mandateValue), actionJson: JSON.stringify(action), salt: "salt" };
    const statement = await runPrivateMandate(input, { hostBin, elfPath });
    assert.equal(statement !== undefined, allowed, name);
    if (allowed) assert.equal(statement, privateStatement(input), name);
  }
});

test("the commitment hides the mandate behind the salt", () => {
  const mandateJson = JSON.stringify(mandate([]));
  assert.notEqual(mandateCommitment({ mandateJson, salt: "a" }), mandateCommitment({ mandateJson, salt: "b" }));
  assert.equal(mandateCommitment({ mandateJson, salt: "a" }), mandateCommitment({ mandateJson, salt: "a" }));
});

test("the Groth16 fixture proves the input's statement and carries nothing private", () => {
  const dir = new URL("../fixtures/", import.meta.url);
  const input = JSON.parse(readFileSync(new URL("private-mandate-input.json", dir), "utf8"));
  const proof = readFileSync(new URL("private-mandate-groth16.proof", dir)).toString("latin1");
  assert.ok(proof.includes(privateStatement(input)));
  for (const secret of [input.salt, "mandateJson", "forbid_cap"]) assert.ok(!proof.includes(secret), secret);
});
