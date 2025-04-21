import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Plus } from "lucide-react"

export function PaymentSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup defaultValue="card1">
            <div className="flex items-center space-x-2 border border-primary/10 rounded-md p-4">
              <RadioGroupItem value="card1" id="card1" />
              <Label htmlFor="card1" className="flex-1 flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/24</p>
                </div>
              </Label>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
            <div className="flex items-center space-x-2 border border-primary/10 rounded-md p-4">
              <RadioGroupItem value="card2" id="card2" />
              <Label htmlFor="card2" className="flex-1 flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">Mastercard ending in 5678</p>
                  <p className="text-sm text-muted-foreground">Expires 08/25</p>
                </div>
              </Label>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </RadioGroup>
          <Button variant="outline" className="w-full gap-1">
            <Plus className="h-4 w-4 mr-1" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="billing-name">Name</Label>
            <Input id="billing-name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billing-address">Address</Label>
            <Input id="billing-address" defaultValue="123 Main St" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="billing-city">City</Label>
              <Input id="billing-city" defaultValue="New York" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-state">State</Label>
              <Input id="billing-state" defaultValue="NY" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing-zip">ZIP</Label>
              <Input id="billing-zip" defaultValue="10001" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billing-country">Country</Label>
            <Input id="billing-country" defaultValue="United States" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="gradient">
            Save Billing Information
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-primary/10 rounded-md bg-muted/50">
            <div>
              <p className="font-medium">Premium Plan</p>
              <p className="text-sm text-muted-foreground">$10/month, renews on June 15, 2024</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
