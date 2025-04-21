import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest, logSecurityEvent } from "@/lib/auth-utils";
import { updateSkill, deleteSkill, verifyResourceOwnership, DBError } from "@/lib/db";

// GET a specific skill
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skillId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the access attempt
    logSecurityEvent(
      userId,
      'GET',
      'skill',
      skillId,
      true,
      'Attempting to access skill'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'GET',
        'skill',
        skillId,
        false,
        'Unauthorized access attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Check if the user has access to this skill
    const hasAccess = verifyResourceOwnership('skill', skillId, userId);
    
    if (!hasAccess) {
      logSecurityEvent(
        userId,
        'GET',
        'skill',
        skillId,
        false,
        'Unauthorized access attempt - user does not own resource'
      );
      
      return NextResponse.json(
        { error: { message: "You do not have permission to access this skill" } },
        { status: 403 }
      );
    }
    
    // In a real implementation, we would fetch the skill data here
    // For now, we'll just return a success message
    logSecurityEvent(
      userId,
      'GET',
      'skill',
      skillId,
      true,
      'Successfully accessed skill'
    );
    
    return NextResponse.json({ success: true, message: "Skill accessed successfully" });
  } catch (error) {
    console.error("Error accessing skill:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// UPDATE a specific skill
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skillId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the update attempt
    logSecurityEvent(
      userId,
      'PUT',
      'skill',
      skillId,
      true,
      'Attempting to update skill'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'PUT',
        'skill',
        skillId,
        false,
        'Unauthorized update attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const skillData = await req.json();
    
    // Update the skill with user ID check
    const result = updateSkill(skillId, userId, skillData);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to update skill";
      const isUnauthorized = errorMessage.includes('Unauthorized');
      
      logSecurityEvent(
        userId,
        'PUT',
        'skill',
        skillId,
        false,
        `Failed to update skill: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: isUnauthorized ? 403 : 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'PUT',
      'skill',
      skillId,
      true,
      'Successfully updated skill'
    );
    
    return NextResponse.json({ success: true, message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// DELETE a specific skill
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skillId = params.id;
    const userId = getUserIdFromRequest(req);
    
    // Log the delete attempt
    logSecurityEvent(
      userId,
      'DELETE',
      'skill',
      skillId,
      true,
      'Attempting to delete skill'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'DELETE',
        'skill',
        skillId,
        false,
        'Unauthorized delete attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Delete the skill with user ID check
    const result = deleteSkill(skillId, userId);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to delete skill";
      const isUnauthorized = errorMessage.includes('Unauthorized');
      
      logSecurityEvent(
        userId,
        'DELETE',
        'skill',
        skillId,
        false,
        `Failed to delete skill: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: isUnauthorized ? 403 : 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'DELETE',
      'skill',
      skillId,
      true,
      'Successfully deleted skill'
    );
    
    return NextResponse.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
