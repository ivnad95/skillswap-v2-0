import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest, logSecurityEvent } from "@/lib/auth-utils";
import { updateSession, deleteSession, verifyResourceOwnership, DBError } from "@/lib/db";

// GET a specific session
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the access attempt
    logSecurityEvent(
      userId,
      'GET',
      'session',
      sessionId,
      true,
      'Attempting to access session'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'GET',
        'session',
        sessionId,
        false,
        'Unauthorized access attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Check if the user has access to this session
    const hasAccess = verifyResourceOwnership('session', sessionId, userId);
    
    if (!hasAccess) {
      logSecurityEvent(
        userId,
        'GET',
        'session',
        sessionId,
        false,
        'Unauthorized access attempt - user is not a participant'
      );
      
      return NextResponse.json(
        { error: { message: "You do not have permission to access this session" } },
        { status: 403 }
      );
    }
    
    // In a real implementation, we would fetch the session data here
    // For now, we'll just return a success message
    logSecurityEvent(
      userId,
      'GET',
      'session',
      sessionId,
      true,
      'Successfully accessed session'
    );
    
    return NextResponse.json({ success: true, message: "Session accessed successfully" });
  } catch (error) {
    console.error("Error accessing session:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// UPDATE a specific session
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the update attempt
    logSecurityEvent(
      userId,
      'PUT',
      'session',
      sessionId,
      true,
      'Attempting to update session'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'PUT',
        'session',
        sessionId,
        false,
        'Unauthorized update attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const sessionData = await req.json();
    
    // Update the session with user ID check
    const result = updateSession(sessionId, userId, sessionData);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to update session";
      const isUnauthorized = errorMessage.includes('Unauthorized');
      
      logSecurityEvent(
        userId,
        'PUT',
        'session',
        sessionId,
        false,
        `Failed to update session: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: isUnauthorized ? 403 : 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'PUT',
      'session',
      sessionId,
      true,
      'Successfully updated session'
    );
    
    return NextResponse.json({ success: true, message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// DELETE a specific session
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the delete attempt
    logSecurityEvent(
      userId,
      'DELETE',
      'session',
      sessionId,
      true,
      'Attempting to delete session'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'DELETE',
        'session',
        sessionId,
        false,
        'Unauthorized delete attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Delete the session with user ID check
    const result = deleteSession(sessionId, userId);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to delete session";
      const isUnauthorized = errorMessage.includes('Unauthorized');
      
      logSecurityEvent(
        userId,
        'DELETE',
        'session',
        sessionId,
        false,
        `Failed to delete session: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: isUnauthorized ? 403 : 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'DELETE',
      'session',
      sessionId,
      true,
      'Successfully deleted session'
    );
    
    return NextResponse.json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
