import { LibraryEntryNode, ProjectCategory } from '@wbs/core/models';

export class VerifyEntry {
  static readonly type = '[Library Entry] Verify';
  constructor(
    readonly owner: string,
    readonly entryId: string,
    readonly versionId: number
  ) {}
}

export class VerifyEntryTasks {
  static readonly type = '[Library Entry] Verify Tasks';
}

export class SetEntry {
  static readonly type = '[Library Entry] Set';
  constructor(
    readonly owner: string,
    readonly entryId: string,
    readonly versionId: number
  ) {}
}

export class TitleChanged {
  static readonly type = '[Library Entry] Title Changed';
  constructor(readonly title: string) {}
}

export class DescriptionChanged {
  static readonly type = '[Library Entry] Description Changed';
  constructor(readonly description: string) {}
}

export class TasksChanged {
  static readonly type = '[Library Entry] Tasks Changed';
  constructor(
    readonly upserts: LibraryEntryNode[],
    readonly removeIds: string[]
  ) {}
}

export class PhasesChanged {
  static readonly type = '[Library Entry] Phases Changed';
  constructor(readonly phases: ProjectCategory[]) {}
}
