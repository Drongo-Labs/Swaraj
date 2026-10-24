type ObjectValue = Record<string, unknown>;

export function preflightDecisionProof(input: {
  decisionReceipt: ObjectValue;
  artifact: ObjectValue;
  expectedPublicInputs: string;
  expectedImageId: string;
}): { provedRules: number[] } {
  const { decisionReceipt, artifact } = input;
  if (decisionReceipt.status !== "PENDING") throw new Error("decision receipt is not pending");
  if (decisionReceipt.solverStatus !== "sat" && decisionReceipt.solverStatus !== "unsat") {
    throw new Error("decision is not provable");
  }
  if (artifact.localVerified !== true) throw new Error("SP1 proof was not locally verified");
  if (artifact.claimScope !== "BLOCK_DECISION_V1") throw new Error("claim scope mismatch");
  if (artifact.imageId !== input.expectedImageId) throw new Error("program verification key mismatch");
  if (artifact.pubInputs !== input.expectedPublicInputs) throw new Error("public inputs mismatch");
  const provedRules = Array.isArray(decisionReceipt.violatedRuleIds)
    ? decisionReceipt.violatedRuleIds.filter((value): value is number => typeof value === "number")
    : [];
  if (provedRules.length === 0) throw new Error("BLOCK decision has no violated rules");
  return { provedRules };
}
