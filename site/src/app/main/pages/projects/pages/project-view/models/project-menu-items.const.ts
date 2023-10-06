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
import {
  ActionMenuItem,
  PROJECT_PERMISSION_KEYS,
  PROJECT_STATI,
  ROLES,
} from '@wbs/core/models';
import { PROJECT_PAGE_VIEW } from './project-page-view.const';
import { PROJECT_SETTINGS_PAGE_LISTS } from './project-settings-pages.const';
import { ProjectNavigationLink } from './project-navigation-link.model';

const phaseTreeActions: ActionMenuItem[] = [
  {
    action: 'download',
    icon: faDownload,
    text: 'General.Download',
  },
  {
    action: 'upload',
    icon: faUpload,
    text: 'General.Upload',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
];

const phaseItemActions: ActionMenuItem[] = [
  {
    action: 'addSub',
    icon: faPlus,
    tooltip: 'Projects.AddSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
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
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
  {
    action: 'deleteTask',
    icon: faTrashAlt,
    tooltip: 'Projects.DeleteTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
];

const phaseItemNavActions: ActionMenuItem[] = [
  {
    action: 'moveLeft',
    icon: faArrowLeft,
    tooltip: 'Projects.MoveLeft',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
  {
    action: 'moveUp',
    icon: faArrowUp,
    tooltip: 'Projects.MoveUp',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
  {
    action: 'moveDown',
    icon: faArrowDown,
    tooltip: 'Projects.MoveDown',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
  {
    action: 'moveRight',
    icon: faArrowRight,
    tooltip: 'Projects.MoveRight',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    permissions: {
      keys: [PROJECT_PERMISSION_KEYS.CAN_EDIT_TASKS],
    },
  },
];
const projectLinks: ProjectNavigationLink[] = [
  {
    classes: ['d-sm-inline', 'd-md-none'],
    title: 'General.Views',
    children: [
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
  },
  {
    fragment: PROJECT_PAGE_VIEW.ABOUT,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.About',
  },
  {
    fragment: PROJECT_PAGE_VIEW.PHASES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Phases',
  },
  {
    fragment: PROJECT_PAGE_VIEW.DISCIPLINES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Disciplines',
  },
  {
    fragment: PROJECT_PAGE_VIEW.TIMELINE,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Timeline',
  },
  {
    fragment: PROJECT_PAGE_VIEW.SETTINGS,
    title: 'General.Settings',
    children: PROJECT_SETTINGS_PAGE_LISTS,
    permissions: {
      keys: [
        PROJECT_PERMISSION_KEYS.CAN_EDIT_METADATA,
        PROJECT_PERMISSION_KEYS.CAN_EDIT_ROLES,
      ],
      op: 'or',
    },
  },
];

export const PROJECT_MENU_ITEMS = {
  phaseTreeActions,
  phaseItemActions,
  phaseItemNavActions,
  projectLinks,
};
