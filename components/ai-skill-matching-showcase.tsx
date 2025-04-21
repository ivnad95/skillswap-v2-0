"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, User } from "lucide-react"

type SkillMatch = {
  skill: string
  matchScore: number
  reasoning: string
  suggestedTeachers: string[]
}

type MatchResponse = {
  matches: SkillMatch[]
  recommendedActions: string[]
}

// Sample user profile for demo purposes
const sampleUserProfile = {
  name: "Alex Johnson",
  teachingSkills: [
    { name: "JavaScript", proficiency: "Advanced", hourlyRate: 15 },
    { name: "React", proficiency: "Intermediate", hourlyRate: 12 },
  ],
  learningInterests: ["Python", "Data Science", "UI/UX Design"],
  availability: ["Weekday evenings", "Weekend mornings"],
  learningStyle: "Visual and hands-on",
  tokenBalance: 120,
}

// Sample learning goals for demo purposes
const sampleLearningGoals = {
  shortTerm: "Learn Python basics for data analysis",
  mediumTerm: "Build a data visualization portfolio",
  longTerm: "Transition to a data science role",
  timeCommitment: "5-7 hours per week",
  budgetConstraint: "Maximum 50 tokens per week",
}

// Sample matches for demo purposes
const sampleMatches: MatchResponse = {
  matches: [
    {
      skill: "Python for Data Analysis",
      matchScore: 98,
      reasoning:
        "Directly aligns with your short-term goal and fits within your time commitment of 5-7 hours per week.",
      suggestedTeachers: ["Sarah T.", "Michael R.", "Jessica L."],
    },
    {
      skill: "Data Visualization with Python",
      matchScore: 92,
      reasoning: "Perfect for your medium-term goal of building a data visualization portfolio.",
      suggestedTeachers: ["David K.", "Emma P."],
    },
    {
      skill: "UI/UX Design Fundamentals",
      matchScore: 87,
      reasoning: "Matches your learning interests and complements your existing frontend skills.",
      suggestedTeachers: ["Alex M.", "Sophia J."],
    },
  ],
  recommendedActions: [
    "Schedule an intro session with Sarah T. for Python basics",
    "Join the Data Science community forum to connect with peers",
    "Complete the Python assessment to refine your learning path",
    "Reserve tokens for your weekly Python learning sessions",
  ],
}

export function AISkillMatchingShowcase() {
  const [isLoading, setIsLoading] = useState(false)
  const [matches, setMatches] = useState<MatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getSkillMatches = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // For demo purposes, just use the sample data
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setMatches(sampleMatches)

      // Uncomment this for actual API integration
      /*
      const response = await fetch("/api/ai-skill-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: sampleUserProfile,
          learningGoals: sampleLearningGoals,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get skill matches")
      }

      const data = await response.json()
      setMatches(data)
      */
    } catch (error) {
      console.error("Error getting skill matches:", error)
      setError("Failed to generate skill matches. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 shadow-xl">
      <CardHeader className="border-b border-purple-800/20 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 pb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl font-bold text-white">AI Skill Matching</CardTitle>
        </div>
        <CardDescription className="text-gray-300">
          Our AI analyzes your profile, skills, and goals to find your perfect skill matches
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {!matches && !isLoading && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Discover Your Perfect Skill Matches</h3>
              <p className="mt-1 text-sm text-gray-400">
                Our AI will analyze your profile and learning goals to recommend the best skills for you to learn next.
              </p>
            </div>
            <Button
              onClick={getSkillMatches}
              className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Get Personalized Matches"}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-sm text-gray-400">
              Our AI is analyzing your profile and finding the perfect skill matches...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/20 p-4 text-center text-red-400">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={getSkillMatches}
              className="mt-2 border-red-800 text-red-400 hover:bg-red-900/20"
            >
              Try Again
            </Button>
          </div>
        )}

        {matches && (
          <div className="space-y-6">
            <div className="space-y-4">
              {matches.matches.map((match, index) => (
                <Card key={index} className="border border-purple-800/30 bg-purple-900/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">{match.skill}</CardTitle>
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 pt-0">
                    <p className="text-sm text-gray-400">{match.reasoning}</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t border-purple-800/20 pt-3">
                    {match.suggestedTeachers.map((teacher, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1 border-purple-800/30">
                        <User className="h-3 w-3" />
                        {teacher}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div>
              <h4 className="mb-2 font-medium">Recommended Actions</h4>
              <ul className="space-y-2">
                {matches.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 rounded-full bg-purple-800/30 p-1">
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      {matches && (
        <CardFooter className="border-t border-purple-800/20 bg-purple-900/10">
          <Button
            onClick={() => setMatches(null)}
            variant="outline"
            className="w-full border-purple-800/30 hover:bg-purple-800/20"
          >
            Start Over
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
