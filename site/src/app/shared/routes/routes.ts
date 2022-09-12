import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'projects',
    loadChildren: () =>
      import('../../components/projects/project-layout.module').then(
        (m) => m.ProjectsLayoutModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../components/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
];