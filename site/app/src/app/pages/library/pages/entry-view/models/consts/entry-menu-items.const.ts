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
import { ContextMenuItem, LIBRARY_CLAIMS } from '@wbs/core/models';

const taskActions: ContextMenuItem[] = [
  {
    action: 'addSub',
    faIcon: faPlus,
    text: 'Projects.AddSubTask',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'import',
    faIcon: faFileImport,
    text: 'General.Import',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.CREATE,
    },
    items: [
      {
        action: 'import|above',
        faIcon: faArrowUp,
        text: 'General.Above',
      },
      {
        action: 'import|right',
        faIcon: faArrowRight,
        text: 'General.SubTask',
      },
      {
        action: 'import|below',
        faIcon: faArrowDown,
        text: 'General.Below',
      },
    ],
  },
  {
    action: 'viewTask',
    faIcon: faEye,
    text: 'Projects.ViewTask',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.READ,
    },
  },
  {
    action: 'cloneTask',
    faIcon: faCopy,
    text: 'Projects.CloneTask',
    filters: {
      excludeFromCat: true,
      claim: LIBRARY_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'addDiscipline',
    faIcon: faUserPlus,
    text: 'Wbs.AddDiscipline',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'removeDiscipline',
    faIcon: faUserMinus,
    text: 'Wbs.RemoveDiscipline',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'export',
    faIcon: faBookArrowRight,
    text: 'Wbs.ExportToLibrary',
  },
  {
    action: 'deleteTask',
    faIcon: faTrash,
    text: 'Projects.DeleteTask',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.DELETE,
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
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveUp',
    faIcon: faArrowUp,
    text: 'Projects.MoveUp',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    text: 'Projects.MoveDown',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    text: 'Projects.MoveRight',
    filters: {
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
];

export const LIBRARY_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
