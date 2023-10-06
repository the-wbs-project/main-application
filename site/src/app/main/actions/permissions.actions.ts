export class UpdateOrganizationClaims {
  static readonly type = '[Permissions] Update Organization Claims';
  constructor(readonly id: string, readonly roles: string[]) {}
}

export class UpdateProjectClaims {
  static readonly type = '[Permissions] Update Project Claims';
  constructor(readonly id: string, readonly roles: string[]) {}
}
