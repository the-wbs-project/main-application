export class LoadDiscussionForum {
  static readonly type = '[Discussion Forum] Load';
  constructor(readonly organization: string, readonly associationId: string) {}
}

export class LoadPosts {
  static readonly type = '[Discussion Forum] Load Posts';
  constructor(readonly threadId: string) {}
}

export class CreateThread {
  static readonly type = '[Discussion Forum] Create Thread';
  constructor(readonly title: string, readonly message: string) {}
}

export class EditThread {
  static readonly type = '[Discussion Forum] Edit Thread';
  constructor(
    readonly id: string,
    readonly title: string,
    readonly message: string
  ) {}
}

export class CreateReply {
  static readonly type = '[Discussion Forum] Create Reply';
  constructor(readonly replyToId: string, readonly message: string) {}
}
