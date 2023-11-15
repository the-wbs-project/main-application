import { ProjectApproval } from '@wbs/core/models';

export class InitiateApprovals {
  static readonly type = '[Project Approvals] Initiate';
  constructor(readonly owner: string, readonly projectId: string) {}
}

export class SetApprovalView {
  static readonly type = '[Project Approvals] Set View';
  constructor(readonly view: 'project' | 'task') {}
}

export class SetApproval {
  static readonly type = '[Project Approvals] Set';
  constructor(
    readonly approval?: ProjectApproval,
    readonly childrenIds?: string[]
  ) {}
}

export class ApprovalChanged {
  static readonly type = '[Project Approvals] Changed';
  constructor(readonly isApproved: boolean, readonly childrenToo: boolean) {}
}

export class SendApprovalMessage {
  static readonly type = '[Project Approvals] Send Message';
  constructor(readonly author: string, readonly message: string) {}
}
