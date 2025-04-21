import type React from "react"
import "@/app/onboarding/onboarding.css"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-br from-background to-background/90">{children}</div>
}
