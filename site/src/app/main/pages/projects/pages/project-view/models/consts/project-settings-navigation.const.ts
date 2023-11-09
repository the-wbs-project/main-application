import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';
import { PROJECT_SETTINGS_PAGES } from './project-settings-pages.const';

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

export const PROJECT_SETTINGS_NAVIGATION = list;
