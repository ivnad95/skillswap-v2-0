import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Define the system prompt for the AI skill matching
const SYSTEM_PROMPT = `
You are the SkillSwap AI Matching System.
Your task is to analyze user skills, interests, and learning goals to suggest optimal skill matches.

Given information about a user's:
1. Skills they can teach (with proficiency levels)
2. Skills they want to learn
3. Availability
4. Learning style preferences
5. Previous session history and ratings

You should provide:
1. A ranked list of recommended skill matches
2. Brief explanation of why each match is suitable
3. Suggested next steps for the user

Format your response as JSON with the following structure:
{
  "matches": [
    {
      "skill": "Skill name",
      "matchScore": 95,
      "reasoning": "Brief explanation",
      "suggestedTeachers": ["Teacher1", "Teacher2"]
    }
  ],
  "recommendedActions": ["Action1", "Action2"]
}

Base your recommendations on:
- Skill relevance (40%)
- Availability compatibility (30%)
- Cost alignment with user's token balance (20%)
- Rating and reviews (10%)
`

export async function POST(req: NextRequest) {
  try {
    const { userProfile, learningGoals } = await req.json()

    if (!userProfile || !learningGoals) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Prepare the prompt with user data
    const prompt = `
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}
    
    Learning Goals:
    ${JSON.stringify(learningGoals, null, 2)}
    
    Please provide skill matches and recommendations based on this information.
    `

    // Generate matches using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    })

    // Parse the response as JSON
    let matches
    try {
      matches = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e)
      return NextResponse.json({ error: "Failed to generate valid matches" }, { status: 500 })
    }

    return NextResponse.json(matches)
  } catch (error) {
    console.error("AI Skill Matching error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
