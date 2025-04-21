import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MinimalistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  metallic?: boolean
  children: React.ReactNode
}

export function MinimalistCard({ className, hover = true, metallic = false, children, ...props }: MinimalistCardProps) {
  return (
    <Card
      className={cn("card-minimalist overflow-hidden", hover && "card-hover", metallic && "shimmer", className)}
      {...props}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
