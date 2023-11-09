import { Routes } from '@angular/router';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { PROJECT_SETTINGS_PAGES } from '../../../../models';

export const routes: Routes = [
  {
    path: 'general',
    data: {
      view: PROJECT_SETTINGS_PAGES.GENERAL,
    },
    loadComponent: () =>
      import('./general/general.component').then(
        ({ ProjectSettingsGeneralComponent }) => ProjectSettingsGeneralComponent
      ),
  },
  {
    path: 'phases',
    data: {
      view: PROJECT_SETTINGS_PAGES.PHASES,
      cType: PROJECT_NODE_VIEW.PHASE,
    },
    loadComponent: () =>
      import('./categories/categories.component').then(
        ({ ProjectSettingsCategoriesComponent }) =>
          ProjectSettingsCategoriesComponent
      ),
  },
  {
    path: 'disciplines',
    data: {
      view: PROJECT_SETTINGS_PAGES.DISCIPLINES,
      cType: PROJECT_NODE_VIEW.DISCIPLINE,
    },
    loadComponent: () =>
      import('./categories/categories.component').then(
        ({ ProjectSettingsCategoriesComponent }) =>
          ProjectSettingsCategoriesComponent
      ),
  },
  {
    path: 'roles',
    data: {
      view: PROJECT_SETTINGS_PAGES.ROLES,
    },
    loadComponent: () =>
      import('./roles.component').then(
        ({ ProjectSettingsRolesComponent }) => ProjectSettingsRolesComponent
      ),
  },
];
