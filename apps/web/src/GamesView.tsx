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
  description: string;
  build: (slug: string) => MandateRule;
};

const PRESETS: RulePreset[] = [
  {
    id: "forbid_plus4",
    label: "Forbid Wild +4",
    description: "BLOCK play_card when cardValue > 104 (Zunno +4).",
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
    label: "Permit on-turn play/draw",
    description: "PERMIT draw_card and play_card when onTurn is true.",
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
    label: "Cap wager (5 USDC)",
    description: "FORBID wager payments over 5_000_000 atomic USDC.",
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

function emptyPredicate(): MandatePredicate {
  return { field: "context.name", operator: "EQ", value: "" };
}

function emptyRule(): MandateRule {
  return {
    ruleId: "new_rule",
    effect: "FORBID",
    action: "APP_ACTION",
    predicates: [emptyPredicate()],
  };
}

function sortRules(rules: MandateRule[]): MandateRule[] {
  return [...rules].sort((a, b) => (a.ruleId < b.ruleId ? -1 : a.ruleId > b.ruleId ? 1 : 0));
}

function predicateSummary(p: MandatePredicate): string {
  const name = p.name ? `.${p.name}` : "";
  if (p.values) return `${p.field}${name} ${p.operator} [${p.values.join(", ")}]`;
  return `${p.field}${name} ${p.operator} ${String(p.value)}`;
}

export function GamesView({ apiOk }: Props) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mandate, setMandate] = useState<AgentMandateView | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");

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
      await refreshGames(game.slug);
      await loadMandate(game.slug);
      setNote(`Created examples/${game.slug}/ and registered ${game.displayName}.`);
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
    const next = { ...mandate, rules: sortRules([...without, nextRule]) };
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
    setNote(`Applied preset “${preset.label}”. Save to write the mandate file.`);
  }

  function updateRule(index: number, patch: Partial<MandateRule>) {
    if (!mandate) return;
    const rules = mandate.rules.map((r, i) => (i === index ? { ...r, ...patch } : r));
    const next = { ...mandate, rules };
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  function setPredicate(ruleIndex: number, predIndex: number, nextPred: MandatePredicate) {
    if (!mandate) return;
    const rules = mandate.rules.map((r, i) => {
      if (i !== ruleIndex) return r;
      const predicates = r.predicates.map((p, j) => (j === predIndex ? nextPred : p));
      return { ...r, predicates };
    });
    const next = { ...mandate, rules };
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  function addRule() {
    if (!mandate) return;
    const next = { ...mandate, rules: [...mandate.rules, emptyRule()] };
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  function removeRule(index: number) {
    if (!mandate) return;
    const next = { ...mandate, rules: mandate.rules.filter((_, i) => i !== index) };
    setMandate(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  }

  async function onSave() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      let body = mandate;
      if (jsonMode) {
        body = JSON.parse(jsonDraft) as AgentMandateView;
      }
      if (!body) throw new Error("No mandate to save");
      const saved = await saveGameMandate(selected, {
        ...body,
        rules: sortRules(body.rules),
      });
      setMandate(saved.mandate);
      setJsonDraft(JSON.stringify(saved.mandate, null, 2));
      setNote("Mandate saved to disk.");
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
        `Activated ${result.mandateId} v${result.version} on app ${result.game.applicationId} (${result.ruleCount} rules).`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const selectedGame = games.find((g) => g.slug === selected) ?? null;

  return (
    <>
      <section className="panel enter" aria-labelledby="games-list">
        <div className="panel-head">
          <h2 id="games-list">Games</h2>
          <p>Examples registered for Swaraj. Add a game to scaffold under examples/.</p>
        </div>
        {!apiOk && <p className="muted">API offline.</p>}
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
                <span className="muted mono small">
                  {game.slug} · app={game.applicationId}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {games.length === 0 && apiOk && <p className="muted">No games yet.</p>}
      </section>

      <section className="panel enter" style={{ animationDelay: "60ms" }} aria-labelledby="games-add">
        <div className="panel-head">
          <h2 id="games-add">Add game</h2>
          <p>Creates examples/&lt;slug&gt;/ with mandate, package.json, and a stub Swaraj client.</p>
        </div>
        <form className="intent-form owner-form" onSubmit={(e) => void onAddGame(e)}>
          <div className="propose">
            <label className="field">
              <span>Display name</span>
              <input
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (!slug) setSlug(slugFromName(e.target.value));
                }}
                placeholder="Zolo"
                disabled={!apiOk || busy}
              />
            </label>
            <label className="field">
              <span>Slug</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="zolo"
                pattern="[a-z][a-z0-9_-]{1,31}"
                disabled={!apiOk || busy}
              />
            </label>
          </div>
          <button type="submit" className="cta submit" disabled={!apiOk || busy || !displayName.trim()}>
            {busy ? "Working…" : "Add game"}
          </button>
        </form>
      </section>

      {selectedGame && (
        <section className="panel enter" style={{ animationDelay: "120ms" }} aria-labelledby="games-rules">
          <div className="panel-head">
            <h2 id="game-rules">Rules · {selectedGame.displayName}</h2>
            <p>
              Edit Agent Mandate rules (e.g. forbid +4). Save writes{" "}
              <span className="mono small">{selectedGame.mandatePath}</span>; Activate registers it on the API.
            </p>
          </div>

          <div className="preset-row">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="preset-btn"
                title={preset.description}
                disabled={!mandate || busy}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
            <button type="button" className="preset-btn" disabled={!mandate || busy} onClick={addRule}>
              + Blank rule
            </button>
            <button
              type="button"
              className="preset-btn"
              disabled={!mandate || busy}
              onClick={() => setJsonMode((v) => !v)}
            >
              {jsonMode ? "Form mode" : "JSON mode"}
            </button>
          </div>

          {jsonMode ? (
            <textarea
              className="mandate-json"
              value={jsonDraft}
              onChange={(e) => setJsonDraft(e.target.value)}
              rows={22}
              spellCheck={false}
              disabled={busy}
            />
          ) : mandate ? (
            <div className="rule-stack">
              <div className="propose meta-fields">
                <label className="field">
                  <span>mandateId</span>
                  <input
                    value={mandate.mandateId}
                    onChange={(e) => {
                      const next = { ...mandate, mandateId: e.target.value };
                      setMandate(next);
                      setJsonDraft(JSON.stringify(next, null, 2));
                    }}
                  />
                </label>
                <label className="field">
                  <span>version</span>
                  <input
                    type="number"
                    min={1}
                    value={mandate.version}
                    onChange={(e) => {
                      const next = { ...mandate, version: Number(e.target.value) };
                      setMandate(next);
                      setJsonDraft(JSON.stringify(next, null, 2));
                    }}
                  />
                </label>
                <label className="field">
                  <span>agent</span>
                  <input
                    value={mandate.agent}
                    onChange={(e) => {
                      const next = { ...mandate, agent: e.target.value };
                      setMandate(next);
                      setJsonDraft(JSON.stringify(next, null, 2));
                    }}
                  />
                </label>
              </div>

              {mandate.rules.map((rule, ruleIndex) => (
                <article key={`${rule.ruleId}-${ruleIndex}`} className="rule-card">
                  <div className="propose">
                    <label className="field">
                      <span>ruleId</span>
                      <input
                        value={rule.ruleId}
                        onChange={(e) => updateRule(ruleIndex, { ruleId: e.target.value })}
                      />
                    </label>
                    <label className="field">
                      <span>effect</span>
                      <select
                        value={rule.effect}
                        onChange={(e) =>
                          updateRule(ruleIndex, {
                            effect: e.target.value as MandateRule["effect"],
                          })
                        }
                      >
                        <option value="FORBID">FORBID</option>
                        <option value="PERMIT">PERMIT</option>
                        <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>action</span>
                      <select
                        value={rule.action}
                        onChange={(e) => updateRule(ruleIndex, { action: e.target.value })}
                      >
                        <option value="APP_ACTION">APP_ACTION</option>
                        <option value="PAYMENT">PAYMENT</option>
                        <option value="SPOT_TRADE">SPOT_TRADE</option>
                        <option value="DEPLOY">DEPLOY</option>
                        <option value="DELETE">DELETE</option>
                        <option value="REFUND">REFUND</option>
                      </select>
                    </label>
                  </div>
                  <ul className="pred-list">
                    {rule.predicates.map((p, predIndex) => (
                      <li key={predIndex} className="pred-row">
                        <span className="mono small pred-summary">{predicateSummary(p)}</span>
                        <div className="propose pred-edit">
                          <label className="field">
                            <span>field</span>
                            <input
                              value={p.field}
                              onChange={(e) => setPredicate(ruleIndex, predIndex, { ...p, field: e.target.value })}
                            />
                          </label>
                          <label className="field">
                            <span>name</span>
                            <input
                              value={p.name ?? ""}
                              onChange={(e) => {
                                const nextPred: MandatePredicate = {
                                  field: p.field,
                                  operator: p.operator,
                                  ...(e.target.value ? { name: e.target.value } : {}),
                                  ...(p.values ? { values: p.values } : {}),
                                  ...(p.value !== undefined ? { value: p.value } : {}),
                                };
                                setPredicate(ruleIndex, predIndex, nextPred);
                              }}
                            />
                          </label>
                          <label className="field">
                            <span>operator</span>
                            <input
                              value={p.operator}
                              onChange={(e) =>
                                setPredicate(ruleIndex, predIndex, { ...p, operator: e.target.value })
                              }
                            />
                          </label>
                          <label className="field">
                            <span>value</span>
                            <input
                              value={
                                p.values
                                  ? p.values.join(",")
                                  : typeof p.value === "boolean"
                                    ? String(p.value)
                                    : String(p.value ?? "")
                              }
                              onChange={(e) => {
                                const raw = e.target.value;
                                const base: MandatePredicate = {
                                  field: p.field,
                                  operator: p.operator,
                                  ...(p.name ? { name: p.name } : {}),
                                };
                                if (p.operator === "IN") {
                                  setPredicate(ruleIndex, predIndex, {
                                    ...base,
                                    values: raw.split(",").map((s) => s.trim()).filter(Boolean),
                                  });
                                  return;
                                }
                                if (raw === "true" || raw === "false") {
                                  setPredicate(ruleIndex, predIndex, { ...base, value: raw === "true" });
                                  return;
                                }
                                setPredicate(ruleIndex, predIndex, { ...base, value: raw });
                              }}
                            />
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="preset-btn danger"
                    onClick={() => removeRule(ruleIndex)}
                    disabled={busy}
                  >
                    Remove rule
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">{busy ? "Loading mandate…" : "Select a game."}</p>
          )}

          <div className="game-actions">
            <button type="button" className="cta submit" disabled={!apiOk || busy || !mandate} onClick={() => void onSave()}>
              Save to disk
            </button>
            <button
              type="button"
              className="cta submit secondary"
              disabled={!apiOk || busy || !selected}
              onClick={() => void onActivate()}
            >
              Activate on API
            </button>
          </div>
        </section>
      )}

      {note && <p className="ok-note reveal">{note}</p>}
      {error && <p className="err">{error}</p>}
    </>
  );
}
