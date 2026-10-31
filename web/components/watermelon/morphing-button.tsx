"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EnvelopeSimple, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MorphingButtonProps {
  buttonText?: string;
  placeholder?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export const MorphingButton: React.FC<MorphingButtonProps> = ({
  buttonText = "Contact Us",
  placeholder = "Enter your work email...",
  onSubmit,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleToggle = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.stopPropagation();
      setIsExpanded(true);
    } else if (email) {
      onSubmit?.(email);
      setSubmitted(true);
      setTimeout(() => {
        setIsExpanded(false);
        setSubmitted(false);
        setEmail("");
      }, 2000);
    }
  };

  const springConfig = {
    type: "spring",
    stiffness: 260,
    damping: 22,
    mass: 1.0,
  } as const;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div
        className={cn("flex items-center justify-center will-change-transform", className)}
      >
        <motion.div
          ref={containerRef}
          layout
          transition={springConfig}
          style={{ borderRadius: 9999 }}
          className={`relative flex items-center overflow-hidden border border-[#303030]/20 dark:border-[#303030] transition-colors duration-300 shadow-lg ${
            isExpanded
              ? "w-full max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#ffffff] p-1 sm:p-1.5 dark:bg-[#1e1e1e]"
              : "w-auto bg-[#ffffff] p-0.5 dark:bg-[#1e1e1e]"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {isExpanded && !submitted && (
              <motion.div
                key="input-container"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={springConfig}
                className="flex flex-1 min-w-0 items-center px-2.5 sm:px-4"
              >
                <motion.input
                  ref={inputRef}
                  layout
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-medium text-[#161616] placeholder-[#888888] outline-none dark:text-[#f8f8f8] dark:placeholder-[#666666]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email) {
                      handleToggle(e as unknown as React.MouseEvent);
                    }
                  }}
                />
              </motion.div>
            )}

            {submitted && (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 min-w-0 items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle size={16} weight="bold" className="shrink-0" />
                <span className="truncate">Request sent! We will connect shortly.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={handleToggle}
            transition={springConfig}
            className={`relative flex items-center justify-center gap-1.5 sm:gap-2 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 shrink-0 ${
              isExpanded
                ? "bg-[#ff4900] px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-white hover:bg-[#e63e00] shadow-md"
                : "bg-[#161616] text-white hover:bg-[#252525] dark:bg-[#ffffff] dark:text-[#161616] dark:hover:bg-[#e8e8e8] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm"
            }`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {!isExpanded && (
                <motion.span
                  key="contact-icon"
                  layout
                  className="origin-right flex items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={springConfig}
                >
                  <EnvelopeSimple size={18} weight="bold" className="mr-1 sm:mr-1.5" />
                </motion.span>
              )}
              {isExpanded && !submitted && (
                <motion.span
                  key="send-icon"
                  layout
                  className="origin-right flex items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={springConfig}
                >
                  <PaperPlaneTilt size={16} weight="bold" className="mr-1" />
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span layout="position" className="text-xs sm:text-sm tracking-tight">
              {isExpanded ? (submitted ? "Sent" : "Send Brief") : buttonText}
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
