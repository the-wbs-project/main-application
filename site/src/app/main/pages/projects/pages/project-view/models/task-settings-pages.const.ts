export enum TASK_SETTINGS_PAGES {
  GENERAL = 'general',
  DISCIPLINES = 'disciplines',
}

export type TASK_SETTINGS_PAGES_TYPE =
  | TASK_SETTINGS_PAGES.GENERAL
  | TASK_SETTINGS_PAGES.DISCIPLINES;

export const TASK_SETTINGS_PAGE_LISTS = [
  {
    fragment: TASK_SETTINGS_PAGES.GENERAL,
    title: 'General.General',
  },
  {
    fragment: TASK_SETTINGS_PAGES.DISCIPLINES,
    title: 'General.Disciplines',
  },
];
