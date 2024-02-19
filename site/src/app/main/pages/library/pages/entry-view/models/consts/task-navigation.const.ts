import { LIBRARY_CLAIMS } from '@wbs/core/models';
import { NavigationLink } from '@wbs/main/models';
import { TASK_PAGES } from './task-pages.const';

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
    claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    items: <NavigationLink[]>[
      {
        route: ['settings', 'general'],
        text: 'General.General',
        claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      },
      {
        route: ['settings', 'disciplines'],
        text: 'General.Disciplines',
        claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      },
    ],
  },
];
