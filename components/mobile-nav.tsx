"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  // Determine if we're in the app section (authenticated) or public section
  const isAppSection =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/skills") ||
    pathname.startsWith("/sessions") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/billing")

  // Only show public navigation when not in app sections
  if (isAppSection) return null

  return (
    <div className="md:hidden flex h-16 items-center px-4 border-b border-border/40">
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md" />
            <span className="font-bold text-xl">SkillSwap</span>
          </Link>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="pr-0">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <div className="h-6 w-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-md" />
              <span className="font-bold text-xl">SkillSwap</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "px-2 py-1 text-lg",
                pathname === "/" ? "text-foreground font-medium" : "text-foreground/60",
              )}
            >
              Home
            </Link>
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className={cn(
                "px-2 py-1 text-lg",
                pathname === "/features" ? "text-foreground font-medium" : "text-foreground/60",
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className={cn(
                "px-2 py-1 text-lg",
                pathname === "/pricing" ? "text-foreground font-medium" : "text-foreground/60",
              )}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={cn(
                "px-2 py-1 text-lg",
                pathname === "/about" ? "text-foreground font-medium" : "text-foreground/60",
              )}
            >
              About
            </Link>
            <div className="pt-4 space-y-4">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  Go to App
                </Button>
              </Link>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
