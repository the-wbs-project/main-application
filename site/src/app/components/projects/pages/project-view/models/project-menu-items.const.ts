import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faClone,
  faDownload,
  faEye,
  faPencil,
  faPlus,
  faTrashAlt,
  faUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/core/models';
import { PROJECT_PAGE_VIEW } from './project-page-view.const';

export const PROJECT_MENU_ITEMS = {
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
      action: 'viewTask',
      icon: faEye,
      tooltip: 'Projects.ViewTask',
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
  phaseItemNavActions: <ActionMenuItem[]>[
    {
      action: 'moveLeft',
      icon: faArrowLeft,
      tooltip: 'Projects.MoveLeft',
    },
    {
      action: 'moveUp',
      icon: faArrowUp,
      tooltip: 'Projects.MoveUp',
    },
    {
      action: 'moveDown',
      icon: faArrowDown,
      tooltip: 'Projects.MoveDown',
    },
    {
      action: 'moveRight',
      icon: faArrowRight,
      tooltip: 'Projects.MoveRight',
    },
  ],
  projectLinks: [
    {
      fragment: PROJECT_PAGE_VIEW.ABOUT,
      title: 'General.About',
    },
    {
      fragment: PROJECT_PAGE_VIEW.PHASES,
      title: 'General.Phases',
    },
    {
      fragment: PROJECT_PAGE_VIEW.DISCIPLINES,
      title: 'General.Disciplines',
    },
    {
      fragment: PROJECT_PAGE_VIEW.TIMELINE,
      title: 'General.Timeline',
    },
  ],
};
