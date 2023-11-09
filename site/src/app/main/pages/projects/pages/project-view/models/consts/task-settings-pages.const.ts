import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';

export enum TASK_SETTINGS_PAGES {
  GENERAL = 'general',
  DISCIPLINES = 'disciplines',
}

export type TASK_SETTINGS_PAGES_TYPE =
  | TASK_SETTINGS_PAGES.GENERAL
  | TASK_SETTINGS_PAGES.DISCIPLINES;

const list: ProjectNavigationLink[] = [
  {
    fragment: TASK_SETTINGS_PAGES.GENERAL,
    title: 'General.General',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    fragment: TASK_SETTINGS_PAGES.DISCIPLINES,
    title: 'General.Disciplines',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
];
export const TASK_SETTINGS_PAGE_LISTS = list;
