import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(req: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      )
    }

    // Verify the token
    let userId: string
    try {
      const decoded = jwt.verify(authToken, JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json(
        { error: { message: "Invalid authentication" } },
        { status: 401 }
      )
    }

    // Get request body
    const { table, data } = await req.json()

    if (!table || !data) {
      return NextResponse.json(
        { error: { message: "Table name and data are required" } },
        { status: 400 }
      )
    }

    // Ensure data is an object
    if (typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json(
        { error: { message: "Data must be an object" } },
        { status: 400 }
      )
    }

    // Add id if not provided
    if (!data.id) {
      data.id = uuidv4()
    }

    // Add user_id if not provided (for tables that need it)
    if (!data.user_id && ['profiles', 'skills', 'sessions'].includes(table)) {
      data.user_id = userId
    }

    // Add timestamps
    const now = new Date().toISOString()
    if (!data.created_at) {
      data.created_at = now
    }
    if (!data.updated_at) {
      data.updated_at = now
    }

    // Build the SQL query
    const columns = Object.keys(data)
    const placeholders = columns.map(() => '?').join(', ')
    const values = Object.values(data)

    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`

    // Execute the query
    try {
      db.prepare(sql).run(...values)
    } catch (error: any) {
      return NextResponse.json(
        { error: { message: `Database error: ${error.message}` } },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in insert route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
