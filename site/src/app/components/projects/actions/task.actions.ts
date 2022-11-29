import {
  ProjectCategory,
  ProjectUploadData,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export class RemoveTask {
  static readonly type = '[Project] Remove Task';
  constructor(
    readonly nodeId: string,
    readonly reason: string,
    readonly completedAction?: any
  ) {}
}

export class CloneTask {
  static readonly type = '[Project] Clone Task';
  constructor(readonly nodeId: string) {}
}

export class MoveTaskUp {
  static readonly type = '[Project] Move Task Up';
  constructor(readonly taskId: string) {}
}

export class MoveTaskDown {
  static readonly type = '[Project] Move Task Down';
  constructor(readonly taskId: string) {}
}

export class MoveTaskLeft {
  static readonly type = '[Project] Move Task Left';
  constructor(readonly taskId: string) {}
}

export class MoveTaskRight {
  static readonly type = '[Project] Move Task Right';
  constructor(readonly taskId: string) {}
}

export class ChangeTaskTitle {
  static readonly type = '[Project] Change Task Title';
  constructor(readonly taskId: string, readonly title: string) {}
}

export class ChangeTaskDescription {
  static readonly type = '[Project] Change Task Description';
  constructor(readonly taskId: string, readonly description: string) {}
}

export class CreateTask {
  static readonly type = '[Project] Create Task';
  constructor(
    readonly parentId: string,
    readonly model: Partial<WbsNode>,
    readonly nav: boolean
  ) {}
}
