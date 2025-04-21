import { cookies } from "next/headers"
import { createServerDbClient } from "@/lib/db-client"

export async function getServerDbClient(): Promise<ReturnType<typeof createServerDbClient>> {
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()
  return createServerDbClient(cookieString)
}
