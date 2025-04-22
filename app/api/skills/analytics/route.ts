import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserSkillAnalytics } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-utils';

// Fetch user's skill analytics
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = getUserSkillAnalytics(userId);

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Failed to retrieve skill analytics' }, { status: 500 });
  }

  // Map DB results to frontend structure if needed, or return directly
  // Example mapping (adjust based on frontend needs):
  const analyticsData = {
      teachingHours: result.data.teachingSessionCount, // Approximation: 1 session = 1 hour
      learningHours: result.data.learningSessionCount, // Approximation: 1 session = 1 hour
      averageRating: result.data.averageRating,
      ratingCount: result.data.ratingCount
  };


  return NextResponse.json({ analytics: analyticsData }); // Wrap in 'analytics' key as expected by frontend
}
