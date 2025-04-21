import { NextRequest, NextResponse } from "next/server"
import { resetPassword } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    // If token is provided, it's a password reset
    if (token) {
      if (!password) {
        return NextResponse.json(
          { error: { message: "Password is required" } },
          { status: 400 }
        )
      }

      const result = await resetPassword(token, password)

      if (result.error) {
        return NextResponse.json(
          { error: { message: result.error.message || "Invalid or expired token" } },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })
    } 
    // Otherwise, it's a password update for a logged-in user
    else {
      // Get the auth token from cookies
      const cookieStore = await cookies()
      const authToken = cookieStore.get('auth-token')?.value

      if (!authToken) {
        return NextResponse.json(
          { error: { message: "Authentication required" } },
          { status: 401 }
        )
      }

      if (!password) {
        return NextResponse.json(
          { error: { message: "Password is required" } },
          { status: 400 }
        )
      }

      // Verify the token
      try {
        const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string }
        
        // Update the password
        const result = await resetPassword(decoded.id, password)

        if (result.error) {
          return NextResponse.json(
            { error: { message: result.error.message || "Failed to update password" } },
            { status: 400 }
          )
        }

        return NextResponse.json({ success: true })
      } catch (error) {
        return NextResponse.json(
          { error: { message: "Invalid authentication" } },
          { status: 401 }
        )
      }
    }
  } catch (error) {
    console.error("Error in update-password route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
