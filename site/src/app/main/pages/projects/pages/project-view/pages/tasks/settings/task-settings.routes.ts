import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./task-settings.component').then(({ TaskSettingsComponent }) => TaskSettingsComponent),
    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),
  },
];
