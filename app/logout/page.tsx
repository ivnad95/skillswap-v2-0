"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LogoutPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut()
        router.push("/")
      } catch (error) {
        // Optionally add user-facing error handling here
      }
    }

    performLogout()
  }, [signOut, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p className="text-lg">Signing out...</p>
    </div>
  )
}
