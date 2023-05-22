import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faClone,
  faDownload,
  faEye,
  faPlus,
  faTrashAlt,
  faUpload,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem, ROLES } from '@wbs/core/models';
import { PROJECT_PAGE_VIEW } from './project-page-view.const';
import { PROJECT_SETTINGS_PAGE_LISTS } from './project-settings-pages.const';

export const PROJECT_MENU_ITEMS = {
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
      roles: [ROLES.PM],
    },
  ],
  phaseItemActions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: faPlus,
      tooltip: 'Projects.AddSubTask',
      roles: [ROLES.PM],
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
      roles: [ROLES.PM],
    },
    {
      action: 'deleteTask',
      icon: faTrashAlt,
      tooltip: 'Projects.DeleteTask',
      roles: [ROLES.PM],
    },
  ],
  phaseItemNavActions: <ActionMenuItem[]>[
    {
      action: 'moveLeft',
      icon: faArrowLeft,
      tooltip: 'Projects.MoveLeft',
      roles: [ROLES.PM],
    },
    {
      action: 'moveUp',
      icon: faArrowUp,
      tooltip: 'Projects.MoveUp',
      roles: [ROLES.PM],
    },
    {
      action: 'moveDown',
      icon: faArrowDown,
      tooltip: 'Projects.MoveDown',
      roles: [ROLES.PM],
    },
    {
      action: 'moveRight',
      icon: faArrowRight,
      tooltip: 'Projects.MoveRight',
      roles: [ROLES.PM],
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
    {
      fragment: PROJECT_PAGE_VIEW.SETTINGS,
      title: 'General.Settings',
      children: PROJECT_SETTINGS_PAGE_LISTS,
    },
    /*{
      fragment: PROJECT_PAGE_VIEW.DISCUSSIONS,
      title: 'General.Discussions',
    },*/
  ],
};
