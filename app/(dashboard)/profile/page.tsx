"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { SkillShowcase } from "@/components/skill-showcase"
import { ReviewsSection } from "@/components/reviews-section"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { SessionHistory } from "@/components/session-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define ProfileData type for better type safety
export interface Skill {
  id: string | number;
  title: string;
  type?: 'teaching' | 'learning';
  level?: string;
  description?: string;
  tags?: string[];
  rate?: number;
  experience?: string;
  sessions?: number;
  students?: number;
  rating?: number;
  progress?: number;
  proficiency?: number;
}

export interface ProfileData {
  id?: string;
  userId?: string;
  bio?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  profileImage?: string | null;
  coverImage?: string | null;
  availability?: any[];
  skills?: Skill[];
  reviews?: any[];
  sessions?: any[];
  learningPreferences?: Record<string, any>;
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchProfileData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      // Fetch profile data from the API
      const response = await fetch('/api/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      console.log("Fetched profile data:", data.profile)
      setProfileData(data.profile)
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      if (user) {
        fetchProfileData()
      } else {
        router.push("/login?redirect=/profile")
      }
    }
  }, [user, loading, router])

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  const handleProfileSave = (updatedData: Partial<ProfileData>) => {
    // Update state with new profile data
    setProfileData(prev => ({
      ...prev,
      ...updatedData
    } as ProfileData))
    
    // Refresh data from server to ensure everything is in sync
    fetchProfileData()
  }

  if (loading || isLoading) {
    return (
      <DashboardShell className="flex-1">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  // Create an empty profile if none exists yet
  const emptyProfile: ProfileData = {
    skills: [],
    reviews: [],
    availability: [],
    sessions: []
  }

  // Use the actual profile data or the empty profile if null
  const profileToUse = profileData || emptyProfile

  return (
    <DashboardShell className="flex-1">
      <ProfileHeader 
        profileData={profileToUse}
        user={user}
        onEditClick={handleEditProfile}
      />

      {isEditModalOpen && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileToUse}
          onSave={handleProfileSave}
        />
      )}

      <Tabs defaultValue="skills" className="mt-8">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Skills & Expertise</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">
                Teaching
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20">
                Learning
              </Badge>
            </div>
          </div>
          
          <SkillShowcase profileData={profileToUse} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6 mt-6">
          <ReviewsSection profileData={profileToUse} />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6 mt-6">
          <AvailabilityCalendar profileData={profileToUse} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <SessionHistory profileData={profileToUse} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
