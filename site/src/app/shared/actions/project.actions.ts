export class VerifyProject {
  static readonly type = '[Project] Verify';
  constructor(readonly projectId: string) {}
}
export class VerifyDeleteReasons {
  static readonly type = '[Project] Delete Reasons';
}
