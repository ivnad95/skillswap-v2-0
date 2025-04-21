"use client" // Need client component for hooks and interaction

import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { SkillShowcase } from "@/components/skill-showcase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react" // Added Loader2
import { useRouter } from "next/navigation"; // Added useRouter
import { useState, useEffect } from "react"; // Added hooks
import { useAuth } from "@/contexts/auth-context"; // Added useAuth

// Define placeholder types
type Skill = any; // TODO: Define proper Skill type based on actual data
type AnalyticsData = { // TODO: Define proper Analytics type based on actual data
  teachingHours: number | string;
  learningHours: number | string;
  averageRating: number | string;
  ratingCount: number | string;
};

// Metadata can remain if needed, but page is now client-side
// export const metadata: Metadata = {
//   title: "My Skills | SkillSwap",
//   description: "Manage your teaching and learning skills",
// }

export default function SkillsPage() {
  const router = useRouter();
  const { user } = useAuth(); // Get user info if needed for API calls
  const [skills, setSkills] = useState<Skill[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set metadata dynamically if needed (requires document object)
    document.title = "My Skills | SkillSwap";

    const fetchData = async () => {
      if (!user) return; // Ensure user is available
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Implement API calls to fetch skills and analytics
        // const skillsRes = await fetch('/api/skills'); // Fetch user's skills
        // const analyticsRes = await fetch('/api/skills/analytics'); // Fetch analytics
        // if (!skillsRes.ok || !analyticsRes.ok) throw new Error('Failed to load skill data');
        // const skillsData = await skillsRes.json();
        // const analyticsData = await analyticsRes.json();
        // setSkills(skillsData.skills || []);
        // Fetch actual data
        const skillsRes = await fetch('/api/skills'); // Assuming this fetches user's skills (teaching & learning)
        const analyticsRes = await fetch('/api/skills/analytics'); // Assuming this endpoint exists

        if (!skillsRes.ok) {
          const skillsError = await skillsRes.json();
          throw new Error(skillsError.message || skillsError.error || 'Failed to load skills');
        }
         if (!analyticsRes.ok) {
          const analyticsError = await analyticsRes.json();
          // Allow analytics to fail gracefully? Or throw error? For now, log and continue.
          console.error('Failed to load analytics:', analyticsError.message || analyticsError.error);
          setAnalytics(null); // Set analytics to null if fetch fails
        } else {
           const analyticsData = await analyticsRes.json();
           // Assuming API returns { analytics: ... } or the object directly
           setAnalytics(analyticsData.analytics || analyticsData || null);
        }

        const skillsData = await skillsRes.json();
        // Assuming API returns { skills: [...] } or the array directly
        setSkills(skillsData.skills || skillsData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
        console.error("Error fetching skill data:", err); // Log the actual error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]); // Re-fetch if user changes

  const handleAddNewSkill = () => {
    // TODO: Decide if adding teaching/learning goes to same page or separate
    // Or open a modal instead of navigating
    router.push('/skills/new/teaching'); // Example navigation
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <p className="text-muted-foreground">Manage your teaching and learning skills.</p>
        </div>
        <Button variant="gradient" onClick={handleAddNewSkill}>
          <Plus className="mr-2 h-4 w-4" /> Add New Skill
        </Button>
      </div>

      <Tabs defaultValue="teaching" className="mt-6">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-10 mt-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && error && <div className="text-red-500 mt-6 p-4 border border-destructive rounded-md">Error loading skills data: {error}</div>}

        {/* Content Tabs (only render content if not loading and no error) */}
        {!isLoading && !error && (
          <>
            <TabsContent value="teaching" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Teaching Skills</h2>
                {/* TODO: Implement filtering logic for badges */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 cursor-pointer">
                    Active
                  </Badge>
                  <Badge variant="outline" className="bg-background/50 cursor-pointer">
                    Inactive
                  </Badge>
                 </div>
               </div>
               <SkillShowcase defaultTab="teaching" profileData={{ skills: skills.filter((s: Skill) => s.type === 'teaching') }} />
             </TabsContent>
 
            <TabsContent value="learning" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Learning Skills</h2>
                 {/* TODO: Implement filtering logic for badges */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer">
                    Active
                  </Badge>
                  <Badge variant="outline" className="bg-background/50 cursor-pointer">
                    Completed
                  </Badge>
                 </div>
               </div>
               <SkillShowcase defaultTab="learning" profileData={{ skills: skills.filter((s: Skill) => s.type === 'learning') }} />
             </TabsContent>
 
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Skill Analytics</CardTitle>
                  <CardDescription>Track your progress and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Teaching Hours</h3>
                        <div className="text-3xl font-bold">{analytics.teachingHours}</div>
                        {/* Add comparison logic if available */}
                        {/* <p className="text-sm text-muted-foreground">+12 from last month</p> */}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Learning Hours</h3>
                        <div className="text-3xl font-bold">{analytics.learningHours}</div>
                        {/* <p className="text-sm text-muted-foreground">+4 from last month</p> */}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Average Rating</h3>
                        <div className="text-3xl font-bold">{analytics.averageRating}</div>
                        <p className="text-sm text-muted-foreground">Based on {analytics.ratingCount} reviews</p>
                      </div>
                    </div>
                  ) : (
                     <p className="text-muted-foreground">Analytics data not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </DashboardShell>
  )
}
