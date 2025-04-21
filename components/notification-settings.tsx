"use client"

import { useState, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Define type for notification settings
interface NotificationPreferences {
  email: {
    sessions: boolean;
    messages: boolean;
    matches: boolean;
    reviews: boolean;
    marketing: boolean;
  };
  push: {
    sessions: boolean;
    messages: boolean;
    matches: boolean;
    reviews: boolean;
  };
}

// Define default settings
const defaultSettings: NotificationPreferences = {
  email: {
    sessions: true,
    messages: true,
    matches: true,
    reviews: true,
    marketing: false,
  },
  push: {
    sessions: true,
    messages: true,
    matches: false,
    reviews: false,
  },
};

export function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationPreferences>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // State for initial fetch

  // Fetch current settings on mount
  useEffect(() => {
    async function fetchSettings() {
      setIsFetching(true);
      try {
        // TODO: Implement actual API call to fetch settings
        // Example: const response = await fetch('/api/settings/notifications');
        // if (!response.ok) throw new Error('Failed to fetch settings');
        // const data = await response.json();
        // setSettings(data.settings || defaultSettings);

        // Simulate fetch for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        // setSettings(fetchedSettings || defaultSettings); // Use fetched data if available
      } catch (error) {
        toast({ title: "Error", description: "Could not load notification settings.", variant: "destructive" });
        // Keep default settings on error
      } finally {
        setIsFetching(false);
      }
    }
    fetchSettings();
   }, [toast]); // Added toast to dependency array
 
   const handleSwitchChange = (category: 'email' | 'push', key: string, checked: boolean) => {
     setSettings((prev: NotificationPreferences) => ({ // Add type for prev
       ...prev,
       [category]: {
        ...prev[category],
        [key]: checked,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement actual API call to save settings
      const response = await fetch('/api/settings/notifications', { // Assuming PUT /api/settings/notifications
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast({ title: "Success", description: "Notification preferences saved." });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Could not save preferences.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <div className="space-y-3">
              {(Object.keys(settings.email) as Array<keyof NotificationPreferences['email']>).map((key) => (
                <div key={`email-${key}`} className="flex items-center justify-between">
                  <Label htmlFor={`email-${key}`} className="capitalize">
                    {key === 'sessions' ? 'Session reminders' :
                     key === 'messages' ? 'New messages' :
                     key === 'matches' ? 'New skill matches' :
                     key === 'reviews' ? 'New reviews' :
                     key === 'marketing' ? 'Marketing and promotions' : key}
                  </Label>
                   <Switch
                     id={`email-${key}`}
                     checked={settings.email[key]}
                     onCheckedChange={(checked: boolean) => handleSwitchChange('email', key, checked)}
                     disabled={isLoading}
                   />
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <div className="space-y-3">
              {(Object.keys(settings.push) as Array<keyof NotificationPreferences['push']>).map((key) => (
                 <div key={`push-${key}`} className="flex items-center justify-between">
                   <Label htmlFor={`push-${key}`} className="capitalize">
                     {key === 'sessions' ? 'Session reminders' :
                      key === 'messages' ? 'New messages' :
                      key === 'matches' ? 'New skill matches' :
                      key === 'reviews' ? 'New reviews' : key}
                    </Label>
                    <Switch
                      id={`push-${key}`}
                      checked={settings.push[key]}
                      onCheckedChange={(checked: boolean) => handleSwitchChange('push', key, checked)}
                      disabled={isLoading}
                    />
                 </div>
               ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" variant="gradient" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Preferences
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
