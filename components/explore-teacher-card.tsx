import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, Users } from "lucide-react"

interface ExploreTeacherCardProps {
  name: string
  avatar: string
  title: string
  rating: number
  students: number
  skills: string[]
}

export function ExploreTeacherCard({ name, avatar, title, rating, students, skills }: ExploreTeacherCardProps) {
  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating}</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{students} students</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-primary/5 bg-muted/50 px-6 py-3 flex justify-center">
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
