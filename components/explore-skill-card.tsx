import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, Users } from "lucide-react"

interface ExploreSkillCardProps {
  title: string
  category: string
  teacherName: string
  teacherAvatar: string
  rating: number
  students: number
  tokens: number
  tags: string[]
}

export function ExploreSkillCard({
  title,
  category,
  teacherName,
  teacherAvatar,
  rating,
  students,
  tokens,
  tags,
}: ExploreSkillCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-background/50">
            {category}
          </Badge>
        </div>
        {/* Replaced CardDescription with a div to avoid nesting div inside p */}
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center mt-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={teacherAvatar || "/placeholder.svg"} alt={teacherName} />
              <AvatarFallback>{teacherName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{teacherName}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex mr-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{students} students</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-background/50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-1">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className="font-medium">{tokens} tokens/hr</span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-primary/5 bg-muted/50 px-6 py-3">
        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          Book Session
        </Button>
      </CardFooter>
    </Card>
  )
}
