"use client";

import React from "react";

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.14] text-[#161616] dark:text-white">
            Who it&apos;s for?
          </h2>
        </div>

        {/* Featured Statement Banner */}
        <div className="relative rounded-3xl bg-[#f8f8f8] dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] p-8 sm:p-12 lg:p-16 text-center shadow-sm hover:border-[#ff4900]/40 transition-colors">
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#161616] dark:text-white leading-tight sm:leading-snug max-w-3xl mx-auto">
            Wherever an agent acts with real stakes, Swaraj keeps it under rules.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
