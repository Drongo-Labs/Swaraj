import { shortHash } from "./api.js";

export function Hash({ value, label }: { value: string | undefined; label: string }) {
  if (!value) return <span className="muted">—</span>;
  return (
    <button
      type="button"
      className="hash"
      title={`${label}: ${value}`}
      onClick={() => void navigator.clipboard?.writeText(value)}
    >
      <span className="mono">{shortHash(value)}</span>
      <span className="hash-hint">copy</span>
    </button>
  );
}
