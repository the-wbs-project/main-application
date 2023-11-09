import { PROJECT_PAGES_TYPE } from '../models';

export class ProjectPageChanged {
  static readonly type = '[Project] Page Changed';
  constructor(readonly view: PROJECT_PAGES_TYPE) {}
}

export class DownloadNodes {
  static readonly type = '[Project] Download Nodes';
}
