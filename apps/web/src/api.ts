const API = import.meta.env.VITE_SWARAJ_URL ?? "";
const TOKEN =
  import.meta.env.VITE_SWARAJ_DEV_TOKEN ?? "development-test-token-at-least-32-characters";
export const APP_ID = import.meta.env.VITE_SWARAJ_APPLICATION_ID ?? "app_demo";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      detail = "";
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export type HealthView = {
  mode: string;
  live?: boolean;
  network?: string;
  chainId?: number;
  account?: string;
  phases: {
    base?: string;
    execution?: string;
    capabilityStore?: string;
    policyStore?: string;
    proofQueue?: string;
    evidenceFinality?: string;
    zkVerify?: string;
    kurier?: string;
    sp1?: string;
    lean?: string;
    autoProve?: string;
  };
};

export type LiveStateView = {
  applicationId: string;
  account: string;
  source: string;
  snapshot: {
    balances?: Array<{ asset: string; amount: string }>;
    reservedBudget?: string;
    usedDailyTurnover?: string;
    timestamp?: number;
  };
};

export type PolicyView = {
  policyId: string;
  version: number;
  status: string;
  policyHash?: string;
  definition: Record<string, unknown>;
};

export type ActionResult =
  | {
      decision: "ALLOW";
      receiptId: string;
      status: string;
      capabilityId?: string;
      intentHash?: string;
      policyHash?: string;
      proof?: { status: string; claimScope?: string; kurierUrl?: string };
      activityId?: string;
    }
  | {
      decision: "BLOCK";
      violations: Array<{ ruleId: string; reason: string }>;
      intentHash?: string;
      policyHash?: string;
      decisionReceipt?: {
        status: string;
        id?: string;
        reasonCode?: string;
        violatedRuleIds?: number[];
      };
      activityId?: string;
    };

export type ActivityItem = {
  id: string;
  at: number;
  action: string;
  idempotencyKey: string;
  decision: "ALLOW" | "BLOCK";
  intentHash?: string;
  policyHash?: string;
  violations?: Array<{ ruleId: string; reason: string }>;
  receiptId?: string;
  capabilityId?: string;
  status?: string;
  decisionReceipt?: { id?: string; status?: string };
  proof?: { status?: string; kurierUrl?: string; transactionHash?: string };
};

/** Destination publication of a Kurier aggregation (separate from zkVerify verification). */
export type ProofDestination = {
  chainId: number;
  name?: string;
  status: string;
  transactionHash?: string;
  url?: string;
  error?: string;
};

/** Proof-job fields shared by trade and Decision Receipt views. */
export type ProofJobFields = {
  attempts?: number;
  network?: string;
  transactionHash?: string;
  statement?: string;
  aggregationId?: string;
  /** Same as zkVerifyUrl; kept for older callers. */
  kurierUrl?: string;
  zkVerifyUrl?: string;
  provider?: string;
  kurierJobId?: string;
  kurierStatus?: string;
  statusCheckedAt?: string;
  lastError?: string;
  destination?: ProofDestination;
};

export type ReceiptView = {
  receiptId: string;
  status: string;
  claim?: string;
  evidenceRoot?: string;
  intentHash?: string;
  policyHash?: string;
  assumptions?: Record<string, string>;
  proof?: ProofJobFields & { status: string; reference?: string };
};

export type DecisionReceiptView = {
  id: string;
  status: string;
  violatedRuleIds: number[];
  intentHash: string;
  policyHash: string;
  decisionLogEntryHash: string;
  proof?: ProofJobFields & { status: string; claimScope?: string };
};

export function shortHash(value: string | undefined, size = 6): string {
  if (!value) return "—";
  if (value.length <= size * 2 + 4) return value;
  return `${value.slice(0, 2 + size)}…${value.slice(-size)}`;
}

export function formatAtomicUsdc(value: unknown): string {
  if (value === undefined || value === null) return "—";
  const raw = String(value);
  if (!/^\d+$/.test(raw)) return raw;
  try {
    const n = Number(BigInt(raw)) / 1e6;
    return `${n.toLocaleString("en-US", { maximumFractionDigits: 6 })} USDC`;
  } catch {
    return raw;
  }
}

export function usdcFieldToAtomic(usdc: number): string {
  if (!Number.isFinite(usdc) || usdc < 0) return "0";
  return String(Math.round(usdc * 1e6));
}

export function atomicToUsdc(atomic: unknown): number {
  const raw = String(atomic ?? "0");
  if (!/^\d+$/.test(raw)) return 0;
  return Number(BigInt(raw)) / 1e6;
}
