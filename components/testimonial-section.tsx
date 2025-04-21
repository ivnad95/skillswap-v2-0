import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Hear from our community of learners and teachers about their experiences with SkillSwap.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/contemplative-artist.png" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-openai-yellow text-openai-yellow" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">
                    "SkillSwap has completely transformed how I learn new skills. The token system makes it easy to both
                    teach and learn, and I've connected with amazing people from around the world."
                  </p>
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Data Scientist</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/contemplative-man.png" alt="Michael Chen" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-openai-yellow text-openai-yellow" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">
                    "I've been able to teach my programming skills and learn yoga in return. SkillSwap has created an
                    amazing community of lifelong learners."
                  </p>
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Software Engineer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/thoughtful-reader.png" alt="Emma Wilson" />
                  <AvatarFallback>EW</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-openai-yellow text-openai-yellow" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">
                    "As a language teacher, SkillSwap has given me a platform to share my knowledge while learning
                    graphic design. The token system is brilliant and fair for everyone."
                  </p>
                  <p className="text-sm font-medium">Emma Wilson</p>
                  <p className="text-xs text-muted-foreground">Language Instructor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
