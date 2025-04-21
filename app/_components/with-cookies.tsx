import { cookies } from "next/headers"
import { createServerDbClient } from "@/lib/db-client"

export async function getServerDbClient() {
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()
  return createServerDbClient(cookieString)
}
