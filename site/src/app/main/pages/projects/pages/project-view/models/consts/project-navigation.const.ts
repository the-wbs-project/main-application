import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';
import { PROJECT_PAGES } from './project-pages.const';

const settings: ProjectNavigationLink[] = [
  {
    route: ['settings', 'general'],
    text: 'General.General',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'phases'],
    text: 'General.Phases',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    text: 'General.Disciplines',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'roles'],
    text: 'General.Roles',
    claim: PROJECT_CLAIMS.ROLES.READ,
  },
];

export const PROJECT_NAVIGATION: ProjectNavigationLink[] = [
  {
    cssClass: ['d-sm-inline', 'd-md-none', 'nav-item', 'tx-uppercase'],
    text: 'General.Views',
    items: [
      {
        route: [PROJECT_PAGES.ABOUT],
        text: 'General.About',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: [PROJECT_PAGES.TASKS],
        text: 'General.Tasks',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: [PROJECT_PAGES.TIMELINE],
        text: 'General.Timeline',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: [PROJECT_PAGES.RESOURCES],
        text: 'General.Resources',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
    ],
  },
  {
    route: [PROJECT_PAGES.ABOUT],
    text: 'General.About',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: [PROJECT_PAGES.TASKS],
    text: 'General.Tasks',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: [PROJECT_PAGES.TIMELINE],
    text: 'General.Timeline',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: [PROJECT_PAGES.RESOURCES],
    text: 'General.Resources',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    text: 'General.Settings',
    items: settings,
    claim: PROJECT_CLAIMS.SETTINGS.READ,
    cssClass: ['nav-item', 'tx-uppercase'],
  },
];
