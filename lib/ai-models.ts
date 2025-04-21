// AI models integration for SkillSwap
// This file defines interfaces and utilities for working with AI models

// Types for AI model responses
export interface AISkillMatchResponse {
  matches: {
    id: string;
    name: string;
    profileImage: string;
    matchPercentage: number;
    skills: {
      name: string;
      level: string;
    }[];
    availability: string[];
    rating: number;
    tokens: number;
  }[];
  recommendedActions: string[];
}

export interface AILearningRecommendationResponse {
  personalizedSkills: {
    name: string;
    reason: string;
    difficulty: string;
    estimatedTime: string;
    complementarySkills: string[];
  }[];
  learningPath: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
}

export interface AIAssistantResponse {
  content: string;
}

// Class for connecting to AI models and managing responses
export class AIModels {
  private apiBaseUrl: string;
  
  constructor(apiBaseUrl: string = '/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Get skill matches based on user profile and preferences
  async getSkillMatches(userProfile: any, learningGoals: any): Promise<AISkillMatchResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai-skill-matching`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          learningGoals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get skill matches');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI skill matches:', error);
      throw error;
    }
  }

  // Get learning recommendations based on user history and goals
  async getLearningRecommendations(
    userProfile: any, 
    learningHistory: any, 
    goals: any
  ): Promise<AILearningRecommendationResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai-learning-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          learningHistory,
          goals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get learning recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI learning recommendations:', error);
      throw error;
    }
  }

  // Get AI assistant response based on conversation history
  async getAssistantResponse(messages: { role: string; content: string }[]): Promise<AIAssistantResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get assistant response');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting AI assistant response:', error);
      throw error;
    }
  }

  // Get personalized welcome message for dashboard
  async getPersonalizedWelcome(userData: any): Promise<string> {
    try {
      // In a real implementation, this would call an AI endpoint
      // For demo purposes, we'll return a template-based message
      const firstName = userData?.user?.firstName || 'there';
      const timeOfDay = this.getTimeOfDay();
      
      return `Good ${timeOfDay}, ${firstName}! Looking forward to helping you exchange skills today.`;
    } catch (error) {
      console.error('Error generating personalized welcome:', error);
      return 'Welcome back to SkillSwap!';
    }
  }

  // Helper function to get time of day
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
}

// Create and export a singleton instance for use across the application
export const aiModels = new AIModels();