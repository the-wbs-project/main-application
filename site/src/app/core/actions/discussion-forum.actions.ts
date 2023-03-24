export class LoadDiscussionForum {
  static readonly type = '[Discussion Forum] Load';
  constructor(readonly organization: string, readonly associateId: string) {}
}

export class CreateThread {
  static readonly type = '[Discussion Forum] Create Thread';
  constructor(readonly title: string, readonly message: string) {}
}
