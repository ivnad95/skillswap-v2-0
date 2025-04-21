 "use client"
 
 import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react" // Added useRef import
 import { Button } from "@/components/ui/button"
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context" // Assuming user data comes from here initially
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image" // Needed for potential photo preview

// Define types (can be refined based on actual API/user structure)
interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string; // Usually not editable here, but shown
  location: string;
  bio: string;
  profileImage: string | null;
}

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function AccountSettings() {
  const { user } = useAuth(); // Get authenticated user info
  const { toast } = useToast();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    bio: "",
    profileImage: null,
  });
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
   const [isProfileLoading, setIsProfileLoading] = useState(false);
   const [isPasswordLoading, setIsPasswordLoading] = useState(false);
   const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
   const profileFileInputRef = useRef<HTMLInputElement>(null); // Now useRef is imported
 
   // Fetch initial profile data when user context is available
  useEffect(() => {
    if (user) {
      // TODO: Fetch detailed profile info if not fully available in user context
      // Example: fetch('/api/profile').then(res => res.json()).then(data => setProfileInfo(data.profile))
      setProfileInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        location: "", // Assuming location/bio/image need separate fetch
        bio: "",      // Assuming location/bio/image need separate fetch
        profileImage: null // Assuming location/bio/image need separate fetch
      });
      setProfilePhotoPreview(null); // Set preview based on fetched data if available
    }
  }, [user]);

   const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setProfileInfo((prev: ProfileInfo) => ({ ...prev, [name]: value }));
   };
 
   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setPasswordInfo((prev: PasswordInfo) => ({ ...prev, [name]: value }));
   };
 
  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
         const result = e.target?.result as string;
         setProfilePhotoPreview(result);
         // Store the result (Data URL) or prepare file for upload
         setProfileInfo((prev: ProfileInfo) => ({ ...prev, profileImage: result }));
       }
       reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    try {
      // TODO: Implement actual API call to update profile
      // Need to decide how to handle image upload (Data URL vs. separate upload)
      const response = await fetch('/api/profile', { // Assuming PUT /api/profile
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileInfo), // Send relevant fields
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Could not update profile.", variant: "destructive" });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (passwordInfo.newPassword.length < 8) {
       toast({ title: "Error", description: "New password must be at least 8 characters.", variant: "destructive" });
       return;
    }

    setIsPasswordLoading(true);
    try {
      // TODO: Implement actual API call to update password
      const response = await fetch('/api/auth/update-password', { // Assuming POST /api/auth/update-password
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
        }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error?.message || 'Failed to update password');
      }

      toast({ title: "Success", description: "Password updated successfully." });
      setPasswordInfo({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Clear fields
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Could not update password.", variant: "destructive" });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <form onSubmit={handleProfileSubmit}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePhotoPreview || profileInfo.profileImage || ""} alt={profileInfo.firstName} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500">
                    {profileInfo.firstName?.[0]}{profileInfo.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={profileFileInputRef}
                  onChange={handleProfilePhotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => profileFileInputRef.current?.click()}
                  disabled={isProfileLoading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Change Photo
                </Button>
              </div>
              {/* Form Fields Section */}
              <div className="flex-1 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" value={profileInfo.firstName} onChange={handleProfileChange} disabled={isProfileLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" value={profileInfo.lastName} onChange={handleProfileChange} disabled={isProfileLoading} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  {/* Email usually not editable */}
                  <Input id="email" type="email" value={profileInfo.email} readOnly disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={profileInfo.location} onChange={handleProfileChange} placeholder="City, Country" disabled={isProfileLoading} />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileInfo.bio}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself..."
                rows={4}
                disabled={isProfileLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant="gradient" disabled={isProfileLoading}>
              {isProfileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Password Card */}
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <form onSubmit={handlePasswordSubmit}>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" value={passwordInfo.currentPassword} onChange={handlePasswordChange} required disabled={isPasswordLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" name="newPassword" type="password" value={passwordInfo.newPassword} onChange={handlePasswordChange} required minLength={8} disabled={isPasswordLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordInfo.confirmPassword} onChange={handlePasswordChange} required minLength={8} disabled={isPasswordLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant="gradient" disabled={isPasswordLoading}>
              {isPasswordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
