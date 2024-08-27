import { ProjectViewModel, TaskViewModel } from '@wbs/core/view-models';

export class InitiateChecklist {
  static readonly type = '[Project Checklist] Initiate';
}

export class SetChecklistData {
  static readonly type = '[Project Checklist] Set Checklist Data';
  constructor(
    readonly project?: ProjectViewModel,
    readonly disciplines?: TaskViewModel[],
    readonly phases?: TaskViewModel[]
  ) {}
}

export class PerformChecks {
  static readonly type = '[Project Checklist] Perform Checks';
}
