import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';

export class VerifyEntry {
  static readonly type = '[Library Entry] Verify';
  constructor(
    readonly owner: string,
    readonly entryId: string,
    readonly versionId: number
  ) {}
}

export class SetEntry {
  static readonly type = '[Library Entry] Set';
  constructor(
    readonly owner: string,
    readonly entryId: string,
    readonly versionId: number
  ) {}
}

export class VerifyTask {
  static readonly type = '[Library Entry] Verify Task';
  constructor(readonly taskId: string) {}
}

export class SetTask {
  static readonly type = '[Library Entry] Set Task';
  constructor(readonly taskId: string) {}
}

export class EntryChanged {
  static readonly type = '[Library Entry] Entry Changed';
  constructor(readonly entry: LibraryEntry) {}
}

export class VersionChanged {
  static readonly type = '[Library Entry] Version Changed';
  constructor(readonly version: LibraryEntryVersion) {}
}

export class TasksChanged {
  static readonly type = '[Library Entry] Tasks Changed';
  constructor(
    readonly upserts: LibraryEntryNode[],
    readonly removeIds?: string[]
  ) {}
}
