import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Define the system prompt for the AI learning recommendations
const SYSTEM_PROMPT = `
You are the SkillSwap Learning Advisor.
Your task is to analyze a user's learning history, current skills, and goals to provide personalized learning recommendations.

Given information about:
1. User's current skill levels
2. Learning history and progress
3. Career or personal goals
4. Time availability
5. Learning style preferences

You should provide:
1. Recommended skills to learn next
2. Suggested learning path with milestones
3. Estimated time investment
4. Potential applications of these skills
5. Complementary skills that pair well

Format your response as JSON with the following structure:
{
  "recommendedSkills": [
    {
      "skill": "Skill name",
      "relevanceScore": 95,
      "reasoning": "Brief explanation",
      "estimatedTimeToLearn": "X hours/weeks",
      "potentialApplications": ["Application1", "Application2"],
      "complementarySkills": ["Skill1", "Skill2"]
    }
  ],
  "learningPath": {
    "shortTerm": ["Goal1", "Goal2"],
    "mediumTerm": ["Goal3", "Goal4"],
    "longTerm": ["Goal5", "Goal6"]
  }
}

Ensure recommendations are:
- Relevant to user's goals
- Realistic given their current skill level
- Diverse in application
- Structured in a logical progression
`

export async function POST(req: NextRequest) {
  try {
    const { userProfile, learningHistory, goals } = await req.json()

    if (!userProfile || !learningHistory || !goals) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Prepare the prompt with user data
    const prompt = `
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}
    
    Learning History:
    ${JSON.stringify(learningHistory, null, 2)}
    
    Goals:
    ${JSON.stringify(goals, null, 2)}
    
    Please provide personalized learning recommendations based on this information.
    `

    // Generate recommendations using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: SYSTEM_PROMPT,
      prompt: prompt,
    })

    // Parse the response as JSON
    let recommendations
    try {
      recommendations = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e)
      return NextResponse.json({ error: "Failed to generate valid recommendations" }, { status: 500 })
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("AI Learning Recommendations error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
