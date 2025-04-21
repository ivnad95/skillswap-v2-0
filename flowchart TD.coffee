flowchart TD
    %% Main Application Structure
    Root[Root Layout app/layout.tsx] --> AuthProvider[Auth Provider]
    AuthProvider --> ThemeProvider[Theme Provider]
    ThemeProvider --> AppRoutes[App Routes]
    
    %% App Routes Structure
    AppRoutes --> PublicRoutes[Public Routes]
    AppRoutes --> ProtectedRoutes[Protected Routes]
    AppRoutes --> APIRoutes[API Routes]
    
    %% Public Routes
    PublicRoutes --> HomePage[Home Page app/page.tsx]
    PublicRoutes --> AboutPage[About Page app/about/page.tsx]
    PublicRoutes --> ContactPage[Contact Page app/contact/page.tsx]
    PublicRoutes --> FeaturesPage[Features Page app/features/page.tsx]
    PublicRoutes --> PricingPage[Pricing Page app/pricing/page.tsx]
    PublicRoutes --> LoginPage[Login Page app/login/page.tsx]
    PublicRoutes --> SignupPage[Signup Page app/signup/page.tsx]
    PublicRoutes --> VerifyEmailPage[Verify Email Page app/verify-email/page.tsx]
    
    %% Protected Routes with Dashboard Layout
    ProtectedRoutes --> DashboardLayout[Dashboard Layout app/(dashboard)/layout.tsx]
    DashboardLayout --> DashboardPage[Dashboard Page app/(dashboard)/dashboard/page.tsx]
    DashboardLayout --> ExplorePage[Explore Page app/(dashboard)/explore/page.tsx]
    DashboardLayout --> SessionsPage[Sessions Page app/(dashboard)/sessions/page.tsx]
    DashboardLayout --> MessagesPage[Messages Page app/(dashboard)/messages/page.tsx]
    DashboardLayout --> CommunityPage[Community Page app/(dashboard)/community/page.tsx]
    DashboardLayout --> ProfilePage[Profile Page app/(dashboard)/profile/page.tsx]
    DashboardLayout --> SettingsPage[Settings Page app/(dashboard)/settings/page.tsx]
    DashboardLayout --> BillingPage[Billing Page app/(dashboard)/billing/page.tsx]
    DashboardLayout --> SkillsPage[Skills Page app/(dashboard)/skills/page.tsx]