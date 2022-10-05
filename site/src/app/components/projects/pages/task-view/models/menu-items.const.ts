import { ActionMenuItem } from '@wbs/shared/models';
import { PAGE_VIEW } from './page-view.const';

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
      fragment: PAGE_VIEW.ABOUT,
      title: 'General.About',
    },
    {
      fragment: PAGE_VIEW.SUB_TASKS,
      title: 'General.SubTasks',
    },
    {
      fragment: PAGE_VIEW.TIMELINE,
      title: 'General.Timeline',
    },
    {
      fragment: PAGE_VIEW.RESOURCES,
      title: 'General.Resources',
    },
  ],
};
