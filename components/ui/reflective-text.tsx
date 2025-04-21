import type React from "react"
import { cn } from "@/lib/utils"

interface ReflectiveTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent"
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function ReflectiveText({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ReflectiveTextProps) {
  const variantClasses = {
    primary: "metallic-text",
    secondary: "metallic-text-secondary",
    accent: "metallic-text-accent",
  }

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <span className={cn(variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </span>
  )
}
