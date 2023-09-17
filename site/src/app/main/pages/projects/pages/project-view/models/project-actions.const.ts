export enum PROJECT_ACTIONS {
  GENERAL = 'general',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  ROLES = 'roles',
}

export const PROJECT_SETTINGS_PAGE_LISTS = [
  {
    fragment: PROJECT_ACTIONS.GENERAL,
    title: 'General.General',
  },
  {
    fragment: PROJECT_ACTIONS.PHASES,
    title: 'General.Phases',
  },
  {
    fragment: PROJECT_ACTIONS.DISCIPLINES,
    title: 'General.Disciplines',
  },
  {
    fragment: PROJECT_ACTIONS.ROLES,
    title: 'General.Roles',
  },
];
