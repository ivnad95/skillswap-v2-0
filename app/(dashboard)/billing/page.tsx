import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Billing | SkillSwap",
  description: "Manage your subscription and tokens",
}

export default function BillingPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage your subscription and tokens.</p>
        </div>
        <Button variant="gradient">
          <Plus className="mr-2 h-4 w-4" /> Buy Tokens
        </Button>
      </div>

      <Tabs defaultValue="subscription" className="mt-6">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription plan and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">Premium Plan</h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">$10/month • Renews on June 15, 2024</p>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Plan Benefits</h3>
                <ul className="grid gap-2">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Unlimited sessions</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>Priority matching</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>AI learning plans</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>5% token discount</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-primary/10 pt-6">
              <Button variant="outline" className="text-red-500 hover:text-red-600">
                Cancel Subscription
              </Button>
              <Button variant="gradient">
                Upgrade to Annual ($100/year)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Token Balance</CardTitle>
              <CardDescription>Manage your SkillTokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">S</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl">125 Tokens</h3>
                    <p className="text-sm text-muted-foreground">Current balance</p>
                  </div>
                </div>
                <Button variant="gradient">
                  Buy More Tokens
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Token Packages</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border border-primary/10 rounded-lg bg-background/30 flex flex-col">
                    <div className="font-medium">Starter</div>
                    <div className="text-2xl font-bold mt-1">50 Tokens</div>
                    <div className="text-sm text-muted-foreground mt-1">$5.00</div>
                    <Button variant="outline" className="mt-4">
                      Purchase
                    </Button>
                  </div>
                  <div className="p-4 border border-primary/10 rounded-lg bg-background/30 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500 to-blue-500 text-white text-xs font-medium px-3 py-1">
                      Popular
                    </div>
                    <div className="font-medium">Standard</div>
                    <div className="text-2xl font-bold mt-1">150 Tokens</div>
                    <div className="text-sm text-muted-foreground mt-1">$12.00</div>
                    <Button variant="gradient" className="mt-4">
                      Purchase
                    </Button>
                  </div>
                  <div className="p-4 border border-primary/10 rounded-lg bg-background/30 flex flex-col">
                    <div className="font-medium">Premium</div>
                    <div className="text-2xl font-bold mt-1">500 Tokens</div>
                    <div className="text-sm text-muted-foreground mt-1">$35.00</div>
                    <Button variant="outline" className="mt-4">
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Token Transactions</CardTitle>
              <CardDescription>Recent token activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-b border-primary/5">
                  <div>
                    <p className="font-medium">JavaScript Session with Alex Chen</p>
                    <p className="text-sm text-muted-foreground">May 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+15 tokens</p>
                    <p className="text-xs text-muted-foreground">Teaching</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-primary/5">
                  <div>
                    <p className="font-medium">Yoga Session with Maya Patel</p>
                    <p className="text-sm text-muted-foreground">May 10, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-500">-20 tokens</p>
                    <p className="text-xs text-muted-foreground">Learning</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-primary/5">
                  <div>
                    <p className="font-medium">Token Purchase</p>
                    <p className="text-sm text-muted-foreground">May 5, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+150 tokens</p>
                    <p className="text-xs text-muted-foreground">Purchase</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-primary/10 pt-6">
              <Button variant="outline">View All Transactions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/24</p>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8" />
                  <div>
                    <p className="font-medium">Mastercard ending in 5678</p>
                    <p className="text-sm text-muted-foreground">Expires 08/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Make Default
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                  <div>
                    <p className="font-medium">Premium Subscription</p>
                    <p className="text-sm text-muted-foreground">May 15, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$10.00</p>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Invoice
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                  <div>
                    <p className="font-medium">Token Purchase - 150 Tokens</p>
                    <p className="text-sm text-muted-foreground">May 5, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$12.00</p>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Invoice
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                  <div>
                    <p className="font-medium">Premium Subscription</p>
                    <p className="text-sm text-muted-foreground">April 15, 2024</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">$10.00</p>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-primary/10 pt-6">
              <Button variant="outline">View All Invoices</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
