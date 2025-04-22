"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientDbClient } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbClient = createClientDbClient()

  useEffect(() => {
    async function verifyEmail() {
      try {
        const token = searchParams?.get("token")
        const type = searchParams?.get("type")

        if (!token || !type) {
          setError("Missing verification parameters")
          setVerifying(false)
          return
        }

        if (type === "signup" || type === "recovery") {
          const { error } = await dbClient.auth.verifyOtp({
            token_hash: token,
            type: type === "signup" ? "signup" : "recovery",
          })

          if (error) {
            setError(error.message)
          } else {
            setSuccess(true)
            // Consistent redirect approach
            if (type === "signup") {
              setTimeout(() => {
                router.push("/onboarding")
              }, 2000)
            } else {
              setTimeout(() => {
                router.push("/login")
              }, 2000)
            }
          }
        } else {
          setError("Invalid verification type")
        }
      } catch (err) {
        setError("An error occurred during verification")
      } finally {
        setVerifying(false)
      }
    }

    if (dbClient) {
      verifyEmail()
    }
  }, [searchParams, router, dbClient])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verifying
              ? "Verifying your email address..."
              : success
                ? "Your email has been verified!"
                : "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verifying ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          ) : success ? (
            <div className="text-center text-green-600">
              <p>Thank you for verifying your email address.</p>
              <p className="mt-2">You will be redirected shortly...</p>
            </div>
          ) : (
            <div className="text-center text-red-600">
              <p>{error || "An unknown error occurred."}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!verifying && !success && <Button onClick={() => router.push("/login")}>Return to Login</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
