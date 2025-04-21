"use client"

import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function WelcomeStep() {
  const { goToNextStep } = useOnboarding()

  return (
    <Card className="w-full bg-background/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-button" />

      <CardHeader className="space-y-1 text-center pb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-4"
        >
          <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-glow">
            <div className="text-3xl font-bold text-white">S</div>
          </div>
        </motion.div>

        <CardTitle className="text-3xl sm:text-4xl font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Welcome to SkillSwap
        </CardTitle>
        <CardDescription className="text-lg max-w-md mx-auto">
          Let's set up your profile so you can start teaching and learning new skills.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Create Your Profile",
              description: "Tell us about yourself and the skills you want to share.",
              icon: "👤",
            },
            {
              title: "Match with Others",
              description: "Our AI will match you with compatible skill partners.",
              icon: "🔄",
            },
            {
              title: "Start Learning",
              description: "Schedule sessions and begin your learning journey.",
              icon: "🚀",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-white/10 dark:bg-card/20 backdrop-blur-sm border border-white/10"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-medium text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/40 p-6 bg-muted/20">
        <div className="text-sm text-muted-foreground">This will only take about 2 minutes</div>
        <Button onClick={goToNextStep} variant="gradient" className="group">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
