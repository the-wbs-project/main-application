export class LoadUserData {
  static readonly type = '[User Admin] Load User Data';
  constructor(readonly force = false) {}
}

export class LoadInviteData {
  static readonly type = '[User Admin] Load Invite Data';
  constructor(readonly force = false) {}
}

export class SendInvite {
  static readonly type = '[User Admin] Send Invite';
  constructor(readonly email: string, readonly roles: string[]) {}
}

export class ResendInvite {
  static readonly type = '[User Admin] Resend Invite';
  constructor(readonly inviteId: string) {}
}

export class UpdateInvite {
  static readonly type = '[User Admin] Update Invite';
  constructor(readonly inviteId: string, readonly roles: string[]) {}
}

export class CancelInvite {
  static readonly type = '[User Admin] Cancel Invite';
  constructor(readonly inviteId: string) {}
}

export class ActivateUser {
  static readonly type = '[User Admin] Activate';
  constructor(readonly userId: string) {}
}

export class DeactivateUser {
  static readonly type = '[User Admin] Deactivate';
  constructor(readonly userId: string) {}
}
