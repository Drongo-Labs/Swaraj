import { decodeCard, isPlayable, isWild, NUMBER, SKIP, REVERSE, DRAW_TWO, WILD, WILD_DRAW_FOUR } from "../zunno/cards.js";

/**
 * Two-player UNO engine. Same card codec as ZunnoInco.sol / zunno-inco's
 * cards.js: values 1..108, colors 0..3, wilds 101..104, wild-draw-four
 * 105..108. The engine is authoritative state: it owns both hands, and the
 * UI only ever receives the requesting player's hand plus public state.
 */

export type Seat = "human" | "agent";
export const other = (seat: Seat): Seat => (seat === "human" ? "agent" : "human");

export interface GameLogEntry {
  seat: Seat | "game";
  text: string;
  blocked?: boolean;
}

export interface EngineState {
  hands: Record<Seat, number[]>;
  drawPile: number[];
  discard: number[];
  activeColor: number;
  turn: Seat;
  winner: Seat | null;
  log: GameLogEntry[];
}

export function buildDeck(): number[] {
  const deck: number[] = [];
  for (let color = 0; color < 4; color++) {
    for (let w = 0; w < 25; w++) deck.push(color * 25 + w + 1); // 0, 1-9 ×2, skip, reverse, draw-two
  }
  for (let v = 101; v <= 108; v++) deck.push(v); // wilds + wild draw four
  return deck;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export class UnoEngine {
  readonly state: EngineState;

  constructor(state?: EngineState) {
    this.state = state ?? UnoEngine.newState();
  }

  static newState(): EngineState {
    const deck = shuffle(buildDeck());
    const hands: Record<Seat, number[]> = {
      human: deck.splice(0, 7),
      agent: deck.splice(0, 7),
    };
    // Flip cards until the start card is a plain number (standard rule).
    let top = deck.shift()!;
    while (decodeCard(top).kind !== NUMBER) {
      deck.push(top);
      top = deck.shift()!;
    }
    return {
      hands,
      drawPile: deck,
      discard: [top],
      activeColor: decodeCard(top).color,
      turn: "human",
      winner: null,
      log: [{ seat: "game", text: `Game on — you start. Top card: ${cardLabel(top)}.` }],
    };
  }

  get topValue(): number {
    return this.state.discard.at(-1)!;
  }

  hand(seat: Seat): number[] {
    return this.state.hands[seat];
  }

  playableIndices(seat: Seat): number[] {
    return this.state.hands[seat]
      .map((value, index) => ({ value, index }))
      .filter(({ value }) => isPlayable(value, this.topValue, this.state.activeColor))
      .map(({ index }) => index);
  }

  log(seat: Seat | "game", text: string, blocked = false): void {
    this.state.log.push({ seat, text, blocked });
  }

  /** A table penalty, such as a missed Zunno call: the seat draws without the turn changing. */
  penalize(seat: Seat, count: number, why: string): void {
    const drawn = this.drawCards(seat, count);
    this.log(seat, `${why} Drew ${drawn.length} as a penalty.`);
  }

  private drawCards(seat: Seat, count: number): number[] {
    const drawn: number[] = [];
    for (let i = 0; i < count; i++) {
      if (this.state.drawPile.length === 0) {
        const top = this.state.discard.pop()!;
        this.state.drawPile = shuffle(this.state.discard);
        this.state.discard = [top];
        if (this.state.drawPile.length === 0) break;
        this.log("game", "Draw pile empty — discards reshuffled.");
      }
      const card = this.state.drawPile.shift();
      if (card === undefined) break;
      this.state.hands[seat].push(card);
      drawn.push(card);
    }
    return drawn;
  }

  /** Returns null on success, or a human-readable rejection reason. */
  play(seat: Seat, handIndex: number, chosenColor?: number): string | null {
    if (this.state.winner) return "Game is over.";
    if (this.state.turn !== seat) return "Not your turn.";
    const hand = this.state.hands[seat];
    const card = hand[handIndex];
    if (card === undefined) return "No such card in hand.";
    if (!isPlayable(card, this.topValue, this.state.activeColor)) {
      return `${cardLabel(card)} does not match the discard pile.`;
    }
    const decoded = decodeCard(card);
    let color = decoded.color;
    if (decoded.kind === WILD || decoded.kind === WILD_DRAW_FOUR) {
      color = chosenColor !== undefined && chosenColor >= 0 && chosenColor <= 3 ? chosenColor : 0;
    }
    hand.splice(handIndex, 1);
    this.state.discard.push(card);
    this.state.activeColor = color;
    this.log(seat, `${seat === "human" ? "You" : "Agent"} played ${cardLabel(card)}${color !== decoded.color ? ` → ${COLORS[color]}` : ""}.`);

    if (hand.length === 0) {
      this.state.winner = seat;
      this.log("game", `${seat === "human" ? "You win" : "Agent wins"} the game.`);
      return null;
    }
    // Effects: skip and reverse both mean "go again" in two-player UNO.
    if (decoded.kind === SKIP || decoded.kind === REVERSE) {
      this.log("game", `${other(seat) === "human" ? "You are" : "Agent is"} skipped.`);
      return null; // same player keeps the turn
    }
    if (decoded.kind === DRAW_TWO) {
      const drawn = this.drawCards(other(seat), 2);
      this.log("game", `${other(seat) === "human" ? "You draw" : "Agent draws"} ${drawn.length} and is skipped.`);
      return null;
    }
    if (decoded.kind === WILD_DRAW_FOUR) {
      const drawn = this.drawCards(other(seat), 4);
      this.log("game", `${other(seat) === "human" ? "You draw" : "Agent draws"} ${drawn.length} and is skipped.`);
      return null;
    }
    this.state.turn = other(seat);
    return null;
  }

  /** Draw one card; the turn passes (simple variant). False = not allowed / pile exhausted. */
  draw(seat: Seat): boolean {
    if (this.state.winner || this.state.turn !== seat) return false;
    const drawn = this.drawCards(seat, 1);
    if (drawn.length === 0) return false;
    this.log(seat, `${seat === "human" ? "You" : "Agent"} drew a card.`);
    this.state.turn = other(seat);
    return true;
  }

  /** Public view for a player: own hand, opponent hand count, public state. */
  publicView(seat: Seat): {
    yourHand: { index: number; value: number; label: string; playable: boolean; wild: boolean }[];
    opponentCount: number;
    top: { value: number; label: string };
    activeColor: string;
    turn: Seat;
    winner: Seat | null;
    log: GameLogEntry[];
  } {
    const hand = this.state.hands[seat];
    const playable = new Set(this.playableIndices(seat));
    return {
      yourHand: hand.map((value, index) => ({
        index,
        value,
        label: cardLabel(value),
        playable: playable.has(index),
        wild: isWild(value),
      })),
      opponentCount: this.state.hands[other(seat)].length,
      top: { value: this.topValue, label: cardLabel(this.topValue) },
      activeColor: COLORS[this.state.activeColor] ?? "?",
      turn: this.state.turn,
      winner: this.state.winner,
      log: this.state.log,
    };
  }
}

export const COLORS = ["Red", "Green", "Blue", "Yellow"] as const;

export function cardLabel(value: number): string {
  const card = decodeCard(value);
  const color = card.color === 4 ? "" : COLORS[card.color]![0];
  switch (card.kind) {
    case NUMBER: return `${color}${card.number}`;
    case SKIP: return `${color}Skip`;
    case REVERSE: return `${color}Reverse`;
    case DRAW_TWO: return `${color}+2`;
    case WILD: return "Wild";
    case WILD_DRAW_FOUR: return "Wild+4";
    default: return "?";
  }
}
