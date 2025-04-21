import Link from "next/link"
import { Calendar, CheckCircle, MessageSquare, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                SkillSwap Features
              </h1>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Discover all the powerful tools and features that make SkillSwap the ultimate platform for peer-to-peer
                skill exchange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Skill Profiles</h2>
                <p className="text-muted-foreground md:text-lg">
                  Create comprehensive profiles showcasing what you can teach and what you want to learn.
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Specify teaching and learning skills with proficiency levels</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Set your token rates (5-20 tokens/hour)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Upload portfolios and credentials to showcase expertise</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Receive and display ratings from past sessions</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="w-full max-w-md border border-border/50">
                    <CardHeader>
                      <CardTitle>User Profile</CardTitle>
                      <CardDescription>Web Development Instructor & Photography Student</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm">Skills I Teach:</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-purple-500/20 text-purple-500 text-xs px-2 py-1 rounded-full">
                              React (Expert)
                            </span>
                            <span className="bg-purple-500/20 text-purple-500 text-xs px-2 py-1 rounded-full">
                              Next.js (Advanced)
                            </span>
                            <span className="bg-purple-500/20 text-purple-500 text-xs px-2 py-1 rounded-full">
                              JavaScript (Expert)
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Skills I Want to Learn:</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full">
                              Photography (Beginner)
                            </span>
                            <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full">
                              Photo Editing (Beginner)
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Rate:</h4>
                          <p className="text-sm">15 tokens/hour for teaching</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full h-[300px] md:h-[400px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="w-full max-w-md border border-border/50">
                    <CardHeader>
                      <CardTitle>AI Skill Matching</CardTitle>
                      <CardDescription>Your personalized skill exchange recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-card border border-border/50 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <Users className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Sarah T.</h4>
                              <p className="text-xs text-muted-foreground">Photography Expert (98% match)</p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto">
                              Connect
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-card border border-border/50 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <Users className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Michael R.</h4>
                              <p className="text-xs text-muted-foreground">Photography Teacher (92% match)</p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto">
                              Connect
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-card border border-border/50 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <Users className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">Jessica L.</h4>
                              <p className="text-xs text-muted-foreground">Photo Editing Expert (87% match)</p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-auto">
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 order-1 lg:order-2">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">AI-Powered Matching</h2>
                <p className="text-muted-foreground md:text-lg">
                  Our Groq-powered AI matching system connects you with the perfect skill partners.
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Matches based on skills, availability, token affordability, and ratings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Personalized recommendations that improve over time</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Filter matches by location, skill level, and availability</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Priority matching for premium subscribers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Features Grid */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">More Powerful Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need for effective skill exchange
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-10 w-10 text-purple-500" />
                </div>
                <CardTitle>Session Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Easily schedule and manage teaching sessions with our integrated booking system.
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Video sessions via WebRTC, chat, or in-person options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Calendar integration with Google Calendar and Outlook</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Automated reminders and notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-2">
                  <MessageSquare className="h-10 w-10 text-blue-500" />
                </div>
                <CardTitle>Token System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Our SkillTokens make exchanging skills fair and flexible.
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Earn tokens by teaching, purchase ($1 = 10 tokens), or spend to learn</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Secure transaction system with detailed history</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>5% token discount for premium subscribers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-10 w-10 text-purple-500" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Track your learning journey with achievements and milestones.
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Earn badges for completed sessions and milestones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Track hours spent learning and teaching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>AI-generated learning plans for premium users</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <CardTitle>Community Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Connect with others in topic-based discussion forums.
                </CardDescription>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Skill-specific discussion boards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Share resources and learning materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                    <span>Organize group learning sessions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">AI Assistant</h2>
                <p className="text-muted-foreground md:text-lg">Get help anytime with our Groq-powered AI assistant.</p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>24/7 customer support for common questions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Personalized learning recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Help with platform navigation and features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>Skill improvement suggestions based on your progress</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="w-full max-w-md border border-border/50">
                    <CardHeader>
                      <CardTitle>SkillSwap Assistant</CardTitle>
                      <CardDescription>Powered by Groq AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">How can I find the best JavaScript tutors?</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm">
                            I can help you find JavaScript tutors! Based on your profile, I recommend filtering for
                            Advanced or Expert level JavaScript teachers. You can also sort by rating or token rate.
                            Would you like me to show you the top 3 matches?
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Yes, show matches
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Other options
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
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
