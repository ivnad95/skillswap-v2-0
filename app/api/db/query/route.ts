import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(req: NextRequest) {
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

    // Get query parameters
    const url = new URL(req.url)
    const table = url.searchParams.get('table')
    const select = url.searchParams.get('select') || '*'
    const filtersJson = url.searchParams.get('filters')
    const orderField = url.searchParams.get('orderField')
    const orderDirection = url.searchParams.get('orderDirection') || 'asc'
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 0
    const single = url.searchParams.get('single') === 'true'

    if (!table) {
      return NextResponse.json(
        { error: { message: "Table name is required" } },
        { status: 400 }
      )
    }

    // Build the SQL query
    let sql = `SELECT ${select} FROM ${table}`
    const params: any[] = []

    // Add WHERE clause if filters are provided
    if (filtersJson) {
      try {
        const filters = JSON.parse(filtersJson)
        if (filters.length > 0) {
          sql += ' WHERE '
          
          const conditions: string[] = []
          
          filters.forEach((filter: any, index: number) => {
            const { field, operator, value } = filter
            
            // Special case for OR conditions
            if (operator === 'or') {
              conditions.push(`(${value})`)
              return
            }
            
            let condition: string
            
            switch (operator) {
              case 'eq':
                condition = `${field} = ?`
                params.push(value)
                break
              case 'neq':
                condition = `${field} != ?`
                params.push(value)
                break
              case 'gt':
                condition = `${field} > ?`
                params.push(value)
                break
              case 'gte':
                condition = `${field} >= ?`
                params.push(value)
                break
              case 'lt':
                condition = `${field} < ?`
                params.push(value)
                break
              case 'lte':
                condition = `${field} <= ?`
                params.push(value)
                break
              case 'like':
                condition = `${field} LIKE ?`
                params.push(`%${value}%`)
                break
              case 'ilike':
                condition = `${field} LIKE ?`
                params.push(`%${value}%`)
                break
              case 'is':
                condition = `${field} IS ?`
                params.push(value)
                break
              case 'in':
                condition = `${field} IN (${value.map(() => '?').join(', ')})`
                params.push(...value)
                break
              default:
                condition = `${field} = ?`
                params.push(value)
            }
            
            conditions.push(condition)
          })
          
          sql += conditions.join(' AND ')
        }
      } catch (error) {
        return NextResponse.json(
          { error: { message: "Invalid filters format" } },
          { status: 400 }
        )
      }
    }

    // Add ORDER BY clause if orderField is provided
    if (orderField) {
      sql += ` ORDER BY ${orderField} ${orderDirection.toUpperCase()}`
    }

    // Add LIMIT clause if limit is provided
    if (limit > 0) {
      sql += ` LIMIT ${limit}`
    }

    // Execute the query
    let result
    try {
      if (single) {
        result = db.prepare(sql).get(...params)
      } else {
        result = db.prepare(sql).all(...params)
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: { message: `Database error: ${error.message}` } },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error in query route:", error)
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    )
  }
}
