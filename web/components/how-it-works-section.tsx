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
            How it works?
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
                  1. Propose
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Agent submits a clear, structured action (what, how much, where).
                </p>
              </div>

              {/* Visual Artifact: Structured Action Card */}
              <div className="mt-6 pt-5 border-t border-[#27282d]">
                <div className="p-3.5 rounded-2xl font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 uppercase tracking-wider">
                    <span>Structured Intent</span>
                    <span className="text-[#ff4900]">Payload</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">what</span>
                      <span className="font-semibold text-white">&ldquo;Transfer USDC&rdquo;</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">how much</span>
                      <span className="font-semibold text-[#ff4900]">$450.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">where</span>
                      <span className="font-semibold text-white">base.uniswap.v3</span>
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
                  2. Authorize
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Swaraj checks it against the owner’s policy. Over the line &rarr; blocked, with a reason. Within policy &rarr; allowed.
                </p>
              </div>

              {/* Visual Artifact: Policy Check Box */}
              <div className="mt-6 pt-5 border-t border-[#27282d]">
                <div className="p-3.5 rounded-2xl space-y-2 text-xs font-mono">
                  {/* Within Policy */}
                  <div className="p-2.5 rounded-xl text-[#86efac] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-sans font-semibold">
                      <CheckCircle size={15} weight="fill" className="text-[#4ade80]" />
                      Within policy
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider bg-[#16a34a] text-white px-2 py-0.5 rounded shadow-xs">
                      Allowed &rarr;
                    </span>
                  </div>
                  {/* Over the Line */}
                  <div className="p-2.5 rounded-xl  text-[#fca5a5] flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-sans font-semibold">
                      <XCircle size={15} weight="fill" className="text-[#f87171]" />
                      Over the line
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wider bg-[#dc2626] text-white px-2 py-0.5 rounded shadow-xs">
                      Blocked + Reason
                    </span>
                  </div>
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
                  3. Execute &amp; record
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Only allowed actions get a short-lived permit to run. Every decision is kept as a receipt.
                </p>
              </div>

              {/* Visual Artifact: Permit + Receipt Badge */}
              <div className="mt-6 pt-5 border-t border-[#27282d]">
                <div className="p-3.5 rounded-2xl space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Key size={14} className="text-[#ff4900]" />
                      <span>One-Shot Permit</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#ff4900] text-white font-bold shadow-xs">
                      TTL 30s
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Receipt size={14} className="text-[#4ade80]" />
                      <span>Decision Receipt</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#16a34a] text-white font-bold shadow-xs">
                      Recorded
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </div>
    </section>
  );
}
