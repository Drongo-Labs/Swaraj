/**
 * Proof status and explorer links for the receipt endpoints, built from the durable proof-job row.
 * zkVerify and destination (Base Sepolia) links are separate and each uses its own chain's hash.
 */

export type ProofJobView = {
  state: string;
  attempts: number;
  zkverifyNetwork?: string;
  zkverifyTxHash?: string;
  zkverifyStatement?: string;
  aggregationId?: string;
  lastError?: string;
  submissionProvider?: string;
  providerJobId?: string;
  providerStatus?: string;
  providerStatusAt?: Date;
  destinationChainId?: number;
  publicationState?: string;
  publicationTxHash?: string;
  publicationError?: string;
};

const DESTINATIONS: Record<number, { name: string; explorer: string }> = {
  84532: { name: "base-sepolia", explorer: "https://sepolia.basescan.org" },
};

/** Workers always run on Volta; jobs without a recorded network predate that field and were Volta too. */
const ZKVERIFY_EXPLORERS: Record<string, string> = {
  "zkVerify-Volta": "https://zkverify-testnet.subscan.io/extrinsic",
  zkVerify: "https://zkverify.subscan.io/extrinsic",
};

export function zkVerifyExplorerUrl(network: string | undefined, txHash: string | undefined): string | undefined {
  if (!txHash) return undefined;
  const base = (process.env.SWARAJ_ZKVERIFY_EXPLORER_BASE ?? ZKVERIFY_EXPLORERS[network ?? "zkVerify-Volta"])?.replace(/\/$/, "");
  if (!base) return undefined;
  if (base.includes("subscan.io") || base.endsWith("/extrinsic")) return `${base}/${encodeURIComponent(txHash)}`;
  return `${base}${base.includes("?") ? "&" : "?"}tx=${encodeURIComponent(txHash)}`;
}

export function destinationTxUrl(chainId: number | undefined, txHash: string | undefined): string | undefined {
  const destination = chainId === undefined ? undefined : DESTINATIONS[chainId];
  return destination && txHash ? `${destination.explorer}/tx/${encodeURIComponent(txHash)}` : undefined;
}

/** Never leak the Kurier API key (it travels in request URLs) through an error message. */
export function sanitizeProofError(message: string | undefined): string | undefined {
  if (!message) return undefined;
  const key = process.env.KURIER_API_KEY?.trim();
  let text = key ? message.split(key).join("<redacted>") : message;
  text = text.replace(/(\/(?:submit-proof|job-status)\/)[^/\s"']+/g, "$1<redacted>");
  return text.slice(0, 500);
}

/**
 * Proof fields for a receipt view. Existing fields (status, attempts, network, transactionHash,
 * aggregationId, statement, kurierUrl) keep their meaning; new fields are additive.
 */
export function proofJobFields(job: ProofJobView | undefined): Record<string, unknown> {
  if (!job) return {};
  const zkVerifyUrl = zkVerifyExplorerUrl(job.zkverifyNetwork, job.zkverifyTxHash);
  const destination = job.destinationChainId === undefined ? undefined : DESTINATIONS[job.destinationChainId];
  const destinationUrl = destinationTxUrl(job.destinationChainId, job.publicationTxHash);
  const lastError = sanitizeProofError(job.lastError);
  return {
    attempts: job.attempts,
    network: job.zkverifyNetwork ?? "zkVerify-Volta",
    ...(job.zkverifyTxHash ? { transactionHash: job.zkverifyTxHash } : {}),
    ...(job.aggregationId ? { aggregationId: job.aggregationId } : {}),
    ...(job.zkverifyStatement ? { statement: job.zkverifyStatement } : {}),
    ...(job.submissionProvider ? { provider: job.submissionProvider } : {}),
    ...(job.providerJobId ? { kurierJobId: job.providerJobId } : {}),
    ...(job.providerStatus ? { kurierStatus: job.providerStatus } : {}),
    ...(job.providerStatusAt ? { statusCheckedAt: job.providerStatusAt.toISOString() } : {}),
    ...(lastError ? { lastError } : {}),
    ...(zkVerifyUrl ? { zkVerifyUrl, kurierUrl: zkVerifyUrl } : {}),
    ...(job.destinationChainId !== undefined
      ? {
          destination: {
            chainId: job.destinationChainId,
            ...(destination ? { name: destination.name } : {}),
            status: job.publicationState ?? (job.state === "FINALIZED" ? "PENDING" : "AWAITING_ZKVERIFY"),
            ...(job.publicationTxHash ? { transactionHash: job.publicationTxHash } : {}),
            ...(destinationUrl ? { url: destinationUrl } : {}),
            ...(job.publicationError ? { error: sanitizeProofError(job.publicationError) } : {}),
          },
        }
      : {}),
  };
}
