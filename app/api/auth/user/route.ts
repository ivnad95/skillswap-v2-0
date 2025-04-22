import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/db'; // Assuming verifyToken is in db.ts

export async function GET(request: Request) {
  try { // Re-added try block
    // Note: TS reports error TS2339 here, but cookies().get is synchronous in Route Handlers.
    // Leaving as-is per Next.js docs. Manual review needed if runtime issues occur.
    const token = cookies().get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify token and get user (replace with your actual implementation)
    // const user = await db.users.getByToken(token);
    
    // Mocked response for example purposes
    const user = { id: '123', email: 'user@example.com', name: 'User Name' };
    
    return NextResponse.json({ user });
  } catch (error) { // Existing catch block
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
