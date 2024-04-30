import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookArrowRight,
  faCopy,
  faEye,
  faFileImport,
  faPlus,
  faTrash,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { ContextMenuItem } from '@wbs/main/models';

const taskActions: ContextMenuItem[] = [
  {
    action: 'addSub',
    faIcon: faPlus,
    text: 'Projects.AddSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'importSub',
    faIcon: faFileImport,
    text: 'Projects.ImportSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'viewTask',
    faIcon: faEye,
    text: 'Projects.ViewTask',
    filters: {
      claim: PROJECT_CLAIMS.TASKS.READ,
    },
  },
  {
    action: 'cloneTask',
    faIcon: faCopy,
    text: 'Projects.CloneTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'addDiscipline',
    faIcon: faUserPlus,
    text: 'Wbs.AddDiscipline',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'removeDiscipline',
    faIcon: faUserMinus,
    text: 'Wbs.RemoveDiscipline',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'exportTask',
    faIcon: faBookArrowRight,
    text: 'Projects.ExportToLibrary',
    filters: {
      //stati: [PROJECT_STATI.PLANNING],
      //excludeFromCat: true,
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'deleteTask',
    faIcon: faTrash,
    text: 'Projects.DeleteTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
      claim: PROJECT_CLAIMS.TASKS.DELETE,
    },
  },
];

const reorderTaskActions: ContextMenuItem[] = [
  {
    action: 'moveLeft',
    faIcon: faArrowLeft,
    text: 'Projects.MoveLeft',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveUp',
    faIcon: faArrowUp,
    text: 'Projects.MoveUp',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    text: 'Projects.MoveDown',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    text: 'Projects.MoveRight',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
];

export const PROJECT_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
