import { useEffect, useState, type FormEvent } from "react";
import {
  activateProjectMandate,
  createProject,
  listProjects,
  loadProjectMandate,
  saveProjectMandate,
  type AgentMandateView,
  type ProjectRecord,
  type MandatePredicate,
  type MandateRule,
} from "./api.js";

type Props = { apiOk: boolean };

type RulePreset = {
  id: string;
  label: string;
  hint: string;
  build: (slug: string) => MandateRule;
};

const PRESETS: RulePreset[] = [
  {
    id: "forbid_plus4",
    label: "Block Wild +4",
    hint: "Stops play_card when cardValue > 104",
    build: () => ({
      ruleId: "a_forbid_wild_draw_four",
      effect: "FORBID",
      action: "APP_ACTION",
      predicates: [
        { field: "context.name", operator: "EQ", value: "play_card" },
        { field: "context.param", name: "cardValue", operator: "GT", value: "104" },
      ],
    }),
  },
  {
    id: "permit_on_turn",
    label: "Allow on-turn moves",
    hint: "Permit draw/play only when onTurn",
    build: (slug) => ({
      ruleId: "a_permit_game_actions",
      effect: "PERMIT",
      action: "APP_ACTION",
      predicates: [
        { field: "resource.app", operator: "EQ", value: slug },
        { field: "context.name", operator: "IN", values: ["draw_card", "play_card"] },
        { field: "context.paramBool", name: "onTurn", operator: "EQ", value: true },
      ],
    }),
  },
  {
    id: "cap_wager",
    label: "Cap wager",
    hint: "Forbid wager over 5 USDC",
    build: (slug) => ({
      ruleId: "forbid_wager_over_cap",
      effect: "FORBID",
      action: "PAYMENT",
      predicates: [
        { field: "resource.service", operator: "EQ", value: `${slug}_wager` },
        { field: "context.amount", operator: "GT", value: "5000000" },
      ],
    }),
  },
];

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function sortRules(rules: MandateRule[]): MandateRule[] {
  return [...rules].sort((a, b) => (a.ruleId < b.ruleId ? -1 : a.ruleId > b.ruleId ? 1 : 0));
}

function ruleTitle(rule: MandateRule): string {
  if (rule.ruleId.includes("wild_draw_four") || rule.ruleId.includes("plus4")) return "Block Wild +4";
  if (rule.ruleId.includes("permit_game")) return "Allow game moves";
  if (rule.ruleId.includes("off_turn")) return "Block off-turn actions";
  if (rule.ruleId.includes("wager_over")) return "Block oversized wagers";
  if (rule.ruleId.includes("wager") && rule.effect === "PERMIT") return "Allow wagers in cap";
  if (rule.ruleId.includes("stake_over")) return "Block oversized stakes";
  if (rule.ruleId.includes("stake") && rule.effect === "PERMIT") return "Allow stakes in cap";
  if (rule.ruleId.includes("payout")) return "Allow payout";
  return rule.ruleId.replace(/_/g, " ");
}

const OPERATORS: Record<string, string> = { EQ: "is", NEQ: "is not", GT: ">", GTE: "≥", LT: "<", LTE: "≤", IN: "in" };
const SUBJECTS: Record<string, string> = { "context.name": "action", "resource.app": "app", "resource.service": "service" };
const EFFECT_ORDER = ["FORBID", "REQUIRE_APPROVAL", "PERMIT"] as const;
const EFFECT_LABEL: Record<MandateRule["effect"], string> = {
  FORBID: "Forbid · always wins",
  REQUIRE_APPROVAL: "Needs approval",
  PERMIT: "Permit · only what is listed",
};

function predSubject(p: MandatePredicate): string {
  return p.name ?? SUBJECTS[p.field] ?? p.field.split(".").pop() ?? p.field;
}

function predValue(p: MandatePredicate, full = false): string {
  if (p.values) return p.values.join(", ");
  const raw = String(p.value ?? "");
  if (!full && /^0x[0-9a-f]{20,}$/i.test(raw)) return `${raw.slice(0, 8)}…${raw.slice(-4)}`;
  if (/^\d{5,}$/.test(raw)) return raw.replace(/\B(?=(\d{3})+(?!\d))/g, "_");
  return raw;
}

function findCardValuePred(rule: MandateRule): { index: number; pred: MandatePredicate } | null {
  const index = rule.predicates.findIndex((p) => p.field === "context.param" && p.name === "cardValue");
  if (index < 0) return null;
  return { index, pred: rule.predicates[index]! };
}

function findAmountPred(rule: MandateRule): { index: number; pred: MandatePredicate } | null {
  const index = rule.predicates.findIndex((p) => p.field === "context.amount");
  if (index < 0) return null;
  return { index, pred: rule.predicates[index]! };
}

export function ProjectsView({ apiOk }: Props) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mandate, setMandate] = useState<AgentMandateView | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  // Pretty JSON of what is on disk, and of what was last activated in this session.
  const [savedJson, setSavedJson] = useState("");
  const [activeJson, setActiveJson] = useState<string | null>(null);

  async function refreshProjects(preferSlug?: string) {
    const data = await listProjects();
    setProjects(data.projects);
    const next = preferSlug ?? selected ?? data.projects[0]?.slug ?? null;
    setSelected(next);
    return next;
  }

  async function loadMandate(projectSlug: string) {
    const data = await loadProjectMandate(projectSlug);
    setMandate(data.mandate);
    setJsonDraft(JSON.stringify(data.mandate, null, 2));
    setSavedJson(JSON.stringify(data.mandate, null, 2));
    setActiveJson(null);
  }

  useEffect(() => {
    if (!apiOk) return;
    void (async () => {
      try {
        setError(null);
        const next = await refreshProjects();
        if (next) await loadMandate(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiOk]);

  async function selectProject(projectSlug: string) {
    setSelected(projectSlug);
    setNote(null);
    setError(null);
    setExpanded(null);
    setBusy(true);
    try {
      await loadMandate(projectSlug);
    } catch (err) {
      setMandate(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function syncMandate(next: AgentMandateView) {
    setNote(null);
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  async function onAddProject(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const body: { displayName: string; slug?: string } = { displayName: displayName.trim() };
      const derived = slug.trim() || slugFromName(displayName);
      if (derived) body.slug = derived;
      const { project } = await createProject(body);
      setDisplayName("");
      setSlug("");
      setShowAdd(false);
      await refreshProjects(project.slug);
      await loadMandate(project.slug);
      setNote(`Created ${project.displayName} → examples/${project.slug}/`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function applyPreset(preset: RulePreset) {
    if (!mandate || !selected) return;
    const nextRule = preset.build(selected);
    const without = mandate.rules.filter((r) => r.ruleId !== nextRule.ruleId);
    syncMandate({ ...mandate, rules: sortRules([...without, nextRule]) });
    setExpanded(nextRule.ruleId);
    setNote(`Added “${preset.label}”. Save, then Activate.`);
  }

  function setPredicate(ruleIndex: number, predIndex: number, nextPred: MandatePredicate) {
    if (!mandate) return;
    const rules = mandate.rules.map((r, i) => {
      if (i !== ruleIndex) return r;
      const predicates = r.predicates.map((p, j) => (j === predIndex ? nextPred : p));
      return { ...r, predicates };
    });
    syncMandate({ ...mandate, rules });
  }

  function removeRule(index: number) {
    if (!mandate) return;
    syncMandate({ ...mandate, rules: mandate.rules.filter((_, i) => i !== index) });
  }

  async function onSave() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      let body = mandate;
      if (jsonMode) body = JSON.parse(jsonDraft) as AgentMandateView;
      if (!body) throw new Error("No mandate to save");
      const saved = await saveProjectMandate(selected, { ...body, rules: sortRules(body.rules) });
      syncMandate(saved.mandate);
      setSavedJson(JSON.stringify(saved.mandate, null, 2));
      setNote("Saved to disk. Activate to enforce for agents.");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onActivate() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const result = await activateProjectMandate(selected);
      setActiveJson(savedJson);
      setNote(
        `Live for agents · ${result.mandateId} v${result.version} · ${result.ruleCount} rules on app “${result.project.applicationId}”.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const selectedProject = projects.find((p) => p.slug === selected) ?? null;
  const dirty = mandate !== null && jsonDraft !== savedJson;
  const live = !dirty && activeJson !== null && activeJson === savedJson;
  const count = (effect: MandateRule["effect"]) => mandate?.rules.filter((r) => r.effect === effect).length ?? 0;

  const status = error
    ? { tone: "bad", text: error }
    : dirty
      ? { tone: "", text: note ?? "Unsaved changes. Save to write them to disk." }
      : live
        ? { tone: "ok", text: note ?? "Live for agents." }
        : { tone: note ? "ok" : "", text: note ?? "On disk. Activate to enforce these rules for agents." };

  return (
    <div className="projects-layout enter">
      <aside className="projects-rail" aria-label="Projects">
        <div className="rail-head">
          <h2 className="mono-label">Your projects</h2>
          <button
            type="button"
            className="btn-ghost"
            disabled={!apiOk || busy}
            onClick={() => setShowAdd((v) => !v)}
          >
            {showAdd ? "Cancel" : "+ New"}
          </button>
        </div>

        {!apiOk && <p className="muted small">API offline. Start the Swaraj API to manage projects.</p>}

        {showAdd && (
          <form className="add-project-form" onSubmit={(e) => void onAddProject(e)}>
            <label className="field">
              <span>Name</span>
              <input
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setSlug(slugFromName(e.target.value));
                }}
                placeholder="Zolo"
                disabled={busy}
                autoFocus
              />
            </label>
            <label className="field">
              <span>Folder slug</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="zolo"
                pattern="[a-z][a-z0-9_-]{1,31}"
                disabled={busy}
              />
            </label>
            <p className="hint">Creates examples/{slug || "…"}/ with a starter mandate.</p>
            <button type="submit" className="cta" disabled={busy || !displayName.trim()}>
              {busy ? "Creating…" : "Create project"}
            </button>
          </form>
        )}

        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                className={`project-row ${selected === project.slug ? "selected" : ""}`}
                onClick={() => void selectProject(project.slug)}
                disabled={!apiOk}
              >
                <span className="glyph" aria-hidden="true">
                  {project.displayName.slice(0, 1).toUpperCase()}
                </span>
                <strong>{project.displayName}</strong>
                <span className="mono">{project.slug}</span>
              </button>
            </li>
          ))}
        </ul>
        {projects.length === 0 && apiOk && <p className="muted small">No projects yet. Create one.</p>}
      </aside>

      <section className="projects-workspace" aria-label="Rules editor">
        {!selectedProject ? (
          <div className="empty-workspace">
            <h2>Select a project</h2>
            <p>Rules you set here gate the agent before it acts.</p>
            {error && <p className="err">{error}</p>}
          </div>
        ) : (
          <>
            <div className="workspace-body">
              <div className="workspace-head">
                <div>
                  <p className="mono-label" style={{ margin: 0 }}>
                    Mandate · <b>{selectedProject.mandatePath}</b>
                  </p>
                  <h2>{selectedProject.displayName}</h2>
                </div>
                <div className="segmented" role="group" aria-label="Editor mode">
                  <button
                    type="button"
                    className={jsonMode ? "" : "active"}
                    disabled={!mandate || busy}
                    onClick={() => setJsonMode(false)}
                  >
                    Rules
                  </button>
                  <button
                    type="button"
                    className={jsonMode ? "active" : ""}
                    disabled={!mandate || busy}
                    onClick={() => setJsonMode(true)}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {jsonMode ? (
                <textarea
                  className="mandate-json"
                  value={jsonDraft}
                  onChange={(e) => {
                    setNote(null);
                    setJsonDraft(e.target.value);
                  }}
                  spellCheck={false}
                  disabled={busy}
                  aria-label="Mandate JSON"
                />
              ) : !mandate ? (
                <p className="muted" style={{ marginTop: "1.25rem" }}>
                  {busy ? "Loading rules…" : "No mandate loaded."}
                </p>
              ) : (
                <>
                  <p className="gate-note">
                    <span>
                      <strong>Default deny.</strong> The agent can only do what a permit rule lists, and a forbid
                      rule always wins.
                    </span>
                    <span className="counts">
                      <span className="effect-pill forbid">{count("FORBID")} forbid</span>
                      <span className="effect-pill permit">{count("PERMIT")} permit</span>
                    </span>
                  </p>

                  <p className="section-label mono-label">Add a rule</p>
                  <div className="preset-row" role="group" aria-label="Quick rules">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className="preset-chip"
                        title={preset.hint}
                        disabled={busy}
                        onClick={() => applyPreset(preset)}
                      >
                        <span className="plus" aria-hidden="true">
                          +
                        </span>
                        <strong>{preset.label}</strong>
                      </button>
                    ))}
                  </div>

                  {EFFECT_ORDER.filter((effect) => count(effect) > 0).map((effect) => (
                    <div key={effect}>
                      <p className="section-label mono-label">{EFFECT_LABEL[effect]}</p>
                      <ul className="rule-readable-list">
                        {mandate.rules.map((rule, ruleIndex) => {
                          if (rule.effect !== effect) return null;
                          const open = expanded === rule.ruleId;
                          const cardPred = findCardValuePred(rule);
                          const amountPred = findAmountPred(rule);
                          return (
                            <li
                              key={`${rule.ruleId}-${ruleIndex}`}
                              className={`rule-readable ${rule.effect.toLowerCase()}`}
                            >
                              <button
                                type="button"
                                className="rule-readable-main"
                                aria-expanded={open}
                                onClick={() => setExpanded(open ? null : rule.ruleId)}
                              >
                                <span className={`effect-pill ${rule.effect.toLowerCase()}`}>
                                  {rule.effect === "REQUIRE_APPROVAL" ? "Approve" : rule.effect}
                                </span>
                                <span className="rule-readable-copy">
                                  <strong>{ruleTitle(rule)}</strong>
                                  <span className="clauses">
                                    {rule.predicates.map((p, i) => (
                                      <span key={i} className="clause">
                                        {predSubject(p)} <i>{OPERATORS[p.operator] ?? p.operator}</i>{" "}
                                        <b>{predValue(p)}</b>
                                      </span>
                                    ))}
                                  </span>
                                </span>
                                <span className={`chevron ${open ? "open" : ""}`} aria-hidden="true">
                                  {open ? "−" : "+"}
                                </span>
                              </button>

                              {open && (
                                <div className="rule-readable-body reveal">
                                  <div className="pred-table">
                                    <div className="row head">
                                      <span>Field</span>
                                      <span>Op</span>
                                      <span>{rule.ruleId}</span>
                                    </div>
                                    <div className="row">
                                      <span>action type</span>
                                      <span>EQ</span>
                                      <span>{rule.action}</span>
                                    </div>
                                    {rule.predicates.map((p, i) => (
                                      <div key={i} className="row">
                                        <span>{p.name ? `${p.field} · ${p.name}` : p.field}</span>
                                        <span>{p.operator}</span>
                                        <span>{predValue(p, true)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="rule-edit">
                                    {cardPred && (
                                      <label className="field inline-edit">
                                        <span>Block when card value is greater than</span>
                                        <input
                                          type="number"
                                          value={String(cardPred.pred.value ?? "")}
                                          disabled={busy}
                                          onChange={(e) =>
                                            setPredicate(ruleIndex, cardPred.index, {
                                              ...cardPred.pred,
                                              value: e.target.value,
                                            })
                                          }
                                        />
                                      </label>
                                    )}
                                    {amountPred && (
                                      <label className="field inline-edit">
                                        <span>Amount threshold (atomic units)</span>
                                        <input
                                          inputMode="numeric"
                                          value={String(amountPred.pred.value ?? "")}
                                          disabled={busy}
                                          onChange={(e) =>
                                            setPredicate(ruleIndex, amountPred.index, {
                                              ...amountPred.pred,
                                              value: e.target.value,
                                            })
                                          }
                                        />
                                      </label>
                                    )}
                                    {!cardPred && !amountPred && (
                                      <p className="hint">Switch to JSON to edit this rule's conditions.</p>
                                    )}
                                    <button
                                      type="button"
                                      className="btn-ghost danger"
                                      disabled={busy}
                                      onClick={() => removeRule(ruleIndex)}
                                    >
                                      Remove rule
                                    </button>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="sticky-actions">
              <div className="flow-steps" aria-hidden="true">
                <span className={`step ${dirty ? "on" : "done"}`}>01 Edit</span>
                <span className="step-sep" />
                <span className={`step ${dirty ? "" : live ? "done" : "on"}`}>02 Save</span>
                <span className="step-sep" />
                <span className={`step ${live ? "done" : ""}`}>03 Activate</span>
              </div>
              <p className={`dock-status ${status.tone}`} role="status">
                {status.text}
              </p>
              <div className="dock-buttons">
                <button
                  type="button"
                  className={`cta ${dirty ? "white" : "secondary"}`}
                  disabled={!apiOk || busy || !mandate || !dirty}
                  onClick={() => void onSave()}
                >
                  {busy ? "Working…" : dirty ? "Save to disk" : "Saved"}
                </button>
                <button
                  type="button"
                  className="cta"
                  disabled={!apiOk || busy || !selected || dirty || live}
                  title={dirty ? "Save your changes first" : undefined}
                  onClick={() => void onActivate()}
                >
                  {live ? "Live" : "Activate for agents"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
