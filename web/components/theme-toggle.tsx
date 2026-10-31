"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";
import { TextureButton } from "@/components/ui/texture-button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className = "",
  inHero = false,
}: {
  className?: string;
  inHero?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-full bg-white/10", className)} />
    );
  }

  return (
    <TextureButton
      variant="icon"
      size="icon"
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "w-9 h-9",
        inHero && "border-white/30 bg-white/20 text-white hover:bg-white/30",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun
          size={18}
          weight="bold"
          className={inHero ? "text-white" : "text-[#ff4900]"}
        />
      ) : (
        <Moon
          size={18}
          weight="bold"
          className={inHero ? "text-white" : "text-[#161616] dark:text-[#f8f8f8]"}
        />
      )}
    </TextureButton>
  );
}
