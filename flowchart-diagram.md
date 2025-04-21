```mermaid
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
    
    %% Dashboard Page Implementation
    DashboardPage --> DashboardPageClient[Dashboard Page Client app/(dashboard)/dashboard/DashboardPageClient.tsx]
    DashboardPageClient --> TokenBalance
    DashboardPageClient --> UpcomingSession
    DashboardPageClient --> SkillCard
    DashboardPageClient --> RecommendedMatches
    
    %% Sessions Page Implementation
    SessionsPage --> UpcomingSession
    SessionsPage --> SessionHistory
    SessionsPage --> Calendar
    
    %% Skills Page Implementation
    SkillsPage --> SkillShowcase
    SkillsPage --> Badge
    
    %% Community Page Implementation
    CommunityPage --> Badge
    CommunityPage --> Avatar
    CommunityPage --> Card
    
    %% Onboarding Flow
    ProtectedRoutes --> OnboardingLayout[Onboarding Layout app/onboarding/layout.tsx]
    OnboardingLayout --> OnboardingPage[Onboarding Page app/onboarding/page.tsx]
    OnboardingPage --> OnboardingComponent[Onboarding Component components/onboarding/onboarding-layout.tsx]
    OnboardingComponent --> OnboardingSteps[Onboarding Steps]
    
    %% Onboarding Steps
    OnboardingSteps --> WelcomeStep[Welcome Step components/onboarding/steps/welcome-step.tsx]
    OnboardingSteps --> PersonalInfoStep[Personal Info Step components/onboarding/steps/personal-info-step.tsx]
    OnboardingSteps --> SkillsToTeachStep[Skills to Teach Step components/onboarding/steps/skills-to-teach-step.tsx]
    OnboardingSteps --> SkillsToLearnStep[Skills to Learn Step components/onboarding/steps/skills-to-learn-step.tsx]
    OnboardingSteps --> AvailabilityStep[Availability Step components/onboarding/steps/availability-step.tsx]
    OnboardingSteps --> ProfilePhotoStep[Profile Photo Step components/onboarding/steps/profile-photo-step.tsx]
    OnboardingSteps --> CompleteStep[Complete Step components/onboarding/steps/complete-step.tsx]
    
    %% API Routes Structure
    APIRoutes --> AuthAPI[Auth API]
    APIRoutes --> DbAPI[Database API]
    APIRoutes --> ProfileAPI[Profile API]
    APIRoutes --> SkillsAPI[Skills API]
    APIRoutes --> SessionsAPI[Sessions API]
    APIRoutes --> OnboardingAPI[Onboarding API]
    APIRoutes --> AIAPI[AI API]
    
    %% Auth API Routes
    AuthAPI --> SigninRoute[Signin Route app/api/auth/signin/route.ts]
    AuthAPI --> SignupRoute[Signup Route app/api/auth/signup/route.ts]
    AuthAPI --> VerifyRoute[Verify Route app/api/auth/verify/route.ts]
    AuthAPI --> VerifyEmailRoute[Verify Email Route app/api/auth/verify-email/route.ts]
    AuthAPI --> ResetPasswordRoute[Reset Password Route app/api/auth/reset-password/route.ts]
    AuthAPI --> UpdatePasswordRoute[Update Password Route app/api/auth/update-password/route.ts]
    AuthAPI --> UserRoute[User Route app/api/auth/user/route.ts]
    
    %% Database API Routes
    DbAPI --> QueryRoute[Query Route app/api/db/query/route.ts]
    DbAPI --> InsertRoute[Insert Route app/api/db/insert/route.ts]
    DbAPI --> UpdateRoute[Update Route app/api/db/update/route.ts]
    DbAPI --> DeleteRoute[Delete Route app/api/db/delete/route.ts]
    
    %% Profile API Routes
    ProfileAPI --> ProfileRoute[Profile Route app/api/profile/route.ts]
    
    %% Skills API Routes
    SkillsAPI --> SkillsRoute[Skills Route app/api/skills/route.ts]
    SkillsAPI --> SkillByIdRoute[Skill by ID Route app/api/skills/[id]/route.ts]
    
    %% Sessions API Routes
    SessionsAPI --> SessionsRoute[Sessions Route app/api/sessions/route.ts]
    SessionsAPI --> SessionByIdRoute[Session by ID Route app/api/sessions/[id]/route.ts]
    
    %% Onboarding API Routes
    OnboardingAPI --> OnboardingCompleteRoute[Onboarding Complete Route app/api/onboarding/complete/route.ts]
    OnboardingAPI --> OnboardingStatusRoute[Onboarding Status Route app/api/onboarding/status/route.ts]
    
    %% AI API Routes
    AIAPI --> AIAssistantRoute[AI Assistant Route app/api/ai-assistant/route.ts]
    AIAPI --> AISkillMatchingRoute[AI Skill Matching Route app/api/ai-skill-matching/route.ts]
    AIAPI --> AILearningRecommendationsRoute[AI Learning Recommendations Route app/api/ai-learning-recommendations/route.ts]
    
    %% Middleware
    Middleware[Middleware middleware.ts] --> AppRoutes
    
    %% Context Providers
    AuthContext[Auth Context contexts/auth-context.tsx] --> AuthProvider
    OnboardingContext[Onboarding Context contexts/onboarding-context.tsx] --> OnboardingComponent
    
    %% Library Files
    DbLibrary[Database Library lib/db.ts] --> DbAPI
    DbClientLibrary[Database Client Library lib/db-client.ts] --> DbAPI
    AuthUtilsLibrary[Auth Utils Library lib/auth-utils.ts] --> AuthAPI
    AISkillMatchingLibrary[AI Skill Matching Library lib/ai-skill-matching.ts] --> AIAPI
    UtilsLibrary[Utils Library lib/utils.ts] --> Components
    
    %% Hooks
    UseMobileHook[Use Mobile Hook hooks/use-mobile.tsx] --> Components
    UseToastHook[Use Toast Hook hooks/use-toast.ts] --> Components
    
    %% Main Components
    Components --> UIComponents[UI Components]
    Components --> FeatureComponents[Feature Components]
    Components --> LayoutComponents[Layout Components]
    
    %% UI Components
    UIComponents --> Button[Button components/ui/button.tsx]
    UIComponents --> Card[Card components/ui/card.tsx]
    UIComponents --> Input[Input components/ui/input.tsx]
    UIComponents --> Avatar[Avatar components/ui/avatar.tsx]
    UIComponents --> Dialog[Dialog components/ui/dialog.tsx]
    UIComponents --> DropdownMenu[Dropdown Menu components/ui/dropdown-menu.tsx]
    UIComponents --> Form[Form components/ui/form.tsx]
    UIComponents --> Select[Select components/ui/select.tsx]
    UIComponents --> Tabs[Tabs components/ui/tabs.tsx]
    UIComponents --> Toast[Toast components/ui/toast.tsx]
    UIComponents --> Toaster[Toaster components/ui/toaster.tsx]
    UIComponents --> Badge[Badge components/ui/badge.tsx]
    UIComponents --> Calendar[Calendar components/ui/calendar.tsx]
    UIComponents --> Checkbox[Checkbox components/ui/checkbox.tsx]
    UIComponents --> Command[Command components/ui/command.tsx]
    UIComponents --> Label[Label components/ui/label.tsx]
    UIComponents --> Menubar[Menubar components/ui/menubar.tsx]
    UIComponents --> Popover[Popover components/ui/popover.tsx]
    UIComponents --> Sheet[Sheet components/ui/sheet.tsx]
    UIComponents --> Textarea[Textarea components/ui/textarea.tsx]
    UIComponents --> Progress[Progress components/ui/progress.tsx]
    UIComponents --> Alert[Alert components/ui/alert.tsx]
    UIComponents --> Skeleton[Skeleton components/ui/skeleton.tsx]
    UIComponents --> Logo[Logo components/ui/logo.tsx]
    UIComponents --> Chart[Chart components/ui/chart.tsx]
    UIComponents --> ThemeToggle[Theme Toggle components/theme-toggle.tsx]
    
    %% Feature Components
    FeatureComponents --> AIGroup[AI Components]
    AIGroup --> AIAssistant[AI Assistant components/ai-assistant.tsx]
    AIGroup --> AISkillMatchingShowcase[AI Skill Matching Showcase components/ai-skill-matching-showcase.tsx]
    AIGroup --> LearningRecommendations[Learning Recommendations components/learning-recommendations.tsx]
    AIGroup --> RecommendedMatches[Recommended Matches components/recommended-matches.tsx]
    
    FeatureComponents --> ProfileGroup[Profile Components]
    ProfileGroup --> ProfileEditModal[Profile Edit Modal components/profile-edit-modal.tsx]
    ProfileGroup --> ProfileHeader[Profile Header components/profile-header.tsx]
    ProfileGroup --> ProfileStats[Profile Stats components/profile-stats.tsx]
    ProfileGroup --> UserMenu[User Menu components/user-menu.tsx]
    ProfileGroup --> AccountSettings[Account Settings components/account-settings.tsx]
    ProfileGroup --> NotificationSettings[Notification Settings components/notification-settings.tsx]
    
    FeatureComponents --> SessionGroup[Session Components]
    SessionGroup --> AvailabilityCalendar[Availability Calendar components/availability-calendar.tsx]
    SessionGroup --> SessionHistory[Session History components/session-history.tsx]
    SessionGroup --> UpcomingSession[Upcoming Session components/upcoming-session.tsx]
    
    FeatureComponents --> SkillGroup[Skill Components]
    SkillGroup --> SkillCard[Skill Card components/skill-card.tsx]
    SkillGroup --> SkillShowcase[Skill Showcase components/skill-showcase.tsx]
    SkillGroup --> ExploreSkillCard[Explore Skill Card components/explore-skill-card.tsx]
    SkillGroup --> ExploreTeacherCard[Explore Teacher Card components/explore-teacher-card.tsx]
    
    FeatureComponents --> CommunicationGroup[Communication Components]
    CommunicationGroup --> MessagingInterface[Messaging Interface components/messaging-interface.tsx]
    
    FeatureComponents --> PaymentGroup[Payment Components]
    PaymentGroup --> TokenBalance[Token Balance components/token-balance.tsx]
    PaymentGroup --> PaymentSettings[Payment Settings components/payment-settings.tsx]
    
    %% Layout Components
    LayoutComponents --> MainNav[Main Nav components/main-nav.tsx]
    LayoutComponents --> MobileNav[Mobile Nav components/mobile-nav.tsx]
    LayoutComponents --> SidebarNav[Sidebar Nav components/sidebar-nav.tsx]
    LayoutComponents --> SiteFooter[Site Footer components/site-footer.tsx]
    LayoutComponents --> DashboardHeader[Dashboard Header components/dashboard-header.tsx]
    DashboardHeader --> ThemeToggle
    DashboardHeader --> Sheet
    DashboardHeader --> SidebarNav
    DashboardHeader --> Logo
    
    LayoutComponents --> DashboardShell[Dashboard Shell components/dashboard-shell.tsx]
    DashboardShell --> DashboardHeader
    
    LayoutComponents --> MarketingComponents[Marketing Components]
    MarketingComponents --> CTASection[CTA Section components/cta-section.tsx]
    MarketingComponents --> FeatureSection[Feature Section components/feature-section.tsx]
    MarketingComponents --> HeroSection[Hero Section components/hero-section.tsx]
    MarketingComponents --> PricingSection[Pricing Section components/pricing-section.tsx]
    MarketingComponents --> ReviewsSection[Reviews Section components/reviews-section.tsx]
    MarketingComponents --> TestimonialSection[Testimonial Section components/testimonial-section.tsx]
    
    %% Component Relationships
    UpcomingSession --> Avatar
    UpcomingSession --> Button
    
    SessionHistory --> Card
    SessionHistory --> Avatar
    SessionHistory --> Badge
    
    SkillShowcase --> Card
    SkillShowcase --> Progress
    SkillShowcase --> Badge
    SkillShowcase --> Tabs
    
    DashboardShell --> Card
    
    ExploreSkillCard --> Card
    ExploreSkillCard --> Badge
    
    ExploreTeacherCard --> Badge
    
    %% Database Schema
    Database[(Database)] --> Users[(Users Table)]
    Database --> Profiles[(Profiles Table)]
    Database --> Skills[(Skills Table)]
    Database --> Sessions[(Sessions Table)]
    Database --> Transactions[(Transactions Table)]
    Database --> Ratings[(Ratings Table)]
    Database --> Communities[(Communities Table)]
    Database --> CommunityPosts[(Community Posts Table)]
    Database --> EmailVerificationTokens[(Email Verification Tokens Table)]
    Database --> PasswordResetTokens[(Password Reset Tokens Table)]
    
    %% Database Relationships
    Users -->|1:1| Profiles
    Users -->|1:N| Skills
    Users -->|1:N| Sessions
    Users -->|1:N| Transactions
    Users -->|1:N| Ratings
    Users -->|1:N| Communities
    Skills -->|1:N| Sessions
    Sessions -->|1:N| Ratings
    Sessions -->|1:N| Transactions
    Communities -->|1:N| CommunityPosts
    Users -->|1:N| EmailVerificationTokens
    Users -->|1:N| PasswordResetTokens
    
    %% API to Database Connections
    DbAPI <--> Database
    AuthAPI <--> Users
    AuthAPI <--> EmailVerificationTokens
    AuthAPI <--> PasswordResetTokens
    ProfileAPI <--> Profiles
    SkillsAPI <--> Skills
    SessionsAPI <--> Sessions
    SessionsAPI <--> Transactions
    
    %% AI Integration
    AIAPI -->|Groq LLM| AIModels[AI Models]
    AIAssistant --> AIAssistantRoute
    AISkillMatchingShowcase --> AISkillMatchingRoute
    LearningRecommendations --> AILearningRecommendationsRoute
    
    %% Authentication Flow
    LoginPage --> SigninRoute
    SignupPage --> SignupRoute
    SigninRoute --> JWT[JWT Token Generation]
    SignupRoute --> JWT
    JWT --> AuthCookie[Set Auth Cookie]
    AuthCookie --> Middleware
    Middleware -->|Verify Auth| ProtectedRoutes
    
    %% Onboarding Flow
    CompleteStep --> OnboardingCompleteRoute
    OnboardingCompleteRoute --> Profiles
    
    %% Token System
    SessionsAPI -->|Teaching| EarnTokens[Earn Tokens]
    SessionsAPI -->|Learning| SpendTokens[Spend Tokens]
    EarnTokens --> Transactions
    SpendTokens --> Transactions
    Transactions --> TokenBalance
    
    %% Style Definitions
    classDef primary fill:#4f46e5,stroke:#4338ca,color:white;
    classDef secondary fill:#8b5cf6,stroke:#7c3aed,color:white;
    classDef success fill:#10b981,stroke:#059669,color:white;
    classDef danger fill:#ef4444,stroke:#dc2626,color:white;
    classDef warning fill:#f59e0b,stroke:#d97706,color:white;
    classDef info fill:#3b82f6,stroke:#2563eb,color:white;
    classDef database fill:#6b7280,stroke:#4b5563,color:white;
    classDef component fill:#ec4899,stroke:#db2777,color:white;
    classDef api fill:#14b8a6,stroke:#0d9488,color:white;
    classDef layout fill:#f97316,stroke:#ea580c,color:white;
    classDef uicomponent fill:#ec4899,stroke:#db2777,color:white;
    classDef featurecomponent fill:#8b5cf6,stroke:#7c3aed,color:white;
    classDef layoutcomponent fill:#f97316,stroke:#ea580c,color:white;
    
    %% Apply Styles
    class Root,AuthProvider,ThemeProvider,AppRoutes,Middleware primary;
    class PublicRoutes,ProtectedRoutes,APIRoutes,AuthContext,OnboardingContext secondary;
    class HomePage,AboutPage,ContactPage,FeaturesPage,PricingPage,LoginPage,SignupPage,VerifyEmailPage info;
    class DashboardLayout,DashboardPage,ExplorePage,SessionsPage,MessagesPage,CommunityPage,ProfilePage,SettingsPage,BillingPage,SkillsPage layout;
    class OnboardingLayout,OnboardingPage,OnboardingComponent,OnboardingSteps,WelcomeStep,PersonalInfoStep,SkillsToTeachStep,SkillsToLearnStep,AvailabilityStep,ProfilePhotoStep,CompleteStep success;
    class AuthAPI,DbAPI,ProfileAPI,SkillsAPI,SessionsAPI,OnboardingAPI,AIAPI api;
    class SigninRoute,SignupRoute,VerifyRoute,VerifyEmailRoute,ResetPasswordRoute,UpdatePasswordRoute,UserRoute,QueryRoute,InsertRoute,UpdateRoute,DeleteRoute,ProfileRoute,SkillsRoute,SkillByIdRoute,SessionsRoute,SessionByIdRoute,OnboardingCompleteRoute,OnboardingStatusRoute,AIAssistantRoute,AISkillMatchingRoute,AILearningRecommendationsRoute api;
    class Database,Users,Profiles,Skills,Sessions,Transactions,Ratings,Communities,CommunityPosts,EmailVerificationTokens,PasswordResetTokens database;
    class UIComponents,FeatureComponents,LayoutComponents,Components secondary;
    
    %% UI Components
    class Button,Card,Input,Avatar,Dialog,DropdownMenu,Form,Select,Tabs,Toast,Toaster,Badge,Calendar,Checkbox,Command,Label,Menubar,Popover,Sheet,Textarea,Progress,Alert,Skeleton,Logo,Chart,ThemeToggle uicomponent;
    
    %% Feature Components
    class AIGroup,ProfileGroup,SessionGroup,SkillGroup,CommunicationGroup,PaymentGroup,MarketingComponents featurecomponent;
    class AIAssistant,AISkillMatchingShowcase,LearningRecommendations,RecommendedMatches featurecomponent;
    class ProfileEditModal,ProfileHeader,ProfileStats,UserMenu,AccountSettings,NotificationSettings featurecomponent;
    class AvailabilityCalendar,SessionHistory,UpcomingSession featurecomponent;
    class SkillCard,SkillShowcase,ExploreSkillCard,ExploreTeacherCard featurecomponent;
    class MessagingInterface featurecomponent;
    class TokenBalance,PaymentSettings featurecomponent;
    
    %% Layout Components
    class MainNav,MobileNav,SidebarNav,SiteFooter,DashboardHeader,DashboardShell layoutcomponent;
    class CTASection,FeatureSection,HeroSection,PricingSection,ReviewsSection,TestimonialSection layoutcomponent;
    
    %% Auth and Token Flow
    class JWT,AuthCookie,EarnTokens,SpendTokens warning;
    class DashboardPageClient,AIModels primary;
```
