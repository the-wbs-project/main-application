import { PROJECT_CLAIMS } from '@wbs/core/models';
import { NavigationLink } from '@wbs/main/models';
import { TASK_PAGES } from './task-pages.const';

const settings: NavigationLink[] = [
  {
    route: ['settings', 'general'],
    text: 'General.General',
    section: 'general',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    text: 'General.Disciplines',
    section: 'disciplines',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
];
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
    items: settings,
    section: 'settings',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
    cssClass: ['nav-item', 'tx-uppercase'],
  },
];
