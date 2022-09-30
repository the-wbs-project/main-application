import { ActivityData } from '../models';

export class LoadTimelineDefinitions {
  static readonly type = '[Timeline] Load Definitions';
}

export class LoadTimeline {
  static readonly type = '[Timeline] Load';
  constructor(readonly topLevelId: string) {}
}

export class SetTimeline {
  static readonly type = '[Timeline] Set';
  constructor(readonly topLevelId: string, readonly objectId?: string) {}
}

export class SaveTimelineAction {
  static readonly type = '[Timeline] Save Action';
  constructor(readonly data: ActivityData, readonly dataType: 'project') {}
}
