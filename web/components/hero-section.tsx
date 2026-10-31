"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TextureButton } from "@/components/ui/texture-button";
import {
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  Lightning,
  Sparkle,
  Cpu,
  Cube,
  LockKey,
} from "@phosphor-icons/react";

// Dynamically load DotGrid to ensure pure client-side WebGL canvas initialization
const DotGrid = dynamic<any>(() => import("@/components/reactbits/DotGrid"), {
  ssr: false,
  loading: () => null,
});

interface HeroSectionProps {
  onContactClick?: () => void;
  onHowItWorksClick?: () => void;
}

export function HeroSection({ onContactClick, onHowItWorksClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-center items-center bg-[#ff4900] text-white overflow-hidden select-none">
      {/* Interactive DotGrid Background (React Bits) with ff4900 color */}
      <div className="absolute inset-0 w-full h-full opacity-45 pointer-events-auto">
        <DotGrid
          dotSize={3.5}
          gap={26}
          baseColor="#ffffff"
          activeColor="#ffffff"
          proximity={160}
          shockRadius={280}
          shockStrength={4}
          glow={0.7}
          className="w-full h-full"
        />
      </div>

      {/* Hero Main Content (optically centered, accounting for top fixed navbar) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 text-center flex flex-col items-center justify-center my-auto">

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] sm:leading-[1.08] max-w-4xl break-words">
          Swaraj <br /> Verifiable layer for <br /> AI Agents.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 sm:mt-8 text-sm sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-xs">
          Natural language prompts cannot stop rogue AI agents. Swaraj enforces mathematical Z3 SMT constraints before execution and delivers zero-knowledge portable receipts afterward.
        </p>

        {/* Hero Buttons (TextureButton) */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
          <TextureButton
            variant="white"
            size="lg"
            className="w-full sm:w-auto rounded-full shadow-xl"
            onClick={onContactClick}
          >
            <span>Start Building with Swaraj</span>
            <ArrowRight size={16} weight="bold" />
          </TextureButton>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto"
            onClick={(e) => {
              if (onHowItWorksClick) {
                e.preventDefault();
                onHowItWorksClick();
              }
            }}
          >
            <TextureButton
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full backdrop-blur-md"
            >
              <span>Explore How it works?</span>
            </TextureButton>
          </a>
        </div>
      </div>
    </section>
  );
}
