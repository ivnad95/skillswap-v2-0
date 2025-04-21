import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { hasCompletedOnboarding } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Check if the user has completed onboarding
    const result = hasCompletedOnboarding(userId);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    // Set the onboarding-completed cookie based on the result
    const response = NextResponse.json({ completed: result.completed });
    
    if (result.completed) {
      response.cookies.set('onboarding-completed', 'true', {
        path: '/',
        maxAge: 31536000, // 1 year
        httpOnly: true,
        sameSite: 'strict',
      });
    } else {
      // Clear the cookie if onboarding is not completed
      response.cookies.set('onboarding-completed', '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      });
    }
    
    return response;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
