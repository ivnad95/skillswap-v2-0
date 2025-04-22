"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming card path
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { PopulatedTeacherData, SkillData } from "@/lib/db"; // Import types from lib/db

// Use imported types, adjust if API response differs slightly
type Skill = SkillData & { name?: string }; // Add name if API uses it
type Teacher = PopulatedTeacherData; // Use the detailed type
type RelatedSkill = Pick<SkillData, 'id' | 'title'>; // Only need id and title for links


export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;
  const [skill, setSkill] = useState<Skill | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]); // Use PopulatedTeacherData based type
  const [relatedSkills, setRelatedSkills] = useState<RelatedSkill[]>([]); // Use Pick<SkillData...>
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillId) return;

    const fetchSkill = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/skills/${skillId}`); // Fetch combined data
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch skill details');
        }

        // Set state with fetched data, ensuring types match
        setSkill(data.skill); // Assumes API returns skill data matching SkillData
        setTeachers(data.teachers || []); // Assumes API returns teacher data matching PopulatedTeacherData
        setRelatedSkills(data.relatedSkills || []); // Assumes API returns related skills matching SkillData

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
          {/* Use skill.title as per SkillData */}
          <CardTitle className="text-2xl">{skill.title}</CardTitle>
          <CardDescription>
             {/* Display first tag as category, or default */}
            <Badge variant="secondary">{skill.tags?.[0] || 'Uncategorized'}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{skill.description || "No description available."}</p>

          {/* Teachers Section */}
          <h3 className="font-semibold mt-4">Teachers Offering This Skill:</h3>
          {teachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <Link key={teacher.id} href={`/profile/${teacher.id}`} className="block hover:bg-muted/50 p-3 rounded-md border border-transparent hover:border-primary/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.profileImage || '/placeholder-user.jpg'} alt={`${teacher.firstName || ''} ${teacher.lastName || ''}`} />
                      <AvatarFallback>{teacher.firstName?.[0]}{teacher.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()}</p>
                      {/* Optionally display teacher bio snippet */}
                       {teacher.bio && <p className="text-xs text-muted-foreground truncate">{teacher.bio}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No teachers currently offering this specific skill.</p>
          )}

          {/* Related Skills Section */}
          <h3 className="font-semibold mt-4">Related Skills:</h3>
           {relatedSkills.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {relatedSkills.map((related) => (
                 <Link key={related.id} href={`/skills/${related.id}`}>
                   <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                     {related.title}
                   </Badge>
                 </Link>
               ))}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground">No related skills found.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
