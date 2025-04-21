"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, Camera } from "lucide-react"
import Image from "next/image"

export function ProfilePhotoStep() {
  const { goToNextStep, goToPreviousStep, onboardingData, updateOnboardingData } = useOnboarding()

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(onboardingData.profileImage || null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(onboardingData.coverImage || null)
  const [isDraggingProfile, setIsDraggingProfile] = useState(false)
  const [isDraggingCover, setIsDraggingCover] = useState(false)
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePhotoPreview(result)
        updateOnboardingData({ profileImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverPhotoPreview(result)
        updateOnboardingData({ coverImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    updateOnboardingData({
      profileImage: profilePhotoPreview,
      coverImage: coverPhotoPreview,
    })
    goToNextStep()
  }

  const removeProfilePhoto = () => {
    setProfilePhotoPreview(null)
    updateOnboardingData({ profileImage: null })
  }

  const removeCoverPhoto = () => {
    setCoverPhotoPreview(null)
    updateOnboardingData({ coverImage: null })
  }

  const handleProfileDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingProfile(true)
  }

  const handleProfileDragLeave = () => {
    setIsDraggingProfile(false)
  }

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingProfile(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePhotoPreview(result)
        updateOnboardingData({ profileImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingCover(true)
  }

  const handleCoverDragLeave = () => {
    setIsDraggingCover(false)
  }

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingCover(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverPhotoPreview(result)
        updateOnboardingData({ coverImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="w-full bg-background/50 backdrop-blur-md border-primary/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-button" />

      <CardHeader>
        <CardTitle>Profile Photos</CardTitle>
        <CardDescription>Add photos to make your profile stand out.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Profile Photo</h3>
          <p className="text-xs text-muted-foreground">This will be displayed on your profile and in search results.</p>

          <div
            className={`mt-2 flex flex-col items-center justify-center border-2 ${
              isDraggingProfile ? "border-primary" : "border-dashed border-border"
            } rounded-full w-32 h-32 mx-auto overflow-hidden relative transition-colors`}
            onDragOver={handleProfileDragOver}
            onDragLeave={handleProfileDragLeave}
            onDrop={handleProfileDrop}
          >
            {profilePhotoPreview ? (
              <>
                <Image
                  src={profilePhotoPreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0 z-10 h-6 w-6 rounded-full"
                  onClick={removeProfilePhoto}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove profile photo</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <Camera className="mb-2 h-8 w-8" />
                <p className="text-xs">Drag a photo here or click to upload</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={profileFileInputRef}
              onChange={handleProfileFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => profileFileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Cover Photo</h3>
          <p className="text-xs text-muted-foreground">This will be displayed at the top of your profile page.</p>

          <div
            className={`mt-2 flex flex-col items-center justify-center border-2 ${
              isDraggingCover ? "border-primary" : "border-dashed border-border"
            } rounded-lg h-32 w-full overflow-hidden relative transition-colors`}
            onDragOver={handleCoverDragOver}
            onDragLeave={handleCoverDragLeave}
            onDrop={handleCoverDrop}
          >
            {coverPhotoPreview ? (
              <>
                <Image
                  src={coverPhotoPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full"
                  onClick={removeCoverPhoto}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove cover photo</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <Camera className="mb-2 h-8 w-8" />
                <p className="text-xs">Drag a photo here or click to upload</p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverFileInputRef}
              onChange={handleCoverFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => coverFileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={goToPreviousStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
