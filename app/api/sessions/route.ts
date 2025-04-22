import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest, logSecurityEvent } from "@/lib/auth-utils";
import { createSession, getUserSessions, DBError } from "@/lib/db";

// GET all sessions for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the access attempt
    logSecurityEvent(
      userId,
      'GET',
      'sessions',
      null,
      true,
      'Attempting to access user sessions'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'GET',
        'sessions',
        null,
        false,
        'Unauthorized access attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Get the user's sessions
    const result = getUserSessions(userId);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to get sessions";
      logSecurityEvent(
        userId,
        'GET',
        'sessions',
        null,
        false,
        `Failed to get sessions: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'GET',
      'sessions',
      null,
      true,
      'Successfully retrieved user sessions'
    );
    
    return NextResponse.json({ sessions: result.data });
  } catch (error) {
    console.error("Error getting sessions:", error);
    logSecurityEvent(
      null,
      'GET',
      'sessions',
      null,
      false,
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}` // Type check error
    );
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// CREATE a new session
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the creation attempt
    logSecurityEvent(
      userId,
      'POST',
      'session',
      null,
      true,
      'Attempting to create session'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'POST',
        'session',
        null,
        false,
        'Unauthorized creation attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const sessionData = await req.json();
    
    // Ensure the user is either the teacher or learner
    if (sessionData.teacherId !== userId && sessionData.learnerId !== userId) {
      logSecurityEvent(
        userId,
        'POST',
        'session',
        null,
        false,
        'Unauthorized creation attempt - user must be teacher or learner'
      );
      
      return NextResponse.json(
        { error: { message: "You must be either the teacher or learner to create a session" } },
        { status: 403 }
      );
    }
    
    // Create the session
    const result = createSession(sessionData);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to create session";
      logSecurityEvent(
        userId,
        'POST',
        'session',
        null,
        false,
        `Failed to create session: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    // Use optional chaining and nullish coalescing for safety
    const sessionId = result.data?.id ?? null;
    
    logSecurityEvent(
      userId,
      'POST',
      'session',
      sessionId,
      true,
      'Successfully created session'
    );
    
    return NextResponse.json({ session: result.data }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    logSecurityEvent(
      null,
      'POST',
      'sessions',
      null,
      false,
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}` // Type check error
    );
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
