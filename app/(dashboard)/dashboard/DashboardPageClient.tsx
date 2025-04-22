"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SkillCard } from "@/components/skill-card"
import { UpcomingSession } from "@/components/upcoming-session"
import { TokenBalance } from "@/components/token-balance"
import { RecommendedMatches } from "@/components/recommended-matches"
import { AIAssistant } from "@/components/ai-assistant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Sparkles, Award } from "lucide-react"
import { aiModels } from "@/lib/ai-models"
import { Badge } from "@/components/ui/badge"

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
  const { user, loading } = useAuth() // Changed isLoading to loading
  const router = useRouter()
  const [welcomeMessage, setWelcomeMessage] = useState<string>("")
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
   const [isAiLoading, setIsAiLoading] = useState<boolean>(true)
 
   // Removed redundant auth check useEffect, as it's handled by parent/layout
 
   // Load personalized AI content when component mounts
  useEffect(() => {
    async function loadAiContent() {
      if (!userData) return

      try {
        // Get personalized welcome message
        const message = await aiModels.getPersonalizedWelcome(userData)
        setWelcomeMessage(message)

        // In a real implementation, we would get AI recommendations from the API
        // For now, we'll use static recommendations
        setAiRecommendations([
          "Based on your JavaScript skills, try exploring React for frontend development",
          "Connect with Sarah J. who matches 92% with your learning preferences",
          "Complete your skill profile to improve your matching accuracy",
           "Schedule your first teaching session to earn SkillTokens"
         ])
         // TODO: Replace static AI recommendations with dynamic data fetching
       } catch (error) {
         // console.error("Error loading AI content:", error) // Removed console.error
         // Optionally add user-facing error handling here
       } finally {
         setIsAiLoading(false)
      }
    }

    loadAiContent()
  }, [userData])

  if (loading) { // Changed isLoading to loading
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
          <h1 className="text-3xl font-bold">
            {welcomeMessage || `Welcome back, ${firstName}`}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your SkillSwap account</p>
        </div>
        <TokenBalance tokens={10} />
      </div>

      {/* AI Recommendations Card */}
      {!isAiLoading && aiRecommendations.length > 0 && (
        <Card className="border border-purple-800/30 bg-purple-900/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on your profile</CardDescription>
           </CardHeader>
           <CardContent>
             <ul className="space-y-2">
               {aiRecommendations.map((recommendation: string, index: number) => ( // Added types
                 <li key={index} className="flex items-start gap-2 text-sm">
                   <div className="mt-0.5 rounded-full bg-purple-800/30 p-1">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                  </div>
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
                   {upcomingSessions.map((session: any, index: number) => ( // Added type (any for now)
                     <UpcomingSession
                       key={index} // Consider using session.id if available and unique
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
                   {skills.slice(0, 4).map((skill: any, index: number) => ( // Added type (any for now)
                     <SkillCard
                       key={index} // Consider using skill.id if available and unique
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

          {/* Learning Progress Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Learning Progress
                </CardTitle>
                <CardDescription>Track your skill development journey</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>JavaScript</span>
                    <span className="text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>UX Design</span>
                    <span className="text-muted-foreground">40%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 border-amber-500/30 text-amber-500">
                      <Award className="h-3 w-3" />
                      First Session Completed
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-blue-500/30 text-blue-500">
                      <Award className="h-3 w-3" />
                      5 Skills Added
                    </Badge>
                  </div>
                </div>
              </div>
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

       {/* AI Assistant component (fixed position) */}
       <AIAssistant />
 
       {/* Removed placeholder Component Diagram section */}
     </div>
  )
}
