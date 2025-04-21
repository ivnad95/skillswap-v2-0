import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function RecommendedMatches() {
  // Empty state - no mock data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Matches</CardTitle>
        <CardDescription>People who match your learning interests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">Add skills to see personalized matches</p>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/skills/new/learning"}
              className="w-full"
            >
              Add Learning Interests
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
