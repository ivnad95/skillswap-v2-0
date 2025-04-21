import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProfileStats() {
  const stats = [
    { rating: 5, count: 24, percentage: 80 },
    { rating: 4, count: 5, percentage: 16.7 },
    { rating: 3, count: 1, percentage: 3.3 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 },
  ]

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Rating Summary */}
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Rating Summary</h3>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.rating} className="flex items-center gap-2">
                  <div className="w-12 text-sm font-medium">{stat.rating} stars</div>
                  <Progress value={stat.percentage} className="h-2 flex-1" />
                  <div className="w-12 text-sm text-right text-muted-foreground">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Stats */}
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">Teaching Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold">32</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">18</div>
                <div className="text-sm text-muted-foreground">Students Taught</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">64</div>
                <div className="text-sm text-muted-foreground">Hours Taught</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
