/**
 * TS port of zunno-inco `server/bot/cards.js` (itself a port of
 * `contracts/src/UnoCards.sol` decode/isPlayable). Keep in sync with the
 * Solidity card codec.
 */

export const COLOR_WILD = 4;
export const NUMBER = 0;
export const SKIP = 1;
export const REVERSE = 2;
export const DRAW_TWO = 3;
export const WILD = 4;
export const WILD_DRAW_FOUR = 5;

export interface DecodedCard {
  color: number;
  kind: number;
  number: number;
}

export function decodeCard(value: number | bigint): DecodedCard {
  const v = Number(value);
  const id = v - 1;
  if (id >= 100) {
    return { color: COLOR_WILD, kind: id < 104 ? WILD : WILD_DRAW_FOUR, number: -1 };
  }
  const color = Math.floor(id / 25);
  const w = id % 25;
  if (w === 0) return { color, kind: NUMBER, number: 0 };
  if (w <= 18) return { color, kind: NUMBER, number: Math.floor((w + 1) / 2) };
  if (w <= 20) return { color, kind: SKIP, number: -1 };
  if (w <= 22) return { color, kind: REVERSE, number: -1 };
  return { color, kind: DRAW_TWO, number: -1 };
}

export function isWild(value: number | bigint): boolean {
  return Number(value) >= 101;
}

export function isPlayable(
  played: number | bigint,
  topValue: number | bigint,
  activeColor: number,
): boolean {
  const p = decodeCard(played);
  if (p.kind === WILD || p.kind === WILD_DRAW_FOUR) return true;
  if (p.color === activeColor) return true;
  const t = decodeCard(topValue);
  if (p.kind === NUMBER && t.kind === NUMBER && p.number === t.number) return true;
  if (p.kind !== NUMBER && p.kind === t.kind) return true;
  return false;
}

/** First legal card in hand order, or null to draw. Mirrors the existing bot strategy. */
export function firstLegalCard(hand: number[], topValue: number, activeColor: number): number | null {
  for (const value of hand) {
    if (isPlayable(value, topValue, activeColor)) return value;
  }
  return null;
}
