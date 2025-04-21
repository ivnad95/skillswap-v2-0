import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Community | SkillSwap",
  description: "Connect with the SkillSwap community",
}

interface ForumTopic {
  id: number;
  title: string;
  author: string;
  avatar: string;
  replies: number;
  views: number;
  lastActivity: string;
  category: string;
}

interface Event {
  id: number;
  title: string;
  host: string;
  date: string;
  time: string;
  attendees: number;
  category: string;
}

interface Group {
  id: number;
  name: string;
  members: number;
  description: string;
  category: string;
}

export default function CommunityPage() {
  const forumTopics: ForumTopic[] = [
    {
      id: 1,
      title: "Best resources for learning JavaScript in 2024",
      author: "John Doe",
      avatar: "/profile-photo.png",
      replies: 24,
      views: 156,
      lastActivity: "2 hours ago",
      category: "Programming",
    },
    {
      id: 2,
      title: "Tips for teaching beginners effectively",
      author: "Sarah Johnson",
      avatar: "/contemplative-artist.png",
      replies: 18,
      views: 132,
      lastActivity: "5 hours ago",
      category: "Teaching",
    },
    {
      id: 3,
      title: "How to structure your yoga practice for beginners",
      author: "Maya Patel",
      avatar: "/thoughtful-reader.png",
      replies: 32,
      views: 210,
      lastActivity: "1 day ago",
      category: "Fitness",
    },
  ]

  const events: Event[] = [
    {
      id: 1,
      title: "JavaScript Workshop: Building Modern Web Apps",
      host: "John Doe",
      date: "June 15, 2024",
      time: "2:00 PM - 4:00 PM",
      attendees: 18,
      category: "Workshop",
    },
    {
      id: 2,
      title: "Language Exchange Meetup",
      host: "Maria Rodriguez",
      date: "June 20, 2024",
      time: "6:00 PM - 8:00 PM",
      attendees: 24,
      category: "Meetup",
    },
    {
      id: 3,
      title: "Introduction to Data Science",
      host: "Michael Chen",
      date: "June 25, 2024",
      time: "1:00 PM - 3:00 PM",
      attendees: 15,
      category: "Workshop",
    },
  ]

  const groups: Group[] = [
    {
      id: 1,
      name: "JavaScript Developers",
      members: 156,
      description: "A group for JavaScript developers to share knowledge and resources.",
      category: "Programming",
    },
    {
      id: 2,
      name: "Language Exchange",
      members: 132,
      description: "Practice languages with native speakers from around the world.",
      category: "Languages",
    },
    {
      id: 3,
      name: "Fitness & Wellness",
      members: 98,
      description: "Share tips and techniques for fitness and wellness practices.",
      category: "Fitness",
    },
  ]

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Connect with other SkillSwap members.</p>
        </div>
      </div>

      <Tabs defaultValue="forums" className="mt-6">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Discussion Forums</CardTitle>
                  <CardDescription>Join conversations with other members</CardDescription>
                </div>
                <Button variant="gradient">
                  New Topic
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forumTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-primary/10 bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={topic.avatar || "/placeholder.svg"} alt={topic.author} />
                        <AvatarFallback>{topic.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted by {topic.author} • {topic.lastActivity}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="bg-background/50">
                            {topic.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <MessageSquare className="inline h-3 w-3 mr-1" />
                            {topic.replies} replies
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-primary/10 pt-6">
              <Button variant="outline">View All Topics</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Workshops, meetups, and learning sessions</CardDescription>
                </div>
                <Button variant="gradient">
                  Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-primary/10 bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Hosted by {event.host} • {event.date}, {event.time}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="bg-background/50">
                          {event.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Users className="inline h-3 w-3 mr-1" />
                          {event.attendees} attendees
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      <Button
                        variant="gradient"
                        size="sm"
                      >
                        RSVP
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-primary/10 pt-6">
              <Button variant="outline">View All Events</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skill Groups</CardTitle>
                  <CardDescription>Join groups based on your interests</CardDescription>
                </div>
                <Button variant="gradient">
                  Create Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id} className="bg-background/30 border-primary/10">
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>
                        <Users className="inline h-3 w-3 mr-1" />
                        {group.members} members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{group.description}</p>
                      <Badge variant="outline" className="mt-4 bg-background/50">
                        {group.category}
                      </Badge>
                    </CardContent>
                    <CardFooter>
                      <Button variant="gradient" className="w-full">
                        Join Group
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-primary/10 pt-6">
              <Button variant="outline">View All Groups</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
