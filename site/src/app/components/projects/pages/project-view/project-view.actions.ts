import { WbsNodeView } from '@wbs/core/view-models';
import { PAGE_VIEW_TYPE } from './models';

export class ProjectPageChanged {
  static readonly type = '[Project] Page Changed';
  constructor(readonly view: PAGE_VIEW_TYPE) {}
}

export class DownloadNodes {
  static readonly type = '[Project] Download Nodes';
}

export class UploadNodes {
  static readonly type = '[Project] Upload Nodes';
}

export class EditPhases {
  static readonly type = '[Project] Edit Phases';
}

export class EditDisciplines {
  static readonly type = '[Project] Edit Disciplines';
}
