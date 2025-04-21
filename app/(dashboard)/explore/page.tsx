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

// Define User type to replace Prisma's User
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
}

// Define more specific types if needed
interface PopulatedTeacher {
  id: string;
  name: string;
  avatar?: string | null;
  title?: string;
  rating?: number;
  students?: number;
  skillsTeaching: { skill: { name: string } }[];
}

// Mock extended SkillData that includes the UI-specific fields
interface ExtendedSkillData extends SkillData {
  name: string;
  category: string;
  teacherName: string;
  teacherAvatar: string;
  rating: number;
  students: number;
  tokens: number;
}

// Mock functions to replace the missing getSkills and getTeachers
async function getSkills({ search }: { search: string }) {
  // This is a placeholder - in a real implementation, you would fetch from your API
  const mockSkills: ExtendedSkillData[] = [
    {
      id: "1",
      userId: "user1",
      title: "JavaScript Programming",
      name: "JavaScript Programming",
      type: "teaching",
      level: "Intermediate",
      rate: 50,
      description: "Learn JavaScript from the basics to advanced concepts",
      tags: ["programming", "web", "frontend"],
      category: "Programming",
      teacherName: "John Doe",
      teacherAvatar: "/placeholder-user.jpg",
      rating: 4.8,
      students: 24,
      tokens: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      userId: "user2",
      title: "UI/UX Design",
      name: "UI/UX Design",
      type: "teaching",
      level: "Beginner",
      rate: 40,
      description: "Learn the principles of good UI/UX design",
      tags: ["design", "ui", "ux"],
      category: "Design",
      teacherName: "Jane Smith",
      teacherAvatar: "/placeholder-user.jpg",
      rating: 4.6,
      students: 18,
      tokens: 40,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Filter by search term if provided
  if (search) {
    const searchLower = search.toLowerCase();
    return mockSkills.filter(skill =>
      skill.title.toLowerCase().includes(searchLower) ||
      (skill.description && skill.description.toLowerCase().includes(searchLower))
    );
  }

  return mockSkills;
}

async function getTeachers({ search }: { search: string }) {
  // This is a placeholder - in a real implementation, you would fetch from your API
  return [] as PopulatedTeacher[];
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

    try {
        // Example: Fetch skills and teachers based on search query
        // You'll need to implement filtering/searching logic in getSkills/getTeachers
        [skills, teachers] = await Promise.all([
            getSkills({ search: searchQuery }), // Implement getSkills in lib/db.ts
            getTeachers({ search: searchQuery }), // Implement getTeachers in lib/db.ts
        ]);
        isLoading = false;
    } catch (err) {
        console.error("Failed to fetch explore data:", err);
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
                            skills.map((skill) => {
                                // Cast to ExtendedSkillData to access UI-specific fields
                                const extendedSkill = skill as ExtendedSkillData;
                                return (
                                    <ExploreSkillCard
                                        key={extendedSkill.id}
                                        title={extendedSkill.name}
                                        category={extendedSkill.category}
                                        teacherName={extendedSkill.teacherName}
                                        teacherAvatar={extendedSkill.teacherAvatar}
                                        rating={extendedSkill.rating}
                                        students={extendedSkill.students}
                                        tokens={extendedSkill.tokens}
                                        tags={extendedSkill.tags}
                                    />
                                );
                            })
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
                            teachers.map((teacher) => (
                                <ExploreTeacherCard
                                    key={teacher.id}
                                    name={teacher.name || ""}
                                    avatar={teacher.avatar || "/placeholder-user.jpg"}
                                    title={teacher.title || ""}
                                    rating={teacher.rating || 0}
                                    students={teacher.students || 0}
                                    skills={teacher.skillsTeaching.map((st) => st.skill.name)}
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
        </div>
    );
}
