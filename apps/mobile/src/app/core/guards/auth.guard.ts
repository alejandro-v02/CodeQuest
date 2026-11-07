import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? router.createUrlTree(['/tabs/home']) : true;
};

// Guards the /tabs tree: logged-in users who haven't finished onboarding yet
// get redirected there instead.
export const onboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.needsOnboarding() ? router.createUrlTree(['/onboarding']) : true;
};

// Guards the /onboarding route itself: already-onboarded users skip straight
// to the app instead of redoing it.
export const onboardingNotDoneGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.needsOnboarding() ? true : router.createUrlTree(['/tabs/home']);
};
