import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookArrowRight,
  faCheck,
  faCopy,
  faEclipse,
  faFileImport,
  faPlus,
  faTrash,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ActionContextMenuItem,
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';

const taskActions: ActionContextMenuItem[] = [
  {
    action: 'addSub',
    faIcon: faPlus,
    resource: 'Projects.AddSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'import|right',
    faIcon: faFileImport,
    resource: 'Wbs.ImportSubTask',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
  },
  {
    action: 'other',
    faIcon: faEclipse,
    resource: 'Wbs.OtherActions',
    filters: {
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
    items: [
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
        action: 'setAbsFlag',
        faIcon: faCheck,
        resource: 'Wbs.MarkAsAbs',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.UPDATE,
          props: [{ prop: 'absFlag', op: '!=', value: 'set' }],
        },
      },
      {
        action: 'removeAbsFlag',
        faIcon: faX,
        resource: 'Wbs.RemoveAbsFlag',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.UPDATE,
          props: [{ prop: 'absFlag', op: '=', value: 'set' }],
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
    ],
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
