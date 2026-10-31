"use client";

import React from "react";
import {
  TrendUp,
  CurrencyDollar,
  Terminal,
} from "@phosphor-icons/react";

interface WhoItsForSectionProps {
  onContactClick?: () => void;
}

export function WhoItsForSection({ onContactClick }: WhoItsForSectionProps) {
  return (
    <section
      id="who-its-for"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-white dark:bg-[#161616] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle radial ambient highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.14] text-[#161616] dark:text-white">
            Who it&apos;s for?
          </h2>
          <p className="mt-4 text-base sm:text-xl text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
            For teams whose agents can move money, ship code, or change real systems.
          </p>
        </div>

        {/* Short Examples Grid (One line each — not a catalog) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Example 1: Trading agents */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] p-6 sm:p-7 shadow-xs hover:border-[#ff4900]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#252525] border border-black/10 dark:border-[#303030] flex items-center justify-center text-[#ff4900] mb-5 shadow-xs group-hover:scale-105 transition-transform">
                <TrendUp size={24} weight="bold" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#161616] dark:text-white leading-snug">
                <strong className="font-black text-[#161616] dark:text-white">Trading agents</strong> with spend and venue limits
              </h3>
            </div>
          </div>

          {/* Example 2: Payment & refund agents */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] p-6 sm:p-7 shadow-xs hover:border-[#ff4900]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#252525] border border-black/10 dark:border-[#303030] flex items-center justify-center text-[#ff4900] mb-5 shadow-xs group-hover:scale-105 transition-transform">
                <CurrencyDollar size={24} weight="bold" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#161616] dark:text-white leading-snug">
                <strong className="font-black text-[#161616] dark:text-white">Payment &amp; refund agents</strong> with recipient and amount caps
              </h3>
            </div>
          </div>

          {/* Example 3: Coding agents */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] p-6 sm:p-7 shadow-xs hover:border-[#ff4900]/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#252525] border border-black/10 dark:border-[#303030] flex items-center justify-center text-[#ff4900] mb-5 shadow-xs group-hover:scale-105 transition-transform">
                <Terminal size={24} weight="bold" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#161616] dark:text-white leading-snug">
                <strong className="font-black text-[#161616] dark:text-white">Coding agents</strong> that must not deploy to production unchecked
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
