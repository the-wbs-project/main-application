import {
  faClone,
  faEye,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/core/models';
import { TASK_PAGE_VIEW } from './task-page-view.const';

export const TASK_MENU_ITEMS = {
  actions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: faPlus,
      title: 'Projects.AddSubTask',
    },
    {
      action: 'view',
      icon: faEye,
      title: 'Projects.ViewTask',
    },
    {
      action: 'clone',
      icon: faClone,
      title: 'Projects.CloneTask',
    },
    {
      action: 'delete',
      icon: faTrashAlt,
      title: 'Projects.DeleteTask',
    },
  ],
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
      fragment: TASK_PAGE_VIEW.TIMELINE,
      title: 'General.Timeline',
    },
    {
      fragment: TASK_PAGE_VIEW.RESOURCES,
      title: 'General.Resources',
    },
  ],
};
