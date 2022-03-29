import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'demos',
    loadChildren: () =>
      import('../../components/demos/demos.module').then((m) => m.DemosModule),
  },
];
