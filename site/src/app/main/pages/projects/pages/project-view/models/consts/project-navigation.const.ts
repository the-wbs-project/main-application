import { PROJECT_CLAIMS } from '@wbs/core/models';
import { NavigationLink } from '@wbs/main/models';

const settings: NavigationLink[] = [
  {
    route: ['settings', 'general'],
    text: 'General.General',
    section: 'general',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'phases'],
    text: 'General.Phases',
    section: 'phases',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    text: 'General.Disciplines',
    section: 'disciplines',
    claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'roles'],
    text: 'General.Roles',
    section: 'roles',
    claim: PROJECT_CLAIMS.ROLES.READ,
  },
];

export const PROJECT_NAVIGATION: NavigationLink[] = [
  {
    cssClass: ['d-sm-inline', 'd-md-none', 'nav-item', 'tx-uppercase'],
    text: 'General.Views',
    items: [
      {
        route: ['about'],
        text: 'General.About',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: ['tasks'],
        text: 'General.Tasks',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: ['timeline'],
        text: 'General.Timeline',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: ['resources'],
        text: 'General.Resources',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
    ],
  },
  {
    route: ['about'],
    text: 'General.About',
    section: 'about',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: ['tasks'],
    text: 'General.Tasks',
    section: 'tasks',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: ['timeline'],
    text: 'General.Timeline',
    section: 'timeline',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: ['resources'],
    text: 'General.Resources',
    section: 'resources',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    text: 'General.Settings',
    items: settings,
    claim: PROJECT_CLAIMS.SETTINGS.READ,
    cssClass: ['nav-item', 'tx-uppercase'],
  },
];
