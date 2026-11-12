import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { APP_ID, api, type HealthView, type PolicyView } from "./api.js";
import { AgentView } from "./AgentView.js";
import { ProjectsView } from "./ProjectsView.js";
import { OwnerView } from "./OwnerView.js";
import "./style.css";

type View = "projects" | "owner" | "agent";

function App() {
  const [view, setView] = useState<View>("projects");
  const [policy, setPolicy] = useState<PolicyView | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        await api<HealthView>("/health");
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
      <header className="topbar">
        <div className="topbar-brand">
          <img className="brand-logo" src="/swaraj-logo.png" alt="Swaraj" />
          <span className="brand-sub">Dashboard</span>
        </div>
        <nav className="view-tabs" aria-label="App views">
          {(["projects", "owner", "agent"] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`tab ${view === id ? "active" : ""}`}
              onClick={() => setView(id)}
            >
              {id[0]!.toUpperCase() + id.slice(1)}
            </button>
          ))}
        </nav>
        <div className="topbar-meta">
          <p className={`pulse ${apiOk === false ? "down" : apiOk ? "up" : ""}`}>
            {apiOk === null ? "Connecting…" : apiOk ? "API live" : "API offline"}
          </p>
        </div>
      </header>

      <div className="page-intro">
        <h1>
          {view === "projects"
            ? "Projects & rules"
            : view === "owner"
              ? "Owner policy"
              : "Agent activity"}
        </h1>
        <p className="lede">
          {view === "projects"
            ? "Pick a project, set what the agent may do, save, then activate. Same Swaraj mandate gate as production."
            : view === "owner"
              ? "Limits map to Lean/SMT predicates. Agent intents evaluate against the ACTIVE version only."
              : "Propose intents and inspect allow / block decisions with rule reasons."}
        </p>
      </div>

      {error && view === "owner" && !policy && <p className="err">{error}</p>}

      {view === "projects" ? (
        <ProjectsView apiOk={apiOk === true} />
      ) : view === "owner" ? (
        <OwnerView
          policy={policy}
          apiOk={apiOk === true}
          onPolicySaved={(next) => {
            setPolicy(next);
            setError(null);
          }}
        />
      ) : (
        <AgentView policy={policy} apiOk={apiOk === true} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
