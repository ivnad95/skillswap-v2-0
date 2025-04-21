import { NextRequest, NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: { message: "Token is required" } },
        { status: 400 }
      )
    }

    const result = await verifyEmailToken(token)

    if (result.error) {
      return NextResponse.json(
        { error: { message: result.error.message || "Invalid or expired token" } },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in verify-email route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
