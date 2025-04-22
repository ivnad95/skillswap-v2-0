import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSkillById, getTeachersForSkill, getRelatedSkills } from '@/lib/db';
// Import getUserIdFromRequest if auth is needed for viewing skill details
// import { getUserIdFromRequest } from '@/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const skillId = params.id;

  if (!skillId) {
    return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
  }

  // Fetch skill details, teachers, and related skills in parallel
  try {
    const [skillResult, teachersResult, relatedSkillsResult] = await Promise.all([
      getSkillById(skillId),
      getTeachersForSkill(skillId), // Fetches basic teacher info
      getRelatedSkills(skillId, 5) // Fetch 5 related skills
    ]);

    // Check for errors in fetching the main skill
    if (skillResult.error) {
      const status = skillResult.error.message === 'Skill not found' ? 404 : 500;
      return NextResponse.json({ error: skillResult.error.message }, { status });
    }

    // Handle potential errors for teachers and related skills gracefully
    if (teachersResult.error) {
      console.error(`Error fetching teachers for skill ${skillId}:`, teachersResult.error);
      // Optionally return partial data or a specific error structure
    }
     if (relatedSkillsResult.error) {
      console.error(`Error fetching related skills for skill ${skillId}:`, relatedSkillsResult.error);
    }

    // Combine results
    const responseData = {
      skill: skillResult.data,
      teachers: teachersResult.data || [], // Default to empty array on error
      relatedSkills: relatedSkillsResult.data || [] // Default to empty array on error
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error(`Error fetching details for skill ${skillId}:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// TODO: Add PUT/DELETE handlers if needed for updating/deleting skills
