import { PROJECT_CLAIMS } from '@wbs/core/models';
import { NavigationLink } from '@wbs/main/models';
import { TASK_PAGES } from './task-pages.const';

const settings: NavigationLink[] = [
  {
    route: ['settings', 'general'],
    text: 'General.General',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    route: ['settings', 'disciplines'],
    text: 'General.Disciplines',
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
];
export const TASK_NAVIGATION: NavigationLink[] = [
  {
    route: [TASK_PAGES.ABOUT],
    text: 'General.About',
  },
  {
    route: [TASK_PAGES.SUB_TASKS],
    text: 'General.SubTasks',
  },
  {
    route: [TASK_PAGES.RESOURCES],
    text: 'General.Resources',
  },
  {
    text: 'General.Settings',
    items: settings,
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  } /*,
  {
    fragment: TASK_PAGE_VIEW.TIMELINE,
    title: 'General.Timeline',
  },
  {
    fragment: TASK_PAGE_VIEW.RESOURCES,
    title: 'General.Resources',
  },*/,
];
