import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./project-settings.component').then(({ ProjectSettingsComponent }) => ProjectSettingsComponent),
    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),
  },
];
