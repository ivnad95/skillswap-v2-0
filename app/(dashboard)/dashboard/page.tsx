"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientDbClient } from '@/lib/db-client'; // Removed createServerDbClient
import { useAuth } from "@/contexts/auth-context"
import DashboardPageClient from "./DashboardPageClient"

// Define placeholder types for fetched data
// TODO: Replace 'any' with more specific types based on actual data structure
type UserProfile = {
  bio: string;
  location: string;
  social_links: Record<string, string>;
  learning_preferences: Record<string, any>;
};

type UserSkill = any; // Placeholder
type UserSession = any; // Placeholder

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [userData, setUserData] = useState<{
    profile: UserProfile;
    skills: UserSkill[];
    sessions: UserSession[];
    user: any; // Keep user from AuthContext for now
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null); // Add error state
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
       if (!user) return

       try {
         setIsLoading(true);
         setError(null); // Reset error on new fetch

         // TODO: Replace this with an actual API call to fetch dashboard data
         // Example: const response = await fetch('/api/dashboard');
         // if (!response.ok) throw new Error('Failed to fetch dashboard data');
         // const data = await response.json();
         // setUserData(data);

         // For now, continue using empty data structure
         setUserData({
           profile: {
             bio: "",
             location: "",
             social_links: {},
             learning_preferences: {}
           },
           skills: [],
           sessions: [],
           user, // Pass the user object from AuthContext
         })

       } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
         setUserData(null); // Clear data on error
       } finally {
         setIsLoading(false)
      }
    }

    if (!loading) {
       if (user) {
         fetchUserData()
       } else {
         // Redirect if user is definitely not logged in after auth check
         router.push("/login?redirect=/dashboard")
       }
     }
   }, [user, loading, router])

   // Combined loading state check
   if (loading || isLoading) {
     return ( // Loading state UI
       <div className="flex h-screen items-center justify-center">
         <div className="animate-pulse flex flex-col items-center">
           <div className="h-12 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
           <div className="mt-4 h-4 w-32 rounded bg-slate-300 dark:bg-slate-700"></div>
         </div>
       </div>
     )
   }

   // Handle case where user is null after loading (should be redirected by useEffect, but good practice)
   if (!user) {
     return null
   }

   // Handle error state
   if (error) {
     return ( // Error state UI
       <div className="flex h-screen items-center justify-center text-red-500">
         Error loading dashboard: {error}
       </div>
     )
   }

   // Handle case where data hasn't loaded successfully but there's no error yet
   if (!userData) {
      return ( // Return a specific "No data" or loading component
        <div className="flex h-screen items-center justify-center">
           Loading dashboard data...
         </div>
       )
    }

   // Success state: Render the client component with data
   return (
     <div>
       <DashboardPageClient userData={userData} />
     </div>
   )
}
