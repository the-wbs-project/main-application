import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBookArrowRight,
  faCheck,
  faCopy,
  faEclipse,
  faEye,
  faFileImport,
  faPlus,
  faTrash,
  faUserMinus,
  faUserPlus,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import {
  ContextMenuItem,
  PROJECT_CLAIMS,
  PROJECT_STATI,
} from '@wbs/core/models';

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
    action: 'import',
    faIcon: faFileImport,
    text: 'General.Import',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.CREATE,
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
      claim: PROJECT_CLAIMS.TASKS.READ,
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
    action: 'other',
    faIcon: faEclipse,
    text: 'Wbs.OtherActions',
    filters: {
      claim: PROJECT_CLAIMS.TASKS.CREATE,
    },
    items: [
      {
        action: 'cloneTask',
        faIcon: faCopy,
        text: 'Projects.CloneTask',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.CREATE,
        },
      },
      {
        action: 'setAbsFlag',
        faIcon: faCheck,
        text: 'Wbs.MarkAsAbs',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.UPDATE,
          props: [{ prop: 'absFlag', op: '!=', value: 'set' }],
        },
      },
      {
        action: 'removeAbsFlag',
        faIcon: faX,
        text: 'Wbs.RemoveAbsFlag',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.UPDATE,
          props: [{ prop: 'absFlag', op: '=', value: 'set' }],
        },
      },
      {
        action: 'exportTask',
        faIcon: faBookArrowRight,
        text: 'Projects.ExportToLibrary',
        filters: {},
      },
      {
        action: 'deleteTask',
        faIcon: faTrash,
        text: 'Projects.DeleteTask',
        filters: {
          stati: [PROJECT_STATI.PLANNING],
          claim: PROJECT_CLAIMS.TASKS.DELETE,
        },
      },
    ],
  },
];

const reorderTaskActions: ContextMenuItem[] = [
  {
    action: 'moveLeft',
    faIcon: faArrowLeft,
    text: 'Projects.MoveLeft',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveUp',
    faIcon: faArrowUp,
    text: 'Projects.MoveUp',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveDown',
    faIcon: faArrowDown,
    text: 'Projects.MoveDown',
    filters: {
      stati: [PROJECT_STATI.PLANNING],
      claim: PROJECT_CLAIMS.TASKS.UPDATE,
    },
  },
  {
    action: 'moveRight',
    faIcon: faArrowRight,
    text: 'Projects.MoveRight',
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
