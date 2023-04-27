import {
  ProjectCategory,
  ProjectUploadData,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

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

export class RebuildNodeViews {
  static readonly type = '[Project] Rebuild Node Views';
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
  constructor(readonly results: ProjectUploadData) {}
}

export class ChangeProjectCategories {
  static readonly type = '[Project] Change Project Categories';
  constructor(
    readonly cType: PROJECT_NODE_VIEW_TYPE,
    readonly categories: ProjectCategory[]
  ) {}
}

export class ChangeProjectBasics {
  static readonly type = '[Project] Change Project Basics';
  constructor(
    readonly title: string,
    readonly description: string,
    readonly category: string
  ) {}
}
