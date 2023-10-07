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
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';
import { ProjectNavigationLink } from './project-navigation-link.model';
import { PROJECT_PAGE_VIEW } from './project-page-view.const';
import { PROJECT_SETTINGS_PAGE_LISTS } from './project-settings-pages.const';

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
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
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
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  {
    action: 'viewTask',
    icon: faEye,
    tooltip: 'Projects.ViewTask',
    claim: PROJECT_CLAIMS.TASKS.READ,
  },
  {
    action: 'cloneTask',
    icon: faClone,
    tooltip: 'Projects.CloneTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  {
    action: 'deleteTask',
    icon: faTrashAlt,
    tooltip: 'Projects.DeleteTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    claim: PROJECT_CLAIMS.TASKS.DELETE,
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
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveUp',
    icon: faArrowUp,
    tooltip: 'Projects.MoveUp',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveDown',
    icon: faArrowDown,
    tooltip: 'Projects.MoveDown',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveRight',
    icon: faArrowRight,
    tooltip: 'Projects.MoveRight',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
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
      {
        fragment: PROJECT_PAGE_VIEW.RESOURCES,
        title: 'General.Resources',
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
    fragment: PROJECT_PAGE_VIEW.RESOURCES,
    classes: ['d-none', 'd-md-inline'],
    title: 'General.Resources',
  },
  {
    fragment: PROJECT_PAGE_VIEW.SETTINGS,
    title: 'General.Settings',
    children: PROJECT_SETTINGS_PAGE_LISTS,
    claim: PROJECT_CLAIMS.SETTINGS.READ,
  },
];

export const PROJECT_MENU_ITEMS = {
  phaseTreeActions,
  phaseItemActions,
  phaseItemNavActions,
  projectLinks,
};
