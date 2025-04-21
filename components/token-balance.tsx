import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TokenBalanceProps {
  tokens: number
}

export function TokenBalance({ tokens }: TokenBalanceProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-background/50 backdrop-blur-sm px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
          <span className="text-xs font-bold text-white">S</span>
        </div>
        <span className="font-semibold text-foreground">{tokens} tokens</span>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Add tokens</span>
      </Button>
    </div>
  )
}
