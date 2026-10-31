"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { TextureButton } from "@/components/ui/texture-button";
import { Meteors } from "@/components/ui/meteors";

interface FooterProps {
  onContactClick?: () => void;
}

export function Footer({ onContactClick }: FooterProps = {}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const emailContainerRef = React.useRef<HTMLDivElement>(null);
  const [meteorsTop, setMeteorsTop] = useState<number | null>(null);

  React.useEffect(() => {
    const updateTop = () => {
      if (emailContainerRef.current) {
        const rect = emailContainerRef.current.getBoundingClientRect();
        const footerEl = emailContainerRef.current.closest("footer");
        if (footerEl) {
          const footerRect = footerEl.getBoundingClientRect();
          setMeteorsTop(rect.bottom - footerRect.top + 16);
        }
      }
    };

    updateTop();
    window.addEventListener("resize", updateTop);
    return () => window.removeEventListener("resize", updateTop);
  }, [submitted]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    if (onContactClick) {
      // Allow optional parent notification
    }
  };

  return (
    <footer className="relative w-full bg-[#f8f8f8] dark:bg-[#121212] text-[#161616] dark:text-[#f8f8f8] border-t border-black/10 dark:border-[#303030] pt-16 sm:pt-24 lg:pt-28 pb-0 overflow-hidden transition-colors duration-300">
      {/* Orange Meteors Effect (starts below the email input pill and extends till the end of the footer) */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0"
        style={{ top: meteorsTop !== null ? `${meteorsTop}px` : "220px" }}
      >
        <Meteors number={30} />
      </div>

      {/* Central Soft Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,73,0,0.1)_0%,rgba(255,73,0,0.03)_45%,transparent_70%)] pointer-events-none" />

      {/* Abstract Stepped Matrix Graphic (Left Flank: hidden below xl to prevent overlap on tablets) */}
      <div className="absolute left-0 top-10 sm:top-16 pointer-events-none select-none hidden xl:block">
        <div className="relative w-72 h-44">
          <div className="absolute left-10 top-2 w-32 h-8 rounded-sm bg-[#ff4900]/10 dark:bg-[#ff4900]/15 border border-[#ff4900]/15 dark:border-white/5 backdrop-blur-xs shadow-xs" />
          <div className="absolute -left-4 top-13 w-56 h-10 rounded-sm bg-[#ff4900]/12 dark:bg-[#ff4900]/20 border border-[#ff4900]/20 dark:border-white/5 backdrop-blur-xs shadow-xs" />
          <div className="absolute left-14 top-27 w-36 h-9 rounded-sm bg-[#ff4900]/8 dark:bg-[#ff4900]/12 border border-[#ff4900]/15 dark:border-white/5 backdrop-blur-xs shadow-xs" />
        </div>
      </div>

      {/* Abstract Stepped Matrix Graphic (Right Flank: hidden below xl to prevent overlap on tablets) */}
      <div className="absolute right-0 top-8 sm:top-14 pointer-events-none select-none hidden xl:block">
        <div className="relative w-80 h-56">
          <div className="absolute right-20 top-2 w-44 h-8 rounded-sm bg-[#ff4900]/8 dark:bg-[#ff4900]/12 border border-[#ff4900]/15 dark:border-white/5 backdrop-blur-xs shadow-xs" />
          <div className="absolute right-4 top-12 w-56 h-10 rounded-sm bg-[#ff4900]/12 dark:bg-[#ff4900]/18 border border-[#ff4900]/20 dark:border-white/5 backdrop-blur-xs shadow-xs" />
          <div className="absolute right-16 top-26 w-36 h-9 rounded-sm bg-[#ff4900]/10 dark:bg-[#ff4900]/14 border border-[#ff4900]/15 dark:border-white/5 backdrop-blur-xs shadow-xs" />
          <div className="absolute -right-2 top-38 w-48 h-11 rounded-sm bg-[#ff4900]/14 dark:bg-[#ff4900]/22 border border-[#ff4900]/25 dark:border-white/5 backdrop-blur-xs shadow-xs" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Call-to-Action Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold sm:font-black tracking-tight leading-[1.14] sm:leading-[1.12] text-[#161616] dark:text-[#f8f8f8]">
            Stop vibe-prompting your agents. <br className="hidden sm:inline" />
            <span className="text-[#161616] dark:text-white">Start proving them.</span>
          </h2>

          {/* Interactive Work Email Input Pill (Commented out) */}
          {/*
          <div ref={emailContainerRef} className="mt-6 sm:mt-10 max-w-md sm:max-w-lg mx-auto">
            <form
              onSubmit={handleEmailSubmit}
              className="relative flex items-center p-1 sm:p-2 rounded-full bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-[#303030] shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all focus-within:border-[#ff4900]/60 focus-within:ring-2 focus-within:ring-[#ff4900]/20"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work email"
                required
                className="min-w-0 flex-1 bg-transparent pl-3.5 sm:pl-5 pr-2 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base text-[#161616] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
              />
              <TextureButton
                type="submit"
                variant="brand"
                size="default"
                disabled={submitted}
                className="shrink-0 w-auto rounded-full text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2"
              >
                <span>{submitted ? "Requested ✓" : "Get a demo"}</span>
              </TextureButton>
            </form>
            {submitted && (
              <p className="mt-2.5 text-xs text-center text-emerald-600 dark:text-emerald-400 font-mono">
                Demo request sent!
              </p>
            )}
          </div>
          */}
        </div>

        {/* Structured 3-Column Navigation Grid */}
        {/* <div className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-left">
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 sm:mb-4 font-mono">
                Guides
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>
                  <a
                    href="https://github.com/ayush4345/zkReciept"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>SMT Policy Gateway</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ayush4345/zkReciept"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Capability Token Spec</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.zkverify.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>zkVM Verifier</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ayush4345/zkReciept"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Lean 4 Proof Systems</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 sm:mb-4 font-mono">
                Resources
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>
                  <button
                    onClick={onContactClick}
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors cursor-pointer text-left"
                  >
                    Customers &amp; Pilots
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/ayush4345/zkReciept"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>ZKReceipt Reference</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.zkverify.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>zkVerify Docs</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 sm:mb-4 font-mono">
                Company
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <li>
                  <a
                    href="#overview"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <button
                    onClick={onContactClick}
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors cursor-pointer text-left"
                  >
                    Help docs &amp; pilots
                  </button>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff4900] dark:hover:text-[#ff4900] transition-colors inline-flex items-center gap-1"
                  >
                    <span>X</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 sm:mt-14 pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs text-neutral-500 dark:text-neutral-500 text-center sm:text-left">
            <p>© 2026 Swaraj Protocol. All rights reserved.</p>
            <p className="font-mono text-[10px] sm:text-[11px]">Autonomous Agent Formal Verification &amp; Receipts</p>
          </div>
        </div> */}
      </div>

      {/* Massive Brand Wordmark Bleeding Off Bottom Edge */}
      <div className="relative w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mt-8 sm:mt-14 lg:mt-20">
        <div className="text-[16vw] sm:text-[18vw] lg:text-[20vw] font-black tracking-[-0.04em] leading-[0.72] text-center whitespace-nowrap translate-y-[26%] text-[#161616] dark:text-[#f8f8f8] transition-colors duration-300">
          Swaraj
        </div>
      </div>
    </footer>
  );
}
