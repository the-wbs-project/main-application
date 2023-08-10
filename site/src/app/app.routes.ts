import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./main/main.routes').then((x) => x.routes),
  },
];
