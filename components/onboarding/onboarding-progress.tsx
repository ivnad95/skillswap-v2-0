"use client"

import { useOnboarding, type OnboardingStep } from "@/contexts/onboarding-context"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function OnboardingProgress() {
  const { steps, currentStep, progress, setCurrentStep } = useOnboarding()

  const stepLabels: Record<OnboardingStep, string> = {
    welcome: "Welcome",
    "personal-info": "Personal Info",
    "skills-to-teach": "Teaching Skills",
    "skills-to-learn": "Learning Skills",
    availability: "Availability",
    "profile-photo": "Profile Photo",
    complete: "Complete",
  }

  const currentStepIndex = steps.indexOf(currentStep)

  return (
    <div className="w-full">
      <div className="hidden md:flex justify-between mb-2">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex
          const isComplete = index < currentStepIndex

          return (
            <button
              key={step}
              onClick={() => index <= currentStepIndex && setCurrentStep(step)}
              className={`text-xs font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              } ${index <= currentStepIndex ? "cursor-pointer" : "cursor-not-allowed"}`}
              disabled={index > currentStepIndex}
            >
              {stepLabels[step]}
            </button>
          )
        })}
      </div>

      <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-button"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="hidden md:flex justify-between mt-2">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex
          const isComplete = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={`indicator-${step}`} className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isActive ? "bg-gradient-button text-white" : "bg-muted/30 text-muted-foreground"
                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
              >
                {isComplete ? <Check className="w-3 h-3" /> : <span className="text-xs">{index + 1}</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="md:hidden mt-4 text-center">
        <p className="text-sm font-medium">
          Step {currentStepIndex + 1} of {steps.length}: {stepLabels[currentStep]}
        </p>
      </div>
    </div>
  )
}
