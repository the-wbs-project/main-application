export class LoadProjectDiscussion {
  static readonly type = '[Project Discussion] Load';
  constructor(readonly organization: string, readonly threadId: string) {}
}
