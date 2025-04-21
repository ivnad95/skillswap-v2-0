import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export const metadata = {
  title: "Pricing | SkillSwap",
  description: "Choose the right plan for your skill exchange journey",
}

export default function PricingPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">Pricing</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Start with our free tier or upgrade to premium for enhanced features and benefits.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="mt-4 text-4xl font-bold">$0</div>
                  <p className="text-sm text-muted-foreground">Forever free</p>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">3 sessions per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Basic skill profile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Community forum access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Token purchases ($1 = 10 tokens)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Basic matching algorithm</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500 to-blue-500 text-white text-xs font-medium px-3 py-1">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>For serious skill exchangers</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">$10</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">or $100/year (save $20)</p>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Unlimited sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Enhanced skill profile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Priority matching</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">AI learning plans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">5% token discount</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Upgrade Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-12 space-y-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground">
                  Find answers to common questions about our pricing and plans.
                </p>
              </div>

              <div className="mx-auto max-w-3xl space-y-4">
                <div className="rounded-lg border border-primary/10 bg-background/50 p-4">
                  <h3 className="font-medium">Can I switch between plans?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of
                    your next billing cycle.
                  </p>
                </div>

                <div className="rounded-lg border border-primary/10 bg-background/50 p-4">
                  <h3 className="font-medium">What happens if I use all my free sessions?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Once you've used your 3 free sessions for the month, you'll need to wait until the next month or
                    upgrade to the Premium plan for unlimited sessions.
                  </p>
                </div>

                <div className="rounded-lg border border-primary/10 bg-background/50 p-4">
                  <h3 className="font-medium">Can I earn tokens on the free plan?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Both free and premium users can earn tokens by teaching skills to others on the platform.
                  </p>
                </div>

                <div className="rounded-lg border border-primary/10 bg-background/50 p-4">
                  <h3 className="font-medium">Is there a refund policy?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We offer a 14-day money-back guarantee for Premium subscriptions if you're not satisfied with the
                    service.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">Still have questions?</h2>
              <p className="mx-auto max-w-[500px] text-muted-foreground">
                Our team is here to help. Contact us for more information about our plans and pricing.
              </p>
              <Link href="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
