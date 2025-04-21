"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SkillCard } from "@/components/skill-card"
import { UpcomingSession } from "@/components/upcoming-session"
import { TokenBalance } from "@/components/token-balance"
import { RecommendedMatches } from "@/components/recommended-matches"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

type UserData = {
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  profile: {
    bio: string
    location: string
    social_links: Record<string, any>
    learning_preferences: Record<string, any>
  }
  skills: Array<any>
  sessions?: Array<any>
}

export default function DashboardPageClient({ userData }: { userData: UserData }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  // Extract data from userData with fallbacks
  const firstName = userData.user?.firstName || user?.firstName || "User"
  const skills = userData.skills || []
  const upcomingSessions = userData.sessions || []

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {firstName || "User"}</h1>
          <p className="text-muted-foreground">Here's what's happening with your SkillSwap account</p>
        </div>
        <TokenBalance tokens={10} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled learning and teaching sessions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/sessions")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingSessions && upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <UpcomingSession
                      key={index}
                      title={session.title}
                      role={session.role}
                      with={session.with}
                      date={session.date}
                      tokens={session.tokens}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming sessions</p>
                  <Button onClick={() => router.push("/explore")}>Find Skills to Learn</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Skills</CardTitle>
                <CardDescription>Skills you're teaching and learning</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/skills")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {skills && skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.slice(0, 4).map((skill, index) => (
                    <SkillCard
                      key={index}
                      title={skill.title}
                      type={skill.type}
                      level={skill.level}
                      rate={skill.rate}
                      description={skill.description}
                      sessions={skill.sessions}
                      rating={skill.rating}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't added any skills yet</p>
                  <Button onClick={() => router.push("/skills/new/teaching")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add a Skill
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <RecommendedMatches />

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Complete these steps to set up your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>
                  Complete Your Profile
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/skills/new/teaching")}>
                  Add Your First Skill
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/explore")}>
                  Explore Skills to Learn
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
