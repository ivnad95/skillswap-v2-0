import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

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
    const { table, data, conditions } = await req.json()

    if (!table || !data || !conditions) {
      return NextResponse.json(
        { error: { message: "Table name, data, and conditions are required" } },
        { status: 400 }
      )
    }

    // Ensure data and conditions are objects
    if (typeof data !== 'object' || Array.isArray(data) || typeof conditions !== 'object' || Array.isArray(conditions)) {
      return NextResponse.json(
        { error: { message: "Data and conditions must be objects" } },
        { status: 400 }
      )
    }

    // Add updated_at timestamp
    data.updated_at = new Date().toISOString()

    // Build the SQL query
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ')
    const values = [...Object.values(data), ...Object.values(conditions)]

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`

    // Execute the query
    try {
      db.prepare(sql).run(...values)
    } catch (error: any) {
      return NextResponse.json(
        { error: { message: `Database error: ${error.message}` } },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in update route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
