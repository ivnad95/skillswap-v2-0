import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { SkillShowcase } from "@/components/skill-showcase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "My Skills | SkillSwap",
  description: "Manage your teaching and learning skills",
}

export default function SkillsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <p className="text-muted-foreground">Manage your teaching and learning skills.</p>
        </div>
        <Button variant="gradient">
          <Plus className="mr-2 h-4 w-4" /> Add New Skill
        </Button>
      </div>

      <Tabs defaultValue="teaching" className="mt-6">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="teaching" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Teaching Skills</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
                Active
              </Badge>
              <Badge variant="outline" className="bg-background/50">
                Inactive
              </Badge>
            </div>
          </div>
          <SkillShowcase defaultTab="teaching" profileData={{ skills: [] }} />
        </TabsContent>

        <TabsContent value="learning" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Learning Skills</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20">
                Active
              </Badge>
              <Badge variant="outline" className="bg-background/50">
                Completed
              </Badge>
            </div>
          </div>
          <SkillShowcase defaultTab="learning" profileData={{ skills: [] }} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Skill Analytics</CardTitle>
              <CardDescription>Track your progress and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Teaching Hours</h3>
                  <div className="text-3xl font-bold">64</div>
                  <p className="text-sm text-muted-foreground">+12 from last month</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Learning Hours</h3>
                  <div className="text-3xl font-bold">28</div>
                  <p className="text-sm text-muted-foreground">+4 from last month</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Average Rating</h3>
                  <div className="text-3xl font-bold">4.9</div>
                  <p className="text-sm text-muted-foreground">Based on 30 reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
