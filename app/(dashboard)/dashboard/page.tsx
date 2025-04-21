"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientDbClient, createServerDbClient } from '@/lib/db-client';
import { useAuth } from "@/contexts/auth-context"
import DashboardPageClient from "./DashboardPageClient"

interface UserData {
  profile: {
    bio: string;
    location: string;
    social_links: Record<string, string>;
    learning_preferences: Record<string, any>;
  };
  skills: any[];
  sessions: any[];
  user: any;
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      try {
        // In a real implementation, we would fetch this data from the database
        // For now, we'll create an empty user data structure for the user to fill in
        console.log("Creating empty user data for", user.id)

        // Create empty user data - no mock data
        setUserData({
          profile: {
            bio: "",
            location: "",
            social_links: {},
            learning_preferences: {}
          },
          skills: [],
          sessions: [],
          user,
        })
      } catch (error) {
        console.error("Error creating user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      if (user) {
        fetchUserData()
      } else {
        router.push("/login?redirect=/dashboard")
      }
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="mt-4 h-4 w-32 rounded bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // If userData is not set, create an empty one
  if (!userData) {
    return <DashboardPageClient userData={{
      profile: {
        bio: "",
        location: "",
        social_links: {},
        learning_preferences: {}
      },
      skills: [],
      sessions: [],
      user,
    }} />
  }

  return <DashboardPageClient userData={userData} />
}
