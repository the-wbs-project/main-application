import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { ContextMenuItem } from '../context-menu-item.model';
import {
  arrowDownIcon,
  arrowLeftIcon,
  arrowRightIcon,
  arrowUpIcon,
  copyIcon,
  eyeIcon,
  plusIcon,
  trashIcon,
} from '@progress/kendo-svg-icons';

const taskActions: ContextMenuItem[] = [
  {
    action: 'addSub',
    svgIcon: plusIcon,
    text: 'Projects.AddSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  {
    action: 'viewTask',
    svgIcon: eyeIcon,
    text: 'Projects.ViewTask',
    claim: PROJECT_CLAIMS.TASKS.READ,
  },
  {
    action: 'cloneTask',
    svgIcon: copyIcon,
    text: 'Projects.CloneTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  {
    action: 'deleteTask',
    svgIcon: trashIcon,
    text: 'Projects.DeleteTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      excludeFromCat: true,
    },
    claim: PROJECT_CLAIMS.TASKS.DELETE,
  },
];

const reorderTaskActions: ContextMenuItem[] = [
  {
    action: 'moveLeft',
    svgIcon: arrowLeftIcon,
    text: 'Projects.MoveLeft',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveUp',
    svgIcon: arrowUpIcon,
    text: 'Projects.MoveUp',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveDown',
    svgIcon: arrowDownIcon,
    text: 'Projects.MoveDown',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
  {
    action: 'moveRight',
    svgIcon: arrowRightIcon,
    text: 'Projects.MoveRight',
    filters: {
      excludeFromCat: true,
      stati: [PROJECT_STATI.PLANNING],
    },
    claim: PROJECT_CLAIMS.TASKS.UPDATE,
  },
];

export const PROJECT_TREE_MENU_ITEMS = {
  taskActions,
  reorderTaskActions,
};
