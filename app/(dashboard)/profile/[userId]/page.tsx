"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming card path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming avatar path
import { Badge } from "@/components/ui/badge"; // Assuming badge path
import { Skeleton } from "@/components/ui/skeleton";
import { SkillShowcase } from "@/components/skill-showcase"; // Import SkillShowcase
import { ReviewsSection } from "@/components/reviews-section"; // Import ReviewsSection

// Define a type for the user profile data (align with API response)
type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  profileImage: string | null;
  coverImage: string | null; // Added from API response
  createdAt: string; // Added from API response
  skills: any[]; // Use specific Skill type if defined elsewhere
  reviews: any[]; // Use specific Review type if defined elsewhere
  // Add firstName, lastName if API is updated to include them
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string; // Get user ID from URL
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch actual profile data from the specific user endpoint
        const response = await fetch(`/api/profile/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch profile');
        }
        // Assuming API returns { profile: ... } or the profile object directly
        // Also assuming the API response matches the UserProfile type structure
        setProfile(data.profile || data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching profile details.');
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        {/* Add more skeletons */}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 md:p-6 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-4 md:p-6">User profile not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* TODO: Use ProfileHeader component if suitable */}
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-16 w-16">
             {/* Use profileImage */}
            <AvatarImage src={profile.profileImage || '/placeholder-user.jpg'} alt={`${profile.firstName || ''} ${profile.lastName || ''}`} />
            <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
             {/* Display name - requires joining users table in API */}
            <CardTitle className="text-2xl">{profile.firstName || 'User'} {profile.lastName || ''}</CardTitle>
            <CardDescription>{profile.location || 'Location unknown'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>{profile.bio}</p>
        </CardContent>
      </Card>

      {/* Integrate SkillShowcase */}
      <SkillShowcase profileData={profile} />

      {/* Integrate ReviewsSection */}
      <ReviewsSection profileData={profile} />
      {/* TODO: Add button to request session? */}
    </div>
  );
}
