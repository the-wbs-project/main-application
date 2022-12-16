import { PROJECT_PAGE_VIEW_TYPE } from '../models';

export class ProjectPageChanged {
  static readonly type = '[Project] Page Changed';
  constructor(readonly view: PROJECT_PAGE_VIEW_TYPE) {}
}

export class DownloadNodes {
  static readonly type = '[Project] Download Nodes';
}

export class EditPhases {
  static readonly type = '[Project] Edit Phases';
}

export class EditDisciplines {
  static readonly type = '[Project] Edit Disciplines';
}
