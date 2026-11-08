import type { Seat, UnoEngine } from "./engine.js";

/**
 * The agent's seat at the table: its own hand and the public state, nothing
 * else. The rules engine may run in this process (tests) or in a separate
 * enclave process reached over HTTP with the agent's token, so the agent can
 * never read the human's hand.
 */

export interface AgentView {
  hand: number[];
  topValue: number;
  activeColor: number;
  turn: Seat;
  winner: Seat | null;
}

export interface AgentTable {
  view(): Promise<AgentView>;
  play(handIndex: number, chosenColor?: number): Promise<string | null>;
  draw(): Promise<boolean>;
  /** Writes to the public game log, e.g. a blocked move. */
  log(text: string, blocked: boolean): Promise<void>;
}

export function agentView(engine: UnoEngine): AgentView {
  return {
    hand: [...engine.hand("agent")],
    topValue: engine.topValue,
    activeColor: engine.state.activeColor,
    turn: engine.state.turn,
    winner: engine.state.winner,
  };
}

export function localTable(engine: UnoEngine): AgentTable {
  return {
    view: async () => agentView(engine),
    play: async (handIndex, chosenColor) => engine.play("agent", handIndex, chosenColor),
    draw: async () => engine.draw("agent"),
    log: async (text, blocked) => engine.log("agent", text, blocked),
  };
}

export function remoteTable(enclave: URL, token: string, fetchImpl: typeof fetch = fetch): AgentTable {
  const call = async (path: string, body?: unknown) => {
    const response = await fetchImpl(new URL(path, enclave), {
      method: body === undefined ? "GET" : "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) throw new Error(`enclave ${path}: ${response.status}`);
    return response.json() as Promise<Record<string, unknown>>;
  };
  return {
    view: async () => (await call("/agent/view")) as unknown as AgentView,
    play: async (handIndex, chosenColor) =>
      (await call("/agent/play", { handIndex, chosenColor })).error as string | null,
    draw: async () => (await call("/agent/draw", {})).ok === true,
    log: async (text, blocked) => {
      await call("/agent/log", { text, blocked });
    },
  };
}
