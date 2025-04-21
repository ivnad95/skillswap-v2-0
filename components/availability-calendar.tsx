import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProfileData } from "@/app/(dashboard)/profile/page"

// Define TypeScript interfaces for component props
interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Availability {
  [day: string]: TimeSlot[] | string[];  // Allow for both object format and simple strings
}

interface AvailabilityCalendarProps {
  profileData: ProfileData;
  readOnly?: boolean;
}

export function AvailabilityCalendar({ profileData, readOnly = true }: AvailabilityCalendarProps) {
  // Get availability from profileData
  const availability = profileData?.availability || {} as Availability
  
  // Convert from object format if needed
  const availabilityArray = typeof availability === 'object' && !Array.isArray(availability) 
    ? Object.keys(availability).map(day => ({
        day,
        slots: availability[day as keyof typeof availability] || []
      }))
    : [];
  
  if (!availabilityArray || availabilityArray.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No availability set yet.</p>
        <p className="mt-2 text-sm">Set your availability to let others book sessions with you.</p>
      </div>
    )
  }
  
  // Simple calendar visualization
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <div className="grid grid-cols-7 text-center border-b border-border/50 bg-muted/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-xs font-medium">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-border/20">
          {Array.from({ length: 35 }).map((_, index) => {
            const dayNum = (index % 7) + 1;
            const weekNum = Math.floor(index / 7);
            return (
              <div 
                key={index} 
                className="h-16 p-1 bg-background/80 flex flex-col"
              >
                <span className="text-xs text-muted-foreground">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Weekly Availability</h3>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {availabilityArray.map(({ day, slots }) => (
            slots.length > 0 && (
              <div key={day} className="border border-border/50 rounded-lg p-3 bg-background/50">
                <h4 className="font-medium">{day}</h4>
                <div className="mt-2 space-y-1">
                  {slots.map((slot, index) => (
                    <div key={`${day}-${index}`} className="text-sm text-muted-foreground py-1 px-2 bg-muted/30 rounded">
                      {typeof slot === 'string' 
                        ? slot 
                        : `${slot.startTime} - ${slot.endTime}`}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
