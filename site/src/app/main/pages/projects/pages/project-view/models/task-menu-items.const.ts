import {
  faClone,
  faEye,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionMenuItem,
  PROJECT_PERMISSION_KEYS,
  PermissionFilter,
} from '@wbs/core/models';
import { TASK_PAGE_VIEW } from './task-page-view.const';
import { TASK_SETTINGS_PAGE_LISTS } from './task-settings-pages.const';
import { ProjectNavigationLink } from './project-navigation-link.model';

const permissions: PermissionFilter = {
  keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
};
const actions: { [id: string]: ActionMenuItem } = {
  addSubTask: {
    action: 'addSub',
    icon: faPlus,
    text: 'Projects.AddSubTask',
    permissions,
  },
  view: { action: 'viewTask', icon: faEye, text: 'Projects.ViewTask' },
  clone: {
    action: 'cloneTask',
    icon: faClone,
    permissions,
    text: 'Projects.CloneTask',
  },
  delete: {
    action: 'deleteTask',
    icon: faTrashAlt,
    permissions,
    text: 'Projects.DeleteTask',
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
    permissions,
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

export const TASK_MENU_ITEMS = {
  actions: <{ [id: string]: ActionMenuItem }>{
    addSubTask: {
      action: 'addSub',
      icon: faPlus,
      title: 'Projects.AddSubTask',
    },
    view: { action: 'viewTask', icon: faEye, title: 'Projects.ViewTask' },
    clone: { action: 'cloneTask', icon: faClone, title: 'Projects.CloneTask' },
    delete: {
      action: 'deleteTask',
      icon: faTrashAlt,
      title: 'Projects.DeleteTask',
    },
  },
  links,
};
