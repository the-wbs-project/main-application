import {
  faCog,
  faFiles,
  faInfoCircle,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import {
  LIBRARY_CLAIMS,
  NavigationLink,
  RouteContextMenuItem,
} from '@wbs/core/models';
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
  {
    route: [ENTRY_PAGES.SETTINGS],
    resource: 'General.Settings',
    faIcon: faCog,
    filters: {
      claim: LIBRARY_CLAIMS.SETTINGS.READ,
      props: [{ prop: 'status', op: '=', value: 'draft' }],
    },
    items: [
      {
        route: ['settings', 'general'],
        resource: 'General.General',
        filters: {
          claim: LIBRARY_CLAIMS.UPDATE,
        },
      },
      {
        route: ['settings', 'disciplines'],
        resource: 'General.Disciplines',
        filters: {
          claim: LIBRARY_CLAIMS.UPDATE,
        },
      },
    ],
  },
];
