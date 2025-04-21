import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationSettings() {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-sessions">Session reminders</Label>
              <Switch id="email-sessions" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-messages">New messages</Label>
              <Switch id="email-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-matches">New skill matches</Label>
              <Switch id="email-matches" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-reviews">New reviews</Label>
              <Switch id="email-reviews" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-marketing">Marketing and promotions</Label>
              <Switch id="email-marketing" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-sessions">Session reminders</Label>
              <Switch id="push-sessions" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-messages">New messages</Label>
              <Switch id="push-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-matches">New skill matches</Label>
              <Switch id="push-matches" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-reviews">New reviews</Label>
              <Switch id="push-reviews" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="gradient">
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
