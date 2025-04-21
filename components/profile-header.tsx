import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, MapPin, Calendar } from "lucide-react"

// Define TypeScript interfaces
interface ProfileData {
  id?: string;
  userId?: string;
  bio?: string;
  location?: string;
  profileImage?: string | null;
  coverImage?: string | null;
  [key: string]: any; // Allow for other properties
}

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string | Date;
  [key: string]: any; // Allow for other properties
}

interface ProfileHeaderProps {
  profileData: ProfileData | null;
  user: User | null;
  onEditClick: () => void;
}

export function ProfileHeader({ profileData, user, onEditClick }: ProfileHeaderProps) {
  // Use the passed-in profile data instead of hard-coded data
  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "User Name"
  const bio = profileData?.bio || "No bio available"
  const location = profileData?.location || "Location not specified"
  // Get join date from user data or use current date
  const joinDate = new Date(user?.createdAt || Date.now())
  const joinMonth = joinDate.toLocaleString('default', { month: 'long' })
  const joinYear = joinDate.getFullYear()
  
  return (
    <Card className="overflow-hidden border-primary/10 bg-background/50 backdrop-blur-sm">
      {/* Cover Photo */}
      <div 
        className="h-48 w-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 relative"
        style={profileData?.coverImage ? { 
          backgroundImage: `url(${profileData.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Profile</span>
        </Button>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6 -mt-12">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profileData?.profileImage || ""} alt={name} />
              <AvatarFallback className="text-2xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 pt-12 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  {location && (
                    <div className="flex items-center mr-4">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span className="text-sm">Joined {joinMonth} {joinYear}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-4 text-muted-foreground">{bio}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
