import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Start Your Skill Exchange Journey?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Join thousands of users who are already teaching, learning, and growing together on SkillSwap.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/signup">
              <Button>Sign Up Now</Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline">Explore Skills</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
