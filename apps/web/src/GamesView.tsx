import { useEffect, useState, type FormEvent } from "react";
import {
  activateGameMandate,
  createGame,
  listGames,
  loadGameMandate,
  saveGameMandate,
  type AgentMandateView,
  type GameRecord,
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

function rulePlainEnglish(rule: MandateRule): string {
  const bits = rule.predicates.map((p) => {
    const target = p.name ? `${p.field} (${p.name})` : p.field;
    if (p.values) return `${target} in [${p.values.join(", ")}]`;
    return `${target} ${p.operator} ${String(p.value)}`;
  });
  const verb =
    rule.effect === "FORBID" ? "Block" : rule.effect === "PERMIT" ? "Allow" : "Require approval for";
  return `${verb} ${rule.action.replace(/_/g, " ").toLowerCase()} when ${bits.join(" and ")}.`;
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

export function GamesView({ apiOk }: Props) {
  const [games, setGames] = useState<GameRecord[]>([]);
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

  async function refreshGames(preferSlug?: string) {
    const data = await listGames();
    setGames(data.games);
    const next = preferSlug ?? selected ?? data.games[0]?.slug ?? null;
    setSelected(next);
    return next;
  }

  async function loadMandate(gameSlug: string) {
    const data = await loadGameMandate(gameSlug);
    setMandate(data.mandate);
    setJsonDraft(JSON.stringify(data.mandate, null, 2));
  }

  useEffect(() => {
    if (!apiOk) return;
    void (async () => {
      try {
        setError(null);
        const next = await refreshGames();
        if (next) await loadMandate(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiOk]);

  async function selectGame(gameSlug: string) {
    setSelected(gameSlug);
    setNote(null);
    setError(null);
    setExpanded(null);
    setBusy(true);
    try {
      await loadMandate(gameSlug);
    } catch (err) {
      setMandate(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function syncMandate(next: AgentMandateView) {
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  async function onAddGame(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const body: { displayName: string; slug?: string } = { displayName: displayName.trim() };
      const derived = slug.trim() || slugFromName(displayName);
      if (derived) body.slug = derived;
      const { game } = await createGame(body);
      setDisplayName("");
      setSlug("");
      setShowAdd(false);
      await refreshGames(game.slug);
      await loadMandate(game.slug);
      setNote(`Created ${game.displayName} → examples/${game.slug}/`);
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
      const saved = await saveGameMandate(selected, { ...body, rules: sortRules(body.rules) });
      syncMandate(saved.mandate);
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
      const result = await activateGameMandate(selected);
      setNote(
        `Live for agents · ${result.mandateId} v${result.version} · ${result.ruleCount} rules on app “${result.game.applicationId}”.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const selectedGame = games.find((g) => g.slug === selected) ?? null;

  return (
    <div className="games-layout enter">
      <aside className="games-rail" aria-label="Games">
        <div className="rail-head">
          <h2>Your games</h2>
          <button
            type="button"
            className="btn-ghost"
            disabled={!apiOk || busy}
            onClick={() => setShowAdd((v) => !v)}
          >
            {showAdd ? "Cancel" : "New game"}
          </button>
        </div>

        {!apiOk && <p className="muted">API offline — start the Swaraj API to manage games.</p>}

        {showAdd && (
          <form className="add-game-form" onSubmit={(e) => void onAddGame(e)}>
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
              {busy ? "Creating…" : "Create"}
            </button>
          </form>
        )}

        <ul className="game-list">
          {games.map((game) => (
            <li key={game.slug}>
              <button
                type="button"
                className={`game-row ${selected === game.slug ? "selected" : ""}`}
                onClick={() => void selectGame(game.slug)}
                disabled={!apiOk}
              >
                <strong>{game.displayName}</strong>
                <span className="mono small">{game.slug}</span>
              </button>
            </li>
          ))}
        </ul>
        {games.length === 0 && apiOk && <p className="muted">No games yet — create one.</p>}
      </aside>

      <section className="games-workspace" aria-label="Rules editor">
        {!selectedGame ? (
          <div className="empty-workspace">
            <h2>Select a game</h2>
            <p>Rules you set here gate the agent before it acts.</p>
          </div>
        ) : (
          <>
            <div className="workspace-head">
              <div>
                <p className="eyebrow">Editing rules</p>
                <h2>{selectedGame.displayName}</h2>
                <p className="muted small">
                  File <span className="mono">{selectedGame.mandatePath}</span> · app{" "}
                  <span className="mono">{selectedGame.applicationId}</span>
                </p>
              </div>
              <div className="flow-steps" aria-hidden="true">
                <span className="step on">1 Edit</span>
                <span className="step-sep" />
                <span className="step">2 Save</span>
                <span className="step-sep" />
                <span className="step">3 Activate</span>
              </div>
            </div>

            <div className="preset-row" role="group" aria-label="Quick rules">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="preset-chip"
                  title={preset.hint}
                  disabled={!mandate || busy}
                  onClick={() => applyPreset(preset)}
                >
                  <strong>{preset.label}</strong>
                  <span>{preset.hint}</span>
                </button>
              ))}
            </div>

            <div className="workspace-toolbar">
              <button
                type="button"
                className="btn-ghost"
                disabled={!mandate || busy}
                onClick={() => setJsonMode((v) => !v)}
              >
                {jsonMode ? "Simple view" : "Advanced JSON"}
              </button>
            </div>

            {jsonMode ? (
              <textarea
                className="mandate-json"
                value={jsonDraft}
                onChange={(e) => setJsonDraft(e.target.value)}
                rows={20}
                spellCheck={false}
                disabled={busy}
              />
            ) : !mandate ? (
              <p className="muted">{busy ? "Loading rules…" : "No mandate loaded."}</p>
            ) : (
              <ul className="rule-readable-list">
                {mandate.rules.map((rule, ruleIndex) => {
                  const open = expanded === rule.ruleId;
                  const cardPred = findCardValuePred(rule);
                  const amountPred = findAmountPred(rule);
                  return (
                    <li key={`${rule.ruleId}-${ruleIndex}`} className={`rule-readable ${rule.effect.toLowerCase()}`}>
                      <button
                        type="button"
                        className="rule-readable-main"
                        onClick={() => setExpanded(open ? null : rule.ruleId)}
                      >
                        <span className={`effect-pill ${rule.effect.toLowerCase()}`}>{rule.effect}</span>
                        <span className="rule-readable-copy">
                          <strong>{ruleTitle(rule)}</strong>
                          <span>{rulePlainEnglish(rule)}</span>
                        </span>
                        <span className="chevron" aria-hidden="true">
                          {open ? "−" : "+"}
                        </span>
                      </button>

                      {open && (
                        <div className="rule-readable-body">
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
                            <p className="hint">
                              Use Advanced JSON to edit this rule’s predicates in full.
                            </p>
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
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="sticky-actions">
              <button
                type="button"
                className="cta ghost-cta"
                disabled={!apiOk || busy || !mandate}
                onClick={() => void onSave()}
              >
                {busy ? "Working…" : "Save to disk"}
              </button>
              <button
                type="button"
                className="cta"
                disabled={!apiOk || busy || !selected}
                onClick={() => void onActivate()}
              >
                Activate for agents
              </button>
            </div>
          </>
        )}

        {note && <p className="ok-note reveal">{note}</p>}
        {error && <p className="err">{error}</p>}
      </section>
    </div>
  );
}
