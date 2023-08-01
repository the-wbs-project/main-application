import { Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';

export class InitiateChecklist {
  static readonly type = '[Project Checklist] Initiate';
}

export class PerformChecklist {
  static readonly type = '[Project Checklist] Perform';
  constructor(
    readonly project?: Project,
    readonly disciplines?: WbsNodeView[],
    readonly phases?: WbsNodeView[]
  ) {}
}
