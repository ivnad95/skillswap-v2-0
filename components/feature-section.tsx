import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyIcon as Exchange, Users, Award, Shield } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Exchange Skills with Our Token System
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              SkillSwap uses a token-based system to facilitate fair and balanced skill exchanges between users.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <Exchange className="h-12 w-12 mb-4 text-openai-blue" />
              <CardTitle>Skill Exchange</CardTitle>
              <CardDescription>Teach what you know, learn what you want</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our platform connects you with people who have complementary skill sets, enabling mutually beneficial
                exchanges.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Users className="h-12 w-12 mb-4 text-openai-blue" />
              <CardTitle>AI Matching</CardTitle>
              <CardDescription>Find the perfect learning partner</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI matches you with users based on skills, availability, token affordability, and ratings.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Award className="h-12 w-12 mb-4 text-openai-teal" />
              <CardTitle>Token System</CardTitle>
              <CardDescription>Fair value for your time and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Earn tokens by teaching, spend them to learn, or purchase them directly. A simple and fair economy.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-12 w-12 mb-4 text-openai-teal" />
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>Safe and reliable skill exchange</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our platform ensures secure transactions, verified profiles, and a trusted community environment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
