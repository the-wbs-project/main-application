import { PAGE_VIEW_TYPE } from './models';

export class VerifyTask {
  static readonly type = '[Project Task] Verify';
  constructor(readonly projectId: string, readonly taskId: string) {}
}

export class TaskPageChanged {
  static readonly type = '[Project Task] Change Page';
  constructor(readonly view: PAGE_VIEW_TYPE) {}
}
