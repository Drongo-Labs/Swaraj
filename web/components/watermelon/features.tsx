"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lightning,
  LockKey,
  Scales,
  FileCode,
  TreeStructure,
  Certificate,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { TextureButton } from "@/components/ui/texture-button";

interface FeaturePillar {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  codeSnippet: string;
  metrics: { label: string; value: string; detail: string }[];
  bulletPoints: string[];
}

const PILLARS: FeaturePillar[] = [
  {
    id: "smt-gateway",
    tabLabel: "SMT Gateway",
    title: "Deterministic Pre-Execution Authorization",
    subtitle:
      "Before an AI agent can execute any financial, operational, or infrastructure call, Swaraj compiles the intent and evaluates it against formal state constraints with the Z3 SMT solver.",
    badge: "Sub-4ms Gate",
    codeSnippet: `// Swaraj Z3 SMT Authorization Query
(assert (= action.venue "base.uniswap.v3"))
(assert (<= (* action.amount_atomic 10000) 
            (* portfolio.total_atomic policy.max_position_bps)))
(assert (<= (+ state.daily_turnover_atomic action.amount_atomic)
            policy.daily_turnover_cap_atomic))
(assert (<= action.estimated_slippage_bps policy.max_slippage_bps))
(assert (>= (- state.current_timestamp state.last_trade_time)
            policy.cooldown_seconds))

;; Result: SAT -> Capability Token Issued
;; Result: UNSAT -> Blocked with Unsat-Core Explanation`,
    metrics: [
      { label: "Evaluation Latency", value: "< 4ms", detail: "Real-time solver check" },
      { label: "Arithmetic Precision", value: "Integer", detail: "Zero floating-point drift" },
      { label: "Decision Mode", value: "Fail-Closed", detail: "Unknown inputs blocked" },
    ],
    bulletPoints: [
      "Natural language prompts cannot be bypassed: constraints are mathematical formulas.",
      "Atomic unit precision prevents precision exploit attacks and token slippage abuse.",
      "Produces actionable unsat-core explanations when an intent violates policy boundaries.",
    ],
  },
  {
    id: "zk-receipts",
    tabLabel: "Zero-Knowledge Receipts",
    title: "Portable, Cryptographic Proof of Venue Truth",
    subtitle:
      "Execution adapters submit trades and capture authentic chain artifacts. A zkVM executes the deterministic verification program, publishing aggregated validity statements to zkVerify.",
    badge: "zkVM + zkVerify",
    codeSnippet: `// Verified Execution Receipt Structure
{
  "receipt_id": "rcpt_0192e8a7f9",
  "status": "PROVED",
  "claim_type": "TRADE_EXECUTED",
  "commitments": {
    "intent_hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f",
    "policy_hash": "0x9d4e21a48c6e88a0322198b1b22e11893c834a91",
    "evidence_root": "0x5c412f8e91024bc688005e839e10fae13467bf77"
  },
  "prover": "SP1-v1.2",
  "proof_verification": {
    "network": "zkVerify",
    "statement_hash": "0x334bf8e90a...",
    "state": "FINALIZED"
  }
}`,
    metrics: [
      { label: "Receipt Finality", value: "PROVED", detail: "Cryptographic guarantee" },
      { label: "Proof Aggregator", value: "zkVerify", detail: "Portable on-chain anchors" },
      { label: "Data Exposure", value: "0% Leakage", detail: "Selective ZK commitments" },
    ],
    bulletPoints: [
      "Distinguishes clearly between ORDER_PLACED and verified TRADE_EXECUTED.",
      "Fail-closed receipt status machine: PENDING → PROVED, NON_PROVABLE, or INVALIDATED.",
      "Strategy, private balances, and sensitive trading signals remain confidential.",
    ],
  },
  {
    id: "capability-tokens",
    tabLabel: "Capability Tokens",
    title: "Single-Use, Intent-Bound Execution Permissions",
    subtitle:
      "Agents never hold standing venue private keys or master admin credentials. Swaraj mints short-lived, single-use capability tokens bound strictly to the authorized intent hash.",
    badge: "Zero Standing Privilege",
    codeSnippet: `// Short-Lived Single-Use Capability Token
{
  "token_id": "cap_88190d72",
  "intent_hash": "0x7f83b1657ff1fc...",
  "account_scope": "0x192...b4",
  "audience": "base.execution.adapter.v1",
  "expires_at_timestamp": 1793201400, // 30-second TTL
  "idempotency_key": "idem_trade_991823",
  "signature": "0x44a9bc18..."
}

// Execution Adapter Rule:
// Validates signature, audience, TTL, and exact intent hash.
// Replays or altered parameters fail immediately.`,
    metrics: [
      { label: "Token Lifespan", value: "15-30s", detail: "Strict TTL expiration" },
      { label: "Reuse Protection", value: "Durable", detail: "Single-use idempotency" },
      { label: "Credential Risk", value: "Eliminated", detail: "No agent master keys" },
    ],
    bulletPoints: [
      "If an LLM hallucinates an altered trade parameter, the signature and hash check fails.",
      "Audience-bound capabilities prevent cross-protocol delegation or unauthorized forwarding.",
      "Durable state reservations persist across engine restarts, preventing double-spend attempts.",
    ],
  },
  {
    id: "lean-proofs",
    tabLabel: "Formal Verification",
    title: "Lean 4 Mathematical Framework Proofs",
    subtitle:
      "We do not merely test code with unit suites; we mathematically prove framework-level invariants using the Lean 4 interactive theorem prover.",
    badge: "Kernel Verified",
    codeSnippet: `theorem compiler_soundness (p : Policy) (i : Intent) (s : State) :
  evalPolicy p i s = true ↔ (smtGateway.solve (compile p i s)) = SAT

theorem monotonic_restriction (p : Policy) (r : RestrictiveRule) (i : Intent) :
  permits (p + r) i → permits p i

theorem receipt_tamper_invariance (r : Receipt) (e : Evidence) :
  r.status = Status.PROVED ∧ alteredEvidence e r → 
  verifyReceipt r e = false`,
    metrics: [
      { label: "Lean Assurance", value: "Phase 10", detail: "Kernel-checked proofs" },
      { label: "Monotonic Safety", value: "Proven", detail: "No permission broadening" },
      { label: "Compiler Soundness", value: "100%", detail: "Preserves policy semantics" },
    ],
    bulletPoints: [
      "Monotonic Restriction Theorem: Adding a rule cannot inadvertently expand permissions.",
      "Lifecycle Safety Theorem: Invalid transitions (PENDING → PROVED without proof) are impossible.",
      "Verified compiler pipeline translates human-readable policies to SMT constraints faithfully.",
    ],
  },
];

export function FeaturesBlock() {
  const [activeTab, setActiveTab] = useState<string>("smt-gateway");

  const currentPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <section id="architecture" className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#f8f8f8] dark:bg-[#161616] border-t border-[#303030]/15 dark:border-[#303030]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#ff4900]/10 text-[#ff4900] border border-[#ff4900]/25 mb-4">
            <TreeStructure size={14} weight="bold" />
            <span>Verifiable Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#161616] dark:text-[#ffffff] leading-tight">
            The trust architecture that works for <span className="text-[#ff4900]">autonomous agents</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
            Natural language prompts are not security barriers. Swaraj places an unbypassable, formally verified mathematical envelope between autonomous models and irreversible execution venues.
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-6 sm:mt-8 w-full max-w-full overflow-x-auto no-scrollbar py-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl sm:rounded-full bg-[#f1f1f1] dark:bg-[#1e1e1e] border border-[#303030]/15 dark:border-[#303030]">
              {PILLARS.map((p) => {
                const isActive = activeTab === p.id;
                return (
                  <TextureButton
                    key={p.id}
                    variant={isActive ? "brand" : "minimal"}
                    size="sm"
                    className="w-auto rounded-full whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-1.5"
                    onClick={() => setActiveTab(p.id)}
                  >
                    <span>{p.tabLabel}</span>
                  </TextureButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Display Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPillar.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch"
          >
            {/* Left Column: Description & Metrics */}
            <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl border border-[#303030]/15 dark:border-[#303030] bg-white dark:bg-[#1e1e1e] p-5 sm:p-8 lg:p-10 shadow-lg">
              <div>
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-[#ff4900]/10 text-[#ff4900] border border-[#ff4900]/20">
                    {currentPillar.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#161616] dark:text-[#ffffff] tracking-tight">
                  {currentPillar.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
                  {currentPillar.subtitle}
                </p>

                {/* Bullet Points */}
                <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
                  {currentPillar.bulletPoints.map((bp, i) => (
                    <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="mt-0.5 sm:mt-1 shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ff4900]/15 text-[#ff4900] flex items-center justify-center">
                        <CheckCircle size={14} weight="bold" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#161616] dark:text-[#f8f8f8]/90 font-medium">
                        {bp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Row */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#303030]/10 dark:border-[#303030] grid grid-cols-3 gap-2 sm:gap-4 text-center">
                {currentPillar.metrics.map((m, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-lg sm:text-2xl font-black text-[#ff4900]">
                      {m.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#161616] dark:text-white mt-0.5">
                      {m.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#303030]/60 dark:text-[#f1f1f1]/50 mt-0.5 hidden sm:block">
                      {m.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Code & Verifier Visualizer */}
            <div className="lg:col-span-6 flex flex-col rounded-3xl border border-[#303030]/20 dark:border-[#303030] bg-[#161616] text-white p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#303030] text-xs text-[#f1f1f1]/60">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#f1f1f1]/80 truncate">
                    swaraj://core-verifier/{currentPillar.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#ff4900] font-mono font-semibold">
                    <ShieldCheck size={14} weight="bold" />
                    <span>FORMAL GATE ACTIVE</span>
                  </span>
                </div>
              </div>

              {/* Code Editor Box */}
              <div className="flex-1 mt-4 overflow-x-auto font-mono text-[11px] sm:text-xs text-[#f1f1f1]/90 leading-relaxed bg-[#111111] p-3 sm:p-4 rounded-xl border border-[#303030]/60">
                <pre>{currentPillar.codeSnippet}</pre>
              </div>

              {/* Bottom Proof Strip */}
              <div className="mt-4 pt-4 border-t border-[#303030] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-[#f1f1f1]/70">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Certificate size={16} className="text-[#ff4900] shrink-0" weight="duotone" />
                  <span>Deterministic Assurance: SP1 / Lean4 / Z3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px]">100% Deterministic Guarantee</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Comparison Section */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161616] dark:text-[#ffffff] leading-tight">
              Autonomous Agents: The Dangerous Status Quo vs. Swaraj
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#303030]/80 dark:text-[#f1f1f1]/70 leading-relaxed">
              Why leading crypto funds, enterprises, and multi-agent builders replace prompt-only instructions with mathematical authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Left Card: Status Quo (Chaotic / Broken) */}
            <div className="rounded-2xl sm:rounded-3xl border border-red-500/20 bg-red-500/5 p-5 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                    <XCircle size={16} weight="bold" />
                    Unchecked Agent Risk
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-red-400">STATUS: VULNERABLE</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#161616] dark:text-white mb-4">
                  &ldquo;Only spend $100 per day&rdquo; written in a system prompt
                </h4>
                <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#303030]/80 dark:text-[#f1f1f1]/70">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Prompt injection or jailbreak tricks the agent into transferring treasury funds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Agent holds standing API keys and unconstrained private keys with unrestricted execution privileges.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>No post-execution proof: the agent&apos;s internal report can hallucinate success or falsify fill prices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>Floating-point calculation errors cause rounding exploit vulnerabilities.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-red-500/20 text-xs font-semibold text-red-500">
                Failure Mode: Catastrophic treasury drain or rogue protocol interaction.
              </div>
            </div>

            {/* Right Card: Swaraj (Secure / Orange Brand) */}
            <div className="rounded-2xl sm:rounded-3xl border border-[#ff4900]/40 bg-linear-to-br from-[#ff4900] to-[#e63e00] text-white p-5 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                    <CheckCircle size={16} weight="fill" />
                    Formal Authorization with Swaraj
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                    UNBYPASSABLE
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Mathematical runtime gates + cryptographic evidence receipts
                </h4>
                <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} weight="bold" className="mt-0.5 text-white shrink-0" />
                    <span>SMT gate blocks any intent exceeding integer caps prior to dispatch.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} weight="bold" className="mt-0.5 text-white shrink-0" />
                    <span>Short-lived single-use capability tokens replace permanent admin credentials.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} weight="bold" className="mt-0.5 text-white shrink-0" />
                    <span>zkVM verifies authentic venue artifacts, issuing signed PROVED receipts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} weight="bold" className="mt-0.5 text-white shrink-0" />
                    <span>Lean 4 verified compiler ensures zero discrepancy between policy and execution logic.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 text-xs font-bold text-white/95 flex flex-wrap items-center justify-between gap-2">
                <span>Result: Absolute safety for high-stakes capital &amp; operations.</span>
                <span className="font-mono">100% SATISFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
