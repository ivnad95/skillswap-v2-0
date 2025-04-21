import type React from "react"
import { cn } from "@/lib/utils"

interface ContrastTextProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function HighContrastText({ children, className, as: Component = "span" }: ContrastTextProps) {
  return <Component className={cn("text-foreground font-medium", className)}>{children}</Component>
}

export function HighContrastHeading({ children, className, as: Component = "h2" }: ContrastTextProps) {
  return <Component className={cn("text-foreground font-bold tracking-tight", className)}>{children}</Component>
}

export function VisuallyHidden({ children, className, as: Component = "span" }: ContrastTextProps) {
  return <Component className={cn("sr-only", className)}>{children}</Component>
}
