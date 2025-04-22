"use client";

import { useState, useEffect, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming Select exists
import { Calendar } from "@/components/ui/calendar"; // Assuming Calendar exists
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Assuming Popover exists
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context"; // To get current user ID

// Define types for props and state
interface SessionScheduleModalProps {
  // Add props if needed, e.g., pre-selected user/skill
  triggerButton?: React.ReactNode; // Optional custom trigger
  onSessionScheduled?: () => void; // Callback after successful scheduling
}

interface UserSelectItem {
  id: string;
  name: string;
}

interface SkillSelectItem {
  id: string;
  title: string;
}

export function SessionScheduleModal({ triggerButton, onSessionScheduled }: SessionScheduleModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [sessionType, setSessionType] = useState<'teaching' | 'learning'>('learning'); // Default to learning
  const [partnerId, setPartnerId] = useState<string>('');
  const [skillId, setSkillId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>(''); // e.g., "14:00"
  const [notes, setNotes] = useState<string>('');

  // Data for selects (replace with actual API fetches)
  const [availablePartners, setAvailablePartners] = useState<UserSelectItem[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillSelectItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Fetch potential partners and skills when modal opens or type changes
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchData = async () => {
      setIsDataLoading(true);
      setAvailablePartners([]); // Clear previous partners
      setAvailableSkills([]); // Clear previous skills
      try {
        const partnerRole = sessionType === 'learning' ? 'teacher' : 'learner';

        // Fetch partners (teachers or learners, excluding self)
        const partnersRes = await fetch(`/api/users?role=${partnerRole}`); // Use the users API
        if (!partnersRes.ok) {
            const errorData = await partnersRes.json();
            throw new Error(errorData.error || 'Failed to fetch partners');
        }
        const partnersData = await partnersRes.json();
        setAvailablePartners(
          (partnersData.users || [])
            .filter((p: any) => p.id !== user.id) // Exclude self
            .map((p: any) => ({ id: p.id, name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unnamed User' }))
        );

        // Fetch skills the current user can teach or learn
        // Ensure the API route /api/skills supports filtering by userId and type
        const skillsRes = await fetch(`/api/skills?userId=${user.id}&type=${sessionType}`);
        if (!skillsRes.ok) {
             const errorData = await skillsRes.json();
             throw new Error(errorData.error || 'Failed to fetch skills');
        }
        const skillsData = await skillsRes.json();
        setAvailableSkills(
          (skillsData.skills || skillsData || []) // Adjust based on actual API response structure
            .map((s: any) => ({ id: s.id, title: s.title }))
        );

      } catch (fetchError) {
         console.error("Error fetching modal data:", fetchError);
         toast({ title: "Error", description: `Could not load scheduling options: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`, variant: "destructive" });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isOpen, sessionType, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDate || !selectedTime || !partnerId || !skillId) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [hour, minute] = selectedTime.split(':').map(Number);
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(hour, minute, 0, 0);

      // Determine teacher and learner IDs based on session type
      const teacherId = sessionType === 'teaching' ? user.id : partnerId;
      const learnerId = sessionType === 'learning' ? user.id : partnerId;

      const sessionData = {
        teacherId,
        learnerId,
        skillId,
        startTime: scheduledDateTime.toISOString(),
        // TODO: Determine end time (e.g., add 1 hour)
        endTime: new Date(scheduledDateTime.getTime() + 60 * 60 * 1000).toISOString(),
        status: 'scheduled', // Initial status
        notes,
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to schedule session');
      }

      toast({ title: "Success", description: "Session scheduled successfully!" });
      setIsOpen(false); // Close modal on success
      if (onSessionScheduled) {
        onSessionScheduled(); // Trigger callback if provided
      }
      // Reset form?
      setPartnerId('');
      setSkillId('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ title: "Error", description: err.message || "Failed to schedule session.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="gradient"><CalendarIcon className="mr-2 h-4 w-4" /> Schedule Session</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Schedule a New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
           {/* Session Type */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">I want to</Label>
             <Select value={sessionType} onValueChange={(value) => setSessionType(value as 'teaching' | 'learning')}>
               <SelectTrigger className="col-span-3">
                 <SelectValue placeholder="Select session type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="learning">Learn a Skill</SelectItem>
                 <SelectItem value="teaching">Teach a Skill</SelectItem>
               </SelectContent>
             </Select>
           </div>

           {/* Partner Selection */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="partner" className="text-right">
               {sessionType === 'learning' ? 'Teacher' : 'Learner'}
             </Label>
             <Select value={partnerId} onValueChange={setPartnerId} required>
               <SelectTrigger id="partner" className="col-span-3">
                 <SelectValue placeholder={`Select ${sessionType === 'learning' ? 'teacher' : 'learner'}`} />
               </SelectTrigger>
               <SelectContent>
                 {isDataLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                   availablePartners.length > 0 ? availablePartners.map(p => (
                     <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                   )) : <SelectItem value="none" disabled>No available partners</SelectItem>
                 }
               </SelectContent>
             </Select>
           </div>

           {/* Skill Selection */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="skill" className="text-right">
               Skill
             </Label>
             <Select value={skillId} onValueChange={setSkillId} required>
               <SelectTrigger id="skill" className="col-span-3">
                 <SelectValue placeholder="Select skill" />
               </SelectTrigger>
               <SelectContent>
                 {isDataLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                   availableSkills.length > 0 ? availableSkills.map(s => (
                     <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                   )) : <SelectItem value="none" disabled>No available skills</SelectItem>
                 }
               </SelectContent>
             </Select>
           </div>

           {/* Date Selection */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="date" className="text-right">
               Date
             </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    // TODO: Add disabled dates (e.g., past dates)
                  />
                </PopoverContent>
              </Popover>
           </div>

           {/* Time Selection */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="time" className="text-right">
               Time
             </Label>
             <Input
                id="time"
                type="time"
                className="col-span-3"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
           </div>

           {/* Notes */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="notes" className="text-right">
               Notes (Optional)
             </Label>
             <Textarea
                id="notes"
                className="col-span-3"
                placeholder="Any specific topics or questions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
           </div>

           {error && <p className="col-span-4 text-sm text-red-600 text-center">{error}</p>}

          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
             </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Schedule Session
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
