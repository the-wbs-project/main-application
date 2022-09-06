import {
  faClone,
  faDownload,
  faPencil,
  faPlus,
  faTrashAlt,
  faUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/shared/models';
import { PAGE_VIEW } from './page-view.const';

export const MenuItems = {
  phaseActions: <ActionMenuItem[]>[
    {
      action: 'editPhases',
      icon: faPencil,
      title: 'Projects.EditPhases',
    },
    {
      action: 'editDisciplines',
      icon: faPencil,
      title: 'Projects.EditDisciplines',
    },
    {
      action: 'cancel',
      icon: faTrashAlt,
      title: 'Projects.CancelProject',
    },
  ],
  phaseTreeActions: <ActionMenuItem[]>[
    {
      action: 'download',
      icon: faDownload,
      title: 'General.Download',
    },
    {
      action: 'upload',
      icon: faUpload,
      title: 'General.Upload',
    },
  ],
  phaseItemActions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: faPlus,
      tooltip: 'Projects.AddSubTask',
    },
    {
      action: 'editTask',
      icon: faPencil,
      tooltip: 'Projects.EditTask',
    },
    {
      action: 'cloneTask',
      icon: faClone,
      tooltip: 'Projects.CloneTask',
    },
    {
      action: 'deleteTask',
      icon: faTrashAlt,
      tooltip: 'Projects.DeleteTask',
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
