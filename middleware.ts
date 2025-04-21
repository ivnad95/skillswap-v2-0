import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createBrowserDbClient } from '@/lib/db-client';

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
    .map(cookie => cookie.trim().split('='))
    .find(([key]) => key === 'auth-token')?.[1]

  console.log('Auth token from cookies:', authToken ? 'Found' : 'Not found')

  // Check if the user is authenticated
  let hasSession = false

  // In middleware, we can't use jwt.verify because it uses Node.js crypto
  // Instead, we'll just check if the token exists
  // The actual verification will happen in the API routes
  hasSession = !!authToken
  console.log('Session status based on token presence:', hasSession ? 'Authenticated' : 'Not authenticated')

  // If there's no session and the route is protected, redirect to login
  if (!hasSession && isProtectedRoute) {
    console.log('No session, redirecting to login from:', pathname)
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname + search)
    console.log('Redirect URL:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the route is auth-only, redirect to dashboard or onboarding
  if (hasSession && isAuthRoute) {
    // Check if there's a redirect parameter in the URL
    const url = new URL(request.url)
    const redirectTo = url.searchParams.get("redirect")

    if (redirectTo) {
      // Redirect to the specified path
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    // Check if the user has completed onboarding
    // We'll use a cookie to track onboarding status in the middleware
    // The actual check happens in the API routes
    const onboardingCompleted = request.cookies.get('onboarding-completed')?.value === 'true'

    // If onboarding is not completed, redirect to onboarding
    if (!onboardingCompleted && isProtectedRoute) {
      console.log('Onboarding not completed, redirecting to onboarding')
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    // Default redirect to dashboard
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
        console.log('Onboarding not completed, redirecting to onboarding')
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    }
  }

  // Get the auth cookie header
  const authCookie = request.headers.get('cookie') || '';
  
  // For protected routes, check authentication
  if (request.nextUrl.pathname.startsWith('/protected')) {
    try {
      const { auth } = createBrowserDbClient(authCookie);
      const { data: user } = await auth.getUser();
      
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
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
    '/protected/:path*'
  ],
}
