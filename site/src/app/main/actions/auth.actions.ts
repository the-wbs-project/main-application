export class RebuildPermissions {
  static readonly type = '[Auth] Rebuild Permissions';
}

export class ChangeProfileName {
  static readonly type = '[Auth] Change Profile Name';
  constructor(public readonly name: string) {}
}
