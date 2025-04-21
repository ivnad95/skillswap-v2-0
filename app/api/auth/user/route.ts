import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
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
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
