import {
  faClone,
  faEye,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem, PROJECT_CLAIMS } from '@wbs/core/models';

export const TASK_MENU_ITEMS: { [id: string]: ActionMenuItem } = {
  addSubTask: {
    action: 'addSub',
    icon: faPlus,
    text: 'Projects.AddSubTask',
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  view: { action: 'viewTask', icon: faEye, text: 'Projects.ViewTask' },
  clone: {
    action: 'cloneTask',
    icon: faClone,
    text: 'Projects.CloneTask',
    claim: PROJECT_CLAIMS.TASKS.CREATE,
  },
  delete: {
    action: 'deleteTask',
    icon: faTrashAlt,
    text: 'Projects.DeleteTask',
    claim: PROJECT_CLAIMS.TASKS.DELETE,
  },
};
