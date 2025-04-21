import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest, logSecurityEvent } from "@/lib/auth-utils";
import { getUserProfile, updateUserProfile, getUserSkills, DBError } from "@/lib/db";

// GET the authenticated user's profile
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the access attempt
    logSecurityEvent(
      userId,
      'GET',
      'profile',
      userId,
      true,
      'Attempting to access user profile'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'GET',
        'profile',
        null,
        false,
        'Unauthorized access attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    // Get the user's profile
    const profileResult = getUserProfile(userId);
    
    if (profileResult.error) {
      const errorMessage = (profileResult.error as DBError).message || "Failed to get profile";
      logSecurityEvent(
        userId,
        'GET',
        'profile',
        userId,
        false,
        `Failed to get profile: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    // Get the user's skills as well
    const skillsResult = getUserSkills(userId);
    
    logSecurityEvent(
      userId,
      'GET',
      'profile',
      userId,
      true,
      'Successfully retrieved user profile'
    );
    
    // Return both profile and skills
    return NextResponse.json({ 
      profile: {
        ...profileResult.data,
        skills: skillsResult.error ? [] : skillsResult.data
      }
    });
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// UPDATE the authenticated user's profile
export async function PUT(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    
    // Log the update attempt
    logSecurityEvent(
      userId,
      'PUT',
      'profile',
      userId,
      true,
      'Attempting to update user profile'
    );
    
    // If not authenticated, return 401
    if (!userId) {
      logSecurityEvent(
        null,
        'PUT',
        'profile',
        null,
        false,
        'Unauthorized update attempt - no valid authentication'
      );
      
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    
    const profileData = await req.json();
    console.log('Received profile update with data keys:', Object.keys(profileData));
    
    // Update the user's profile
    const result = updateUserProfile(userId, profileData);
    
    if (result.error) {
      const errorMessage = (result.error as DBError).message || "Failed to update profile";
      logSecurityEvent(
        userId,
        'PUT',
        'profile',
        userId,
        false,
        `Failed to update profile: ${errorMessage}`
      );
      
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: 400 }
      );
    }
    
    logSecurityEvent(
      userId,
      'PUT',
      'profile',
      userId,
      true,
      'Successfully updated user profile'
    );
    
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
