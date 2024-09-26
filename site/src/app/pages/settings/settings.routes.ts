import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings-layout.component').then(
        (m) => m.SettingsLayoutComponent
      ),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
  },
];
