import { Member, Organization } from '@wbs/core/models';

export class InitiateOrganizations {
  static readonly type = '[Membership] Load';
  constructor(readonly organizations: Organization[]) {}
}

export class ChangeOrganization {
  static readonly type = '[Membership] Change';
  constructor(readonly organization: Organization) {}
}

export class UpdateMembers {
  static readonly type = '[Membership] Update';
  constructor(readonly members: Member[]) {}
}

export class RefreshMembers {
  static readonly type = '[Membership] Refresh Members';
}
