"use client"

import { useState, useRef, ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

// Define TypeScript interfaces
interface ProfileData {
  id?: string;
  userId?: string;
  bio?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  learningPreferences?: Record<string, any>;
  profileImage?: string | null;
  coverImage?: string | null;
  availability?: any[];
  skills?: any[];
  reviews?: any[];
  sessions?: any[];
  onboardingCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (updatedData: Partial<ProfileData>) => void;
}

interface FormData {
  bio: string;
  location: string;
  profileImage: string | null;
  coverImage: string | null;
  [key: string]: any; // Allow for other form fields
}

export function ProfileEditModal({ isOpen, onClose, profileData, onSave }: ProfileEditModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    bio: profileData?.bio || "",
    location: profileData?.location || "",
    profileImage: profileData?.profileImage || null,
    coverImage: profileData?.coverImage || null
  })

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(formData.profileImage)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(formData.coverImage)
  
  const profileFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  // Photo upload handlers
  const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePhotoPreview(result)
        setFormData(prev => ({ ...prev, profileImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverPhotoPreview(result)
        setFormData(prev => ({ ...prev, coverImage: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePhoto = () => {
    setProfilePhotoPreview(null)
    setFormData(prev => ({ ...prev, profileImage: null }))
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = ""
    }
  }

  const removeCoverPhoto = () => {
    setCoverPhotoPreview(null)
    setFormData(prev => ({ ...prev, coverImage: null }))
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = ""
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send update to API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to update profile')
      }

      // Show success message
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Pass the updated data back to parent
      onSave(formData)
      onClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <div className="flex flex-col items-center">
              {profilePhotoPreview ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 rounded-full h-6 w-6"
                    onClick={removeProfilePhoto}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-border bg-white/5">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground text-center">Upload Photo</p>
                </div>
              )}
              
              <input 
                type="file" 
                id="profilePhoto"
                ref={profileFileInputRef} 
                accept="image/*" 
                onChange={handleProfileFileChange} 
                className="hidden" 
              />
              
              <Button 
                variant="outline" 
                onClick={() => profileFileInputRef.current?.click()} 
                className="mt-4" 
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" />
                {profilePhotoPreview ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
          
          {/* Cover Photo */}
          <div className="space-y-2">
            <Label htmlFor="coverPhoto">Cover Photo</Label>
            <div className="flex flex-col items-center">
              {coverPhotoPreview ? (
                <div className="relative w-full">
                  <div className="w-full h-32 overflow-hidden rounded-lg border-2 border-primary/20">
                    <Image
                      src={coverPhotoPreview}
                      alt="Cover preview"
                      width={640}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full h-6 w-6"
                    onClick={removeCoverPhoto}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-32 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border bg-white/5">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground text-center">Upload Cover Photo</p>
                </div>
              )}
              
              <input 
                type="file" 
                id="coverPhoto"
                ref={coverFileInputRef} 
                accept="image/*" 
                onChange={handleCoverFileChange} 
                className="hidden" 
              />
              
              <Button 
                variant="outline" 
                onClick={() => coverFileInputRef.current?.click()} 
                className="mt-4" 
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" />
                {coverPhotoPreview ? "Change Cover" : "Upload Cover"}
              </Button>
            </div>
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}