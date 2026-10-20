import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { IndexComponent } from "./pages/index/index.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { DisclaimerComponent } from "./layout/footer/legal-and-compliance/disclaimer/disclaimer.component";
import { PrivacyPolicyComponent } from "./layout/footer/legal-and-compliance/privacy-policy/privacy-policy.component";
import { TermsAndConditionsComponent } from "./layout/footer/legal-and-compliance/terms-and-conditions/terms-and-conditions.component";
import { PopiaComplianceComponent } from "./layout/footer/legal-and-compliance/popia-compliance/popia-compliance.component";
import { CookiePolicyComponent } from "./layout/footer/legal-and-compliance/cookie-policy/cookie-policy.component";
import { MediaKitComponent } from "./layout/footer/Opportunity-Connect/media-kit/media-kit.component";
import { FeedComponent } from "./dashboard/feed/feed.component";
import { MyProfileComponent } from "./dashboard/my-profile/profile/profile.component";
import { FeedbackComponent } from "./dashboard/feedback/feedback.component";
import { BookmarksComponent } from "./dashboard/bookmarks/bookmarks.component";
import { CardDetailsComponent } from "./shared/card-details/card-details.component";
import { navigationComponent } from "./dashboard/navigation/navigation.component";

export const routes: Routes = [
  {
    path: '',
    title: 'OppCo | Bursaries, Vacation Work & Graduate Programmes Finder',
    component: IndexComponent,
  },
  {
    path: 'signup',
    title: 'Sign Up | OppCo',
    component: SignupComponent,
  },
  {
    path: 'login',
    title: 'Login | OppCo',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password | OppCo',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    title: 'Reset Password | OppCo',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: '',
    component: navigationComponent,
    children: [
      { path: 'feed', title: 'Feed | OppCo', component: FeedComponent },
      { path: 'opportunity-details/:id', title: 'Opportunity Details | OppCo', component: CardDetailsComponent },  // 👈 Moved outside "feed"
      { path: 'my-profile', title: 'My Profile | OppCo', component: MyProfileComponent },
      { path: 'feedback', title: 'Feedback | OppCo', component: FeedbackComponent },
      { path: 'bookmarks', title: 'Bookmarks | OppCo', component: BookmarksComponent },
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
    ]
  },
  {
    path: 'disclaimer',
    title: 'Disclaimer | OppCo',
    component: DisclaimerComponent,
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | OppCo',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms-and-conditions',
    title: 'Terms & Conditions | OppCo',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'popia-compliance',
    title: 'POPIA Compliance | OppCo',
    component: PopiaComplianceComponent,
  },
  {
    path: 'cookie-policy',
    title: 'Cookie Policy | OppCo',
    component: CookiePolicyComponent,
  },
  {
    path: 'media-kit',
    title: 'Media Kit | OppCo',
    component: MediaKitComponent,
  },
  {
    path: '**',
    title: 'Page Not Found | OppCo',
    component: PageNotFoundComponent,
  },
];
