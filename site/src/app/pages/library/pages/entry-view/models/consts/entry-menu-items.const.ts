import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookArrowRight,
  faCopy,
  faEclipse,
  faEye,
  faFileImport,
  faPlus,
  faTrash,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionContextMenuItem, LIBRARY_CLAIMS } from '@wbs/core/models';

const taskActions: ActionContextMenuItem[] = [
  {
    action: 'import|right',
    faIcon: faFileImport,
    resource: 'Wbs.ImportSubTask',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.CREATE,
      stati: ['draft'],
    },
  },
  {
    action: 'cloneTask',
    faIcon: faCopy,
    resource: 'Projects.CloneTask',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.CREATE,
      stati: ['draft'],
    },
  },
  {
    action: 'export',
    faIcon: faBookArrowRight,
    resource: 'Wbs.ExportToLibrary',
  },
];

const reorderTaskActions: ActionContextMenuItem[] = [
  {
    action: 'moveLeft',
    faIcon: faArrowLeft,
    resource: 'Projects.MoveLeft',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      stati: ['draft'],
    },
  },
  {
    action: 'moveUp',
    faIcon: faArrowUp,
    resource: 'Projects.MoveUp',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      stati: ['draft'],
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    resource: 'Projects.MoveDown',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      stati: ['draft'],
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    resource: 'Projects.MoveRight',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
      stati: ['draft'],
    },
  },
];

export const LIBRARY_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
