import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Download, ChevronDown } from "lucide-react"
import { ProfileData } from "@/app/(dashboard)/profile/page"

// Define TypeScript interfaces
interface Session {
  id: string;
  skill?: {
    id?: string;
    title?: string;
  };
  partnerName?: string;
  date: string | Date;
  duration?: string;
  notes?: string;
  role?: 'teacher' | 'learner';
  status?: 'scheduled' | 'completed' | 'cancelled';
}

interface SessionHistoryProps {
  profileData: ProfileData;
}

export function SessionHistory({ profileData }: SessionHistoryProps) {
  // Get sessions or use empty array
  const sessions = profileData?.sessions || []
  
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No session history yet.</p>
        <p className="mt-2 text-sm">Your past sessions will appear here.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div 
          key={session.id || index} 
          className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{session.skill?.title || "Untitled Session"}</h3>
              <p className="text-sm text-muted-foreground">
                {session.role === 'teacher' ? 'Taught to' : 'Learned from'}: {session.partnerName || 'Unknown'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm">{new Date(session.date).toLocaleDateString()}</div>
              <div className="text-xs text-muted-foreground">{session.duration || '1 hour'}</div>
            </div>
          </div>
          {session.notes && (
            <p className="mt-2 text-sm border-t border-border/50 pt-2">{session.notes}</p>
          )}
        </div>
      ))}
    </div>
  )
}
