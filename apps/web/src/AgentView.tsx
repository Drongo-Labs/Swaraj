import { useCallback, useEffect, useState } from "react";
import {
  APP_ID,
  api,
  formatAtomicUsdc,
  type ActionResult,
  type ActivityItem,
  type DecisionReceiptView,
  type LiveStateView,
  type PolicyView,
  type ProofJobFields,
  type ReceiptView,
} from "./api.js";
import { USDC, buildDemoIntent, usdcToAtomic } from "./demo.js";
import { Hash } from "./Hash.js";

type Props = {
  policy: PolicyView | null;
  apiOk: boolean;
};

function ExternalLink({ url, label }: { url: string | undefined; label: string }) {
  if (!url) return null;
  return (
    <a className="kurier-link" href={url} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

/** zkVerify verification and destination publication are separate stages with their own links. */
function ProofProgress({ proof }: { proof: ProofJobFields & { status?: string } | undefined }) {
  const destination = proof?.destination;
  return (
    <>
      <div>
        <dt>zkVerify</dt>
        <dd>
          {proof?.status ?? "—"}
          {proof?.kurierStatus && <span className="muted"> · Kurier {proof.kurierStatus}</span>}
          {proof?.transactionHash && (
            <>
              {" · "}
              <Hash value={proof.transactionHash} label="zkVerify tx" />
            </>
          )}
          {" "}
          <ExternalLink url={proof?.zkVerifyUrl ?? proof?.kurierUrl} label="Open on zkVerify explorer" />
          {!proof?.zkVerifyUrl && !proof?.kurierUrl && <span className="muted"> · no zkVerify transaction yet</span>}
          {proof?.lastError && <div className="err small">{proof.lastError}</div>}
        </dd>
      </div>
      {destination && (
        <div>
          <dt>{destination.name === "base-sepolia" ? "Base Sepolia" : `Chain ${destination.chainId}`}</dt>
          <dd>
            {destination.status}
            {destination.transactionHash && (
              <>
                {" · "}
                <Hash value={destination.transactionHash} label="Destination tx" />
              </>
            )}
            {" "}
            <ExternalLink url={destination.url} label="Open on Basescan" />
            {destination.error && <div className="err small">{destination.error}</div>}
          </dd>
        </div>
      )}
    </>
  );
}


export function ProductStatusBadge({
  status,
  decision,
}: {
  status?: string | null | undefined;
  decision?: "ALLOW" | "BLOCK" | undefined;
}) {
  let resolved: "allowed" | "blocked" | "proved" | "cant_prove" = "allowed";

  if (status === "proved" || status === "PROVED") {
    resolved = "proved";
  } else if (
    status === "cant_prove" ||
    status === "NON_PROVABLE" ||
    status === "INVALIDATED" ||
    status === "DEV_UNVERIFIED"
  ) {
    resolved = "cant_prove";
  } else if (status === "blocked" || decision === "BLOCK") {
    resolved = "blocked";
  } else {
    resolved = "allowed";
  }

  const label =
    resolved === "proved"
      ? "proved"
      : resolved === "cant_prove"
        ? "can’t prove"
        : resolved === "blocked"
          ? "blocked"
          : "allowed";

  return (
    <span className={"product-badge status-" + resolved} title={"Phase 2 honest status: " + label}>
      {label}
    </span>
  );
}

const TERMINAL = new Set(["PROVED", "NON_PROVABLE", "INVALIDATED"]);
const PROOF_STOPPED = new Set(["NON_PROVABLE", "RECONCILE"]);

/** Stop polling once the receipt is terminal and any requested publication has a final outcome. */
function settled(status: string, proof: (ProofJobFields & { status?: string }) | undefined): boolean {
  if (proof?.status && PROOF_STOPPED.has(proof.status)) return true;
  const destination = proof?.destination;
  const published = !destination || destination.status === "PUBLISHED" || destination.status === "FAILED";
  return TERMINAL.has(status) && published;
}

/** Poll `load` every 3s until `done` says so; surfaces failures instead of hiding them. */
function usePolled<T>(key: string | undefined, load: (key: string) => Promise<T>, done: (value: T) => boolean) {
  const [value, setValue] = useState<T | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  useEffect(() => {
    setValue(null);
    setPollError(null);
    if (!key) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    const pull = () =>
      load(key)
        .then((next) => {
          if (cancelled) return;
          setValue(next);
          setPollError(null);
          if (done(next)) clearInterval(timer);
        })
        .catch((err: unknown) => {
          if (!cancelled) setPollError(err instanceof Error ? err.message : String(err));
        });
    void pull();
    timer = setInterval(() => void pull(), 3000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // load/done are stable module-level functions for each call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { value, pollError };
}

const loadReceipt = (id: string) => api<ReceiptView>(`/v1/applications/${APP_ID}/receipts/${id}`);
const loadDecisionReceipt = (id: string) => api<DecisionReceiptView>(`/v1/applications/${APP_ID}/decision-receipts/${id}`);
const receiptSettled = (view: ReceiptView) => settled(view.status, view.proof);
const decisionSettled = (view: DecisionReceiptView) => settled(view.status, view.proof);

export function AgentView({ policy, apiOk }: Props) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ActivityItem | null>(null);
  const { value: receipt, pollError: receiptError } = usePolled(selected?.receiptId, loadReceipt, receiptSettled);
  const { value: decisionReceipt, pollError: decisionError } = usePolled(selected?.decisionReceipt?.id, loadDecisionReceipt, decisionSettled);
  const [liveState, setLiveState] = useState<LiveStateView | null>(null);

  const refreshActivity = useCallback(async () => {
    const data = await api<{ items: ActivityItem[] }>(`/v1/applications/${APP_ID}/activity`);
    setActivity(data.items);
  }, []);

  const refreshLiveState = useCallback(async () => {
    try {
      const state = await api<LiveStateView>(`/v1/applications/${APP_ID}/state`);
      setLiveState(state);
    } catch {
      setLiveState(null);
    }
  }, []);

  useEffect(() => {
    void refreshActivity().catch(() => undefined);
    void refreshLiveState().catch(() => undefined);
    const timer = setInterval(() => {
      void refreshActivity().catch(() => undefined);
      void refreshLiveState().catch(() => undefined);
    }, 4000);
    return () => clearInterval(timer);
  }, [refreshActivity, refreshLiveState]);

  async function propose(kind: "within" | "over") {
    if (!policy) return;
    setBusy(true);
    setError(null);
    const idempotencyKey = `agent-${kind}-${Date.now()}`;
    // Within: need amount + reserveRequirement ≤ live USDC (often ~13 after a prior ALLOW).
    const amountUsdc = kind === "within" ? 2 : 600;
    const slippage = kind === "within" ? 50 : 500;
    const policyVersion = Number(policy.definition.policyVersion ?? policy.version);
    try {
      // Live Base mode: API ignores client state and loads balances from RPC.
      const decision = await api<ActionResult>(`/v1/applications/${APP_ID}/actions`, {
        method: "POST",
        body: JSON.stringify({
          action: kind === "within" ? "trade.spot" : "trade.block",
          idempotencyKey,
          input: {
            policyId: policy.policyId,
            intent: {
              ...buildDemoIntent({
                amountAtomic: usdcToAtomic(amountUsdc),
                maxSlippageBps: slippage,
                idempotencyKey,
                policyVersion,
              }),
            },
          },
        }),
      });
      await refreshActivity();
      await refreshLiveState();
      const items = await api<{ items: ActivityItem[] }>(`/v1/applications/${APP_ID}/activity`);
      const match =
        items.items.find((i) => i.idempotencyKey === idempotencyKey) ??
        items.items.find((i) =>
          decision.decision === "ALLOW"
            ? i.receiptId === decision.receiptId
            : i.decision === "BLOCK" && i.intentHash === decision.intentHash,
        );
      if (match) setSelected(match);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const maxPerAction = policy?.definition.maxAmountPerAction
    ? formatAtomicUsdc(policy.definition.maxAmountPerAction)
    : "—";

  const usdcBal = liveState?.snapshot.balances?.find(
    (b) => b.asset.toLowerCase() === USDC.toLowerCase(),
  );

  return (
    <>
      <section className="panel enter" aria-labelledby="agent-state">
        <div className="panel-head">
          <h2 id="agent-state">Live execution wallet</h2>
          <p>Balances from Base RPC — not fixture state. Agent intents are gated against this portfolio.</p>
        </div>
        {liveState ? (
          <div className="policy-grid">
            <div className="span-2">
              <span className="label">Account</span>
              <strong className="mono small">{liveState.account}</strong>
            </div>
            <div>
              <span className="label">USDC</span>
              <strong>{formatAtomicUsdc(usdcBal?.amount ?? "0")}</strong>
            </div>
            <div>
              <span className="label">Source</span>
              <strong>{liveState.source}</strong>
            </div>
          </div>
        ) : (
          <p className="muted">Live state unavailable (API must run in Base mode).</p>
        )}
      </section>

      <section className="panel enter" style={{ animationDelay: "40ms" }} aria-labelledby="agent-run">
        <div className="panel-head">
          <h2 id="agent-run">Agent proposes</h2>
          <p>
            Real Uniswap v3 on Base when ALLOWED (max {maxPerAction}). Each row is a live authorization
            call; proofs auto-run when SP1/zkVerify env is set.
          </p>
        </div>
        <div className="presets">
          <button
            type="button"
            className="chip"
            disabled={busy || apiOk === false || !policy}
            onClick={() => void propose("over")}
          >
            Propose over limits (expect BLOCK)
          </button>
          <button
            type="button"
            className="chip"
            disabled={busy || apiOk === false || !policy}
            onClick={() => void propose("within")}
          >
            Propose within policy (expect ALLOW · real spend)
          </button>
          <button
            type="button"
            className="cta ghost"
            disabled={busy || apiOk === false || !policy}
            onClick={() => {
              void (async () => {
                await propose("over");
                await propose("within");
              })();
            }}
          >
            {busy ? "Running…" : "Run demo sequence"}
          </button>
        </div>
        {error && <p className="err">{error}</p>}
      </section>

      <section className="panel enter" style={{ animationDelay: "80ms" }} aria-labelledby="agent-feed">
        <div className="panel-head">
          <h2 id="agent-feed">Activity</h2>
          <p>Accepted / rejected with rule reasons. Select a row — polls until PROVED and, when requested, Base Sepolia publication.</p>
        </div>
        {activity.length === 0 && <p className="muted">No proposals yet — run the agent sequence.</p>}
        <ul className="activity-list">
          {activity.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`activity-row ${selected?.id === item.id ? "selected" : ""} tone-${item.decision === "ALLOW" ? "ok" : "fail"}`}
                onClick={() => setSelected(item)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span className="activity-decision">{item.decision}</span>
                  <ProductStatusBadge status={item.productStatus ?? item.status} decision={item.decision} />
                </div>
                <span className="activity-meta">
                  <span className="mono small">{item.action}</span>
                  <span className="muted">
                    {new Date(item.at * 1000).toLocaleTimeString()} · {item.idempotencyKey}
                  </span>
                </span>
                {item.decision === "BLOCK" && item.violations && item.violations.length > 0 && (
                  <span className="activity-why">
                    {item.violations
                      .slice(0, 2)
                      .map((v) => `Rule ${v.ruleId}: ${v.reason}`)
                      .join(" · ")}
                  </span>
                )}
                {item.decision === "ALLOW" && (
                  <span className="activity-why muted">
                    receipt {item.receiptId ?? "—"} · {item.productStatus ?? item.status ?? "PENDING"}
                  </span>
                )}
                {item.decision === "BLOCK" && item.productStatus && (
                  <span className="activity-why muted">status {item.productStatus}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selected && (
        <section className="panel enter reveal" aria-labelledby="agent-detail">
          <div className="panel-head">
            <h2 id="agent-detail">Decision detail</h2>
            <p>
              {selected.decision === "ALLOW"
                ? "Trade receipt + zkVerify proof / Base Sepolia publication (auto-prove when configured)"
                : "BLOCK why + Decision Receipt + zkVerify proof / Base Sepolia publication"}
            </p>
          </div>

          {selected.decision === "BLOCK" && (
            <div className="verdict deny">
              <div className="verdict-title" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span>BLOCK</span>
                <ProductStatusBadge status={selected.productStatus} decision="BLOCK" />
              </div>
              <ul>
                {(selected.violations ?? []).map((v) => (
                  <li key={`${v.ruleId}-${v.reason}`}>
                    <span className="mono">Rule {v.ruleId}</span>
                    <span>{v.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected.decision === "ALLOW" && (
            <div className="verdict allow">
              <div className="verdict-title" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span>ALLOW</span>
                <ProductStatusBadge status={receipt?.productStatus ?? selected.productStatus ?? receipt?.status} decision="ALLOW" />
              </div>
              <p>
                Capability <Hash value={selected.capabilityId} label="Capability" /> · intent{" "}
                <Hash value={selected.intentHash} label="Intent hash" />
              </p>
            </div>
          )}

          {receipt && (
            <dl className="ledger">
              <div>
                <dt>Trade receipt</dt>
                <dd style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span>{receipt.receiptId}</span>
                  <ProductStatusBadge status={receipt.productStatus ?? receipt.status} decision="ALLOW" />
                  <span className="muted">({receipt.status})</span>
                  {!receiptSettled(receipt) && <span className="muted"> · polling…</span>}
                  {receiptError && <div className="err small">Status check failed: {receiptError}</div>}
                </dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>
                  <Hash value={receipt.evidenceRoot} label="Evidence root" />
                </dd>
              </div>
              <ProofProgress proof={receipt.proof} />
            </dl>
          )}

          {decisionReceipt && (
            <dl className="ledger">
              <div>
                <dt>Decision receipt</dt>
                <dd style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span>{decisionReceipt.id}</span>
                  <ProductStatusBadge status={selected.productStatus} decision="BLOCK" />
                  <span className="muted">({decisionReceipt.status})</span>
                  {!decisionSettled(decisionReceipt) && <span className="muted"> · polling…</span>}
                  {decisionError && <div className="err small">Status check failed: {decisionError}</div>}
                </dd>
              </div>
              <div>
                <dt>Rules</dt>
                <dd className="mono small">{decisionReceipt.violatedRuleIds.join(", ")}</dd>
              </div>
              <div>
                <dt>Log hash</dt>
                <dd>
                  <Hash value={decisionReceipt.decisionLogEntryHash} label="Decision log" />
                </dd>
              </div>
              <ProofProgress proof={decisionReceipt.proof} />
            </dl>
          )}

          {!receipt && !decisionReceipt && selected.decision === "ALLOW" && (
            <p className="muted">Loading trade receipt…</p>
          )}
        </section>
      )}
    </>
  );
}
