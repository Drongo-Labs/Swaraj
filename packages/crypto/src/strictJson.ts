import type { CanonicalValue } from "./types.js";

/**
 * Parses JSON text into a CanonicalValue, rejecting what JSON.parse silently accepts:
 * duplicate keys, floats/exponents, `null`, and integers outside the safe range.
 */
export function parseStrictJson(text: string): CanonicalValue {
  let i = 0;
  const err = (why: string): never => {
    throw new Error(`invalid canonical JSON at offset ${i}: ${why}`);
  };
  const ws = () => {
    while (i < text.length && " \t\n\r".includes(text[i] as string)) i++;
  };
  const string = (): string => {
    const start = i++;
    while (i < text.length && text[i] !== '"') i += text[i] === "\\" ? 2 : 1;
    if (i >= text.length) err("unterminated string");
    i++;
    const decoded: unknown = JSON.parse(text.slice(start, i));
    return decoded as string;
  };
  const value = (depth: number): CanonicalValue => {
    if (depth > 64) err("nesting too deep");
    ws();
    const c = text[i];
    if (c === '"') return string();
    if (c === "{") {
      i++;
      const out: Record<string, CanonicalValue> = {};
      ws();
      if (text[i] === "}") return i++, out;
      for (;;) {
        ws();
        if (text[i] !== '"') err("expected key");
        const key = string();
        if (Object.prototype.hasOwnProperty.call(out, key)) err(`duplicate key "${key}"`);
        ws();
        if (text[i++] !== ":") err("expected ':'");
        Object.defineProperty(out, key, { value: value(depth + 1), enumerable: true, writable: true, configurable: true });
        ws();
        const next = text[i++];
        if (next === "}") return out;
        if (next !== ",") err("expected ',' or '}'");
      }
    }
    if (c === "[") {
      i++;
      const out: CanonicalValue[] = [];
      ws();
      if (text[i] === "]") return i++, out;
      for (;;) {
        out.push(value(depth + 1));
        ws();
        const next = text[i++];
        if (next === "]") return out;
        if (next !== ",") err("expected ',' or ']'");
      }
    }
    if (text.startsWith("true", i)) return (i += 4), true;
    if (text.startsWith("false", i)) return (i += 5), false;
    if (text.startsWith("null", i)) return err("null is not allowed");
    const number = /^-?(0|[1-9][0-9]*)(?![0-9.eE])/.exec(text.slice(i, i + 40));
    if (!number) return err("floats, exponents and malformed values are not allowed");
    const n = Number(number[0]);
    if (!Number.isSafeInteger(n) || Object.is(n, -0)) err("unsafe integer (use a decimal string)");
    i += number[0].length;
    return n;
  };
  const result = value(0);
  ws();
  if (i !== text.length) err("trailing characters");
  return result;
}
