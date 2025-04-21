"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type OnboardingStep =
  | "welcome"
  | "personal-info"
  | "skills-to-teach"
  | "skills-to-learn"
  | "availability"
  | "profile-photo"
  | "complete"

type OnboardingContextType = {
  currentStep: OnboardingStep
  setCurrentStep: (step: OnboardingStep) => void
  steps: OnboardingStep[]
  progress: number
  goToNextStep: () => void
  goToPreviousStep: () => void
  onboardingData: Record<string, any>
  updateOnboardingData: (data: Record<string, any>) => void
  isCompleted: boolean
  completeOnboarding: () => Promise<boolean>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const steps: OnboardingStep[] = [
    "welcome",
    "personal-info",
    "skills-to-teach",
    "skills-to-learn",
    "availability",
    "profile-photo",
    "complete",
  ]

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const currentStepIndex = steps.indexOf(currentStep)
  const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100)

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
   }
 
   const updateOnboardingData = (data: Record<string, any>) => {
     setOnboardingData((prev: Record<string, any>) => ({ ...prev, ...data }))
   }
 
  const completeOnboarding = async () => {
    try {
       setIsCompleted(true)
       
       // Create a properly structured object for the database
      const dataToSend = {
        // Profile information
        bio: onboardingData.bio || '',
        location: onboardingData.location || '',
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        
        // Social and preferences
        socialLinks: onboardingData.socialLinks || {},
        learningPreferences: onboardingData.learningPreferences || {},
        
        // Images
        profileImage: onboardingData.profileImage || null,
        coverImage: onboardingData.coverImage || null,
        
        // Map the skills with the correct naming
        teachingSkills: onboardingData.skillsToTeach || [],
        learningSkills: onboardingData.skillsToLearn || [],
        
        // Availability info
        availability: onboardingData.availability || {},
         sessionPreferences: onboardingData.sessionPreferences || {}
       }
 
       const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

       const result = await response.json()
 
       if (!response.ok) {
         // TODO: Add user-facing error handling (e.g., toast notification)
         return false
       }

      // Set the onboarding-completed cookie
      document.cookie = 'onboarding-completed=true; path=/; max-age=31536000' // 1 year

      // Redirect to dashboard
      window.location.href = '/dashboard'

       return true
     } catch (error) {
       // TODO: Add user-facing error handling (e.g., toast notification)
       return false
     }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        steps,
        progress,
        goToNextStep,
        goToPreviousStep,
        onboardingData,
        updateOnboardingData,
        isCompleted,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}
