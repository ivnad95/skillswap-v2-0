"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isLoggedIn = !!user

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link
        href="/features"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/features" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Features
      </Link>
      <Link
        href="/pricing"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/pricing" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Pricing
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/about" ? "text-primary" : "text-muted-foreground",
        )}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/contact" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Contact
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
