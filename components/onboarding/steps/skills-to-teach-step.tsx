"use client"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react"

// Predefined skill categories and example skills
const skillCategories = [
  {
    name: "Technology",
    skills: ["JavaScript", "Python", "React", "UI/UX Design", "Data Science", "Machine Learning"],
  },
  {
    name: "Languages",
    skills: ["Spanish", "French", "Mandarin", "German", "Japanese", "Sign Language"],
  },
  {
    name: "Arts & Crafts",
    skills: ["Painting", "Photography", "Knitting", "Pottery", "Graphic Design", "Music Production"],
  },
  {
    name: "Fitness & Wellness",
    skills: ["Yoga", "Meditation", "Nutrition", "Personal Training", "Dance", "Martial Arts"],
  },
  {
    name: "Business",
    skills: ["Marketing", "Accounting", "Public Speaking", "Project Management", "Sales", "Entrepreneurship"],
  },
]

export function SkillsToTeachStep() {
  const { goToNextStep, goToPreviousStep, onboardingData, updateOnboardingData } = useOnboarding()

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSkill, setSelectedSkill] = useState<string>("")
  const [customSkill, setCustomSkill] = useState<string>("")
  const [proficiencyLevel, setProficiencyLevel] = useState<string>("intermediate")
  const [skillDescription, setSkillDescription] = useState<string>("")
  const [skillsToTeach, setSkillsToTeach] = useState<
    Array<{
      skill: string
      level: string
      description: string
    }>
  >(onboardingData.skillsToTeach || [])

  const handleAddSkill = () => {
    const skillName = selectedSkill || customSkill

    if (!skillName) return

    const newSkill = {
      skill: skillName,
      level: proficiencyLevel,
      description: skillDescription,
    }

    setSkillsToTeach((prev) => [...prev, newSkill])

    // Reset form
    setSelectedSkill("")
    setCustomSkill("")
    setSkillDescription("")
    setProficiencyLevel("intermediate")
  }

  const handleRemoveSkill = (index: number) => {
    setSkillsToTeach((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    updateOnboardingData({ skillsToTeach })
    goToNextStep()
  }

  // Get skills for the selected category
  const categorySkills = skillCategories.find((cat) => cat.name === selectedCategory)?.skills || []

  return (
    <Card className="w-full bg-background/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-button" />

      <CardHeader>
        <CardTitle>Skills You Can Teach</CardTitle>
        <CardDescription>
          What skills are you proficient in and willing to teach others? You can add multiple skills.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current skills list */}
        {skillsToTeach.length > 0 && (
          <div className="space-y-3">
            <Label>Your Teaching Skills</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {skillsToTeach.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-white/10 dark:bg-card/20 backdrop-blur-sm border border-white/10"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="glass" className="capitalize">
                        {skill.level}
                      </Badge>
                    </div>
                    {skill.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{skill.description}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleRemoveSkill(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new skill form */}
        <div className="space-y-4 p-4 rounded-md bg-white/5 dark:bg-card/10 backdrop-blur-sm border border-white/5">
          <h3 className="font-medium">Add a New Skill</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Skill Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skill</Label>
              {selectedCategory ? (
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorySkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom skill...</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="customSkill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Enter your skill"
                />
              )}
            </div>
          </div>

          {selectedSkill === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customSkill">Custom Skill Name</Label>
              <Input
                id="customSkill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter your custom skill"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Brief Description</Label>
            <Textarea
              id="description"
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              placeholder="Describe your experience with this skill and how you can teach it"
              className="resize-none"
              rows={3}
            />
          </div>

          <Button
            onClick={handleAddSkill}
            variant="outline"
            className="w-full"
            disabled={!selectedSkill && !customSkill}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border/40 p-6 bg-muted/20">
        <Button onClick={goToPreviousStep} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} variant="gradient" className="group" disabled={skillsToTeach.length === 0}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
