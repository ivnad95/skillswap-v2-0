import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Choose Your Plan</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Start with our free tier or upgrade to premium for enhanced features and benefits.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">3 sessions per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Basic skill profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Community forum access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Token purchases ($1 = 10 tokens)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-openai-gradient text-white text-xs font-medium px-3 py-1">
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
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Unlimited sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Enhanced skill profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">Priority matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">AI learning plans</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-openai-blue" />
                  <span className="text-sm">5% token discount</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Upgrade Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
