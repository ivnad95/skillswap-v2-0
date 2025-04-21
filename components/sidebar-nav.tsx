"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  Calendar,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon?: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const defaultItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/explore",
      title: "Explore Skills",
      icon: <Lightbulb className="mr-2 h-4 w-4" />,
    },
    {
      href: "/sessions",
      title: "Sessions",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      href: "/messages",
      title: "Messages",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      href: "/community",
      title: "Community",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/billing",
      title: "Billing",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  const navItems = items || defaultItems

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent/5",
            pathname === item.href || pathname.startsWith(`${item.href}/`)
              ? "bg-primary/10 border-l-2 border-primary pl-[10px] metallic-text font-medium"
              : "text-foreground/80 hover:text-foreground border-l-2 border-transparent pl-[10px]",
            "group animate-fade-in",
          )}
        >
          {item.icon}
          <span className="transition-all duration-300">{item.title}</span>
        </Link>
      ))}
      <div className="mt-6 pt-6 border-t border-border/20">
        <Link
          href="#"
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent/5 text-foreground/70 hover:text-foreground border-l-2 border-transparent pl-[10px]",
            "group animate-fade-in",
          )}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span className="transition-all duration-300">Help & Support</span>
        </Link>
      </div>
    </nav>
  )
}
