import { PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import { TASK_PAGE_VIEW_TYPE } from '../models';

export class VerifyTask {
  static readonly type = '[Project Task] Verify';
  constructor(
    readonly viewNode: PROJECT_NODE_VIEW_TYPE,
    readonly taskId: string
  ) {}
}

export class TaskPageChanged {
  static readonly type = '[Project Task] Change Page';
  constructor(readonly view: TASK_PAGE_VIEW_TYPE) {}
}
