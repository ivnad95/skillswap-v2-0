"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CompleteStep() {
  const { onboardingData, completeOnboarding } = useOnboarding()

  // Complete the onboarding process when this step is reached
  useEffect(() => {
    completeOnboarding()
  }, [completeOnboarding])

  return (
    <Card className="w-full bg-background/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-button" />

      <CardHeader className="text-center pb-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="mx-auto mb-6"
        >
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-glow">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <CardTitle className="text-3xl sm:text-4xl font-display">You're All Set!</CardTitle>
        <CardDescription className="text-lg max-w-md mx-auto mt-2">
          Your SkillSwap profile has been created successfully.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Find Matches",
              description: "Discover people who want to learn your skills or teach you new ones.",
              icon: "🔍",
            },
            {
              title: "Schedule Sessions",
              description: "Book your first teaching or learning session.",
              icon: "📅",
            },
            {
              title: "Earn Tokens",
              description: "Start earning SkillTokens by teaching others.",
              icon: "💰",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-white/10 dark:bg-card/20 backdrop-blur-sm border border-white/10"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-medium text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 text-center"
        >
          <p className="text-lg font-medium mb-2">Welcome to the SkillSwap community!</p>
          <p className="text-muted-foreground">
            We've matched you with 5 potential skill partners based on your profile.
          </p>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/40 p-6 bg-muted/20">
        <Link href="/dashboard">
          <Button variant="gradient" size="lg" className="group">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
