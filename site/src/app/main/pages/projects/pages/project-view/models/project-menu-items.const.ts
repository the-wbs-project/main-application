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
import { ActionMenuItem, PROJECT_STATI, ROLES } from '@wbs/core/models';
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
      filters: {
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
    },
  ],
  phaseItemActions: <ActionMenuItem[]>[
    {
      action: 'addSub',
      icon: faPlus,
      tooltip: 'Projects.AddSubTask',
      filters: {
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
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
      filters: {
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
        excludeFromCat: true,
      },
    },
    {
      action: 'deleteTask',
      icon: faTrashAlt,
      tooltip: 'Projects.DeleteTask',
      filters: {
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
        excludeFromCat: true,
      },
    },
  ],
  phaseItemNavActions: <ActionMenuItem[]>[
    {
      action: 'moveLeft',
      icon: faArrowLeft,
      tooltip: 'Projects.MoveLeft',
      filters: {
        excludeFromCat: true,
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
    },
    {
      action: 'moveUp',
      icon: faArrowUp,
      tooltip: 'Projects.MoveUp',
      filters: {
        excludeFromCat: true,
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
    },
    {
      action: 'moveDown',
      icon: faArrowDown,
      tooltip: 'Projects.MoveDown',
      filters: {
        excludeFromCat: true,
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
    },
    {
      action: 'moveRight',
      icon: faArrowRight,
      tooltip: 'Projects.MoveRight',
      filters: {
        excludeFromCat: true,
        roles: [ROLES.PM],
        stati: [PROJECT_STATI.PLANNING],
      },
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
