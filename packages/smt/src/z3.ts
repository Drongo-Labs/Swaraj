import { init } from "z3-solver";
import type { BoolTerm, FieldBinding, IntTerm } from "./policy.js";

export type SatVerdict = "sat" | "unsat" | "unknown";

/** Minimal structural contracts for the pieces of the Z3 binding we use. */
interface Z3Int {
  add(other: Z3Int): Z3Int;
  sub(other: Z3Int): Z3Int;
  mul(other: Z3Int): Z3Int;
  eq(other: Z3Int): Z3Bool;
  lt(other: Z3Int): Z3Bool;
  le(other: Z3Int): Z3Bool;
  gt(other: Z3Int): Z3Bool;
  ge(other: Z3Int): Z3Bool;
}

interface Z3Bool {}

interface Z3Solver {
  add(formula: Z3Bool): void;
  push(): void;
  pop(): void;
  check(): Promise<string>;
  setParameters?(params: Record<string, unknown>): void;
}

interface Z3Context {
  Int: {
    const(name: string): Z3Int;
    val(value: string | number | bigint): Z3Int;
  };
  And(...parts: Z3Bool[]): Z3Bool;
  Or(...parts: Z3Bool[]): Z3Bool;
  Not(part: Z3Bool): Z3Bool;
  Implies(when: Z3Bool, then: Z3Bool): Z3Bool;
  Solver: new () => Z3Solver;
}

type Z3Module = {
  Context: (name: string) => Z3Context;
};

let bootstrap: Promise<{ Context: (name: string) => Z3Context }> | undefined;

async function loadZ3(): Promise<{ Context: (name: string) => Z3Context }> {
  bootstrap ??= (async () => {
    const loaded = await init();
    return loaded as unknown as Z3Module;
  })();
  return bootstrap;
}

/** One Z3 session with a hard timeout. "unknown" must be treated as unsafe, never as satisfied. */
export class SatSession {
  private readonly fields = new Map<string, Z3Int>();

  private constructor(
    private readonly ctx: Z3Context,
    private readonly solver: Z3Solver,
  ) {}

  static async open(fieldNames: Iterable<string>, timeoutMs = 5_000): Promise<SatSession> {
    const { Context } = await loadZ3();
    const ctx = Context("swaraj");
    const solver = new ctx.Solver();
    solver.setParameters?.({ timeout: timeoutMs });
    const session = new SatSession(ctx, solver);
    for (const name of fieldNames) {
      session.fields.set(name, ctx.Int.const(name));
    }
    return session;
  }

  private field(name: string): Z3Int {
    const found = this.fields.get(name);
    if (!found) throw new Error(`field ${name} was not declared`);
    return found;
  }

  private buildInt(term: IntTerm): Z3Int {
    switch (term.kind) {
      case "const":
        return this.ctx.Int.val(term.value.toString());
      case "field":
        return this.field(term.name);
      case "sum":
        return term.parts
          .slice(1)
          .reduce((acc, part) => acc.add(this.buildInt(part)), this.buildInt(term.parts[0]!));
      case "prod":
        return term.parts
          .slice(1)
          .reduce((acc, part) => acc.mul(this.buildInt(part)), this.buildInt(term.parts[0]!));
      case "diff":
        return this.buildInt(term.left).sub(this.buildInt(term.right));
    }
  }

  buildBool(term: BoolTerm): Z3Bool {
    const ctx = this.ctx;
    switch (term.kind) {
      case "compare": {
        const left = this.buildInt(term.left);
        const right = this.buildInt(term.right);
        switch (term.op) {
          case "eq":
            return left.eq(right);
          case "ne":
            return ctx.Not(left.eq(right));
          case "lt":
            return left.lt(right);
          case "le":
            return left.le(right);
          case "gt":
            return left.gt(right);
          case "ge":
            return left.ge(right);
        }
      }
      case "all":
        return ctx.And(...term.parts.map((part) => this.buildBool(part)));
      case "any":
        return ctx.Or(...term.parts.map((part) => this.buildBool(part)));
      case "not":
        return ctx.Not(this.buildBool(term.part));
      case "implies":
        return ctx.Implies(this.buildBool(term.when), this.buildBool(term.then));
    }
  }

  assert(term: BoolTerm): void {
    this.solver.add(this.buildBool(term));
  }

  /** Incremental solving: assert a scoped block, check, then pop it. */
  push(): void {
    this.solver.push();
  }

  pop(): void {
    this.solver.pop();
  }

  assertBinding(binding: FieldBinding): void {
    for (const [name, value] of binding) {
      this.assert({
        kind: "compare",
        op: "eq",
        left: { kind: "field", name },
        right: { kind: "const", value },
      });
    }
  }

  async check(): Promise<SatVerdict> {
    try {
      const verdict = await this.solver.check();
      if (verdict === "sat") return "sat";
      if (verdict === "unsat") return "unsat";
      return "unknown";
    } catch {
      return "unknown";
    }
  }
}
