import { ActionMenuItem } from '@wbs/core/models';
import { PAGE_VIEW } from './page-view.const';

export const MenuItems = {
  phaseActions: <ActionMenuItem[]>[
    {
      action: 'editPhases',
      icon: 'fa-pencil',
      title: 'Projects.EditPhases',
    },
    {
      action: 'editDisciplines',
      icon: 'fa-pencil',
      title: 'Projects.EditDisciplines',
    },
    {
      action: 'cancel',
      icon: 'fa-trash-alt',
      title: 'Projects.CancelProject',
    },
  ],
  phaseTreeActions: <ActionMenuItem[]>[
    {
      action: 'download',
      icon: 'fa-download',
      title: 'General.Download',
    },
    {
      action: 'upload',
      icon: 'fa-upload',
      title: 'General.Upload',
    },
  ],
  phaseItemActions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: 'fa-plus',
      tooltip: 'Projects.AddSubTask',
    },
    {
      action: 'editTask',
      icon: 'fa-pencil',
      tooltip: 'Projects.EditTask',
    },
    {
      action: 'cloneTask',
      icon: 'fa-clone',
      tooltip: 'Projects.CloneTask',
    },
    {
      action: 'deleteTask',
      icon: 'fa-trash-alt',
      tooltip: 'Projects.DeleteTask',
    },
  ],
  phaseItemNavActions: <ActionMenuItem[]>[
    {
      action: 'moveLeft',
      icon: 'fa-arrow-left',
      tooltip: 'Projects.MoveLeft',
    },
    {
      action: 'moveUp',
      icon: 'fa-arrow-up',
      tooltip: 'Projects.MoveUp',
    },
    {
      action: 'moveDown',
      icon: 'fa-arrow-down',
      tooltip: 'Projects.MoveDown',
    },
    {
      action: 'moveRight',
      icon: 'fa-arrow-right',
      tooltip: 'Projects.MoveRight',
    },
  ],
  projectLinks: [
    {
      fragment: PAGE_VIEW.ABOUT,
      title: 'General.About',
    },
    {
      fragment: PAGE_VIEW.PHASES,
      title: 'General.Phases',
    },
    {
      fragment: PAGE_VIEW.DISCIPLINES,
      title: 'General.Disciplines',
    },
    {
      fragment: PAGE_VIEW.TIMELINE,
      title: 'General.Timeline',
    },
  ],
};
