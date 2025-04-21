"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")
  const redirectTo = redirectParam || "/dashboard"

  // console.log('Login page loaded with redirect parameter:', redirectParam, 'final redirectTo:', redirectTo) // Removed console.log

  // Auto-login is disabled to prevent infinite loops
  // The following useEffect block was commented out and has been removed for clarity.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // console.log('Login form submitted, redirectTo:', redirectTo) // Removed console.log

      // Use auth context consistently instead of direct fetch
      // Pass redirectTo to signIn so AuthContext can handle redirection after onboarding check
      const { error } = await signIn(email, password, redirectTo)
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Success toast
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      })

      // Redirection is handled within the signIn function in AuthContext
      // after checking onboarding status. No need to router.push here.
      // console.log('Login successful, redirecting to:', redirectTo) // Removed console.log
      // router.push(redirectTo) // Removed redundant router.push

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-10 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                 placeholder="Email"
                 value={email}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                 required
                 disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                 placeholder="Password"
                 value={password}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                 required
                 disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center text-gray-500">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
