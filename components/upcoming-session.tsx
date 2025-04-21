import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Video, MessageSquare, MapPin } from "lucide-react"

interface UpcomingSessionProps {
  title: string
  role: "teacher" | "student"
  with: string
  date: string
  tokens: number
}

export function UpcomingSession({ title, role, with: withPerson, date, tokens }: UpcomingSessionProps) {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-md border border-primary/10 p-4 bg-background/30">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/diverse-group-city.png" />
          <AvatarFallback>{withPerson.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none text-foreground">{title}</p>
          <p className="text-sm text-foreground/80 font-medium">
            {role === "teacher" ? "Teaching" : "Learning from"} {withPerson}
          </p>
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-1 h-3 w-3 text-foreground/70" />
            <span className="text-xs text-foreground/70 font-medium">{date}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
          <span className="text-sm font-medium text-foreground">{tokens} tokens</span>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Video className="h-3 w-3" />
            <span className="sr-only">Video call</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <MessageSquare className="h-3 w-3" />
            <span className="sr-only">Chat</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <MapPin className="h-3 w-3" />
            <span className="sr-only">Location</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
