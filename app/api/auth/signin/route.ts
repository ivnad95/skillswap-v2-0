import { NextRequest, NextResponse } from "next/server"
import { verifyUser } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRY = '7d'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required" } },
        { status: 400 }
      )
    }

    // Special case for test@example.com - we know it already exists
    // No need to try to create it again, just log for debugging
    if (email === 'test@example.com' && password === 'password123') {
      console.log('Using test user credentials')
    }

    console.log('Verifying user:', email)

    const result = await verifyUser(email, password)

    if (result.error) {
      return NextResponse.json(
        { error: { message: result.error.message } },
        { status: 401 }
      )
    }

    // Extract user from data.session
    const user = result.data?.session?.user

    if (!user) {
      return NextResponse.json(
        { error: { message: "Authentication failed" } },
        { status: 401 }
      )
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    )

    console.log('Login successful, generated token for user:', user.id)

    // Correct way to set cookie: on the NextResponse object
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });

    // Set the cookie on the response
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response; // Return the response with the cookie set

  } catch (error) {
    console.error("Error in signin route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
