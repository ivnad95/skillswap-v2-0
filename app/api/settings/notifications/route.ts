import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserNotificationSettings, updateUserNotificationSettings } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-utils';

// Fetch user's notification settings
export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = getUserNotificationSettings(userId);

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Failed to retrieve settings' }, { status: 500 });
  }

  return NextResponse.json(result.data); // Return the settings object directly
}

// Update user's notification settings
export async function PUT(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Basic validation: Ensure body is an object
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
       return NextResponse.json({ error: 'Invalid request body: Expected an object.' }, { status: 400 });
    }

    // Optional: Add more specific validation for expected setting keys/values (e.g., all values must be boolean)
    // for (const key in body) {
    //   if (typeof body[key] !== 'boolean') {
    //     return NextResponse.json({ error: `Invalid value for setting '${key}': Expected boolean.` }, { status: 400 });
    //   }
    // }

    const result = updateUserNotificationSettings(userId, body);

    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ message: "Notification settings updated successfully" });

  } catch (error) {
    console.error("Error processing PUT /api/settings/notifications:", error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
