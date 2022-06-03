import { User } from '../models';

export class ChangeAuthenticationFlag {
  static readonly type = '[Auth] Change Authentication Flag';
  constructor(readonly isAuthenticated: boolean) {}
}

export class ProfileUpdated {
  static readonly type = '[Auth] Profile Updated';
  constructor(readonly name: string, readonly phone: string) {}
}

export class LoadProfile {
  static readonly type = '[Auth] Load Profile';
}

export class RebuildPermissions {
  static readonly type = '[Auth] Rebuild Permissions';
}
