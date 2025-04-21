import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, MessageSquare, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  Learn and Teach Skills with SkillSwap
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with others to exchange knowledge through our token-based platform. Teach what you know, learn
                  what you don't.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-4 md:space-y-8">
                      <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                        <h3 className="font-medium">Web Development</h3>
                        <p className="text-sm text-muted-foreground">Learn React, Next.js, and more</p>
                      </div>
                      <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                        <h3 className="font-medium">Digital Marketing</h3>
                        <p className="text-sm text-muted-foreground">Master SEO and social media</p>
                      </div>
                    </div>
                    <div className="space-y-4 md:space-y-8 mt-8">
                      <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                        <h3 className="font-medium">Graphic Design</h3>
                        <p className="text-sm text-muted-foreground">Create stunning visuals</p>
                      </div>
                      <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                        <h3 className="font-medium">Language Learning</h3>
                        <p className="text-sm text-muted-foreground">Speak a new language</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How SkillSwap Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our token-based system makes skill exchange simple and rewarding
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-2 border border-border/50 rounded-lg p-4 bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Create Your Profile</h3>
              <p className="text-muted-foreground text-center">
                List the skills you can teach and what you want to learn
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border border-border/50 rounded-lg p-4 bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Get Matched</h3>
              <p className="text-muted-foreground text-center">Our AI matches you with compatible skill partners</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border border-border/50 rounded-lg p-4 bg-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Schedule Sessions</h3>
              <p className="text-muted-foreground text-center">Book sessions and exchange skills using SkillTokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to exchange skills effectively
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-12">
            {[
              {
                icon: <BookOpen className="h-10 w-10 mb-3 text-purple-500" />,
                title: "Skill Profiles",
                description: "Create detailed profiles of what you can teach and what you want to learn",
              },
              {
                icon: <Calendar className="h-10 w-10 mb-3 text-blue-500" />,
                title: "Session Booking",
                description: "Schedule and manage teaching sessions with integrated calendar",
              },
              {
                icon: <MessageSquare className="h-10 w-10 mb-3 text-purple-500" />,
                title: "Built-in Communication",
                description: "Chat, video calls, and messaging with your skill partners",
              },
              {
                icon: <Star className="h-10 w-10 mb-3 text-blue-500" />,
                title: "AI Matching",
                description: "Get matched with the perfect skill partners using our Groq-powered AI",
              },
              {
                icon: <Users className="h-10 w-10 mb-3 text-purple-500" />,
                title: "Community Forums",
                description: "Connect with others in your skill areas through topic-based forums",
              },
              {
                icon: <ArrowRight className="h-10 w-10 mb-3 text-blue-500" />,
                title: "Progress Tracking",
                description: "Track your learning journey with badges and achievements",
              },
            ].map((feature, index) => (
              <Card key={index} className="border border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-center">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/features">
              <Button variant="outline">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Learning?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users exchanging skills on SkillSwap today
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-background border-t border-border/40">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md" />
                <span className="font-bold text-xl">SkillSwap</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connect, learn, and teach with our peer-to-peer skill exchange platform.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-muted-foreground hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">© 2024 SkillSwap. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
