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

export class TitleChanged {
  static readonly type = '[Library Entry] Title Changed';
  constructor(readonly title: string) {}
}

export class DescriptionChanged {
  static readonly type = '[Library Entry] Description Changed';
  constructor(readonly description: string) {}
}
