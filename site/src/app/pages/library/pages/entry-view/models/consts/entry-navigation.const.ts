import { LIBRARY_CLAIMS, NavigationLink } from '@wbs/core/models';
import { ENTRY_PAGES } from './entry-pages.const';

const settings: NavigationLink[] = [
  {
    route: ['settings', 'general'],
    text: 'General.General',
    section: 'general',
    claim: LIBRARY_CLAIMS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    section: 'disciplines',
    text: 'General.Disciplines',
    claim: LIBRARY_CLAIMS.UPDATE,
  },
];

export const ENTRY_NAVIGATION: NavigationLink[] = [
  {
    text: 'General.Views',
    cssClass: ['d-sm-inline', 'd-md-none', 'nav-item', 'tx-uppercase'],
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
      },
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
  },
  {
    text: 'General.Settings',
    items: settings,
    section: 'settings',
    onlyIfEditable: true,
    claim: LIBRARY_CLAIMS.SETTINGS.READ,
    cssClass: ['nav-item', 'tx-uppercase'],
  },
];
