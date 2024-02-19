import { LibraryEntryNode, LibraryEntryVersion } from '@wbs/core/models';

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
