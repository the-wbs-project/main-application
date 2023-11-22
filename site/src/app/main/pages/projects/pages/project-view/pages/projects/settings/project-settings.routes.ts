import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('./project-settings.component').then(
        (x) => x.ProjectSettingsComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((x) => x.routes),
  },
];
