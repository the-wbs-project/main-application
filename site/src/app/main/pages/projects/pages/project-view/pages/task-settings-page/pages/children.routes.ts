import { Routes } from '@angular/router';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { TASK_SETTINGS_PAGES } from '../../../models';

export const routes: Routes = [
  {
    path: 'general',
    data: {
      view: TASK_SETTINGS_PAGES.GENERAL,
    },
    loadComponent: () =>
      import('./general/general.component').then(({ TaskSettingsGeneralComponent }) => TaskSettingsGeneralComponent),   
  },
  {
    path: 'disciplines',
    data: {
      view: TASK_SETTINGS_PAGES.DISCIPLINES,
      cType: PROJECT_NODE_VIEW.DISCIPLINE,
    },
    loadComponent: () =>
      import('./categories/categories.component').then(({ TaskSettingsCategoriesComponent }) => TaskSettingsCategoriesComponent),
    
  },
];
