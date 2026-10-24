type ObjectValue = Record<string, unknown>;

export function preflightTradeProof(input: {
  receipt: ObjectValue;
  artifact: ObjectValue;
  expectedPublicInputs: string;
  expectedImageId: string;
}): { intentHash: unknown; policyHash: unknown; evidenceRoot: unknown } {
  const { receipt, artifact } = input;
  if (receipt.status !== "PENDING") throw new Error("receipt is not pending");
  if (artifact.localVerified !== true) throw new Error("SP1 proof was not locally verified");
  if (artifact.claimScope !== "TRADE_RECEIPT_V1") throw new Error("claim scope mismatch");
  if (artifact.imageId !== input.expectedImageId) throw new Error("program verification key mismatch");
  if (artifact.pubInputs !== input.expectedPublicInputs) throw new Error("public inputs mismatch");
  if (artifact.receiptId !== undefined && artifact.receiptId !== object(receipt.signedReceipt).receiptId) {
    throw new Error("receipt binding mismatch");
  }
  return {
    intentHash: receipt.intentHash,
    policyHash: receipt.policyHash,
    evidenceRoot: receipt.evidenceRoot,
  };
}

function object(value: unknown): ObjectValue {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ObjectValue
    : {};
}
