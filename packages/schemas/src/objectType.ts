export const ObjectType = {
  ACTION_INTENT: "ACTION_INTENT",
  POLICY_PROFILE: "POLICY_PROFILE",
  STATE_SNAPSHOT: "STATE_SNAPSHOT",
  EVIDENCE_BUNDLE: "EVIDENCE_BUNDLE",
  RECEIPT: "RECEIPT",
} as const;
export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];
