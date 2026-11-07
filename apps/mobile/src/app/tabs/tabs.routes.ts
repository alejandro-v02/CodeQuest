import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('../features/progress/progress.page').then((m) => m.ProgressPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
