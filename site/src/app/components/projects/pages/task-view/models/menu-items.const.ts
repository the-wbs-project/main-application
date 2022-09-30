import {
  faClone,
  faPencil,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/shared/models';
import { PAGE_VIEW } from './page-view.const';

export const MenuItems = {
  actions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: faPlus,
      title: 'Projects.AddSubTask',
    },
    {
      action: 'edit',
      icon: faPencil,
      title: 'Projects.EditTask',
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
