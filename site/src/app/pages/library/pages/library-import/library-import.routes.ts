import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-import.component').then((x) => x.LibraryImportComponent),
  },
];
