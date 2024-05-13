import { LIBRARY_CLAIMS, NavigationLink } from '@wbs/core/models';
import { TASK_PAGES } from './task-pages.const';

export const TASK_NAVIGATION: NavigationLink[] = [
  {
    route: [TASK_PAGES.ABOUT],
    text: 'General.About',
    section: 'about',
    cssClass: ['nav-item', 'tx-uppercase'],
  },
  {
    route: [TASK_PAGES.SUB_TASKS],
    text: 'General.SubTasks',
    section: 'sub-tasks',
    cssClass: ['nav-item', 'tx-uppercase'],
  },
  {
    route: [TASK_PAGES.RESOURCES],
    text: 'General.Resources',
    section: 'resources',
    cssClass: ['nav-item', 'tx-uppercase'],
  },
  {
    text: 'General.Settings',
    section: 'settings',
    claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    cssClass: ['nav-item', 'tx-uppercase'],
    items: <NavigationLink[]>[
      {
        route: ['settings', 'general'],
        text: 'General.General',
        claim: LIBRARY_CLAIMS.TASKS.UPDATE,
        cssClass: ['nav-item', 'tx-uppercase'],
      },
      {
        route: ['settings', 'disciplines'],
        text: 'General.Disciplines',
        claim: LIBRARY_CLAIMS.TASKS.UPDATE,
        cssClass: ['nav-item', 'tx-uppercase'],
      },
    ],
  },
];
