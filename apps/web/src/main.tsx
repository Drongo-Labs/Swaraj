import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { APP_ID, api, type HealthView, type PolicyView } from "./api.js";
import { AgentView } from "./AgentView.js";
import { GamesView } from "./GamesView.js";
import { OwnerView } from "./OwnerView.js";
import "./style.css";

type View = "owner" | "agent" | "games";

function App() {
  const [view, setView] = useState<View>("owner");
  const [health, setHealth] = useState<HealthView | null>(null);
  const [policy, setPolicy] = useState<PolicyView | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const h = await api<HealthView>("/health");
        setHealth(h);
        setApiOk(true);
        const next = await api<PolicyView>(`/v1/applications/${APP_ID}/policies/policy_demo`);
        setPolicy(next);
        setError(null);
      } catch (err) {
        setApiOk(false);
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
  }, []);

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />
      <header className="hero">
        <div className="hero-top">
          <p className="brand">Swaraj</p>
          <p className={`pulse ${apiOk === false ? "down" : apiOk ? "up" : ""}`}>
            {apiOk === null ? "Connecting…" : apiOk ? "API live" : "API offline"}
          </p>
        </div>
        <h1>Policy-gated agent authorization</h1>
        {health && (
          <p className="runtime mono small">
            mode={health.mode}
            {health.live ? " · live" : ""}
            {health.network ? ` · network=${health.network}` : ""} · execution=
            {health.phases.execution} · base={health.phases.base} · lean={health.phases.lean} · sp1=
            {health.phases.sp1} · zk={health.phases.zkVerify} · kurier={health.phases.kurier} ·
            autoProve={health.phases.autoProve}
          </p>
        )}
        <nav className="view-tabs" aria-label="App views">
          <button
            type="button"
            className={`tab ${view === "owner" ? "active" : ""}`}
            onClick={() => setView("owner")}
          >
            Owner · Policy
          </button>
          <button
            type="button"
            className={`tab ${view === "agent" ? "active" : ""}`}
            onClick={() => setView("agent")}
          >
            Agent · Activity
          </button>
          <button
            type="button"
            className={`tab ${view === "games" ? "active" : ""}`}
            onClick={() => setView("games")}
          >
            Games · Mandates
          </button>
        </nav>
      </header>

      {error && view === "owner" && !policy && <p className="err">{error}</p>}

      {view === "owner" ? (
        <OwnerView
          policy={policy}
          apiOk={apiOk === true}
          onPolicySaved={(next) => {
            setPolicy(next);
            setError(null);
          }}
        />
      ) : view === "agent" ? (
        <AgentView policy={policy} apiOk={apiOk === true} />
      ) : (
        <GamesView apiOk={apiOk === true} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
