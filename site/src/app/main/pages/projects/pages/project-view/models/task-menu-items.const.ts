import {
  faClone,
  faEye,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/core/models';
import { TASK_PAGE_VIEW } from './task-page-view.const';
import { TASK_SETTINGS_PAGE_LISTS } from './task-settings-pages.const';

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
  links: [
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
    } /*,
    {
      fragment: TASK_PAGE_VIEW.TIMELINE,
      title: 'General.Timeline',
    },
    {
      fragment: TASK_PAGE_VIEW.RESOURCES,
      title: 'General.Resources',
    },*/,
  ],
};
