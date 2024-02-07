import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faCopy,
  faEye,
  faPlus,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import { ContextMenuItem } from '../../../../../../models/context-menu-item.model';

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
    action: 'deleteTask',
    faIcon: faTrash,
    text: 'Projects.DeleteTask',
    filters: {
      excludeFromCat: true,
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
      excludeFromCat: true,
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    text: 'Projects.MoveDown',
    filters: {
      excludeFromCat: true,
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    text: 'Projects.MoveRight',
    filters: {
      excludeFromCat: true,
      claim: LIBRARY_CLAIMS.TASKS.UPDATE,
    },
  },
];

export const LIBRARY_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
