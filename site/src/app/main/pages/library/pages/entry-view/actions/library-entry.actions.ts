
export class VerifyEntry {
    static readonly type = '[Library Entry] Verify';
    constructor(readonly owner: string, readonly entryId: string) {}
  }
  
  export class SetEntry {
    static readonly type = '[Library Entry] Set';
    constructor(readonly owner: string, readonly entryId: string) {}
  }
  