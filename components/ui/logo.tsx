"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  href?: string | null
}

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  const content = (
    <>
      <div className={cn("bg-gradient-to-br from-purple-600 to-blue-500 rounded-md", sizeClasses[size])} />
      <span className={cn("font-bold", textSizeClasses[size])}>SkillSwap</span>
    </>
  )

  if (href === null) {
    return <div className={cn("flex items-center space-x-2", className)}>{content}</div>
  }

  return (
    <Link href={href} className={cn("flex items-center space-x-2", className)}>
      {content}
    </Link>
  )
}
