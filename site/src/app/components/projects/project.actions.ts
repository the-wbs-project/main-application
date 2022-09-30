import { ProjectCategory, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { ExtractResults } from './models';

export class VerifyProject {
  static readonly type = '[Project] Verify';
  constructor(readonly projectId: string) {}
}

export class SetProject {
  static readonly type = '[Project] Set';
  constructor(readonly projectId: string) {}
}

export class NavigateToView {
  static readonly type = '[Project] Navigate';
  constructor(readonly view: string) {}
}

export class RemoveTask {
  static readonly type = '[Project] Remove Task';
  constructor(readonly nodeId: string, readonly completedAction?: any) {}
}

export class CloneTask {
  static readonly type = '[Project] Clone Task';
  constructor(readonly nodeId: string) {}
}

export class RebuildNodeViews {
  static readonly type = '[Project] Rebuild Node Views';
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

export class TreeReordered {
  static readonly type = '[Project] Tree Reordered';
  constructor(
    readonly draggedId: string,
    readonly view: PROJECT_NODE_VIEW_TYPE,
    readonly rows: WbsNodeView[]
  ) {}
}

export class SaveUpload {
  static readonly type = '[Project] Save Upload';
  constructor(readonly results: ExtractResults) {}
}

export class ChangeProjectTitle {
  static readonly type = '[Project] Change Project Title';
  constructor(readonly title: string) {}
}

export class ChangeProjectPhases {
  static readonly type = '[Project] Change Project Phases';
  constructor(readonly phases: ProjectCategory[]) {}
}

export class ChangeProjectDisciplines {
  static readonly type = '[Project] Change Project Disciplines';
  constructor(readonly disciplines: ProjectCategory[]) {}
}

export class ChangeTaskTitle {
  static readonly type = '[Project] Change Task Title';
  constructor(readonly taskId: string, readonly title: string) {}
}

export class CreateTask {
  static readonly type = '[Project] Create Task';
  constructor(readonly parentId: string) {}
}
