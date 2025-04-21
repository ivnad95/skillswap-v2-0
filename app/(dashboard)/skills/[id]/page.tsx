"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming card path
import { Badge } from "@/components/ui/badge"; // Assuming badge path
import { Skeleton } from "@/components/ui/skeleton"; // Assuming skeleton path

// Define a type for the skill data (replace with actual structure)
type Skill = {
  id: string;
  name: string;
  description: string;
  category: string;
  // Add other relevant fields: teachers, related skills, etc.
};

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string; // Get skill ID from URL
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId) return;

    const fetchSkill = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/skills/${skillId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch skill details');
        }
        // Assuming the API returns the skill object directly or nested like { skill: ... }
        setSkill(data.skill || data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching skill details.');
        console.error("Error fetching skill:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [skillId]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-20 w-full" />
        {/* Add more skeletons for other details */}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 md:p-6 text-red-600">Error: {error}</div>;
  }

  if (!skill) {
    return <div className="p-4 md:p-6">Skill not found.</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{skill.name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{skill.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{skill.description}</p>
          {/* TODO: Add sections for teachers offering this skill, related skills, etc. */}
          <h3 className="font-semibold mt-4">Teachers Offering This Skill:</h3>
          <p className="text-sm text-muted-foreground">Implementation pending.</p>
          <h3 className="font-semibold mt-4">Related Skills:</h3>
          <p className="text-sm text-muted-foreground">Implementation pending.</p>
        </CardContent>
      </Card>
    </div>
  );
}
