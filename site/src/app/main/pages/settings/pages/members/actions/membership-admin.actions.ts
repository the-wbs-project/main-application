import { Member } from '@wbs/core/models';

export class LoadInvitations {
  static readonly type = '[Membership Admin] Load Invitations';
  constructor(readonly org: string) {}
}

export class RemoveMemberFromOrganization {
  static readonly type = '[Membership Admin] Remove Member';
  constructor(readonly memberId: string) {}
}

export class UpdateMemberRoles {
  static readonly type = '[Membership Admin] Update Member Roles';
  constructor(
    readonly member: Member,
    readonly toAdd: string[],
    readonly toRemove: string[]
  ) {}
}

export class SendInvites {
  static readonly type = '[Membership Admin] Send Invites';
  constructor(readonly emails: string[], readonly roles: string[]) {}
}

export class CancelInvite {
  static readonly type = '[Membership Admin] Cancel Invite';
  constructor(readonly inviteId: string) {}
}
