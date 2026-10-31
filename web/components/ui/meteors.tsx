"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
  tailClassName?: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
  tailClassName,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": `${angle}deg`,
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
      animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {meteorStyles.map((style, idx) => (
        // Meteor Head (Orange by default)
        <span
          key={idx}
          style={style}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rounded-full bg-[#ff4900] shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_8px_#ff4900,0_0_14px_rgba(255,73,0,0.8)]",
            className
          )}
        >
          {/* Meteor Tail (Orange gradient by default) */}
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -z-10 h-px w-20 -translate-y-1/2 bg-linear-to-r from-[#ff4900] via-orange-400/40 to-transparent",
              tailClassName
            )}
          />
        </span>
      ))}
    </>
  )
}

