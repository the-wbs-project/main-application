import { Routes } from '@angular/router';
import { dirtyGuard } from '@wbs/main/guards';
import { orgResolve, projectCategoryResolver } from '@wbs/main/services';

export const routes: Routes = [
  {
    path: 'general',
    canDeactivate: [dirtyGuard],
    loadComponent: () =>
      import('./general/general.component').then(
        (x) => x.ProjectSettingsGeneralComponent
      ),
    resolve: {
      categories: projectCategoryResolver,
    },
  },
  {
    path: 'phases',
    canDeactivate: [dirtyGuard],
    loadComponent: () =>
      import('./phases.component').then(
        (x) => x.ProjectSettingsPhasesComponent
      ),
  },
  {
    path: 'disciplines',
    canDeactivate: [dirtyGuard],
    loadComponent: () =>
      import('./disciplines.component').then(
        (x) => x.ProjectSettingsDisciplinesComponent
      ),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles.component').then((x) => x.ProjectSettingsRolesComponent),
    resolve: {
      org: orgResolve,
    },
  },
];
