import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, getUserSkills, getUserReviews, DBError } from "@/lib/db";
// No auth needed for public profiles, but could add checks later if needed

// GET a specific user's public profile by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Fetch profile, skills, and reviews in parallel
    const [profileResult, skillsResult, reviewsResult] = await Promise.all([
      getUserProfile(userId),
      getUserSkills(userId),
      getUserReviews(userId)
    ]);

    // If profile doesn't exist, return 404
    if (profileResult.error && profileResult.error.message === 'Profile not found') {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    // Handle other potential errors fetching profile
    if (profileResult.error) {
       return NextResponse.json({ error: profileResult.error.message || 'Failed to get profile' }, { status: 500 });
    }

    // Log errors for skills/reviews but don't fail the request
    if (skillsResult.error) {
       console.error(`Failed to get skills for user ${userId}:`, skillsResult.error.message);
    }
     if (reviewsResult.error) {
       console.error(`Failed to get reviews for user ${userId}:`, reviewsResult.error.message);
    }

    // Return profile, skills, and reviews
    // Note: Ensure sensitive data is not exposed here if needed
    return NextResponse.json({
      profile: {
        // Only return necessary public fields
        id: profileResult.data.id,
        userId: profileResult.data.userId,
        bio: profileResult.data.bio,
        location: profileResult.data.location,
        profileImage: profileResult.data.profileImage,
        coverImage: profileResult.data.coverImage,
        createdAt: profileResult.data.createdAt, // Example: maybe show join date
        // Add other public fields like first/last name if needed (requires joining users table)
        skills: skillsResult.data || [], // Default to empty array on error
        reviews: reviewsResult.data || [] // Default to empty array on error
      }
    });

  } catch (error) {
    console.error(`Error getting profile for user ${userId}:`, error);
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
