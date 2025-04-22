import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Removed unused createBrowserDbClient import

// Define which routes require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/explore",
  "/sessions",
  "/messages",
  "/community",
  "/settings",
  "/billing",
  "/skills",
]

// Define routes that bypass onboarding check
const bypassOnboardingRoutes = [
  "/onboarding",
  "/api",
]

// Define which routes are only accessible to non-authenticated users
const authRoutes = ["/login", "/signup", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Check if the route is auth-only (login/signup)
  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // If it's not a protected or auth route, allow the request
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Extract auth token directly from cookies
  const cookieHeader = request.headers.get("cookie") || ""
  const authToken = cookieHeader.split(';')
    .map((cookie: string) => cookie.trim().split('=')) // Add type for 'cookie'
    .find(([key]: string[]) => key === 'auth-token')?.[1] // Changed type from [string] to string[]

  // Check if the user is authenticated
  let hasSession = false

  // In middleware, we can't use jwt.verify because it uses Node.js crypto
  // Instead, we'll just check if the token exists
  // The actual verification will happen in the API routes
  hasSession = !!authToken

  // If there's no session and the route is protected, redirect to login
  if (!hasSession && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname + search)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the route is auth-only (e.g., /login, /signup),
  // redirect the user to the dashboard as they are already authenticated.
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check if the user needs to complete onboarding
  if (hasSession && isProtectedRoute) {
    // Skip onboarding check for certain routes
    const shouldBypassOnboarding = bypassOnboardingRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (!shouldBypassOnboarding) {
      // Check if the user has completed onboarding
      const onboardingCompleted = request.cookies.get('onboarding-completed')?.value === 'true'

      // If onboarding is not completed, redirect to onboarding
      if (!onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    }
  }

  // Otherwise, allow the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    // Removed '/protected/:path*' matcher as the corresponding logic was removed
  ],
}
