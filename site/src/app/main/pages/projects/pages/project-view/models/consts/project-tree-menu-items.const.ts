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

const phaseActions: ActionMenuItem[] = [
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

const taskActions: ActionMenuItem[] = [
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

const reorderTaskActions: ActionMenuItem[] = [
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

export const PROJECT_TREE_MENU_ITEMS = {
  phaseActions,
  taskActions,
  reorderTaskActions,
};