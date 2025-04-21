import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { ProfileData } from "@/app/(dashboard)/profile/page"

interface Review {
  id?: string | number;
  reviewer?: {
    name?: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  profileData: ProfileData;
}

export function ReviewsSection({ profileData }: ReviewsSectionProps) {
  // Get reviews or use empty array
  const reviews = profileData?.reviews || [] as Review[]
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet.</p>
        <p className="mt-2 text-sm">Reviews will appear here after your sessions.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={review.id || index} className="border border-border/50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={review.reviewer?.avatar} />
                <AvatarFallback>{review.reviewer?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{review.reviewer?.name || "Anonymous"}</h3>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'stroke-current opacity-30'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
