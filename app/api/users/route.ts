import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db'; // Import db instance

// Define a basic user type for the response
interface BasicUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  // Add other fields if needed, e.g., profileImage
}

// GET handler to fetch users, potentially filtered by role or search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // e.g., 'teacher' or 'learner'
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50', 10); // Default limit

  try {
    let query = `
      SELECT DISTINCT u.id, u.first_name, u.last_name
      FROM users u
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // Join skills table if filtering by role
    if (role === 'teacher' || role === 'learner') {
      query += ` JOIN skills s ON u.id = s.user_id `;
      conditions.push(`s.type = ?`);
      params.push(role === 'teacher' ? 'teaching' : 'learning');
    }

    // Add search condition if provided
    if (search) {
      conditions.push(`(u.first_name LIKE ? OR u.last_name LIKE ? OR (u.first_name || ' ' || u.last_name) LIKE ?)`);
      const likeTerm = `%${search}%`;
      params.push(likeTerm, likeTerm, likeTerm);
    }

    // Append WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY u.first_name, u.last_name LIMIT ?`;
    params.push(limit);

    const stmt = db.prepare(query);
    const usersRaw = stmt.all(...params) as any[];

    const users: BasicUser[] = usersRaw.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name
    }));

    return NextResponse.json({ users });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
