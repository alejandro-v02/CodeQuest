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
];
