"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Target, ArrowRight } from "lucide-react"

type RecommendedSkill = {
  skill: string
  relevanceScore: number
  reasoning: string
  estimatedTimeToLearn: string
  potentialApplications: string[]
  complementarySkills: string[]
}

type LearningPath = {
  shortTerm: string[]
  mediumTerm: string[]
  longTerm: string[]
}

type RecommendationsResponse = {
  recommendedSkills: RecommendedSkill[]
  learningPath: LearningPath
}

// Sample user profile for demo purposes
const sampleUserProfile = {
  name: "Alex Johnson",
  currentSkills: [
    { name: "JavaScript", level: "Advanced" },
    { name: "React", level: "Intermediate" },
    { name: "HTML/CSS", level: "Advanced" },
  ],
  learningPreferences: "Visual and project-based learning",
  availableTime: "7-10 hours per week",
}

// Sample learning history for demo purposes
const sampleLearningHistory = {
  completedCourses: [
    { name: "JavaScript Fundamentals", completionDate: "2023-01-15" },
    { name: "React Basics", completionDate: "2023-03-20" },
    { name: "Responsive Web Design", completionDate: "2023-05-10" },
  ],
  inProgressCourses: [{ name: "Advanced React Patterns", progress: 60 }],
}

// Sample goals for demo purposes
const sampleGoals = {
  career: "Frontend Developer transitioning to Full Stack",
  personal: "Build a complete web application with backend integration",
  timeframe: "6 months",
}

// Sample recommendations for demo purposes (to avoid API calls during development)
const sampleRecommendations: RecommendationsResponse = {
  recommendedSkills: [
    {
      skill: "Node.js",
      relevanceScore: 95,
      reasoning: "Essential for full-stack development with your existing JavaScript expertise",
      estimatedTimeToLearn: "4-6 weeks",
      potentialApplications: ["API Development", "Server-side Rendering", "Microservices"],
      complementarySkills: ["Express.js", "MongoDB", "REST API Design"],
    },
    {
      skill: "TypeScript",
      relevanceScore: 90,
      reasoning: "Enhances your JavaScript skills with type safety for larger applications",
      estimatedTimeToLearn: "2-3 weeks",
      potentialApplications: ["Enterprise Applications", "Large React Projects", "API Development"],
      complementarySkills: ["Advanced React Patterns", "Next.js", "GraphQL"],
    },
    {
      skill: "SQL Databases",
      relevanceScore: 85,
      reasoning: "Fundamental for data persistence in full-stack applications",
      estimatedTimeToLearn: "3-4 weeks",
      potentialApplications: ["Data Modeling", "Backend Development", "Application Architecture"],
      complementarySkills: ["PostgreSQL", "Database Design", "ORM Tools"],
    },
  ],
  learningPath: {
    shortTerm: [
      "Complete Node.js fundamentals course",
      "Build a simple REST API with Express",
      "Learn basic TypeScript syntax and integration with React",
    ],
    mediumTerm: [
      "Create a full-stack application with React, Node.js and a database",
      "Implement authentication and authorization",
      "Learn about deployment and DevOps basics",
    ],
    longTerm: [
      "Master advanced backend concepts like microservices",
      "Learn cloud deployment with AWS or Azure",
      "Explore specialized areas like real-time applications or AI integration",
    ],
  },
}

export function LearningRecommendations() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"recommendations" | "path">("recommendations")

  // Use sample data instead of API call for now
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRecommendations(sampleRecommendations)
      } catch (error) {
        setError("Failed to load recommendations")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // For demo purposes, just use the sample data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRecommendations(sampleRecommendations)

      // Uncomment this for actual API integration
      /*
      const response = await fetch("/api/ai-learning-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: sampleUserProfile,
          learningHistory: sampleLearningHistory,
          goals: sampleGoals,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendations")
      }

      const data = await response.json()
      setRecommendations(data)
      */
    } catch (error) {
      console.error("Error getting recommendations:", error)
      setError("Failed to generate recommendations. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 shadow-xl">
      <CardHeader className="border-b border-purple-800/20 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-xl font-bold text-white">AI Learning Recommendations</CardTitle>
        </div>
        <CardDescription className="text-gray-300">
          Personalized skill recommendations based on your profile and goals
        </CardDescription>

        <div className="mt-4 flex gap-2">
          <Button
            variant={activeTab === "recommendations" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("recommendations")}
            className={
              activeTab === "recommendations"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                : "border-purple-800/30 hover:bg-purple-800/20"
            }
          >
            Recommended Skills
          </Button>
          <Button
            variant={activeTab === "path" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("path")}
            className={
              activeTab === "path"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                : "border-purple-800/30 hover:bg-purple-800/20"
            }
          >
            Learning Path
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-sm text-gray-400">Generating personalized learning recommendations...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-900/20 p-4 text-center text-red-400">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={getRecommendations}
              className="mt-2 border-red-800 text-red-400 hover:bg-red-900/20"
            >
              Try Again
            </Button>
          </div>
        )}

        {recommendations && activeTab === "recommendations" && (
          <div className="space-y-6">
            {recommendations.recommendedSkills.map((skill, index) => (
              <Card key={index} className="border border-purple-800/30 bg-purple-900/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{skill.skill}</CardTitle>
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">
                      {skill.relevanceScore}% Relevant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-2 pt-0">
                  <p className="text-sm text-gray-400">{skill.reasoning}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="h-4 w-4 text-purple-400" />
                      {skill.estimatedTimeToLearn}
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-1 text-xs font-medium uppercase text-gray-400">Applications</h5>
                    <div className="flex flex-wrap gap-1">
                      {skill.potentialApplications.map((app, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-900/30">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-1 text-xs font-medium uppercase text-gray-400">Complementary Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {skill.complementarySkills.map((complementary, idx) => (
                        <Badge key={idx} variant="outline" className="border-purple-800/30">
                          {complementary}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {recommendations && activeTab === "path" && (
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-medium">
                <Target className="h-4 w-4 text-green-400" />
                Short-term Goals (1-3 months)
              </h4>
              <ul className="space-y-2">
                {recommendations.learningPath.shortTerm.map((goal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-md border border-purple-800/30 bg-purple-900/10 p-3"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-medium">
                <Target className="h-4 w-4 text-blue-400" />
                Medium-term Goals (3-6 months)
              </h4>
              <ul className="space-y-2">
                {recommendations.learningPath.mediumTerm.map((goal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-md border border-purple-800/30 bg-purple-900/10 p-3"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-medium">
                <Target className="h-4 w-4 text-indigo-400" />
                Long-term Goals (6+ months)
              </h4>
              <ul className="space-y-2">
                {recommendations.learningPath.longTerm.map((goal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-md border border-purple-800/30 bg-purple-900/10 p-3"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
