import {
  UnifiedActionSchema,
  type AgentMandate,
  type MandatePredicate,
  type MandateRule,
} from "@swaraj/schemas";
import { evaluateParsedMandate, ruleMatches } from "./index.js";

/** Static checks and behavioural diffs for a mandate, run before it goes live. */

export type MandateIssue = {
  code: "NO_PERMIT" | "CONTRADICTORY_RULE" | "SHADOWED_PERMIT" | "DUPLICATE_RULE";
  ruleId?: string;
  message: string;
};

type NumericPredicate = Extract<MandatePredicate, { value: number | bigint }>;

const predicateKey = (p: MandatePredicate) => `${p.field}:${"name" in p ? p.name : ""}`;
const isNumeric = (p: MandatePredicate): p is NumericPredicate =>
  "value" in p && (typeof p.value === "number" || typeof p.value === "bigint");

/** Integer bounds [low, high] a set of numeric predicates on one field allows; high undefined means unbounded. */
function numericallyEmpty(predicates: NumericPredicate[]): boolean {
  let low = 0n;
  let high: bigint | undefined;
  for (const p of predicates) {
    const value = BigInt(p.value);
    const atLeast = p.operator === "GT" ? value + 1n : p.operator === "GTE" || p.operator === "EQ" ? value : undefined;
    const atMost = p.operator === "LT" ? value - 1n : p.operator === "LTE" || p.operator === "EQ" ? value : undefined;
    if (atLeast !== undefined && atLeast > low) low = atLeast;
    if (atMost !== undefined && (high === undefined || atMost < high)) high = atMost;
  }
  return high !== undefined && low > high;
}

/** True when no action can satisfy every predicate of the rule. */
export function ruleCanNeverMatch(rule: MandateRule): boolean {
  const byField = new Map<string, MandatePredicate[]>();
  for (const predicate of rule.predicates) {
    const key = predicateKey(predicate);
    byField.set(key, [...(byField.get(key) ?? []), predicate]);
  }
  for (const predicates of byField.values()) {
    const numeric = predicates.filter(isNumeric);
    if (numeric.length > 0 && numericallyEmpty(numeric)) return true;
    let allowed: Set<unknown> | undefined;
    for (const p of predicates) {
      if (isNumeric(p)) continue;
      const values = new Set<unknown>("values" in p ? p.values : [p.value]);
      allowed = allowed === undefined ? values : new Set([...allowed].filter((v) => values.has(v)));
    }
    if (allowed !== undefined && allowed.size === 0) return true;
  }
  return false;
}

function jsonKey(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) => (typeof v === "bigint" ? v.toString() : v));
}

export function lintMandate(mandate: AgentMandate): MandateIssue[] {
  const issues: MandateIssue[] = [];
  if (!mandate.rules.some((rule) => rule.effect !== "FORBID" && !ruleCanNeverMatch(rule))) {
    issues.push({ code: "NO_PERMIT", message: "no rule can permit anything, so every action is blocked" });
  }
  const seen = new Map<string, string>();
  for (const rule of mandate.rules) {
    if (ruleCanNeverMatch(rule)) {
      issues.push({ code: "CONTRADICTORY_RULE", ruleId: rule.ruleId, message: "its predicates can never all hold" });
    }
    const key = jsonKey([rule.effect, rule.action, rule.predicates.map(jsonKey).sort()]);
    const first = seen.get(key);
    if (first !== undefined) {
      issues.push({ code: "DUPLICATE_RULE", ruleId: rule.ruleId, message: `same effect and conditions as ${first}` });
    } else {
      seen.set(key, rule.ruleId);
    }
    if (
      rule.effect === "PERMIT" &&
      mandate.rules.some((other) => other.effect === "FORBID" && other.action === rule.action && other.predicates.length === 0)
    ) {
      issues.push({ code: "SHADOWED_PERMIT", ruleId: rule.ruleId, message: `a forbid with no conditions blocks every ${rule.action}` });
    }
  }
  return issues;
}

type Wire = Record<string, unknown> & { resource: Record<string, unknown>; context: Record<string, unknown> };

const SIGNATURE = `0x${"00".repeat(65)}`;
const OTHER = "other-value";
const COMMIT = "a".repeat(40);

function baseWire(action: MandateRule["action"]): Wire {
  const shared = {
    intentId: "diff_probe",
    policyHash: `0x${"00".repeat(32)}`,
    idempotencyKey: "diff_probe",
    signature: SIGNATURE,
  };
  switch (action) {
    case "SPOT_TRADE":
      return { ...shared, action, resource: { venue: OTHER }, context: { amount: "1", assetIn: "asset-in", assetOut: "asset-out", slippageBps: 1 } };
    case "PAYMENT":
      return { ...shared, action, resource: { service: OTHER }, context: { amount: "1", currency: "XXX", recipient: OTHER } };
    case "DEPLOY":
      return { ...shared, action, resource: { repo: OTHER }, context: { branch: OTHER, commitHash: COMMIT, environment: "DEVELOPMENT" } };
    case "DELETE":
      return { ...shared, action, resource: { service: OTHER, objectType: "FILE", objectId: OTHER }, context: { hardDelete: false } };
    case "REFUND":
      return { ...shared, action, resource: { service: OTHER }, context: { amount: "1", currency: "XXX", recipient: OTHER, originalPaymentId: OTHER } };
    case "APP_ACTION":
      return { ...shared, action, resource: { app: OTHER, target: OTHER }, context: { name: "other", params: {} } };
  }
}

function assign(wire: Wire, key: string, value: unknown): Wire {
  const [field, name] = key.split(":") as [string, string];
  const next: Wire = { ...wire, resource: { ...wire.resource }, context: { ...wire.context } };
  if (field.startsWith("context.param")) {
    next.context.params = { ...(next.context.params as Record<string, unknown>), [name]: value };
  } else if (field.startsWith("resource.")) {
    next.resource[field.slice("resource.".length)] = value;
  } else if (field.startsWith("context.")) {
    next.context[field.slice("context.".length)] = value;
  } else {
    next[field] = value;
  }
  return next;
}

/** Values that cross every boundary a predicate can draw on its field. */
function boundaryValues(p: MandatePredicate): unknown[] {
  if ("values" in p) return p.values;
  if (typeof p.value === "bigint") return [p.value, p.value + 1n, ...(p.value > 0n ? [p.value - 1n] : [])].map(String);
  if (typeof p.value === "number") return [p.value, p.value + 1, ...(p.value > 0 ? [p.value - 1] : [])];
  return [p.value];
}

export type MandateDiff = {
  /** True when every combination of boundary values was checked. */
  complete: boolean;
  checked: number;
  newlyAllowed: unknown[];
  newlyBlocked: unknown[];
  newlyNeedsApproval: unknown[];
  rulesAdded: string[];
  rulesRemoved: string[];
  rulesChanged: string[];
  /** Mandate-level fields that changed: agent, validity window, signer. */
  scopeChanged: string[];
};

const MAX_PROBES_PER_ACTION = 20_000;
const MAX_EXAMPLES = 5;

/**
 * What a mandate edit changes. Each predicate splits its field at known
 * boundaries, so probing the boundaries of every field, plus a value no rule
 * mentions, covers all behaviour; `complete` is false if the cap cut that short.
 */
export function diffMandates(before: AgentMandate, after: AgentMandate): MandateDiff {
  const oldRules = new Map(before.rules.map((rule) => [rule.ruleId, jsonKey(rule)]));
  const newRules = new Map(after.rules.map((rule) => [rule.ruleId, jsonKey(rule)]));
  const diff: MandateDiff = {
    complete: true,
    checked: 0,
    newlyAllowed: [],
    newlyBlocked: [],
    newlyNeedsApproval: [],
    rulesAdded: [...newRules.keys()].filter((id) => !oldRules.has(id)),
    rulesRemoved: [...oldRules.keys()].filter((id) => !newRules.has(id)),
    rulesChanged: [...newRules.keys()].filter((id) => oldRules.has(id) && oldRules.get(id) !== newRules.get(id)),
    scopeChanged: (["agent", "agentSigner", "programCertifier", "validFrom", "validUntil"] as const).filter((key) => before[key] !== after[key]),
  };

  const timestamp = Math.min(
    Math.max(before.validFrom, after.validFrom),
    Math.min(before.validUntil, after.validUntil) - 1,
  );
  const agent = after.agent !== "*" ? after.agent : before.agent !== "*" ? before.agent : "agent:probe";
  const rules = [...before.rules, ...after.rules];

  for (const action of new Set(rules.map((rule) => rule.action))) {
    const domains = new Map<string, Set<unknown>>();
    for (const rule of rules.filter((r) => r.action === action)) {
      for (const predicate of rule.predicates) {
        const key = predicateKey(predicate);
        const values = domains.get(key) ?? new Set<unknown>();
        for (const value of boundaryValues(predicate)) values.add(value);
        domains.set(key, values);
      }
    }
    const start = assign(assign(assign(baseWire(action), "timestamp:", timestamp), "expiry:", timestamp + 1), "agent:", agent);
    let wires: Wire[] = [start];
    for (const [key, values] of domains) {
      const next: Wire[] = [];
      for (const wire of wires) {
        next.push(wire); // the value no rule mentions
        for (const value of values) next.push(assign(wire, key, value));
      }
      wires = next;
      if (wires.length > MAX_PROBES_PER_ACTION) {
        wires = wires.slice(0, MAX_PROBES_PER_ACTION);
        diff.complete = false;
      }
    }
    for (const wire of wires) {
      const parsed = UnifiedActionSchema.safeParse(wire);
      if (!parsed.success) continue;
      diff.checked += 1;
      const was = evaluateParsedMandate(before, parsed.data).decision;
      const now = evaluateParsedMandate(after, parsed.data).decision;
      if (was === now) continue;
      const list = now === "ALLOW" ? diff.newlyAllowed : now === "BLOCK" ? diff.newlyBlocked : diff.newlyNeedsApproval;
      if (list.length < MAX_EXAMPLES) {
        const { resource, context } = wire;
        list.push({ action, resource, context });
      }
    }
  }
  return diff;
}

