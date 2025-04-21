import { cn } from "@/lib/utils"
import type * as React from "react"

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function VisuallyHidden({ children, className, as: Component = "span", ...props }: VisuallyHiddenProps) {
  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  )
}

interface HighContrastTextProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function HighContrastText({ children, className, as: Component = "span", ...props }: HighContrastTextProps) {
  return (
    <Component className={cn("text-foreground font-medium", className)} {...props}>
      {children}
    </Component>
  )
}

interface HighContrastHeadingProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function HighContrastHeading({ children, className, as: Component = "h2", ...props }: HighContrastHeadingProps) {
  return (
    <Component className={cn("text-foreground font-bold tracking-tight", className)} {...props}>
      {children}
    </Component>
  )
}
