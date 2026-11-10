import { Routes } from '@angular/router';
import { authGuard, guestGuard, onboardingGuard, onboardingNotDoneGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard, onboardingNotDoneGuard],
    loadComponent: () =>
      import('./features/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    // Runs right after /onboarding, once preferredLanguage is already set —
    // onboardingNotDoneGuard would bounce this to /tabs/home by then, so it
    // only needs authGuard.
    path: 'onboarding/placement',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/onboarding/placement.page').then((m) => m.PlacementPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard, onboardingGuard],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.tabsRoutes),
  },
  {
    path: 'lesson/:id',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/lesson/lesson.page').then((m) => m.LessonPage),
  },
  {
    path: 'exercise/:id',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/exercise/exercise.page').then((m) => m.ExercisePage),
  },
  {
    path: 'practice',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/practice/practice.page').then((m) => m.PracticePage),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'league',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/league/league.page').then((m) => m.LeaguePage),
  },
  {
    path: 'groups',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () => import('./features/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'groups/:id',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () =>
      import('./features/groups/group-detail.page').then((m) => m.GroupDetailPage),
  },
  {
    path: 'profile/:userId',
    canActivate: [authGuard, onboardingGuard],
    loadComponent: () =>
      import('./features/social/profile/public-profile.page').then((m) => m.PublicProfilePage),
  },
];
