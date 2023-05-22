export enum PROJECT_SETTINGS_PAGES {
  GENERAL = 'general',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  ROLES = 'roles',
}

export type PROJECT_SETTINGS_PAGES_TYPE =
  | PROJECT_SETTINGS_PAGES.GENERAL
  | PROJECT_SETTINGS_PAGES.PHASES
  | PROJECT_SETTINGS_PAGES.DISCIPLINES
  | PROJECT_SETTINGS_PAGES.ROLES;

export const PROJECT_SETTINGS_PAGE_LISTS = [
  {
    fragment: PROJECT_SETTINGS_PAGES.GENERAL,
    title: 'General.General',
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.PHASES,
    title: 'General.Phases',
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.DISCIPLINES,
    title: 'General.Disciplines',
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.ROLES,
    title: 'General.Roles',
  },
];
