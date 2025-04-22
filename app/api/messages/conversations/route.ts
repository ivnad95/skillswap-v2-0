import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getConversationList } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-utils';

// GET handler to fetch the current user's conversation list
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = getConversationList(userId);

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Failed to retrieve conversations' }, { status: 500 });
  }

  return NextResponse.json({ conversations: result.data });
}
