import { Routes } from '@angular/router';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { TASK_SETTINGS_PAGES } from '../../models';
import {
  TaskSettingsCategoriesComponent,
  TaskSettingsComponent,
  TaskSettingsGeneralComponent,
} from './pages';

export const routes: Routes = [
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: '',
    component: TaskSettingsComponent,
    canActivate: [],
    children: [
      {
        path: 'general',
        component: TaskSettingsGeneralComponent,
        data: {
          view: TASK_SETTINGS_PAGES.GENERAL,
        },
      },
      {
        path: 'disciplines',
        component: TaskSettingsCategoriesComponent,
        data: {
          view: TASK_SETTINGS_PAGES.DISCIPLINES,
          cType: PROJECT_NODE_VIEW.DISCIPLINE,
        },
      },
    ],
  },
];
