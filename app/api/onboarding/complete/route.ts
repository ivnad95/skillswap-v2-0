import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { completeUserOnboarding } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Get the onboarding data from the request body
    const onboardingData = await req.json();

    // console.log('Onboarding data received:', onboardingData); // Removed log
    // console.log('User ID:', userId); // Removed log

    // Complete the onboarding process
    const result = await completeUserOnboarding(userId, onboardingData);

    if (result.error) {
      console.error('Error completing onboarding:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // console.log('Onboarding completed successfully'); // Removed log

    // Set the onboarding-completed cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('onboarding-completed', 'true', {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error in onboarding complete API:', error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
