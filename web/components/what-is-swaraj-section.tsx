"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  SlidersHorizontal,
  Cpu,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface WhatIsSwarajSectionProps {
  onContactClick?: () => void;
}

export function WhatIsSwarajSection({ onContactClick }: WhatIsSwarajSectionProps) {
  const [activeScenario, setActiveScenario] = useState<"allowed" | "blocked">("allowed");

  return (
    <section
      id="what-swaraj-is"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-white dark:bg-[#161616] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Core Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-[#161616] dark:text-white">
              What is Swaraj?
            </h2>

            {/* Body */}
            <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              The owner writes a mandate. The agent proposes what it wants to do. Swaraj allows or blocks that action <strong className="font-semibold text-[#161616] dark:text-white">before it executes</strong> then records the decision.
            </p>

            {/* Soft limits become real enforcement banner */}
            <div className="mt-8 p-5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#ff4900] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <ShieldCheck size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#161616] dark:text-white tracking-tight">
                    Soft limits become real enforcement.
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    <em>&ldquo;Please don&apos;t spend more than $1,000&rdquo;</em> is a suggestion to a model and it is vulnerable to jailbreaks, drift, and hallucination. Swaraj turns it into a rigid pre-execution gate. And the gate isn&apos;t just tested, its core properties are <strong className="font-semibold text-[#161616] dark:text-white">proven</strong>, machine-checked in Lean 4.
                  </p>
                </div>
              </div>
            </div>

            {/* Three pills */}
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-[#161616] dark:text-white">Owner-authored mandate</span>
                <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                <span className="text-neutral-600 dark:text-neutral-300">versioned, revisable by the owner, untouchable by the agent</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-[#161616] dark:text-white">Pre-execution gate</span>
                <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                <span className="text-neutral-600 dark:text-neutral-300">Z3 decision engine over a Lean-proven core; default-deny, fail-closed</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-black/10 dark:border-[#303030] text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-[#161616] dark:text-white">Proof-carrying receipts</span>
                <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">—</span>
                <span className="text-neutral-600 dark:text-neutral-300">a signed record of every decision, promoted from PENDING to PROVED by an attached zkVM proof</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Interactive Authorization Plane Architecture */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] p-5 sm:p-7 shadow-xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-[#303030]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                    Swaraj Authorization Flow
                  </span>
                </div>
                {/* Scenario Toggle */}
                <div className="flex items-center p-0.5 rounded-full bg-white dark:bg-[#121212] border border-black/10 dark:border-[#303030]">
                  <button
                    onClick={() => setActiveScenario("allowed")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                      activeScenario === "allowed"
                        ? "bg-[#ff4900] text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                    )}
                  >
                    Within Policy
                  </button>
                  <button
                    onClick={() => setActiveScenario("blocked")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                      activeScenario === "blocked"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                    )}
                  >
                    Over The Line
                  </button>
                </div>
              </div>

              {/* Step 1: Owner Mandate */}
              <div className="mt-5 p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-black/10 dark:border-[#303030]/80">
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal size={14} className="text-[#ff4900]" />
                    1. OWNER SETS MANDATE — ACTIVE RULES
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 space-y-1">
                  <div>mandate v2: per-purchase cap &le; 100_000_000_000</div>
                  <div>venues = [&quot;Uniswap-V3&quot;, &quot;Stripe-Billing&quot;]</div>
                </div>
              </div>

              {/* Flow arrow down */}
              <div className="flex justify-center my-2 text-neutral-400 dark:text-neutral-600">
                <span className="text-xs font-mono">&darr; agent proposes intent</span>
              </div>

              {/* Step 2: Agent Proposal */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#202020] border border-black/10 dark:border-[#303030]/80"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Cpu size={14} className="text-[#ff4900]" />
                      2. AGENT PROPOSES ACTION — UNEXECUTED
                    </span>
                  </div>
                  {activeScenario === "allowed" ? (
                    <div className="text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 space-y-1">
                      <div>action: SPOT_TRADE &nbsp;&middot;&nbsp; resource: Uniswap-V3</div>
                      <div>amount: 450_000_000 (atomic units = $450.00)</div>
                      <div className="text-neutral-500 dark:text-neutral-400">agent: portfolio-bot-7 &nbsp;&middot;&nbsp; idempotencyKey: 0x9f…</div>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm font-mono text-neutral-800 dark:text-neutral-200 space-y-1">
                      <div>action: SPOT_TRADE &nbsp;&middot;&nbsp; resource: Unknown-Bridge</div>
                      <div>amount: 250_000_000_000 (atomic units = $250,000.00)</div>
                      <div className="text-neutral-500 dark:text-neutral-400">agent: portfolio-bot-7 &nbsp;&middot;&nbsp; idempotencyKey: 0x3a…</div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Flow arrow down */}
              <div className="flex justify-center my-2 text-center text-neutral-400 dark:text-neutral-500 px-2">
                <span className="text-[11px] sm:text-xs font-mono text-[#ff4900] leading-snug">
                  &darr; Swaraj pre-execution check — Z3 evaluates, forbid rules win, no matching permit = blocked &darr;
                </span>
              </div>

              {/* Step 3: Swaraj Decision & Record */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    activeScenario === "allowed"
                      ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/30 text-rose-900 dark:text-rose-200"
                  )}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      {activeScenario === "allowed" ? (
                        <>
                          <CheckCircle size={16} weight="fill" className="text-emerald-600 dark:text-emerald-400" />
                          3. SWARAJ: ACTION ALLOWED — PERMIT ISSUED
                        </>
                      ) : (
                        <>
                          <XCircle size={16} weight="fill" className="text-rose-600 dark:text-rose-400" />
                          3. SWARAJ: ACTION BLOCKED
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-sans mb-3 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {activeScenario === "allowed"
                      ? "Intent satisfies every rule. A single-use capability token is released (60-second TTL, consumed on execution)."
                      : "Intent violates mandate v2 (per-purchase cap exceeded and unpermitted venue). Blocked with the exact rule named, and nothing executes."}
                  </p>

                  <div className="pt-2.5 border-t border-current/15 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono">
                    <span className="flex items-center gap-1 font-semibold">
                      <FileText size={13} />
                      Receipt #rcpt_{activeScenario === "allowed" ? "0847f2" : "blocked_091a"} — DECISION RECORDED
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      status: PENDING &rarr; <strong className="font-bold text-[#ff4900] dark:text-[#ff6b2c]">PROVED</strong> once zkVM proof is attached
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Explanatory note */}
              <div className="mt-3.5 text-center text-xs text-neutral-500 dark:text-neutral-400 italic">
                Over the line? Same flow, opposite ending — blocked with the exact rule named, and nothing executes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
