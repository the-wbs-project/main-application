import { PROJECT_NODE_VIEW_TYPE, Project, WbsNode } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { TASK_PAGE_VIEW_TYPE } from '../models';

export class VerifyTasks {
  static readonly type = '[Tasks] Verify';
  constructor(readonly project: Project) {}
}

export class RebuildNodeViews {
  static readonly type = '[Task] Rebuild Node Views';
}

export class TreeReordered {
  static readonly type = '[Task] Tree Reordered';
  constructor(
    readonly draggedId: string,
    readonly view: PROJECT_NODE_VIEW_TYPE,
    readonly rows: WbsNodeView[]
  ) {}
}

export class RemoveTask {
  static readonly type = '[Task] Remove Task';
  constructor(
    readonly nodeId: string,
    readonly reason: string,
    readonly completedAction?: any
  ) {}
}

export class NavigateToTask {
  static readonly type = '[Task] Navigate To';
  constructor(readonly nodeId: string) {}
}

export class CloneTask {
  static readonly type = '[Task] Clone Task';
  constructor(readonly nodeId: string) {}
}

export class MoveTaskUp {
  static readonly type = '[Task] Move Task Up';
  constructor(readonly taskId: string) {}
}

export class MoveTaskDown {
  static readonly type = '[Task] Move Task Down';
  constructor(readonly taskId: string) {}
}

export class MoveTaskLeft {
  static readonly type = '[Task] Move Task Left';
  constructor(readonly taskId: string) {}
}

export class MoveTaskRight {
  static readonly type = '[Task] Move Task Right';
  constructor(readonly taskId: string) {}
}

export class ChangeTaskBasics {
  static readonly type = '[Task] Change Task Basics';
  constructor(readonly title: string, readonly description: string) {}
}

export class ChangeTaskDisciplines {
  static readonly type = '[Task] Change Task Disciplines';
  constructor(readonly disciplines: string[]) {}
}

export class CreateTask {
  static readonly type = '[Task] Create Task';
  constructor(
    readonly parentId: string,
    readonly model: Partial<WbsNode>,
    readonly navigateTo: boolean
  ) {}
}

export class SaveTask {
  static readonly type = '[Task] Save Task';
  constructor(readonly task: WbsNode) {}
}

export class VerifyTask {
  static readonly type = '[Project Task] Verify';
  constructor(
    readonly viewNode: PROJECT_NODE_VIEW_TYPE,
    readonly taskId: string
  ) {}
}

export class TaskPageChanged {
  static readonly type = '[Project Task] Change Page';
  constructor(readonly pageView: TASK_PAGE_VIEW_TYPE) {}
}

export class RemoveDisciplinesFromTasks {
  static readonly type = '[Project Task] Remove Disciplines';
  constructor(readonly removedIds: string[]) {}
}
