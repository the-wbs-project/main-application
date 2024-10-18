import { Routes } from '@angular/router';
import { LaborRatesService, LaborRatesStore } from './services';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./labor-rates.component').then((m) => m.LaborRatesComponent),
    providers: [LaborRatesService, LaborRatesStore],
  },
];
