import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest, logSecurityEvent } from "@/lib/auth-utils";
import { createSkill, getUserSkills, DBError } from "@/lib/db";

// GET all skills for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the access attempt
    logSecurityEvent(
      userId,
      'GET',
      'skills',
      null,
      true,
      'Attempting to access user skills'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'GET',
        'skills',
        null,
        false,
        'Unauthorized access attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Get the user's skills
    const result = getUserSkills(userId);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to get skills";
      logSecurityEvent(
        userId,
        'GET',
        'skills',
        null,
        false,
        `Failed to get skills: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'GET',
      'skills',
      null,
      true,
      'Successfully retrieved user skills'
    );
    
    return NextResponse.json({ skills: result.data });
  } catch (error) {
    console.error("Error getting skills:", error);
    logSecurityEvent(
      null,
      'GET',
      'skills',
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

// CREATE a new skill for the authenticated user
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the creation attempt
    logSecurityEvent(
      userId,
      'POST',
      'skill',
      null,
      true,
      'Attempting to create skill'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'POST',
        'skill',
        null,
        false,
        'Unauthorized creation attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const skillData = await req.json();
    
    // Create the skill with the authenticated user's ID
    const result = createSkill(userId, skillData);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to create skill";
      logSecurityEvent(
        userId,
        'POST',
        'skill',
        null,
        false,
        `Failed to create skill: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    // Use optional chaining and nullish coalescing for safety
    const skillId = result.data?.id ?? null;
    
    logSecurityEvent(
      userId,
      'POST',
      'skill',
      skillId,
      true,
      'Successfully created skill'
    );
    
    return NextResponse.json({ skill: result.data }, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    logSecurityEvent(
      null,
      'POST',
      'skill',
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
