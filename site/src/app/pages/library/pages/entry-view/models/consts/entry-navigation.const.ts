import {
  faFiles,
  faInfoCircle,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { NavigationLink, RouteContextMenuItem } from '@wbs/core/models';
import { ENTRY_PAGES } from './entry-pages.const';

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
];

export const ENTRY_NAVIGATION2: RouteContextMenuItem[] = [
  {
    route: [ENTRY_PAGES.ABOUT],
    resource: 'General.About',
    faIcon: faInfoCircle,
  },
  {
    route: [ENTRY_PAGES.TASKS],
    resource: 'General.Tasks',
    faIcon: faTasks,
  },
  {
    route: [ENTRY_PAGES.RESOURCES],
    resource: 'General.Resources',
    faIcon: faFiles,
  },
];
