"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define types (refine based on actual data/API)
interface PaymentMethod {
  id: string;
  type: string; // e.g., 'visa', 'mastercard'
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface BillingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface SubscriptionInfo {
  planName: string;
  price: string; // e.g., "$10/month"
  renewalDate: string; // e.g., "June 15, 2024"
  status: string; // e.g., "Active"
}

export function PaymentSettings() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({ name: "", address: "", city: "", state: "", zip: "", country: "" });
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({ methods: true, billing: true, subscription: true });
  const [isSavingBilling, setIsSavingBilling] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implement parallel API calls to fetch payment methods, billing info, subscription
        // Example: const [methodsRes, billingRes, subRes] = await Promise.all([
        //   fetch('/api/billing/methods'),
        //   fetch('/api/billing/info'),
        //   fetch('/api/billing/subscription')
        // Fetch actual data in parallel
        const [methodsRes, billingRes, subRes] = await Promise.all([
          fetch('/api/billing/payment'), // Assuming GET fetches methods
          fetch('/api/billing/info'),    // Assuming GET fetches billing info
          fetch('/api/billing/subscription') // Assuming this endpoint exists
        ]);

        // Process Payment Methods
        if (!methodsRes.ok) {
          console.error("Failed to fetch payment methods:", await methodsRes.text());
          // Handle error appropriately, maybe set empty array or show specific error
        } else {
          const methodsData = await methodsRes.json();
          // Adjust based on actual API response structure, e.g., methodsData.methods
          const fetchedMethods = methodsData.methods || methodsData || [];
          setPaymentMethods(fetchedMethods);
          setDefaultPaymentMethodId(fetchedMethods.find((m: PaymentMethod) => m.isDefault)?.id || null);
        }

        // Process Billing Info
        if (!billingRes.ok) {
           console.error("Failed to fetch billing info:", await billingRes.text());
        } else {
          const billingData = await billingRes.json();
          // Adjust based on actual API response structure, e.g., billingData.info
          setBillingInfo(billingData.info || billingData || { name: "", address: "", city: "", state: "", zip: "", country: "" });
        }

        // Process Subscription Info
        if (!subRes.ok) {
           console.error("Failed to fetch subscription info:", await subRes.text());
           setSubscription(null); // Set to null if fetch fails
        } else {
          const subData = await subRes.json();
           // Adjust based on actual API response structure, e.g., subData.subscription
          setSubscription(subData.subscription || subData || null);
        }

      } catch (error) {
        console.error("Error fetching payment settings:", error);
        toast({ title: "Error", description: "Failed to load payment settings.", variant: "destructive" });
      } finally {
        setIsLoading({ methods: false, billing: false, subscription: false });
      }
    };
    fetchData();
  }, [toast]);

   const handleBillingChange = (e: ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setBillingInfo((prev: BillingInfo) => ({ ...prev, [name]: value })); // Add type for prev
   };
 
  const handleSetDefaultMethod = (id: string) => {
    // TODO: Implement API call to set default payment method
    console.log("Set default:", id);
     setDefaultPaymentMethodId(id);
     // Update local state optimistically or after API success
     setPaymentMethods((prev: PaymentMethod[]) => prev.map((m: PaymentMethod) => ({ ...m, isDefault: m.id === id }))); // Add types for prev and m
     toast({ title: "Success", description: "Default payment method updated." });
   };

  const handleAddMethod = () => {
    // TODO: Implement logic to open a modal or redirect to add payment method (likely involves Stripe Elements or similar)
    console.log("Add payment method clicked");
    toast({ title: "Info", description: "Add payment method functionality not yet implemented." });
  };

  const handleEditMethod = (id: string) => {
     // TODO: Implement logic to open an edit modal for the payment method
     console.log("Edit payment method clicked:", id);
     toast({ title: "Info", description: "Edit payment method functionality not yet implemented." });
  };

  const handleChangePlan = () => {
     // TODO: Implement logic to change subscription plan
     console.log("Change plan clicked");
     toast({ title: "Info", description: "Change plan functionality not yet implemented." });
  };

  const handleSaveBilling = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingBilling(true);
    try {
      // TODO: Implement API call to save billing info
      const response = await fetch('/api/billing/info', { // Assuming PUT /api/billing/info
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingInfo),
      });
      if (!response.ok) throw new Error('Failed to save billing information');
      toast({ title: "Success", description: "Billing information saved." });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Could not save billing info.", variant: "destructive" });
    } finally {
      setIsSavingBilling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods Card */}
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading.methods ? (
            <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
             <RadioGroup value={defaultPaymentMethodId || ""} onValueChange={handleSetDefaultMethod}>
               {paymentMethods.map((method: PaymentMethod) => ( // Add type for method
                 <div key={method.id} className="flex items-center space-x-2 border border-primary/10 rounded-md p-4">
                   <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 flex items-center gap-3 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}</p>
                       <p className="text-sm text-muted-foreground">Expires {method.expiryMonth}/{method.expiryYear}</p>
                     </div>
                   </Label>
                   <Button variant="outline" size="sm" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); handleEditMethod(method.id); }}> {/* Add type for e */}
                     Edit
                   </Button>
                </div>
              ))}
            </RadioGroup>
          )}
          <Button variant="outline" className="w-full gap-1" onClick={handleAddMethod}>
            <Plus className="h-4 w-4 mr-1" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing Information Card */}
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <form onSubmit={handleSaveBilling}>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading.billing ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="billing-name">Name</Label>
                  <Input id="billing-name" name="name" value={billingInfo.name} onChange={handleBillingChange} disabled={isSavingBilling} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Input id="billing-address" name="address" value={billingInfo.address} onChange={handleBillingChange} disabled={isSavingBilling} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billing-city">City</Label>
                    <Input id="billing-city" name="city" value={billingInfo.city} onChange={handleBillingChange} disabled={isSavingBilling} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billing-state">State</Label>
                    <Input id="billing-state" name="state" value={billingInfo.state} onChange={handleBillingChange} disabled={isSavingBilling} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billing-zip">ZIP</Label>
                    <Input id="billing-zip" name="zip" value={billingInfo.zip} onChange={handleBillingChange} disabled={isSavingBilling} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-country">Country</Label>
                  <Input id="billing-country" name="country" value={billingInfo.country} onChange={handleBillingChange} disabled={isSavingBilling} />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" variant="gradient" disabled={isSavingBilling || isLoading.billing}>
              {isSavingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Billing Information
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Subscription Card */}
      <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading.subscription ? (
            <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : subscription ? (
            <div className="flex items-center justify-between p-4 border border-primary/10 rounded-md bg-muted/50">
              <div>
                <p className="font-medium">{subscription.planName}</p>
                <p className="text-sm text-muted-foreground">{subscription.price}, renews on {subscription.renewalDate}</p>
              </div>
              <Button variant="outline" onClick={handleChangePlan}>Change Plan</Button>
            </div>
          ) : (
            <p className="text-muted-foreground">No active subscription found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
