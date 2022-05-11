import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'projects',
    loadChildren: () =>
      import('../../components/projects/project-layout.module').then(
        (m) => m.ProjectsLayoutModule
      ),
  },
];
