"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const timeSlots = ["Morning (6AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-10PM)"]

export function AvailabilityStep() {
  const { goToNextStep, goToPreviousStep, onboardingData, updateOnboardingData } = useOnboarding()

  const [availability, setAvailability] = useState<Record<string, string[]>>(
    onboardingData.availability || {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  )

  const [sessionPreferences, setSessionPreferences] = useState({
    inPerson: onboardingData.sessionPreferences?.inPerson || false,
    online: onboardingData.sessionPreferences?.online || true,
    maxSessionsPerWeek: onboardingData.sessionPreferences?.maxSessionsPerWeek || "3",
  })

  const toggleTimeSlot = (day: string, slot: string) => {
    setAvailability((prev) => {
      const daySlots = [...(prev[day] || [])]

      if (daySlots.includes(slot)) {
        return {
          ...prev,
          [day]: daySlots.filter((s) => s !== slot),
        }
      } else {
        return {
          ...prev,
          [day]: [...daySlots, slot],
        }
      }
    })
  }

  const handleContinue = () => {
    updateOnboardingData({
      availability,
      sessionPreferences,
    })
    goToNextStep()
  }

  // Check if at least one time slot is selected
  const hasAvailability = Object.values(availability).some((slots) => slots.length > 0)

  return (
    <Card className="w-full bg-background/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-button" />

      <CardHeader>
        <CardTitle>Your Availability</CardTitle>
        <CardDescription>Let us know when you're available for teaching and learning sessions.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Weekly Availability</Label>
          <p className="text-sm text-muted-foreground">
            Select the time slots when you're typically available for skill exchange sessions.
          </p>

          <div className="grid gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="space-y-2">
                <div className="font-medium text-sm">{day}</div>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = availability[day]?.includes(slot)

                    return (
                      <Badge
                        key={slot}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer ${isSelected ? "bg-gradient-button" : "hover:bg-accent/10"}`}
                        onClick={() => toggleTimeSlot(day, slot)}
                      >
                        {slot}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 rounded-md bg-white/5 dark:bg-card/10 backdrop-blur-sm border border-white/5">
          <h3 className="font-medium">Session Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inPerson">In-person Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Are you available for in-person skill exchange sessions?
                </p>
              </div>
              <Switch
                id="inPerson"
                checked={sessionPreferences.inPerson}
                onCheckedChange={(checked) => setSessionPreferences((prev) => ({ ...prev, inPerson: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="online">Online Sessions</Label>
                <p className="text-sm text-muted-foreground">Are you available for online skill exchange sessions?</p>
              </div>
              <Switch
                id="online"
                checked={sessionPreferences.online}
                onCheckedChange={(checked) => setSessionPreferences((prev) => ({ ...prev, online: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSessions">Maximum Sessions Per Week</Label>
              <Select
                value={sessionPreferences.maxSessionsPerWeek}
                onValueChange={(value) => setSessionPreferences((prev) => ({ ...prev, maxSessionsPerWeek: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maximum sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 session per week</SelectItem>
                  <SelectItem value="2">2 sessions per week</SelectItem>
                  <SelectItem value="3">3 sessions per week</SelectItem>
                  <SelectItem value="5">5 sessions per week</SelectItem>
                  <SelectItem value="7">7 sessions per week</SelectItem>
                  <SelectItem value="10">10+ sessions per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/40 p-6 bg-muted/20">
        <Button onClick={goToPreviousStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} variant="gradient" className="group" disabled={!hasAvailability}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
