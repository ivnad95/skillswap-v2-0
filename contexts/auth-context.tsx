"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

// Define the User type
export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
}

// Define the AuthContext type
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, redirectTo?: string) => Promise<{ error?: { message: string } }>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: { message: string }, needsEmailVerification?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: { message: string } }>
  updatePassword: (password: string) => Promise<{ error?: { message: string } }>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if the user is authenticated on mount
  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        // Get the token from cookies
        const token = Cookies.get('auth-token')

        if (token) {
          // Verify the token on the server
          const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })

          const data = await res.json()

          if (data.user) {
            setUser(data.user)
          } else {
            // If token is invalid, remove it
            Cookies.remove('auth-token')
            setUser(null)
          }
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromCookies()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.error) {
        return { error: data.error }
      }

      // Set the user in state
      setUser(data.user)

      // Set the token in cookies
      Cookies.set('auth-token', data.token, { expires: 7 }) // 7 days

      // Check if the user has completed onboarding
      try {
        const onboardingRes = await fetch('/api/onboarding/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const onboardingData = await onboardingRes.json()

        // If onboarding is not completed, redirect to onboarding
        if (!onboardingData.completed) {
          window.location.href = '/onboarding'
          return {}
        }
      } catch (error) {
        // Continue with normal flow if there's an error checking onboarding status
      }

      // Redirect if a redirect path is provided
      if (redirectTo) {
        // Use window.location for a hard redirect
        window.location.href = redirectTo
      }

      return {}
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await res.json()

      if (data.error) {
        return { error: data.error }
      }

      // If email verification is required
      if (data.needsEmailVerification) {
        return { needsEmailVerification: true }
      }

      return {}
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      // Remove the token from cookies
      Cookies.remove('auth-token')

      // Remove the onboarding-completed cookie
      Cookies.remove('onboarding-completed')

      // Clear the user from state
      setUser(null)

      // Redirect to home page
      router.push('/')
    } catch (error) {
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.error) {
        return { error: data.error }
      }

      return {}
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Update password function
  const updatePassword = async (password: string) => {
    try {
      if (!user) {
        return { error: { message: 'You must be logged in to update your password' } }
      }

      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.error) {
        return { error: data.error }
      }

      return {}
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Create the context value
  const value: AuthContextType = { // Add explicit type annotation
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  // Return the provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
