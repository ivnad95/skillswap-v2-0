"use client"
import { motion, AnimatePresence } from "framer-motion"
import { OnboardingProvider, useOnboarding } from "@/contexts/onboarding-context"
import { OnboardingProgress } from "./onboarding-progress"
import { WelcomeStep } from "./steps/welcome-step"
import { PersonalInfoStep } from "./steps/personal-info-step"
import { SkillsToTeachStep } from "./steps/skills-to-teach-step"
import { SkillsToLearnStep } from "./steps/skills-to-learn-step"
import { AvailabilityStep } from "./steps/availability-step"
import { ProfilePhotoStep } from "./steps/profile-photo-step"
import { CompleteStep } from "./steps/complete-step"
import { Logo } from "@/components/ui/logo"

const OnboardingContent = () => {
  const { currentStep, progress } = useOnboarding()

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep />
      case "personal-info":
        return <PersonalInfoStep />
      case "skills-to-teach":
        return <SkillsToTeachStep />
      case "skills-to-learn":
        return <SkillsToLearnStep />
      case "availability":
        return <AvailabilityStep />
      case "profile-photo":
        return <ProfilePhotoStep />
      case "complete":
        return <CompleteStep />
      default:
        return <WelcomeStep />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md p-4 flex items-center justify-between">
        <Logo href="/" />
        <div className="text-sm text-muted-foreground">
          Need help?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact support
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <OnboardingProgress />

          <div className="mt-8 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

export function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
}
