import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MetallicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function MetallicCard({ className, children, ...props }: MetallicCardProps) {
  return (
    <Card className={cn("metallic-card", className)} {...props}>
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
