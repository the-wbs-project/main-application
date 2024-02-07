import { NavigationLink } from '@wbs/main/models';
import { ENTRY_PAGES } from './entry-pages.const';

const settings: NavigationLink[] = [
  {
    text: 'General.General',
    route: ['settings', 'general'],
    //claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'phases'],
    text: 'General.Phases',
    //claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    text: 'General.Disciplines',
    //claim: PROJECT_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'roles'],
    text: 'General.Roles',
    //claim: PROJECT_CLAIMS.ROLES.READ,
  },
];

export const ENTRY_NAVIGATION: NavigationLink[] = [
  {
    cssClass: ['d-sm-inline', 'd-md-none', 'nav-item', 'tx-uppercase'],
    text: 'General.Views',
    items: [
      {
        route: [ENTRY_PAGES.ABOUT],
        text: 'General.About',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: [ENTRY_PAGES.TASKS],
        text: 'General.Tasks',
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: [ENTRY_PAGES.RESOURCES],
        text: 'General.Resources',
        cssClass: ['nav-item', 'tx-uppercase'],
      } /*
      {
        route: [ENTRY_PAGES.TIMELINE],
        text: 'General.Timeline',
        cssClass: ['nav-item', 'tx-uppercase'],
      },,*/,
    ],
  },
  {
    route: [ENTRY_PAGES.ABOUT],
    text: 'General.About',
    section: 'about',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: [ENTRY_PAGES.TASKS],
    text: 'General.Tasks',
    section: 'tasks',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    route: [ENTRY_PAGES.RESOURCES],
    text: 'General.Resources',
    section: 'resources',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  } /*

  {
    route: [ENTRY_PAGES.TIMELINE],
    text: 'General.Timeline',
    cssClass: ['d-none', 'd-md-inline', 'nav-item', 'tx-uppercase'],
  },
  {
    text: 'General.Settings',
    items: settings,
    claim: PROJECT_CLAIMS.SETTINGS.READ,
    cssClass: ['nav-item', 'tx-uppercase'],
  },*/,
];
