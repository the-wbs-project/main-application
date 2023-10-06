import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from './project-navigation-link.model';

export enum PROJECT_SETTINGS_PAGES {
  GENERAL = 'general',
  PHASES = 'phases',
  DISCIPLINES = 'disciplines',
  ROLES = 'roles',
}
const list: ProjectNavigationLink[] = [
  {
    fragment: PROJECT_SETTINGS_PAGES.GENERAL,
    title: 'General.General',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.PHASES,
    title: 'General.Phases',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.DISCIPLINES,
    title: 'General.Disciplines',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    fragment: PROJECT_SETTINGS_PAGES.ROLES,
    title: 'General.Roles',
    claim: PROJECT_CLAIMS.ROLES.READ,
  },
];

export const PROJECT_SETTINGS_PAGE_LISTS = list;
