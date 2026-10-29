/** Shared bounded mandate space: the 14-rule pool, the 17-action domain, and
 * the subset enumeration — used by the exhaustive harness and the Z3
 * cross-check so both engines are verified over the exact same space. */
export const now = 1_790_000_000_000;
export const mandateWindow = { validFrom: now - 1_000_000, validUntil: now + 1_000_000 };

export const RULE_POOL = [
  { ruleId: "r00", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "resource.app", operator: "EQ", value: "zunno" }] },
  { ruleId: "r01", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.name", operator: "IN", values: ["draw_card", "move", "play_card"] }] },
  { ruleId: "r02", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.param", name: "cardValue", operator: "LTE", value: "104" }] },
  { ruleId: "r03", effect: "PERMIT", action: "APP_ACTION", predicates: [{ field: "context.paramString", name: "tableId", operator: "EQ", value: "table-42" }] },
  { ruleId: "r04", effect: "FORBID", action: "APP_ACTION", predicates: [{ field: "context.name", operator: "EQ", value: "shuffle_deck" }] },
  { ruleId: "r05", effect: "FORBID", action: "APP_ACTION", predicates: [{ field: "context.param", name: "cardValue", operator: "GT", value: "104" }] },
  { ruleId: "r06", effect: "PERMIT", action: "APP_ACTION", predicates: [] },
  { ruleId: "r07", effect: "FORBID", action: "APP_ACTION", predicates: [] },
  { ruleId: "r08", effect: "PERMIT", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "LTE", value: "10000000000000000" }] },
  { ruleId: "r09", effect: "PERMIT", action: "PAYMENT", predicates: [
    { field: "context.currency", operator: "EQ", value: "ETH" },
    { field: "context.recipient", operator: "EQ", value: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" },
  ] },
  { ruleId: "r10", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "GT", value: "10000000000000000" }] },
  { ruleId: "r11", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.currency", operator: "EQ", value: "USD" }] },
  { ruleId: "r12", effect: "PERMIT", action: "PAYMENT", predicates: [] },
  { ruleId: "r13", effect: "FORBID", action: "PAYMENT", predicates: [{ field: "context.amount", operator: "EQ", value: "10000000000000000" }] },
];

export function common(intentId) {
  return {
    intentId,
    agent: "zunno-agent",
    policyHash: `0x${"ab".repeat(32)}`,
    timestamp: now,
    expiry: now + 60_000,
    idempotencyKey: intentId,
    signature: `0x${"cd".repeat(65)}`,
  };
}

export function appAction(intentId, app, name, params) {
  return { ...common(intentId), action: "APP_ACTION", resource: { app, target: "0x82b2cce9a52c7e56838a5c46833067f9eb006911" }, context: { name, params } };
}

export function payment(intentId, amount, currency, recipient) {
  return { ...common(intentId), action: "PAYMENT", resource: { service: "zunno-stake" }, context: { amount, currency, recipient } };
}

export const ACTION_WIRES = [
  appAction("a00", "zunno", "play_card", { cardValue: "11", handIndex: "0", chosenColor: "4" }),
  appAction("a01", "zunno", "draw_card", {}),
  appAction("a02", "zunno", "shuffle_deck", {}),
  appAction("a03", "zunno", "move", {}),
  appAction("a04", "zunno", "play_card", { cardValue: "104", handIndex: "0", chosenColor: "4" }),
  appAction("a05", "zunno", "play_card", { cardValue: "105", handIndex: "0", chosenColor: "4" }),
  appAction("a06", "zunno", "play_card", { cardValue: "108", handIndex: "0", chosenColor: "4" }),
  appAction("a07", "zunno", "play_card", { cardValue: "11", tableId: "table-42" }),
  appAction("a08", "chess", "move", {}),
  appAction("a09", "chess", "play_card", { cardValue: "105" }),
  appAction("a10", "zunno", "play_card", { cardValue: "105", tableId: "table-42" }),
  payment("p00", "10000000000000000", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),
  payment("p01", "9999999999999999", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),
  payment("p02", "10000000000000001", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),
  payment("p03", "10000000000000000", "USD", "vendor@example.com"),
  payment("p04", "5000000000000", "USD", "vendor@example.com"),
  payment("p05", "0", "ETH", "0x82b2cce9a52c7e56838a5c46833067f9eb006911"),
];

/** All subsets of the rule pool with size 1..maxSize, in pool order (ids ascend). */
export function* ruleSubsets(maxSize) {
  const n = RULE_POOL.length;
  const stack = [];
  function* from(start) {
    if (stack.length >= 1 && stack.length <= maxSize) yield [...stack];
    if (stack.length === maxSize) return;
    for (let i = start; i < n; i++) {
      stack.push(RULE_POOL[i]);
      yield* from(i + 1);
      stack.pop();
    }
  }
  yield* from(0);
}
