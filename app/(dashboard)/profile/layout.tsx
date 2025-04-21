import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Profile | SkillSwap",
  description: "View and manage your SkillSwap profile",
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children
}
