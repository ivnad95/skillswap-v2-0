import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { markMessagesAsRead } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-utils';

// PUT handler to mark messages from a specific sender as read
export async function PUT(request: NextRequest) {
  const recipientId = getUserIdFromRequest(request); // The current user is the recipient
  if (!recipientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { senderId } = body; // ID of the user whose messages should be marked read

    if (!senderId) {
      return NextResponse.json({ error: 'Missing senderId in request body' }, { status: 400 });
    }

    const result = markMessagesAsRead(recipientId, senderId);

    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Failed to mark messages as read' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error processing PUT /api/messages/read:", error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
