import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: { message: "Token is required" } },
        { status: 400 }
      )
    }

    const result = verifyToken(token)

    if (result.error) {
      return NextResponse.json(
        { error: { message: "Invalid or expired token" } },
        { status: 401 }
      )
    }

    // Extract user from session
    const user = result.data?.session?.user

    if (!user) {
      return NextResponse.json(
        { error: { message: "Invalid token" } },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error in verify route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
