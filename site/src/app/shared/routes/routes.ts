import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'projects/view',
    loadChildren: () =>
      import('../../components/projects/view/module').then(
        (m) => m.ProjectsViewModule
      ),
  },
];
