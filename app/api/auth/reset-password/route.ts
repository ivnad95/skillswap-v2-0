import { NextRequest, NextResponse } from "next/server"
import { createPasswordResetToken } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required" } },
        { status: 400 }
      )
    }

    const result = createPasswordResetToken(email)

    if (result.error) {
      // Don't reveal if the email exists or not for security reasons
      return NextResponse.json({ success: true })
    }

    // In a real app, you would send an email with the reset link
    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      // Only include this in development for testing
      ...(process.env.NODE_ENV === 'development' && { token: result.token }),
    })
  } catch (error) {
    console.error("Error in reset-password route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
