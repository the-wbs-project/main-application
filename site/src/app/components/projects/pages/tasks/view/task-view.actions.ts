import { PAGE_VIEW_TYPE } from './models';

export class VerifyTask {
  static readonly type = '[Project Task] Verify';
  constructor(readonly projectId: string, readonly taskId: string) {}
}

export class SetTask {
  static readonly type = '[Project Task] Set';
  constructor(readonly projectId: string, readonly taskId: string) {}
}

export class RemoveTask {
  static readonly type = '[Project Task] Remove Task';
  constructor(readonly nodeId: string, readonly reason: string) {}
}

export class TaskPageChanged {
  static readonly type = '[Project Task] Page Changed';
  constructor(readonly view: PAGE_VIEW_TYPE) {}
}
