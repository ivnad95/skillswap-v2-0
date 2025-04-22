import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { searchTeachers } from '@/lib/db';
// No auth needed for public search? Or add getUserIdFromRequest if needed later.

// Search for teachers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || undefined; // Get search term from query

  const result = searchTeachers(searchTerm);

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Failed to search teachers' }, { status: 500 });
  }

  return NextResponse.json({ teachers: result.data });
}
