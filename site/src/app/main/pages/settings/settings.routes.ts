import { Routes } from '@angular/router';
import { AdminGuard } from '@wbs/main/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    loadComponent: () => import('./settings-layout.component').then((m) => m.SettingsLayoutComponent),
    loadChildren: () => import('./pages/children.routes').then((m) => m.routes),
  },
];
