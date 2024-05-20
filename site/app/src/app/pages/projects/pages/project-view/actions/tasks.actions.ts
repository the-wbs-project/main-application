import {
  ActivityData,
  PROJECT_NODE_VIEW_TYPE,
  ProjectNode,
  RebuildResults,
  WbsNode,
} from '@wbs/core/models';

export class VerifyTasks {
  static readonly type = '[Tasks] Verify';
  constructor(readonly force = false) {}
}

export class SetTaskNavSection {
  static readonly type = '[Tasks] Set Nav Section';
  constructor(readonly navSection: string | undefined) {}
}

export class RebuildNodeViews {
  static readonly type = '[Tasks] Rebuild Node Views';
}

export class SaveTasks {
  static readonly type = '[Tasks] Save';
  constructor(
    readonly tasks: ProjectNode[],
    readonly activityInfo?: ActivityData
  ) {}
}

export class TreeReordered {
  static readonly type = '[Tasks] Tree Reordered';
  constructor(
    readonly draggedId: string,
    readonly view: PROJECT_NODE_VIEW_TYPE,
    readonly results: RebuildResults
  ) {}
}

export class RemoveTask {
  static readonly type = '[Tasks] Remove Task';
  constructor(
    readonly nodeId: string,
    readonly reason: string,
    readonly completedAction?: any
  ) {}
}

export class CloneTask {
  static readonly type = '[Tasks] Clone Task';
  constructor(readonly nodeId: string) {}
}

export class MoveTaskUp {
  static readonly type = '[Tasks] Move Task Up';
  constructor(readonly taskId: string) {}
}

export class MoveTaskDown {
  static readonly type = '[Tasks] Move Task Down';
  constructor(readonly taskId: string) {}
}

export class MoveTaskLeft {
  static readonly type = '[Tasks] Move Task Left';
  constructor(readonly taskId: string) {}
}

export class MoveTaskRight {
  static readonly type = '[Tasks] Move Task Right';
  constructor(readonly taskId: string) {}
}

export class ChangeTaskBasics {
  static readonly type = '[Tasks] Change Task Basics';
  constructor(
    readonly taskId: string,
    readonly title: string,
    readonly description: string
  ) {}
}

export class ChangeTaskDisciplines {
  static readonly type = '[Tasks] Change Task Disciplines';
  constructor(readonly disciplines: string[]) {}
}

export class AddDisciplineToTask {
  static readonly type = '[Tasks] Add Discipline';
  constructor(readonly taskId: string, readonly disciplineId: string) {}
}

export class RemoveDisciplineToTask {
  static readonly type = '[Tasks] Remove Discipline';
  constructor(readonly taskId: string, readonly disciplineId: string) {}
}

export class CreateTask {
  static readonly type = '[Tasks] Create Task';
  constructor(
    readonly parentId: string,
    readonly model: Partial<WbsNode>,
    readonly navigateTo: boolean
  ) {}
}

export class SaveTask {
  static readonly type = '[Tasks] Save Task';
  constructor(readonly task: WbsNode) {}
}

export class VerifyTask {
  static readonly type = '[Project Task] Verify';
  constructor(readonly taskId: string) {}
}

export class RemoveDisciplinesFromTasks {
  static readonly type = '[Project Task] Remove Disciplines';
  constructor(readonly removedIds: string[]) {}
}
