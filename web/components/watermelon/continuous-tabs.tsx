"use client";

import { useState, useEffect, type FC } from "react";
import { motion, LayoutGroup } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export interface TabItem {
  id: string;
  label: string;
  href?: string;
}

export interface ContinuousTabsProps {
  tabs?: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
  isOverHero?: boolean;
}

export const DEFAULT_TABS: TabItem[] = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "what-swaraj-is", label: "What Swaraj is", href: "#what-swaraj-is" },
  { id: "how-it-works", label: "How it works", href: "#how-it-works" },
  { id: "who-its-for", label: "Who it's for", href: "#who-its-for" },
  { id: "faq", label: "FAQ", href: "#faq" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const ContinuousTabs: FC<ContinuousTabsProps> = ({
  tabs = DEFAULT_TABS,
  defaultActiveId = "overview",
  activeId,
  onChange,
  className,
  isOverHero = false,
}) => {
  const [active, setActive] = useState<string>(activeId || defaultActiveId);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeId) {
      setActive(activeId);
    }
  }, [activeId]);

  const handleChange = (id: string, href?: string) => {
    setActive(id);
    onChange?.(id);
    if (href) {
      const el = document.querySelector(href);
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
    }
  };

  if (!isMounted) return null;

  const currentActive = activeId ?? active;

  return (
    <LayoutGroup id="nav-tabs">
      <nav
        aria-label="Main Navigation"
        className={cn(
          "relative flex items-center gap-0.5 sm:gap-1 p-1 rounded-full transition-all duration-300",
          isOverHero
            ? "border border-white/25 bg-black/20 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            : "border border-[#303030]/15 dark:border-[#303030] bg-[#ffffff]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = currentActive === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleChange(tab.id, tab.href)}
              className="relative px-2 py-1 lg:px-2.5 lg:py-1 xl:px-3.5 xl:py-1.5 rounded-full outline-none text-xs xl:text-sm font-medium transition-colors select-none cursor-pointer whitespace-nowrap"
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                    mass: 0.9,
                  }}
                  className={cn(
                    "absolute inset-0 rounded-full shadow-sm",
                    isOverHero
                      ? "bg-white text-[#ff4900]"
                      : "bg-[#ff4900] dark:bg-[#ffffff] text-white dark:text-[#161616]"
                  )}
                />
              )}

              {/* Text */}
              <motion.span
                layout="position"
                className={cn(
                  "relative z-10 tracking-tight transition-colors duration-200",
                  isOverHero
                    ? isActive
                      ? "text-[#ff4900] font-bold"
                      : "text-white/85 hover:text-white"
                    : isActive
                    ? "text-white dark:text-[#161616] font-bold"
                    : "text-[#303030] dark:text-[#f1f1f1]/70 hover:text-[#161616] dark:hover:text-[#ffffff]"
                )}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
};
