import { useEffect, useState } from "react";
import {
  APP_ID,
  api,
  asOwner,
  atomicToUsdc,
  formatAtomicUsdc,
  usdcFieldToAtomic,
  type PolicyView,
} from "./api.js";
import { Hash } from "./Hash.js";

/** Lean AmountPolicy-aligned + Policy Profile fields the owner may set. */
type OwnerForm = {
  maxAmountUsdc: number;
  dailyTurnoverUsdc: number;
  reserveUsdc: number;
  positionCapUsdc: number;
  maxSlippageBps: number;
  cooldownSeconds: number;
  quoteFreshnessSeconds: number;
  paused: boolean;
};

function formFromPolicy(policy: PolicyView): OwnerForm {
  const d = policy.definition;
  return {
    maxAmountUsdc: atomicToUsdc(d.maxAmountPerAction),
    dailyTurnoverUsdc: atomicToUsdc(d.dailyTurnoverCap),
    reserveUsdc: atomicToUsdc(d.reserveRequirement),
    positionCapUsdc: atomicToUsdc(d.positionCap),
    maxSlippageBps: Number(d.maxSlippageBps ?? 100),
    cooldownSeconds: Number(d.cooldownSeconds ?? 60),
    quoteFreshnessSeconds: Number(d.quoteFreshnessSeconds ?? 30),
    paused: Boolean(d.paused),
  };
}

type Props = {
  policy: PolicyView | null;
  onPolicySaved: (policy: PolicyView) => void;
  apiOk: boolean;
};

type BudgetUsage = {
  budgetId: string;
  action: string;
  currency: string;
  window: string;
  limit: string;
  used: string;
  remaining: string;
  resetsAt: string;
};

export function OwnerView({ policy, onPolicySaved, apiOk }: Props) {
  const [form, setForm] = useState<OwnerForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<BudgetUsage[]>([]);

  useEffect(() => {
    if (policy) setForm(formFromPolicy(policy));
  }, [policy]);

  useEffect(() => {
    if (!apiOk) return;
    void api<{ budgets: BudgetUsage[] }>(`/v1/applications/${APP_ID}/budgets`)
      .then((res) => setBudgets(res.budgets ?? []))
      .catch(() => setBudgets([]));
  }, [apiOk, policy]);

  async function activate() {
    if (!policy || !form) return;
    setBusy(true);
    setError(null);
    setSavedNote(null);
    try {
      const nextVersion = policy.version + 1;
      const { policyHash: _drop, ...baseDef } = policy.definition;
      void _drop;
      const definition = {
        ...baseDef,
        policyVersion: nextVersion,
        maxAmountPerAction: usdcFieldToAtomic(form.maxAmountUsdc),
        dailyTurnoverCap: usdcFieldToAtomic(form.dailyTurnoverUsdc),
        reserveRequirement: usdcFieldToAtomic(form.reserveUsdc),
        positionCap: usdcFieldToAtomic(form.positionCapUsdc),
        maxSlippageBps: form.maxSlippageBps,
        cooldownSeconds: form.cooldownSeconds,
        quoteFreshnessSeconds: form.quoteFreshnessSeconds,
        paused: form.paused,
      };
      const saved = await api<PolicyView>(`/v1/applications/${APP_ID}/policies`, {
        method: "POST",
        headers: asOwner,
        body: JSON.stringify({
          policyId: policy.policyId,
          version: nextVersion,
          definition,
        }),
      });
      onPolicySaved(saved);
      setSavedNote(`Activated ${saved.policyId} v${saved.version}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  if (!form || !policy) {
    return <p className="muted">{apiOk === false ? "API offline." : "Loading policy…"}</p>;
  }

  const set =
    <K extends keyof OwnerForm>(key: K) =>
    (value: OwnerForm[K]) =>
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <>
      <section className="panel enter" aria-labelledby="owner-active">
        <div className="panel-head">
          <h2 id="owner-active">Active policy</h2>
          <p>
            Limits map to Lean/SMT predicates (amount ≤ cap, budget, paused, slippage, cooldown). Agent
            intents are evaluated against this ACTIVE version only.
          </p>
        </div>
        <div className="policy-grid">
          <div>
            <span className="label">Identity</span>
            <strong>
              {policy.policyId}
              <span className="muted"> · v{policy.version}</span>
            </strong>
          </div>
          <div>
            <span className="label">Status</span>
            <strong className="status">{policy.status}</strong>
          </div>
          <div className="span-2">
            <span className="label">Policy hash</span>
            <Hash value={policy.policyHash} label="Policy hash" />
          </div>
          <div>
            <span className="label">Max per trade</span>
            <strong>{formatAtomicUsdc(policy.definition.maxAmountPerAction)}</strong>
          </div>
          <div>
            <span className="label">Daily turnover cap</span>
            <strong>{formatAtomicUsdc(policy.definition.dailyTurnoverCap)}</strong>
          </div>
          <div className="span-2">
            <span className="label">Venues / assets</span>
            <strong className="mono small">
              {String((policy.definition.allowedVenues as string[] | undefined)?.join(", ") ?? "—")}
            </strong>
          </div>
          {budgets.length > 0 ? (
            <div className="span-2">
              <span className="label">Mandate budgets</span>
              <strong className="mono small">
                {budgets
                  .map(
                    (b) =>
                      `${b.budgetId}: ${b.used}/${b.limit} ${b.currency} ${b.window.toLowerCase()} (resets ${b.resetsAt})`,
                  )
                  .join(" · ")}
              </strong>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel enter" style={{ animationDelay: "80ms" }} aria-labelledby="owner-edit">
        <div className="panel-head">
          <h2 id="owner-edit">Set &amp; activate</h2>
          <p>Saving creates a new ACTIVE version and retires the previous one.</p>
        </div>
        <form
          className="intent-form owner-form"
          onSubmit={(e) => {
            e.preventDefault();
            void activate();
          }}
        >
          <div className="propose">
            <label className="field">
              <span>Max per action (USDC) · Lean cap</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.maxAmountUsdc}
                onChange={(e) => set("maxAmountUsdc")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Daily turnover cap (USDC) · Lean budget</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.dailyTurnoverUsdc}
                onChange={(e) => set("dailyTurnoverUsdc")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Reserve requirement (USDC)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.reserveUsdc}
                onChange={(e) => set("reserveUsdc")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Position cap (USDC)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.positionCapUsdc}
                onChange={(e) => set("positionCapUsdc")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Max slippage (bps)</span>
              <input
                type="number"
                min={0}
                max={10000}
                step={1}
                value={form.maxSlippageBps}
                onChange={(e) => set("maxSlippageBps")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Cooldown (seconds)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={form.cooldownSeconds}
                onChange={(e) => set("cooldownSeconds")(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Quote freshness (seconds)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={form.quoteFreshnessSeconds}
                onChange={(e) => set("quoteFreshnessSeconds")(Number(e.target.value))}
              />
            </label>
            <label className="field check-field">
              <span>Paused · Lean blocks when true</span>
              <input
                type="checkbox"
                checked={form.paused}
                onChange={(e) => set("paused")(e.target.checked)}
              />
            </label>
          </div>
          <button type="submit" className="cta submit" disabled={busy || apiOk === false}>
            {busy ? "Activating…" : `Activate as v${policy.version + 1}`}
          </button>
        </form>
        {savedNote && <p className="ok-note reveal">{savedNote}</p>}
        {error && <p className="err">{error}</p>}
      </section>
    </>
  );
}
