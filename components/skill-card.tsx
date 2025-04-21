import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award } from "lucide-react"

interface SkillCardProps {
  title: string
  type: "teaching" | "learning"
  level: "Beginner" | "Intermediate" | "Advanced"
  rate: number
  description: string
  sessions: number
  rating: number
}

export function SkillCard({ title, type, level, rate, description, sessions, rating }: SkillCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
      <div
        className={`h-1 w-full ${type === "teaching" ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-gradient-to-r from-emerald-600 to-teal-600"}`}
      ></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={type === "teaching" ? "purple" : "teal"} className="capitalize font-semibold">
            {type}
          </Badge>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span className="font-medium">{level}</span>
          <span className="font-medium">{rate} tokens/hour</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-primary/5 bg-muted/50 px-6 py-3">
        <div className="flex items-center text-xs text-foreground/80 font-medium">
          <BookOpen className="mr-1 h-3 w-3" />
          <span>{sessions} sessions</span>
        </div>
        {rating > 0 && (
          <div className="flex items-center text-xs text-foreground/80 font-medium">
            <Award className="mr-1 h-3 w-3" />
            <span>{rating.toFixed(1)} rating</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
