import { ActivityData } from '@wbs/shared/models';

export class LoadProjectTimeline {
  static readonly type = '[Timeline] Load Project';
  constructor(readonly projectId: string) {}
}

export class LoadTaskTimeline {
  static readonly type = '[Timeline] Load Task';
  constructor(readonly taskId: string) {}
}

export class SaveTimelineAction {
  static readonly type = '[Timeline] Save Action';
  constructor(readonly data: ActivityData, readonly dataType: 'project') {}
}
