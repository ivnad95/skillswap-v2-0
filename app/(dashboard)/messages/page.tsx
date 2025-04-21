import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { MessagingInterface } from "@/components/messaging-interface"

export const metadata: Metadata = {
  title: "Messages | SkillSwap",
  description: "Chat with your teachers and students",
}

export default function MessagesPage() {
  return (
    <DashboardShell className="flex-1 p-0">
      <MessagingInterface />
    </DashboardShell>
  )
}
