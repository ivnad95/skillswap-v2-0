flowchart TD
    %% Styles
    classDef page fill:#f9f,stroke:#333,stroke-width:2px;
    classDef component fill:#ccf,stroke:#333,stroke-width:1px;
    classDef api fill:#cfc,stroke:#333,stroke-width:1px;
    classDef context fill:#ffc,stroke:#333,stroke-width:1px;
    classDef middleware fill:#fcc,stroke:#333,stroke-width:1px;
    classDef decision fill:#eee,stroke:#333,stroke-width:1px,shape:diamond;
    classDef db fill:#eef,stroke:#333,stroke-width:1px;
    classDef cookie fill:#ddf,stroke:#333,stroke-width:1px;

    %% Entry & Public Pages
    subgraph Public Area
        Start[User Visits Site] --> LandingPage[app/page.tsx]; class LandingPage page;
        LandingPage -- Click 'Get Started'/'Login Link' --> CheckAuthMiddleware{Middleware Check}; class CheckAuthMiddleware middleware;
        LandingPage -- Click 'Learn More' --> FeaturesPage[app/features/page.tsx]; class FeaturesPage page;
        LandingPage -- Footer Links --> PricingPage[app/pricing/page.tsx]; class PricingPage page;
        LandingPage -- Footer Links --> AboutPage[app/about/page.tsx]; class AboutPage page;
        LandingPage -- Footer Links --> ContactPage[app/contact/page.tsx]; class ContactPage page;
    end

    %% Middleware & Auth Checks
    subgraph Middleware Logic
        CheckAuthMiddleware -- Request --> IsProtectedRoute{Is Protected Route?}; class IsProtectedRoute decision;
        IsProtectedRoute -- No --> IsAuthRoute{Is Auth Route?}; class IsAuthRoute decision;
        IsAuthRoute -- No --> AllowRequest[Allow Request];
        
        IsProtectedRoute -- Yes --> CheckToken{Has auth-token cookie?}; class CheckToken decision;
        CheckToken -- No --> RedirectToLogin[Redirect to /login?redirect=...];
        CheckToken -- Yes --> CheckOnboardingCookie{Has onboarding-completed cookie?}; class CheckOnboardingCookie decision;
        CheckOnboardingCookie -- No --> RedirectToOnboarding[Redirect to /onboarding];
        CheckOnboardingCookie -- Yes --> AllowProtectedRoute[Allow Access to Protected Route];

        IsAuthRoute -- Yes --> CheckTokenAuth{Has auth-token cookie?}; class CheckTokenAuth decision;
        CheckTokenAuth -- Yes --> RedirectToDashboard[Redirect to /dashboard];
        CheckTokenAuth -- No --> AllowAuthRoute[Allow Access to Login/Signup];
    end

    %% Authentication Flow
    subgraph Authentication
        AllowAuthRoute --> LoginPage[app/login/page.tsx]; class LoginPage page;
        AllowAuthRoute --> SignupPage[app/signup/page.tsx]; class SignupPage page;
        AllowAuthRoute --> ForgotPasswordPage[app/forgot-password/page.tsx]; class ForgotPasswordPage page; %% Assuming this exists based on link

        RedirectToLogin --> LoginPage;

        LoginPage -- Submit Form --> AuthContextSignIn[AuthContext.signIn]; class AuthContextSignIn context;
        AuthContextSignIn -- API Call --> SignInAPI[api/auth/signin]; class SignInAPI api;
        SignInAPI -- Validate Credentials --> DBCheck1[DB Check]; class DBCheck1 db;
        SignInAPI -- On Success --> GenerateToken[Generate Token];
        GenerateToken --> AuthToken[auth-token]; class AuthToken cookie;
        SignInAPI -- Return User/Token --> AuthContextSignIn;
        AuthContextSignIn -- On API Success --> SetStateAndCookie[Set User State & auth-token Cookie];
        SetStateAndCookie --> CheckOnboardingStatus[API Call: Check Onboarding Status];
        CheckOnboardingStatus --> OnboardingStatusAPI[api/onboarding/status]; class OnboardingStatusAPI api;
        OnboardingStatusAPI -- Check DB --> DBCheck2[DB Check]; class DBCheck2 db;
        OnboardingStatusAPI -- Return Status --> AuthContextSignIn;
        AuthContextSignIn -- Handle Status --> OnboardingCompleteCheck{Onboarding Complete?}; class OnboardingCompleteCheck decision;
        OnboardingCompleteCheck -- Yes --> RedirectToTarget[Redirect to /dashboard or original target];
        OnboardingCompleteCheck -- No --> ForceRedirectOnboarding[window.location = /onboarding];

        SignupPage -- Submit Form --> AuthContextSignUp[AuthContext.signUp]; class AuthContextSignUp context;
        AuthContextSignUp -- API Call --> SignUpAPI[api/auth/signup]; class SignUpAPI api;
        SignUpAPI -- Create User --> DBCheck3[DB Check]; class DBCheck3 db;
        SignUpAPI -- Return Result --> AuthContextSignUp;
        AuthContextSignUp -- Handle Result --> NeedsVerificationCheck{Needs Email Verification?}; class NeedsVerificationCheck decision;
        NeedsVerificationCheck -- Yes --> RedirectToVerifyEmail[Redirect to /verify-email];
        NeedsVerificationCheck -- No --> RedirectToLoginAfterSignup[Redirect to /login];

        RedirectToVerifyEmail --> VerifyEmailPage[app/verify-email/page.tsx]; class VerifyEmailPage page;
        VerifyEmailPage -- Extract Token/Type --> VerifyLogic[Verify Logic];
        VerifyLogic -- Call DB Client --> VerifyOtp[DBClient.auth.verifyOtp]; class VerifyOtp db;
        VerifyOtp -- Success? --> VerifySuccessCheck{Success?}; class VerifySuccessCheck decision;
        VerifySuccessCheck -- Yes --> VerifyTypeCheck{Type == 'signup'?}; class VerifyTypeCheck decision;
        VerifySuccessCheck -- No --> ShowVerifyError[Show Error];
        VerifyTypeCheck -- Yes --> RedirectToOnboardingAfterVerify[Redirect to /onboarding (after delay)];
        VerifyTypeCheck -- No --> RedirectToLoginAfterVerify[Redirect to /login (after delay)];

        %% SignOut Flow
        UserMenu --> SignOutClick{Click Sign Out}; class SignOutClick decision;
        SignOutClick -- Yes --> AuthContextSignOut[AuthContext.signOut]; class AuthContextSignOut context;
        AuthContextSignOut -- Remove Cookies --> Cookies[auth-token, onboarding-completed]; class Cookies cookie;
        AuthContextSignOut -- Clear User State --> AuthContextSignOut;
        AuthContextSignOut -- Redirect --> LandingPage;
    end

    %% Onboarding Flow
    subgraph Onboarding
        RedirectToOnboarding --> OnboardingPage[app/onboarding/page.tsx]; class OnboardingPage page;
        ForceRedirectOnboarding --> OnboardingPage;
        RedirectToOnboardingAfterVerify --> OnboardingPage;

        OnboardingPage --> OnboardingLayout[components/onboarding/onboarding-layout.tsx]; class OnboardingLayout component;
        OnboardingLayout --> OnboardingProvider[OnboardingProvider]; class OnboardingProvider context;
        OnboardingProvider --> OnboardingProgress[OnboardingProgress]; class OnboardingProgress component;
        OnboardingProvider --> RenderStep{Render Current Step}; class RenderStep decision;

        RenderStep -- welcome --> WelcomeStep[WelcomeStep]; class WelcomeStep component;
        RenderStep -- personal-info --> PersonalInfoStep[PersonalInfoStep]; class PersonalInfoStep component;
        RenderStep -- skills-to-teach --> SkillsToTeachStep[SkillsToTeachStep]; class SkillsToTeachStep component;
        RenderStep -- skills-to-learn --> SkillsToLearnStep[SkillsToLearnStep]; class SkillsToLearnStep component;
        RenderStep -- availability --> AvailabilityStep[AvailabilityStep]; class AvailabilityStep component;
        RenderStep -- profile-photo --> ProfilePhotoStep[ProfilePhotoStep]; class ProfilePhotoStep component;
        RenderStep -- complete --> CompleteStep[CompleteStep]; class CompleteStep component;

        WelcomeStep -- Click Next --> OnboardingContextNext[OnboardingContext.goToNextStep]; class OnboardingContextNext context;
        PersonalInfoStep -- Click Next/Prev --> OnboardingContextNext;
        PersonalInfoStep -- Update Data --> OnboardingContextUpdate[OnboardingContext.updateOnboardingData]; class OnboardingContextUpdate context;
        SkillsToTeachStep -- Click Next/Prev --> OnboardingContextNext;
        SkillsToTeachStep -- Update Data --> OnboardingContextUpdate;
        SkillsToLearnStep -- Click Next/Prev --> OnboardingContextNext;
        SkillsToLearnStep -- Update Data --> OnboardingContextUpdate;
        AvailabilityStep -- Click Next/Prev --> OnboardingContextNext;
        AvailabilityStep -- Update Data --> OnboardingContextUpdate;
        ProfilePhotoStep -- Click Next/Prev --> OnboardingContextNext;
        ProfilePhotoStep -- Update Data --> OnboardingContextUpdate;

        CompleteStep -- useEffect --> OnboardingContextComplete[OnboardingContext.completeOnboarding]; class OnboardingContextComplete context;
        OnboardingContextComplete -- API Call --> CompleteOnboardingAPI[api/onboarding/complete]; class CompleteOnboardingAPI api;
        CompleteOnboardingAPI -- Update DB --> DBCheck4[DB Check]; class DBCheck4 db;
        CompleteOnboardingAPI -- On Success --> OnboardingContextComplete;
        OnboardingContextComplete -- On API Success --> SetOnboardingCookie[Set onboarding-completed Cookie]; class SetOnboardingCookie cookie;
        SetOnboardingCookie --> RedirectToDashboardComplete[window.location = /dashboard];
    end

    %% Authenticated Dashboard Area
    subgraph Dashboard Area
        AllowProtectedRoute --> DashboardLayout[app/(dashboard)/layout.tsx]; class DashboardLayout component;
        RedirectToDashboard --> DashboardLayout;
        RedirectToTarget --> DashboardLayout; %% Assuming target is within dashboard
        RedirectToDashboardComplete --> DashboardLayout;

        DashboardLayout --> DashboardHeader[Header Nav]; class DashboardHeader component;
        DashboardLayout --> UserMenu[components/user-menu.tsx]; class UserMenu component;
        DashboardLayout --> RenderChildPage[Render Child Page];

        DashboardHeader -- Link Click --> DashboardPage[app/(dashboard)/dashboard/page.tsx]; class DashboardPage page;
        DashboardHeader -- Link Click --> ExplorePage[app/(dashboard)/explore/page.tsx]; class ExplorePage page;
        DashboardHeader -- Link Click --> SessionsPage[app/(dashboard)/sessions/page.tsx]; class SessionsPage page;
        DashboardHeader -- Link Click --> MessagesPage[app/(dashboard)/messages/page.tsx]; class MessagesPage page;

        UserMenu -- Link Click --> ProfilePage[app/(dashboard)/profile/page.tsx]; class ProfilePage page;
        UserMenu -- Link Click --> SettingsPage[app/(dashboard)/settings/page.tsx]; class SettingsPage page;

        RenderChildPage --> DashboardPage;
        DashboardPage -- Fetch User Data --> FetchUserData[Fetch User Data (Mocked)];
        DashboardPage --> DashboardPageClient[DashboardPageClient.tsx]; class DashboardPageClient component;
        DashboardPageClient --> TokenBalance[TokenBalance]; class TokenBalance component;
        DashboardPageClient --> UpcomingSessionComp[UpcomingSession]; class UpcomingSessionComp component;
        DashboardPageClient --> SkillCardComp[SkillCard]; class SkillCardComp component;
        DashboardPageClient --> RecommendedMatches[RecommendedMatches]; class RecommendedMatches component;
        DashboardPageClient --> AIAssistant[AIAssistant]; class AIAssistant component;
        DashboardPageClient -- Button Click --> ProfilePage;
        DashboardPageClient -- Button Click --> SkillsPage[app/(dashboard)/skills/page.tsx]; class SkillsPage page;
        DashboardPageClient -- Button Click --> ExplorePage;

        RenderChildPage --> ExplorePage;
        ExplorePage -- Fetch Skills/Teachers --> ExploreDataFetch[getSkills/getTeachers (Mocked)];
        ExplorePage --> ExploreSkillCard[ExploreSkillCard]; class ExploreSkillCard component;
        ExplorePage --> ExploreTeacherCard[ExploreTeacherCard]; class ExploreTeacherCard component;
        ExplorePage -- Submit Search --> ExplorePage; %% Reloads with query params
        ExploreSkillCard -- Click --> SkillDetailPage[app/(dashboard)/skills/[id]/page.tsx]; %% Assumed page
        ExploreTeacherCard -- Click --> UserProfilePage[app/(dashboard)/profile/[userId]/page.tsx]; %% Assumed page

        RenderChildPage --> SessionsPage;
        SessionsPage -- Fetch Sessions --> GetUserSessionsAPI[api/sessions/user]; %% Assumed API
        SessionsPage --> UpcomingSessionComp;
        SessionsPage --> SessionHistoryComp[SessionHistory]; class SessionHistoryComp component;
        SessionsPage --> CalendarComp[Calendar]; class CalendarComp component;
        SessionsPage -- Schedule Button Click --> ScheduleModalOrPage[Schedule Modal/Page]; %% Assumed interaction

        RenderChildPage --> MessagesPage;
        MessagesPage --> MessagingInterface[MessagingInterface]; class MessagingInterface component;
        MessagingInterface -- Fetch/Send Messages --> MessagesAPI[api/messages/*]; %% Assumed API

        RenderChildPage --> ProfilePage;
        ProfilePage -- Fetch Profile --> ProfileAPI[api/profile]; class ProfileAPI api;
        ProfilePage --> ProfileHeaderComp[ProfileHeader]; class ProfileHeaderComp component;
        ProfilePage --> SkillShowcaseComp[SkillShowcase]; class SkillShowcaseComp component;
        ProfilePage --> ReviewsSectionComp[ReviewsSection]; class ReviewsSectionComp component;
        ProfilePage --> AvailabilityCalendarComp[AvailabilityCalendar]; class AvailabilityCalendarComp component;
        ProfilePage --> SessionHistoryComp;
        ProfileHeaderComp -- Edit Button Click --> ProfileEditModal[ProfileEditModal]; class ProfileEditModal component;
        ProfileEditModal -- Save Click --> SaveProfileAPI[api/profile (Update)]; class SaveProfileAPI api;
        SaveProfileAPI -- Update DB --> DBCheck5[DB Check]; class DBCheck5 db;
        SaveProfileAPI -- On Success --> ProfileEditModal;
        ProfileEditModal -- On Save/Close --> ProfilePage;

        RenderChildPage --> SettingsPage;
        SettingsPage --> AccountSettings[AccountSettings]; class AccountSettings component;
        SettingsPage --> NotificationSettings[NotificationSettings]; class NotificationSettings component;
        SettingsPage --> PaymentSettings[PaymentSettings]; class PaymentSettings component;
        AccountSettings -- Save Click --> UpdateAccountAPI[api/auth/user or similar]; %% Assumed API
        NotificationSettings -- Save Click --> UpdateNotificationSettingsAPI[api/settings/notifications]; %% Assumed API
        PaymentSettings -- Save Click --> UpdatePaymentSettingsAPI[api/billing/payment]; %% Assumed API

        RenderChildPage --> SkillsPage;
        SkillsPage --> SkillShowcaseComp;
        SkillsPage -- Add Skill Button Click --> AddSkillPage[app/(dashboard)/skills/new/teaching]; %% Assumed page

        RenderChildPage --> BillingPage[app/(dashboard)/billing/page.tsx]; class BillingPage page;
        BillingPage -- Buy Tokens Click --> PaymentGateway[Payment Gateway Interaction]; %% Assumed interaction
        BillingPage -- Change Plan Click --> ChangePlanInteraction[Change Plan Interaction]; %% Assumed interaction

        RenderChildPage --> CommunityPage[app/(dashboard)/community/page.tsx]; class CommunityPage page;
        CommunityPage -- View Topic/Event/Group Click --> DetailView[Topic/Event/Group Detail View]; %% Assumed interaction
        CommunityPage -- Create Topic/Event/Group Click --> CreateInteraction[Create Topic/Event/Group Interaction]; %% Assumed interaction
    end
