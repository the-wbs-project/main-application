export enum SETTINGS_PAGES {
  GENERAL = 'general',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  ROLES = 'roles',
}

export type SETTINGS_PAGES_TYPE =
  | SETTINGS_PAGES.GENERAL
  | SETTINGS_PAGES.PHASES
  | SETTINGS_PAGES.DISCIPLINES
  | SETTINGS_PAGES.ROLES;

export const SETTINGS_PAGE_LISTS = [
  {
    fragment: SETTINGS_PAGES.GENERAL,
    title: 'General.General',
  },
  {
    fragment: SETTINGS_PAGES.PHASES,
    title: 'General.Phases',
  },
  {
    fragment: SETTINGS_PAGES.DISCIPLINES,
    title: 'General.Disciplines',
  },
  {
    fragment: SETTINGS_PAGES.ROLES,
    title: 'General.Roles',
  },
];
