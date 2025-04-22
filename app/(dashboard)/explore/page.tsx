import { ExploreSkillCard } from "@/components/explore-skill-card";
import { ExploreTeacherCard } from "@/components/explore-teacher-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";
import { SkillData } from "@/lib/db"; // Import SkillData type instead of getSkills
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"; // Import next/image

// Define User type to replace Prisma's User
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
}

// Define type for teacher data fetched from API (should match PopulatedTeacherData from lib/db.ts)
interface PopulatedTeacher {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  bio: string | null;
  averageRating: number | null; // Added
  ratingCount: number; // Added
  sessionCount: number; // Added
  skillsTeaching: string[]; // Added
}

// Mock extended SkillData that includes the UI-specific fields
interface ExtendedSkillData extends SkillData {
  name: string;
  category: string;
  teacherName: string;
  teacherAvatar: string;
  rating: number;
  students: number;
  // Removed ExtendedSkillData as API structure might differ
  // Removed mock getSkills and getTeachers functions
}

// Skeleton loader components for loading states
function SkillCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

function TeacherCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export default async function ExplorePage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    // Use await Promise.resolve() to make searchParams properly awaitable
    const params = await Promise.resolve(searchParams || {});
    const searchQuery = typeof params.q === 'string' ? params.q : '';
    const activeTab = typeof params.tab === 'string' ? params.tab : 'skills';

    // --- Data Fetching ---
    let skills: SkillData[] = [];
    let teachers: PopulatedTeacher[] = [];
    let isLoading = true;
    let error: string | null = null;

    // Fetch data on the server side
    // Note: This component runs on the server, so we fetch directly
    // If client-side fetching with useEffect is needed, convert to "use client"
    try {
        // Fetch skills
        const skillsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/skills?search=${encodeURIComponent(searchQuery)}`);
        if (!skillsResponse.ok) {
            const skillsError = await skillsResponse.json();
            throw new Error(skillsError.message || skillsError.error || 'Failed to load skills');
        }
        const skillsData = await skillsResponse.json();
        skills = skillsData.skills || skillsData || []; // Adjust based on actual API response structure

        // Fetch teachers using the new API endpoint
        const teachersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/teachers?search=${encodeURIComponent(searchQuery)}`);
        if (!teachersResponse.ok) {
           const teachersError = await teachersResponse.json();
           // Log error but don't block the page load
           console.error('Failed to load teachers:', teachersError.message || teachersError.error);
           teachers = [];
        } else {
           const teachersData = await teachersResponse.json();
           teachers = teachersData.teachers || []; // Adjust based on actual API response structure
        }


        isLoading = false;
    } catch (err) {
        console.error("Failed to fetch explore data:", err);
        // Ensure err is an Error object before accessing message
        error = err instanceof Error ? err.message : "Failed to load data. Please try again later.";
        error = "Failed to load data. Please try again later.";
        isLoading = false;
    }

    // Simple search form (consider moving to a client component for debouncing etc.)
    const SearchForm = () => (
        <form className="flex w-full max-w-sm items-center space-x-2 mb-6">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search skills or teachers..."
                    name="q"
                    defaultValue={searchQuery}
                    className="pl-10"
                />
            </div>
            <Button type="submit">Search</Button>
        </form>
    );

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-4">Explore</h1>
            <SearchForm />

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue={activeTab} className="mt-6">
                <TabsList className="bg-background/50 backdrop-blur-sm">
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            // Skeleton loading state for skills
                            Array(6).fill(0).map((_, index) => (
                                <SkillCardSkeleton key={`skill-skeleton-${index}`} />
                            ))
                        ) : skills.length > 0 ? (
                            // Render actual skill cards when data is available
                            // Adjust props based on the actual SkillData structure from API/lib/db.ts
                            skills.map((skill) => (
                                <ExploreSkillCard
                                    key={skill.id}
                                    title={skill.title} // Use title from SkillData
                                    category={"Unknown"} // Placeholder - category not in SkillData
                                    teacherName={"Unknown Teacher"} // Placeholder - teacher info not directly in SkillData
                                    teacherAvatar={"/placeholder-user.jpg"} // Placeholder
                                    rating={0} // Placeholder - rating not in SkillData
                                    students={0} // Placeholder - student count not in SkillData
                                    tokens={skill.rate || 0} // Use rate as tokens? Or adjust based on API
                                    tags={skill.tags || []}
                                />
                            ))
                        ) : (
                            // Empty state when no skills match the search
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No skills found matching your search.</p>
                                {searchQuery && (
                                    <Button
                                        variant="link"
                                        className="mt-2"
                                        onClick={() => window.location.href = '/explore'}
                                    >
                                        Clear search
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {!isLoading && skills.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <Button variant="outline">Load More</Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="teachers" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            // Skeleton loading state for teachers
                            Array(6).fill(0).map((_, index) => (
                                <TeacherCardSkeleton key={`teacher-skeleton-${index}`} />
                            ))
                        ) : teachers.length > 0 ? (
                            // Render actual teacher cards when data is available
                            // Adjust props based on PopulatedTeacherData structure from lib/db.ts
                            teachers.map((teacher) => (
                                <ExploreTeacherCard
                                    key={teacher.id}
                                    name={`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()}
                                    avatar={teacher.profileImage || "/placeholder-user.jpg"}
                                    title={teacher.bio?.substring(0, 50) + (teacher.bio && teacher.bio.length > 50 ? '...' : '') || "Teacher"} // Use bio snippet as title
                                    rating={teacher.averageRating || 0} // Use fetched rating
                                    students={teacher.sessionCount || 0} // Use session count as student count proxy
                                    skills={teacher.skillsTeaching || []} // Use fetched skills
                                />
                            ))
                        ) : (
                            // Empty state when no teachers match the search
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No teachers found matching your search.</p>
                                {searchQuery && (
                                    <Button
                                        variant="link"
                                        className="mt-2"
                                        onClick={() => window.location.href = '/explore'}
                                    >
                                        Clear search
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {!isLoading && teachers.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <Button variant="outline">Load More</Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                    <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                        <CardHeader>
                            <CardTitle>Upcoming Public Sessions</CardTitle>
                            <CardDescription>Join group sessions and workshops hosted by our teachers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No upcoming public sessions available right now.</p>
                                    <p className="mt-2 text-sm">Check back later for new workshops and group learning opportunities.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8">
                <h2 className="text-2xl font-bold">Component Diagram</h2>
                {/* Replaced img with next/image. Adjust width/height as needed. */}
                <Image 
                  src="/docs/component-diagram.png" 
                  alt="Component Diagram" 
                  className="mt-4" 
                  width={800} // Placeholder width
                  height={600} // Placeholder height
                />
            </div>
        </div>
    );
}
