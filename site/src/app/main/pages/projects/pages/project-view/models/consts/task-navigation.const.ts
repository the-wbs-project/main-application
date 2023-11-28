import { PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';
import { TASK_PAGE_VIEW } from './task-page-view.const';

const settings: ProjectNavigationLink[] = [
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
export const TASK_NAVIGATION: ProjectNavigationLink[] = [
  {
    route: [TASK_PAGE_VIEW.ABOUT],
    text: 'General.About',
  },
  {
    route: [TASK_PAGE_VIEW.SUB_TASKS],
    text: 'General.SubTasks',
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
