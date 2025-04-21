%%{ init: { 'flowchart': { 'curve': 'basis', 'defaultRenderer': 'elk' } } }%%
flowchart TD
    %% Title and Configuration
    title["<b>SkillSwap Application Architecture</b>"]:::title
    title -.- Root

    %% Main Application Structure
    Root[Root Layout] --> AuthProvider[Auth Provider]
    AuthProvider --> ThemeProvider[Theme Provider]
    ThemeProvider --> AppRoutes[App Routes]

    %% App Routes Structure
    AppRoutes --> PublicRoutes[Public Routes]
    AppRoutes --> ProtectedRoutes[Protected Routes]
    AppRoutes --> APIRoutes[API Routes]

    %% Public Routes
    PublicRoutes --> HomePage[Home Page]
    PublicRoutes --> AboutPage[About Page]
    PublicRoutes --> ContactPage[Contact Page]
    PublicRoutes --> FeaturesPage[Features Page]
    PublicRoutes --> PricingPage[Pricing Page]
    PublicRoutes --> LoginPage[Login Page]
    PublicRoutes --> SignupPage[Signup Page]
    PublicRoutes --> VerifyEmailPage[Verify Email Page]

    %% Protected Routes with Dashboard Layout
    ProtectedRoutes --> DashboardLayout[Dashboard Layout]
    DashboardLayout --> DashboardPage[Dashboard Page]
    DashboardLayout --> ExplorePage[Explore Page]
    DashboardLayout --> SessionsPage[Sessions Page]
    DashboardLayout --> MessagesPage[Messages Page]
    DashboardLayout --> CommunityPage[Community Page]
    DashboardLayout --> ProfilePage[Profile Page]
    DashboardLayout --> SettingsPage[Settings Page]
    DashboardLayout --> BillingPage[Billing Page]
    DashboardLayout --> SkillsPage[Skills Page]

    %% Dashboard Page Implementation
    DashboardPage --> DashboardPageClient[Dashboard Page Client]
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
    ProtectedRoutes --> OnboardingLayout[Onboarding Layout]
    OnboardingLayout --> OnboardingPage[Onboarding Page]
    OnboardingPage --> OnboardingComponent[Onboarding Component]
    OnboardingComponent --> OnboardingSteps[Onboarding Steps]

    %% Onboarding Steps
    OnboardingSteps --> WelcomeStep[Welcome Step]
    OnboardingSteps --> PersonalInfoStep[Personal Info Step]
    OnboardingSteps --> SkillsToTeachStep[Skills to Teach Step]
    OnboardingSteps --> SkillsToLearnStep[Skills to Learn Step]
    OnboardingSteps --> AvailabilityStep[Availability Step]
    OnboardingSteps --> ProfilePhotoStep[Profile Photo Step]
    OnboardingSteps --> CompleteStep[Complete Step]

    %% API Routes Structure
    APIRoutes --> AuthAPI[Auth API]
    APIRoutes --> DbAPI[Database API]
    APIRoutes --> ProfileAPI[Profile API]
    APIRoutes --> SkillsAPI[Skills API]
    APIRoutes --> SessionsAPI[Sessions API]
    APIRoutes --> OnboardingAPI[Onboarding API]
    APIRoutes --> AIAPI[AI API]

    %% Auth API Routes
    AuthAPI --> SigninRoute[Signin Route]
    AuthAPI --> SignupRoute[Signup Route]
    AuthAPI --> VerifyRoute[Verify Route]
    AuthAPI --> VerifyEmailRoute[Verify Email Route]
    AuthAPI --> ResetPasswordRoute[Reset Password Route]
    AuthAPI --> UpdatePasswordRoute[Update Password Route]
    AuthAPI --> UserRoute[User Route]

    %% Database API Routes
    DbAPI --> QueryRoute[Query Route]
    DbAPI --> InsertRoute[Insert Route]
    DbAPI --> UpdateRoute[Update Route]
    DbAPI --> DeleteRoute[Delete Route]

    %% Profile API Routes
    ProfileAPI --> ProfileRoute[Profile Route]

    %% Skills API Routes
    SkillsAPI --> SkillsRoute[Skills Route]
    SkillsAPI --> SkillByIdRoute[Skill by ID Route]

    %% Sessions API Routes
    SessionsAPI --> SessionsRoute[Sessions Route]
    SessionsAPI --> SessionByIdRoute[Session by ID Route]

    %% Onboarding API Routes
    OnboardingAPI --> OnboardingCompleteRoute[Onboarding Complete Route]
    OnboardingAPI --> OnboardingStatusRoute[Onboarding Status Route]

    %% AI API Routes
    AIAPI --> AIAssistantRoute[AI Assistant Route]
    AIAPI --> AISkillMatchingRoute[AI Skill Matching Route]
    AIAPI --> AILearningRecommendationsRoute[AI Learning Recommendations Route]

    %% Middleware
    Middleware[Middleware] --> AppRoutes

    %% Context Providers
    AuthContext[Auth Context] --> AuthProvider
    OnboardingContext[Onboarding Context] --> OnboardingComponent

    %% Library Files
    DbLibrary[Database Library] --> DbAPI
    DbClientLibrary[Database Client Library] --> DbAPI
    AuthUtilsLibrary[Auth Utils Library] --> AuthAPI
    AISkillMatchingLibrary[AI Skill Matching Library] --> AIAPI
    UtilsLibrary[Utils Library] --> Components

    %% Hooks
    UseMobileHook[Use Mobile Hook] --> Components
    UseToastHook[Use Toast Hook] --> Components

    %% Main Components
    Components --> UIComponents[UI Components]
    Components --> FeatureComponents[Feature Components]
    Components --> LayoutComponents[Layout Components]

    %% UI Components
    UIComponents --> Button[Button]
    UIComponents --> Card[Card]
    UIComponents --> Input[Input]
    UIComponents --> Avatar[Avatar]
    UIComponents --> Dialog[Dialog]
    UIComponents --> DropdownMenu[Dropdown Menu]
    UIComponents --> Form[Form]
    UIComponents --> Select[Select]
    UIComponents --> Tabs[Tabs]
    UIComponents --> Toast[Toast]
    UIComponents --> Toaster[Toaster]
    UIComponents --> Badge[Badge]
    UIComponents --> Calendar[Calendar]
    UIComponents --> Checkbox[Checkbox]
    UIComponents --> Command[Command]
    UIComponents --> Label[Label]
    UIComponents --> Menubar[Menubar]
    UIComponents --> Popover[Popover]
    UIComponents --> Sheet[Sheet]
    UIComponents --> Textarea[Textarea]
    UIComponents --> Progress[Progress]
    UIComponents --> Alert[Alert]
    UIComponents --> Skeleton[Skeleton]
    UIComponents --> Logo[Logo]
    UIComponents --> Chart[Chart]
    UIComponents --> ThemeToggle[Theme Toggle]

    %% Feature Components
    FeatureComponents --> AIGroup[AI Components]
    AIGroup --> AIAssistant[AI Assistant]
    AIGroup --> AISkillMatchingShowcase[AI Skill Matching Showcase]
    AIGroup --> LearningRecommendations[Learning Recommendations]
    AIGroup --> RecommendedMatches[Recommended Matches]

    FeatureComponents --> ProfileGroup[Profile Components]
    ProfileGroup --> ProfileEditModal[Profile Edit Modal]
    ProfileGroup --> ProfileHeader[Profile Header]
    ProfileGroup --> ProfileStats[Profile Stats]
    ProfileGroup --> UserMenu[User Menu]
    ProfileGroup --> AccountSettings[Account Settings]
    ProfileGroup --> NotificationSettings[Notification Settings]

    FeatureComponents --> SessionGroup[Session Components]
    SessionGroup --> AvailabilityCalendar[Availability Calendar]
    SessionGroup --> SessionHistory[Session History]
    SessionGroup --> UpcomingSession[Upcoming Session]

    FeatureComponents --> SkillGroup[Skill Components]
    SkillGroup --> SkillCard[Skill Card]
    SkillGroup --> SkillShowcase[Skill Showcase]
    SkillGroup --> ExploreSkillCard[Explore Skill Card]
    SkillGroup --> ExploreTeacherCard[Explore Teacher Card]

    FeatureComponents --> CommunicationGroup[Communication Components]
    CommunicationGroup --> MessagingInterface[Messaging Interface]

    FeatureComponents --> PaymentGroup[Payment Components]
    PaymentGroup --> TokenBalance[Token Balance]
    PaymentGroup --> PaymentSettings[Payment Settings]

    %% Layout Components
    LayoutComponents --> MainNav[Main Nav]
    LayoutComponents --> MobileNav[Mobile Nav]
    LayoutComponents --> SidebarNav[Sidebar Nav]
    LayoutComponents --> SiteFooter[Site Footer]
    LayoutComponents --> DashboardHeader[Dashboard Header]
    DashboardHeader --> ThemeToggle
    DashboardHeader --> Sheet
    DashboardHeader --> SidebarNav
    DashboardHeader --> Logo

    LayoutComponents --> DashboardShell[Dashboard Shell]
    DashboardShell --> DashboardHeader

    LayoutComponents --> MarketingComponents[Marketing Components]
    MarketingComponents --> CTASection[CTA Section]
    MarketingComponents --> FeatureSection[Feature Section]
    MarketingComponents --> HeroSection[Hero Section]
    MarketingComponents --> PricingSection[Pricing Section]
    MarketingComponents --> ReviewsSection[Reviews Section]
    MarketingComponents --> TestimonialSection[Testimonial Section]

    %% Style Definitions
    classDef title font-size:24px,fill:none,stroke:none,color:#333;
    classDef primary fill:#4f46e5,stroke:#4338ca,color:white,stroke-width:2px;
    classDef secondary fill:#8b5cf6,stroke:#7c3aed,color:white,stroke-width:2px;
    classDef success fill:#10b981,stroke:#059669,color:white,stroke-width:2px;
    classDef api fill:#14b8a6,stroke:#0d9488,color:white,stroke-width:2px;

    %% Apply Styles
    class title title;
    class Root,AuthProvider,ThemeProvider,AppRoutes primary;
    class PublicRoutes,ProtectedRoutes,APIRoutes secondary;
    class DashboardLayout,DashboardPage,ExplorePage,SessionsPage,MessagesPage,CommunityPage,ProfilePage,SettingsPage,BillingPage,SkillsPage success;
