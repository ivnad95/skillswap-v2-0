import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, createMessage, getMessagesBetweenUsers, DbMessage } from '@/lib/db'; // Import DB functions
import { getUserIdFromRequest } from '@/lib/auth-utils'; // Use utility to get user ID

// Fetch messages between the authenticated user and another user
export async function GET(request: NextRequest) {
  const userId1 = getUserIdFromRequest(request); // Get current user ID
  if (!userId1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId2 = searchParams.get('userId'); // Get the other user's ID from query param

  if (!userId2) {
    return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 });
  }

  const result = getMessagesBetweenUsers(userId1, userId2);

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Failed to retrieve messages' }, { status: 500 });
  }

  return NextResponse.json({ messages: result.data });
}

// Send a new message
export async function POST(request: NextRequest) {
  const senderId = getUserIdFromRequest(request); // Get sender (current user) ID
  if (!senderId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { recipientId, content } = body;

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Missing recipientId or content in request body' }, { status: 400 });
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
       return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

     if (senderId === recipientId) {
       return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 });
    }

    const result = createMessage(senderId, recipientId, content.trim());

    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Failed to send message' }, { status: 500 });
    }

    // Optionally return the created message ID or the full message object
    return NextResponse.json({ message: "Message sent successfully", messageId: result.data.id }, { status: 201 });

  } catch (error) {
    console.error("Error processing POST /api/messages:", error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
