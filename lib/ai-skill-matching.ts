import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface Skill {
  id: string
  title: string
  type: "teaching" | "learning"
  level: string
  rate: number
  description: string
  tags: string[]
}

interface User {
  id: string
  name: string
  skills: Skill[]
  availability: string[]
  rating: number
}

interface MatchResult {
  userId: string
  userName: string
  skillId: string
  skillTitle: string
  matchScore: number
  matchReason: string
}

export async function findSkillMatches(userSkill: Skill, potentialMatches: User[], count = 5): Promise<MatchResult[]> {
  try {
    // Convert the data to a format that can be used in the prompt
    const userSkillData = JSON.stringify(userSkill)
    const potentialMatchesData = JSON.stringify(
      potentialMatches.map((user) => ({
        id: user.id,
        name: user.name,
        skills: user.skills,
        availability: user.availability,
        rating: user.rating,
      })),
    )

    // Create the prompt for the AI
    const prompt = `
      You are an AI matching algorithm for SkillSwap, a peer-to-peer skill exchange platform.
      Your task is to find the best matches for a user's skill based on the following criteria:
      - Skills compatibility (40% weight): How well the skills match in terms of subject and level
      - Availability compatibility (30% weight): How well the users' schedules align
      - Cost compatibility (20% weight): How well the token rates align
      - Ratings (10% weight): Higher rated users are preferred

      User skill: ${userSkillData}
      
      Potential matches: ${potentialMatchesData}
      
      Return the top ${count} matches as a valid JSON array with the following structure:
      [
        {
          "userId": "user-id",
          "userName": "User Name",
          "skillId": "skill-id",
          "skillTitle": "Skill Title",
          "matchScore": 85, // A number between 0-100
          "matchReason": "Brief explanation of why this is a good match"
        }
      ]
      
      Only return the JSON array, nothing else.
    `

    // Generate the matches using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      maxTokens: 1000,
    })

    // Parse the response
    const matches = JSON.parse(text) as MatchResult[]
    return matches
  } catch (error) {
    console.error("Error finding skill matches:", error)
    return []
  }
}
