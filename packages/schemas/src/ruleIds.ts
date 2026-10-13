/**
 * Stable numeric IDs for every policy constraint. Used by unsat cores (Phase 4) and Phase 9.
 * Never renumber or reuse an ID; append new rules at the end.
 */
export const RuleId = {
  VENUE_ALLOWED: 1,
  ASSET_ALLOWED: 2,
  MAX_AMOUNT_PER_ACTION: 3,
  POSITION_CAP: 4,
  DAILY_TURNOVER_CAP: 5,
  SLIPPAGE_CAP: 6,
  RESERVE_REQUIREMENT: 7,
  QUOTE_FRESHNESS: 8,
  COOLDOWN: 9,
  POLICY_EXPIRY: 10,
  POLICY_NOT_PAUSED: 11,
  INTENT_EXPIRY: 12,
  POLICY_VERSION_MATCH: 13,
  FINALITY_RULE: 14,
} as const;
export type RuleId = (typeof RuleId)[keyof typeof RuleId];
