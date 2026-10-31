"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
  {
    variants: {
      variant: {
        primary:
          "border border-black/15 dark:border-white/20 bg-gradient-to-b from-neutral-800 to-black text-white hover:from-neutral-700 hover:to-neutral-900 dark:from-white dark:to-neutral-100 dark:text-black dark:hover:from-neutral-100 dark:hover:to-neutral-200 shadow-sm",
        accent:
          "border border-indigo-500/40 dark:border-indigo-400/40 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-500 shadow-sm",
        destructive:
          "border border-red-500/40 dark:border-red-500/40 bg-gradient-to-b from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-sm",
        secondary:
          "border border-black/10 dark:border-white/10 bg-gradient-to-b from-neutral-100 to-neutral-200/80 text-neutral-900 hover:from-neutral-50 hover:to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-100 dark:hover:from-neutral-700 dark:hover:to-neutral-800 shadow-xs",
        minimal:
          "border border-transparent bg-transparent text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15",
        icon:
          "rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-600 shadow-xs",
        brand:
          "border border-[#e63e00] bg-gradient-to-b from-[#ff530d] to-[#e63e00] text-white hover:from-[#ff621e] hover:to-[#eb4300] shadow-sm",
        white:
          "border border-black/10 dark:border-white/20 bg-gradient-to-b from-white to-[#f5f5f5] text-neutral-900 hover:from-white hover:to-neutral-200 shadow-sm",
        outline:
          "border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10",
      },
      size: {
        sm: "text-xs rounded-[6px] px-3.5 py-1.5 gap-1.5",
        default: "text-sm rounded-[10px] px-4 py-2 gap-2",
        lg: "text-base rounded-[12px] px-6 py-2.5 gap-2.5",
        pill: "rounded-full px-5 py-2 text-sm gap-2",
        icon: "rounded-full p-2 h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "destructive"
    | "minimal"
    | "icon"
    | "brand"
    | "white"
    | "outline"
  size?: "default" | "sm" | "lg" | "pill" | "icon"
  asChild?: boolean
}

export type TextureButtonProps = UnifiedButtonProps

const TextureButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "default",
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

TextureButton.displayName = "TextureButton"

export { TextureButton, buttonVariants, buttonVariants as buttonVariantsOuter }
