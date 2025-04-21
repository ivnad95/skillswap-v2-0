import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { UpcomingSession } from "@/components/upcoming-session"
import { SessionHistory } from "@/components/session-history"
import { CalendarPlus, AlertCircle, Loader2 } from "lucide-react"
// Removed getUserIdFromRequest import as we'll use verifyToken directly
import { getUserSessions, DbSession, verifyToken } from "@/lib/db" // Import verifyToken
import { redirect } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cookies } from "next/headers"

// Define our own Session type to replace Prisma's
interface Session {
  id: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  scheduledTime: string;
  status: string;
  notes?: string | null;
  tokenAmount?: number;
}

// Define types for session data
interface PopulatedSession {
  id: string;
  teacherId: string;
  learnerId: string;
  skillId: string;
  scheduledTime: string;
  status: string;
  notes?: string | null;
  tokenAmount?: number;
  teacher: { id: string; firstName: string | null; lastName: string | null; imageUrl?: string | null }
  learner: { id: string; firstName: string | null; lastName: string | null; imageUrl?: string | null }
  skill: { id: string; name: string }
}

export const metadata: Metadata = {
  title: "Sessions | SkillSwap",
  description: "Manage your teaching and learning sessions",
}

// Loading skeleton for upcoming sessions
function UpcomingSessionSkeleton() {
  return (
    <div className="p-4 border border-border/50 rounded-lg space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between mt-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export default async function SessionsPage() {
  // Directly get user ID from token using verifyToken
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;
  let userId: string | null = null;

  if (authToken) {
    const verificationResult = verifyToken(authToken);
    // Define expected shape of decoded user payload
    type DecodedUser = { id: string; [key: string]: any };
    // Safely access user ID from decoded token with type assertion
    const decodedUser = verificationResult.data?.session?.user as DecodedUser | undefined;
    userId = decodedUser?.id || null;
  }

  if (!userId) {
    redirect("/login"); // Redirect if no token or token is invalid
  }

  let upcomingSessions: PopulatedSession[] = []
  let pastSessions: PopulatedSession[] = []
  let isLoading = true
  let error: string | null = null

  try {
    const sessionsResult = await getUserSessions(userId)
    
    // Handle potential error
    if (sessionsResult.error) {
      error = sessionsResult.error.message || "Failed to load sessions";
      isLoading = false;
      return;
    }
    
    const allSessions = sessionsResult.data;
    const now = new Date()
    
    // Now we can safely filter the data
    upcomingSessions = allSessions
      .filter(session => new Date(session.start_time) >= now)
      .map(session => ({
        id: session.id,
        teacherId: session.teacher_id,
        learnerId: session.learner_id,
        skillId: session.skill_id,
        scheduledTime: session.start_time,
        status: session.status,
        notes: session.notes,
        tokenAmount: 10, // Revert to Placeholder - DbSession type doesn't have token_amount
        // Revert to Placeholders - DbSession type doesn't have populated relations
        teacher: { id: session.teacher_id, firstName: "Teacher", lastName: "Name", imageUrl: null },
        learner: { id: session.learner_id, firstName: "Learner", lastName: "Name", imageUrl: null },
        skill: { id: session.skill_id, name: "Skill Name" }
      }));

    pastSessions = allSessions
      .filter(session => new Date(session.start_time) < now)
      .map(session => ({
        id: session.id,
        teacherId: session.teacher_id,
        learnerId: session.learner_id,
        skillId: session.skill_id,
        scheduledTime: session.start_time,
        status: session.status,
        notes: session.notes,
        tokenAmount: 10, // Revert to Placeholder - DbSession type doesn't have token_amount
        // Revert to Placeholders - DbSession type doesn't have populated relations
        teacher: { id: session.teacher_id, firstName: "Teacher", lastName: "Name", imageUrl: null },
        learner: { id: session.learner_id, firstName: "Learner", lastName: "Name", imageUrl: null },
        skill: { id: session.skill_id, name: "Skill Name" }
      }));

    isLoading = false
  } catch (err) {
    console.error("Failed to fetch sessions:", err)
    error = "Failed to load sessions. Please try again later."
    isLoading = false
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">Manage your teaching and learning sessions.</p>
        </div>
        <Button variant="gradient">
          <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="mt-6">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled teaching and learning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <UpcomingSessionSkeleton />
                  <UpcomingSessionSkeleton />
                  <UpcomingSessionSkeleton />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <UpcomingSession
                      key={session.id}
                      title={session.skill.name}
                      role={session.teacherId === userId ? "teacher" : "student"}
                      with={session.teacherId === userId 
                        ? `${session.learner.firstName || ''} ${session.learner.lastName || ''}`.trim() 
                        : `${session.teacher.firstName || ''} ${session.teacher.lastName || ''}`.trim()}
                      date={new Date(session.scheduledTime).toLocaleString()}
                      tokens={session.tokenAmount || 0}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  No upcoming sessions scheduled.
                  <br />
                  <span className="text-sm">Use the "Schedule Session" button to book your next session.</span>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Session History</h2>
            <Button variant="outline">Export History</Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading sessions...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <SessionHistory 
              profileData={{ 
                sessions: pastSessions.map(session => ({
                  id: session.id,
                  skill: { title: session.skill.name },
                  partnerName: session.teacherId === userId 
                    ? `${session.learner.firstName || ''} ${session.learner.lastName || ''}`.trim() 
                    : `${session.teacher.firstName || ''} ${session.teacher.lastName || ''}`.trim(),
                  date: session.scheduledTime,
                  duration: "1 hour", // Assume 1 hour or calculate from endTime if available
                  notes: session.notes || undefined,
                  role: session.teacherId === userId ? 'teacher' : 'learner',
                  status: 'completed'
                }))
              }} 
            />
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
              <CardDescription>View and manage your schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar 
                  mode="single" 
                  className="rounded-md border border-primary/10 bg-background/50 p-3"
                  // Optionally: highlight dates with sessions
                  // disabled={[...upcomingSessions, ...pastSessions].map(s => new Date(s.scheduledTime))}
                  // modifiers={{highlighted: [...upcomingSessions].map(s => new Date(s.scheduledTime))}}
                  // modifiersStyles={{highlighted: {backgroundColor: 'var(--primary/10)'}}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
