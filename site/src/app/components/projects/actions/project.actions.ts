import { WbsNode } from '@wbs/shared/models';

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

export class DownloadNodes {
  static readonly type = '[Project] Download Nodes';
}

export class UploadNodes {
  static readonly type = '[Project] Upload Nodes';
}
