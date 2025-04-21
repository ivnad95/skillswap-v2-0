import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Award, Plus } from "lucide-react"

interface Skill {
  id: number | string
  title: string
  description?: string
  level?: string
  experience?: string
  rate?: number
  sessions?: number
  students?: number
  rating?: number
  proficiency?: number
  progress?: number
  tags?: string[]
  type?: 'teaching' | 'learning'
}

interface ProfileData {
  skills?: Skill[]
}

interface SkillShowcaseProps {
  defaultTab?: "teaching" | "learning"
  profileData?: ProfileData
}

export function SkillShowcase({ profileData, defaultTab = "teaching" }: SkillShowcaseProps) {
  // Get skills from the profileData
  const skills = profileData?.skills || []
  
  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No skills added yet.</p>
        <p className="mt-2 text-sm">Add skills to showcase your expertise.</p>
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {skills.map((skill, index) => (
        <div 
          key={skill.id || index} 
          className="p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm"
        >
          <h3 className="font-medium">{skill.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{skill.description || "No description provided"}</p>
          <div className="flex items-center mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
              {skill.level || "Beginner"}
            </span>
            {skill.type && (
              <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
