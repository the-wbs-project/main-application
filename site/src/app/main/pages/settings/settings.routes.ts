import { Routes } from '@angular/router';
import { adminGuard } from '@wbs/main/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./settings-layout.component').then((m) => m.SettingsLayoutComponent),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
  },
];
