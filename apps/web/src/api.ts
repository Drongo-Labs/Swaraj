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

/** Phase 2 product-facing status (honest mapping of engine state). */
export type ProductStatus = "allowed" | "blocked" | "proved" | "cant_prove" | "needs_approval";

export type ActionResult =
  | {
      decision: "ALLOW";
      receiptId: string;
      status: string;
      productStatus?: ProductStatus;
      capabilityId?: string;
      intentHash?: string;
      policyHash?: string;
      proof?: { status: string; claimScope?: string; kurierUrl?: string };
      activityId?: string;
    }
  | {
      decision: "BLOCK";
      violations: Array<{ ruleId: string; reason: string }>;
      productStatus?: ProductStatus;
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
  decision: "ALLOW" | "BLOCK" | "NEEDS_APPROVAL";
  intentHash?: string;
  policyHash?: string;
  violations?: Array<{ ruleId: string; reason: string }>;
  receiptId?: string;
  capabilityId?: string;
  status?: string;
  productStatus?: ProductStatus;
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
  productStatus?: ProductStatus;
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

export type ProjectRecord = {
  slug: string;
  displayName: string;
  applicationId: string;
  mandatePath: string;
  createdAt: string;
};

export type MandatePredicate = {
  field: string;
  operator: string;
  value?: string | boolean | number;
  values?: string[];
  name?: string;
};

export type MandateRule = {
  ruleId: string;
  effect: "PERMIT" | "FORBID" | "REQUIRE_APPROVAL";
  action: string;
  predicates: MandatePredicate[];
};

export type AgentMandateView = {
  mandateId: string;
  version: number;
  agent: string;
  defaultEffect: "DENY";
  validFrom: number;
  validUntil: number;
  rules: MandateRule[];
  agentSigner?: string;
  programCertifier?: string;
};

export type ProjectsListView = { projects: ProjectRecord[] };
export type ProjectMandateView = {
  project: ProjectRecord;
  mandate: AgentMandateView;
  issues?: unknown[];
};
export type ProjectActivateView = {
  project: ProjectRecord;
  mandateId: string;
  version: number;
  policyHash: string;
  ruleCount: number;
  issues?: unknown[];
};

export const listProjects = () => api<ProjectsListView>("/v1/projects");

export const createProject = (body: { displayName: string; slug?: string; applicationId?: string }) =>
  api<{ project: ProjectRecord }>("/v1/projects", { method: "POST", body: JSON.stringify(body) });

export const loadProjectMandate = (slug: string) =>
  api<ProjectMandateView>(`/v1/projects/${encodeURIComponent(slug)}/mandate`);

export const saveProjectMandate = (slug: string, mandate: AgentMandateView) =>
  api<ProjectMandateView>(`/v1/projects/${encodeURIComponent(slug)}/mandate`, {
    method: "PUT",
    body: JSON.stringify(mandate),
  });

export const activateProjectMandate = (slug: string) =>
  api<ProjectActivateView>(`/v1/projects/${encodeURIComponent(slug)}/activate`, {
    method: "POST",
  });
