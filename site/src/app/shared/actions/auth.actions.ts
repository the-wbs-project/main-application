export class ChangeAuthenticationFlag {
  static readonly type = '[Auth] Change Authentication Flag';
  constructor(public readonly isAuthenticated: boolean) {}
}

export class ProfileUpdated {
  static readonly type = '[Auth] Profile Updated';
  constructor(public readonly name: string, public readonly phone: string) {}
}
