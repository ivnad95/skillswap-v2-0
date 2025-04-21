import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata = {
  title: "About | SkillSwap",
  description: "Learn more about SkillSwap and our mission",
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former education technology leader with a passion for democratizing learning.",
      avatar: "/contemplative-artist.png",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Full-stack developer with expertise in AI and matching algorithms.",
      avatar: "/contemplative-man.png",
    },
    {
      name: "Priya Sharma",
      role: "Head of Community",
      bio: "Community building expert focused on creating meaningful connections.",
      avatar: "/thoughtful-reader.png",
    },
    {
      name: "David Wilson",
      role: "Head of Product",
      bio: "Product strategist with experience in educational platforms and marketplaces.",
      avatar: "/profile-photo.png",
    },
  ]

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
                <Badge className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20">About Us</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Mission</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  We're building a world where knowledge and skills are freely exchanged, creating a more connected and
                  skilled global community.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl mt-12">
              <div className="prose prose-invert max-w-none">
                <p>
                  SkillSwap was founded in 2023 with a simple idea: what if we could create a platform where people
                  could easily exchange skills and knowledge in a fair and balanced way?
                </p>

                <p>
                  Traditional education and skill acquisition often come with high costs and barriers to entry. We
                  wanted to democratize learning by creating a peer-to-peer platform where the currency is knowledge
                  itself.
                </p>

                <h2>Our Vision</h2>

                <p>
                  We envision a world where anyone can learn anything from anyone else, regardless of geographic
                  location, economic status, or background. By connecting those who want to teach with those who want to
                  learn, we're creating a global knowledge exchange that benefits everyone.
                </p>

                <h2>How It Works</h2>

                <p>
                  Our platform is built on a token-based system that ensures fair exchanges. When you teach someone a
                  skill, you earn tokens that you can then use to learn from others. This creates a sustainable
                  ecosystem where knowledge flows freely.
                </p>

                <p>
                  Our AI matching algorithm ensures that you find the perfect learning partners based on skills,
                  availability, and compatibility. Whether you're teaching programming, learning yoga, or exchanging
                  language skills, SkillSwap makes the process seamless and rewarding.
                </p>

                <h2>Our Values</h2>

                <ul>
                  <li>
                    <strong>Accessibility:</strong> Learning should be available to everyone.
                  </li>
                  <li>
                    <strong>Fairness:</strong> Our token system ensures balanced exchanges.
                  </li>
                  <li>
                    <strong>Community:</strong> We foster meaningful connections between learners and teachers.
                  </li>
                  <li>
                    <strong>Quality:</strong> Our rating system maintains high standards for all exchanges.
                  </li>
                  <li>
                    <strong>Innovation:</strong> We continuously improve our platform with cutting-edge technology.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-8">Meet Our Team</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">Join Our Community</h2>
              <p className="mx-auto max-w-[500px] text-muted-foreground">
                Ready to start exchanging skills and knowledge? Join thousands of users already teaching and learning on
                SkillSwap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
