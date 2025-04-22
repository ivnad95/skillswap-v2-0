"use client"; // Convert to Client Component

import { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { UpcomingSession } from "@/components/upcoming-session";
import { SessionHistory } from "@/components/session-history";
import { CalendarPlus, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionScheduleModal } from "@/components/session-schedule-modal";
import { PopulatedDbSession as PopulatedSessionType } from "@/lib/db"; // Import type
import { useAuth } from "@/contexts/auth-context"; // Use auth context for user ID

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

export default function SessionsPage() {
  const { user, loading: authLoading } = useAuth(); // Get user from context
  const [upcomingSessions, setUpcomingSessions] = useState<PopulatedSessionType[]>([]);
  const [pastSessions, setPastSessions] = useState<PopulatedSessionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data function
  const fetchSessionData = useCallback(async () => {
    if (!user) return; // Need user to fetch sessions

    setIsLoading(true);
    setError(null);
    try {
      // Fetch sessions using the API route
      const response = await fetch('/api/sessions'); // GET /api/sessions fetches current user's sessions
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || "Failed to load sessions");
      }
      const sessionsResult = await response.json();
      const allSessions: PopulatedSessionType[] = sessionsResult.sessions || []; // Adjust based on API response

      const now = new Date();
      setUpcomingSessions(allSessions.filter((session) => new Date(session.start_time) >= now));
      setPastSessions(allSessions.filter((session) => new Date(session.start_time) < now));

    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depend on user

  // Fetch data when user is available
  useEffect(() => {
    if (!authLoading && user) {
      fetchSessionData();
    } else if (!authLoading && !user) {
      // Handle case where user is definitely not logged in (e.g., redirect or show message)
      // This might be redundant if middleware handles redirects properly
      setIsLoading(false);
      setError("Please log in to view sessions.");
    }
  }, [user, authLoading, fetchSessionData]);

  // Handle session scheduled callback to refresh data
  const handleSessionScheduled = () => {
    fetchSessionData(); // Re-fetch sessions after a new one is scheduled
  };

  // Show loading state while auth is loading or sessions are fetching
  if (authLoading || (isLoading && !error)) {
     return (
      <DashboardShell>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">Manage your teaching and learning sessions.</p>
        </div>
        {/* Use the SessionScheduleModal component */}
        <SessionScheduleModal onSessionScheduled={handleSessionScheduled} />
      </div>

      {error && !isLoading && (
         <Alert variant="destructive" className="mt-6">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!error && (
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
                {isLoading ? ( // Show skeleton while loading specifically this tab's data if needed
                  <div className="space-y-4">
                    <UpcomingSessionSkeleton />
                    <UpcomingSessionSkeleton />
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <UpcomingSession
                        key={session.id}
                        title={session.skill.name}
                        role={session.teacher_id === user?.id ? "teacher" : "student"} // Use snake_case
                        with={session.teacher_id === user?.id // Use snake_case
                          ? `${session.learner.first_name || ''} ${session.learner.last_name || ''}`.trim()
                          : `${session.teacher.first_name || ''} ${session.teacher.last_name || ''}`.trim()}
                        date={new Date(session.start_time).toLocaleString()} // Use snake_case
                        tokens={session.token_amount || 0}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No upcoming sessions scheduled.
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
               </div>
             ) : (
               <SessionHistory
                 profileData={{ // Pass sessions directly if SessionHistory expects this structure
                   sessions: pastSessions.map(session => ({
                     id: session.id,
                     skill: { title: session.skill.name },
                     partnerName: session.teacher_id === user?.id // Use snake_case
                       ? `${session.learner.first_name || ''} ${session.learner.last_name || ''}`.trim()
                       : `${session.teacher.first_name || ''} ${session.teacher.last_name || ''}`.trim(),
                     date: session.start_time, // Use snake_case
                     duration: "1 hour", // TODO: Calculate duration properly if end_time exists
                     notes: session.notes || undefined,
                     role: session.teacher_id === user?.id ? 'teacher' : 'learner', // Use snake_case
                     status: session.status
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
                    // TODO: Implement highlighting/disabling dates based on session data
                    // modifiers={{highlighted: [...upcomingSessions].map(s => new Date(s.scheduledTime))}}
                    // modifiersStyles={{highlighted: {backgroundColor: 'var(--primary/10)'}}}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  );
}
