import { ActionMenuItem } from '@wbs/core/models';
import { TASK_PAGE_VIEW } from '../../project-view/models';

export const MenuItems = {
  actions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: 'fa-plus',
      title: 'Projects.AddSubTask',
    },
    {
      action: 'edit',
      icon: 'fa-pencil',
      title: 'Projects.EditTask',
    },
    {
      action: 'clone',
      icon: 'fa-clone',
      title: 'Projects.CloneTask',
    },
    {
      action: 'delete',
      icon: 'fa-trash-alt',
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
