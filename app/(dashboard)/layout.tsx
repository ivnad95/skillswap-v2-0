"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth() // Changed isLoading to loading
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) { // Changed isLoading to loading
      router.push("/login")
    }
  }, [user, loading, router]) // Changed isLoading to loading

  if (loading) { // Changed isLoading to loading
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md"></div>
            <span className="text-lg font-medium">SkillSwap</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary">
              Explore
            </Link>
            <Link href="/sessions" className="text-sm font-medium hover:text-primary">
              Sessions
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:text-primary">
              Messages
            </Link>
            <div className="ml-4">
              <UserMenu />
            </div>
          </nav>
        </div>
       </header>
       <main className="flex-1">
         {children}
         {/* Removed placeholder Component Diagram section */}
       </main>
     </div>
  )
}
