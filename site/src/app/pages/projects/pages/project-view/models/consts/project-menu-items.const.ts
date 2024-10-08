import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookArrowRight,
  faBooks,
  faCopy,
  faFileImport,
  faPlus,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionContextMenuItem,
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';

const taskActions: ActionContextMenuItem[] = [
  {
    action: 'import',
    faIcon: faPlus,
    resource: 'Wbs.ImportSubTask',
    filters: {
      claim: PROJECT_CLAIMS.TASKS.CREATE,
      stati: [PROJECT_STATI.PLANNING],
    },
    items: [
      {
        action: 'import|file',
        faIcon: faFileImport,
        resource: 'Wbs.ImportFromFile',
      },
      {
        action: 'import|library',
        faIcon: faBooks,
        resource: 'Wbs.ImportFromLibrary',
      },
    ],
  },
  {
    action: 'cloneTask',
    faIcon: faCopy,
    resource: 'Projects.CloneTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'exportTask',
    faIcon: faBookArrowRight,
    resource: 'Projects.ExportToLibrary',
    filters: {},
  },
  {
    action: 'deleteTask',
    faIcon: faTrash,
    resource: 'Projects.DeleteTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.DELETE,
    },
  },
];

const reorderTaskActions: ActionContextMenuItem[] = [
  {
    action: 'moveLeft',
    faIcon: faArrowLeft,
    resource: 'Projects.MoveLeft',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveUp',
    faIcon: faArrowUp,
    resource: 'Projects.MoveUp',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    resource: 'Projects.MoveDown',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    resource: 'Projects.MoveRight',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
];

export const PROJECT_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
