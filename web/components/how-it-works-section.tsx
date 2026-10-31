"use client";

import React from "react";
import {
  FileCode,
  ShieldCheck,
  Receipt,
  CheckCircle,
  XCircle,
  Key,
} from "@phosphor-icons/react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

interface HowItWorksSectionProps {
  onContactClick?: () => void;
}

export function HowItWorksSection({ onContactClick }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#f8f8f8] dark:bg-[#121212] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] transition-colors duration-300 overflow-hidden"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-[#161616] dark:text-white">
            How it works
          </h2>
        </div>

        {/* The Three Beats Grid with Aceternity CardSpotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* BEAT 1: Propose */}
          <CardSpotlight
            className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-800 bg-black hover:border-[#ff4900]/40 transition-colors group"
            radius={350}
            color="#262626"
            colors={[
              [255, 73, 0],
              [255, 115, 0],
            ]}
          >
            <div className="relative z-20 flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff4900] text-white shadow-xs">
                    Step 01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-[#ff4900] transition-colors">
                    <FileCode size={18} weight="bold" />
                  </div>
                </div>

                {/* Title & Copy */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2.5">
                  Step 01 — Propose
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  The agent submits a structured intent. No free text reaches the gate.
                </p>
              </div>

              {/* Visual Artifact: Structured Action Card */}
              <div className="mt-6 pt-5 border-t border-[#27282d]">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider font-semibold border-b border-white/10 pb-1.5">
                    <span>Field</span>
                    <span className="text-[#ff4900]">Example</span>
                  </div>
                  <div className="space-y-2 pt-1 text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">who</span>
                      <span className="font-semibold text-white">portfolio-bot-7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">what</span>
                      <span className="font-semibold text-white">SPOT_TRADE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 font-bold">on what</span>
                      <span className="font-semibold text-white">uniswap-v3</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 pt-1 border-t border-white/5">
                      <span className="text-neutral-400 font-bold">conditions</span>
                      <span className="font-semibold text-[#ff4900] text-[11px]">amount: 450_000_000 (atomic units)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardSpotlight>

          {/* BEAT 2: Authorize */}
          <CardSpotlight
            className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-800 bg-black hover:border-[#ff4900]/40 transition-colors group"
            radius={350}
            color="#262626"
            colors={[
              [255, 73, 0],
              [255, 115, 0],
            ]}
          >
            <div className="relative z-20 flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff4900] text-white shadow-xs">
                    Step 02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-[#ff4900] transition-colors">
                    <ShieldCheck size={18} weight="bold" />
                  </div>
                </div>

                {/* Title & Copy */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2.5">
                  Step 02 — Authorize
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Swaraj checks the intent against the owner&apos;s mandate: permit and forbid rules, default deny, fail-closed. Within policy &rarr; allowed. Over the line &rarr; blocked, with the rule that fired.
                </p>
              </div>

              {/* Visual Artifact: Policy Check Box */}
              <div className="mt-6 pt-5 border-t border-[#27282d] flex flex-col gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-mono">
                  {/* Within Policy */}
                  <div className="p-2 rounded-xl text-[#86efac] flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20">
                    <span className="flex items-center gap-1.5 font-sans font-semibold text-xs">
                      <CheckCircle size={15} weight="fill" className="text-[#4ade80]" />
                      Within policy
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider bg-[#16a34a] text-white px-2 py-0.5 rounded shadow-xs">
                      Allowed &rarr;
                    </span>
                  </div>
                  {/* Over the Line */}
                  <div className="p-2 rounded-xl text-[#fca5a5] flex items-center justify-between bg-rose-950/20 border border-rose-500/20">
                    <span className="flex items-center gap-1.5 font-sans font-semibold text-xs">
                      <XCircle size={15} weight="fill" className="text-[#f87171]" />
                      Over the line
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider bg-[#dc2626] text-white px-2 py-0.5 rounded shadow-xs">
                      Blocked + Rule Fired
                    </span>
                  </div>
                </div>

                {/* Lean theorem callout */}
                <div className="p-2.5 rounded-xl bg-[#ff4900]/10 border border-[#ff4900]/25 text-[11px] text-neutral-200 leading-snug">
                  Behind the Z3 decision sits a <strong className="text-white font-semibold">Lean-proven core</strong>: <em>no execution without an explicit ALLOW</em> is a theorem, not a code review.
                </div>
              </div>
            </div>
          </CardSpotlight>

          {/* BEAT 3: Execute & record */}
          <CardSpotlight
            className="flex flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-800 bg-black hover:border-[#ff4900]/40 transition-colors group"
            radius={350}
            color="#262626"
            colors={[
              [255, 73, 0],
              [255, 115, 0],
            ]}
          >
            <div className="relative z-20 flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ff4900] text-white shadow-xs">
                    Step 03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-[#ff4900] transition-colors">
                    <Receipt size={18} weight="bold" />
                  </div>
                </div>

                {/* Title & Copy */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2.5">
                  Step 03 — Execute &amp; record
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Only allowed actions release a one-shot capability token (60s TTL). Every decision — ALLOW or BLOCK — becomes a signed receipt bound to the intent hash, the mandate version, and the rules that fired. A proof worker generates a zkVM proof and promotes the receipt to PROVED.
                </p>
              </div>

              {/* Visual Artifact: Permit + Receipt Badge */}
              <div className="mt-6 pt-5 border-t border-[#27282d] flex flex-col gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Key size={14} className="text-[#ff4900]" />
                      <span>One-Shot Capability Token</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff4900] text-white font-bold shadow-xs">
                      60s TTL
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Receipt size={14} className="text-[#4ade80]" />
                      <span>Signed Receipt</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#16a34a] text-white font-bold shadow-xs">
                      PENDING &rarr; PROVED
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-neutral-300 leading-snug font-mono">
                  zkVM proof worker attaches SP1 proof &bull; bound to intent hash &amp; active mandate
                </div>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </div>
    </section>
  );
}
