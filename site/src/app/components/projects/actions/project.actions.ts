import {
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@wbs/shared/models';

export class VerifyProject {
  static readonly type = '[Project] Verify';
  constructor(readonly projectId: string) {}
}

export class SetProject {
  static readonly type = '[Project] Set';
  constructor(readonly projectId: string) {}
}

export class VerifyDeleteReasons {
  static readonly type = '[Project] Delete Reasons';
}

export class AddNodeToProject {
  static readonly type = '[Project] Add Node';
  constructor(readonly node: WbsNode) {}
}

export class RemoveNodeToProject {
  static readonly type = '[Project] Remove Node';
  constructor(readonly nodeId: string, readonly reason: string) {}
}

export class ProjectViewChanged {
  static readonly type = '[Project] View Changed';
  constructor(readonly view: PROJECT_VIEW_TYPE) {}
}

export class ProjectNodeViewChanged {
  static readonly type = '[Project] Node View Changed';
  constructor(readonly view: PROJECT_NODE_VIEW_TYPE) {}
}

export class RebuildNodeViews {
  static readonly type = '[Project] Rebuild Node Views';
}

export class DownloadNodes {
  static readonly type = '[Project] Download Nodes';
}

export class UploadNodes {
  static readonly type = '[Project] Upload Nodes';
}

export class ProcessUploadedNodes {
  static readonly type = '[Project] Process Uploaded Nodes';
  constructor(readonly buffer: ArrayBuffer) {}
}
