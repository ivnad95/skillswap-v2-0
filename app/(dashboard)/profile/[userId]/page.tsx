"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming card path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming avatar path
import { Badge } from "@/components/ui/badge"; // Assuming badge path
import { Skeleton } from "@/components/ui/skeleton"; // Assuming skeleton path
// Import other necessary components like SkillShowcase, ReviewsSection, etc. if they exist and are reusable

// Define a type for the user profile data (replace with actual structure)
type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  profileImage: string | null;
  teachingSkills: string[]; // Or a more complex Skill object array
  learningSkills: string[]; // Or a more complex Skill object array
  // Add other relevant fields: reviews, average rating, sessions taught/learned, etc.
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
        // Fetch actual profile data
        // Note: This assumes /api/profile handles fetching other users' profiles by ID.
        // If not, a different endpoint like /api/users/{userId}/profile might be needed.
        const response = await fetch(`/api/profile/${userId}`); // Use the userId from params
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
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profileImage || undefined} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{profile.firstName} {profile.lastName}</CardTitle>
            <CardDescription>{profile.location}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>{profile.bio}</p>
        </CardContent>
      </Card>

      {/* TODO: Integrate SkillShowcase component for teachingSkills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Taught</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.teachingSkills.map(skill => <Badge key={skill}>{skill}</Badge>)}
          {profile.teachingSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills being taught yet.</p>}
        </CardContent>
      </Card>

      {/* TODO: Integrate SkillShowcase component for learningSkills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Learning</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.learningSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
           {profile.learningSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills being learned yet.</p>}
        </CardContent>
      </Card>

      {/* TODO: Integrate ReviewsSection component */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">(Reviews placeholder)</p>
        </CardContent>
      </Card>

      {/* TODO: Add button to request session? */}
    </div>
  );
}
