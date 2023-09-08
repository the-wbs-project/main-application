import { Organization } from '@wbs/core/models';

export class InitiateOrganizations {
  static readonly type = '[Membership] Load';
  constructor(
    readonly organizations: Organization[],
    readonly orgRoles: Record<string, string[]>
  ) {}
}

export class ChangeOrganization {
  static readonly type = '[Membership] Change';
  constructor(readonly organization: Organization) {}
}

export class RemoveMemberFromOrganization {
  static readonly type = '[Membership] Remove Member';
  constructor(readonly memberId: string) {}
}

export class UpdateMemberRoles {
  static readonly type = '[Membership] Update Member Roles';
  constructor(readonly memberId: string, readonly roles: string[]) {}
}

export class LoadInvitations {
  static readonly type = '[Membership] Load Invitations';
}
