import {
  faClone,
  faEye,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem, PROJECT_CLAIMS } from '@wbs/core/models';
import { ProjectNavigationLink } from '../project-navigation-link.model';
import { TASK_PAGE_VIEW } from './task-page-view.const';
import { TASK_SETTINGS_PAGE_LISTS } from './task-settings-pages.const';

const actions: { [id: string]: ActionMenuItem } = {
  addSubTask: {
    action: 'addSub',
    icon: faPlus,
    text: 'Projects.AddSubTask',
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  view: { action: 'viewTask', icon: faEye, text: 'Projects.ViewTask' },
  clone: {
    action: 'cloneTask',
    icon: faClone,
    text: 'Projects.CloneTask',
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  delete: {
    action: 'deleteTask',
    icon: faTrashAlt,
    text: 'Projects.DeleteTask',
    claim: PROJECT_CLAIMS.TASKS.DELETE,
  },
};

const links: ProjectNavigationLink[] = [
  {
    fragment: TASK_PAGE_VIEW.ABOUT,
    title: 'General.About',
  },
  {
    fragment: TASK_PAGE_VIEW.SUB_TASKS,
    title: 'General.SubTasks',
  },
  {
    fragment: TASK_PAGE_VIEW.SETTINGS,
    title: 'General.Settings',
    children: TASK_SETTINGS_PAGE_LISTS,
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

export const TASK_MENU_ITEMS = { actions, links };
