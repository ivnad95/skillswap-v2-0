import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Share Skills, Grow Together
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect with others to teach what you know and learn what you don't. Exchange skills using our
                token-based system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-lg overflow-hidden bg-openai-gradient-blue-yellow p-1">
              <img
                src="/diverse-group-city.png"
                alt="Diverse group of people exchanging skills"
                className="aspect-video overflow-hidden rounded-lg object-cover object-center sm:w-full lg:order-last"
                width={550}
                height={310}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
