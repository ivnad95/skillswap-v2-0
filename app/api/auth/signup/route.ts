import { NextRequest, NextResponse } from "next/server"
import { createUser, createEmailVerificationToken } from "@/lib/db"
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRY = '7d'

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: { message: "All fields are required" } },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { message: "Invalid email format" } },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: { message: "Password must be at least 8 characters long" } },
        { status: 400 }
      )
    }

    // Create the user
    const result = await createUser(email, password, firstName, lastName)

    if (!result.userId) {
      return NextResponse.json(
        { error: { message: "Failed to create user" } },
        { status: 500 }
      )
    }

    // Create email verification token
    // In a real app, you would send this token via email
    const verificationToken = createEmailVerificationToken(result.userId)

    // Create a JWT token
    const token = jwt.sign(
      {
        id: result.userId,
        email,
        firstName,
        lastName,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    )

    // Set auth cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({
      needsEmailVerification: true,
      // Only include this in development for testing
      ...(process.env.NODE_ENV === 'development' && { verificationToken }),
      token
    })
  } catch (error: any) {
    console.error("Error in signup route:", error)

    // Check for duplicate email error
    if (error.message && error.message.includes('UNIQUE constraint failed: users.email')) {
      return NextResponse.json(
        { error: { message: "Email already in use" } },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
