import { Routes } from '@angular/router';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { dirtyGuard } from '@wbs/main/guards';
import { orgResolve, projectCategoryResolver } from '@wbs/main/services';
import { PROJECT_SETTINGS_PAGES } from '../../../../models';

export const routes: Routes = [
  {
    path: 'general',
    canDeactivate: [dirtyGuard],
    data: {
      view: PROJECT_SETTINGS_PAGES.GENERAL,
    },
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
    data: {
      view: PROJECT_SETTINGS_PAGES.PHASES,
      cType: PROJECT_NODE_VIEW.PHASE,
    },
    loadComponent: () =>
      import('./categories.component').then(
        (x) => x.ProjectSettingsCategoriesComponent
      ),
  },
  {
    path: 'disciplines',
    canDeactivate: [dirtyGuard],
    data: {
      view: PROJECT_SETTINGS_PAGES.DISCIPLINES,
      cType: PROJECT_NODE_VIEW.DISCIPLINE,
    },
    loadComponent: () =>
      import('./categories.component').then(
        (x) => x.ProjectSettingsCategoriesComponent
      ),
  },
  {
    path: 'roles',
    data: {
      view: PROJECT_SETTINGS_PAGES.ROLES,
    },
    loadComponent: () =>
      import('./roles.component').then((x) => x.ProjectSettingsRolesComponent),
    resolve: {
      org: orgResolve,
    },
  },
];
