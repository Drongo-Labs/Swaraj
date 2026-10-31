"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ContinuousTabs } from "@/components/watermelon/continuous-tabs";
import { TextureButton } from "@/components/ui/texture-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { GithubLogo, List, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onContactClick?: () => void;
}

export function Navbar({ onContactClick }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handle elastic overscroll / bounce at the very top
      if (currentScrollY <= 0) {
        setIsVisible(true);
        setScrolled(false);
        lastScrollY.current = 0;
      } else if (currentScrollY <= 40) {
        // Always show navbar near the top of the page
        setIsVisible(true);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
      } else {
        setScrolled(true);

        const diff = currentScrollY - lastScrollY.current;

        // Threshold check to filter tiny jitter and trackpad micro-movements
        if (Math.abs(diff) > 8) {
          if (diff > 0) {
            // Scrolled DOWN -> slide up and hide
            setIsVisible(false);
          } else {
            // Scrolled UP -> slide down and appear
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }
      }

      // Check if navbar is currently positioned over the hero section
      const heroEl = document.getElementById("overview");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        setIsOverHero(rect.bottom > 70);
      } else {
        setIsOverHero(currentScrollY < 600);
      }

      // Section tracker - highlights the section currently in view
      const sections = [
        "overview",
        "what-swaraj-is",
        "how-it-works",
        "who-its-for",
        "faq",
        "contact",
      ];

      const isBottom =
        window.innerHeight + currentScrollY >=
        document.documentElement.scrollHeight - 60;

      if (isBottom) {
        setActiveSection("contact");
      } else {
        const scrollPosition = currentScrollY + 220;
        let current = "overview";
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.getBoundingClientRect().top + currentScrollY;
            if (scrollPosition >= top) {
              current = sectionId;
            }
          }
        }
        setActiveSection(current);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const logoSrc = isOverHero
    ? "/swaraj_navbar_logo_white.png"
    : mounted && theme === "dark"
    ? "/swaraj_navbar_logo_dark.png"
    : "/swaraj_navbar_logo_light.png";

  return (
    <>
      <header
        onFocusCapture={() => setIsVisible(true)}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-transparent",
          isVisible || mobileMenuOpen
            ? "translate-y-0"
            : "-translate-y-full pointer-events-none",
          scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("overview")}
              className="flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer outline-none transition-transform active:scale-95"
              aria-label="Swaraj Home"
            >
              <div className="h-7 sm:h-9 w-auto relative flex items-center">
                <Image
                  src={logoSrc}
                  alt="Swaraj"
                  width={150}
                  height={40}
                  priority
                  className="h-7 sm:h-9 w-auto object-contain"
                />
              </div>
            </button>

            {/* Center Continuous Tabs (Desktop: hidden on tablet & mobile) */}
            <div className="hidden lg:flex items-center justify-center">
              <ContinuousTabs
                activeId={activeSection}
                isOverHero={isOverHero}
                onChange={(id) => setActiveSection(id)}
              />
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Theme Toggle */}
              <ThemeToggle inHero={isOverHero} />

              {/* Request Pilot Button */}
              <TextureButton
                variant={isOverHero ? "white" : "brand"}
                size="sm"
                className="w-auto rounded-full shadow-md text-xs sm:text-sm px-3 sm:px-4 py-1.5"
                onClick={onContactClick}
              >
                <span>
                  <span className="hidden sm:inline">Request </span>Trial
                </span>
              </TextureButton>

              {/* Mobile / Tablet Hamburger Button */}
              <TextureButton
                variant="icon"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "lg:hidden w-8 h-8 sm:w-9 sm:h-9",
                  isOverHero && "border-white/30 bg-white/20 text-white hover:bg-white/30"
                )}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X size={18} weight="bold" className={isOverHero ? "text-white" : ""} />
                ) : (
                  <List size={18} weight="bold" className={isOverHero ? "text-white" : ""} />
                )}
              </TextureButton>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 mx-3 sm:mx-4 p-3 sm:p-4 rounded-2xl bg-[#ffffff]/98 dark:bg-[#1e1e1e]/98 backdrop-blur-xl border border-[#303030]/20 dark:border-[#303030] shadow-2xl flex flex-col gap-1.5 max-h-[calc(100dvh-5rem)] overflow-y-auto no-scrollbar"
            >
              {[
                { id: "overview", label: "Overview" },
                { id: "what-swaraj-is", label: "What Swaraj is" },
                { id: "how-it-works", label: "How it works" },
                { id: "who-its-for", label: "Who it's for" },
                { id: "faq", label: "FAQ" },
                { id: "contact", label: "Contact & Pilot" },
              ].map((item) => (
                <TextureButton
                  key={item.id}
                  variant={activeSection === item.id ? "brand" : "minimal"}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="w-full justify-start text-left py-2"
                >
                  <span className="w-full text-left font-semibold text-xs sm:text-sm">{item.label}</span>
                </TextureButton>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
