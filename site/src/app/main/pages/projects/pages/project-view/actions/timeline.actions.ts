import { ActivityData } from '@wbs/core/models';

export class LoadProjectTimeline {
  static readonly type = '[Timeline] Load Project';
  constructor(readonly owner: string, readonly projectId: string) {}
}

export class LoadNextProjectTimelinePage {
  static readonly type = '[Timeline] Load Next Project Page';
}

export class LoadTaskTimeline {
  static readonly type = '[Timeline] Load Task';
  constructor(readonly taskId: string) {}
}

export class LoadNextTaskTimelinePage {
  static readonly type = '[Timeline] Load Next Task Page';
}

export class SaveTimelineAction {
  static readonly type = '[Timeline] Save Action';
  constructor(readonly data: ActivityData[]) {}
}

export class RestoreProject {
  static readonly type = '[Timeline] Project Restore';
  constructor(readonly activityId: string) {}
}
