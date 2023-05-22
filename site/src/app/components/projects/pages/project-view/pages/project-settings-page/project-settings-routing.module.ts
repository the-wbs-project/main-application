import { Routes } from '@angular/router';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { PROJECT_SETTINGS_PAGES } from '../../models';
import {
  ProjectSettingsCategoriesComponent,
  ProjectSettingsComponent,
  ProjectSettingsGeneralComponent,
  ProjectSettingsRolesComponent,
} from './pages';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: '',
    component: ProjectSettingsComponent,
    canActivate: [],
    children: [
      {
        path: 'general',
        component: ProjectSettingsGeneralComponent,
        data: {
          view: PROJECT_SETTINGS_PAGES.GENERAL,
        },
      },
      {
        path: 'phases',
        component: ProjectSettingsCategoriesComponent,
        data: {
          view: PROJECT_SETTINGS_PAGES.PHASES,
          cType: PROJECT_NODE_VIEW.PHASE,
        },
      },
      {
        path: 'disciplines',
        component: ProjectSettingsCategoriesComponent,
        data: {
          view: PROJECT_SETTINGS_PAGES.DISCIPLINES,
          cType: PROJECT_NODE_VIEW.DISCIPLINE,
        },
      },
      {
        path: 'roles',
        component: ProjectSettingsRolesComponent,
        data: {
          view: PROJECT_SETTINGS_PAGES.ROLES,
        },
      },
    ],
  },
];
